# 11_DATA_MODEL_TYPES

## 1. User

```ts
export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};
```

## 2. Resource

```ts
export type ResourceType = 'pdf' | 'xlsx' | 'docx' | 'csv' | 'zip' | 'database' | 'knowledge_base';

export type Resource = {
  id: string;
  name: string;
  type: ResourceType;
  size?: string;
  description?: string;
  status?: 'ready' | 'processing' | 'failed';
};
```

## 3. DataSource

```ts
export type DataSourceConfig = {
  id: string;
  name: string;
  type: 'MySQL' | 'PostgreSQL' | 'Oracle' | 'API' | 'File';
  host?: string;
  status: 'connected' | 'disconnected' | 'permission_required';
  permission: 'metadata_read' | 'full_read' | 'none';
};
```

## 4. TaskDraft

```ts
export type ScanScope = {
  schemas: string[];
  tables?: string[];
  estimatedTableCount?: number;
  estimatedFieldCount?: number;
};

export type DeliverableRequirement = {
  id: string;
  name: string;
  type: 'pdf' | 'xlsx' | 'csv' | 'zip' | 'json' | 'yaml';
  purpose: string;
  required: boolean;
};

export type RiskItem = {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  impact?: string;
  recommendation?: string;
  status: 'open' | 'processing' | 'resolved' | 'ignored';
};

export type DraftChangeLog = {
  id: string;
  field: string;
  before: unknown;
  after: unknown;
  changedBy: 'user' | 'xino';
  changedAt: string;
  reason?: string;
};

export type TaskDraft = {
  draftId: string;
  title: string;
  goal: string;
  taskTypes: string[];
  status: 'draft' | 'confirmed';
  dataSource: DataSourceConfig;
  scanScope: ScanScope;
  contextResources: Resource[];
  executionPlan: ExecutionStage[];
  deliverables: DeliverableRequirement[];
  risks: RiskItem[];
  estimatedDurationMinutes: number;
  changeLogs: DraftChangeLog[];
};
```

## 5. Task

```ts
export type TaskStatus = 'executing' | 'paused' | 'waiting_confirm' | 'completed' | 'failed';

export type Task = {
  taskId: string;
  title: string;
  status: TaskStatus;
  projectName: string;
  creator: User;
  currentStageIndex: number;
  progress: number;
  stages: ExecutionStage[];
  context: TaskContext;
  messages: XinoMessage[];
  latestResults: StageResult[];
  deliverables: Deliverable[];
  activities: Activity[];
  createdAt: string;
  updatedAt: string;
};
```

## 6. ExecutionStage

```ts
export type StageStatus = 'pending' | 'running' | 'completed' | 'waiting_confirm' | 'failed';

export type ExecutionStage = {
  stageId: string;
  index: number;
  name: string;
  description: string;
  status: StageStatus;
  progress?: number;
  startedAt?: string;
  completedAt?: string;
};
```

## 7. XinoMessage and ResultBlock

```ts
export type MessageRole = 'user' | 'xino' | 'system';

export type MessageType =
  | 'normal'
  | 'task_event'
  | 'stage_result'
  | 'draft_change'
  | 'confirmation'
  | 'error';

export type ResultBlockType =
  | 'text_summary'
  | 'metric_summary'
  | 'table'
  | 'issue_list'
  | 'change_summary'
  | 'stage_progress'
  | 'confirmation'
  | 'graph'
  | 'deliverable_list'
  | 'recommendation'
  | 'config_form'
  | 'fallback';

export type XinoMessage = {
  id: string;
  role: MessageRole;
  createdAt: string;
  stageId?: string;
  stageName?: string;
  messageType: MessageType;
  text: string;
  resultBlocks?: ResultBlock[];
  actions?: MessageAction[];
};

export type ResultBlock = {
  id: string;
  type: ResultBlockType;
  title: string;
  summary?: string;
  status?: 'success' | 'running' | 'warning' | 'error' | 'waiting_confirm';
  severity?: 'low' | 'medium' | 'high';
  data: unknown;
  actions?: MessageAction[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
};
```

## 8. Actions

```ts
export type MessageAction = {
  id: string;
  label: string;
  type:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'warning'
    | 'ghost';
  action:
    | 'create_task'
    | 'save_draft'
    | 'edit_config'
    | 'confirm'
    | 'modify'
    | 'ignore'
    | 'open_detail'
    | 'download'
    | 'preview'
    | 'continue_stage'
    | 'retry'
    | 'custom';
  payload?: Record<string, unknown>;
};
```

## 9. Result Table

```ts
export type ResultTableData = {
  columns: Array<{
    key: string;
    title: string;
    type?: 'text' | 'number' | 'status' | 'confidence' | 'actions';
  }>;
  rows: Array<Record<string, unknown>>;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
};
```

## 10. Deliverable

```ts
export type Deliverable = {
  id: string;
  name: string;
  type: 'pdf' | 'xlsx' | 'csv' | 'zip' | 'md' | 'json' | 'yaml';
  purpose: string;
  size?: string;
  createdAt: string;
  actions: MessageAction[];
};
```
