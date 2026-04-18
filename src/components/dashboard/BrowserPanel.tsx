/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GlassCard } from '../common/GlassCard';

export interface BrowserPanelProps {
  isIntervening: boolean;
  onToggleControl: () => void;
}

export const BrowserPanel: React.FC<BrowserPanelProps> = ({ isIntervening, onToggleControl }) => {
  return (
    <GlassCard className="flex flex-col h-full bg-surface border-border-dim border">
      {/* Browser Bar */}
      <div className="h-9 bg-surface-lighter flex items-center px-3 gap-2 shrink-0 border-b border-border-dim">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <div className="flex-1 bg-surface h-6 rounded flex items-center px-3 ml-3 border border-border-dim/20">
          <span className="text-[11px] text-text-dim truncate">https://arxiv.org/list/cs.AI/recent</span>
        </div>
        
        {/* Intervention Toggle */}
        <button 
          onClick={onToggleControl}
          className={`
            h-6 px-3 rounded text-[10px] font-bold uppercase tracking-wider transition-all
            ${isIntervening 
              ? 'bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]' 
              : 'bg-white/5 text-text-dim hover:bg-white/10'
            }
          `}
        >
          {isIntervening ? 'Relinquish Control' : 'Take Control'}
        </button>
      </div>

      {/* Viewport Area */}
      <div className="flex-1 bg-[#f0f0f0] relative overflow-hidden">
        {/* Mock Content */}
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-no-repeat"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23ddd"/><path d="M10 20h80v10H10zm0 20h50v10H10zm0 20h80v20H10z" fill="%23bbb"/></svg>')` }}
        />
        
        {/* Agent Overlay (Only if not intervening) */}
        {!isIntervening ? (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_0_15px_rgba(99,102,241,0.15),0_0_0_1px_#6366F1]" />
        ) : (
          <div className="absolute inset-0 bg-accent/5 backdrop-blur-[2px] transition-all cursor-crosshair flex items-center justify-center">
            <div className="bg-surface/90 border border-accent/30 p-4 rounded-xl shadow-2xl text-center max-w-[280px]">
              <p className="text-accent text-[11px] font-bold uppercase tracking-widest mb-2">User Intervention Mode</p>
              <p className="text-text-main text-xs">You now have direct control over the browser session. The agent is paused.</p>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
