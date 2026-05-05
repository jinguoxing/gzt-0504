# 08_COMPONENT_SPEC.md

# 找数问数前端组件规格 v1.0

## 1. 布局组件

| 组件 | 说明 |
|---|---|
| `AppShell` | 全局布局，左侧导航 + 顶部栏 + 主内容 |
| `LeftNav` | 左侧导航，包含最近任务 |
| `TopBar` | 项目选择、搜索、通知、用户 |
| `MainContent` | 中间内容容器 |
| `RightSidebar` | 右侧答案依据/详情栏 |

---

## 2. 首页组件

| 组件 | 说明 |
|---|---|
| `WorkbenchHomePage` | AI 工作台首页 |
| `WorkbenchHero` | 标题与说明 |
| `WorkbenchInput` | 大输入框 |
| `IntentSuggestionList` | 示例问题 |
| `RecentQuestionList` | 最近问数任务 |
| `CommonResourceChips` | 常用指标/数据源 |
| `IntentDetectingOverlay` | 意图识别 loading |

---

## 3. 找数问数页面组件

| 组件 | 说明 |
|---|---|
| `DataQaPage` | 找数问数执行页主容器 |
| `DataQaHeader` | 页面标题与轻操作，不含当前问题输入框 |
| `QuestionThread` | 问答流容器 |
| `UserQuestionRow` | 用户右侧轻量提问条 |
| `XinoAnswerBlock` | Xino 左侧文本说明 + 结果模板组 |
| `ResultBlockRenderer` | 根据 resultType 渲染结果模板 |
| `FollowupInputBar` | 底部继续追问输入框 |

---

## 4. 结果模板组件

| resultType | 组件 | 说明 |
|---|---|---|
| `single_metric_answer` | `SingleMetricAnswerCard` | 单指标答案大数字卡 |
| `metric_comparison` | `MetricComparisonCard` | 本期/上期/变化对比 |
| `trend_chart` | `TrendChartCard` | 时间趋势图 |
| `comparison_trend` | `ComparisonTrendCard` | v3 首屏合并对比 + 趋势 |
| `breakdown` | `BreakdownCard` | 按维度拆解 |
| `ranking` | `RankingCard` | Top/Bottom 排名 |
| `data_table` | `DataTablePreview` | 明细表节选 |
| `data_source_trace` | `EvidenceSummaryCard` | 数据依据摘要 |
| `insight_explanation` | `InsightExplanationCard` | 原因解释 |
| `contribution_analysis` | `ContributionAnalysisCard` | 贡献度分析 |
| `recommendation` | `FollowupSuggestionCard` | 推荐追问/动作 |
| `clarification` | `ClarificationCard` | 口径确认 |
| `fallback` | `FallbackResultCard` | 异常/无结果 |

---

## 5. 右侧栏组件

| 组件 | 说明 |
|---|---|
| `AnswerEvidenceSidebar` | 找数问数默认右侧栏 |
| `CurrentMetricScopeCard` | 当前口径 |
| `DataEvidenceCard` | 数据依据 |
| `QueryPlanSqlCollapse` | 查询计划 / SQL，默认折叠 |
| `FollowupContextCollapse` | 追问上下文，默认折叠 |
| `MetricDetailPanel` | 指标口径详情 |
| `DataSourceDetailPanel` | 数据来源详情 |
| `SqlDetailPanel` | SQL 详情 |
| `RowDetailPanel` | 表格行详情 |
| `ConfidenceDetailPanel` | 可信度说明 |

---

## 6. 组件层级

```text
DataQaPage
├─ AppShell
│  ├─ LeftNav
│  ├─ TopBar
│  ├─ DataQaHeader
│  ├─ QuestionThread
│  │  ├─ UserQuestionRow
│  │  ├─ XinoAnswerBlock
│  │  │  ├─ XinoLeadText
│  │  │  └─ ResultBlockRenderer
│  │  │     ├─ SingleMetricAnswerCard
│  │  │     ├─ ComparisonTrendCard
│  │  │     ├─ EvidenceSummaryCard
│  │  │     └─ FollowupSuggestionCard
│  │  └─ ...
│  ├─ FollowupInputBar
│  └─ AnswerEvidenceSidebar
```

---

## 7. 关键组件规则

### `UserQuestionRow`

必须：

```text
右对齐
轻量文本条
无气泡尖角
不使用厚背景
```

### `XinoAnswerBlock`

必须：

```text
左对齐
先显示文本说明
再显示结果模板组
```

### `ResultBlockRenderer`

必须：

```text
根据 resultType 渲染
支持一个消息多个 resultBlocks
不得硬编码单一场景
```

### `AnswerEvidenceSidebar`

默认内容：

```text
当前口径 展开
数据依据 展开
查询计划 / SQL 折叠
追问上下文 折叠
```

---

## 8. 禁止组件形态

```text
ChatBubble
TimelineStep
TaskPlanSidebar
CurrentQuestionInput
HeavyDashboardGrid
```

找数问数不应使用上述形态作为主结构。
