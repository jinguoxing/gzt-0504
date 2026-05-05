# 12_MOCK_DATA_SPEC

## 1. Mock 文件目标

Mock 数据用于驱动前端静态原型，不接真实后端。页面内容必须从 mock 中读取。

## 2. 文件清单

```text
mock/workbench-home.json
mock/task-draft.json
mock/task-execution.json
mock/field-review.json
mock/task-completed.json
```

## 3. workbench-home.json

用于 `/ai-workbench` 首页空白态。

必须包含：

- currentUser
- project
- recentTasks
- capabilityCards
- commonResources
- inputPlaceholders

## 4. task-draft.json

用于 `/ai-workbench?draftId=xxx` 草稿抽屉态。

必须包含：

- draft
- conversationMessages
- suggestedAdjustments
- highlightedKeys
- changeLogs

## 5. task-execution.json

用于 `/tasks/:taskId` 执行态。

必须包含：

- task header
- current focus
- stages
- messages
- resultBlocks
- rightSidebar
- deliverables

## 6. field-review.json

用于详情确认态。

必须包含：

- selectedField
- fieldCandidates
- sampleValues
- reasoning
- relatedObjects
- operationLogs
- availableActions

## 7. task-completed.json

用于完成态。

必须包含：

- completion summary
- stage completion timeline
- deliverables
- result summary
- next recommendations
- sidebar summary

## 8. 数据质量要求

- 所有 ID 必须稳定。
- 所有状态值必须来自 `11_DATA_MODEL_TYPES.md`。
- 所有 resultBlocks 必须包含 type、title、data。
- 表格数据不少于 5 行。
- 交付物不少于 4 个。
- 风险项不少于 2 个。
