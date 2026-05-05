import React from 'react';
import { Search, Bell, HelpCircle, Settings, ChevronDown } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="h-[64px] bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6 flex-shrink-0">
      {/* Project Selector */}
      <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded-md transition-colors">
        <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-[12px]">
          供
        </div>
        <span className="text-[14px] font-medium text-gray-900">供应链语义治理项目</span>
        <ChevronDown size={16} className="text-gray-400" />
      </div>

      {/* Center Search */}
      <div className="flex-1 max-w-2xl px-8 relative">
        <div className="relative group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="搜索任务、文件、对象、知识库..."
            className="w-full h-10 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-full pl-10 pr-4 text-[14px] outline-none transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <HelpCircle size={18} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <Settings size={18} />
          </button>
        </div>
        <div className="h-6 w-px bg-gray-200"></div>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-full transition-colors">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?seed=litong&backgroundColor=EFF6FF"
              alt="李桐"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[14px] font-medium text-gray-700">李桐</span>
        </div>
      </div>
    </header>
  );
}
