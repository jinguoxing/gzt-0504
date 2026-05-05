# 02_ROUTES

## 1. 路由目标

前端应从 Demo 状态切换升级为正式路由。路由需要支持页面刷新、分享链接和右侧面板状态恢复。

## 2. 推荐路由表

| 路由 | 页面 | 状态 |
|---|---|---|
| `/ai-workbench` | AI 工作台首页 | 首页空白态 |
| `/ai-workbench?draftId=:draftId` | AI 工作台 | 草稿抽屉态 |
| `/tasks/:taskId` | 任务执行页 | 执行中 / 完成 / 失败，由 task.status 决定 |
| `/tasks/:taskId?panel=plan` | 任务执行页 | 右侧任务计划 |
| `/tasks/:taskId?panel=field-detail&fieldId=:fieldId` | 任务执行页 | 右侧字段详情 |
| `/tasks/:taskId?panel=object-detail&objectId=:objectId` | 任务执行页 | 右侧对象详情 |
| `/tasks/:taskId?panel=issue-detail&issueId=:issueId` | 任务执行页 | 右侧风险详情 |
| `/tasks/:taskId?panel=deliverables` | 任务执行页 | 交付物详情 |
| `/tasks/:taskId?status=completed` | 任务执行页 | 完成态 |

## 3. 跳转规则

### 3.1 首页 → 草稿抽屉

```text
用户输入任务并点击“生成任务草稿”
→ 创建 draftId
→ URL 更新为 /ai-workbench?draftId=draft_scm_001
→ 页面状态变为 draft
→ 右侧打开 TaskDraftDrawer
```

### 3.2 草稿抽屉 → 任务执行页

```text
用户点击“创建并开始执行”
→ createTaskFromDraft(draftId)
→ 返回 taskId
→ 跳转 /tasks/task_scm_001
```

### 3.3 执行页 → 详情确认态

```text
用户点击表格字段 po_status
→ URL 更新 /tasks/task_scm_001?panel=field-detail&fieldId=field_po_status
→ 右侧栏切换为 FieldDetailPanel
```

## 4. 路由实现建议

推荐使用 `react-router-dom`：

```tsx
<Route path="/ai-workbench" element={<WorkbenchPage />} />
<Route path="/tasks/:taskId" element={<TaskPage />} />
```

通过 `useSearchParams()` 读取 `draftId`、`panel`、`fieldId` 等参数，控制右侧栏状态。

## 5. Demo 迁移要求

如果当前项目存在 `Floating View Switcher` 或本地 `HOME / DRAFT / EXECUTION` 切换按钮，应移除或仅在开发环境隐藏显示。
