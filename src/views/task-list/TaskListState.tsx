import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search, Filter, ChevronDown, Settings, Download, Plus, MoreHorizontal,
  List, Star, AlertCircle, Archive, LayoutGrid, CheckCircle2, Clock,
  HelpCircle, Inbox, Users, Eye, SlidersHorizontal, X
} from 'lucide-react';
import { cn } from '@/utils/cn';
import mockData from '@/mock/task-list.json';

interface TaskRow {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  project: string;
  projectSlug: string;
  stage: string;
  stageId: string;
  stageProgress: string;
  progress: number;
  owner: string;
  ownerId: string;
  priority: '高' | '中' | '低';
  pendingCount: number;
  status: '执行中' | '已完成' | '异常' | '待确认' | '待审核';
  updatedAt: string;
  starred: boolean;
  archived: boolean;
}

const ALL_TASKS = mockData.tasks as TaskRow[];

// Mock current user — in production this would come from auth context
const CURRENT_USER_ID = 'u-litong';

const STATUS_MAP: Record<string, string> = mockData.statusMap as Record<string, string>;
const STATUS_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(STATUS_MAP).map(([k, v]) => [v, k])
);

const STATUS_OPTIONS = mockData.filterOptions.status;
const TYPE_OPTIONS = mockData.filterOptions.type;
const PROJECT_OPTIONS = mockData.filterOptions.project;
const OWNER_OPTIONS = mockData.filterOptions.owner;
const PRIORITY_OPTIONS = mockData.filterOptions.priority;

const SCOPE_MAP: Record<string, string> = mockData.scopeMap as Record<string, string>;
const SCOPE_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(SCOPE_MAP).map(([k, v]) => [v, k])
);
const VIEW_MAP: Record<string, string> = mockData.viewMap as Record<string, string>;
const VIEW_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(VIEW_MAP).map(([k, v]) => [v, k])
);

const COLUMN_CONFIG = mockData.columnConfig as { key: string; label: string; defaultVisible: boolean }[];

// Skeleton row for loading state
function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50">
      {Array.from({ length: 10 }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: i === 1 ? '60%' : i === 3 ? '40%' : '30%' }} />
        </td>
      ))}
    </tr>
  );
}

// Dropdown component
function FilterDropdown({
  label, options, value, onChange
}: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const display = value === '全部' ? '全部' : value;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "h-8 px-3 bg-white border rounded-md text-[13px] flex items-center justify-between gap-2 hover:bg-gray-50 min-w-[80px]",
          value !== '全部' ? "border-blue-300 text-blue-700" : "border-gray-200 text-gray-700"
        )}
      >
        <span className={value !== '全部' ? 'text-blue-500' : 'text-gray-500'}>{label}:</span> {display}
        <ChevronDown size={14} className={cn("text-gray-400 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-[140px]">
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={cn(
                "w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-50 transition-colors",
                opt === value ? "text-blue-600 bg-blue-50 font-medium" : "text-gray-700"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TaskListState() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial state from URL params
  const urlScope = searchParams.get('scope') || 'all';
  const urlStatus = searchParams.get('status') || '';
  const urlView = searchParams.get('view') || 'default';

  const [activeScope, setActiveScope] = useState(SCOPE_REVERSE[urlScope] || '全部任务');
  const [activeView, setActiveView] = useState(VIEW_REVERSE[urlView] || '默认视图');
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [filterStatus, setFilterStatus] = useState(STATUS_MAP[urlStatus] || '全部');
  const [filterType, setFilterType] = useState('全部');
  const [filterProject, setFilterProject] = useState('全部');
  const [filterOwner, setFilterOwner] = useState('全部');
  const [filterPriority, setFilterPriority] = useState('全部');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    COLUMN_CONFIG.forEach(col => { initial[col.key] = col.defaultVisible; });
    return initial;
  });
  const columnRef = useRef<HTMLDivElement>(null);

  // Close column settings on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (columnRef.current && !columnRef.current.contains(e.target as Node)) setColumnSettingsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [activeScope, activeView, filterStatus, filterType, filterProject, filterOwner, filterPriority, keyword]);

  // Sync filters to URL query params
  const syncToUrl = useCallback((updates: Record<string, string>) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([k, v]) => {
        if (v) next.set(k, v);
        else next.delete(k);
      });
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const handleScopeChange = (scope: string) => {
    setActiveScope(scope);
    syncToUrl({ scope: SCOPE_MAP[scope] || '' });
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    syncToUrl({ view: VIEW_MAP[view] || '' });
  };

  const handleStatusFilter = (v: string) => {
    setFilterStatus(v);
    syncToUrl({ status: v === '全部' ? '' : (STATUS_REVERSE[v] || '') });
  };

  const handleKeywordChange = (v: string) => {
    setKeyword(v);
    syncToUrl({ keyword: v });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterStatus('全部');
    setFilterType('全部');
    setFilterProject('全部');
    setFilterOwner('全部');
    setFilterPriority('全部');
    setKeyword('');
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters = filterStatus !== '全部' || filterType !== '全部' ||
    filterProject !== '全部' || filterOwner !== '全部' || filterPriority !== '全部' || keyword !== '';

  // ── Filtering pipeline ──
  // Step 1: Scope filtering (determines the "pool" of tasks)
  const scopeTasks = useMemo(() => {
    return ALL_TASKS.filter(task => {
      if (task.archived && activeView !== '已归档') return false;

      switch (activeScope) {
        case '我的任务':
          // 我创建 / 我负责 / 待我处理
          return task.ownerId === CURRENT_USER_ID || task.ownerId === CURRENT_USER_ID;
        case '团队任务':
          // 当前用户所在团队范围 — mock: 同一个项目下有我参与的任务的项目
          // Since it's mock, include all non-archived tasks
          return true;
        case '全部任务':
        default:
          return true;
      }
    });
  }, [activeScope, activeView]);

  // Step 2: View filtering on top of scope
  const viewTasks = useMemo(() => {
    switch (activeView) {
      case '我关注的':
        return scopeTasks.filter(t => t.starred);
      case '异常任务':
        return scopeTasks.filter(t => t.status === '异常');
      case '已归档':
        return scopeTasks.filter(t => t.archived);
      default:
        return scopeTasks;
    }
  }, [scopeTasks, activeView]);

  // Step 3: User-level filters (keyword, status, type, project, owner, priority)
  const filteredTasks = useMemo(() => {
    return viewTasks.filter(task => {
      if (keyword && !task.name.includes(keyword) && !task.subtitle.includes(keyword)) return false;
      if (filterStatus !== '全部' && task.status !== filterStatus) return false;
      if (filterType !== '全部' && task.type !== filterType) return false;
      if (filterProject !== '全部' && task.project !== filterProject) return false;
      if (filterOwner !== '全部' && task.owner !== filterOwner) return false;
      if (filterPriority !== '全部' && task.priority !== filterPriority) return false;
      return true;
    });
  }, [viewTasks, keyword, filterStatus, filterType, filterProject, filterOwner, filterPriority]);

  // KPI stats: based on scopeTasks (view-filtered, but NOT user-filtered)
  // This gives a stable "scope overview" independent of search/secondary filters
  const kpiStats = useMemo(() => ({
    all: scopeTasks.length,
    running: scopeTasks.filter(t => t.status === '执行中').length,
    pending: scopeTasks.filter(t => t.status === '待确认' || t.status === '待审核').length,
    completed: scopeTasks.filter(t => t.status === '已完成').length,
    abnormal: scopeTasks.filter(t => t.status === '异常').length,
  }), [scopeTasks]);

  const toggleTaskSelection = (id: string) => {
    setSelectedTasks(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map(t => t.id));
    }
  };

  // Quick filter by clicking status or owner in table
  const quickFilterStatus = (status: string) => {
    setFilterStatus(status);
    syncToUrl({ status: STATUS_REVERSE[status] || '' });
  };

  const quickFilterOwner = (owner: string) => {
    setFilterOwner(owner);
  };

  // Navigation handlers
  const goToTask = (taskId: string) => navigate(`/tasks/${taskId}`);
  const goToStage = (taskId: string, stageId: string) => navigate(`/tasks/${taskId}?focusStage=${stageId}`);
  const goToReviews = (taskId: string) => navigate(`/tasks/reviews?taskId=${taskId}`);
  const goToTaskCenter = () => navigate('/tasks');

  return (
    <div className="flex h-full bg-[#F8FAFC]">
      {/* Center Main Area */}
      <div className="flex-1 flex flex-col h-full relative border-r border-gray-200 min-w-0">
        <div className="flex-1 overflow-y-auto w-full py-6 px-6">
          <div className="w-full max-w-[1200px] mx-auto">

            {/* 1. Breadcrumbs + Title */}
            <div className="mb-6">
              <div className="flex items-center text-[12px] text-gray-500 mb-2">
                <button onClick={goToTaskCenter} className="hover:text-blue-600">任务</button>
                <span className="mx-1.5">/</span>
                <span className="text-gray-900 font-medium">全部任务</span>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-[24px] font-bold text-gray-900 mb-1.5">全部任务</h1>
                  <p className="text-[13px] text-gray-500">查看当前范围内的全部任务，支持按状态、类型、负责人和时间进行筛选与管理。</p>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <button className="h-8 px-4 bg-white border border-gray-200 text-gray-700 rounded-lg text-[13px] font-medium shadow-sm hover:bg-gray-50 flex items-center gap-1.5 transition-colors">
                    <Download size={14} /> 导出列表
                  </button>
                  <button
                    onClick={() => navigate('/ai-workbench')}
                    className="h-8 px-4 bg-blue-600 text-white rounded-lg text-[13px] font-medium shadow-sm hover:bg-blue-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Plus size={14} /> 新建任务
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Scope & View Switch */}
            <div className="flex items-center justify-between border-b border-gray-200 mb-6">
              <div className="flex gap-6 relative top-[1px]">
                {['我的任务', '团队任务', '全部任务'].map(scope => (
                  <button
                    key={scope}
                    onClick={() => handleScopeChange(scope)}
                    className={cn(
                      "px-1 py-2.5 text-[14px] font-medium transition-colors border-b-2",
                      activeScope === scope ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-gray-900"
                    )}
                  >
                    {scope}
                  </button>
                ))}
              </div>
              <div className="flex bg-gray-100/80 p-0.5 rounded-lg border border-gray-200/50 mb-2">
                {[
                  { id: '默认视图', icon: <LayoutGrid size={13} /> },
                  { id: '我关注的', icon: <Star size={13} /> },
                  { id: '异常任务', icon: <AlertCircle size={13} /> },
                  { id: '已归档', icon: <Archive size={13} /> },
                ].map(view => (
                  <button
                    key={view.id}
                    onClick={() => handleViewChange(view.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all shadow-sm",
                      activeView === view.id ? "bg-white text-gray-900 border border-gray-200/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 border-transparent"
                    )}
                  >
                    {view.icon} {view.id}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Stats Bar */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              {[
                { label: '全部任务', value: kpiStats.all, color: 'bg-blue-500', textColor: 'text-gray-800', filter: '' },
                { label: '执行中', value: kpiStats.running, color: 'bg-blue-400', textColor: 'text-blue-600', filter: '执行中' },
                { label: '待确认', value: kpiStats.pending, color: 'bg-amber-500', textColor: 'text-amber-600', filter: '待确认' },
                { label: '已完成', value: kpiStats.completed, color: 'bg-green-500', textColor: 'text-green-600', filter: '已完成' },
                { label: '异常任务', value: kpiStats.abnormal, color: 'bg-red-500', textColor: 'text-red-600', filter: '异常' },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => item.filter ? quickFilterStatus(item.filter) : handleStatusFilter('全部')}
                  className="bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm flex flex-col hover:border-blue-200 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium mb-1.5">
                    <div className={cn("w-1.5 h-1.5 rounded-full", item.color)} /> {item.label}
                  </div>
                  <div className={cn("text-[24px] font-bold", item.textColor)}>{item.value}</div>
                </button>
              ))}
            </div>

            {/* 4. Filter Toolbar */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={e => handleKeywordChange(e.target.value)}
                    placeholder="搜索任务名称"
                    className="w-full h-8 pl-8 pr-8 text-[13px] bg-gray-50 border border-gray-200 rounded-md focus:border-blue-500 focus:bg-white outline-none transition-colors placeholder:text-gray-400"
                  />
                  {keyword && (
                    <button onClick={() => handleKeywordChange('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X size={14} />
                    </button>
                  )}
                </div>
                <FilterDropdown label="状态" options={STATUS_OPTIONS} value={filterStatus} onChange={handleStatusFilter} />
                <FilterDropdown label="类型" options={TYPE_OPTIONS} value={filterType} onChange={setFilterType} />
                <FilterDropdown label="项目" options={PROJECT_OPTIONS} value={filterProject} onChange={setFilterProject} />
                <FilterDropdown label="负责人" options={OWNER_OPTIONS} value={filterOwner} onChange={setFilterOwner} />
                <FilterDropdown label="优先级" options={PRIORITY_OPTIONS} value={filterPriority} onChange={setFilterPriority} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button className="h-8 px-3 bg-white border border-gray-200 text-gray-700 rounded-md text-[13px] flex items-center justify-between gap-2 hover:bg-gray-50 min-w-[120px]">
                    <span className="text-gray-500">时间:</span> 最近更新时间 <ChevronDown size={14} className="text-gray-400" />
                  </button>
                  {hasActiveFilters ? (
                    <button onClick={resetFilters} className="text-[13px] text-blue-600 hover:text-blue-700 font-medium px-2">重置筛选</button>
                  ) : (
                    <span className="text-[13px] text-gray-400 px-2">重置筛选</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <span className="text-gray-500">排序:</span>
                  <button className="font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1">最近更新 <ChevronDown size={14} className="text-gray-400" /></button>
                  <div className="w-px h-4 bg-gray-200 mx-2" />
                  <button className="text-gray-600 hover:text-gray-900 flex items-center gap-1.5 px-2 font-medium">
                    <List size={14} /> 批量操作
                  </button>
                  <div className="relative" ref={columnRef}>
                    <button
                      onClick={() => setColumnSettingsOpen(!columnSettingsOpen)}
                      className={cn("text-gray-600 hover:text-gray-900 flex items-center gap-1.5 px-2 font-medium", columnSettingsOpen && "text-blue-600")}
                    >
                      <Settings size={14} /> 列设置
                    </button>
                    {columnSettingsOpen && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2 w-[180px]">
                        <div className="px-3 pb-2 text-[12px] text-gray-400 font-medium">显示列</div>
                        {COLUMN_CONFIG.map(col => (
                          <label key={col.key} className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={visibleColumns[col.key]}
                              onChange={e => setVisibleColumns(prev => ({ ...prev, [col.key]: e.target.checked }))}
                              className="rounded border-gray-300 text-blue-600"
                            />
                            <span className="text-[13px] text-gray-700">{col.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Batch Selection Bar */}
            {selectedTasks.length > 0 && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 pl-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">{selectedTasks.length}</div>
                  <span className="text-[13px] text-blue-800 font-medium">已选择 {selectedTasks.length} 个任务</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="h-7 px-3 bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 rounded text-[12px] font-medium transition-colors">批量转派</button>
                  <button className="h-7 px-3 bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 rounded text-[12px] font-medium transition-colors">批量归档</button>
                  <button className="h-7 px-3 bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 rounded text-[12px] font-medium transition-colors">批量导出</button>
                  <div className="w-px h-3 bg-blue-200 mx-1" />
                  <button onClick={() => setSelectedTasks([])} className="text-blue-500 hover:text-blue-700 px-1 text-[13px]">关闭 ✕</button>
                </div>
              </div>
            )}

            {/* 6. Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200">
                      <th className="px-4 py-3 w-10">
                        <input
                          type="checkbox"
                          checked={selectedTasks.length > 0 && selectedTasks.length === filteredTasks.length}
                          onChange={selectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
                      <th className="px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">任务名称</th>
                      {visibleColumns.type && <th className="px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">类型</th>}
                      {visibleColumns.project && <th className="px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">所属项目</th>}
                      {visibleColumns.stage && <th className="px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">当前阶段</th>}
                      {visibleColumns.owner && <th className="px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">负责人</th>}
                      {visibleColumns.priority && <th className="px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase tracking-wider text-center">优先级</th>}
                      {visibleColumns.pending && <th className="px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase tracking-wider text-center">待处理</th>}
                      {visibleColumns.status && <th className="px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">状态</th>}
                      {visibleColumns.updatedAt && <th className="px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">最近更新时间</th>}
                      <th className="px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase tracking-wider text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                    ) : filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <Inbox size={40} className="text-gray-300" />
                            <p className="text-[14px] text-gray-500">没有符合条件的任务</p>
                            {hasActiveFilters && (
                              <button
                                onClick={resetFilters}
                                className="text-[13px] text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 bg-blue-50 rounded-lg"
                              >
                                重置筛选
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50/80 transition-colors group">
                          <td className="px-4 py-3.5">
                            <input
                              type="checkbox"
                              checked={selectedTasks.includes(row.id)}
                              onChange={() => toggleTaskSelection(row.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-opacity opacity-50 group-hover:opacity-100 checked:opacity-100"
                            />
                          </td>
                          <td className="px-4 py-3.5 min-w-[200px]">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5">
                                {row.starred && <Star size={12} className="text-amber-400 fill-amber-400 flex-shrink-0" />}
                                <button
                                  onClick={() => goToTask(row.id)}
                                  className="text-[13.5px] font-medium text-blue-600 hover:text-blue-800 hover:underline text-left truncate max-w-[220px]"
                                >
                                  {row.name}
                                </button>
                              </div>
                              <span className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[220px] pl-">{row.subtitle}</span>
                            </div>
                          </td>
                          {visibleColumns.type && (
                            <td className="px-4 py-3.5">
                              <span className="text-[13px] text-gray-700">{row.type}</span>
                            </td>
                          )}
                          {visibleColumns.project && (
                            <td className="px-4 py-3.5">
                              <span className="text-[13px] text-gray-500">{row.project}</span>
                            </td>
                          )}
                          {visibleColumns.stage && (
                            <td className="px-4 py-3.5 min-w-[160px]">
                              <button
                                onClick={() => goToStage(row.id, row.stageId)}
                                className="flex flex-col gap-1.5 hover:bg-gray-100 p-1.5 -ml-1.5 rounded-md transition-colors w-fit text-left"
                              >
                                <span className="text-[13px] text-gray-800 font-medium hover:text-blue-600">{row.stage} <span className="text-gray-400 font-normal ml-1">{row.stageProgress}</span></span>
                                <div className="flex items-center gap-2">
                                  <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                      className={cn("h-full rounded-full", row.progress === 100 ? "bg-green-500" : "bg-blue-500")}
                                      style={{ width: `${row.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-[11px] font-mono text-gray-500">{row.progress}%</span>
                                </div>
                              </button>
                            </td>
                          )}
                          {visibleColumns.owner && (
                            <td className="px-4 py-3.5">
                              <button
                                onClick={() => quickFilterOwner(row.owner)}
                                className="flex items-center gap-2 hover:bg-gray-100 p-1 -ml-1 rounded transition-colors"
                              >
                                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                                  {row.owner.charAt(0)}
                                </div>
                                <span className="text-[13px] text-gray-700">{row.owner}</span>
                              </button>
                            </td>
                          )}
                          {visibleColumns.priority && (
                            <td className="px-4 py-3.5 text-center">
                              <div className="inline-flex items-center gap-1.5">
                                <div className={cn("w-2 h-2 rounded-full",
                                  row.priority === '高' ? "bg-red-500" :
                                    row.priority === '中' ? "bg-amber-500" : "bg-gray-400"
                                )} />
                                <span className="text-[12px] text-gray-600">{row.priority}</span>
                              </div>
                            </td>
                          )}
                          {visibleColumns.pending && (
                            <td className="px-4 py-3.5 text-center">
                              {row.pendingCount > 0 ? (
                                <button
                                  onClick={() => goToReviews(row.id)}
                                  className="inline-flex items-center justify-center min-w-[18px] h-5 px-1 bg-amber-50 border border-amber-200 text-amber-700 rounded text-[11px] font-bold hover:bg-amber-100 transition-colors"
                                >
                                  {row.pendingCount}
                                </button>
                              ) : (
                                <span className="text-gray-300 text-[12px] font-mono">0</span>
                              )}
                            </td>
                          )}
                          {visibleColumns.status && (
                            <td className="px-4 py-3.5">
                              <button
                                onClick={() => quickFilterStatus(row.status)}
                                className={cn("inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium border hover:opacity-80 transition-opacity",
                                  row.status === '执行中' ? "bg-blue-50 text-blue-700 border-blue-100" :
                                    row.status === '已完成' ? "bg-green-50 text-green-700 border-green-100" :
                                      row.status === '待确认' ? "bg-amber-50 text-amber-700 border-amber-100" :
                                        row.status === '待审核' ? "bg-amber-50 text-amber-700 border-amber-100" :
                                          row.status === '异常' ? "bg-red-50 text-red-700 border-red-100" : ""
                                )}
                              >
                                {row.status}
                              </button>
                            </td>
                          )}
                          {visibleColumns.updatedAt && (
                            <td className="px-4 py-3.5 text-[12px] text-gray-500 font-mono">
                              {row.updatedAt}
                            </td>
                          )}
                          <td className="px-4 py-3.5 text-center">
                            <button className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                              <MoreHorizontal size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 7. Pagination */}
            {!loading && filteredTasks.length > 0 && (
              <div className="flex items-center justify-between mb-8">
                <div className="text-[13px] text-gray-500">
                  共 <span className="font-semibold text-gray-900 pr-1">{filteredTasks.length}</span> 条任务记录
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 h-8 text-[13px] text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors">上一页</button>
                  <div className="flex items-center gap-1">
                    <button className="w-8 h-8 flex items-center justify-center text-[13px] font-medium rounded bg-blue-50 text-blue-600 border border-blue-200">1</button>
                  </div>
                  <button className="px-3 h-8 text-[13px] text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors">下一页</button>
                  <div className="ml-4 h-8 px-2 flex items-center gap-2 text-[13px] text-gray-500 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition-colors">
                    20 条/页 <ChevronDown size={14} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[320px] bg-[#F8FAFC] flex flex-col flex-shrink-0 border-l border-gray-200 z-10 px-5 py-6 space-y-6 overflow-y-auto hidden lg:flex">

        {/* Filter Summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-[14px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Filter size={15} className="text-gray-400" /> 筛选摘要
          </h3>
          <div className="space-y-3 mb-4">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">当前范围</span>
              <span className="text-[13px] text-gray-900 font-medium">{activeScope}</span>
            </div>
            <div className="flex flex-col gap-1 border-t border-gray-100 pt-3">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">视图</span>
              <span className={cn("text-[13px]", activeView !== '默认视图' ? "text-blue-600 font-medium" : "text-gray-800")}>{activeView}</span>
            </div>
            <div className="flex border-t border-gray-100 pt-3">
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">状态</span>
                <span className={cn("text-[13px]", filterStatus !== '全部' ? "text-blue-600 font-medium" : "text-gray-800")}>{filterStatus}</span>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">类型</span>
                <span className={cn("text-[13px]", filterType !== '全部' ? "text-blue-600 font-medium" : "text-gray-800")}>{filterType}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 border-t border-gray-100 pt-3">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">项目</span>
              <span className={cn("text-[13px] truncate", filterProject !== '全部' ? "text-blue-600 bg-blue-50/50 px-2 py-1 rounded-md border border-blue-100/50 w-fit font-medium" : "text-gray-800")}>{filterProject !== '全部' ? filterProject : '全部'}</span>
            </div>
            {(filterOwner !== '全部' || filterPriority !== '全部' || keyword) && (
              <div className="flex border-t border-gray-100 pt-3 gap-4">
                {filterOwner !== '全部' && (
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">负责人</span>
                    <span className="text-[13px] text-blue-600 font-medium">{filterOwner}</span>
                  </div>
                )}
                {filterPriority !== '全部' && (
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">优先级</span>
                    <span className="text-[13px] text-blue-600 font-medium">{filterPriority}</span>
                  </div>
                )}
              </div>
            )}
            {keyword && (
              <div className="flex flex-col gap-1 border-t border-gray-100 pt-3">
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">关键词</span>
                <span className="text-[13px] text-blue-600 font-medium">"{keyword}"</span>
              </div>
            )}
          </div>
          <button
            onClick={resetFilters}
            className="text-[12px] text-blue-600 hover:text-blue-800 font-medium w-full text-center py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            清空全部筛选
          </button>
        </div>

        {/* Quick Views */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-[14px] font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Star size={15} className="text-gray-400" /> 快捷视图
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => handleViewChange('我关注的')}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors group"
            >
              <span className="text-[13px] text-gray-700 flex items-center gap-2 group-hover:text-blue-600"><Star size={14} className="text-gray-400 group-hover:text-blue-500" /> 我关注的任务</span>
              <span className="text-[12px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{kpiStats.all > 0 ? Math.round(kpiStats.all * 0.4) : 0}</span>
            </button>
            <button
              onClick={() => { handleViewChange('异常任务'); quickFilterStatus('异常'); }}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-red-50 rounded-lg transition-colors group"
            >
              <span className="text-[13px] text-gray-700 flex items-center gap-2 group-hover:text-red-700"><AlertCircle size={14} className="text-red-400 group-hover:text-red-500" /> 异常任务</span>
              <span className="text-[12px] font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded-full">{kpiStats.abnormal}</span>
            </button>
            <button
              onClick={() => quickFilterStatus('待审核')}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-amber-50 rounded-lg transition-colors group"
            >
              <span className="text-[13px] text-gray-700 flex items-center gap-2 group-hover:text-amber-700"><Users size={14} className="text-amber-400 group-hover:text-amber-500" /> 待我审核</span>
              <span className="text-[12px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">{kpiStats.pending}</span>
            </button>
            <button
              onClick={() => quickFilterStatus('已完成')}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-green-50 rounded-lg transition-colors group"
            >
              <span className="text-[13px] text-gray-700 flex items-center gap-2 group-hover:text-green-700"><CheckCircle2 size={14} className="text-green-400 group-hover:text-green-500" /> 近 7 天完成</span>
              <span className="text-[12px] font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{kpiStats.completed}</span>
            </button>
          </div>
        </div>

        {/* Help & Tips */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-[14px] font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <HelpCircle size={15} className="text-blue-500" /> 说明 / 提示
          </h3>
          <ul className="space-y-3 pl-1">
            <li className="flex items-start gap-2.5">
              <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
              <span className="text-[12px] text-gray-600 leading-relaxed">支持勾选左侧选择框批量管理任务。</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
              <span className="text-[12px] text-gray-600 leading-relaxed">点击 <span className="font-medium text-gray-800">任务名称</span> 进入详情页，点击进度条可直达当前阶段。</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
              <span className="text-[12px] text-gray-600 leading-relaxed">点击表格中的 <span className="font-medium text-gray-800">状态</span> 或 <span className="font-medium text-gray-800">负责人</span> 可快速添加筛选。</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
              <span className="text-[12px] text-gray-600 leading-relaxed">可通过顶部的「导出列表」一键导出当前筛选结果。</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
