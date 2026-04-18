/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, Clock, RefreshCw, Hash, Cpu } from 'lucide-react';
import { CURRENT_TASK } from '../../constants/mockData';
import { GlassCard } from '../common/GlassCard';

export interface StatusPanelProps {
  isIntervening: boolean;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ isIntervening }) => {
  return (
    <GlassCard className="p-4 justify-center" glow={isIntervening}>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <span className="text-text-dim">Current Task ID:</span>
            <span className="font-mono text-text-main font-bold">#AX-2094</span>
          </div>
          {isIntervening && (
            <span className="bg-rose-500/10 text-rose-500 text-[9px] px-1.5 py-0.5 rounded border border-rose-500/20 font-bold uppercase tracking-tighter animate-pulse">
              Intervention Required
            </span>
          )}
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-text-dim">Uptime:</span>
          <span className="text-text-main font-medium">00:12:44</span>
        </div>
        <div className="h-[6px] w-full bg-surface-lighter rounded-full mt-2 overflow-hidden">
          <div 
            className="h-full bg-accent rounded-full shadow-[0_0_10px_var(--color-accent)] transition-all duration-1000" 
            style={{ 
              width: `${CURRENT_TASK.progress}%`,
              backgroundColor: isIntervening ? '#f43f5e' : '#6366f1'
            }} 
          />
        </div>
      </div>
    </GlassCard>
  );
};
