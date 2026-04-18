/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MOCK_LOGS } from '../../constants/mockData';
import { GlassCard } from '../common/GlassCard';

export const LogViewer: React.FC = () => {
  return (
    <GlassCard className="h-full bg-black font-mono">
      <div className="panel-header-base !bg-black border-b border-[#222]">
        <span>Terminal Logs</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 text-[11px] leading-relaxed scrollbar-hide">
        {MOCK_LOGS.map((log) => {
          const isInfo = log.level === 'info';
          
          return (
            <div key={log.id} className="flex gap-2 mb-1">
               <span className="text-[#999] shrink-0">[{log.timestamp}]</span>
               <span className={`uppercase font-bold shrink-0 ${isInfo ? 'text-accent' : 'text-amber-500'}`}>{log.level}</span>
               <span className="text-[#71d358]">{log.message}</span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
