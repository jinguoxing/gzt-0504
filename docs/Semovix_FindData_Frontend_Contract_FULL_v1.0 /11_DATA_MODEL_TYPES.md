# 11_DATA_MODEL_TYPES.md

# 找数问数数据模型 TypeScript 类型 v1.0

```ts
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

export type ResultBlockType =
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
  | 'fallback';

export type User = {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
};

export type DataQaSession = {
  sessionId: string;
  projectId: string;
  projectName: string;
  status: DataQaSessionStatus;
  originalQuestion: string;
  queryType: DataQaQueryType;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  messages: DataQaMessage[];
  evidence: AnswerEvidence;
  exports?: ExportedFile[];
};

export type DataQaMessage = {
  id: string;
  role: 'user' | 'xino' | 'system';
  createdAt: string;
  displayTime: string;
  text: string;
  resultBlocks?: ResultBlock[];
  suggestedFollowups?: FollowupSuggestion[];
};

export type ResultBlock = {
  id: string;
  type: ResultBlockType;
  title: string;
  summary?: string;
  data: unknown;
  actions?: ResultAction[];
  defaultCollapsed?: boolean;
};

export type ResultAction = {
  id: string;
  label: string;
  actionType:
    | 'followup'
    | 'open_source'
    | 'open_sql'
    | 'open_detail'
    | 'export'
    | 'generate_report'
    | 'create_governance_task';
  payload?: Record<string, unknown>;
};

export type FollowupSuggestion = {
  id: string;
  label: string;
  question: string;
  queryType: DataQaQueryType;
};

export type AnswerEvidence = {
  metricScope: MetricScope;
  dataEvidence: DataEvidence;
  queryPlan: QueryPlan;
  followupContext: FollowupContext;
};

export type MetricScope = {
  metricName: string;
  timeRange: {
    label: string;
    start: string;
    end: string;
  };
  businessDomain: string;
  calculationDefinition: string;
  filters: string[];
};

export type DataEvidence = {
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
};

export type QueryPlan = {
  steps: string[];
  sql: string;
  execution: {
    durationMs: number;
    scannedRows: number;
    cacheStatus: 'hit' | 'miss';
    indexUsed?: string;
  };
  defaultCollapsed: boolean;
};

export type FollowupContext = {
  questions: string[];
  currentAnalysisFocus?: string;
};

export type ExportedFile = {
  id: string;
  filename: string;
  fileType: 'xlsx' | 'csv' | 'pdf' | 'md' | 'json' | 'txt';
  size?: string;
  purpose: string;
  createdAt: string;
  url?: string;
};
```

---

## 结果块数据结构示例

### 单指标答案

```ts
export type SingleMetricAnswerData = {
  metricName: string;
  value: number;
  formattedValue: string;
  unit?: string;
  period: string;
  mom?: number;
  yoy?: number;
  definition: string;
};
```

### 趋势/对比

```ts
export type ComparisonTrendData = {
  current: { label: string; value: number; formattedValue: string };
  previous: { label: string; value: number; formattedValue: string };
  delta: { value: number; formattedValue: string; rate: number };
  trend: Array<{ period: string; value: number; growthRate?: number }>;
  keyFindings: string[];
};
```

### 数据表

```ts
export type DataTableData = {
  columns: Array<{ key: string; label: string; type?: string }>;
  rows: Array<Record<string, unknown>>;
  total: number;
  filters: string[];
  previewLimit: number;
};
```
