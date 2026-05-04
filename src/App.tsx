import React, { useState } from 'react';
import AppShell from './components/AppShell';
import Home from './pages/Home';
import DraftState from './pages/DraftState';
import ExecutionState from './pages/ExecutionState';

type ViewState = 'HOME' | 'DRAFT' | 'EXECUTION';

export default function App() {
  const [view, setView] = useState<ViewState>('HOME');

  const getActiveNav = () => {
    if (view === 'HOME' || view === 'DRAFT') return 'AI 工作台';
    if (view === 'EXECUTION') return '任务';
    return '首页';
  };

  return (
    <>
      <AppShell activeNav={getActiveNav()}>
        {view === 'HOME' && <Home onSend={() => setView('DRAFT')} />}
        {view === 'DRAFT' && <DraftState onExecute={() => setView('EXECUTION')} />}
        {view === 'EXECUTION' && <ExecutionState />}
      </AppShell>

      {/* Floating View Switcher for Demo Purposes */}
      <div className="fixed bottom-6 right-6 flex items-center bg-gray-900/90 backdrop-blur text-white rounded-full p-1.5 shadow-2xl z-50">
        <button 
          onClick={() => setView('HOME')}
          className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${view === 'HOME' ? 'bg-white text-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
        >
          1. 首页
        </button>
        <button 
          onClick={() => setView('DRAFT')}
          className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${view === 'DRAFT' ? 'bg-white text-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
        >
          2. 草稿抽屉
        </button>
        <button 
          onClick={() => setView('EXECUTION')}
          className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${view === 'EXECUTION' ? 'bg-white text-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
        >
          3. 任务执行
        </button>
      </div>
    </>
  );
}
