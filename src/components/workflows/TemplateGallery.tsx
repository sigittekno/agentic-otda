import React from 'react';
import { WORKFLOW_TEMPLATES } from '../../constants/mockData';
import { Workflow } from '../../types/agent';
import { GlassCard } from '../common/GlassCard';
import { GitBranch, Plus, ArrowRight, Zap, Cpu, Search } from 'lucide-react';

interface TemplateGalleryProps {
  onSelect: (template: Workflow) => void;
  onClose: () => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-md p-6 animate-in fade-in duration-300">
      <div className="bg-surface border border-border-dim w-full max-w-5xl h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-border-dim flex justify-between items-center bg-surface-lighter/30">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Workflow Templates</h2>
            <p className="text-sm text-text-dim">Start faster with pre-configured automation patterns.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-lighter rounded-full text-text-dim transition-colors"
          >
            <Plus className="rotate-45" size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 scrollbar-hide">
          {WORKFLOW_TEMPLATES.map((tmpl) => (
            <GlassCard 
              key={tmpl.id}
              className="p-6 flex flex-col h-full border border-border-dim hover:border-accent group transition-all cursor-pointer relative overflow-hidden"
              onClick={() => onSelect(tmpl)}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <GitBranch size={80} />
              </div>

              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                {tmpl.category === 'Automation' ? <Zap size={24} /> : tmpl.category === 'Intelligence' ? <Cpu size={24} /> : <Search size={24} />}
              </div>

              <div className="mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1 block">{tmpl.category}</span>
                <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors">{tmpl.name}</h3>
              </div>
              
              <p className="text-sm text-text-dim flex-1 mb-8">{tmpl.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-border-dim/50">
                <span className="text-[10px] text-text-dim font-medium">{tmpl.steps.length} steps configured</span>
                <div className="flex items-center gap-2 text-xs font-bold text-accent group-hover:translate-x-1 transition-transform">
                  Use Template <ArrowRight size={14} />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
        
        <div className="p-6 border-t border-border-dim bg-surface-lighter/20 flex justify-center">
           <button 
             onClick={() => onSelect({ id: `wf-${Date.now()}`, name: 'Blank Workflow', description: 'Start from scratch', status: 'draft', steps: [], edges: [] })}
             className="px-8 py-3 bg-white text-black rounded-2xl text-sm font-bold shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
           >
              <Plus size={18} />
              Create Blank Workflow
           </button>
        </div>
      </div>
    </div>
  );
};
