import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  Zap, 
  Users, 
  Cpu, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';

const TOKEN_DATA = [
  { name: 'Mon', tokens: 45000, cost: 2.1 },
  { name: 'Tue', tokens: 52000, cost: 2.5 },
  { name: 'Wed', tokens: 38000, cost: 1.8 },
  { name: 'Thu', tokens: 61000, cost: 3.2 },
  { name: 'Fri', tokens: 49000, cost: 2.3 },
  { name: 'Sat', tokens: 25000, cost: 1.2 },
  { name: 'Sun', tokens: 18000, cost: 0.9 },
];

const AGENT_PERFORMANCE = [
  { name: 'Orchestrator', success: 98, error: 2 },
  { name: 'Crawler', success: 92, error: 8 },
  { name: 'Analyst', success: 95, error: 5 },
  { name: 'Reporter', success: 99, error: 1 },
];

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444'];

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center sm:items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">PERFORMANCE & ANALYTICS</h1>
          <p className="text-text-dim mt-1">Real-time metrics on token consumption, agent efficiency, and ROI.</p>
        </div>
        <div className="flex bg-surface-lighter p-1 rounded-xl border border-border-dim">
           {['24h', '7d', '30d', 'All'].map(r => (
             <button 
               key={r}
               onClick={() => setTimeRange(r)}
               className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${timeRange === r ? 'bg-accent text-white shadow-lg' : 'text-text-dim hover:text-text-main'}`}
             >
                {r}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {[
           { label: 'Total Tokens', value: '288,402', change: '+12.5%', isUp: true, icon: Cpu },
           { label: 'Gemini Cost', value: '$13.92', change: '-2.1%', isUp: false, icon: DollarSign },
           { label: 'Success Rate', value: '96.2%', change: '+0.5%', isUp: true, icon: TrendingUp },
           { label: 'Active Sessions', value: '1,420', change: '+4.2%', isUp: true, icon: Activity },
         ].map((stat, i) => (
           <GlassCard key={i} className="p-6">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-3 rounded-2xl bg-surface-lighter text-accent">
                    <stat.icon size={20} />
                 </div>
                 <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${stat.isUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {stat.isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {stat.change}
                 </div>
              </div>
              <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
           </GlassCard>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Token Usage Chart */}
         <GlassCard className="lg:col-span-2 p-6 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
               <h3 className="font-bold text-white uppercase tracking-widest text-xs flex items-center gap-2">
                  <Activity size={16} className="text-accent" />
                  Token Consumption Overview
               </h3>
               <div className="flex items-center gap-4 text-[10px] text-text-dim">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent" /> Tokens</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Successes</span>
               </div>
            </div>
            <div className="flex-1 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={TOKEN_DATA}>
                    <defs>
                      <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.3} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#9CA3AF', fontSize: 10}} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#9CA3AF', fontSize: 10}} 
                    />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#111827', borderRadius: '12px', border: '1px solid #374151', fontSize: '12px'}}
                      itemStyle={{color: '#E5E7EB'}}
                    />
                    <Area type="monotone" dataKey="tokens" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorTokens)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </GlassCard>

         {/* Success Distribution */}
         <GlassCard className="p-6 h-[400px] flex flex-col">
            <h3 className="font-bold text-white uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
               <AlertCircle size={16} className="text-accent" />
               Agent Efficiency Rate
            </h3>
            <div className="flex-1 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={AGENT_PERFORMANCE} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" opacity={0.3} />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#E5E7EB', fontSize: 10, fontWeight: 'bold'}} 
                    />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{backgroundColor: '#111827', borderRadius: '12px', border: '1px solid #374151', fontSize: '10px'}}
                    />
                    <Bar dataKey="success" fill="#6366F1" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-4 pt-4 border-t border-border-dim/50 flex justify-between">
               <div>
                  <p className="text-[9px] text-text-dim font-bold uppercase mb-1">Top Failure Reason</p>
                  <p className="text-xs text-rose-500 font-bold">Incomplete Data Extraction</p>
               </div>
               <div className="text-right">
                  <p className="text-[9px] text-text-dim font-bold uppercase mb-1">Optimized Prompt</p>
                  <p className="text-xs text-emerald-500 font-bold">94% Effective</p>
               </div>
            </div>
         </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Optimization Tips */}
         <GlassCard className="p-8 border-accent/20 bg-accent/5 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Sparkles size={120} />
            </div>
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
               <Sparkles size={24} className="text-accent animate-pulse" />
               AI Optimization Insights
            </h3>
            <div className="space-y-4">
               {[
                 { title: 'Simplify Analyst-Omega Prompt', desc: 'Removing redundant context about historic prices can reduce token usage by 18% without affecting accuracy.', saving: 'Approx $2.40/mo' },
                 { title: 'Parallelize News Scraper', desc: 'Executing Crawler-Alpha steps in parallel for South East Asia regions could improve throughput by 42%.', saving: '3.2s reduction' },
                 { title: 'Identity Consolidation', desc: 'Identified overlapping personas between Lead Orchestrator and Agent Beta. Merging could save 12% compute cost.', saving: 'Moderate priority' },
               ].map((tip, i) => (
                 <div key={i} className="p-4 rounded-2xl bg-surface-lighter/50 border border-white/5 hover:border-accent/40 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="text-sm font-bold text-white">{tip.title}</h4>
                       <span className="text-[9px] font-black text-accent uppercase tracking-widest">{tip.saving}</span>
                    </div>
                    <p className="text-xs text-text-dim leading-relaxed">{tip.desc}</p>
                 </div>
               ))}
            </div>
         </GlassCard>

         {/* Cost History */}
         <GlassCard className="p-8">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
               <DollarSign size={24} className="text-emerald-500" />
               Billing & ROI Tracker
            </h3>
            <div className="space-y-6">
               <div className="p-6 rounded-3xl bg-surface-lighter flex flex-col items-center justify-center text-center">
                  <p className="text-xs font-bold text-text-dim uppercase tracking-widest mb-1">Est. Monthly Cost</p>
                  <p className="text-5xl font-black text-white">$42.15</p>
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                     <ArrowDownRight size={10} /> 8% cheaper than last month
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-border-dim/50">
                     <p className="text-[9px] font-bold text-text-dim uppercase tracking-widest mb-1">Compute Hours</p>
                     <p className="text-xl font-black text-white">412h</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-border-dim/50">
                     <p className="text-[9px] font-bold text-text-dim uppercase tracking-widest mb-1">API Requests</p>
                     <p className="text-xl font-black text-white">12.4K</p>
                  </div>
               </div>

               <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Export Financial Report
               </button>
            </div>
         </GlassCard>
      </div>
    </div>
  );
};
