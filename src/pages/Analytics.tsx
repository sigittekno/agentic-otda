import React, { useState } from 'react';
import { motion } from 'motion/react';
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
  Cell,
  LineChart,
  Line,
  Legend
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
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Target,
  Clock,
  Briefcase
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';

const TOKEN_DATA = [
  { name: 'Mon', tokens: 45000, cost: 2.1, forecast: 45000 },
  { name: 'Tue', tokens: 52000, cost: 2.5, forecast: 52000 },
  { name: 'Wed', tokens: 38000, cost: 1.8, forecast: 38000 },
  { name: 'Thu', tokens: 61000, cost: 3.2, forecast: 61000 },
  { name: 'Fri', tokens: 49000, cost: 2.3, forecast: 49000 },
  { name: 'Sat', tokens: 25000, cost: 1.2, forecast: 30000 },
  { name: 'Sun', tokens: 18000, cost: 0.9, forecast: 32000 },
  { name: 'Next Mon', tokens: null, cost: null, forecast: 48000 },
  { name: 'Next Tue', tokens: null, cost: null, forecast: 55000 },
];

const COST_BREAKDOWN = [
  { name: 'Lead Orchestrator', value: 450, color: '#6366F1' },
  { name: 'Crawler-Alpha', value: 320, color: '#10B981' },
  { name: 'Analyst-Omega', value: 280, color: '#F59E0B' },
  { name: 'Summarizer-Bot', value: 150, color: '#94A3B8' },
];

const ROI_DATA = [
  { month: 'Jan', cost: 1200, value: 3500 },
  { month: 'Feb', cost: 1400, value: 4800 },
  { month: 'Mar', cost: 1100, value: 5200 },
  { month: 'Apr', cost: 1800, value: 8900 },
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
         {/* Token Usage Chart with Predictive Forecasting */}
         <GlassCard className="lg:col-span-2 p-6 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
               <div>
                  <h3 className="font-bold text-white uppercase tracking-widest text-xs flex items-center gap-2">
                     <Activity size={16} className="text-accent" />
                     Token Consumption & Forecast
                  </h3>
                  <p className="text-[10px] text-text-dim mt-1">AI-powered trend prediction for next 48 hours</p>
               </div>
               <div className="flex items-center gap-4 text-[10px] text-text-dim">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent" /> Actual</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent/30 border border-accent/50 border-dashed" /> Forecast</span>
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
                      <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
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
                    <Area type="monotone" dataKey="forecast" stroke="#6366F1" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorForecast)" />
                    <Area type="monotone" dataKey="tokens" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorTokens)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </GlassCard>

         {/* Detailed Cost Breakdown */}
         <GlassCard className="p-6 h-[400px] flex flex-col">
            <h3 className="font-bold text-white uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
               <PieChartIcon size={16} className="text-accent" />
               Cost Breakdown by Agent
            </h3>
            <div className="flex-1 w-full relative">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={COST_BREAKDOWN}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {COST_BREAKDOWN.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{backgroundColor: '#111827', borderRadius: '12px', border: '1px solid #374151', fontSize: '10px'}}
                    />
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <p className="text-[10px] font-bold text-text-dim uppercase tracking-tighter">Total</p>
                  <p className="text-xl font-black text-white">$1,200</p>
               </div>
            </div>
            <div className="mt-4 space-y-2">
               {COST_BREAKDOWN.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px]">
                     <div className="flex items-center gap-2 text-text-dim">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                     </div>
                     <span className="font-bold text-white">${item.value}</span>
                  </div>
               ))}
            </div>
         </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* ROI Visualization */}
         <GlassCard className="p-8">
            <div className="flex justify-between items-center mb-8">
               <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-3">
                     <Target size={24} className="text-emerald-500" />
                     ROI & Value Generation
                  </h3>
                  <p className="text-[10px] text-text-dim mt-1 uppercase tracking-widest">Efficiency multi-agent vs value produced</p>
               </div>
               <div className="text-right">
                  <p className="text-2xl font-black text-emerald-500">4.9x</p>
                  <p className="text-[10px] font-bold text-text-dim uppercase">Avg. ROI</p>
               </div>
            </div>
            
            <div className="h-[250px] w-full mb-6">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ROI_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                    <Tooltip 
                       contentStyle={{backgroundColor: '#111827', borderRadius: '12px', border: '1px solid #374151', fontSize: '12px'}}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="value" name="Value Generated ($)" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#111827' }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="cost" name="Operational Cost ($)" stroke="#6366F1" strokeWidth={3} dot={{ r: 4, fill: '#6366F1', strokeWidth: 2, stroke: '#111827' }} activeDot={{ r: 6 }} />
                  </LineChart>
               </ResponsiveContainer>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
               <div className="flex items-center gap-3 mb-2">
                  <Zap size={16} className="text-emerald-500" />
                  <p className="text-xs font-bold text-white">Value Proposition Insight</p>
               </div>
               <p className="text-xs text-text-dim leading-relaxed">
                  Every $1 spent on token infrastructure currently generates <span className="text-emerald-500 font-bold">$4.94</span> in saved billable hours for the data analysis team.
               </p>
            </div>
         </GlassCard>
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
               Predictive Billing
            </h3>
            <div className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl bg-surface-lighter flex flex-col items-center justify-center text-center">
                     <p className="text-[9px] font-bold text-text-dim uppercase tracking-widest mb-1">Current MTD</p>
                     <p className="text-3xl font-black text-white">$42.15</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-accent/10 border border-accent/20 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 group-hover:scale-110 transition-transform">
                        <Sparkles size={40} />
                     </div>
                     <p className="text-[9px] font-bold text-accent uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Sparkles size={10} /> Forecasted
                     </p>
                     <p className="text-3xl font-black text-white">$158.42</p>
                  </div>
               </div>
               
               <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <div className="flex justify-between items-center mb-3">
                     <p className="text-[10px] font-bold text-text-dim uppercase">Budget Utilization</p>
                     <p className="text-[10px] font-black text-white">21%</p>
                  </div>
                  <div className="h-2 w-full bg-surface-lighter rounded-full overflow-hidden border border-white/5">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '21%' }}
                        className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
                     />
                  </div>
                  <p className="text-[9px] text-text-dim mt-2 italic">You are currently under your $750.00 monthly cap.</p>
               </div>

               <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Compute', value: '412h', icon: Cpu },
                    { label: 'API Hits', value: '12.4K', icon: Zap },
                    { label: 'Latency', value: '124ms', icon: Clock },
                  ].map((item, i) => (
                    <div key={i} className="p-3 rounded-xl border border-white/5 bg-surface-lighter/30 flex flex-col items-center">
                       <item.icon size={12} className="text-text-dim mb-1.5" />
                       <p className="text-[8px] font-bold text-text-dim uppercase mb-0.5">{item.label}</p>
                       <p className="text-xs font-black text-white">{item.value}</p>
                    </div>
                  ))}
               </div>

               <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                  <Briefcase size={16} />
                  Export Financial Audit
               </button>
            </div>
         </GlassCard>
      </div>
    </div>
  );
};
