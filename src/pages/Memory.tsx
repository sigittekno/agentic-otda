import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { MOCK_MEMORY } from '../constants/mockData';
import { Search, Brain, Filter, HardDrive, Cpu, Clock, Trash2, ArrowRight } from 'lucide-react';
import { MemoryItem } from '../types/agent';

export const Memory: React.FC = () => {
  const [memory, setMemory] = useState<MemoryItem[]>(MOCK_MEMORY);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const filteredMemory = memory.filter(item => {
    const matchesSearch = item.key.toLowerCase().includes(search.toLowerCase()) || 
                         item.value.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'short-term': return <Clock size={16} className="text-amber-500" />;
      case 'long-term': return <HardDrive size={16} className="text-accent" />;
      case 'embedding': return <Brain size={16} className="text-emerald-500" />;
      default: return <Cpu size={16} className="text-purple-500" />;
    }
  };

  const handleDelete = (id: string) => {
    setMemory(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Brain className="text-accent" />
            Global Memory Browser
          </h1>
          <p className="text-sm text-text-dim">Inspect and manage the collective intelligence of your agents.</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" size={16} />
              <input 
                type="text" 
                placeholder="Search knowledge..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-surface-lighter border border-border-dim rounded-lg text-sm text-text-main focus:outline-none focus:border-accent w-64"
              />
           </div>
           <select 
             value={filter}
             onChange={(e) => setFilter(e.target.value)}
             className="bg-surface-lighter border border-border-dim rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-accent"
           >
              <option value="all">All Types</option>
              <option value="short-term">Short Term</option>
              <option value="long-term">Long Term</option>
              <option value="embedding">Intent/Context</option>
              <option value="fact">System Facts</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 scrollbar-hide flex-1">
        {filteredMemory.map((item) => (
          <GlassCard key={item.id} className="p-4 border border-border-dim hover:border-accent/40 transition-all flex flex-col gap-3 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-surface border border-border-dim">
                  {getIcon(item.type)}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim opacity-60">
                  {item.type}
                </span>
              </div>
              <button 
                onClick={() => handleDelete(item.id)}
                className="p-1 text-text-dim hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div>
              <h3 className="text-xs font-bold text-white mb-1">{item.key}</h3>
              <p className="text-xs text-text-dim line-clamp-3 bg-surface-lighter/30 p-2 rounded-lg border border-border-dim/30">
                {item.value}
              </p>
            </div>

            <div className="mt-auto pt-3 border-t border-border-dim flex items-center justify-between text-[10px]">
               <div className="flex flex-col gap-1">
                  <span className="text-text-dim uppercase tracking-tighter">Source</span>
                  <span className="text-accent font-bold">{item.source || 'Unknown'}</span>
               </div>
               <div className="text-right flex flex-col gap-1">
                  <span className="text-text-dim uppercase tracking-tighter">Relevance</span>
                  <span className="text-emerald-500 font-bold">{(item.relevance * 100).toFixed(0)}%</span>
               </div>
            </div>
          </GlassCard>
        ))}
      </div>
      
      <div className="p-4 bg-accent/5 border border-accent/10 rounded-2xl flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white">
               <Brain size={16} />
            </div>
            <p className="text-sm text-text-main font-medium">
               A total of <span className="text-accent font-bold">{memory.length}</span> items are currently indexed across the embedding space.
            </p>
         </div>
         <button className="text-xs font-bold text-accent flex items-center gap-2 hover:underline">
            Optimize Vector Store <ArrowRight size={14} />
         </button>
      </div>
    </div>
  );
};
