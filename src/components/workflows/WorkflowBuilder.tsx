/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useState, useRef, useMemo, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection,
  MarkerType,
  BackgroundVariant,
  ReactFlowInstance,
  Handle,
  Position
} from 'reactflow';
import { 
  Globe, 
  Cpu, 
  Mail, 
  Webhook, 
  Search, 
  MousePointer2, 
  FileText, 
  Plus,
  X,
  GripVertical,
  Circle,
  Hash,
  Loader2,
  GitBranch,
  Play,
  Sparkles,
  UserCheck,
  Eye,
  Zap,
  ArrowRight,
  MessageSquare,
  Send,
  Shield,
  Clock,
  HardDrive,
  Terminal
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import 'reactflow/dist/style.css';
import { WorkflowStep, WorkflowEdge } from '../../types/agent';
import { GlassCard } from '../common/GlassCard';

const ICON_MAP: Record<string, any> = {
  Globe, Cpu, Mail, Webhook, Search, MousePointer2, FileText, Circle, Hash, GitBranch, Zap, UserCheck, Eye, Clock, Shield, HardDrive, Terminal
};

const AVAILABLE_TOOLS = [
  { group: 'Browser', items: [
    { type: 'action', label: 'Navigate to URL', icon: 'Globe' },
    { type: 'action', label: 'Click Element', icon: 'MousePointer2' },
    { type: 'action', label: 'Search Google', icon: 'Search' },
  ]},
  { group: 'Intelligence', items: [
    { type: 'action', label: 'AI Summarize', icon: 'Cpu' },
    { type: 'action', label: 'Extract Entities', icon: 'FileText' },
    { type: 'condition', label: 'Intent Filter', icon: 'Cpu' },
  ]},
  { group: 'Logic', items: [
    { type: 'logic', label: 'Condition (IF)', icon: 'GitBranch' },
    { type: 'logic', label: 'Parallel Split', icon: 'Zap' },
    { type: 'logic', label: 'Wait/Delay', icon: 'Clock' },
    { type: 'logic', label: 'Human Approval', icon: 'UserCheck' },
  ]},
  { group: 'Communication', items: [
    { type: 'output', label: 'Send Email', icon: 'Mail' },
    { type: 'output', label: 'Webhook POST', icon: 'Webhook' },
  ]},
];

interface WorkflowBuilderProps {
  initialSteps: WorkflowStep[];
  initialEdges: WorkflowEdge[];
  onSave?: (steps: WorkflowStep[], edges: WorkflowEdge[]) => void;
}

// Custom Node Component
const WorkflowNode = ({ data }: any) => {
  const Icon = ICON_MAP[data.icon] || Circle;
  const hasPrerequisites = data.prerequisites && data.prerequisites.length > 0;
  const isRunning = data.executionStatus === 'running';
  const isSuccess = data.executionStatus === 'success';
  const isAwaitingApproval = data.executionStatus === 'awaiting_approval';
  
  return (
    <div className={`
      bg-[#1F2937] text-[#E5E7EB] border rounded-lg p-3 w-[180px] shadow-xl group transition-all relative
      ${isRunning ? 'border-emerald-500 ring-2 ring-emerald-500/20 scale-105' : 'border-[#374151]'}
      ${isSuccess ? 'border-emerald-500/50' : ''}
      ${isAwaitingApproval ? 'border-amber-500 ring-2 ring-amber-500/30' : ''}
      hover:border-accent
    `}>
      <Handle type="target" position={Position.Top} className="!bg-accent !border-none !w-2 !h-2" />
      
      <div className="flex items-center justify-between mb-2">
        <div className={`text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-full border flex items-center gap-1 ${
          isRunning 
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
            : isSuccess ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            : isAwaitingApproval ? 'bg-amber-500/20 text-amber-500 border-amber-500/30 animate-pulse'
            : hasPrerequisites ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
            : 'bg-emerald-500/50 text-emerald-100 border-emerald-500/20'
        }`}>
          {isRunning && <Loader2 size={6} className="animate-spin" />}
          {isRunning ? 'Running' : isSuccess ? 'Done' : isAwaitingApproval ? 'Approving' : hasPrerequisites ? 'Waiting' : 'Ready'}
        </div>
        <div className="text-[7px] text-text-dim opacity-40 font-mono">
          #{data.type === 'trigger' ? 'INIT' : 'STEP'}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded bg-surface-lighter shrink-0 ${isAwaitingApproval ? 'text-amber-500' : 'text-accent'}`}>
          <Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold truncate leading-tight">{data.label}</p>
          <p className="text-[9px] text-text-dim truncate uppercase opacity-60 tracking-tighter">
            {data.type || 'Action'}
          </p>
        </div>
      </div>

      {isAwaitingApproval && (
        <div className="mt-3 pt-3 border-t border-border-dim/30 flex gap-2">
           <button 
             onClick={(e) => { e.stopPropagation(); data.onStatusChange?.(data.id, 'success'); }}
             className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded text-[8px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:translate-y-0.5 transition-all"
           >
             Approve
           </button>
           <button 
             onClick={(e) => { e.stopPropagation(); data.onStatusChange?.(data.id, 'failed'); }}
             className="flex-1 py-1.5 bg-rose-500 hover:bg-rose-400 text-white rounded text-[8px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 active:translate-y-0.5 transition-all"
           >
             Reject
           </button>
        </div>
      )}

      {hasPrerequisites && !isAwaitingApproval && (
        <div className="mt-2 pt-2 border-t border-border-dim/30">
          <p className="text-[8px] font-bold text-accent uppercase tracking-tighter mb-1.5 opacity-80 flex items-center gap-1">
            <GitBranch size={8} /> Needs Completion Of:
          </p>
          <div className="flex flex-wrap gap-1">
            {data.prerequisites.map((label: string, i: number) => (
              <span key={i} className="px-1.5 py-0.5 bg-surface-lighter rounded text-[7px] text-text-dim border border-border-dim/50 truncate max-w-full italic">
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="!bg-accent !border-none !w-2 !h-2" />
    </div>
  );
};

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ initialSteps, initialEdges, onSave }) => {
  const [editingNode, setEditingNode] = useState<any>(null);
  const [editorTab, setEditorTab] = useState<'config' | 'mapping'>('config');
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [showMagic, setShowMagic] = useState(false);
  const [magicPrompt, setMagicPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [observerNode, setObserverNode] = useState<any>(null);

  const nodeTypes = useMemo(() => ({ workflowNode: WorkflowNode }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Initialize nodes and edges
  useEffect(() => {
    setNodes(initialSteps.map(s => ({
      id: s.id,
      type: 'workflowNode',
      position: s.position,
      data: { 
        label: s.label, 
        icon: s.icon || 'Circle',
        type: s.type,
        config: s.config || {},
        prerequisites: []
      },
    })));

    setEdges(initialEdges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      animated: true,
      style: { stroke: '#6366F1', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6366F1' },
    })));
  }, [initialSteps, initialEdges, setNodes, setEdges]);

  // Sync dependencies when edges or node labels change
  useEffect(() => {
    setNodes((nds) => 
      nds.map((node) => {
        const incomingEdges = edges.filter(e => e.target === node.id);
        const prerequisites = incomingEdges.map(e => {
          const sourceNode = nds.find(n => n.id === e.source);
          return sourceNode?.data.label || 'Unknown Step';
        });

        // Only update if prerequisites labels have actually changed to avoid unnecessary re-renders
        if (JSON.stringify(node.data.prerequisites) === JSON.stringify(prerequisites)) {
          return node;
        }
        
        return {
          ...node,
          data: {
            ...node.data,
            prerequisites
          }
        };
      })
    );
  }, [edges, setNodes, nodes.map(n => n.data.label).join(',')]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#6366F1' } }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    if (isRunning) {
      setObserverNode({ ...node });
    } else {
      setEditingNode({ ...node });
      setEditorTab('config');
    }
  }, [isRunning]);

  const handleSaveNode = () => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === editingNode.id ? { ...editingNode } : node
      )
    );
    setEditingNode(null);
  };

  const handleSave = useCallback(() => {
    if (!onSave) return;
    
    setIsSaving(true);
    
    // Map internal ReactFlow nodes/edges back to our domain types
    const savedSteps: WorkflowStep[] = nodes.map(node => ({
      id: node.id,
      type: node.data.type || 'action',
      label: node.data.label,
      icon: node.data.icon,
      position: node.position,
      config: node.data.config || {}
    }));

    const savedEdges: WorkflowEdge[] = edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target
    }));

    // Simulate API delay
    setTimeout(() => {
      onSave(savedSteps, savedEdges);
      setIsSaving(false);
    }, 800);
  }, [nodes, edges, onSave]);

  const handleRunSimulation = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setObserverNode(null);

    const sortedNodes = [...nodes].sort((a, b) => a.position.x - b.position.x);
    
    // Reset all nodes to idle
    setNodes(nds => nds.map(n => ({...n, data: {...n.data, executionStatus: 'idle'}})));

    for (const node of sortedNodes) {
      // Set current node to running
      setNodes(nds => nds.map(n => n.id === node.id ? { ...n, data: { ...n.data, executionStatus: 'running' }} : n));
      
      // Detailed simulation logs
      const mockLogs = [
        "Initializing component environment...",
        `Checking prerequisites for ${node.data.label}...`,
        "Prerequisites satisfied. Starting logic execution.",
        "Querying global memory for relevant context...",
        "Applying variable mappings for inputs."
      ];
      
      const mockThoughts = [
        `I need to process the input data for ${node.data.label}.`,
        "Wait, the previous step's output looks valid. Proceeding.",
        "Checking if any edge cases exist for this task...",
        "Selecting optimal strategy for execution."
      ];

      // Update node data with logs/thoughts for observer
      setNodes(nds => nds.map(n => n.id === node.id ? { ...n, data: { ...n.data, logs: mockLogs, thoughts: mockThoughts }} : n));

      if (node.data.label === 'Human Approval') {
         setNodes(nds => nds.map(n => n.id === node.id ? { ...n, data: { ...n.data, executionStatus: 'awaiting_approval' }} : n));
         // Simulation waits for user action or continues after delay for mock purposes
         // In a real system, this loop would block until status !== awaiting_approval
         await new Promise(r => setTimeout(r, 4000));
         setNodes(nds => nds.map(n => n.id === node.id ? { ...n, data: { ...n.data, executionStatus: 'success' }} : n));
      } else {
         await new Promise(r => setTimeout(r, 2000));
         setNodes(nds => nds.map(n => n.id === node.id ? { ...n, data: { ...n.data, executionStatus: 'success' }} : n));
      }
    }
    
    setIsRunning(false);
  }, [nodes, isRunning, setNodes]);

  const handleMagicGenerate = async () => {
    if (!magicPrompt) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a JSON workflow structure for the prompt: "${magicPrompt}". 
        Available types: trigger, action, logic, output.
        Available icons: Mail, Search, Database, Globe, Zap, Cpu, MessageSquare, Shield, Clock, HardDrive, GitBranch, UserCheck, Eye.
        Respond ONLY with a JSON object containing { nodes: Array<{id, type, label, icon, position: {x, y}}>, edges: Array<{id, source, target}> }.
        Balance the positions starting from {x: 100, y: 100} and spreading horizontally.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              nodes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    type: { type: Type.STRING },
                    label: { type: Type.STRING },
                    icon: { type: Type.STRING },
                    position: {
                      type: Type.OBJECT,
                      properties: {
                        x: { type: Type.NUMBER },
                        y: { type: Type.NUMBER }
                      }
                    }
                  }
                }
              },
              edges: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    source: { type: Type.STRING },
                    target: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      if (result.nodes) {
        setNodes(result.nodes.map((n: any) => ({
          ...n,
          type: 'workflowNode',
          data: { 
            ...n, 
            executionStatus: 'idle',
            onStatusChange: (nodeId: string, status: any) => {
               setNodes(prev => prev.map(item => item.id === nodeId ? { ...item, data: { ...item.data, executionStatus: status }} : item));
            }
          }
        })));
        setEdges(result.edges.map((e: any) => ({
          ...e,
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }
        })));
      }
      setShowMagic(false);
      setMagicPrompt('');
    } catch (error) {
      console.error("Magic generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const onDragStart = (event: React.DragEvent, nodeType: string, label: string, icon: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, label, icon }));
    event.dataTransfer.effectAllowed = 'move';
    
    // Create a ghost image for dragging
    const dragIcon = document.createElement('div');
    dragIcon.className = 'bg-accent text-white px-3 py-2 rounded shadow-xl text-[10px] font-bold fixed top-[-100px]';
    dragIcon.innerText = label;
    document.body.appendChild(dragIcon);
    event.dataTransfer.setDragImage(dragIcon, 0, 0);
    setTimeout(() => document.body.removeChild(dragIcon), 0);
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const dataStr = event.dataTransfer.getData('application/reactflow');

      if (!dataStr || !reactFlowBounds || !reactFlowInstance) return;

      const { label, icon, type } = JSON.parse(dataStr);
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `node-${Date.now()}`,
        type: 'workflowNode',
        position,
        data: { label, icon, type, config: {} },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const addNode = (label: string, icon: string, type: string) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'workflowNode',
      position: { x: Math.random() * 200, y: Math.random() * 200 },
      data: { label, icon, type, config: {} },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div className="h-full w-full bg-black/20 rounded-xl border border-border-dim overflow-hidden relative flex" ref={reactFlowWrapper}>
      {/* Tool Selection Palette */}
      <div className="w-64 bg-surface border-r border-border-dim z-50 flex flex-col shrink-0">
        <div className="p-4 border-b border-border-dim flex justify-between items-center bg-surface-lighter/30">
           <div className="flex items-center gap-2">
              <Plus size={16} className="text-accent" />
              <h3 className="font-bold text-xs uppercase tracking-widest text-text-main">Nodes Palette</h3>
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
          <button 
            onClick={() => setShowMagic(true)}
            className="w-full mb-4 py-3 px-4 bg-gradient-to-br from-indigo-600 to-accent rounded-xl border border-white/10 flex items-center gap-3 active:scale-95 transition-all shadow-lg shadow-indigo-600/20 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
               <Sparkles size={18} className="text-white animate-pulse" />
            </div>
            <div className="text-left">
               <p className="text-[11px] font-black text-white uppercase tracking-wider">Magic Generator</p>
               <p className="text-[9px] text-indigo-100/70 font-medium">Auto-build with AI</p>
            </div>
          </button>

          {AVAILABLE_TOOLS.map((group) => (
            <div key={group.group}>
              <h4 className="text-[9px] font-bold text-text-dim uppercase tracking-[0.2em] mb-3 opacity-60">{group.group}</h4>
              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const ToolIcon = ICON_MAP[item.icon] || Circle;
                  return (
                    <div
                      key={item.label}
                      draggable
                      onDragStart={(e) => onDragStart(e, item.type, item.label, item.icon)}
                      onClick={() => addNode(item.label, item.icon, item.type)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg border border-border-dim/50 bg-surface-lighter/20 hover:bg-surface-lighter hover:border-accent/30 transition-all text-left group cursor-grab active:cursor-grabbing shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                         <div className="p-1.5 rounded-md bg-surface border border-border-dim text-text-dim group-hover:text-accent group-hover:border-accent/20 transition-all">
                            <ToolIcon size={13} />
                         </div>
                         <span className="text-[11px] font-semibold text-text-main group-hover:text-white transition-colors">{item.label}</span>
                      </div>
                      <GripVertical size={12} className="text-text-dim opacity-30 group-hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          <div className="mt-8 p-4 bg-accent/5 border border-accent/10 rounded-xl">
             <p className="text-[10px] text-accent font-medium leading-relaxed">
               <span className="font-bold block mb-1">💡 Pro Tip</span>
               Drag nodes onto the canvas or click them to place them randomly. Connect them by dragging from handles.
             </p>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Background color="#333" gap={20} variant={BackgroundVariant.Dots} />
          <Controls className="!bg-surface !border-border-dim fill-text-main shadow-2xl" showInteractive={false} />
        </ReactFlow>

        {/* Node Editor Modal */}
        {editingNode && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-surface border border-border-dim w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-border-dim flex justify-between items-center bg-surface-lighter/30">
                  <div className="flex gap-4">
                     <button 
                       onClick={() => setEditorTab('config')}
                       className={`text-xs font-bold uppercase tracking-widest pb-1 border-b-2 transition-all ${editorTab === 'config' ? 'border-accent text-white' : 'border-transparent text-text-dim'}`}
                     >
                       Configure
                     </button>
                     <button 
                       onClick={() => setEditorTab('mapping')}
                       className={`text-xs font-bold uppercase tracking-widest pb-1 border-b-2 transition-all ${editorTab === 'mapping' ? 'border-accent text-white' : 'border-transparent text-text-dim'}`}
                     >
                       Data Mapping
                     </button>
                  </div>
                  <button onClick={() => setEditingNode(null)} className="text-text-dim hover:text-white transition-colors">
                     <X size={18} />
                  </button>
              </div>

              <div className="p-6 space-y-6 flex-1 min-h-0 overflow-y-auto scrollbar-hide">
                 {editorTab === 'config' ? (
                   <>
                     <div>
                        <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-1.5 block">Step Label</label>
                        <input 
                          type="text" 
                          value={editingNode.data.label}
                          onChange={(e) => setEditingNode({...editingNode, data: {...editingNode.data, label: e.target.value}})}
                          className="w-full bg-surface-lighter border border-border-dim rounded-lg px-3 py-2 text-xs text-text-main focus:outline-none focus:border-accent transition-colors"
                        />
                     </div>

                     <div>
                        <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-1.5 block">Select Icon</label>
                        <div className="grid grid-cols-5 gap-2">
                           {Object.keys(ICON_MAP).map(iconName => {
                             const IconComp = ICON_MAP[iconName];
                             return (
                               <button
                                 key={iconName}
                                 onClick={() => setEditingNode({...editingNode, data: {...editingNode.data, icon: iconName}})}
                                 className={`p-3 rounded-lg border transition-all flex items-center justify-center ${
                                   editingNode.data.icon === iconName 
                                     ? 'bg-accent/15 border-accent text-accent' 
                                     : 'bg-surface-lighter border-border-dim text-text-dim hover:border-text-dim/50'
                                 }`}
                               >
                                 <IconComp size={18} />
                               </button>
                             );
                           })}
                        </div>
                     </div>

                     <div>
                        <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-1.5 block">Description / Notes</label>
                        <textarea 
                          rows={3}
                          value={editingNode.data.config?.notes || ''}
                          onChange={(e) => setEditingNode({...editingNode, data: {...editingNode.data, config: {...editingNode.data.config, notes: e.target.value}}})}
                          className="w-full bg-surface-lighter border border-border-dim rounded-lg px-3 py-2 text-xs text-text-main focus:outline-none focus:border-accent transition-colors resize-none"
                          placeholder="Add step documentation..."
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-1.5 block">Retry Limit</label>
                            <input 
                              type="number" 
                              min={0}
                              max={5}
                              value={editingNode.data.config?.retries || 0}
                              onChange={(e) => setEditingNode({...editingNode, data: {...editingNode.data, config: {...editingNode.data.config, retries: parseInt(e.target.value) || 0}}})}
                              className="w-full bg-surface-lighter border border-border-dim rounded-lg px-3 py-2 text-xs text-text-main focus:outline-none focus:border-accent"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-1.5 block">Timeout (s)</label>
                            <input 
                              type="number" 
                              min={1}
                              value={editingNode.data.config?.timeout || 30}
                              onChange={(e) => setEditingNode({...editingNode, data: {...editingNode.data, config: {...editingNode.data.config, timeout: parseInt(e.target.value) || 30}}})}
                              className="w-full bg-surface-lighter border border-border-dim rounded-lg px-3 py-2 text-xs text-text-main focus:outline-none focus:border-accent"
                            />
                        </div>
                     </div>
                   </>
                 ) : (
                   <div className="space-y-6">
                      <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl">
                        <p className="text-[10px] text-accent font-medium leading-relaxed">
                          Define how data flows from previous steps into this component's inputs.
                        </p>
                      </div>

                      {editingNode.data.prerequisites && editingNode.data.prerequisites.length > 0 ? (
                        <div className="space-y-4">
                           {['input_data', 'context', 'metadata'].map(inputKey => (
                             <div key={inputKey}>
                                <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-1.5 block">
                                   Mapping for: <span className="text-white">{inputKey}</span>
                                </label>
                                <select 
                                  value={editingNode.data.config?.mappings?.[inputKey] || ''}
                                  onChange={(e) => setEditingNode({
                                    ...editingNode, 
                                    data: {
                                      ...editingNode.data, 
                                      config: {
                                        ...editingNode.data.config, 
                                        mappings: {
                                          ...(editingNode.data.config?.mappings || {}),
                                          [inputKey]: e.target.value
                                        }
                                      }
                                    }
                                  })}
                                  className="w-full bg-surface-lighter border border-border-dim rounded-lg px-3 py-2 text-xs text-text-main focus:outline-none focus:border-accent appearance-none cursor-pointer"
                                >
                                   <option value="">Static Value (None)</option>
                                   {editingNode.data.prerequisites.map((parentLabel: string) => (
                                     <optgroup key={parentLabel} label={`Step: ${parentLabel}`}>
                                       <option value={`${parentLabel}.output`}>{parentLabel} Result</option>
                                       <option value={`${parentLabel}.status`}>{parentLabel} Status</option>
                                       <option value={`${parentLabel}.timestamp`}>{parentLabel} Exec Time</option>
                                     </optgroup>
                                   ))}
                                </select>
                             </div>
                           ))}
                        </div>
                      ) : (
                        <div className="py-12 text-center">
                           <GitBranch size={40} className="text-text-dim opacity-20 mx-auto mb-4" />
                           <p className="text-xs text-text-dim">Connect this node to a parent to enable data mapping.</p>
                        </div>
                      )}
                   </div>
                 )}
              </div>

              <div className="p-4 bg-surface-lighter/50 border-t border-border-dim flex justify-end gap-3">
                 <button 
                   onClick={() => setEditingNode(null)}
                   className="px-4 py-2 text-xs font-bold text-text-dim hover:text-text-main transition-colors"
                 >
                    Discard
                 </button>
                 <button 
                   onClick={handleSaveNode}
                   className="px-6 py-2 bg-accent text-white rounded-lg text-xs font-bold shadow-lg shadow-accent/20 hover:scale-[1.02] transition-all"
                 >
                    Apply Changes
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* Builder Toolbar */}
        <div className="absolute top-4 right-4 flex gap-2">
           <button 
             onClick={handleRunSimulation}
             disabled={isRunning || isSaving}
             className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
           >
              {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
              {isRunning ? 'Running...' : 'Test Run'}
           </button>
           <button 
             onClick={handleSave}
             disabled={isSaving || isRunning}
             className="px-4 py-2 bg-accent text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
           >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
              {isSaving ? 'Saving...' : 'Save Workflow'}
           </button>
        </div>

        {/* Magic Generator Modal */}
        {showMagic && (
          <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
             <div className="bg-surface border border-border-dim w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border-accent/20">
                <div className="p-8 space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                         <Sparkles size={24} className={isGenerating ? 'animate-spin' : 'animate-pulse'} />
                      </div>
                      <div>
                         <h3 className="text-xl font-bold">Magic Workflow Generator</h3>
                         <p className="text-sm text-text-dim">Describe your automation goal and AI will build it.</p>
                      </div>
                   </div>

                   <div className="relative">
                      <textarea 
                        value={magicPrompt}
                        onChange={(e) => setMagicPrompt(e.target.value)}
                        placeholder="e.g., Build a workflow that monitors Amazon for RTX 4090 prices below $1600 and sends a telegram alert."
                        className="w-full h-32 bg-surface-lighter border border-border-dim rounded-2xl p-4 text-sm text-text-main focus:outline-none focus:border-accent resize-none placeholder:opacity-30"
                        disabled={isGenerating}
                      />
                      <div className="absolute bottom-4 right-4 text-[10px] text-text-dim/40 font-mono">
                         POWERED BY GEMINI 3 FLASH
                      </div>
                   </div>

                   <div className="flex gap-3">
                      <button 
                        onClick={() => setShowMagic(false)}
                        disabled={isGenerating}
                        className="flex-1 py-3 bg-surface-lighter text-text-main rounded-xl text-xs font-bold hover:bg-border-dim transition-colors disabled:opacity-50"
                      >
                         Cancel
                      </button>
                      <button 
                        onClick={handleMagicGenerate}
                        disabled={isGenerating || !magicPrompt}
                        className="flex-3 py-3 bg-accent text-white rounded-xl text-xs font-bold shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                      >
                         {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                         {isGenerating ? 'Building your workflow...' : 'Generate Workflow'}
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Live Observer Panel */}
        {observerNode && (
          <div className="absolute bottom-4 left-4 w-80 z-50 animate-in slide-in-from-left-4 duration-300">
             <GlassCard className="border border-accent/30 bg-surface/90 backdrop-blur-xl overflow-hidden flex flex-col max-h-[400px]">
                <div className="p-4 border-b border-border-dim flex justify-between items-center bg-accent/5">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">Live Observer</h4>
                   </div>
                   <button onClick={() => setObserverNode(null)} className="text-text-dim hover:text-white">
                      <X size={14} />
                   </button>
                </div>
                
                <div className="p-4 space-y-4 overflow-y-auto scrollbar-hide">
                   <div>
                      <h5 className="text-[9px] font-bold text-text-dim uppercase mb-2">Selected Component</h5>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-lighter border border-border-dim/50">
                         <div className="p-2 rounded-lg bg-accent/10 text-accent">
                            {React.createElement(ICON_MAP[observerNode.data.icon] || Circle, { size: 16 })}
                         </div>
                         <div>
                            <p className="text-xs font-bold text-white leading-none mb-1">{observerNode.data.label}</p>
                            <span className="text-[9px] text-text-dim uppercase tracking-tighter">Status: {observerNode.data.executionStatus}</span>
                         </div>
                      </div>
                   </div>

                   <div>
                      <h5 className="text-[9px] font-bold text-text-dim uppercase mb-2 flex items-center gap-2">
                         <Eye size={10} className="text-accent" />
                         Agent Thoughts
                      </h5>
                      <div className="space-y-1.5">
                         {observerNode.data.thoughts?.map((thought: string, i: number) => (
                           <div key={i} className="text-[10px] text-text-main/80 italic leading-relaxed border-l-2 border-accent/30 pl-3">
                              "{thought}"
                           </div>
                         )) || <p className="text-[10px] text-text-dim opacity-50 italic">Waiting for reasoning logs...</p>}
                      </div>
                   </div>

                   <div className="pt-2">
                      <h5 className="text-[9px] font-bold text-text-dim uppercase mb-2 flex items-center gap-2">
                         <Terminal size={10} className="text-accent" />
                         Raw Step Logs
                      </h5>
                      <div className="bg-black/40 rounded-lg p-2 font-mono text-[9px] space-y-1 text-emerald-500/80">
                         {observerNode.data.logs?.map((log: string, i: number) => (
                           <div key={i} className="flex gap-2">
                              <span className="opacity-30">[{i+1}]</span>
                              <span>{log}</span>
                           </div>
                         )) || <p className="opacity-30 italic">No logs available for this state.</p>}
                      </div>
                   </div>
                </div>
             </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};
