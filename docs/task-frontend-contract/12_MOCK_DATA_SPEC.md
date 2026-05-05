# 12｜Mock Data Spec

## 1. Mock 文件清单

| 文件 | 页面 |
|---|---|
| `mock/workbench-home.json` | AI 工作台首页 |
| `mock/task-draft.json` | 草稿抽屉态 |
| `mock/task-execution.json` | 任务执行页 |
| `mock/field-review.json` | 字段确认/冲突处理页 |
| `mock/task-completed.json` | 完成态/交付物页 |

> 任务中心和全部任务列表当前按用户指定目录未单独增加 mock 文件。实现时可从 `task-execution.json`、`field-review.json`、`task-completed.json` 抽取任务、待办、交付物数据，也可以在后续补充 `task-center.json` 与 `all-tasks.json`。

---

## 2. Mock 通用要求

- 所有 ID 稳定可复用。
- 时间字段使用 ISO 字符串。
- 页面展示时可格式化为“今天 09:50”“昨天 17:48”。
- 用户统一使用 `李桐` 作为当前用户。
- 项目统一使用 `供应链语义治理项目`。
- 数据源统一使用 `supply_chain_prod`。

---

## 3. workbench-home.json

包含：

```ts
{
  currentUser: User,
  project: Project,
  collapsedSections: {
    commonTasks: number,
    recentContinue: number,
    commonResources: number
  },
  inputPlaceholder: string
}
```

---

## 4. task-draft.json

包含：

```ts
{
  draft: TaskDraft,
  conversation: ConversationMessage[]
}
```

必须包含一条扫描范围变更记录：

```text
全库 → ods_scm, dwd_scm
```

---

## 5. task-execution.json

包含：

```ts
{
  task: Task,
  conversation: ConversationMessage[],
  stageResult: {
    title: string,
    summary: string,
    metrics: Metric[],
    tableRows: any[]
  },
  sidePanel: {
    plan: TaskStage[],
    dataSource: DataSource,
    risks: RiskItem[],
    deliverables: Deliverable[]
  }
}
```

关键数字：

```text
扫描字段：4,920
自动通过字段：3,812
待确认字段：326
冲突字段：41
异常字段：37
建议忽略字段：704
```

---

## 6. field-review.json

包含：

```ts
{
  task: Task,
  overview: {
    pendingFields: 326,
    conflictFields: 41,
    abnormalFields: 37,
    processedFields: 128
  },
  fields: FieldReviewItem[],
  selectedField: FieldReviewItem,
  sidePanel: {...}
}
```

---

## 7. task-completed.json

包含：

```ts
{
  task: Task,
  completionSummary: Metric[],
  stageTimeline: TaskStage[],
  deliverables: Deliverable[],
  resultSummary: string[],
  nextRecommendations: string[]
}
```

关键数字：

```text
已扫描字段：4,920
已生成业务对象：12
已确认对象关系：21
已产出交付物：6
待跟进事项：2
```
