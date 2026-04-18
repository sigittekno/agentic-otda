/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Play, MoreVertical, Edit3, Trash2, GitBranch, Loader2, Zap, ArrowRight, X } from 'lucide-react';
import { MOCK_WORKFLOWS } from '../constants/mockData';
import { Workflow, WorkflowStep, WorkflowEdge } from '../types/agent';
import { GlassCard } from '../components/common/GlassCard';
import { WorkflowBuilder } from '../components/workflows/WorkflowBuilder';
import { TemplateGallery } from '../components/workflows/TemplateGallery';

export const Workflows: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'dashboard' | 'builder'>('list');
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [workflows, setWorkflows] = useState<Workflow[]>(MOCK_WORKFLOWS);
  const [runningWorkflowId, setRunningWorkflowId] = useState<string | null>(null);
  const [workflowToDelete, setWorkflowToDelete] = useState<Workflow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const handleRunWorkflow = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setRunningWorkflowId(id);
    
    // Simulate execution
    setTimeout(() => {
      setWorkflows(prev => prev.map(wf => 
        wf.id === id ? { ...wf, lastRun: 'Just now', status: 'active' } : wf
      ));
      setRunningWorkflowId(null);
    }, 3000);
  };

  const handleCreateWorkflow = () => {
    setShowGallery(true);
  };

  const handleSelectTemplate = (template: Workflow) => {
    const newWorkflow: Workflow = {
      ...template,
      id: `wf-${Date.now()}`,
      status: 'draft',
      lastRun: 'Never',
    };
    setSelectedWorkflow(newWorkflow);
    setViewMode('builder');
    setShowGallery(false);
  };

  const handleSaveWorkflow = (steps: WorkflowStep[], edges: WorkflowEdge[]) => {
    if (!selectedWorkflow) return;
    
    setWorkflows(prev => prev.map(wf => 
      wf.id === selectedWorkflow.id ? { ...wf, steps, edges, status: 'active' } : wf
    ));
    
    // Also update selected workflow to reflect changes in current view if needed
    setSelectedWorkflow(prev => prev ? { ...prev, steps, edges, status: 'active' } : null);
  };

  const handleConfirmDelete = () => {
    if (!workflowToDelete) return;
    
    setIsDeleting(true);
    // Simulate API call
    setTimeout(() => {
      setWorkflows(prev => prev.filter(wf => wf.id !== workflowToDelete.id));
      setWorkflowToDelete(null);
      setIsDeleting(false);
    }, 1000);
  };

  if (selectedWorkflow && viewMode === 'builder') {
    return (
      <div className="h-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <button 
                onClick={() => setViewMode('dashboard')}
                className="p-2 hover:bg-surface-lighter rounded-lg text-text-dim transition-colors"
              >
                <Plus className="rotate-45" size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold">{selectedWorkflow.name}</h1>
                <p className="text-xs text-text-dim">{selectedWorkflow.description}</p>
              </div>
           </div>
           <div className="flex gap-2">
              <button 
                onClick={(e) => handleRunWorkflow(e, selectedWorkflow.id)}
                disabled={runningWorkflowId === selectedWorkflow.id}
                className="px-4 py-2 bg-accent/20 border border-accent/30 text-accent rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-accent hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {runningWorkflowId === selectedWorkflow.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Play size={14} />
                )}
                {runningWorkflowId === selectedWorkflow.id ? 'Executing...' : 'Run Workflow'}
              </button>
           </div>
        </div>
        
        <div className="flex-1 min-h-0">
          <WorkflowBuilder 
            initialSteps={selectedWorkflow.steps} 
            initialEdges={selectedWorkflow.edges} 
            onSave={handleSaveWorkflow}
          />
        </div>
      </div>
    );
  }

  if (selectedWorkflow && viewMode === 'dashboard') {
    return (
      <div className="h-full flex flex-col gap-6 animate-in fade-in duration-300 overflow-y-auto pr-2 scrollbar-hide">
        <div className="flex items-center justify-between sticky top-0 bg-[#0B0F1A]/80 backdrop-blur-md z-10 py-2">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => { setSelectedWorkflow(null); setViewMode('list'); }}
                className="p-2 hover:bg-surface-lighter rounded-lg text-text-dim transition-colors"
              >
                <Plus className="rotate-45" size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">{selectedWorkflow.name}</h1>
                <p className="text-xs text-text-dim font-mono opacity-50 uppercase tracking-widest">{selectedWorkflow.id}</p>
              </div>
           </div>
           <div className="flex gap-2">
              <button 
                onClick={() => setViewMode('builder')}
                className="px-6 py-2 bg-accent text-white rounded-lg text-sm font-bold shadow-lg shadow-accent/20 hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                <Edit3 size={16} />
                Edit Design
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 space-y-6">
              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4">
                 {[
                   { label: 'Success Rate', value: '98.2%', icon: Zap, color: 'text-emerald-500' },
                   { label: 'Avg Duration', value: '42s', icon: Loader2, color: 'text-accent' },
                   { label: 'Total Runs', value: selectedWorkflow.history?.length || 0, icon: Play, color: 'text-amber-500' },
                 ].map((stat, i) => (
                   <GlassCard key={i} className="p-4 flex flex-col gap-2 bg-surface-lighter/10">
                      <div className="flex items-center justify-between">
                         <stat.icon size={16} className={stat.color} />
                         <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{stat.label}</span>
                      </div>
                      <p className="text-xl font-bold">{stat.value}</p>
                   </GlassCard>
                 ))}
              </div>

              {/* History Table */}
              <GlassCard className="p-6 bg-surface-lighter/5">
                 <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
                    Execution History
                    <span className="px-2 py-0.5 bg-accent/10 text-accent text-[10px] rounded-full">Recent</span>
                 </h3>
                 <div className="space-y-3">
                    {selectedWorkflow.history?.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl border border-border-dim/50 bg-surface-lighter/10 hover:bg-surface-lighter/30 transition-colors group">
                         <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${entry.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                               {entry.status === 'success' ? <Zap size={16} /> : <X size={16} />}
                            </div>
                            <div>
                               <p className="text-xs font-bold text-white">Cloud Execution</p>
                               <p className="text-[10px] text-text-dim">{new Date(entry.timestamp).toLocaleString()}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-6 text-right">
                            <div className="hidden sm:block">
                               <p className="text-[10px] font-bold text-text-dim uppercase opacity-50 capitalize">Duration</p>
                               <p className="text-xs text-white">{entry.duration}</p>
                            </div>
                            <div className="hidden sm:block">
                               <p className="text-[10px] font-bold text-text-dim uppercase opacity-50 capitalize">Steps</p>
                               <p className="text-xs text-white">{entry.stepsExecuted} nodes</p>
                            </div>
                            <button className="p-2 text-text-dim hover:text-white transition-colors">
                              <ArrowRight size={14} />
                            </button>
                         </div>
                      </div>
                    )) || (
                      <div className="py-12 text-center text-text-dim text-xs">No execution history available.</div>
                    )}
                 </div>
              </GlassCard>
           </div>

           <div className="space-y-6">
              {/* Scheduling Card */}
              <GlassCard className="p-6 border border-accent/20 bg-accent/5">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-white">
                       <Loader2 size={16} className="text-accent" />
                       Scheduling
                    </h3>
                    <div className="w-10 h-5 bg-accent/20 rounded-full relative p-1 cursor-pointer">
                       <div className="w-3 h-3 bg-accent rounded-full absolute right-1"></div>
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="p-4 bg-surface-lighter/50 rounded-xl border border-border-dim/50">
                       <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-2">Current Rule</p>
                       <p className="text-xs text-white flex items-center gap-2">
                          <Play size={12} className="text-emerald-500" />
                          Repeat {selectedWorkflow.schedule?.frequency || 'daily'} at 8:00 AM
                       </p>
                    </div>

                    <div className="space-y-2">
                       <p className="text-[10px] font-bold text-text-dim uppercase mb-2">Next Scheduled Run</p>
                       <div className="bg-accent/5 p-3 rounded-lg border border-accent/10 flex items-center justify-between">
                          <span className="text-[11px] text-accent font-medium">{selectedWorkflow.schedule?.nextRun || 'Calculating...'}</span>
                          <Zap size={12} className="text-accent animate-pulse" />
                       </div>
                    </div>

                    <button className="w-full py-2.5 bg-surface-lighter hover:bg-border-dim rounded-xl text-[11px] font-bold text-text-main transition-all mt-2">
                       Adjust Schedule
                    </button>
                 </div>
              </GlassCard>

              <GlassCard className="p-6 bg-amber-500/5 border border-amber-500/10">
                 <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-3">Monitoring Info</h3>
                 <p className="text-[11px] text-text-main leading-relaxed mb-4">
                    This workflow is currently monitoring 4 external data sources. Real-time updates are throttled to 15-minute intervals.
                 </p>
                 <button className="text-[10px] font-bold text-amber-500 uppercase hover:underline">View Active Monitors</button>
              </GlassCard>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <GitBranch className="text-accent" />
            Workflows
          </h1>
          <p className="text-sm text-text-dim">Design and manage multi-step agent automation flows.</p>
        </div>
        <button 
          onClick={handleCreateWorkflow}
          className="bg-accent text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-accent/20 hover:scale-[1.02] transition-transform"
        >
          <Plus size={16} />
          Create Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 scrollbar-hide">
        {workflows.map((wf) => {
          const isRunning = runningWorkflowId === wf.id;
          
          return (
            <GlassCard 
              key={wf.id} 
              className={`p-5 group cursor-pointer border border-border-dim bg-surface-lighter/50 transition-all ${
                isRunning ? 'border-accent ring-1 ring-accent/20' : 'hover:border-accent/40'
              }`} 
              onClick={() => { setSelectedWorkflow(wf); setViewMode('dashboard'); }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                  isRunning ? 'bg-accent text-white border-accent' : 'bg-accent/10 border-accent/20 text-accent'
                }`}>
                  {isRunning ? <Loader2 size={20} className="animate-spin" /> : <GitBranch size={20} />}
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                    wf.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-text-dim/10 text-text-dim border border-text-dim/20'
                  }`}>
                    {wf.status}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setWorkflowToDelete(wf);
                    }}
                    className="p-1 text-text-dim hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button className="p-1 text-text-dim hover:text-text-main" onClick={(e) => { e.stopPropagation(); }}>
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-1 group-hover:text-accent transition-colors">{wf.name}</h3>
              <p className="text-xs text-text-dim line-clamp-2 mb-4 h-8">{wf.description}</p>

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-border-dim">
                <div className="flex flex-col gap-0.5 text-[10px] text-text-dim">
                   <span className="uppercase font-bold tracking-tighter text-[9px] opacity-60">Last execution</span>
                   <div className="flex items-center gap-1">
                      <Play size={10} className={wf.lastRun === 'Just now' ? 'text-emerald-500' : ''} />
                      <span>{wf.lastRun}</span>
                   </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => handleRunWorkflow(e, wf.id)}
                    disabled={isRunning}
                    className={`
                      px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all
                      ${isRunning 
                        ? 'bg-accent/10 text-accent border border-accent/20 opacity-70' 
                        : 'bg-accent text-white hover:shadow-lg hover:shadow-accent/20'
                      }
                    `}
                  >
                    {isRunning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
                    {isRunning ? 'Running' : 'Run'}
                  </button>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                     <Edit3 size={14} className="text-text-dim hover:text-text-main transition-colors" />
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Template Gallery */}
      {showGallery && (
        <TemplateGallery 
          onSelect={handleSelectTemplate} 
          onClose={() => setShowGallery(false)} 
        />
      )}

      {/* Delete Confirmation Modal */}
      {workflowToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
           <div className="bg-surface border border-border-dim w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 text-center">
                 <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                    <Trash2 size={32} />
                 </div>
                 <h3 className="text-lg font-bold mb-2">Delete Workflow?</h3>
                 <p className="text-sm text-text-dim mb-6">
                    Are you sure you want to delete <span className="text-text-main font-semibold">"{workflowToDelete.name}"</span>? 
                    This action cannot be undone and all configured steps will be lost.
                 </p>
                 
                 <div className="flex gap-3">
                    <button 
                      onClick={() => setWorkflowToDelete(null)}
                      disabled={isDeleting}
                      className="flex-1 px-4 py-2.5 bg-surface-lighter text-text-main rounded-xl text-xs font-bold hover:bg-border-dim transition-colors disabled:opacity-50"
                    >
                       Cancel
                    </button>
                    <button 
                      onClick={handleConfirmDelete}
                      disabled={isDeleting}
                      className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                       {isDeleting ? <Loader2 size={14} className="animate-spin" /> : null}
                       {isDeleting ? 'Deleting...' : 'Delete Forever'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
