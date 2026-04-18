/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Database, BrainCircuit, Hash, Star } from 'lucide-react';
import { MOCK_MEMORY } from '../../constants/mockData';
import { GlassCard } from '../common/GlassCard';

export const MemoryPanel: React.FC = () => {
  return (
    <GlassCard className="h-full">
      <div className="panel-header-base">
        <span>Agent Memory</span>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3 overflow-y-auto scrollbar-hide">
        {MOCK_MEMORY.map((item) => (
          <div 
            key={item.id} 
            className="p-2.5 rounded-md bg-surface-lighter border border-border-dim flex flex-col gap-1"
          >
            <span className="text-[10px] uppercase font-semibold text-text-dim tracking-wider">{item.type}</span>
            <span className="text-[13px] font-bold text-text-main truncate uppercase">{item.key}</span>
          </div>
        ))}
        {/* Extra mock cards to fill space */}
        <div className="p-2.5 rounded-md bg-surface-lighter border border-border-dim flex flex-col gap-1 opacity-50">
            <span className="text-[10px] uppercase font-semibold text-text-dim tracking-wider">Variables</span>
            <span className="text-[13px] font-bold text-text-main uppercase">8 defined</span>
        </div>
        <div className="p-2.5 rounded-md bg-surface-lighter border border-border-dim flex flex-col gap-1 opacity-50">
            <span className="text-[10px] uppercase font-semibold text-text-dim tracking-wider">Embedding</span>
            <span className="text-[13px] font-bold text-text-main uppercase">1,536d</span>
        </div>
      </div>
    </GlassCard>
  );
};
