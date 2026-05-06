import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, Search, RotateCcw, Settings,
  X, Download, ListTodo, FileText, Eye, AlertTriangle,
  Clock, Play, Sparkles, User, CheckCircle2, RefreshCw,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import reviewQueueData from '@/mock/review-queue.json';
import type {
  ReviewQueueItem, ReviewQueueTabKey, ReviewItemStatus,
} from '@/types/review-queue';
import {
  REVIEW_TYPE_LABEL, REVIEW_STATUS_LABEL, PRIORITY_LABEL,
  SORT_OPTIONS, TAB_LIST, PRIORITY_ORDER,
} from '@/types/review-queue';

// ─── Constants ────────────────────────────────────────────────────────

const ASSIGNEE_OPTIONS = [
  { id: 'zhangyue', name: '张悦' },
  { id: 'chenchen', name: '陈晨' },
  { id: 'wangqiang', name: '王强' },
  { id: 'sunhao', name: '孙浩' },
];

const DUE_OPTIONS = [
  { label: '全部', value: 'ALL' },
  { label: '今天到期', value: 'TODAY' },
  { label: '近 3 天', value: 'THREE_DAYS' },
  { label: '已逾期', value: 'OVERDUE' },
];

const ALL_COLUMNS = [
  { key: 'type', label: '类型' },
  { key: 'sourceTask', label: '来源任务' },
  { key: 'stage', label: '所属阶段' },
  { key: 'initiator', label: '发起人' },
  { key: 'initTime', label: '发起时间' },
  { key: 'priority', label: '优先级' },
  { key: 'deadline', label: '截止时间' },
  { key: 'status', label: '状态' },
];

// ─── Main Component ───────────────────────────────────────────────────

export default function ReviewQueue() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialAssignee = useRef(searchParams.get('assignee'));

  // Loading / error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [items, setItems] = useState<ReviewQueueItem[]>([]);

  // Tab
  const [activeTab, setActiveTab] = useState<ReviewQueueTabKey>(() => {
    const t = searchParams.get('type');
    return (TAB_LIST.some(tb => tb.key === t) ? t : 'ALL') as ReviewQueueTabKey;
  });

  // Filters
  const [keywordInput, setKeywordInput] = useState(searchParams.get('keyword') || '');
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');
  const [priorityFilter, setPriorityFilter] = useState(searchParams.get('priority') || 'ALL');
  const [sourceTaskFilter, setSourceTaskFilter] = useState(searchParams.get('sourceTaskId') || 'ALL');
  const [initiatorFilter, setInitiatorFilter] = useState(searchParams.get('initiator') || 'ALL');
  const [dueFilter, setDueFilter] = useState(searchParams.get('due') || 'ALL');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'PRIORITY');

  // Pagination
  const [page, setPage] = useState(() => parseInt(searchParams.get('page') || '1', 10));
  const [pageSize, setPageSize] = useState(() => parseInt(searchParams.get('pageSize') || '10', 10));

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Column settings
  const [showColSettings, setShowColSettings] = useState(false);
  const [visibleCols, setVisibleCols] = useState<string[]>(ALL_COLUMNS.map(c => c.key));

  // Assign modal
  const [showAssignModal, setShowAssignModal] = useState(false);

  // ── Effects ─────────────────────────────────────────────────────────

  // Debounced keyword
  useEffect(() => {
    const t = setTimeout(() => { setKeyword(keywordInput); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [keywordInput]);

  // Simulate loading
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        setItems((reviewQueueData as unknown as { items: ReviewQueueItem[] }).items);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    }, 600);
    return () => clearTimeout(t);
  }, []);

  // Sync URL
  useEffect(() => {
    const p = new URLSearchParams();
    if (initialAssignee.current) p.set('assignee', initialAssignee.current);
    if (activeTab !== 'ALL') p.set('type', activeTab);
    if (keyword) p.set('keyword', keyword);
    if (statusFilter !== 'ALL') p.set('status', statusFilter);
    if (priorityFilter !== 'ALL') p.set('priority', priorityFilter);
    if (sourceTaskFilter !== 'ALL') p.set('sourceTaskId', sourceTaskFilter);
    if (initiatorFilter !== 'ALL') p.set('initiator', initiatorFilter);
    if (dueFilter !== 'ALL') p.set('due', dueFilter);
    if (sortBy !== 'PRIORITY') p.set('sortBy', sortBy);
    p.set('page', String(page));
    if (pageSize !== 10) p.set('pageSize', String(pageSize));
    setSearchParams(p, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, keyword, statusFilter, priorityFilter, sourceTaskFilter, initiatorFilter, dueFilter, sortBy, page, pageSize]);

  // ── Computed ────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const active = items.filter(i => !['DONE', 'IGNORED'].includes(i.status));
    return {
      total: active.length,
      confirm: active.filter(i => i.type === 'CONFIRM').length,
      approval: active.filter(i => i.type === 'APPROVAL').length,
      exception: active.filter(i => i.type === 'EXCEPTION').length,
      resume: active.filter(i => i.type === 'RESUME').length,
      dueSoon: active.filter(i => i.dueLabel.includes('今天')).length,
      highPriority: active.filter(i => i.priority === 'HIGH').length,
      createdByMe: active.filter(i => i.initiator.id === 'liming').length,
    };
  }, [items]);

  const filterOptions = useMemo(() => ({
    statuses: [
      { label: '全部', value: 'ALL' },
      ...Object.entries(REVIEW_STATUS_LABEL).map(([v, l]) => ({ label: l, value: v })),
    ],
    types: [
      { label: '全部', value: 'ALL' },
      ...Object.entries(REVIEW_TYPE_LABEL).map(([v, l]) => ({ label: l, value: v })),
    ],
    sourceTasks: [
      { label: '全部', value: 'ALL' },
      ...[...new Map(items.map(i => [i.sourceTaskId, i.sourceTaskName])).entries()]
        .map(([v, l]) => ({ label: l, value: v })),
    ],
    initiators: [
      { label: '全部', value: 'ALL' },
      ...[...new Map(items.map(i => [i.initiator.id, i.initiator.name])).entries()]
        .map(([v, l]) => ({ label: l, value: v })),
    ],
    priorities: [
      { label: '全部', value: 'ALL' },
      ...Object.entries(PRIORITY_LABEL).map(([v, l]) => ({ label: l, value: v })),
    ],
  }), [items]);

  const matchDue = useCallback((item: ReviewQueueItem, due: string): boolean => {
    if (due === 'ALL') return true;
    if (due === 'TODAY') return item.dueLabel.includes('今天');
    if (due === 'THREE_DAYS') return item.dueLabel.includes('今天') || item.dueLabel.includes('明天') || item.dueLabel.includes('近');
    if (due === 'OVERDUE') return item.dueLabel === '尽快处理';
    return true;
  }, []);

  const filteredItems = useMemo(() => {
    let result = items;

    if (activeTab !== 'ALL') result = result.filter(i => i.type === activeTab);
    if (keyword) {
      const kw = keyword.toLowerCase();
      result = result.filter(i =>
        i.title.toLowerCase().includes(kw) ||
        i.sourceTaskName.toLowerCase().includes(kw) ||
        i.stageName.toLowerCase().includes(kw)
      );
    }
    if (statusFilter !== 'ALL') result = result.filter(i => i.status === statusFilter);
    if (priorityFilter !== 'ALL') result = result.filter(i => i.priority === priorityFilter);
    if (sourceTaskFilter !== 'ALL') result = result.filter(i => i.sourceTaskId === sourceTaskFilter);
    if (initiatorFilter !== 'ALL') result = result.filter(i => i.initiator.id === initiatorFilter);
    result = result.filter(i => matchDue(i, dueFilter));

    // Sort
    const sorted = [...result];
    sorted.sort((a, b) => {
      if (sortBy === 'PRIORITY') return (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9);
      if (sortBy === 'DEADLINE') {
        const aUrg = a.dueLabel === '尽快处理' ? -1 : a.dueLabel.includes('今天') ? 0 : 1;
        const bUrg = b.dueLabel === '尽快处理' ? -1 : b.dueLabel.includes('今天') ? 0 : 1;
        return aUrg - bUrg;
      }
      if (sortBy === 'CREATED_AT') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'SOURCE_TASK') return a.sourceTaskName.localeCompare(b.sourceTaskName);
      return 0;
    });
    return sorted;
  }, [items, activeTab, keyword, statusFilter, priorityFilter, sourceTaskFilter, initiatorFilter, dueFilter, sortBy, matchDue]);

  const totalFiltered = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const paginatedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  const hasActiveFilters = activeTab !== 'ALL' || keyword || statusFilter !== 'ALL' ||
    priorityFilter !== 'ALL' || sourceTaskFilter !== 'ALL' || initiatorFilter !== 'ALL' || dueFilter !== 'ALL';

  // ── Handlers ────────────────────────────────────────────────────────

  const handleTabChange = (tab: ReviewQueueTabKey) => { setActiveTab(tab); setPage(1); };
  const handleFilterChange = (key: string, value: string) => {
    setPage(1);
    if (key === 'status') setStatusFilter(value);
    else if (key === 'priority') setPriorityFilter(value);
    else if (key === 'sourceTaskId') setSourceTaskFilter(value);
    else if (key === 'initiator') setInitiatorFilter(value);
    else if (key === 'due') setDueFilter(value);
  };
  const handleResetFilters = () => {
    setActiveTab('ALL'); setKeyword(''); setKeywordInput('');
    setStatusFilter('ALL'); setPriorityFilter('ALL'); setSourceTaskFilter('ALL');
    setInitiatorFilter('ALL'); setDueFilter('ALL'); setSortBy('PRIORITY'); setPage(1);
  };
  const handleSortChange = (value: string) => setSortBy(value);

  const toggleSelect = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const toggleSelectAll = () => {
    const pageIds = paginatedItems.map(i => i.id);
    const allSelected = pageIds.every(id => selectedIds.includes(id));
    setSelectedIds(allSelected ? selectedIds.filter(id => !pageIds.includes(id)) : [...new Set([...selectedIds, ...pageIds])]);
  };
  const clearSelection = () => setSelectedIds([]);

  const handleBulkConfirm = () => {
    setItems(prev => prev.map(i => selectedIds.includes(i.id) && i.type === 'CONFIRM' && i.status === 'PENDING' ? { ...i, status: 'DONE' as ReviewItemStatus } : i));
    setSelectedIds([]);
  };
  const handleBulkIgnore = () => {
    setItems(prev => prev.map(i => selectedIds.includes(i.id) && !['DONE'].includes(i.status) ? { ...i, status: 'IGNORED' as ReviewItemStatus } : i));
    setSelectedIds([]);
  };
  const handleBulkAssign = (targetId: string) => {
    const targetName = ASSIGNEE_OPTIONS.find(a => a.id === targetId)?.name || '';
    setItems(prev => prev.map(i => selectedIds.includes(i.id) ? { ...i, assignee: { id: targetId, name: targetName } } : i));
    setSelectedIds([]);
    setShowAssignModal(false);
  };

  const handleAction = (item: ReviewQueueItem) => navigate(item.targetUrl);
  const handleItemClick = (item: ReviewQueueItem) => navigate(item.targetUrl);
  const handleSourceTaskClick = (taskId: string) => navigate(`/tasks/${taskId}`);

  const handleQuickView = (query: Record<string, string>) => {
    if (query.type) { setActiveTab(query.type as ReviewQueueTabKey); }
    if (query.priority) setPriorityFilter(query.priority);
    if (query.due) setDueFilter(query.due);
    if (query.initiator) setInitiatorFilter(query.initiator);
    setPage(1);
  };

  const handlePageChange = (p: number) => { setPage(p); setSelectedIds([]); };
  const handlePageSizeChange = (size: number) => { setPageSize(size); setPage(1); setSelectedIds([]); };
  const handleRetry = () => { setLoading(true); setError(false); setTimeout(() => { setItems((reviewQueueData as unknown as { items: ReviewQueueItem[] }).items); setLoading(false); }, 600); };

  // Bulk availability
  const selectedItems = items.filter(i => selectedIds.includes(i.id));
  const canBulkConfirm = selectedItems.some(i => i.type === 'CONFIRM' && i.status === 'PENDING');
  const canBulkIgnore = selectedItems.some(i => !['DONE'].includes(i.status));
  const canBulkAssign = selectedItems.some(i => !['DONE', 'IGNORED'].includes(i.status));

  // ── Loading Skeleton ────────────────────────────────────────────────

  if (loading) return (
    <div className="flex-1 flex bg-[#F8FAFC] overflow-hidden">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-7 w-52 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-96 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="flex gap-3">
            <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="flex gap-8 mb-6 border-b border-gray-200 pb-1">
          {[80, 60, 60, 60, 80].map((w, i) => <div key={i} className="h-5 rounded animate-pulse bg-gray-200" style={{ width: w }} />)}
        </div>
        <div className="grid grid-cols-5 gap-4 mb-6">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-[88px] bg-white border border-gray-100 rounded-xl animate-pulse" />)}
        </div>
        <div className="bg-white border border-gray-200 rounded-xl h-16 mb-4 animate-pulse" />
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 border-b border-gray-50 animate-pulse bg-gray-50/50" />)}
        </div>
      </div>
      <div className="w-[320px] border-l border-gray-200 p-4 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 bg-white border border-gray-100 rounded-xl animate-pulse" />)}
      </div>
    </div>
  );

  // ── Error State ─────────────────────────────────────────────────────

  if (error) return (
    <div className="flex-1 flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center">
        <AlertTriangle size={40} className="mx-auto text-red-400 mb-4" />
        <p className="text-[16px] text-gray-700 font-medium mb-2">事项数据加载失败，请稍后重试。</p>
        <button onClick={handleRetry} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-[14px] font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
          <RefreshCw size={16} /> 重新加载
        </button>
      </div>
    </div>
  );

  // ── Main Render ─────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex bg-[#F8FAFC] overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
        <div className="p-6 pb-20">
          {/* Breadcrumb & Title */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-[13px] text-gray-400 mb-2">
                <span className="hover:text-gray-600 cursor-pointer" onClick={() => navigate('/tasks')}>任务</span>
                <ChevronRight size={14} />
                <span className="text-gray-600">待我处理</span>
              </div>
              <h1 className="text-[24px] font-bold text-gray-900 mb-1">待我处理</h1>
              <p className="text-[14px] text-gray-500">查看待确认、待审核、异常处理与继续执行事项，按优先级和来源任务快速推进处理。</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[14px] font-medium hover:bg-blue-700 transition-colors shadow-sm">批量处理</button>
              <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-[14px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download size={16} /> 导出事项
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-8 mb-6 border-b border-gray-200">
            {TAB_LIST.map(tab => (
              <button key={tab.key} onClick={() => handleTabChange(tab.key)}
                className={cn("pb-3 text-[14px] font-medium transition-all relative", activeTab === tab.key ? "text-blue-600" : "text-gray-500 hover:text-gray-700")}>
                {tab.label}
                {activeTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
              </button>
            ))}
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {([
              { label: '全部事项', value: stats.total, color: 'blue', icon: ListTodo, tab: 'ALL' as ReviewQueueTabKey },
              { label: '待确认', value: stats.confirm, color: 'orange', icon: FileText, tab: 'CONFIRM' as ReviewQueueTabKey },
              { label: '待审核', value: stats.approval, color: 'orange', icon: Eye, tab: 'APPROVAL' as ReviewQueueTabKey },
              { label: '异常处理', value: stats.exception, color: 'red', icon: AlertTriangle, tab: 'EXCEPTION' as ReviewQueueTabKey },
              { label: '继续执行', value: stats.resume, color: 'green', icon: Play, tab: 'RESUME' as ReviewQueueTabKey },
            ]).map(card => (
              <button key={card.label} onClick={() => handleTabChange(card.tab)}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all text-left group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] text-gray-500 font-medium">{card.label}</span>
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center",
                    card.color === 'blue' ? 'bg-blue-50 text-blue-600' : card.color === 'orange' ? 'bg-orange-50 text-orange-600' : card.color === 'red' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600')}>
                    <card.icon size={16} />
                  </div>
                </div>
                <span className="text-[24px] font-bold text-gray-900">{card.value}</span>
              </button>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="搜索事项名称" value={keywordInput}
                  onChange={e => setKeywordInput(e.target.value)}
                  className="w-full h-9 pl-10 pr-4 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-lg text-[13px] outline-none transition-all" />
              </div>
              <FilterDropdown label="状态" options={filterOptions.statuses} value={statusFilter} onChange={v => handleFilterChange('status', v)} />
              <FilterDropdown label="类型" options={filterOptions.types} value={activeTab === 'ALL' ? 'ALL' : activeTab} onChange={v => { if (v !== 'ALL') handleTabChange(v as ReviewQueueTabKey); else handleTabChange('ALL'); }} />
              <FilterDropdown label="来源任务" options={filterOptions.sourceTasks} value={sourceTaskFilter} onChange={v => handleFilterChange('sourceTaskId', v)} />
              <FilterDropdown label="发起人" options={filterOptions.initiators} value={initiatorFilter} onChange={v => handleFilterChange('initiator', v)} />
              <FilterDropdown label="优先级" options={filterOptions.priorities} value={priorityFilter} onChange={v => handleFilterChange('priority', v)} />
              <FilterDropdown label="截止时间" options={DUE_OPTIONS} value={dueFilter} onChange={v => handleFilterChange('due', v)} />
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="flex items-center gap-4">
                <FilterDropdown label="排序" options={SORT_OPTIONS} value={sortBy} onChange={handleSortChange} />
                <button onClick={handleResetFilters} className="text-[13px] text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                  <RotateCcw size={14} /> 重置筛选
                </button>
              </div>
              <div className="relative">
                <button onClick={() => setShowColSettings(!showColSettings)} className="text-[13px] text-gray-600 hover:text-gray-900 flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg">
                  <Settings size={14} /> 列设置
                </button>
                {showColSettings && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2 w-36">
                    {ALL_COLUMNS.map(col => (
                      <label key={col.key} className="flex items-center gap-2 px-3 py-1.5 text-[13px] text-gray-700 hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" checked={visibleCols.includes(col.key)}
                          onChange={() => setVisibleCols(prev => prev.includes(col.key) ? prev.filter(k => k !== col.key) : [...prev, col.key])}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600" />
                        {col.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Batch Selection Bar */}
          {selectedIds.length > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-[14px] text-blue-700 font-medium">已选择 {selectedIds.length} 个事项</span>
                <div className="h-4 w-px bg-blue-200" />
                <div className="flex items-center gap-2">
                  <button onClick={handleBulkConfirm} disabled={!canBulkConfirm}
                    title={!canBulkConfirm ? '仅支持待确认事项' : ''}
                    className={cn("px-3 py-1 text-[12px] font-medium rounded-md shadow-sm transition-colors", canBulkConfirm ? "bg-white border border-blue-200 text-blue-600 hover:bg-blue-50" : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed")}>
                    批量确认
                  </button>
                  <button onClick={() => canBulkAssign && setShowAssignModal(true)} disabled={!canBulkAssign}
                    title={!canBulkAssign ? '所有选中事项已完成' : ''}
                    className={cn("px-3 py-1 text-[12px] font-medium rounded-md shadow-sm transition-colors", canBulkAssign ? "bg-white border border-blue-200 text-blue-600 hover:bg-blue-50" : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed")}>
                    批量转派
                  </button>
                  <button onClick={handleBulkIgnore} disabled={!canBulkIgnore}
                    title={!canBulkIgnore ? '没有可忽略的事项' : ''}
                    className={cn("px-3 py-1 text-[12px] font-medium rounded-md shadow-sm transition-colors", canBulkIgnore ? "bg-white border border-blue-200 text-blue-600 hover:bg-blue-50" : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed")}>
                    批量忽略
                  </button>
                </div>
              </div>
              <button onClick={clearSelection} className="p-1 hover:bg-blue-100 rounded-md text-blue-500 transition-colors"><X size={16} /></button>
            </div>
          )}

          {/* Table or Empty State */}
          {totalFiltered === 0 ? (
            hasActiveFilters ? (
              <div className="bg-white border border-gray-200 rounded-xl py-16 text-center">
                <Search size={36} className="mx-auto text-gray-300 mb-3" />
                <p className="text-[15px] text-gray-500 font-medium mb-1">没有符合条件的事项</p>
                <p className="text-[13px] text-gray-400 mb-4">请调整筛选条件后重试。</p>
                <button onClick={handleResetFilters} className="px-4 py-2 text-[14px] text-blue-600 font-medium hover:text-blue-700">重置筛选</button>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl py-16 text-center">
                <CheckCircle2 size={36} className="mx-auto text-green-400 mb-3" />
                <p className="text-[15px] text-gray-500 font-medium mb-1">暂无待处理事项</p>
                <p className="text-[13px] text-gray-400 mb-4">所有任务都在正常推进。</p>
                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => navigate('/tasks')} className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-[14px] font-medium hover:bg-gray-50">返回任务中心</button>
                  <button onClick={() => navigate('/tasks/all')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[14px] font-medium hover:bg-blue-700">查看全部任务</button>
                </div>
              </div>
            )
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-5 py-4 w-10">
                        <input type="checkbox" checked={paginatedItems.length > 0 && paginatedItems.every(i => selectedIds.includes(i.id))}
                          onChange={toggleSelectAll} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      </th>
                      <th className="px-4 py-4 text-[13px] font-semibold text-gray-600">事项名称</th>
                      {visibleCols.includes('type') && <th className="px-4 py-4 text-[13px] font-semibold text-gray-600">类型</th>}
                      {visibleCols.includes('sourceTask') && <th className="px-4 py-4 text-[13px] font-semibold text-gray-600">来源任务</th>}
                      {visibleCols.includes('stage') && <th className="px-4 py-4 text-[13px] font-semibold text-gray-600">所属阶段</th>}
                      {visibleCols.includes('initiator') && <th className="px-4 py-4 text-[13px] font-semibold text-gray-600">发起人</th>}
                      {visibleCols.includes('initTime') && <th className="px-4 py-4 text-[13px] font-semibold text-gray-600">发起时间</th>}
                      {visibleCols.includes('priority') && <th className="px-4 py-4 text-[13px] font-semibold text-gray-600">优先级</th>}
                      {visibleCols.includes('deadline') && <th className="px-4 py-4 text-[13px] font-semibold text-gray-600">截止时间</th>}
                      {visibleCols.includes('status') && <th className="px-4 py-4 text-[13px] font-semibold text-gray-600">状态</th>}
                      <th className="px-4 py-4 text-[13px] font-semibold text-gray-600 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedItems.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-5 py-4">
                          <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        </td>
                        <td className="px-4 py-4">
                          <button onClick={() => handleItemClick(item)}
                            className="text-[14px] font-medium text-blue-600 hover:text-blue-700 text-left line-clamp-1">{item.title}</button>
                        </td>
                        {visibleCols.includes('type') && <td className="px-4 py-4"><TypeBadge type={item.type} /></td>}
                        {visibleCols.includes('sourceTask') && (
                          <td className="px-4 py-4">
                            <button onClick={() => handleSourceTaskClick(item.sourceTaskId)}
                              className="text-[13px] text-gray-600 hover:text-blue-600 transition-colors truncate max-w-[150px] text-left">{item.sourceTaskName}</button>
                          </td>
                        )}
                        {visibleCols.includes('stage') && (
                          <td className="px-4 py-4">
                            <span className="text-[13px] text-gray-500 whitespace-nowrap">{item.stageName} {item.stageIndex}/{item.stageTotal}</span>
                          </td>
                        )}
                        {visibleCols.includes('initiator') && (
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              {item.initiator.type === 'AI' ? <Sparkles size={14} className="text-blue-500" /> : item.initiator.type === 'SYSTEM' ? <RefreshCw size={14} className="text-gray-400" /> : <User size={14} className="text-gray-400" />}
                              <span className="text-[13px] text-gray-700">{item.initiator.name}</span>
                            </div>
                          </td>
                        )}
                        {visibleCols.includes('initTime') && (
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-[13px] text-gray-400">{item.createdAtLabel}</span>
                          </td>
                        )}
                        {visibleCols.includes('priority') && (
                          <td className="px-4 py-4">
                            <button onClick={() => handleFilterChange('priority', item.priority)}
                              className="flex items-center gap-1.5 hover:opacity-70 transition-opacity">
                              <div className={cn("w-1.5 h-1.5 rounded-full", item.priority === 'HIGH' ? 'bg-red-500' : item.priority === 'MEDIUM' ? 'bg-orange-500' : 'bg-gray-400')} />
                              <span className="text-[13px] text-gray-700">{PRIORITY_LABEL[item.priority]}</span>
                            </button>
                          </td>
                        )}
                        {visibleCols.includes('deadline') && (
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={cn("text-[13px]", item.dueLabel === '尽快处理' ? 'text-red-600 font-medium' : item.dueLabel.includes('今天') ? 'text-orange-600' : 'text-gray-500')}>{item.dueLabel}</span>
                          </td>
                        )}
                        {visibleCols.includes('status') && (
                          <td className="px-4 py-4">
                            <StatusBadge status={item.status} />
                          </td>
                        )}
                        <td className="px-4 py-4 text-right">
                          <button onClick={() => handleAction(item)}
                            className={cn("px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors",
                              item.actionType === 'VIEW_EXCEPTION' ? 'bg-red-50 text-red-600 hover:bg-red-100' :
                              item.actionType === 'RESUME' ? 'bg-green-50 text-green-600 hover:bg-green-100' :
                              'bg-blue-50 text-blue-600 hover:bg-blue-100')}>
                            {item.actionText}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalFiltered > 0 && (
                <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[13px] text-gray-500">共 {totalFiltered} 条</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">上一页</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => handlePageChange(p)}
                        className={cn("w-8 h-8 flex items-center justify-center rounded-md text-[13px] transition-colors",
                          p === page ? "bg-blue-600 text-white font-medium shadow-sm" : "text-gray-600 hover:bg-gray-100")}>
                        {p}
                      </button>
                    ))}
                    <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">下一页</button>
                    <select value={pageSize} onChange={e => handlePageSizeChange(Number(e.target.value))}
                      className="ml-2 text-[12px] border border-gray-200 rounded-md px-1.5 py-1 bg-white">
                      <option value={5}>5 条/页</option>
                      <option value={10}>10 条/页</option>
                      <option value={20}>20 条/页</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[320px] border-l border-gray-200 bg-[#F8FAFC] flex flex-col p-4 space-y-4 overflow-y-auto custom-scrollbar">
        {/* Processing Overview */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-bold text-gray-900">处理概览</h3>
            <div className="flex items-center gap-1 text-[11px] text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100">
              今天 2026-05-20
            </div>
          </div>
          <div className="space-y-4">
            <OverviewItem label="我待确认的事项" value={stats.confirm} icon={<FileText size={14} className="text-orange-500" />} onClick={() => handleTabChange('CONFIRM')} />
            <OverviewItem label="我待审核的事项" value={stats.approval} icon={<Eye size={14} className="text-orange-500" />} onClick={() => handleTabChange('APPROVAL')} />
            <OverviewItem label="我处理的异常" value={stats.exception} icon={<AlertTriangle size={14} className="text-red-500" />} onClick={() => handleTabChange('EXCEPTION')} />
            <OverviewItem label="我可继续执行" value={stats.resume} icon={<Play size={14} className="text-green-500" />} onClick={() => handleTabChange('RESUME')} />
            <OverviewItem label="即将到期" value={stats.dueSoon} icon={<Clock size={14} className="text-orange-500" />} onClick={() => { setDueFilter('TODAY'); setPage(1); }} />
            <div className="h-px bg-gray-50 my-2" />
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-gray-500">平均处理时长</span>
              <span className="font-bold text-gray-900">2.4h</span>
            </div>
          </div>
        </div>

        {/* Quick Views */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-[14px] font-bold text-gray-900 mb-4">快捷视图</h3>
          <div className="space-y-3">
            <QuickViewItem label="高优先级事项" count={stats.highPriority} color="red" onClick={() => handleQuickView({ priority: 'HIGH' })} />
            <QuickViewItem label="今日到期" count={stats.dueSoon} color="orange" onClick={() => handleQuickView({ due: 'TODAY' })} />
            <QuickViewItem label="异常事项" count={stats.exception} color="red" onClick={() => handleQuickView({ type: 'EXCEPTION' })} />
            <QuickViewItem label="我发起的事项" count={stats.createdByMe} color="blue" onClick={() => handleQuickView({ initiator: 'liming' })} />
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-[14px] font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-blue-500" /> 说明 / 提示
          </h3>
          <ul className="space-y-3">
            <TipItem text="点击事项名称进入详情页" />
            <TipItem text="点击来源任务可跳转任务详情" />
            <TipItem text="支持批量确认、转派与忽略" />
            <TipItem text="异常事项应优先处理" />
          </ul>
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowAssignModal(false)}>
          <div className="bg-white rounded-xl shadow-xl w-[400px] p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[16px] font-bold text-gray-900">批量转派</h3>
              <button onClick={() => setShowAssignModal(false)} className="p-1 hover:bg-gray-100 rounded-md text-gray-400"><X size={18} /></button>
            </div>
            <p className="text-[13px] text-gray-500 mb-4">已选择 {selectedIds.length} 个事项，选择转派目标：</p>
            <div className="space-y-2 mb-6">
              {ASSIGNEE_OPTIONS.map(user => (
                <button key={user.id} onClick={() => handleBulkAssign(user.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all text-left">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><User size={14} className="text-gray-500" /></div>
                  <span className="text-[14px] font-medium text-gray-700">{user.name}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowAssignModal(false)} className="w-full py-2 text-[14px] text-gray-500 hover:text-gray-700 font-medium">取消</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-Components ───────────────────────────────────────────────────

function FilterDropdown({ label, options, value, onChange }: {
  label: string; options: { label: string; value: string }[]; value: string; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className={cn("flex items-center gap-1.5 h-9 px-3 rounded-lg transition-all",
          open ? "bg-white border border-blue-300 shadow-sm" : "bg-gray-50 border border-transparent hover:border-gray-200")}>
        <span className="text-[13px] text-gray-500 whitespace-nowrap">{label}：</span>
        <span className={cn("text-[13px] font-medium", value !== 'ALL' ? "text-blue-600" : "text-gray-900")}>{selected?.label || '全部'}</span>
        <ChevronDown size={14} className={cn("text-gray-400 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-[140px] max-h-[240px] overflow-y-auto">
          {options.map(opt => (
            <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
              className={cn("w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-50 transition-colors",
                value === opt.value ? "text-blue-600 font-medium bg-blue-50/50" : "text-gray-700")}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    CONFIRM: 'bg-orange-50 text-orange-700',
    APPROVAL: 'bg-orange-50 text-orange-700',
    EXCEPTION: 'bg-red-50 text-red-700',
    RESUME: 'bg-green-50 text-green-700',
  };
  const label = REVIEW_TYPE_LABEL[type as keyof typeof REVIEW_TYPE_LABEL] || type;
  return <span className={cn("px-2 py-0.5 rounded text-[12px] font-medium whitespace-nowrap", styles[type] || 'bg-gray-100 text-gray-600')}>{label}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: 'bg-blue-50 text-blue-600',
    PROCESSING: 'bg-blue-50 text-blue-600',
    WAITING_APPROVAL: 'bg-orange-50 text-orange-600',
    EXCEPTION: 'bg-red-50 text-red-600',
    RESUMABLE: 'bg-green-50 text-green-600',
    DONE: 'bg-green-50 text-green-600',
    IGNORED: 'bg-gray-100 text-gray-500',
  };
  const label = REVIEW_STATUS_LABEL[status as keyof typeof REVIEW_STATUS_LABEL] || status;
  return <span className={cn("px-2 py-0.5 rounded-full text-[12px] font-medium whitespace-nowrap border", styles[status] || 'bg-gray-50 text-gray-500')}>{label}</span>;
}

function OverviewItem({ label, value, icon, onClick }: { label: string; value: number; icon: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center justify-between w-full group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-md bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">{icon}</div>
        <span className="text-[13px] text-gray-600 group-hover:text-blue-600 transition-colors">{label}</span>
      </div>
      <span className="text-[14px] font-bold text-gray-900">{value}</span>
    </button>
  );
}

function QuickViewItem({ label, count, color, onClick }: { label: string; count: number; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50 transition-all group">
      <span className="text-[13px] text-gray-700 group-hover:text-blue-600 transition-colors">{label}</span>
      <span className={cn("text-[12px] font-bold px-1.5 rounded", color === 'red' ? "text-red-600" : color === 'orange' ? "text-orange-600" : "text-blue-600")}>{count}</span>
    </button>
  );
}

function TipItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-[12px] text-gray-500 leading-tight">
      <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
      {text}
    </li>
  );
}
