# 11｜Data Model Types

以下类型采用 TypeScript 约定。

## 1. 基础枚举

```ts
export type TaskScope = 'my' | 'team' | 'all';

export type TaskStatus =
  | 'DRAFT'
  | 'READY'
  | 'RUNNING'
  | 'WAITING_CONFIRMATION'
  | 'WAITING_REVIEW'
  | 'BLOCKED'
  | 'COMPLETED'
  | 'ARCHIVED';

export type StageStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'WAITING_USER'
  | 'COMPLETED'
  | 'FAILED'
  | 'SKIPPED';

export type TaskType =
  | 'SEMANTIC_GOVERNANCE'
  | 'MASTER_DATA'
  | 'STANDARD_MANAGEMENT'
  | 'METADATA'
  | 'QUALITY_INSPECTION';

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export type ReviewType =
  | 'FIELD_CONFIRMATION'
  | 'FIELD_CONFLICT'
  | 'OBJECT_REVIEW'
  | 'STANDARD_MAPPING_REVIEW'
  | 'EXCEPTION_HANDLING'
  | 'CONTINUE_EXECUTION'
  | 'DELIVERABLE_CONFIRMATION';

export type ReviewStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'RESOLVED'
  | 'REJECTED'
  | 'IGNORED'
  | 'EXPIRED';
```

---

## 2. 用户与项目

```ts
export interface User {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  role?: 'member' | 'owner' | 'admin';
}

export interface Project {
  id: string;
  name: string;
  description?: string;
}
```

---

## 3. 数据源与资源

```ts
export interface DataSource {
  id: string;
  name: string;
  type: 'MySQL' | 'PostgreSQL' | 'Hive' | 'ClickHouse' | 'File';
  host?: string;
  port?: number;
  database?: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  selectedTableCount?: number;
  scannedFieldCount?: number;
}

export interface ContextResource {
  id: string;
  name: string;
  type: 'PDF' | 'XLSX' | 'DOCX' | 'CSV' | 'MD' | 'ZIP';
  sizeBytes?: number;
  uploadedBy?: User;
  uploadedAt?: string;
}
```

---

## 4. 任务草稿

```ts
export interface TaskDraft {
  id: string;
  name: string;
  objective: string;
  typeTags: string[];
  dataSource: DataSource;
  scanScope: {
    schemas: string[];
    estimatedTables: number;
    estimatedFields: number;
  };
  contextResources: ContextResource[];
  deliverableRequirements: string[];
  estimatedDurationMinutes: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  stages: TaskStage[];
  advancedConfig?: AdvancedTaskConfig;
  recentChanges: DraftChangeSummary[];
  status: 'DRAFT' | 'READY';
}

export interface DraftChangeSummary {
  id: string;
  createdAt: string;
  title: string;
  changes: Array<{
    field: string;
    from: string;
    to: string;
  }>;
}

export interface AdvancedTaskConfig {
  samplingStrategy?: string;
  parallelism?: number;
  outputFormats?: string[];
  permissionScope?: string;
  autoConfirmThreshold?: number;
  retryPolicy?: string;
}
```

---

## 5. 任务与阶段

```ts
export interface Task {
  id: string;
  name: string;
  subtitle?: string;
  type: TaskType;
  project: Project;
  status: TaskStatus;
  currentStage?: TaskStage;
  stages: TaskStage[];
  progress: number;
  owner: User;
  creator?: User;
  priority: Priority;
  pendingItemCount: number;
  dataSource?: DataSource;
  contextResources?: ContextResource[];
  deliverables?: Deliverable[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  starred?: boolean;
}

export interface TaskStage {
  id: string;
  index: number;
  name: string;
  status: StageStatus;
  progress?: number;
  startedAt?: string;
  completedAt?: string;
  summary?: string;
  metrics?: Metric[];
  risks?: RiskItem[];
}

export interface Metric {
  key: string;
  label: string;
  value: number | string;
  unit?: string;
  tone?: 'blue' | 'green' | 'orange' | 'red' | 'gray';
}

export interface RiskItem {
  id: string;
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  title: string;
  description?: string;
  actionLabel?: string;
}
```

---

## 6. 任务中心

```ts
export interface TaskCenterSummary {
  allTasks: number;
  running: number;
  pendingForMe: number;
  completed: number;
  abnormal: number;
  trends?: Record<string, number>;
}

export interface TaskCenterBoard {
  createdByMe: number;
  ownedByMe: number;
  confirmationsHandled: number;
  exceptionsHandled: number;
  averageCompletionRate: number;
}

export interface RecentVisit {
  id: string;
  name: string;
  type: 'TASK' | 'FILE' | 'DATA_SOURCE' | 'OBJECT_MODEL' | 'DELIVERABLE';
  visitedAt: string;
  targetUrl: string;
}
```

---

## 7. 全部任务列表

```ts
export interface TaskListState {
  scope: TaskScope;
  view: 'default' | 'starred' | 'abnormal' | 'archived';
  keyword: string;
  filters: {
    status?: TaskStatus | 'ALL';
    type?: TaskType | 'ALL';
    projectId?: string | 'ALL';
    ownerId?: string | 'ALL';
    priority?: Priority | 'ALL';
    timeField?: 'updatedAt' | 'createdAt';
    timeRange?: 'today' | 'last7d' | 'last30d' | 'custom';
  };
  sort: 'recentUpdated' | 'createdAt' | 'priority';
  selectedTaskIds: string[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface TaskListSummary {
  allTasks: number;
  running: number;
  waitingConfirmation: number;
  completed: number;
  abnormal: number;
}

export interface FilterSummary {
  scopeLabel: string;
  statusLabel: string;
  typeLabel: string;
  projectLabel: string;
  timeRangeLabel: string;
}
```

---

## 8. Review Item

```ts
export interface ReviewItem {
  id: string;
  title: string;
  type: ReviewType;
  status: ReviewStatus;
  sourceTask: Pick<Task, 'id' | 'name'>;
  stage?: Pick<TaskStage, 'id' | 'name' | 'index'>;
  initiator: User | { id: 'xino' | 'system'; name: 'Xino' | '系统' };
  assignee?: User;
  priority: Priority;
  createdAt: string;
  dueAt?: string;
  actionLabel: string;
  targetUrl: string;
}
```

---

## 9. 字段确认

```ts
export interface FieldReviewItem {
  id: string;
  fieldName: string;
  tableName: string;
  semanticA: string;
  semanticB?: string;
  conflictSource?: string;
  confidence: number;
  riskLevel: Priority;
  recommendedAction: 'CONFIRM_A' | 'CONFIRM_B' | 'MANUAL_EDIT' | 'IGNORE';
  finalSemantic?: string;
  status: ReviewStatus;
  samples?: string[];
  evidence?: string[];
  similarFields?: Array<{ fieldName: string; semantic: string; confidence: number }>;
}
```

---

## 10. 交付物与活动

```ts
export interface Deliverable {
  id: string;
  name: string;
  type: 'PDF' | 'XLSX' | 'CSV' | 'ZIP' | 'MD' | 'JSON';
  description?: string;
  sizeBytes?: number;
  createdBy: User | { id: 'system'; name: '系统' };
  createdAt: string;
  sourceTaskId?: string;
  previewUrl?: string;
  downloadUrl?: string;
}

export interface Activity {
  id: string;
  actor: User | { id: 'system' | 'xino'; name: '系统' | 'Xino' };
  verb: string;
  targetName: string;
  targetUrl?: string;
  createdAt: string;
  tone?: 'blue' | 'green' | 'orange' | 'red' | 'gray';
}
```
