/** 视图状态类型 */
export type ViewState = 'HOME' | 'DRAFT' | 'EXECUTION' | 'DATA_QUERY' | 'TASK_LIST';

/** 导航项 */
export interface NavItem {
  label: string;
  icon: any;
  path: string;
  highlightPattern: string;
}

/** 任务行数据 */
export interface TaskRow {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  project: string;
  stage: string;
  stageProgress: string;
  progress: number;
  owner: string;
  priority: '高' | '中' | '低';
  pendingCount: number;
  status: '执行中' | '已完成' | '异常' | '待确认' | '待审核';
  updatedAt: string;
}

/** 执行阶段状态 */
export type StageStatus = 'done' | 'active' | 'pending';

/** 执行阶段 */
export interface ExecutionStage {
  title: string;
  status: StageStatus;
}

// ==================== Contract Types ====================

/** 消息角色 */
export type MessageRole = 'user' | 'xino' | 'system';

/** 消息类型 */
export type MessageType =
  | 'normal'
  | 'task_event'
  | 'stage_result'
  | 'draft_change'
  | 'confirmation'
  | 'error';

/** 结果块类型 */
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

/** 结果块状态 */
export type ResultBlockStatus = 'success' | 'running' | 'warning' | 'error' | 'waiting_confirm';

/** 严重程度 */
export type Severity = 'low' | 'medium' | 'high';

/** 消息动作 */
export interface MessageAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger';
  action?: string;
}

/** 结果块 */
export interface ResultBlock {
  id: string;
  type: ResultBlockType;
  title: string;
  summary?: string;
  status?: ResultBlockStatus;
  severity?: Severity;
  data: Record<string, unknown>;
  actions?: MessageAction[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

/** Xino 消息 */
export interface XinoMessage {
  id: string;
  role: MessageRole;
  authorName?: string;
  createdAt: string;
  stageId?: string;
  stageName?: string;
  messageType: MessageType;
  text: string;
  resultBlocks?: ResultBlock[];
  actions?: MessageAction[];
}

// ==================== Result Block Data Types ====================

/** 键值对行 */
export interface KeyValueRow {
  label: string;
  value: string;
  valueClass?: string;
}

/** 变更行 (from → to) */
export interface ChangeRow {
  label: string;
  from?: string;
  to: string;
  toClass?: string;
}

/** 指标卡 */
export interface MetricItem {
  key: string;
  label: string;
  value: string | number;
  tone: string;
}

/** 表格列定义 */
export interface TableColumn {
  key: string;
  label: string;
  width?: string;
}

/** 表格行 */
export interface TableRow {
  [key: string]: unknown;
}

/** 问题项 */
export interface IssueItem {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  detailLabel?: string;
  detailAction?: string;
}

/** 交付物项 */
export interface DeliverableItem {
  id: string;
  name: string;
  type: string;
  description?: string;
  time?: string;
}

/** 确认选项 */
export interface ConfirmOption {
  id: string;
  label: string;
  description?: string;
  type: 'primary' | 'secondary' | 'danger';
}

/** 图谱节点统计 */
export interface GraphStats {
  nodeCount: number;
  edgeCount: number;
  placeholder?: string;
}

// ==================== Task / Draft Core Types ====================

/** 任务状态 */
export type TaskStatus = 'executing' | 'paused' | 'waiting_confirm' | 'completed' | 'failed';

/** 任务阶段 */
export interface TaskStage {
  id: string;
  index: number;
  name: string;
  status: 'COMPLETED' | 'RUNNING' | 'PENDING' | 'FAILED';
  progress: number;
  completedAt?: string;
  startedAt?: string;
  summary?: string;
}

/** 数据源配置 */
export interface DataSourceConfig {
  id: string;
  name: string;
  type: string;
  host: string;
  port?: number;
  database: string;
  status?: string;
  selectedTableCount?: number;
  scannedFieldCount?: number;
}

/** 草稿状态 */
export type DraftStatus = 'draft' | 'confirmed';

/** 扫描范围 */
export interface ScanScope {
  schemas: string[];
  estimatedTables: number;
  estimatedFields: number;
}

/** 资源上传者 */
export interface ResourceUploader {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

/** 上下文资源 */
export interface ContextResource {
  id: string;
  name: string;
  type: string;
  sizeBytes: number;
  uploadedBy: ResourceUploader;
  uploadedAt: string;
}

/** 交付物要求 */
export interface DeliverableRequirement {
  id: string;
  name: string;
  type: string;
  description?: string;
}

/** 风险项 */
export interface RiskItem {
  id: string;
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description?: string;
}

/** 任务草稿 */
export interface TaskDraft {
  id: string;
  name: string;
  objective: string;
  typeTags: string[];
  dataSource: DataSourceConfig;
  scanScope: ScanScope;
  contextResources: ContextResource[];
  stages: TaskStage[];
  deliverableRequirements: DeliverableRequirement[];
  risks: RiskItem[];
  status: DraftStatus;
}

/** 项目信息 */
export interface ProjectInfo {
  id: string;
  name: string;
  description?: string;
}

/** 用户信息 */
export interface UserInfo {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  role?: string;
}

/** 任务 */
export interface Task {
  id: string;
  name: string;
  subtitle?: string;
  type: string;
  project: ProjectInfo;
  status: string;
  currentStage?: TaskStage;
  stages: TaskStage[];
  progress: number;
  owner: UserInfo;
  creator: UserInfo;
  priority?: string;
  pendingItemCount?: number;
  dataSource: DataSourceConfig;
  contextResources: ContextResource[];
  createdAt: string;
  updatedAt: string;
  starred?: boolean;
}
