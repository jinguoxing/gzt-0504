---

# FILE: 00_FRONTEND_OVERVIEW.md

# 00_FRONTEND_OVERVIEW

## 1. 项目目标

本前端合同用于生成 **Semovix / Xino 语义治理与智能工作台** 的前端页面原型与后续实现。

产品核心心智：

```text
用户说需求 → Xino 理解意图 → 生成任务草稿 → 用户通过对话/卡片调整 → 创建并执行 → 阶段推进 → 结构化结果 → 交付物闭环
```

本合同覆盖以下核心页面与状态：

1. **AI 工作台首页**：极简任务输入入口。
2. **草稿抽屉态**：输入后在当前页右侧打开任务草稿抽屉，不跳独立确认页。
3. **任务执行页**：任务正式创建后，展示当前阶段、阶段结果、右侧任务计划。
4. **详情确认态**：点击字段、对象、风险项后，右侧展示详情并支持确认/修改/忽略。
5. **完成态**：任务完成后展示交付物、总结和下一步建议。

## 2. 实现原则

### 2.1 AI 原生，而不是表单优先

首页不要做成复杂配置表单。用户先表达目标，Xino 再生成任务草稿。

### 2.2 草稿能力必须存在，但默认不做独立页面

语义治理任务涉及数据源、扫描范围、上下文、执行方案和交付物，不能直接执行。默认使用右侧抽屉承载草稿确认。

### 2.3 执行页不是聊天页

执行页中间区域是 **任务流式对话 + 结构化结果卡片**，不是普通聊天窗口。

规则：

```text
用户消息：右侧轻量指令块
Xino 消息：左侧工作输出块
Xino 输出 = 普通文本说明 + 结构化结果模板
禁止传统 IM 气泡
禁止左侧大序号流程线
```

### 2.4 结果展示必须模板化

Xino 返回不同场景的结果时，前端必须按 `resultType` 渲染到固定模板，避免大模型或前端临时发挥。

核心模板包括：

- `text_summary`
- `metric_summary`
- `table`
- `issue_list`
- `change_summary`
- `stage_progress`
- `confirmation`
- `graph`
- `deliverable_list`
- `recommendation`
- `config_form`
- `fallback`

## 3. 技术建议

推荐技术栈：

```text
React + TypeScript + Vite + Tailwind CSS + lucide-react
```

实现阶段先使用 mock 数据，不接真实后端接口。所有页面内容必须从 mock 或状态模型读取，避免硬编码散落在组件中。

## 4. 推荐目录

```text
src
├── app
│   ├── App.tsx
│   ├── routes.tsx
│   └── AppShell.tsx
├── pages
│   ├── WorkbenchPage.tsx
│   └── TaskPage.tsx
├── components
│   ├── layout
│   ├── workbench
│   ├── conversation
│   ├── draft
│   ├── task
│   ├── result
│   └── detail
├── mocks
├── types
└── styles
```

## 5. 非目标

本阶段不实现：

- 真实数据源连接。
- 真实文件上传解析。
- 后端任务调度。
- 权限体系。
- 多人协作实时同步。

本阶段重点是：

```text
页面结构正确
交互流转正确
组件可复用
Mock 数据驱动
视觉风格统一
```



---

# FILE: 01_PAGE_FLOW_AND_STATE_MODEL.md

# 01_PAGE_FLOW_AND_STATE_MODEL

## 1. 总体流程

```text
/ai-workbench
  首页空白态
    ↓ 用户输入任务目标
  解析中态
    ↓ Xino 生成任务草稿
  草稿抽屉态
    ↓ 用户通过对话或卡片调整草稿
  草稿已确认
    ↓ 点击“创建并开始执行”
/tasks/:taskId
  执行中主态
    ↓ 阶段结果产生
  详情确认态
    ↓ 全部阶段完成
  完成态
```

## 2. 页面状态

### 2.1 Workbench 页面状态

| 状态 | 名称 | 说明 |
|---|---|---|
| `empty` | 首页空白态 | 只展示主输入框和轻量辅助内容 |
| `parsing` | 解析中态 | Xino 正在识别意图、匹配资源、生成草稿 |
| `draft` | 草稿抽屉态 | 右侧滑出任务草稿抽屉，中间保留对话 |
| `draft_changed` | 草稿已调整 | 用户通过对话或卡片修改草稿，抽屉同步更新 |
| `creating` | 创建中 | 点击创建后，生成正式任务并跳转执行页 |

### 2.2 Task 页面状态

| 状态 | 名称 | 说明 |
|---|---|---|
| `executing` | 执行中主态 | 展示当前任务焦点、阶段结果、任务计划 |
| `review_detail` | 详情确认态 | 点击字段/对象/风险项后，右侧展示详情 |
| `waiting_confirm` | 待确认态 | 当前阶段需要用户确认后才能继续 |
| `completed` | 完成态 | 展示任务总结、交付物、下一步建议 |
| `failed` | 失败态 | 展示失败原因和重试/修改入口 |

## 3. 右侧栏状态模型

| 页面状态 | 右侧栏内容 | 职责 |
|---|---|---|
| 首页空白态 | 无右侧栏 | 保持首页简洁 |
| 草稿抽屉态 | `TaskDraftDrawer` | 定任务、确认配置 |
| 执行态 | `TaskPlanSidebar` | 看进度、看上下文、看风险 |
| 详情确认态 | `FieldDetailPanel` / `ObjectDetailPanel` / `IssueDetailPanel` | 看详情、做确认 |
| 完成态 | `TaskSummarySidebar` | 看总结、继续复用 |

## 4. 对话流状态

### 4.1 消息类型

| 类型 | 说明 |
|---|---|
| `user_instruction` | 用户输入的任务目标或调整要求 |
| `xino_text` | Xino 普通文本说明 |
| `draft_change` | 草稿变更摘要 |
| `task_event` | 阶段开始、完成、暂停、失败等事件 |
| `stage_result` | 阶段结构化结果 |
| `confirmation` | 需要用户确认的操作 |
| `error` | 异常、失败、无结果 |

### 4.2 消息布局规则

```text
用户消息：右侧对齐，轻量指令块，不做传统聊天气泡。
Xino 消息：左侧对齐，包含文本说明 + 结果模板。
结果模板：嵌入 Xino 消息下方，使用统一卡片样式。
```

## 5. 草稿调整流程

```text
用户输入：“只扫描采购相关 Schema”
→ Xino 识别为 scanScope 修改
→ 更新 TaskDraft.scanScope
→ 中间追加 ChangeSummaryResult
→ 右侧草稿抽屉对应卡片高亮“刚刚更新”
```

## 6. 执行阶段推进流程

```text
任务进入阶段 N
→ 右侧任务计划高亮阶段 N
→ 中间显示 Xino 文本说明
→ 阶段产生 resultBlocks
→ ResultBlockRenderer 按 resultType 渲染模板
→ 若有待确认项，底部和右侧展示推荐动作
```



---

# FILE: 02_ROUTES.md

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



---

# FILE: 03_PAGE_SPEC_WORKBENCH_HOME.md

# 03_PAGE_SPEC_WORKBENCH_HOME

## 1. 页面定位

AI 工作台首页是用户进入 Semovix 后发起任务的主入口。页面必须足够简单，核心是让用户说出目标。

页面心智：

```text
说需求，而不是填配置
```

## 2. 页面布局

```text
AppShell
├── LeftNav
├── TopBar
└── MainContent
    ├── WorkbenchHero
    ├── WorkbenchInput
    ├── InputQuickActions
    └── OptionalAssistSections
        ├── TaskCapabilityList
        ├── RecentContinueList
        └── CommonResourceList
```

首页默认 **不显示右侧栏**。

## 3. 主视觉

### 3.1 标题

```text
今天想让 Xino 帮你完成什么？
```

### 3.2 副标题

```text
把目标告诉我，Xino 会理解你的需求，规划步骤并生成任务草稿。
```

### 3.3 主输入框

Placeholder：

```text
输入任务目标，或 @ 数据源 / 文件 / 对象 / 知识库
```

输入框能力：

- 附件上传。
- @ 数据源 / 文件 / 对象 / 知识库。
- 语音输入入口。
- 生成任务草稿按钮。

按钮：

```text
生成任务草稿
```

## 4. 辅助入口

输入框下方可以保留轻量快捷入口，但视觉权重要低于主输入。

推荐做成小按钮或轻量卡片：

```text
上传文件
选择数据源
使用模板
从历史任务开始
```

## 5. 下方辅助区域

### 5.1 常用任务

建议标题：

```text
你可以让 Xino 做这些事
```

展示 4 个以内：

- 供应链语义治理
- 字段语义理解
- 主数据对象建模
- 数据标准梳理

### 5.2 最近继续

展示 3 个以内，默认轻量：

- 名称
- 状态
- 更新时间
- 继续按钮

### 5.3 常用资源

展示为可点击资源 chip 或卡片，点击后插入输入框：

- `@supply_chain_prod`
- `@字段语义规则.xlsx`
- `@业务对象定义.docx`

## 6. 交互规则

### 6.1 生成草稿

```text
用户输入任务目标
→ 点击生成任务草稿
→ 页面进入 parsing
→ Xino 生成 taskDraft
→ URL 更新为 /ai-workbench?draftId=xxx
→ 右侧打开草稿抽屉
```

### 6.2 快捷入口

- 上传文件：打开文件选择弹层，上传成功后以资源 chip 形式插入输入框。
- 选择数据源：打开数据源选择器，选择后插入 `@dataSource`。
- 使用模板：打开轻量模板选择器，不跳复杂模板页。
- 从历史任务开始：打开历史任务选择器，选择后生成复用草稿。

## 7. 设计约束

- 输入框是绝对主视觉。
- 首页不要展示右侧栏。
- 不要把常用任务、最近继续、常用资源做成重型看板。
- 不要默认展示复杂任务指标。
- 不要做成表单页。



---

# FILE: 04_PAGE_SPEC_DRAFT_DRAWER.md

# 04_PAGE_SPEC_DRAFT_DRAWER

## 1. 页面定位

草稿抽屉态是任务正式执行前的确认状态。它不是独立页面，而是在 `/ai-workbench` 当前页右侧滑出的任务草稿抽屉。

页面心智：

```text
中间继续对话，右侧确认草稿
```

## 2. 页面布局

```text
WorkbenchPage(draft state)
├── LeftNav
├── TopBar
├── CenterConversationArea
│   ├── UserInstructionBlock
│   ├── XinoTextBlock
│   ├── ChangeSummaryCard(optional)
│   ├── SuggestedAdjustmentChips
│   └── FollowupInput
└── TaskDraftDrawer
    ├── DrawerHeader
    ├── DraftUnderstandingSection
    ├── DraftKeyConfigSection
    ├── DraftPlanSection
    ├── DraftRiskSection
    ├── DraftStageSummary
    ├── RecentChanges(optional)
    └── FixedActionBar
```

## 3. 中间对话区

### 3.1 用户消息

右侧轻量指令块：

```text
请对供应链数据库进行语义治理，扫描 Schema、识别业务相关表、理解字段语义、生成业务对象与交付物。
```

### 3.2 Xino 回复

左侧工作输出块：

```text
我已根据你的目标生成任务草稿，你可以继续告诉我需要调整的范围、数据源和交付物。
```

推荐调整 chips：

- 只扫描采购相关 Schema
- 增加 Excel 明细文件
- 增加字段质量报告
- 调整并行度为 10

### 3.3 跟进输入框

Placeholder：

```text
继续告诉 Xino 你的调整要求，例如：只扫描采购相关 Schema，增加 Excel 明细…
```

## 4. 右侧任务草稿抽屉

### 4.1 抽屉尺寸

```text
桌面端宽度：520px - 560px
复杂内容内部滚动
底部操作固定
```

### 4.2 抽屉顶部

```text
任务草稿 · 待确认
尚未开始执行
```

必须明确这不是执行中任务。

### 4.3 任务理解

展示：

- 任务名称
- 目标摘要
- 任务类型标签
- 编辑入口

样本：

```text
任务名称：供应链语义治理闭环任务
任务类型：语义治理 / Schema 扫描 / 业务对象生成 / 交付物生成
```

### 4.4 关键配置

配置项：

| 配置 | 内容 | 操作 |
|---|---|---|
| 数据源 | supply_chain_prod / MySQL / 已连接 | 更换 |
| 扫描范围 | ods_scm, dwd_scm / 2 个 Schema | 编辑范围 |
| 上下文资源 | 3 个文件 | 继续上传 |
| 交付物 | 6 项 | 调整 |

### 4.5 推荐执行方案

```text
供应链语义治理方案
推荐
基于供应链领域最佳实践的治理流程与规则配置方案
```

操作：查看详情 / 更换方案。

### 4.6 风险提醒

```text
预计扫描约 286 张表、4,920 个字段。
部分字段命名不规范，可能需要人工确认。
建议先确认扫描范围。
```

### 4.7 执行阶段摘要

```text
预计 8 个阶段 · 约 2.5 小时
```

默认折叠，点击展开展示阶段。

### 4.8 底部固定操作

```text
保存草稿
高级配置
创建并开始执行
```

主按钮：`创建并开始执行`。

## 5. 对话调整联动规则

### 5.1 用户通过对话调整

示例：

```text
只扫描采购相关 Schema。
```

系统动作：

```text
更新 TaskDraft.scanScope
中间追加 ChangeSummaryResult
右侧扫描范围卡片高亮“刚刚更新”
更新预计耗时与风险等级
```

### 5.2 用户通过卡片编辑

示例：点击“编辑范围”。

系统动作：

```text
打开范围选择器
保存后更新 TaskDraft
中间追加 Xino 说明：已将扫描范围更新为 ods_scm、dwd_scm
```

## 6. 设计约束

- 不要把草稿抽屉做成独立页面。
- 不要让用户误以为任务已经执行。
- 中间对话和右侧草稿必须有联动感。
- 右侧抽屉信息要分区清晰，不要堆满。



---

# FILE: 05_PAGE_SPEC_TASK_EXECUTION.md

# 05_PAGE_SPEC_TASK_EXECUTION

## 1. 页面定位

任务执行页是用户点击“创建并开始执行”之后进入的正式任务页面。此时任务已经创建，有 `taskId`、执行状态、阶段计划、阶段结果和交付物。

页面心智：

```text
跑任务，看进度，看结果，做确认
```

## 2. 页面布局

```text
TaskPage
├── LeftNav
├── TopBar
├── MainExecutionArea
│   ├── TaskHeader
│   ├── TaskFocusCard
│   ├── ConversationStream
│   │   ├── UserInstructionBlock
│   │   ├── XinoOutputBlock
│   │   └── ResultBlockRenderer
│   ├── CompletedStageStrip
│   └── TaskActionInput
└── RightSidebar
    ├── TaskPlanSidebar
    ├── DataSourceSummaryCard
    ├── RiskReminderCard
    └── DeliverablePreviewList
```

## 3. 任务标题区

展示：

- 任务标题：供应链语义治理闭环任务
- 状态：执行中
- 项目：供应链语义治理项目
- 创建人：李桐
- 当前阶段：5 / 8
- 整体进度：78%
- 最近更新：09:50
- 操作：分享 / 更多

## 4. 当前任务焦点卡

必须位于页面顶部，视觉最强。

内容：

```text
当前任务焦点
字段语义理解
阶段 5 / 8
整体进度 78%
已自动理解 3,812 个字段，仍有 326 个待确认字段与 41 个冲突字段，需要人工确认后继续推进。
```

操作：

- 查看冲突字段
- 批量确认高置信字段
- 继续生成对象模型

## 5. 执行页对话区规则

### 5.1 禁止项

- 不要传统聊天气泡。
- 不要左侧大序号时间线。
- 不要把所有未来阶段默认铺开。
- 不要把执行页做成流程说明图。

### 5.2 用户消息

右侧轻量指令块：

```text
李桐 · 09:45
请继续推进字段语义理解，并重点识别冲突字段。
```

### 5.3 Xino 消息

左侧工作输出块，必须包含：

```text
消息头：Xino · 时间 · 阶段标签
普通文本说明
结果模板区域
推荐动作区域
```

示例：

```text
Xino · 09:45 · 字段语义理解
我已完成字段语义理解的主要识别工作。以下是当前阶段的关键结果，建议优先处理冲突字段。

[MetricSummaryResult]
[TableResult]
[RecommendationResult]
```

## 6. 当前默认结果模板

任务执行页默认聚焦当前阶段：字段语义理解。

默认展示：

1. `TextSummaryResult`
2. `MetricSummaryResult`
3. `TableResult`
4. `IssueListResult`
5. `RecommendationResult`

不要默认展开所有模板。Graph、Deliverable、ConfigForm、Fallback 作为后续阶段或折叠示例。

## 7. 字段语义理解结果卡

### 7.1 指标

- 自动通过字段：3,812
- 待确认字段：326
- 冲突字段：41
- 异常字段：37
- 建议忽略字段：704

### 7.2 表格

列：

```text
字段名 / 推断语义 / 置信度 / 来源 / 状态 / 操作
```

示例行：

| 字段名 | 推断语义 | 置信度 | 来源 | 状态 | 操作 |
|---|---|---:|---|---|---|
| po_status | 采购订单状态 | 0.97 | 业务词典 + 规则推断 | 高置信 | 确认 / 修改 / 忽略 |
| supplier_code | 供应商编码 | 0.96 | 命名规则 + 相似匹配 | 高置信 | 确认 / 修改 / 忽略 |
| wh_id | 仓库ID | 0.93 | 同义词库 | 待确认 | 确认 / 修改 / 忽略 |
| create_dt | 创建日期 | 0.89 | 规则推断 | 待确认 | 确认 / 修改 / 忽略 |
| line_type | 行项目类型 | 0.81 | 模式推断 | 冲突 | 确认A / 确认B / 修改 |

## 8. 右侧任务计划栏

Tab：

- 任务计划，高亮
- 任务详情
- 活动

阶段：

1. 选择与采集 已完成
2. Schema 扫描 已完成
3. 业务表识别 已完成
4. 字段候选生成 已完成
5. 字段语义理解 执行中
6. 业务对象生成 待开始
7. 血缘与影响分析 待开始
8. 质量校验与校准 待开始

下方模块：

- 上下文 / 数据源
- 风险提醒
- 最新交付物

## 9. 底部下一步操作区

输入框：

```text
输入指令或问题，获取 Xino 的建议...
```

快捷操作：

- 仅显示冲突字段
- 批量确认置信度 > 0.95 的字段
- 调整业务规则
- 导出字段理解结果
- 继续下一阶段

## 10. 交互规则

- 点击表格行 → 右侧切换字段详情。
- 点击风险项 → 右侧切换风险详情。
- 点击“批量确认高置信字段” → 展示 ConfirmationResult。
- 阶段完成 → 右侧计划更新，ConversationStream 追加阶段结果。
- 用户输入新指令 → Xino 输出普通文本 + 对应结果模板。



---

# FILE: 06_PAGE_SPEC_REVIEW_DETAIL.md

# 06_PAGE_SPEC_REVIEW_DETAIL

## 1. 页面定位

详情确认态是任务执行页中的局部状态。当用户点击字段、表、业务对象、风险项时，右侧栏从任务计划切换为详情面板，用于人机协同确认。

页面心智：

```text
在中间看列表，在右侧看详情并处理
```

## 2. 触发方式

| 触发 | 右侧面板 |
|---|---|
| 点击字段行 | FieldDetailPanel |
| 点击业务对象 | ObjectDetailPanel |
| 点击风险项 | IssueDetailPanel |
| 点击交付物 | DeliverableDetailPanel |

## 3. 字段详情面板

### 3.1 顶部

```text
字段详情
po_status
状态：冲突 / 待确认 / 高置信
```

操作：关闭 / 返回任务计划。

### 3.2 基础信息

- 字段名：po_status
- 所在表：po_header
- 所属 Schema：ods_scm
- 推断语义：采购订单状态
- 置信度：0.97
- 来源：业务词典 + 规则推断

### 3.3 样例值

```text
NEW
APPROVED
REJECTED
CANCELLED
CLOSED
ON_HOLD
```

### 3.4 推断依据

展示 Xino 为什么这样判断：

- 字段名包含 `status`
- 表名属于采购订单域
- 样例值与订单状态字典匹配
- 与 `po_order_status` 相似度 89%

### 3.5 冲突来源

如果字段存在冲突，展示：

| 候选语义 | 置信度 | 来源 |
|---|---:|---|
| 采购订单状态 | 0.78 | 业务词典 |
| 采购订单处理状态 | 0.62 | 历史映射 |

### 3.6 相关对象

- 采购订单 PurchaseOrder
- 采购订单明细 PurchaseOrderLine
- 供应商 Supplier

### 3.7 操作记录

- 09:32 Xino 自动识别为冲突字段
- 09:35 李桐 查看字段详情
- 09:40 Xino 推荐确认为采购订单状态

### 3.8 固定底部操作

- 确认为推荐语义
- 手动修改
- 忽略字段

## 4. 对象详情面板

内容：

- 对象名称
- 英文名
- 属性数量
- 来源表
- 关系对象
- 置信度
- 推荐操作

## 5. 风险详情面板

内容：

- 风险标题
- 严重级别
- 影响范围
- 受影响字段/表/对象
- 推荐修复方式
- 处理状态

操作：

- 标记已处理
- 指派成员
- 生成修复任务
- 忽略风险

## 6. 与中间区联动

- 右侧确认字段后，中间表格该行状态更新。
- 右侧修改语义后，ConversationStream 追加 Xino 变更说明。
- 右侧忽略字段后，指标卡中的待确认/冲突数量同步减少。

## 7. URL 状态

示例：

```text
/tasks/task_scm_001?panel=field-detail&fieldId=field_po_status
```



---

# FILE: 07_PAGE_SPEC_COMPLETED_TASK.md

# 07_PAGE_SPEC_COMPLETED_TASK

## 1. 页面定位

完成态展示任务已经全部执行结束后的结果、交付物和后续推荐。

页面心智：

```text
拿结果，复用成果，发起下一轮任务
```

## 2. 页面布局

```text
TaskPage(completed)
├── TaskHeader(status=completed)
├── CompletionSummaryCard
├── StageCompletionTimeline
├── DeliverableList
├── ResultSummary
├── NextRecommendation
└── TaskSummarySidebar
```

## 3. 顶部任务状态

```text
供应链语义治理闭环任务
状态：已完成
当前阶段：8 / 8
整体进度：100%
完成时间：2025-05-16 14:32
```

## 4. 完成总结卡

标题：

```text
任务已完成
```

指标：

- 已扫描字段：4,920
- 已生成业务对象：12
- 已确认对象关系：21
- 已产出交付物：6
- 待跟进事项：2

操作：

- 查看报告
- 共享结果
- 发起下一轮任务

## 5. 阶段完成时间线

展示 8 个阶段全部完成：

1. 数据源扫描
2. 字段语义理解
3. 业务对象生成
4. 关系发现与校验
5. 标准映射与对齐
6. 冲突检测与修复
7. 业务确认与验证
8. 报告与交付

每个阶段展示：状态、关键结果、完成时间。

## 6. 交付物列表

| 文件 | 用途 | 操作 |
|---|---|---|
| 语义治理报告.pdf | 给管理者查看治理结论 | 预览 / 下载 |
| 字段语义理解结果.xlsx | 给数据团队核对字段语义 | 预览 / 下载 |
| 业务对象清单.xlsx | 给业务和研发对齐对象模型 | 预览 / 复用 |
| 语义关系网络.zip | 给系统导入或后续任务复用 | 下载 / 复用 |
| 待确认任务清单.xlsx | 给业务方继续确认 | 预览 / 下载 |
| 实施建议报告.pdf | 给治理落地团队制定计划 | 预览 / 下载 |

## 7. 结果摘要

包含：

- 关键业务发现
- 治理质量提升
- 待跟进问题
- 后续建议

## 8. 下一步推荐

卡片：

- 进入映射修复任务
- 共享给团队
- 继续治理其他数据源
- 归档任务

## 9. 右侧任务总结

右侧栏切换为任务总结：

- 完成度 100%
- 参与成员
- 总耗时
- 关键指标
- 待跟进事项
- 快速操作

## 10. 交互规则

- 点击交付物预览 → 打开文件预览。
- 点击复用 → 生成新的任务草稿。
- 点击发起下一轮任务 → 跳转 `/ai-workbench?draftId=xxx` 并带入当前任务配置。



---

# FILE: 08_COMPONENT_SPEC.md

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



---

# FILE: 09_DESIGN_TOKENS.md

# 09_DESIGN_TOKENS

## 1. Colors

```ts
export const colors = {
  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  primaryLight: '#EFF6FF',
  primaryBorder: '#BFDBFE',

  success: '#16A34A',
  successLight: '#ECFDF5',

  warning: '#F59E0B',
  warningLight: '#FFFBEB',

  danger: '#DC2626',
  dangerLight: '#FEF2F2',

  purple: '#7C3AED',
  purpleLight: '#F5F3FF',

  gray50: '#F8FAFC',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray600: '#4B5563',
  gray900: '#111827',
  white: '#FFFFFF'
};
```

## 2. 状态颜色

| 状态 | 颜色 |
|---|---|
| 执行中 | primary |
| 已完成 | success |
| 待确认 | warning |
| 冲突 / 异常 | danger |
| 待开始 | gray400 |
| 草稿 | gray600 + warning badge |

## 3. Typography

| Token | Size | Weight | Use |
|---|---:|---:|---|
| `text-page-hero` | 32px | 700 | 首页主标题 |
| `text-page-title` | 24px | 700 | 页面标题 |
| `text-section-title` | 16px | 600 | 区块标题 |
| `text-body` | 14px | 400/500 | 正文 |
| `text-caption` | 12px | 400 | 辅助说明 |
| `text-metric` | 24px-32px | 700 | 指标数字 |

## 4. Layout

```ts
export const layout = {
  topBarHeight: 64,
  leftNavWidth: 240,
  pagePadding: 24,
  cardGap: 16,
  sectionGap: 24,
  cardPadding: 16,
  taskSidebarWidth: 380,
  draftDrawerWidth: 540,
};
```

## 5. Radius

```ts
export const radius = {
  button: 8,
  input: 16,
  card: 12,
  largeCard: 16,
  drawer: 16
};
```

## 6. Shadow

使用轻阴影，不使用厚重阴影。

```css
--shadow-card: 0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 8px rgba(15, 23, 42, 0.04);
--shadow-drawer: -8px 0 24px rgba(15, 23, 42, 0.08);
```

## 7. Component Styling Rules

### Card

```text
background: white
border: 1px solid gray200
border-radius: 12px or 16px
padding: 16px or 24px
```

### Button

Primary：蓝底白字。
Secondary：白底灰边框。
Danger：浅红底红字。
Warning：浅橙底橙字。

### Table

- 表头浅灰背景。
- 行高 44-52px。
- 字段名可用蓝色链接。
- 操作按钮小尺寸。
- 分页放底部右侧。

### Badge

- 小圆角。
- 文字 12px。
- 使用浅底 + 深色文字。

## 8. Interaction Visuals

- 对话更新的草稿卡片高亮 1.5 秒。
- 当前阶段在右侧任务计划中使用蓝色背景。
- 已完成阶段使用绿色 check。
- 风险使用红/橙 icon 与浅色背景。



---

# FILE: 10_INTERACTION_RULES.md

# 10_INTERACTION_RULES

## 1. 首页生成草稿

```text
用户输入任务目标
→ 点击“生成任务草稿”
→ Workbench 状态变为 parsing
→ 显示 Xino 正在理解：识别任务类型、匹配数据源、生成执行方案
→ 生成 TaskDraft
→ 右侧打开 TaskDraftDrawer
```

## 2. 草稿对话调整

### 示例

用户输入：

```text
只扫描采购相关 Schema。
```

系统行为：

1. 解析为 `scanScope` 修改。
2. 更新 `TaskDraft.scanScope`。
3. 重新计算预计表数量、预计耗时、风险等级。
4. ConversationStream 追加 `ChangeSummaryResult`。
5. DraftDrawer 中 “扫描范围” 卡片高亮“刚刚更新”。

## 3. 草稿卡片编辑

用户点击右侧抽屉中某配置项编辑按钮：

| 配置项 | 交互 |
|---|---|
| 数据源 | 打开数据源选择器 |
| 扫描范围 | 打开 Schema / 表范围选择器 |
| 上下文资源 | 打开上传/资源选择器 |
| 交付物 | 打开交付物选择器 |
| 执行方案 | 打开方案选择器 |

保存后：

```text
更新 TaskDraft
中间追加 Xino 变更说明
右侧对应卡片高亮
```

## 4. 创建并执行

```text
用户点击“创建并开始执行”
→ 校验必填项：任务目标、数据源、扫描范围、执行方案
→ 若通过，调用 mock createTaskFromDraft
→ 返回 taskId
→ 跳转 /tasks/:taskId
→ task.status = executing
```

## 5. 执行页结果渲染

Xino 消息必须包含 `resultBlocks`。

渲染规则：

```text
ResultBlock.type → ResultBlockRenderer → 具体模板组件
```

一条 Xino 消息可以包含多个 resultBlocks。

## 6. 任务执行推进

```text
阶段开始
→ 右侧任务计划高亮 running 阶段
→ 中间显示 Xino 说明
→ 阶段输出 resultBlocks
→ 用户处理确认项
→ 阶段完成
→ 右侧计划更新
```

## 7. 表格行点击

点击字段表格行：

```text
URL 更新 panel=field-detail&fieldId=xxx
右侧栏显示 FieldDetailPanel
中间表格选中该行
```

## 8. 字段确认

用户点击确认：

```text
更新 Field.status = confirmed
更新统计指标
ConversationStream 追加一条 system/task_event
如果所有 required 确认完成，可允许继续下一阶段
```

## 9. 批量确认

点击“批量确认高置信字段”：

```text
先展示 ConfirmationResult
用户确认后批量更新字段状态
更新待确认数量
```

## 10. 风险处理

点击风险项：

```text
右侧显示 IssueDetailPanel
用户可选择：标记已处理 / 指派成员 / 生成修复任务 / 忽略
```

## 11. 完成任务

最后阶段完成后：

```text
task.status = completed
progress = 100
右侧栏切换 TaskSummarySidebar
中间显示 CompletionSummary + DeliverableResult + RecommendationResult
```

## 12. 异常处理

如果 Xino 无法生成结果：

```text
显示 FallbackResult
给出原因
提供重试 / 修改配置 / 联系管理员
```

## 13. 禁止交互

- 不允许输入后直接执行复杂任务，必须先有草稿确认。
- 不允许跳独立草稿页作为默认路径。
- 不允许执行页使用传统左右气泡聊天。
- 不允许一屏堆满所有未来阶段模板。



---

# FILE: 11_DATA_MODEL_TYPES.md

# 11_DATA_MODEL_TYPES

## 1. User

```ts
export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};
```

## 2. Resource

```ts
export type ResourceType = 'pdf' | 'xlsx' | 'docx' | 'csv' | 'zip' | 'database' | 'knowledge_base';

export type Resource = {
  id: string;
  name: string;
  type: ResourceType;
  size?: string;
  description?: string;
  status?: 'ready' | 'processing' | 'failed';
};
```

## 3. DataSource

```ts
export type DataSourceConfig = {
  id: string;
  name: string;
  type: 'MySQL' | 'PostgreSQL' | 'Oracle' | 'API' | 'File';
  host?: string;
  status: 'connected' | 'disconnected' | 'permission_required';
  permission: 'metadata_read' | 'full_read' | 'none';
};
```

## 4. TaskDraft

```ts
export type ScanScope = {
  schemas: string[];
  tables?: string[];
  estimatedTableCount?: number;
  estimatedFieldCount?: number;
};

export type DeliverableRequirement = {
  id: string;
  name: string;
  type: 'pdf' | 'xlsx' | 'csv' | 'zip' | 'json' | 'yaml';
  purpose: string;
  required: boolean;
};

export type RiskItem = {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  impact?: string;
  recommendation?: string;
  status: 'open' | 'processing' | 'resolved' | 'ignored';
};

export type DraftChangeLog = {
  id: string;
  field: string;
  before: unknown;
  after: unknown;
  changedBy: 'user' | 'xino';
  changedAt: string;
  reason?: string;
};

export type TaskDraft = {
  draftId: string;
  title: string;
  goal: string;
  taskTypes: string[];
  status: 'draft' | 'confirmed';
  dataSource: DataSourceConfig;
  scanScope: ScanScope;
  contextResources: Resource[];
  executionPlan: ExecutionStage[];
  deliverables: DeliverableRequirement[];
  risks: RiskItem[];
  estimatedDurationMinutes: number;
  changeLogs: DraftChangeLog[];
};
```

## 5. Task

```ts
export type TaskStatus = 'executing' | 'paused' | 'waiting_confirm' | 'completed' | 'failed';

export type Task = {
  taskId: string;
  title: string;
  status: TaskStatus;
  projectName: string;
  creator: User;
  currentStageIndex: number;
  progress: number;
  stages: ExecutionStage[];
  context: TaskContext;
  messages: XinoMessage[];
  latestResults: StageResult[];
  deliverables: Deliverable[];
  activities: Activity[];
  createdAt: string;
  updatedAt: string;
};
```

## 6. ExecutionStage

```ts
export type StageStatus = 'pending' | 'running' | 'completed' | 'waiting_confirm' | 'failed';

export type ExecutionStage = {
  stageId: string;
  index: number;
  name: string;
  description: string;
  status: StageStatus;
  progress?: number;
  startedAt?: string;
  completedAt?: string;
};
```

## 7. XinoMessage and ResultBlock

```ts
export type MessageRole = 'user' | 'xino' | 'system';

export type MessageType =
  | 'normal'
  | 'task_event'
  | 'stage_result'
  | 'draft_change'
  | 'confirmation'
  | 'error';

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

export type XinoMessage = {
  id: string;
  role: MessageRole;
  createdAt: string;
  stageId?: string;
  stageName?: string;
  messageType: MessageType;
  text: string;
  resultBlocks?: ResultBlock[];
  actions?: MessageAction[];
};

export type ResultBlock = {
  id: string;
  type: ResultBlockType;
  title: string;
  summary?: string;
  status?: 'success' | 'running' | 'warning' | 'error' | 'waiting_confirm';
  severity?: 'low' | 'medium' | 'high';
  data: unknown;
  actions?: MessageAction[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
};
```

## 8. Actions

```ts
export type MessageAction = {
  id: string;
  label: string;
  type:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'warning'
    | 'ghost';
  action:
    | 'create_task'
    | 'save_draft'
    | 'edit_config'
    | 'confirm'
    | 'modify'
    | 'ignore'
    | 'open_detail'
    | 'download'
    | 'preview'
    | 'continue_stage'
    | 'retry'
    | 'custom';
  payload?: Record<string, unknown>;
};
```

## 9. Result Table

```ts
export type ResultTableData = {
  columns: Array<{
    key: string;
    title: string;
    type?: 'text' | 'number' | 'status' | 'confidence' | 'actions';
  }>;
  rows: Array<Record<string, unknown>>;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
};
```

## 10. Deliverable

```ts
export type Deliverable = {
  id: string;
  name: string;
  type: 'pdf' | 'xlsx' | 'csv' | 'zip' | 'md' | 'json' | 'yaml';
  purpose: string;
  size?: string;
  createdAt: string;
  actions: MessageAction[];
};
```



---

# FILE: 12_MOCK_DATA_SPEC.md

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



---

# FILE: 13_ACCEPTANCE_CRITERIA.md

# 13_ACCEPTANCE_CRITERIA

## 1. 产品验收

| 编号 | 验收项 | 标准 |
|---|---|---|
| P-01 | 首页足够简单 | 主视觉只突出大输入框，辅助内容不能喧宾夺主 |
| P-02 | 首页不强制选择资源 | 上传文件、选择数据源、模板是辅助入口，不是必填步骤 |
| P-03 | 草稿默认抽屉化 | 输入后不跳独立确认页，右侧打开任务草稿抽屉 |
| P-04 | 草稿状态清楚 | 明确展示“尚未开始执行” |
| P-05 | 对话能调整草稿 | 用户通过自然语言修改范围、资源、交付物后，右侧草稿同步更新 |
| P-06 | 执行页不是聊天页 | 不使用传统气泡，不使用大序号流程线 |
| P-07 | 用户与 Xino 区分清楚 | 用户消息右侧轻量，Xino 消息左侧工作输出 |
| P-08 | Xino 输出有两层 | 普通文本说明 + 结构化结果模板 |
| P-09 | 当前阶段突出 | 执行页顶部有当前任务焦点卡 |
| P-10 | 结果模板统一 | 所有结果走 ResultBlockRenderer，不临时发挥 |
| P-11 | 右侧栏状态化 | 草稿态/执行态/详情态/完成态内容不同 |
| P-12 | 完成态有闭环 | 展示总结、交付物、下一步推荐 |

## 2. 前端验收

| 编号 | 验收项 | 标准 |
|---|---|---|
| F-01 | 路由可访问 | `/ai-workbench` 和 `/tasks/:taskId` 可访问 |
| F-02 | URL 可恢复状态 | `draftId`、`panel`、`fieldId` 可控制右侧栏 |
| F-03 | 组件拆分合理 | 页面中不大段重复类似卡片和表格 |
| F-04 | Mock 驱动 | 页面主要内容来自 mock 文件 |
| F-05 | 类型明确 | TaskDraft、Task、XinoMessage、ResultBlock 有 TS 类型 |
| F-06 | 结果模板可复用 | 至少实现 P0 模板 7 个 |
| F-07 | 关键按钮可交互 | 生成草稿、调整草稿、创建任务、打开详情、确认字段有效果 |
| F-08 | 响应式基本可用 | 1440px 和 1920px 下布局正常 |
| F-09 | 文本不溢出 | 中文不截断、不重叠、不糊 |
| F-10 | 无 Demo Switcher | 最终页面不显示开发用浮动切换器 |

## 3. 视觉验收

| 编号 | 验收项 | 标准 |
|---|---|---|
| V-01 | 设计系统统一 | 首页、草稿、执行页使用同一套颜色/圆角/按钮/卡片 |
| V-02 | 状态色正确 | 成功绿、执行蓝、待确认橙、风险红、待开始灰 |
| V-03 | 卡片层级清楚 | 标题、摘要、指标、明细、操作层级明确 |
| V-04 | 右侧栏不拥挤 | 模块不超过 4 个主区，必要时使用 Tab/折叠 |
| V-05 | 不像 BI 大屏 | 不能堆大量图表和大屏式视觉元素 |

## 4. 场景验收

### 场景 A：首页生成草稿

1. 进入 `/ai-workbench`。
2. 输入供应链语义治理任务。
3. 点击生成任务草稿。
4. 右侧打开草稿抽屉。
5. 中间展示 Xino 理解说明。

通过标准：没有跳独立草稿页，抽屉状态清楚。

### 场景 B：对话调整草稿

1. 在草稿态输入“只扫描采购相关 Schema”。
2. 中间追加变更摘要。
3. 右侧扫描范围变为 `ods_scm, dwd_scm`。
4. 预计耗时更新。

通过标准：对话和草稿配置同步。

### 场景 C：执行页确认字段

1. 进入 `/tasks/task_scm_001`。
2. 点击字段表格中的 `po_status`。
3. 右侧打开字段详情。
4. 点击确认。
5. 中间表格状态和指标更新。

通过标准：详情确认闭环完整。



---

# FILE: 14_IMPLEMENTATION_PROMPT.md

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
