# 08｜Component Spec

## 1. 全局组件

### AppShell

用途：统一承载所有页面外壳。

结构：

```tsx
<AppShell>
  <LeftNav />
  <TopBar />
  <Main />
  {rightPanel}
</AppShell>
```

要求：

- 左侧导航固定宽度 240px。
- 顶部栏高度 64px。
- 页面内容区根据是否有右侧栏自适应。
- 不允许页面自行重写 Logo、TopBar、LeftNav。

### LeftNav

固定导航：

```text
首页
AI 工作台
任务
文件
历史记录
与我共享
```

Props：

```ts
interface LeftNavProps {
  activeKey: 'home' | 'workbench' | 'tasks' | 'files' | 'history' | 'shared';
}
```

### TopBar

包含：

- ProjectSelector
- GlobalSearch
- NotificationIcon
- HelpIcon
- SettingsIcon
- UserMenu

---

## 2. AI 工作台组件

### WorkbenchHero

展示首页标题、副标题。

### WorkbenchInput

Props：

```ts
interface WorkbenchInputProps {
  value: string;
  placeholder: string;
  disabled?: boolean;
  onChange(value: string): void;
  onSubmit(): void;
  onAttach(): void;
  onMentionResource(): void;
}
```

### CollapsedAssistSection

首页下方默认收起入口：

- 常用任务
- 最近继续
- 常用资源

---

## 3. 草稿抽屉组件

### ConversationStream

任务流式消息列表，不使用聊天气泡。

```ts
interface ConversationMessage {
  id: string;
  role: 'user' | 'xino' | 'system';
  authorName: string;
  createdAt: string;
  content: string;
  status?: 'thinking' | 'updated' | 'error';
  attachments?: ContextResource[];
  changeSummary?: DraftChangeSummary;
}
```

### MessageBlock

纵向消息块，显示角色、时间、正文和附加卡片。

### SuggestedAdjustmentChips

用于展示 Xino 推荐调整项。

### ChangeSummaryCard

展示草稿变更：

```text
扫描范围：全库 → ods_scm, dwd_scm
预计耗时：2.5 小时 → 1.4 小时
```

### DraftDrawer

右侧任务草稿抽屉。

Props：

```ts
interface DraftDrawerProps {
  draft: TaskDraft;
  highlightedSection?: string;
  onClose(): void;
  onSave(): void;
  onOpenAdvancedConfig(): void;
  onSubmit(): void;
}
```

### DraftSection

草稿分区组件。

### DraftConfigItem

数据源、扫描范围、上下文、交付物等单项配置展示。

### DraftActionBar

底部固定操作区。

---

## 4. 任务中心组件

### TaskCenterPage

任务中心摘要页面。

Props：

```ts
interface TaskCenterPageProps {
  scope: TaskScope;
  summary: TaskCenterSummary;
  runningTasks: Task[];
  actionItems: ReviewItem[];
  recentVisits: RecentVisit[];
  recentActivities: Activity[];
  recentDeliverables: Deliverable[];
}
```

### ScopeTabs

范围切换：

```text
我的任务 / 团队任务 / 全部任务
```

Props：

```ts
interface ScopeTabsProps {
  value: TaskScope;
  onChange(scope: TaskScope): void;
}
```

### TaskMetricCards

5 个指标卡。

```ts
interface TaskMetric {
  key: string;
  label: string;
  value: number;
  trend?: number;
  statusTone?: 'blue' | 'green' | 'orange' | 'red' | 'gray';
  onClick?: () => void;
}
```

### RunningTaskTable

任务中心中的运行任务摘要表。

列：

- 任务名称
- 类型
- 当前阶段
- 整体进度
- 负责人
- 最近更新时间
- 状态
- 操作

### ActionQueueCard

待我处理模块。

内部 Tab：

```text
全部 / 待确认 / 待审核 / 异常 / 继续执行
```

### RecentVisitList

最近访问卡片列表。

### QuickStartStrip

底部轻量入口。

---

## 5. 全部任务列表组件

### AllTasksPage

完整任务列表页。

Props：

```ts
interface AllTasksPageProps {
  state: TaskListState;
  summary: TaskListSummary;
  tasks: Task[];
  filterSummary: FilterSummary;
}
```

### TaskListToolbar

搜索与筛选工具栏。

控件：

- 搜索任务名称
- 状态
- 类型
- 项目
- 负责人
- 优先级
- 时间
- 排序
- 批量操作
- 列设置

### TaskListTable

完整任务表格。

列：

```text
选择框 / 任务名称 / 类型 / 所属项目 / 当前阶段 / 整体进度 / 负责人 / 优先级 / 待处理数 / 状态 / 最近更新时间 / 操作
```

### BulkActionBar

选中任务后显示。

```text
已选择 3 个任务
批量转派 / 批量归档 / 批量导出 / 关闭
```

### TaskListRightPanel

右侧辅助栏：

- 筛选摘要
- 快捷视图
- 说明 / 提示

---

## 6. 任务执行组件

### TaskHeader

显示任务标题、状态、元信息和操作。

### TaskFocusCard

当前任务焦点卡。

### TaskProgressMeta

阶段、进度、更新时间。

### StageResultCard

当前阶段结果卡。

结构：

```text
结论摘要
指标组
结果表格
推荐动作
```

### MetricGroup / MetricTile

用于阶段指标和任务指标。

### ResultTable

阶段结果表格。

### CompletedStageStrip

压缩展示已完成阶段。

### TaskActionInput

底部行动输入框。

### TaskSidePanel

右侧任务侧栏，包含：

- TaskPlanTab
- TaskDetailTab
- DataSourceSummaryCard
- RiskReminderCard
- DeliverablePreviewList

---

## 7. Review 组件

### ReviewDetailPage

人工确认/审核页面。

### ReviewOverviewCards

待确认字段、冲突字段、异常字段、已处理。

### ReviewFilterTabs

全部、待确认、冲突、异常、已处理。

### FieldReviewTable

字段确认表格。

### FieldDetailPanel

右侧字段详情面板。

### XinoSuggestionCard

底部建议卡。

---

## 8. 完成态组件

### CompletedTaskPage

任务完成页面。

### CompletionHeroCard

完成总结卡。

### StageCompletionTimeline

阶段完成时间线。

### DeliverableTable

交付物列表。

### ResultSummaryCard

结果摘要。

### NextStepRecommendation

下一步推荐。

---

## 9. 通用基础组件

| 组件 | 说明 |
|---|---|
| StatusBadge | 状态标签 |
| PriorityDot | 优先级点 |
| ProgressBar | 进度条 |
| AvatarName | 头像 + 姓名 |
| IconButton | 图标按钮 |
| DataCard | 通用数据卡 |
| SectionCard | 区块卡片 |
| EmptyState | 空状态 |
| Skeleton | 骨架屏 |
| Pagination | 分页 |
| FilterSelect | 筛选下拉 |
| SearchInput | 搜索框 |
| FileTypeIcon | 文件图标，颜色要克制 |
