import React from 'react';
import LeftNav from './LeftNav';
import TopBar from './TopBar';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden font-sans text-gray-900">
      <LeftNav />
      <div className="flex flex-col flex-1 min-w-0 bg-white">
        <TopBar />
        <main className="flex-1 overflow-hidden relative flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
