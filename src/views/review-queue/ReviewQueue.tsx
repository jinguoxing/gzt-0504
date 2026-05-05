import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ChevronRight, Filter, ArrowLeft, Clock, CheckCircle2,
  AlertTriangle, Eye, Zap, RotateCw, FileText
} from 'lucide-react';
import { cn } from '@/utils/cn';
import mockData from '@/mock/review-queue.json';

type ReviewStatus = 'PENDING' | 'RESOLVED' | 'REJECTED' | 'IGNORED';

interface ReviewItem {
  id: string;
  taskId: string;
  taskName: string;
  type: string;
  typeLabel: string;
  status: ReviewStatus;
  priority: string;
  assignee: string;
  assigneeName: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

const TYPE_TABS = mockData.typeOptions as string[];
const STATUS_TABS = mockData.statusOptions as string[];
const PRIORITY_TABS = mockData.priorityOptions as string[];

const REVIEWS = mockData.reviews as ReviewItem[];

const TYPE_ICON: Record<string, any> = {
  FIELD_CONFIRMATION: FileText,
  REVIEW: Eye,
  ABNORMAL: AlertTriangle,
  CONTINUE: RotateCw,
};

const TYPE_COLOR: Record<string, { dot: string; badge: string }> = {
  FIELD_CONFIRMATION: { dot: 'bg-orange-500', badge: 'bg-orange-50 text-orange-700' },
  REVIEW: { dot: 'bg-orange-500', badge: 'bg-amber-50 text-amber-700' },
  ABNORMAL: { dot: 'bg-red-500', badge: 'bg-red-50 text-red-700' },
  CONTINUE: { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700' },
};

const TYPE_TAB_TO_TYPE: Record<string, string[]> = {
  '全部': [],
  '待确认': ['FIELD_CONFIRMATION'],
  '待审核': ['REVIEW'],
  '异常': ['ABNORMAL'],
  '继续执行': ['CONTINUE'],
};

const PRIORITY_STYLE: Record<string, string> = {
  HIGH: 'text-red-600 bg-red-50',
  MEDIUM: 'text-orange-600 bg-orange-50',
  LOW: 'text-green-600 bg-green-50',
};

const PRIORITY_LABEL: Record<string, string> = {
  HIGH: '高',
  MEDIUM: '中',
  LOW: '低',
};

export default function ReviewQueue() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [typeTab, setTypeTab] = useState('全部');
  const [statusTab, setStatusTab] = useState('全部');
  const [priorityFilter, setPriorityFilter] = useState('全部');

  // Read initial filters from URL query params
  const urlAssignee = searchParams.get('assignee');
  const urlStatus = searchParams.get('status');
  const urlTaskId = searchParams.get('taskId');

  const filteredReviews = useMemo(() => {
    return REVIEWS.filter(r => {
      // Type tab filter
      const types = TYPE_TAB_TO_TYPE[typeTab];
      if (types.length > 0 && !types.includes(r.type)) return false;

      // Status filter
      if (statusTab === '待处理' && r.status !== 'PENDING') return false;
      if (statusTab === '已处理' && r.status === 'PENDING') return false;

      // Priority filter
      if (priorityFilter !== '全部' && PRIORITY_LABEL[r.priority] !== priorityFilter) return false;

      // URL filters
      if (urlStatus === 'PENDING' && r.status !== 'PENDING') return false;
      if (urlTaskId && r.taskId !== urlTaskId) return false;

      return true;
    });
  }, [typeTab, statusTab, priorityFilter, urlStatus, urlTaskId]);

  const pendingCount = REVIEWS.filter(r => r.status === 'PENDING').length;
  const resolvedCount = REVIEWS.filter(r => r.status !== 'PENDING').length;

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="px-8 py-6 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-[13px] text-gray-400 mb-1">
            <button onClick={() => navigate('/tasks')} className="hover:text-gray-600 transition-colors">任务</button>
            <ChevronRight size={14} />
            <span className="text-gray-600">待处理事项</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-[24px] font-bold text-gray-900">待处理事项</h1>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-gray-500">{pendingCount} 项待处理 · {resolvedCount} 项已处理</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          {/* Type Tabs */}
          <div className="flex items-center gap-1 px-4 pt-3 pb-2 border-b border-gray-100">
            {TYPE_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setTypeTab(tab)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors",
                  typeTab === tab ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                )}
              >
                {tab}
              </button>
            ))}
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              {/* Status filter */}
              <select
                value={statusTab}
                onChange={e => setStatusTab(e.target.value)}
                className="text-[12px] text-gray-500 border border-gray-200 rounded-md px-2 py-1 bg-white hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
              >
                {STATUS_TABS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {/* Priority filter */}
              <select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                className="text-[12px] text-gray-500 border border-gray-200 rounded-md px-2 py-1 bg-white hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
              >
                {PRIORITY_TABS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Review List */}
          <div className="divide-y divide-gray-100">
            {filteredReviews.length === 0 ? (
              <div className="py-12 text-center">
                <Clock size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-[14px] text-gray-400">暂无待处理事项</p>
              </div>
            ) : (
              filteredReviews.map(review => {
                const typeColors = TYPE_COLOR[review.type] || { dot: 'bg-gray-400', badge: 'bg-gray-50 text-gray-600' };
                const isResolved = review.status !== 'PENDING';
                return (
                  <button
                    key={review.id}
                    onClick={() => navigate(`/tasks/${review.taskId}/review/${review.id}`)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={cn('w-2 h-2 rounded-full flex-shrink-0', typeColors.dot)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            "text-[11px] font-medium px-2 py-0.5 rounded flex-shrink-0",
                            typeColors.badge
                          )}>
                            {review.typeLabel}
                          </span>
                          <span className={cn(
                            "text-[11px] font-medium px-2 py-0.5 rounded flex-shrink-0",
                            PRIORITY_STYLE[review.priority]
                          )}>
                            {PRIORITY_LABEL[review.priority]}
                          </span>
                          {isResolved && (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-gray-50 text-gray-500 flex-shrink-0">
                              {review.status === 'RESOLVED' ? '已处理' : review.status === 'REJECTED' ? '已驳回' : '已忽略'}
                            </span>
                          )}
                        </div>
                        <p className="text-[14px] font-medium text-gray-800 truncate">{review.taskName}</p>
                        <p className="text-[12px] text-gray-400 mt-0.5">
                          {review.assigneeName} · {new Date(review.updatedAt).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      <span className="text-[14px] font-semibold text-gray-700">{review.count} 项</span>
                      <ChevronRight size={16} className="text-gray-300" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
