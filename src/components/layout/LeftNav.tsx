import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Building2, User } from 'lucide-react';
import { cn } from '@/utils/cn';
import { NAV_ITEMS } from '@/config/menuConfig';
import { dataQaPath } from '@/config/routeConfig';

export default function LeftNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (highlightPattern: string) => {
    if (highlightPattern === '/') return location.pathname === '/';
    return location.pathname.startsWith(highlightPattern);
  };

  return (
    <div className="w-[240px] h-full bg-[#F8FAFC] border-r border-[#E5E7EB] flex flex-col flex-shrink-0">
      {/* Logo & Brand */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">Semovix</h1>
        <p className="text-[12px] text-gray-500 mt-0.5">语义治理与智能工作台</p>
      </div>

      {/* Main Action */}
      <div className="px-4 mb-4">
        <button
          onClick={() => navigate('/ai-workbench')}
          className="w-full flex items-center justify-center gap-2 bg-white border border-[#D1D5DB] hover:bg-gray-50 text-gray-700 text-[14px] font-medium py-2 px-4 rounded-lg shadow-sm transition-colors"
        >
          <Plus size={16} />
          新建任务
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-0.5 mb-6">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.highlightPattern);
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium transition-colors",
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon size={18} className={active ? "text-blue-600" : "text-gray-400"} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* 固定任务 */}
        <div className="mb-6">
          <h3 className="px-3 text-[12px] font-medium text-gray-400 mb-2">固定任务</h3>
          <div className="space-y-0.5">
            {['供应链语义治理闭环任务', '客户语义治理', '主数据治理项目'].map((task) => (
              <button
                key={task}
                onClick={() => navigate('/tasks/task-supply-chain-loop')}
                className="w-full text-left px-3 py-1.5 rounded-lg text-[13px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 truncate"
              >
                {task}
              </button>
            ))}
          </div>
        </div>

        {/* 最近任务 */}
        <div>
          <h3 className="px-3 text-[12px] font-medium text-gray-400 mb-2">最近任务</h3>
          <div className="space-y-0.5">
            {[
              '上个月采购金额是多少？',
              '本月采购上涨原因分析',
              '供应商绩效分析',
              '库存周转天数趋势',
              '采购订单异常监控'
            ].map((task) => (
              <button
                key={task}
                onClick={() => navigate(dataQaPath('dqa_001'))}
                className="w-full text-left px-3 py-1.5 rounded-lg text-[13px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 truncate"
              >
                {task}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom User Info */}
      <div className="p-4 border-t border-[#E5E7EB]">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
            <User size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-gray-900 truncate">李桐</div>
            <div className="text-[12px] text-gray-500 truncate">liming@semovix.com</div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2 text-[12px] text-gray-500">
          <Building2 size={14} className="text-gray-400" />
          <span className="truncate">语义模型与治理空间</span>
        </div>
      </div>
    </div>
  );
}
