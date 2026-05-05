import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, Play, CheckCircle2, AlertTriangle, Clock, ListTodo,
  FileText, ArrowRight, Package, Eye, Plus, Star, Activity,
  Users, Zap, RotateCw, LayoutGrid, Inbox, Sparkles
} from 'lucide-react';
import { cn } from '@/utils/cn';
import mockData from '@/mock/task-center.json';

// --- Mock Data ---

type Scope = 'my' | 'team' | 'all';

const SCOPE_TABS = mockData.scopeTabs as { key: Scope; label: string }[];

const KPI_ICONS: Record<string, any> = {
  '全部任务': ListTodo, '执行中': Play, '待我处理': Clock, '待处理': Clock, '已完成': CheckCircle2, '异常': AlertTriangle,
};

const KPI_DATA: Record<Scope, { label: string; value: number; icon: any; color: string; link: string }[]> = {
  my: mockData.kpiData.my.map(k => ({ ...k, icon: KPI_ICONS[k.label] || ListTodo })),
  team: mockData.kpiData.team.map(k => ({ ...k, icon: KPI_ICONS[k.label] || ListTodo })),
  all: mockData.kpiData.all.map(k => ({ ...k, icon: KPI_ICONS[k.label] || ListTodo })),
};

const RUNNING_TASKS = mockData.runningTasks as Record<Scope, {
  id: string; name: string; type: string; stage: string; progress: number;
  owner: string; updatedAt: string; pendingCount: number; status: string;
}[]>;

const ACTION_TABS = mockData.actionTabs;

const PENDING_ACTIONS = mockData.pendingActions as Record<Scope, { id: string; label: string; count: number; type: string; tab: string; taskId: string }[]>;

const RECENT_VISITS = mockData.recentVisits;

const RECENT_ACTIVITIES = mockData.recentActivities;

const BOARD_DATA = mockData.boardData as Record<Scope, { createdByMe: number; ownedByMe: number; confirmationsHandled: number; exceptionsHandled: number; avgCompletionRate: number }>;

const RECENT_DELIVERABLES = mockData.recentDeliverables;

const QUICK_STARTS = mockData.quickStarts;

const TYPE_COLOR: Record<string, string> = mockData.typeColor as Record<string, string>;

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
