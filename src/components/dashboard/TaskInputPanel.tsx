/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GlassCard } from '../common/GlassCard';

export const TaskInputPanel: React.FC = () => {
  const [input, setInput] = React.useState('Search for the top 5 trending AI research papers on arXiv from the last 7 days and summarize their findings into a markdown table.');

  return (
    <GlassCard className="flex-row items-center p-4 gap-4 h-full" glow>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe the task you want the agent to perform..."
        spellCheck="false"
        className="flex-grow bg-bg border border-border-dim rounded-lg p-3 text-text-main font-sans text-sm resize-none h-[60px] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
      />
      <button className="bg-accent text-white border-none py-2.5 px-5 rounded-md font-semibold text-[13px] cursor-pointer shrink-0 hover:bg-accent/90 transition-colors whitespace-nowrap">
        Execute
      </button>
    </GlassCard>
  );
};
