import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  Users, 
  Cpu, 
  Terminal, 
  Share2, 
  Activity,
  ChevronRight,
  Circle,
  Hash,
  X
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';

interface SwarmMessage {
  id: string;
  sender: {
    name: string;
    role: string;
    avatar: string;
    color: string;
  };
  content: string;
  type: 'thought' | 'action' | 'delegation' | 'final' | 'consensus';
  timestamp: string;
  consensusData?: {
    totalAgents: number;
    agreeCount: number;
    disagreeCount: number;
    votes: { agentName: string; vote: 'agree' | 'disagree' }[];
  };
}

export const SwarmChat: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [messages, setMessages] = useState<SwarmMessage[]>([
    {
      id: '1',
      sender: { name: 'Lead Orchestrator', role: 'Coordinator', avatar: 'LO', color: 'text-indigo-400' },
      content: 'Received high-priority request: "Analyze market trend for Solar Energy in SE Asia". Initializing Swarm Protocol.',
      type: 'action',
      timestamp: '14:20:00'
    },
    {
      id: '2',
      sender: { name: 'Lead Orchestrator', role: 'Coordinator', avatar: 'LO', color: 'text-indigo-400' },
      content: 'Delegating [Data Extraction] to Crawler-Agent-Alpha. Priority: High.',
      type: 'delegation',
      timestamp: '14:20:05'
    },
    {
      id: '3',
      sender: { name: 'Crawler-Alpha', role: 'Data Extractor', avatar: 'CA', color: 'text-emerald-400' },
      content: 'Acknowledged. Scouring news syndicates and regional reports. Current queue: 14 sources.',
      type: 'thought',
      timestamp: '14:20:12'
    },
    {
      id: '4',
      sender: { name: 'Lead Orchestrator', role: 'Coordinator', avatar: 'LO', color: 'text-indigo-400' },
      content: 'Multi-agent analysis complete. Initiating Consensus Protocol for final validation.',
      type: 'action',
      timestamp: '14:20:45'
    },
    {
      id: '5',
      sender: { name: 'Swarm Consensus', role: 'System', avatar: 'SC', color: 'text-emerald-500' },
      content: 'Consensus Reached: Solar Energy market in SE Asia shows a 22% growth trajectory for Q3.',
      type: 'consensus',
      timestamp: '14:20:50',
      consensusData: {
        totalAgents: 4,
        agreeCount: 3,
        disagreeCount: 1,
        votes: [
          { agentName: 'Lead Orchestrator', vote: 'agree' },
          { agentName: 'Crawler-Alpha', vote: 'agree' },
          { agentName: 'Analyst-Omega', vote: 'agree' },
          { agentName: 'Summarizer-Bot', vote: 'disagree' }
        ]
      }
    }
  ]);

  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: SwarmMessage = {
      id: Date.now().toString(),
      sender: { name: 'Human Supervisor', role: 'Admin', avatar: 'HS', color: 'text-accent' },
      content: input,
      type: 'final',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInput('');
    
    // Auto-reply simulation
    setTimeout(() => {
      const reply: SwarmMessage = {
        id: (Date.now() + 1).toString(),
        sender: { name: 'Lead Orchestrator', role: 'Coordinator', avatar: 'LO', color: 'text-indigo-400' },
        content: 'Supervisor input received. Recalibrating mission parameters to include your request.',
        type: 'action',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] gap-6 p-6 overflow-hidden">
      {/* Active Agents Sidebar */}
      <div className="w-80 flex flex-col gap-6 h-full shrink-0">
         <GlassCard className="p-6 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-white flex items-center gap-2">
                  <Users size={18} className="text-accent" />
                  Active Swarm
               </h3>
               <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold animate-pulse uppercase">Live</span>
            </div>

            <div className="space-y-4 overflow-y-auto flex-1 scrollbar-hide">
               {[
                 { name: 'Lead Orchestrator', status: 'Managing', color: 'bg-indigo-500', icon: Cpu },
                 { name: 'Crawler-Alpha', status: 'Extracting', color: 'bg-emerald-500', icon: Terminal },
                 { name: 'Analyst-Omega', status: 'Waiting', color: 'bg-amber-500', icon: Activity },
                 { name: 'Summarizer-Bot', status: 'Idle', color: 'bg-slate-500', icon: Bot },
               ].map((agent, i) => (
                 <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    onClick={() => setSelectedAgent(agent)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer group ${selectedAgent?.name === agent.name ? 'bg-accent/10 border-accent/40 shadow-lg' : 'bg-surface-lighter/30 border-white/5 hover:border-accent/40'}`}
                 >
                    <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-xl ${agent.color} flex items-center justify-center text-white shadow-lg`}>
                          <agent.icon size={20} />
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{agent.name}</p>
                          <div className="flex items-center gap-1.5">
                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                             <span className="text-[10px] text-text-dim uppercase tracking-tighter">{agent.status}</span>
                          </div>
                       </div>
                       <ChevronRight size={14} className="text-text-dim opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                 </motion.div>
               ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border-dim/50">
               <div className="bg-accent/5 rounded-2xl p-4 border border-accent/10">
                  <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2 flex items-center gap-2">
                     <Share2 size={12} /> Resource Usage
                  </p>
                  <div className="space-y-2">
                     <div className="h-1.5 w-full bg-surface-lighter rounded-full overflow-hidden">
                        <div className="h-full w-[65%] bg-accent rounded-full" />
                     </div>
                     <div className="flex justify-between text-[10px] text-text-dim">
                        <span>CPU Compute</span>
                        <span className="text-text-main font-bold">65%</span>
                     </div>
                  </div>
               </div>
            </div>
         </GlassCard>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col gap-6 h-full">
         <GlassCard className="flex-1 flex flex-col relative overflow-hidden p-0 border-accent/20">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
               {messages.map((msg, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id} 
                    className={`flex gap-4 ${msg.sender.role === 'Admin' ? 'flex-row-reverse' : ''}`}
                  >
                     <div className={`w-10 h-10 rounded-2xl bg-surface-lighter border border-white/10 flex items-center justify-center font-black text-xs shrink-0 shadow-xl ${msg.sender.color}`}>
                        {msg.sender.avatar}
                     </div>
                     <div className={`max-w-[70%] space-y-1 ${msg.sender.role === 'Admin' ? 'items-end' : ''}`}>
                        <div className={`flex items-center gap-2 mb-1 ${msg.sender.role === 'Admin' ? 'flex-row-reverse' : ''}`}>
                           <span className="text-xs font-black text-white">{msg.sender.name}</span>
                           <span className="text-[9px] font-bold text-text-dim uppercase tracking-widest px-1.5 py-0.5 bg-surface-lighter/50 rounded">{msg.sender.role}</span>
                           <span className="text-[9px] text-text-dim opacity-40 font-mono tracking-tighter">{msg.timestamp}</span>
                        </div>
                        
                        <div className={`
                           p-4 rounded-3xl text-[13px] leading-relaxed shadow-sm
                           ${msg.sender.role === 'Admin' 
                              ? 'bg-accent text-white rounded-tr-none' 
                              : msg.type === 'delegation' 
                                 ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-tl-none font-medium italic'
                                 : msg.type === 'consensus'
                                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-tl-none'
                                    : 'bg-surface-lighter/50 border border-white/5 text-text-main rounded-tl-none'}
                        `}>
                           {msg.type === 'delegation' && <Hash size={12} className="inline mr-2 opacity-50" />}
                           {msg.content}
                           
                           {msg.type === 'consensus' && msg.consensusData && (
                              <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                                 <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-bold text-text-dim uppercase tracking-[0.2em]">Consensus Vote Result</p>
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-2 py-0.5 bg-emerald-500/10 rounded">Passed</span>
                                 </div>
                                 <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-surface-lighter border border-white/5">
                                    <div 
                                       className="h-full bg-emerald-500 transition-all duration-1000" 
                                       style={{ width: `${(msg.consensusData.agreeCount / msg.consensusData.totalAgents) * 100}%` }} 
                                    />
                                    <div 
                                       className="h-full bg-rose-500 transition-all duration-1000" 
                                       style={{ width: `${(msg.consensusData.disagreeCount / msg.consensusData.totalAgents) * 100}%` }} 
                                    />
                                 </div>
                                 <div className="grid grid-cols-2 gap-2">
                                    {msg.consensusData.votes.map((v, idx) => (
                                       <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                                          <span className="text-[9px] text-text-dim truncate">{v.agentName}</span>
                                          <div className={`w-1.5 h-1.5 rounded-full ${v.vote === 'agree' ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-rose-500 shadow-[0_0_5px_#f43f5e]'}`} />
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           )}
                           
                           {msg.type === 'thought' && (
                              <div className="mt-2 flex gap-1">
                                 {[1,2,3].map(j => <Circle key={j} size={4} className="fill-current animate-pulse opacity-40" />)}
                              </div>
                           )}
                        </div>
                     </div>
                  </motion.div>
               ))}
               <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-surface-lighter/30 border-t border-border-dim/50">
               <form onSubmit={handleSend} className="relative">
                  <input 
                     type="text" 
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     placeholder="Broadcast instructions to the swarm..."
                     className="w-full bg-surface-lighter border border-border-dim rounded-2xl px-6 py-4 pr-32 text-sm text-white focus:outline-none focus:border-accent transition-all placeholder:text-text-dim/40 shadow-inner"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                     <button type="button" className="p-2 text-text-dim hover:text-white transition-colors">
                        <Terminal size={18} />
                     </button>
                     <button 
                        type="submit"
                        className="px-6 py-2 bg-accent text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                     >
                        Broadcast
                        <Send size={14} />
                     </button>
                  </div>
               </form>
            </div>
         </GlassCard>
      </div>

      {/* Task Queue Sidebar */}
      <div className="w-80 flex flex-col gap-6 h-full shrink-0">
         <AnimatePresence mode="wait">
            {selectedAgent ? (
               <motion.div
                  key="inspector"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="h-full"
               >
                  <GlassCard className="p-6 flex flex-col h-full border-accent/30 relative">
                     <button 
                        onClick={() => setSelectedAgent(null)}
                        className="absolute top-4 right-4 p-1 rounded-lg bg-surface-lighter text-text-dim hover:text-white"
                     >
                        <X size={14} />
                     </button>
                     
                     <div className={`w-16 h-16 rounded-3xl ${selectedAgent.color} flex items-center justify-center text-white mb-4 shadow-xl`}>
                        <selectedAgent.icon size={32} />
                     </div>
                     
                     <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tight">{selectedAgent.name}</h3>
                     <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-6">{selectedAgent.status} Mode</p>
                     
                     <div className="space-y-6 flex-1 overflow-y-auto scrollbar-hide">
                        <div>
                           <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-2 flex items-center gap-1.5">
                              <Cpu size={12} /> Core Directive
                           </p>
                           <p className="text-xs text-text-main leading-relaxed italic">
                              "Optimizing for high-fidelity {selectedAgent.status.toLowerCase()} while maintaining strictly asynchronous communication protocols."
                           </p>
                        </div>

                        <div>
                           <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-2">Capabilities</p>
                           <div className="flex flex-wrap gap-2">
                              {['Web Search', 'JSON Extraction', 'Semantic Analysis', 'Tool Invocation'].map(tag => (
                                 <span key={tag} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[9px] text-text-dim">
                                    {tag}
                                 </span>
                              ))}
                           </div>
                        </div>

                        <div className="p-4 rounded-2x border border-dashed border-emerald-500/20 bg-emerald-500/5">
                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">System Health</p>
                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                               <span className="text-emerald-500/60">Memory: 14%</span>
                               <span className="text-emerald-500/60">Success: 99.8%</span>
                            </div>
                        </div>
                     </div>

                     <button className="w-full py-3 bg-surface-lighter hover:bg-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all mt-6">
                        Re-Initialize Agent
                     </button>
                  </GlassCard>
               </motion.div>
            ) : (
               <motion.div
                  key="queue"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="h-full"
               >
                  <GlassCard className="p-6 flex flex-col h-full border-dashed border-white/10 opacity-60">
                     <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                        <MessageSquare size={18} className="text-text-dim" />
                        Current Task Stack
                     </h3>
                     <div className="space-y-3">
                        {[
                          { title: 'Search News SE Asia', status: 'In Progress', id: 'T-102' },
                          { title: 'Extract Energy Trends', status: 'Pending', id: 'T-103' },
                          { title: 'Risk Assessment (PH)', status: 'Queued', id: 'T-104' },
                        ].map((t, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-surface-lighter/20 border border-white/5">
                             <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-mono text-text-dim">{t.id}</span>
                                <span className="text-[9px] font-black text-accent uppercase tracking-tighter">{t.status}</span>
                             </div>
                             <p className="text-xs font-bold text-white mb-1">{t.title}</p>
                          </div>
                        ))}
                     </div>
                     
                     <div className="mt-auto p-4 rounded-2xl bg-black/40 border border-white/5">
                        <p className="text-[10px] text-text-dim italic leading-relaxed">
                           "Swarm protocols ensure high fault tolerance. If an agent fails, tasks are automatically re-routed."
                        </p>
                     </div>
                  </GlassCard>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
};
