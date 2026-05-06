/** 视图状态类型 */
export type ViewState = 'HOME' | 'DRAFT' | 'EXECUTION' | 'DATA_QUERY' | 'TASK_LIST';

// ==================== Data QA (找数问数) Contract Types ====================

export type IntentType =
  | 'data_qa'
  | 'governance_task'
  | 'object_modeling'
  | 'file_analysis'
  | 'unknown';

export type DataQaQueryType =
  | 'single_metric'
  | 'comparison'
  | 'trend'
  | 'breakdown'
  | 'ranking'
  | 'insight'
  | 'metric_definition'
  | 'data_lookup'
  | 'detail_table';

export type DataQaSessionStatus =
  | 'answering'
  | 'answer_ready'
  | 'clarification_required'
  | 'exporting'
  | 'completed'
  | 'failed';

export type DataQaResultBlockType =
  | 'single_metric_answer'
  | 'metric_comparison'
  | 'trend_chart'
  | 'comparison_trend'
  | 'breakdown'
  | 'ranking'
  | 'data_table'
  | 'data_source_trace'
  | 'insight_explanation'
  | 'contribution_analysis'
  | 'recommendation'
  | 'clarification'
  | 'fallback'
  | 'query_preflight'
  | 'analysis_plan';

export type DataQaResultActionType =
  | 'followup'
  | 'open_source'
  | 'open_sql'
  | 'open_detail'
  | 'export'
  | 'generate_report'
  | 'create_governance_task';

export interface DataQaUser {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
}

export interface DataQaResultAction {
  id: string;
  label: string;
  actionType: DataQaResultActionType;
  payload?: Record<string, unknown>;
}

export interface FollowupSuggestion {
  id: string;
  label: string;
  question: string;
  queryType: DataQaQueryType;
}

export interface ExportedFile {
  id: string;
  filename: string;
  fileType: 'xlsx' | 'csv' | 'pdf' | 'md' | 'json' | 'txt';
  size?: string;
  purpose: string;
  createdAt: string;
  url?: string;
}

export interface DataQaResultBlock {
  id: string;
  type: DataQaResultBlockType;
  title: string;
  summary?: string;
  data: Record<string, unknown>;
  actions?: DataQaResultAction[];
  defaultCollapsed?: boolean;
}

export interface DataQaMessage {
  id: string;
  role: 'user' | 'xino' | 'system';
  createdAt: string;
  displayTime: string;
  text: string;
  resultBlocks?: DataQaResultBlock[];
  suggestedFollowups?: FollowupSuggestion[];
}

export interface MetricScope {
  metricName: string;
  timeRange: { label: string; start: string; end: string };
  businessDomain: string;
  calculationDefinition: string;
  filters: string[];
}

export interface DataEvidence {
  dataSource: string;
  sourceTable: string;
  sourceField: string;
  timeField: string;
  relatedDimensions?: string[];
  updatedAt: string;
  permissionStatus: 'queryable' | 'restricted' | 'unknown';
  qualityStatus: 'passed' | 'warning' | 'failed' | 'unknown';
  confidence: 'high' | 'medium' | 'low';
  confidenceReasons: string[];
}

export interface QueryPlan {
  steps: string[];
  sql: string;
  execution: {
    durationMs: number;
    scannedRows: number;
    cacheStatus: 'hit' | 'miss';
    indexUsed?: string;
  };
  defaultCollapsed: boolean;
}

export interface FollowupContext {
  questions: string[];
  currentAnalysisFocus?: string;
}

export interface AnswerEvidence {
  metricScope: MetricScope;
  dataEvidence: DataEvidence;
  queryPlan: QueryPlan;
  followupContext: FollowupContext;
}

export interface DataQaSession {
  sessionId: string;
  projectId: string;
  projectName: string;
  status: DataQaSessionStatus;
  originalQuestion: string;
  queryType: DataQaQueryType;
  createdBy: DataQaUser;
  createdAt: string;
  updatedAt: string;
  messages: DataQaMessage[];
  evidence: AnswerEvidence;
  exports?: ExportedFile[];
}

// ==================== Result Block Sub-types (Data QA) ====================

export interface SingleMetricAnswerData {
  metricName: string;
  value: number;
  formattedValue: string;
  unit?: string;
  period: string;
  mom?: number;
  yoy?: number;
  definition: string;
}

export interface ComparisonTrendData {
  current: { label: string; value: number; formattedValue: string };
  previous: { label: string; value: number; formattedValue: string };
  delta: { value: number; formattedValue: string; rate: number };
  trend: Array<{ period: string; value: number; growthRate?: number }>;
  keyFindings: string[];
}

export interface DataTableData {
  columns: Array<{ key: string; label: string; type?: string }>;
  rows: Array<Record<string, unknown>>;
  total: number;
  filters: string[];
  previewLimit: number;
}

export interface InsightExplanationData {
  conclusion: string;
  reasons: string[];
}

export interface ContributionAnalysisData {
  items: Array<{
    label: string;
    formattedValue: string;
    percent: number;
  }>;
}

export interface RecommendationData {
  items: string[];
}

export interface DataSourceTraceData {
  dataSource: string;
  sourceTable: string;
  sourceField: string;
  updatedAt: string;
  confidence: 'high' | 'medium' | 'low';
}

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
  | 'data_source_form'
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

/** 阶段进度项 */
export interface StageProgressItem {
  id: string;
  name: string;
  status: 'COMPLETED' | 'RUNNING' | 'PENDING' | 'FAILED';
  progress: number;
  summary?: string;
}

/** 图谱节点 */
export interface GraphNode {
  id: string;
  label: string;
  type: string;
}

/** 图谱边 */
export interface GraphEdge {
  source: string;
  target: string;
  label?: string;
}

/** 推荐项 */
export interface RecommendationItem {
  id: string;
  title: string;
  description?: string;
  confidence?: number;
  reason?: string;
}

/** 配置表单项 */
export interface ConfigFormItem {
  key: string;
  label: string;
  type: 'select' | 'text' | 'number' | 'toggle';
  value: string | number | boolean;
  options?: Array<{ label: string; value: string | number }>;
  description?: string;
}

/** 数据源选项（用于数据源表单） */
export interface DataSourceOption {
  id: string;
  name: string;
  type: string;
  host: string;
  port?: number;
  database: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'PERMISSION_REQUIRED';
  selectedTableCount?: number;
  scannedFieldCount?: number;
}

/** 数据源表单数据 */
export interface DataSourceFormData {
  selectedId: string;
  options: DataSourceOption[];
  showConnectionTest?: boolean;
  connectionTestResult?: {
    success: boolean;
    latencyMs?: number;
    message?: string;
  };
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
