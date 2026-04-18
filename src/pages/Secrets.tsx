import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Key, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Copy, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  Search,
  Filter,
  X,
  Database,
  ArrowRight,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';

interface Secret {
  id: string;
  key: string;
  value: string;
  type: 'api_key' | 'password' | 'token' | 'env_var';
  lastUsed: string;
  usageCount: number;
}

export const Secrets: React.FC = () => {
  const [secrets, setSecrets] = useState<Secret[]>([
    { 
      id: '1', 
      key: 'STRIPE_SECRET_KEY', 
      value: 'sk_test_•••••••••••••••••••••', 
      type: 'api_key', 
      lastUsed: '2h ago',
      usageCount: 142
    },
    { 
      id: '2', 
      key: 'DISCORD_BOT_TOKEN', 
      value: 'MTI••••••••••••••••••••••', 
      type: 'token', 
      lastUsed: '14m ago',
      usageCount: 89
    },
    { 
      id: '3', 
      key: 'SUPABASE_SERVICE_ROLE', 
      value: 'eyJ••••••••••••••••••••••', 
      type: 'api_key', 
      lastUsed: 'Yesterday',
      usageCount: 12
    }
  ]);

  const [showValueIdx, setShowValueIdx] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [newSecret, setNewSecret] = useState({
    key: '',
    value: '',
    type: 'api_key' as Secret['type']
  });

  const handleCreate = () => {
    if (!newSecret.key || !newSecret.value) return;
    const secret: Secret = {
      id: Date.now().toString(),
      key: newSecret.key.toUpperCase(),
      value: newSecret.value,
      type: newSecret.type,
      lastUsed: 'Never',
      usageCount: 0
    };
    setSecrets([secret, ...secrets]);
    setShowCreate(false);
    setNewSecret({ key: '', value: '', type: 'api_key' });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSecrets = secrets.filter(s => s.key.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">SECRET MANAGER</h1>
          <p className="text-text-dim mt-1">Manage encrypted API keys and environment variables for your autonomous agents.</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="px-6 py-2.5 bg-accent text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-accent/20 flex items-center gap-2"
        >
          <Plus size={14} />
          Create New Secret
        </button>
      </div>

      <div className="flex gap-4 items-center shrink-0 bg-surface-lighter/30 p-2 rounded-2xl border border-white/5">
         <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim px-0" />
            <input 
              type="text" 
              placeholder="Search secrets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-lighter/50 border border-white/5 rounded-xl pl-12 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent transition-all"
            />
         </div>
         <button className="p-2.5 rounded-xl bg-surface-lighter text-text-dim hover:text-white border border-white/5 transition-all">
            <Filter size={16} />
         </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide space-y-4">
         {filteredSecrets.map((secret) => (
           <GlassCard key={secret.id} className="p-0 overflow-hidden group hover:border-accent/30 transition-all border-white/5">
              <div className="grid grid-cols-[1fr_auto_auto] gap-6 items-center p-6">
                 <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-surface-lighter text-accent border border-white/5 shadow-inner">
                       <Lock size={20} />
                    </div>
                    <div>
                       <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-black text-white tracking-tight leading-none">{secret.key}</h3>
                          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold text-text-dim uppercase tracking-widest">
                             {secret.type.replace('_', ' ')}
                          </span>
                       </div>
                       <div className="flex items-center gap-4 text-[10px] text-text-dim font-medium">
                          <span className="flex items-center gap-1"><Clock size={10} /> Last used: {secret.lastUsed}</span>
                          <span className="flex items-center gap-1"><ShieldCheck size={10} /> {secret.usageCount} total calls</span>
                       </div>
                    </div>
                 </div>

                 <div className="bg-black/40 rounded-xl px-4 py-3 flex items-center gap-4 border border-white/5">
                    <span className="font-mono text-xs text-text-dim w-64 truncate">
                       {showValueIdx === secret.id ? secret.value : '••••••••••••••••••••••••••••••••'}
                    </span>
                    <div className="flex items-center gap-1">
                       <button 
                         onClick={() => setShowValueIdx(showValueIdx === secret.id ? null : secret.id)}
                         className="p-1.5 text-text-dim hover:text-white transition-colors"
                       >
                          {showValueIdx === secret.id ? <EyeOff size={14} /> : <Eye size={14} />}
                       </button>
                       <button 
                         onClick={() => copyToClipboard(secret.value, secret.id)}
                         className="p-1.5 text-text-dim hover:text-accent transition-colors"
                       >
                          {copiedId === secret.id ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                       </button>
                    </div>
                 </div>

                 <div className="flex gap-2 pl-4">
                    <button className="p-2.5 rounded-xl bg-surface-lighter text-rose-500/50 hover:text-rose-500 border border-white/5 transition-all">
                       <Trash2 size={18} />
                    </button>
                 </div>
              </div>
           </GlassCard>
         ))}

         {filteredSecrets.length === 0 && (
            <div className="py-20 flex flex-col items-center text-center">
               <div className="p-6 rounded-full bg-surface-lighter text-text-dim mb-4 mb-0 opacity-20">
                  <ShieldAlert size={64} />
               </div>
               <h3 className="text-lg font-bold text-white mb-1">No secrets found</h3>
               <p className="text-sm text-text-dim max-w-sm">
                  {searchQuery ? `No keys matching "${searchQuery}" in your vault.` : "Store sensitive API keys here to use them securely in your autonomous workflows."}
               </p>
            </div>
         )}
      </div>

      {/* Security Tip Footer */}
      <GlassCard className="mt-auto p-4 bg-emerald-500/5 border-emerald-500/20 shrink-0">
          <div className="flex items-center gap-3 text-xs text-emerald-500/80">
             <ShieldCheck size={16} />
             <p className="font-medium">All secrets are encrypted at rest using AES-256-GCM. Never commit raw keys to your mission files.</p>
          </div>
      </GlassCard>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreate(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg"
            >
              <GlassCard className="p-8 border-accent/40 bg-surface shadow-2xl">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
                       <Key className="text-accent" />
                       ENCRYPT NEW SECRET
                    </h3>
                    <button onClick={() => setShowCreate(false)} className="text-text-dim hover:text-white p-1">
                       <X size={20} />
                    </button>
                 </div>

                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-2 block">Key Identifier</label>
                       <input 
                         type="text" 
                         placeholder="e.g., OPENAI_API_KEY"
                         value={newSecret.key}
                         onChange={(e) => setNewSecret({...newSecret, key: e.target.value.toUpperCase()})}
                         className="w-full bg-surface-lighter border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-all font-mono"
                       />
                    </div>

                    <div>
                       <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-2 block">Type</label>
                       <div className="grid grid-cols-2 gap-2">
                          {['api_key', 'token', 'password', 'env_var'].map(t => (
                             <button 
                                key={t}
                                onClick={() => setNewSecret({...newSecret, type: t as any})}
                                className={`py-2 px-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${newSecret.type === t ? 'bg-accent text-white border-accent' : 'bg-surface-lighter text-text-dim border-white/5 hover:border-white/20'}`}
                             >
                                {t.replace('_', ' ')}
                             </button>
                          ))}
                       </div>
                    </div>

                    <div>
                       <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-2 block">Secret Value</label>
                       <div className="relative">
                          <input 
                            type="password" 
                            placeholder="Paste your sensitive value here..."
                            value={newSecret.value}
                            onChange={(e) => setNewSecret({...newSecret, value: e.target.value})}
                            className="w-full bg-surface-lighter border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-all font-mono pr-10"
                          />
                          <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim/50" />
                       </div>
                    </div>

                    <button 
                       onClick={handleCreate}
                       className="w-full py-4 bg-accent text-white rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                       Securely Store Key
                       <ArrowRight size={14} />
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
