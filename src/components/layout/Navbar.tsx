/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="h-[60px] bg-surface border-b border-border-dim px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search task history, agent logs, memory..."
            className="w-[320px] bg-bg border border-border-dim rounded-md py-2 px-3 text-xs text-text-dim focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
          ● System Online
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[13px] text-text-dim">dev_user_88</span>
          <div className="w-8 h-8 rounded-full bg-surface-lighter flex items-center justify-center text-text-main border border-border-dim">
            <User size={16} />
          </div>
        </div>
      </div>
    </header>
  );
};
