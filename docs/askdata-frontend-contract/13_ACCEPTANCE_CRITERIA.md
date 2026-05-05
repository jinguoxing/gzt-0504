# 13_ACCEPTANCE_CRITERIA.md

# 找数问数前端验收标准 v1.0

## 1. 产品体验验收

| 验收项 | 标准 |
|---|---|
| 首页输入后跳转 | 找数问数问题应跳转到 `/ai-workbench/data-qa/:sessionId` |
| 执行页顶部 | 不得出现当前问题输入框或当前问题展示卡 |
| 用户问题展示 | 用户问题只能作为问答流中的用户提问条出现 |
| 聊天样式 | 不得出现传统气泡、尖角气泡、IM 聊天样式 |
| Xino 回复 | 必须包含普通文本说明 + 结果卡片组 |
| 首屏内容 | 主要结果模块不超过 4 个，不能拥挤 |
| 右侧栏 | 必须是答案依据，不是任务计划 |
| 来源可信 | 必须展示口径、来源表、来源字段、可信度 |
| 继续追问 | 必须支持底部继续追问输入 |
| 专业详情 | 必须支持查看 SQL 和完整来源 |

---

## 2. 页面结构验收

执行页必须包含：

```text
LeftNav
TopBar
DataQaHeader
QuestionThread
AnswerEvidenceSidebar
FollowupInputBar
```

执行页不得包含：

```text
CurrentQuestionInput
TaskPlanSidebar
ChatBubble
FlowStepTimeline
```

---

## 3. 组件验收

| 组件 | 标准 |
|---|---|
| `UserQuestionRow` | 右对齐轻量提问条，不是气泡 |
| `XinoAnswerBlock` | 左对齐，先文字后结果 |
| `ResultBlockRenderer` | 根据 resultType 渲染，不硬编码 |
| `SingleMetricAnswerCard` | 大数字清晰，环比同比可见 |
| `ComparisonTrendCard` | 对比和趋势合并展示，克制不拥挤 |
| `EvidenceSummaryCard` | 摘要化展示来源和可信度 |
| `AnswerEvidenceSidebar` | 当前口径和数据依据默认展开，SQL 折叠 |

---

## 4. 数据验收

```text
所有页面内容必须来自 mock 数据。
Mock 数据中必须包含两轮问答。
Mock 数据中必须包含至少 5 种 resultBlock。
Mock 数据中必须包含 SQL。
Mock 数据中必须包含右侧答案依据。
```

---

## 5. 交互验收

| 操作 | 预期 |
|---|---|
| 点击推荐追问 | 追加用户提问和 Xino 回答 |
| 点击查看 SQL | 展开右侧 SQL 折叠区 |
| 点击查看完整来源 | 右侧显示来源详情 |
| 点击查看全部明细 | 打开明细详情或完整表格 |
| 点击导出明细 | 显示导出状态和交付物 |
| 点击生成分析报告 | 进入完成态或生成交付物 |

---

## 6. 视觉验收

```text
页面风格为现代企业 SaaS。
中文清晰，不溢出，不重叠。
模块留白充足。
卡片层级清楚。
首屏不拥挤。
右侧栏信息密度适中。
```

---

## 7. 响应式验收

至少保证：

```text
1440px 宽度正常可用
1920px 宽度布局舒适
右侧栏宽度 340px - 380px
中间主区不被压缩到难以阅读
```

---

## 8. 失败态验收

必须覆盖：

```text
无数据
权限不足
指标不明确
SQL 执行失败
数据源不可用
```

失败态不得只显示错误代码，必须给出建议动作。
