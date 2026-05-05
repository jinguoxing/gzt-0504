# 14_IMPLEMENTATION_PROMPT

## 可直接给大模型执行的前端实现提示词

你现在要基于当前项目实现 Semovix / Xino 语义治理与智能工作台的前端原型。请严格按照以下合同执行，不要自行扩展产品形态。

### 一、技术栈

使用：

```text
React + TypeScript + Vite + Tailwind CSS + lucide-react
```

先使用 mock 数据，不连接真实后端。

### 二、必须实现的页面

实现以下路由：

```text
/ai-workbench
/tasks/:taskId
```

`/ai-workbench` 需要支持：

1. 首页空白态。
2. 输入后解析中态。
3. 右侧任务草稿抽屉态。

`/tasks/:taskId` 需要支持：

1. 执行中主态。
2. 点击字段后右侧详情确认态。
3. 完成态。

### 三、核心交互要求

1. 首页主视觉必须是大输入框。
2. 上传文件、选择数据源、使用模板是辅助入口，不是主流程。
3. 输入任务后不跳独立草稿页，而是在右侧打开任务草稿抽屉。
4. 草稿抽屉必须展示“尚未开始执行”。
5. 用户可以通过对话修改草稿，右侧草稿配置必须同步更新。
6. 点击“创建并开始执行”后进入 `/tasks/:taskId`。
7. 执行页不要使用传统聊天气泡。
8. 用户消息必须右侧轻量显示，Xino 消息必须左侧显示。
9. Xino 消息必须包含普通文本说明 + 结构化结果模板。
10. 执行页不要使用左侧大序号流程线。
11. 执行页默认只展示当前字段语义理解阶段，不要铺满所有未来阶段模板。
12. 点击字段结果行，右侧显示字段详情。

### 四、必须拆分的组件

请至少创建以下组件：

```text
components/layout/AppShell.tsx
components/layout/LeftNav.tsx
components/layout/TopBar.tsx
components/workbench/WorkbenchInput.tsx
components/workbench/InputQuickActions.tsx
components/workbench/TaskDraftDrawer.tsx
components/conversation/ConversationStream.tsx
components/conversation/MessageBlock.tsx
components/task/TaskHeader.tsx
components/task/TaskFocusCard.tsx
components/task/TaskPlanSidebar.tsx
components/task/TaskActionInput.tsx
components/result/ResultBlockRenderer.tsx
components/result/TextSummaryResult.tsx
components/result/MetricSummaryResult.tsx
components/result/TableResult.tsx
components/result/IssueListResult.tsx
components/result/ChangeSummaryResult.tsx
components/result/ConfirmationResult.tsx
components/result/DeliverableResult.tsx
components/detail/FieldDetailPanel.tsx
```

### 五、结果模板规则

所有 Xino 返回的结构化内容必须通过 `ResultBlockRenderer` 渲染。

映射规则：

```text
text_summary → TextSummaryResult
metric_summary → MetricSummaryResult
table → TableResult
issue_list → IssueListResult
change_summary → ChangeSummaryResult
confirmation → ConfirmationResult
deliverable_list → DeliverableResult
graph → GraphResult，如未实现则用折叠预览
fallback → FallbackResult，如未实现则用通用异常卡
```

### 六、Mock 数据

使用以下 mock 文件：

```text
src/mocks/workbench-home.json
src/mocks/task-draft.json
src/mocks/task-execution.json
src/mocks/field-review.json
src/mocks/task-completed.json
```

如果当前项目不支持直接 import JSON，可以转换成 `.ts` 导出对象。

### 七、样式要求

- 使用白色/浅灰背景。
- 主色使用蓝色。
- 状态色：完成绿、执行蓝、待确认橙、风险红、待开始灰。
- 卡片圆角 12-16px。
- 轻阴影。
- 中文不能溢出、不能重叠。
- 页面风格要像真实企业级 SaaS 产品，不要像海报或 BI 大屏。

### 八、需要移除或避免

1. 移除演示用 Floating View Switcher。
2. 不要传统聊天气泡。
3. 不要大序号流程线。
4. 不要把所有结果模板一次性堆在执行页。
5. 不要把草稿做成独立页面。
6. 不要硬编码大量页面内容到组件里，尽量从 mock 读取。

### 九、验收标准

实现完成后必须满足：

```text
首页输入 → 草稿抽屉 → 对话调整草稿 → 创建任务 → 执行页 → 点击字段打开详情 → 确认字段
```

这一条主链路必须可点击、可演示。
