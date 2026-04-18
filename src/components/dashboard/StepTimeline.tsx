/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, Circle, Loader2, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_STEPS } from '../../constants/mockData';
import { GlassCard } from '../common/GlassCard';

export interface StepTimelineProps {
  isIntervening: boolean;
}

export const StepTimeline: React.FC<StepTimelineProps> = ({ isIntervening }) => {
  return (
    <GlassCard className="h-full">
      <div className="panel-header-base">
        <span>Execution Flow</span>
        <span className="text-accent">{MOCK_STEPS.length}/7</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-0 scrollbar-hide">
        {MOCK_STEPS.map((step, idx) => {
          const isLast = idx === MOCK_STEPS.length - 1;
          const isActive = step.status === 'running';

          return (
            <div key={step.id} className="relative flex gap-3 pb-6 group">
              {!isLast && (
                <div className="absolute left-[11px] top-[24px] bottom-0 w-[1px] bg-border-dim group-last:hidden" />
              )}
              
              <div className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shrink-0 z-10
                ${isActive ? 'bg-accent border-accent text-white' : 'bg-surface-lighter border-border-dim text-text-dim'}
              `}>
                {step.number}
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <h4 className="text-[12px] font-semibold text-text-main leading-tight mb-1">
                  {step.action}
                </h4>
                <p className="text-[11px] text-text-dim line-clamp-2">
                  {step.details || 'Awaiting execution parameters...'}
                </p>
              </div>
            </div>
          );
        })}

        {/* Dynamic Intervention Step */}
        {isIntervening && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative flex gap-3 pb-6 border-l-2 border-rose-500/30 ml-[10px] pl-3"
          >
             <div className="w-6 h-6 absolute -left-[14px] top-0 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                <AlertCircle size={14} />
             </div>
             <div className="flex-1 min-w-0">
                <h4 className="text-[12px] font-bold text-rose-500 leading-tight mb-1">
                  Awaiting Intervention
                </h4>
                <p className="text-[11px] text-rose-400 capitalize">
                  The agent encountered a CAPTCHA. Please solve it in the browser window to continue.
                </p>
             </div>
          </motion.div>
        )}
      </div>
    </GlassCard>
  );
};
