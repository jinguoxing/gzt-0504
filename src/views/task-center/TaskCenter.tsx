import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, Play, CheckCircle2, AlertTriangle, Clock, ListTodo,
  FileText, ArrowRight, Package, Eye, Plus
} from 'lucide-react';
import { cn } from '@/utils/cn';

const KPI_CARDS = [
  { label: '全部任务', value: 24, icon: ListTodo, color: 'blue' },
  { label: '执行中', value: 6, icon: Play, color: 'emerald' },
  { label: '待确认', value: 3, icon: Clock, color: 'orange' },
  { label: '已完成', value: 12, icon: CheckCircle2, color: 'green' },
  { label: '异常', value: 2, icon: AlertTriangle, color: 'red' },
];

const RUNNING_TASKS = [
  {
    id: 'task-supply-chain-loop',
    name: '供应链语义治理闭环任务',
    stage: '字段语义理解 5/8',
    progress: 78,
    owner: '李桐',
    updatedAt: '09:50',
    pendingCount: 3,
  },
  {
    id: 'task-customer-semantic',
    name: '客户语义治理',
    stage: 'Schema 扫描 2/6',
    progress: 35,
    owner: '王明',
    updatedAt: '09:32',
    pendingCount: 0,
  },
  {
    id: 'task-master-data',
    name: '主数据治理项目',
    stage: '业务表识别 3/8',
    progress: 42,
    owner: '张伟',
    updatedAt: '09:15',
    pendingCount: 1,
  },
];

const PENDING_ACTIONS = [
  { id: '1', label: '字段冲突确认', count: 41, type: '冲突', taskId: 'task-supply-chain-loop' },
  { id: '2', label: '异常字段审核', count: 37, type: '异常', taskId: 'task-supply-chain-loop' },
  { id: '3', label: '对象关系确认', count: 5, type: '确认', taskId: 'task-customer-semantic' },
];

const RECENT_DELIVERABLES = [
  { name: '字段语义理解结果.xlsx', time: '2025-05-16 14:12', type: 'XLSX' },
  { name: '业务对象清单.xlsx', time: '2025-05-16 13:58', type: 'XLSX' },
  { name: '冲突字段清单.xlsx', time: '2025-05-16 11:20', type: 'XLSX' },
  { name: '语义治理报告.pdf', time: '2025-05-15 16:30', type: 'PDF' },
];

const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', iconBg: 'bg-blue-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', iconBg: 'bg-emerald-100' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', iconBg: 'bg-orange-100' },
  green: { bg: 'bg-green-50', text: 'text-green-700', iconBg: 'bg-green-100' },
  red: { bg: 'bg-red-50', text: 'text-red-700', iconBg: 'bg-red-100' },
};

export default function TaskCenter() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-[13px] text-gray-400 mb-1">
              <button onClick={() => navigate('/tasks')} className="hover:text-gray-600">任务</button>
              <ChevronRight size={14} />
              <span className="text-gray-600">任务中心</span>
            </div>
            <h1 className="text-[24px] font-bold text-gray-900">任务中心</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/tasks/all')}
              className="flex items-center gap-2 px-4 py-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              查看全部任务
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/workbench')}
              className="flex items-center gap-2 px-4 py-2 text-[14px] font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              新建任务
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {KPI_CARDS.map((card) => {
            const Icon = card.icon;
            const colors = colorMap[card.color];
            return (
              <button
                key={card.label}
                onClick={() => card.label === '全部任务' ? navigate('/tasks/all') : navigate(`/tasks/all?status=${card.label}`)}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[13px] text-gray-500 font-medium">{card.label}</span>
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', colors.iconBg)}>
                    <Icon size={16} className={colors.text} />
                  </div>
                </div>
                <div className={cn('text-[28px] font-bold', colors.text)}>{card.value}</div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Running Tasks */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-semibold text-gray-900">运行中的任务</h2>
              <button
                onClick={() => navigate('/tasks/all?status=RUNNING')}
                className="text-[13px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                查看全部 <ArrowRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {RUNNING_TASKS.map((task) => (
                <button
                  key={task.id}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className="w-full bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-[15px] font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{task.name}</h3>
                      <p className="text-[13px] text-gray-500 mt-0.5">{task.stage} · {task.owner} · {task.updatedAt}</p>
                    </div>
                    {task.pendingCount > 0 && (
                      <span className="bg-orange-100 text-orange-700 text-[12px] font-medium px-2.5 py-1 rounded-full">
                        {task.pendingCount} 待处理
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${task.progress}%` }} />
                    </div>
                    <span className="text-[13px] font-medium text-blue-600">{task.progress}%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Pending Actions */}
            <div>
              <h2 className="text-[16px] font-semibold text-gray-900 mb-4">待处理操作</h2>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                {PENDING_ACTIONS.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => navigate(`/tasks/${action.taskId}/review/${action.id}`)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        'w-2 h-2 rounded-full',
                        action.type === '冲突' ? 'bg-red-500' : action.type === '异常' ? 'bg-orange-500' : 'bg-blue-500'
                      )} />
                      <span className="text-[14px] text-gray-700 font-medium">{action.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-gray-400">{action.count} 项</span>
                      <ChevronRight size={16} className="text-gray-300" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Deliverables */}
            <div>
              <h2 className="text-[16px] font-semibold text-gray-900 mb-4">最近交付物</h2>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                {RECENT_DELIVERABLES.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <FileText size={16} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-700 truncate">{file.name}</p>
                      <p className="text-[12px] text-gray-400">{file.time}</p>
                    </div>
                    <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{file.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
