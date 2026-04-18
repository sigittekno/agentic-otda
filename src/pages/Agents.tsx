import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Plus, 
  Search, 
  Brain, 
  Zap, 
  Cpu, 
  Globe, 
  Code, 
  Terminal, 
  Settings2, 
  Trash2, 
  Activity,
  UserPlus,
  ArrowRight,
  X,
  Target,
  MessageSquareText,
  ShieldCheck,
  ChevronRight,
  Bot
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  model: string;
  capabilities: string[];
  status: 'active' | 'idle' | 'training';
  tasksCompleted: number;
}

export const Agents: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Lead Orchestrator',
      role: 'Project Manager',
      avatar: 'LO',
      color: 'bg-indigo-500',
      model: 'Gemini 1.5 Pro',
      capabilities: ['Reasoning', 'Delegation', 'Planning'],
      status: 'active',
      tasksCompleted: 428
    },
    {
      id: '2',
      name: 'Crawler-Alpha',
      role: 'Data Miner',
      avatar: 'CA',
      color: 'bg-emerald-500',
      model: 'Gemini 2.0 Flash',
      capabilities: ['Web Search', 'HTML Parsing', 'Summarization'],
      status: 'active',
      tasksCompleted: 1205
    },
    {
      id: '3',
      name: 'Analyst-Omega',
      role: 'Strategist',
      avatar: 'AO',
      color: 'bg-amber-500',
      model: 'Gemini 1.5 Pro',
      capabilities: ['Market Analysis', 'Sentiment', 'Forecasting'],
      status: 'idle',
      tasksCompleted: 89
    }
  ]);

  const [showCreate, setShowCreate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const [newAgent, setNewAgent] = useState({
    name: '',
    role: '',
    model: 'Gemini 2.0 Flash',
    prompt: ''
  });

  const handleCreate = () => {
    if (!newAgent.name || !newAgent.role) return;
    const agent: Agent = {
      id: Date.now().toString(),
      name: newAgent.name,
      role: newAgent.role,
      avatar: newAgent.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      color: 'bg-accent',
      model: newAgent.model,
      capabilities: ['General AI', 'Context Awareness'],
      status: 'active',
      tasksCompleted: 0
    };
    setAgents([...agents, agent]);
    setShowCreate(false);
    setNewAgent({ name: '', role: '', model: 'Gemini 2.0 Flash', prompt: '' });
  };

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">AGENT ROSTER</h1>
          <p className="text-text-dim mt-1">Configure persona, intelligence models, and toolkits for your swarm.</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="px-6 py-2.5 bg-accent text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-accent/20 flex items-center gap-2"
        >
          <UserPlus size={14} />
          Forge New Agent
        </button>
      </div>

      {/* Stats and Search */}
      <div className="flex gap-4 items-center shrink-0">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" />
          <input 
            type="text" 
            placeholder="Search agents by name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-lighter/50 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-all placeholder:text-text-dim/50"
          />
        </div>
        <div className="flex items-center gap-2 bg-surface-lighter/30 p-1 rounded-xl border border-white/5">
           {[
             { label: 'Total', value: agents.length },
             { label: 'Active', value: agents.filter(a => a.status === 'active').length },
             { label: 'Idle', value: agents.filter(a => a.status === 'idle').length },
           ].map((s, i) => (
             <div key={i} className="px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="text-text-dim">{s.label}:</span>
                <span className="text-white">{s.value}</span>
             </div>
           ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredAgents.map((agent) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={agent.id}
              >
                <GlassCard 
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-6 cursor-pointer group transition-all relative overflow-hidden ${selectedAgent?.id === agent.id ? 'border-accent shadow-2xl shadow-accent/10 ring-1 ring-accent/30' : 'hover:border-white/20 border-white/5'}`}
                >
                  {/* Status Indicator */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/40 border border-white/5 text-[8px] font-black uppercase tracking-widest">
                    <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-text-dim'}`} />
                    {agent.status}
                  </div>

                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${agent.color} flex items-center justify-center text-white text-xl font-black shadow-xl shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                      {agent.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white leading-tight mb-0.5">{agent.name}</h3>
                      <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">{agent.role}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[11px] text-text-dim bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                      <Brain size={12} className="text-text-dim" />
                      <span className="font-medium">{agent.model}</span>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-1.5">
                        {agent.capabilities.map((cap, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-surface text-[9px] font-bold text-text-dim border border-white/5">
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-[10px] text-text-dim">
                        <Activity size={10} />
                        <span>{agent.tasksCompleted} Missions completed</span>
                      </div>
                      <button className="p-1.5 rounded-lg bg-surface-lighter text-text-dim hover:text-white transition-colors">
                        <Settings2 size={14} />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Detail Overlay / Sidebar */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed top-0 right-0 w-[450px] h-screen z-[150] shadow-2xl"
          >
            <div className="h-full bg-surface border-l border-border-dim p-8 flex flex-col gap-8 relative overflow-y-auto scrollbar-hide shadow-[-40px_0_60px_rgba(0,0,0,0.5)]">
              <button 
                onClick={() => setSelectedAgent(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-surface-lighter text-text-dim hover:text-white transition-colors border border-white/5"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center pt-8">
                <div className={`w-28 h-28 rounded-3xl ${selectedAgent.color} flex items-center justify-center text-white text-4xl font-black mb-6 shadow-2xl ring-4 ring-white/5`}>
                  {selectedAgent.avatar}
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">{selectedAgent.name}</h2>
                <p className="text-xs font-bold text-accent uppercase tracking-[0.3em] mt-2 mb-8">{selectedAgent.role}</p>
                
                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="p-4 rounded-2xl bg-surface-lighter/50 border border-white/5 text-left">
                    <p className="text-[9px] font-bold text-text-dim uppercase tracking-widest mb-1">Intelligence</p>
                    <p className="text-xs font-black text-white">{selectedAgent.model}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-lighter/50 border border-white/5 text-left">
                    <p className="text-[9px] font-bold text-text-dim uppercase tracking-widest mb-1">Latency</p>
                    <p className="text-xs font-black text-emerald-500">Fast (42ms)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8 flex-1">
                <div>
                  <h4 className="text-[10px] font-bold text-text-dim uppercase tracking-[.3em] mb-4 flex items-center gap-2">
                    <Terminal size={12} className="text-accent" /> Brain Configuration
                  </h4>
                  <div className="bg-black/40 rounded-2xl p-6 border border-white/5 space-y-6">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-text-dim/60 uppercase">System Persona</p>
                      <p className="text-xs text-text-main leading-relaxed italic">
                        "You are a sophisticated {selectedAgent.role} specialized in large-scale data synthesis. Maintain a professional yet direct tone. Prioritize factual accuracy over creative flair."
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-text-dim/60 uppercase block">Active Skillset</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { icon: Globe, label: 'Real-time Web' },
                          { icon: Code, label: 'Code Sandbox' },
                          { icon: Target, label: 'Mission Focus' },
                          { icon: ShieldCheck, label: 'Truth Filter' }
                        ].map((skill, si) => (
                          <div key={si} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-lighter/50 border border-white/10 text-[10px] text-white">
                             <skill.icon size={12} className="text-accent" />
                             {skill.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                   <h4 className="text-[10px] font-bold text-text-dim uppercase tracking-[.3em] mb-4 flex items-center gap-2">
                    <Activity size={12} className="text-accent" /> Recent Brain Activity
                  </h4>
                  <div className="space-y-3">
                    {[
                      { time: '2m ago', action: 'Synthesized 14 regional reports', status: 'Success' },
                      { time: '14m ago', action: 'Handed off task to Crawler-Alpha', status: 'Delegated' },
                      { time: '1h ago', action: 'Memory consolidation process', status: 'Completed' }
                    ].map((log, li) => (
                      <div key={li} className="p-3 rounded-xl bg-surface-lighter/30 border border-white/5 flex items-center justify-between">
                         <div>
                            <p className="text-[11px] font-bold text-white">{log.action}</p>
                            <p className="text-[9px] text-text-dim">{log.time}</p>
                         </div>
                         <span className="text-[9px] font-black text-accent uppercase tracking-tighter">{log.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-3 shrink-0">
                <button className="py-3 px-4 rounded-xl bg-surface-lighter hover:bg-white/10 text-white font-bold text-xs uppercase transition-all flex items-center justify-center gap-2">
                  <Cpu size={14} /> Tune Model
                </button>
                <button className="py-3 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold text-xs uppercase border border-rose-500/20 transition-all flex items-center justify-center gap-2">
                  <Trash2 size={14} /> Decommission
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreate(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl"
            >
              <GlassCard className="p-10 border-accent/40 bg-surface shadow-2xl">
                 <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-accent rounded-2xl text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                          <Bot size={28} />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-white tracking-tight">FORGE NEW INTELLIGENCE</h3>
                          <p className="text-xs text-text-dim">Construct a specialized agent persona.</p>
                       </div>
                    </div>
                    <button onClick={() => setShowCreate(false)} className="text-text-dim hover:text-white p-2">
                       <X size={24} />
                    </button>
                 </div>

                 <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest pl-1">Agent Identity</label>
                          <input 
                            type="text" 
                            placeholder="e.g., Code-Master-9"
                            value={newAgent.name}
                            onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                            className="w-full bg-surface-lighter border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-accent transition-all"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest pl-1">Primary Role</label>
                          <input 
                            type="text" 
                            placeholder="e.g., Security Researcher"
                            value={newAgent.role}
                            onChange={(e) => setNewAgent({...newAgent, role: e.target.value})}
                            className="w-full bg-surface-lighter border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-accent transition-all"
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest pl-1">Cognitive Model</label>
                       <div className="grid grid-cols-2 gap-2">
                          {['Gemini 2.0 Flash', 'Gemini 1.5 Pro', 'OpenAI GPT-4o', 'Claude 3.5 Sonnet'].map(m => (
                             <button 
                                key={m}
                                onClick={() => setNewAgent({...newAgent, model: m})}
                                className={`py-3 px-4 rounded-xl border text-[10px] font-bold transition-all ${newAgent.model === m ? 'bg-accent text-white border-accent shadow-lg shadow-accent/30' : 'bg-surface-lighter text-text-dim border-white/5 hover:border-white/20'}`}
                             >
                                {m}
                             </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest pl-1">Prompt Preamble</label>
                       <textarea 
                         rows={4}
                         placeholder="Define the behavior, constraints, and expertise of this agent..."
                         value={newAgent.prompt}
                         onChange={(e) => setNewAgent({...newAgent, prompt: e.target.value})}
                         className="w-full bg-surface-lighter border border-white/10 rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:border-accent transition-all resize-none italic font-mono"
                       />
                    </div>

                    <button 
                       onClick={handleCreate}
                       className="w-full py-5 bg-accent text-white rounded-2xl text-sm font-black uppercase tracking-[0.3em] shadow-2xl shadow-accent/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
                    >
                       Initialize Agent Heartbeat
                       <ArrowRight size={18} />
                    </button>
                 </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
