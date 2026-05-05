import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, Play, CheckCircle2, AlertTriangle, Clock, ListTodo,
  FileText, ArrowRight, Package, Eye, Plus, Star, Activity,
  Users, Zap, RotateCw, LayoutGrid, Inbox, Sparkles
} from 'lucide-react';
import { cn } from '@/utils/cn';

// --- Mock Data ---

type Scope = 'my' | 'team' | 'all';

const SCOPE_TABS = [
  { key: 'my' as Scope, label: '我的任务' },
  { key: 'team' as Scope, label: '团队任务' },
  { key: 'all' as Scope, label: '全部任务' },
];

const KPI_DATA: Record<Scope, { label: string; value: number; icon: any; color: string; link: string }[]> = {
  my: [
    { label: '全部任务', value: 24, icon: ListTodo, color: 'blue', link: '/tasks/all?scope=my' },
    { label: '执行中', value: 6, icon: Play, color: 'emerald', link: '/tasks/all?scope=my&status=RUNNING' },
    { label: '待我处理', value: 3, icon: Clock, color: 'orange', link: '/tasks/reviews?assignee=me&status=PENDING' },
    { label: '已完成', value: 12, icon: CheckCircle2, color: 'green', link: '/tasks/all?scope=my&status=COMPLETED' },
    { label: '异常', value: 2, icon: AlertTriangle, color: 'red', link: '/tasks/all?scope=my&status=BLOCKED' },
  ],
  team: [
    { label: '全部任务', value: 58, icon: ListTodo, color: 'blue', link: '/tasks/all?scope=team' },
    { label: '执行中', value: 14, icon: Play, color: 'emerald', link: '/tasks/all?scope=team&status=RUNNING' },
    { label: '待处理', value: 9, icon: Clock, color: 'orange', link: '/tasks/reviews?scope=team&status=PENDING' },
    { label: '已完成', value: 31, icon: CheckCircle2, color: 'green', link: '/tasks/all?scope=team&status=COMPLETED' },
    { label: '异常', value: 4, icon: AlertTriangle, color: 'red', link: '/tasks/all?scope=team&status=BLOCKED' },
  ],
  all: [
    { label: '全部任务', value: 128, icon: ListTodo, color: 'blue', link: '/tasks/all?scope=all' },
    { label: '执行中', value: 36, icon: Play, color: 'emerald', link: '/tasks/all?scope=all&status=RUNNING' },
    { label: '待处理', value: 17, icon: Clock, color: 'orange', link: '/tasks/reviews?status=PENDING' },
    { label: '已完成', value: 75, icon: CheckCircle2, color: 'green', link: '/tasks/all?scope=all&status=COMPLETED' },
    { label: '异常', value: 4, icon: AlertTriangle, color: 'red', link: '/tasks/all?scope=all&status=BLOCKED' },
  ],
};

const RUNNING_TASKS: Record<Scope, {
  id: string; name: string; type: string; stage: string; progress: number;
  owner: string; updatedAt: string; pendingCount: number; status: string;
}[]> = {
  my: [
    { id: 'task-supply-chain-loop', name: '供应链语义治理闭环任务', type: '语义治理', stage: '字段语义理解 5/8', progress: 78, owner: '李桐', updatedAt: '09:50', pendingCount: 3, status: '执行中' },
    { id: 'task-customer', name: '客户语义治理任务', type: '语义治理', stage: '业务对象识别 4/7', progress: 61, owner: '陈晨', updatedAt: '08:40', pendingCount: 4, status: '执行中' },
    { id: 'task-purchase', name: '采购主数据修复任务', type: '主数据', stage: '字段修复 1/4', progress: 18, owner: '孙浩', updatedAt: '10:05', pendingCount: 5, status: '执行中' },
  ],
  team: [
    { id: 'task-supply-chain-loop', name: '供应链语义治理闭环任务', type: '语义治理', stage: '字段语义理解 5/8', progress: 78, owner: '李桐', updatedAt: '09:50', pendingCount: 3, status: '执行中' },
    { id: 'task-standard', name: '数据标准落地任务', type: '标准管理', stage: '标准映射 3/6', progress: 54, owner: '张悦', updatedAt: '09:35', pendingCount: 2, status: '执行中' },
    { id: 'task-customer', name: '客户语义治理任务', type: '语义治理', stage: '业务对象识别 4/7', progress: 61, owner: '陈晨', updatedAt: '08:40', pendingCount: 4, status: '执行中' },
    { id: 'task-purchase', name: '采购主数据修复任务', type: '主数据', stage: '字段修复 1/4', progress: 18, owner: '孙浩', updatedAt: '10:05', pendingCount: 5, status: '执行中' },
  ],
  all: [
    { id: 'task-supply-chain-loop', name: '供应链语义治理闭环任务', type: '语义治理', stage: '字段语义理解 5/8', progress: 78, owner: '李桐', updatedAt: '09:50', pendingCount: 3, status: '执行中' },
    { id: 'task-standard', name: '数据标准落地任务', type: '标准管理', stage: '标准映射 3/6', progress: 54, owner: '张悦', updatedAt: '09:35', pendingCount: 2, status: '执行中' },
    { id: 'task-customer', name: '客户语义治理任务', type: '语义治理', stage: '业务对象识别 4/7', progress: 61, owner: '陈晨', updatedAt: '08:40', pendingCount: 4, status: '执行中' },
    { id: 'task-metadata', name: '元数据自动采集任务', type: '元数据', stage: '数据采集 2/5', progress: 32, owner: '刘欣', updatedAt: '昨天 16:22', pendingCount: 1, status: '异常' },
    { id: 'task-purchase', name: '采购主数据修复任务', type: '主数据', stage: '字段修复 1/4', progress: 18, owner: '孙浩', updatedAt: '10:05', pendingCount: 5, status: '执行中' },
  ],
};

const ACTION_TABS = ['全部', '待确认', '待审核', '异常', '继续执行'];

const PENDING_ACTIONS: Record<Scope, { id: string; label: string; count: number; type: string; tab: string; taskId: string }[]> = {
  my: [
    { id: '1', label: '字段冲突确认', count: 41, type: '冲突', tab: '待确认', taskId: 'task-supply-chain-loop' },
    { id: '2', label: '异常字段审核', count: 37, type: '异常', tab: '异常', taskId: 'task-supply-chain-loop' },
    { id: '3', label: '对象关系确认', count: 5, type: '确认', tab: '待确认', taskId: 'task-customer' },
  ],
  team: [
    { id: '1', label: '字段冲突确认', count: 41, type: '冲突', tab: '待确认', taskId: 'task-supply-chain-loop' },
    { id: '2', label: '异常字段审核', count: 37, type: '异常', tab: '异常', taskId: 'task-supply-chain-loop' },
    { id: '3', label: '对象关系确认', count: 5, type: '确认', tab: '待确认', taskId: 'task-customer' },
    { id: '4', label: '标准映射审核', count: 12, type: '审核', tab: '待审核', taskId: 'task-standard' },
  ],
  all: [
    { id: '1', label: '字段冲突确认', count: 41, type: '冲突', tab: '待确认', taskId: 'task-supply-chain-loop' },
    { id: '2', label: '异常字段审核', count: 37, type: '异常', tab: '异常', taskId: 'task-supply-chain-loop' },
    { id: '3', label: '对象关系确认', count: 5, type: '确认', tab: '待确认', taskId: 'task-customer' },
    { id: '4', label: '标准映射审核', count: 12, type: '审核', tab: '待审核', taskId: 'task-standard' },
    { id: '5', label: '字段语义继续执行', count: 8, type: '继续', tab: '继续执行', taskId: 'task-purchase' },
  ],
};

const RECENT_VISITS = [
  { id: 'v1', name: '供应链语义治理闭环任务', type: 'TASK', visitedAt: '10 分钟前', url: '/tasks/task-supply-chain-loop' },
  { id: 'v2', name: '字段语义理解结果.xlsx', type: 'FILE', visitedAt: '30 分钟前', url: '/tasks/task-supply-chain-loop/completed' },
  { id: 'v3', name: '客户语义治理任务', type: 'TASK', visitedAt: '2 小时前', url: '/tasks/task-customer' },
  { id: 'v4', name: '语义治理报告.pdf', type: 'DELIVERABLE', visitedAt: '昨天', url: '/tasks/task-supply-chain-loop/completed' },
];

const RECENT_ACTIVITIES = [
  { id: 'a1', actor: 'Xino', verb: '完成了字段语义理解', target: '供应链语义治理闭环任务', time: '09:45', tone: 'blue' },
  { id: 'a2', actor: '李桐', verb: '确认了', target: '21 条对象关系', time: '10:15', tone: 'green' },
  { id: 'a3', actor: 'Xino', verb: '检测到', target: '41 个冲突字段', time: '09:32', tone: 'red' },
  { id: 'a4', actor: '陈晨', verb: '开始执行', target: '客户语义治理任务', time: '08:30', tone: 'blue' },
  { id: 'a5', actor: 'Xino', verb: '完成了 Schema 扫描', target: '客户语义治理', time: '08:35', tone: 'green' },
];

const BOARD_DATA: Record<Scope, { createdByMe: number; ownedByMe: number; confirmationsHandled: number; exceptionsHandled: number; avgCompletionRate: number }> = {
  my: { createdByMe: 8, ownedByMe: 12, confirmationsHandled: 156, exceptionsHandled: 23, avgCompletionRate: 92 },
  team: { createdByMe: 8, ownedByMe: 12, confirmationsHandled: 342, exceptionsHandled: 58, avgCompletionRate: 89 },
  all: { createdByMe: 8, ownedByMe: 12, confirmationsHandled: 580, exceptionsHandled: 94, avgCompletionRate: 87 },
};

const RECENT_DELIVERABLES = [
  { name: '字段语义理解结果.xlsx', time: '2025-05-16 14:12', type: 'XLSX' },
  { name: '业务对象清单.xlsx', time: '2025-05-16 13:58', type: 'XLSX' },
  { name: '冲突字段清单.xlsx', time: '2025-05-16 11:20', type: 'XLSX' },
  { name: '语义治理报告.pdf', time: '2025-05-15 16:30', type: 'PDF' },
];

const QUICK_STARTS = [
  { label: '语义治理', desc: '扫描 Schema，理解字段语义，生成业务对象', path: '/workbench', color: 'blue' },
  { label: '找数问数', desc: '自然语言查询业务数据', path: '/data-query', color: 'emerald' },
];

const TYPE_COLOR: Record<string, string> = {
  '语义治理': 'bg-blue-50 text-blue-700',
  '标准管理': 'bg-purple-50 text-purple-700',
  '主数据': 'bg-emerald-50 text-emerald-700',
  '元数据': 'bg-amber-50 text-amber-700',
  '质量巡检': 'bg-gray-100 text-gray-700',
};

const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', iconBg: 'bg-blue-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', iconBg: 'bg-emerald-100' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', iconBg: 'bg-orange-100' },
  green: { bg: 'bg-green-50', text: 'text-green-700', iconBg: 'bg-green-100' },
  red: { bg: 'bg-red-50', text: 'text-red-700', iconBg: 'bg-red-100' },
};

const toneColor: Record<string, string> = {
  blue: 'text-blue-500', green: 'text-green-500', red: 'text-red-500', orange: 'text-orange-500', gray: 'text-gray-500',
};

export default function TaskCenter() {
  const navigate = useNavigate();
  const [scope, setScope] = useState<Scope>('my');
  const [actionTab, setActionTab] = useState('全部');

  const kpis = KPI_DATA[scope];
  const runningTasks = RUNNING_TASKS[scope];
  const allActions = PENDING_ACTIONS[scope];
  const filteredActions = actionTab === '全部' ? allActions : allActions.filter(a => a.tab === actionTab);
  const board = BOARD_DATA[scope];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="flex h-full">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-[13px] text-gray-400 mb-1">
                <span>任务</span>
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
                查看全部任务 <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/workbench')}
                className="flex items-center gap-2 px-4 py-2 text-[14px] font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} /> 新建任务
              </button>
            </div>
          </div>

          {/* Scope Tabs */}
          <div className="flex items-center gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
            {SCOPE_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setScope(tab.key)}
                className={cn(
                  "px-4 py-1.5 rounded-md text-[13px] font-medium transition-all",
                  scope === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            {kpis.map((card) => {
              const Icon = card.icon;
              const colors = colorMap[card.color];
              return (
                <button
                  key={card.label}
                  onClick={() => navigate(card.link)}
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

          {/* Two Column: Running Tasks + Action Queue */}
          <div className="grid grid-cols-5 gap-6 mb-8">
            {/* Running Tasks */}
            <div className="col-span-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-semibold text-gray-900">运行中的任务</h2>
                <button
                  onClick={() => navigate(`/tasks/all?status=RUNNING`)}
                  className="text-[13px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  查看全部 <ArrowRight size={14} />
                </button>
              </div>
              <div className="space-y-3">
                {runningTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => navigate(`/tasks/${task.id}`)}
                    className="w-full bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-[15px] font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{task.name}</h3>
                          <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded flex-shrink-0", TYPE_COLOR[task.type] || 'bg-gray-100 text-gray-600')}>{task.type}</span>
                        </div>
                        <p className="text-[13px] text-gray-500">{task.stage} · {task.owner} · {task.updatedAt}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <span className={cn(
                          "text-[12px] font-medium px-2 py-0.5 rounded-full border",
                          task.status === '执行中' ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-red-50 text-red-700 border-red-100"
                        )}>{task.status}</span>
                        {task.pendingCount > 0 && (
                          <span className="bg-orange-100 text-orange-700 text-[12px] font-medium px-2.5 py-1 rounded-full">
                            {task.pendingCount} 待处理
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", task.status === '异常' ? 'bg-red-500' : 'bg-blue-500')} style={{ width: `${task.progress}%` }} />
                      </div>
                      <span className={cn("text-[13px] font-medium", task.status === '异常' ? 'text-red-600' : 'text-blue-600')}>{task.progress}%</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Queue */}
            <div className="col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-semibold text-gray-900">待我处理</h2>
                <button
                  onClick={() => navigate('/tasks/reviews?assignee=me')}
                  className="text-[13px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  查看全部 <ArrowRight size={14} />
                </button>
              </div>
              <div className="bg-white rounded-xl border border-gray-200">
                {/* Internal Tabs */}
                <div className="flex items-center gap-1 px-4 pt-3 pb-2 border-b border-gray-100">
                  {ACTION_TABS.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActionTab(tab)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors",
                        actionTab === tab ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                {/* Action List */}
                <div className="divide-y divide-gray-100">
                  {filteredActions.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-[13px] text-gray-400">暂无待处理事项</p>
                    </div>
                  ) : (
                    filteredActions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => navigate(`/tasks/${action.taskId}/review/${action.id}`)}
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            'w-2 h-2 rounded-full flex-shrink-0',
                            action.type === '冲突' ? 'bg-red-500' : action.type === '异常' ? 'bg-orange-500' : action.type === '审核' ? 'bg-purple-500' : action.type === '继续' ? 'bg-blue-500' : 'bg-blue-500'
                          )} />
                          <span className="text-[14px] text-gray-700 font-medium">{action.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] text-gray-400">{action.count} 项</span>
                          <ChevronRight size={16} className="text-gray-300" />
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Visits */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-semibold text-gray-900">最近访问</h2>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {RECENT_VISITS.map((visit) => (
                <button
                  key={visit.id}
                  onClick={() => navigate(visit.url)}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                      {visit.type === 'TASK' ? '任务' : visit.type === 'FILE' ? '文件' : '交付物'}
                    </span>
                    <span className="text-[11px] text-gray-400">{visit.visitedAt}</span>
                  </div>
                  <p className="text-[13px] font-medium text-gray-700 group-hover:text-blue-600 truncate transition-colors">{visit.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Start — lower visual weight */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[13px] text-gray-400 font-medium">快捷开始</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {QUICK_STARTS.map(item => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-all text-left group flex items-center gap-4"
                >
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                    item.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                  )}>
                    <Zap size={18} />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{item.label}</p>
                    <p className="text-[12px] text-gray-400">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-[320px] bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto px-5 py-6 space-y-6 hidden lg:flex flex-col">
          {/* My Board */}
          <div>
            <h3 className="text-[14px] font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <LayoutGrid size={15} className="text-gray-400" /> 我的看板
            </h3>
            <div className="space-y-2">
              {[
                { label: '我创建的', value: board.createdByMe },
                { label: '我负责的', value: board.ownedByMe },
                { label: '确认处理数', value: board.confirmationsHandled },
                { label: '异常处理数', value: board.exceptionsHandled },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-[13px] px-3 py-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="text-gray-900 font-semibold">{item.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between text-[13px] px-3 py-2 bg-blue-50/50 rounded-lg">
                <span className="text-gray-500">平均完成率</span>
                <span className="text-blue-700 font-semibold">{board.avgCompletionRate}%</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-[14px] font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Activity size={15} className="text-gray-400" /> 最近活动
            </h3>
            <div className="space-y-3">
              {RECENT_ACTIVITIES.map(act => (
                <div key={act.id} className="flex items-start gap-2">
                  <div className={cn("w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0", toneColor[act.tone]?.replace('text-', 'bg-') || 'bg-gray-400')} />
                  <div className="min-w-0">
                    <p className="text-[13px] text-gray-700">
                      <span className="font-medium">{act.actor}</span> {act.verb} <span className={cn("font-medium", toneColor[act.tone])}>{act.target}</span>
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Deliverables */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
                <FileText size={15} className="text-gray-400" /> 最近交付物
              </h3>
              <button className="text-[12px] text-blue-600 hover:text-blue-700 font-medium">查看全部</button>
            </div>
            <div className="space-y-2">
              {RECENT_DELIVERABLES.map((file, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <FileText size={14} className="text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-gray-700 truncate">{file.name}</p>
                    <p className="text-[11px] text-gray-400">{file.time}</p>
                  </div>
                  <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded flex-shrink-0">{file.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
