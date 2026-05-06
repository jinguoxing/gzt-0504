# 待我处理页面｜数据模型与 TypeScript 类型

## 1. 枚举定义

```ts
export type ReviewItemType =
  | 'CONFIRM'
  | 'APPROVAL'
  | 'EXCEPTION'
  | 'RESUME'

export type ReviewItemStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'WAITING_APPROVAL'
  | 'EXCEPTION'
  | 'RESUMABLE'
  | 'DONE'
  | 'IGNORED'

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'

export type ReviewQueueTabKey =
  | 'ALL'
  | 'CONFIRM'
  | 'APPROVAL'
  | 'EXCEPTION'
  | 'RESUME'
```

## 2. 核心事项类型

```ts
export interface ReviewQueueItem {
  id: string
  title: string
  type: ReviewItemType
  status: ReviewItemStatus
  priority: Priority

  sourceTaskId: string
  sourceTaskName: string
  sourceTaskType?: string

  stageId: string
  stageName: string
  stageIndex: number
  stageTotal: number

  initiator: {
    id: string
    name: string
    type: 'AI' | 'SYSTEM' | 'USER'
    avatarUrl?: string
  }

  assignee: {
    id: string
    name: string
    avatarUrl?: string
  }

  createdAt: string
  createdAtLabel: string
  deadlineAt?: string
  deadlineLabel: string

  actionText: string
  actionUrl: string

  riskSummary?: string
  description?: string
  tags?: string[]
}
```

## 3. 指标类型

```ts
export interface ReviewQueueStats {
  total: number
  confirm: number
  approval: number
  exception: number
  resume: number
  dueSoon: number
  highPriority: number
  averageHandleDuration: string

  trends?: {
    total?: number
    confirm?: number
    approval?: number
    exception?: number
    resume?: number
  }
}
```

## 4. 筛选类型

```ts
export interface ReviewQueueFilters {
  keyword: string
  type: ReviewItemType | 'ALL'
  status: ReviewItemStatus | 'ALL'
  sourceTaskId: string | 'ALL'
  initiatorId: string | 'ALL'
  priority: Priority | 'ALL'
  deadline: 'ALL' | 'TODAY' | 'THREE_DAYS' | 'SEVEN_DAYS' | 'OVERDUE' | 'CUSTOM'
  sortBy: 'PRIORITY' | 'DEADLINE' | 'CREATED_AT' | 'SOURCE_TASK'
  page: number
  pageSize: number
}
```

## 5. 筛选选项类型

```ts
export interface ReviewQueueFilterOptions {
  statuses: Array<{ label: string; value: ReviewItemStatus | 'ALL' }>
  types: Array<{ label: string; value: ReviewItemType | 'ALL' }>
  sourceTasks: Array<{ label: string; value: string | 'ALL' }>
  initiators: Array<{ label: string; value: string | 'ALL' }>
  priorities: Array<{ label: string; value: Priority | 'ALL' }>
  deadlines: Array<{ label: string; value: ReviewQueueFilters['deadline'] }>
}
```

## 6. 页面响应类型

```ts
export interface ReviewQueuePageData {
  stats: ReviewQueueStats
  filters: ReviewQueueFilters
  filterOptions: ReviewQueueFilterOptions
  items: ReviewQueueItem[]
  total: number
  page: number
  pageSize: number
  overview: ReviewProcessingOverview
  quickViews: ReviewQuickView[]
}
```

## 7. 右侧栏类型

```ts
export interface ReviewProcessingOverview {
  dateLabel: string
  confirmCount: number
  approvalCount: number
  exceptionCount: number
  resumableCount: number
  dueSoonCount: number
  averageHandleDuration: string
}

export interface ReviewQuickView {
  key: 'HIGH_PRIORITY' | 'DUE_TODAY' | 'EXCEPTION' | 'CREATED_BY_ME'
  label: string
  count: number
  query: Partial<ReviewQueueFilters>
}
```

## 8. 批量操作类型

```ts
export type ReviewBulkActionType =
  | 'BULK_CONFIRM'
  | 'BULK_ASSIGN'
  | 'BULK_IGNORE'

export interface ReviewBulkActionPayload {
  actionType: ReviewBulkActionType
  itemIds: string[]
  targetAssigneeId?: string
  reason?: string
}
```

## 9. 标签映射建议

```ts
export const REVIEW_TYPE_LABEL: Record<ReviewItemType, string> = {
  CONFIRM: '待确认',
  APPROVAL: '待审核',
  EXCEPTION: '异常',
  RESUME: '继续执行'
}

export const REVIEW_STATUS_LABEL: Record<ReviewItemStatus, string> = {
  PENDING: '待处理',
  PROCESSING: '处理中',
  WAITING_APPROVAL: '待审核',
  EXCEPTION: '异常',
  RESUMABLE: '可继续执行',
  DONE: '已处理',
  IGNORED: '已忽略'
}
```
