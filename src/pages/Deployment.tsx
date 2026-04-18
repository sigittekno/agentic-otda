import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Clock, 
  ExternalLink, 
  Play, 
  Settings2, 
  ShieldCheck, 
  Globe,
  Trash2,
  Copy,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';

interface Trigger {
  id: string;
  name: string;
  workflow: string;
  type: 'cron' | 'webhook';
  config: string;
  status: 'active' | 'paused';
  url?: string;
}

export const Deployment: React.FC = () => {
  const [triggers, setTriggers] = useState<Trigger[]>([
    { 
      id: '1', 
      name: 'Daily Research Report', 
      workflow: 'Auto-Analyst', 
      type: 'cron', 
      config: '0 9 * * *', 
      status: 'active' 
    },
    { 
      id: '2', 
      name: 'Shopify Order Handler', 
      workflow: 'Fulfillment Bot', 
      type: 'webhook', 
      config: 'POST only', 
      status: 'active',
      url: 'https://api.agentic.ai/hooks/63wv-wra-ze3-x9'
    }
  ]);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">DEPLOYMENT & TRIGGERS</h1>
          <p className="text-text-dim mt-1">Manage autonomous workflow execution and API integrations.</p>
        </div>
        <button className="px-6 py-2.5 bg-accent text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-accent/20 flex items-center gap-2">
          <Zap size={14} />
          Create New Trigger
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Statistics Bar */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Triggers', value: '12', icon: Zap, color: 'text-accent' },
            { label: 'Total Executions', value: '842', icon: Play, color: 'text-emerald-500' },
            { label: 'Avg Latency', value: '142ms', icon: Clock, color: 'text-amber-500' },
            { label: 'Uptime', value: '99.98%', icon: ShieldCheck, color: 'text-indigo-500' },
          ].map((stat, i) => (
            <GlassCard key={i} className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-2xl bg-surface-lighter ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-black text-white">{stat.value}</p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Triggers List */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-sm font-bold text-text-dim uppercase tracking-[0.2em] px-1">Configured Triggers</h2>
          {triggers.map((trigger) => (
            <GlassCard key={trigger.id} className="p-6 group hover:border-accent/40 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className={`p-4 rounded-3xl ${trigger.type === 'cron' ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-500'} border border-white/5`}>
                    {trigger.type === 'cron' ? <Clock size={24} /> : <Globe size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white leading-none">{trigger.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter border ${
                        trigger.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-text-dim/10 text-text-dim border-text-dim/20'
                      }`}>
                        {trigger.status}
                      </span>
                    </div>
                    <p className="text-xs text-text-dim flex items-center gap-1.5">
                      Workflow: <span className="text-text-main font-semibold underline decoration-accent/30">{trigger.workflow}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button className="p-2 rounded-lg bg-surface-lighter text-text-dim hover:text-white transition-colors">
                      <Settings2 size={16} />
                   </button>
                   <button className="p-2 rounded-lg bg-surface-lighter text-rose-500/50 hover:text-rose-500 transition-colors">
                      <Trash2 size={16} />
                   </button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border-dim/50 grid grid-cols-2 gap-4">
                <div>
                   <p className="text-[9px] font-bold text-text-dim uppercase tracking-widest mb-2">Configuration</p>
                   <div className="bg-black/20 rounded-xl p-3 font-mono text-xs text-accent">
                      {trigger.config}
                   </div>
                </div>
                {trigger.url && (
                  <div>
                    <p className="text-[9px] font-bold text-text-dim uppercase tracking-widest mb-2">Endpoint URL</p>
                    <div className="bg-black/20 rounded-xl p-2.5 flex items-center justify-between gap-2 overflow-hidden border border-white/5">
                       <span className="text-[10px] text-text-dim truncate font-mono">{trigger.url}</span>
                       <button 
                         onClick={() => copyToClipboard(trigger.url!, trigger.id)}
                         className="p-1.5 rounded-lg bg-surface-lighter text-text-dim hover:text-accent transition-all shrink-0 active:scale-90"
                       >
                         {copiedId === trigger.id ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                       </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-surface bg-gray-800 flex items-center justify-center text-[8px] font-bold">
                        AG
                      </div>
                    ))}
                    <div className="w-6 h-6 rounded-full border-2 border-surface bg-surface-lighter flex items-center justify-center text-[7px] text-text-dim">
                       +2
                    </div>
                 </div>
                 <div className="flex items-center gap-4 text-[10px] font-medium text-text-dim">
                    <span className="flex items-center gap-1"><AlertCircle size={10} /> 0 Errors</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> Last run: 14m ago</span>
                 </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Sidebar Help/Health */}
        <div className="lg:col-span-4 space-y-6">
           <GlassCard className="p-6 bg-gradient-to-br from-indigo-600/10 to-transparent border-indigo-500/20">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                 <ShieldCheck size={18} className="text-indigo-400" />
                 System Health
              </h3>
              <div className="space-y-4">
                 {[
                   { label: 'Cron Scheduler', status: 'Healthy' },
                   { label: 'Webhook Ingest', status: 'Healthy' },
                   { label: 'Event Bus', status: 'Stable' },
                 ].map((s, i) => (
                   <div key={i} className="flex justify-between items-center text-xs">
                      <span className="text-text-dim">{s.label}</span>
                      <span className="text-emerald-500 font-bold tracking-tighter">{s.status}</span>
                   </div>
                 ))}
              </div>
           </GlassCard>

           <GlassCard className="p-6 overflow-hidden relative group cursor-pointer border-dashed">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                 <ExternalLink size={64} />
              </div>
              <h3 className="font-bold text-white mb-2">Integration Docs</h3>
              <p className="text-xs text-text-dim mb-4 leading-relaxed">
                 Learn how to connect your Agentic workflows to Discord, Slack, or custom API endpoints using our secret-aware infrastructure.
              </p>
              <button className="text-xs font-bold text-accent uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                 Read Documentation <ExternalLink size={12} />
              </button>
           </GlassCard>
        </div>
      </div>
    </div>
  );
};
