# 08_COMPONENT_SPEC

## 1. Layout Components

### AppShell

职责：统一页面骨架。

Props：

```ts
type AppShellProps = {
  activeNav: 'home' | 'ai-workbench' | 'tasks' | 'files' | 'history' | 'shared';
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
};
```

### LeftNav

包含：导航项、固定任务、最近任务、用户信息。

### TopBar

包含：项目选择、搜索、通知、帮助、设置、用户头像。

## 2. Workbench Components

### WorkbenchInput

职责：首页主输入框。

Props：

```ts
type WorkbenchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onGenerateDraft: () => void;
  onAttachFile: () => void;
  onSelectResource: () => void;
};
```

### InputQuickActions

上传文件、选择数据源、使用模板、从历史任务开始。

### TaskCapabilityCard

常用任务能力卡。

### RecentContinueList

最近继续任务列表。

### CommonResourceList

常用资源列表，点击插入输入框。

## 3. Conversation Components

### ConversationStream

职责：渲染用户与 Xino 的任务流。

规则：

- 用户消息右侧。
- Xino 消息左侧。
- 不使用传统气泡。
- Xino 消息支持 resultBlocks。

### MessageBlock

Props：

```ts
type MessageBlockProps = {
  message: XinoMessage;
  onAction: (action: MessageAction) => void;
};
```

### UserInstructionBlock

右侧轻量指令块。

### XinoOutputBlock

左侧工作输出块：文本说明 + ResultBlockRenderer。

## 4. Draft Components

### TaskDraftDrawer

职责：右侧草稿确认抽屉。

Props：

```ts
type TaskDraftDrawerProps = {
  draft: TaskDraft;
  highlightedKeys?: string[];
  onClose: () => void;
  onEditConfig: (key: keyof TaskDraft) => void;
  onSaveDraft: () => void;
  onCreateTask: () => void;
};
```

### DraftConfigItem

单个配置项，如数据源、扫描范围、上下文资源、交付物。

### ChangeSummaryCard

展示草稿配置变更前后对比。

## 5. Task Components

### TaskHeader

任务标题、状态、元信息、分享、更多。

### TaskFocusCard

当前任务焦点卡。

Props：

```ts
type TaskFocusCardProps = {
  stageName: string;
  stageIndex: number;
  totalStages: number;
  progress: number;
  summary: string;
  actions: MessageAction[];
};
```

### TaskPlanSidebar

右侧任务计划。

### CompletedStageStrip

最近完成阶段摘要。

### TaskActionInput

底部下一步行动输入框。

## 6. Result Components

### ResultBlockRenderer

职责：根据 `resultBlock.type` 渲染具体模板。

```ts
switch (block.type) {
  case 'text_summary': return <TextSummaryResult />;
  case 'metric_summary': return <MetricSummaryResult />;
  case 'table': return <TableResult />;
  case 'issue_list': return <IssueListResult />;
  case 'change_summary': return <ChangeSummaryResult />;
  case 'confirmation': return <ConfirmationResult />;
  case 'graph': return <GraphResult />;
  case 'deliverable_list': return <DeliverableResult />;
  default: return <FallbackResult />;
}
```

### 必须实现的 P0 模板

- TextSummaryResult
- MetricSummaryResult
- TableResult
- IssueListResult
- ChangeSummaryResult
- ConfirmationResult
- DeliverableResult

### P1 模板

- GraphResult
- ConfigFormResult
- RecommendationResult
- StageProgressResult
- FallbackResult

## 7. Detail Components

- FieldDetailPanel
- ObjectDetailPanel
- IssueDetailPanel
- DeliverableDetailPanel

## 8. 组件复用规则

- 不要在页面中重复写相似表格和指标卡。
- 所有结果类展示必须走 ResultBlockRenderer。
- 所有按钮操作必须走统一 `MessageAction`。
- 所有状态标签必须用 `StatusBadge`。
