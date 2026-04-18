/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  GitBranch, 
  Users, 
  Database, 
  Terminal, 
  Wrench, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Zap,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: ClipboardList },
  { id: 'workflows', label: 'Workflows', icon: GitBranch },
  { id: 'agents', label: 'Agents', icon: Users },
  { id: 'swarm', label: 'Swarm Chat', icon: MessageSquare },
  { id: 'deployment', label: 'Deployment', icon: Zap },
  { id: 'analytics', label: 'Analytics', icon: Activity },
  { id: 'memory', label: 'Memory', icon: Database },
  { id: 'logs', label: 'Logs', icon: Terminal },
  { id: 'tools', label: 'Tools', icon: Wrench },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, activePage, onNavigate }) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 60 : 200 }}
      className="h-screen bg-surface border-r border-border-dim flex flex-col relative z-50 overflow-hidden shrink-0"
    >
      <div className="h-[60px] flex items-center px-5 font-bold text-sm tracking-widest text-accent border-b border-border-dim uppercase">
        {!collapsed ? "Agentic.AI" : "A"}
      </div>

      <nav className="py-5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                w-full flex items-center gap-3 px-5 py-2.5 transition-all relative text-[13px]
                ${isActive 
                  ? 'bg-accent/15 text-accent border-r-2 border-accent' 
                  : 'text-text-dim hover:text-text-main hover:bg-surface-lighter'
                }
              `}
            >
              <Icon size={16} />
              {!collapsed && (
                <span className="font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto p-4 border-t border-border-dim">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full h-8 rounded flex items-center justify-center text-text-dim hover:bg-surface-lighter transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </motion.aside>
  );
};
