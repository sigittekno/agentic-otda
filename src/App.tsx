import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { TaskInputPanel } from './components/dashboard/TaskInputPanel';
import { BrowserPanel } from './components/dashboard/BrowserPanel';
import { StepTimeline } from './components/dashboard/StepTimeline';
import { StatusPanel } from './components/dashboard/StatusPanel';
import { LogViewer } from './components/dashboard/LogViewer';
import { MemoryPanel } from './components/dashboard/MemoryPanel';
import { Workflows } from './pages/Workflows';
import { Memory } from './pages/Memory';
import { SwarmChat } from './pages/SwarmChat';
import { Deployment } from './pages/Deployment';
import { Analytics } from './pages/Analytics';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [isIntervening, setIsIntervening] = React.useState(false);
  const [activePage, setActivePage] = React.useState('dashboard');

  return (
    <div className="flex bg-bg text-text-main font-sans h-screen w-screen overflow-hidden">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <div className="flex-1 flex flex-col h-full min-w-0">
        <Navbar />

        <div className="flex-1 p-5 overflow-hidden">
          {activePage === 'dashboard' ? (
            <div className="grid grid-cols-[1.6fr_1fr] grid-rows-[100px_380px_170px] gap-4 h-full max-w-[1200px] mx-auto animate-in fade-in duration-500">
              {/* Row 1 */}
              <TaskInputPanel />
              <StatusPanel isIntervening={isIntervening} />

              {/* Row 2 */}
              <div className="h-full min-h-0">
                <BrowserPanel 
                  isIntervening={isIntervening} 
                  onToggleControl={() => setIsIntervening(!isIntervening)} 
                />
              </div>
              <div className="h-full min-h-0">
                <StepTimeline isIntervening={isIntervening} />
              </div>

              {/* Row 3 */}
              <div className="h-full min-h-0">
                <LogViewer />
              </div>
              <div className="h-full min-h-0">
                <MemoryPanel />
              </div>
            </div>
          ) : activePage === 'workflows' ? (
            <div className="h-full max-w-[1200px] mx-auto overflow-hidden">
              <Workflows />
            </div>
          ) : activePage === 'swarm' ? (
            <div className="h-full w-full overflow-hidden">
              <SwarmChat />
            </div>
          ) : activePage === 'deployment' ? (
            <div className="h-full w-full overflow-y-auto scrollbar-hide">
              <Deployment />
            </div>
          ) : activePage === 'analytics' ? (
            <div className="h-full w-full overflow-y-auto scrollbar-hide">
              <Analytics />
            </div>
          ) : activePage === 'memory' ? (
            <div className="h-full max-w-[1200px] mx-auto overflow-hidden">
              <Memory />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-text-dim">
               <p>The {activePage} section is coming soon.</p>
            </div>
          )}
        </div>
      </div>

      {/* Intervention Floating Notification */}
      <AnimatePresence>
        {!isIntervening && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setIsIntervening(true)}
            className="fixed bottom-8 right-8 bg-rose-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl shadow-rose-500/30 flex items-center gap-3 active:scale-95 transition-all z-[100] group"
          >
            <div className="relative">
              <AlertCircle size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
            </div>
            <span>Help Agent</span>
            <span className="text-white/50 text-xs font-normal group-hover:text-white transition-colors">CAPTCHA Detected</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
