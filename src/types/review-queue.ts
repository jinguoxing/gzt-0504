export type ReviewItemType = 'CONFIRM' | 'APPROVAL' | 'EXCEPTION' | 'RESUME';

export type ReviewItemStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'WAITING_APPROVAL'
  | 'EXCEPTION'
  | 'RESUMABLE'
  | 'DONE'
  | 'IGNORED';

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export type ReviewQueueTabKey = 'ALL' | 'CONFIRM' | 'APPROVAL' | 'EXCEPTION' | 'RESUME';

export interface ReviewInitiator {
  id: string;
  name: string;
  type: 'AI' | 'SYSTEM' | 'USER';
}

export interface ReviewAssignee {
  id: string;
  name: string;
}

export interface ReviewQueueItem {
  id: string;
  title: string;
  type: ReviewItemType;
  status: ReviewItemStatus;
  priority: Priority;
  sourceTaskId: string;
  sourceTaskName: string;
  stageId: string;
  stageName: string;
  stageIndex: number;
  stageTotal: number;
  initiator: ReviewInitiator;
  assignee: ReviewAssignee;
  createdAt: string;
  createdAtLabel: string;
  dueAt?: string;
  dueLabel: string;
  actionText: string;
  actionType: 'CONFIRM' | 'APPROVAL' | 'VIEW_EXCEPTION' | 'RESUME';
  targetUrl: string;
  riskSummary?: string;
  tags?: string[];
}

export const REVIEW_TYPE_LABEL: Record<ReviewItemType, string> = {
  CONFIRM: '待确认',
  APPROVAL: '待审核',
  EXCEPTION: '异常',
  RESUME: '继续执行',
};

export const REVIEW_STATUS_LABEL: Record<ReviewItemStatus, string> = {
  PENDING: '待处理',
  PROCESSING: '处理中',
  WAITING_APPROVAL: '待审核',
  EXCEPTION: '异常',
  RESUMABLE: '可继续执行',
  DONE: '已处理',
  IGNORED: '已忽略',
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  HIGH: '高',
  MEDIUM: '中',
  LOW: '低',
};

export const SORT_OPTIONS: { label: string; value: string }[] = [
  { label: '优先级', value: 'PRIORITY' },
  { label: '截止时间', value: 'DEADLINE' },
  { label: '发起时间', value: 'CREATED_AT' },
  { label: '来源任务', value: 'SOURCE_TASK' },
];

export const TAB_LIST: { key: ReviewQueueTabKey; label: string }[] = [
  { key: 'ALL', label: '全部' },
  { key: 'CONFIRM', label: '待确认' },
  { key: 'APPROVAL', label: '待审核' },
  { key: 'EXCEPTION', label: '异常' },
  { key: 'RESUME', label: '继续执行' },
];

export const PRIORITY_ORDER: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
