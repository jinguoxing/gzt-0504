# 14_IMPLEMENTATION_PROMPT.md

# 找数问数前端实现执行提示词 v1.0

> 可直接复制给前端代码生成大模型使用。

请使用 React + TypeScript + Tailwind CSS 实现 Semovix / Xino 的「找数问数」前端原型。

## 一、实现目标

实现一个可交互的找数问数前端原型，包含：

```text
1. AI 工作台首页 `/ai-workbench`
2. 找数问数执行页 `/ai-workbench/data-qa/:sessionId`
3. 口径确认态
4. 右侧答案依据 / SQL / 来源详情
5. 完成态
```

使用 Mock 数据，不接真实后端。

---

## 二、必须遵守的产品规则

```text
1. 首页输入找数问数问题后，跳转找数问数执行页。
2. 找数问数执行页顶部不得出现当前问题输入框或当前问题展示卡。
3. 用户问题只能作为问答流中的右侧轻量提问条出现。
4. 禁止使用传统聊天气泡。
5. Xino 回复必须是左侧文本说明 + 结果模板卡片组。
6. 右侧栏必须是“答案依据”，不得是任务计划。
7. 当前口径和数据依据默认展开，查询计划 / SQL 默认折叠。
8. 首屏主要结果模块不得超过 4 个。
9. 明细表默认只展示节选，不要大面积展开。
```

---

## 三、路由

实现：

```text
/ai-workbench
/ai-workbench/data-qa/:sessionId
/ai-workbench/data-qa/:sessionId?mode=clarify
/ai-workbench/data-qa/:sessionId?panel=sql
/ai-workbench/data-qa/:sessionId?panel=source
/ai-workbench/data-qa/:sessionId?status=completed
```

可使用 React Router。

---

## 四、页面结构

### 首页

```text
AppShell
WorkbenchHero
WorkbenchInput
IntentSuggestionList
RecentQuestionList
CommonResourceChips
```

### 找数问数执行页

```text
AppShell
DataQaHeader
QuestionThread
AnswerEvidenceSidebar
FollowupInputBar
```

QuestionThread 内部：

```text
UserQuestionRow
XinoAnswerBlock
ResultBlockRenderer
```

---

## 五、结果模板组件

实现以下组件：

```text
SingleMetricAnswerCard
ComparisonTrendCard
EvidenceSummaryCard
FollowupSuggestionCard
InsightExplanationCard
ContributionAnalysisCard
ActionCard
DataTablePreview
ClarificationCard
FallbackResultCard
```

ResultBlockRenderer 根据 `resultBlock.type` 渲染。

---

## 六、Mock 数据

从以下文件加载：

```text
mock/workbench-home.json
mock/task-draft.json
mock/task-execution.json
mock/field-review.json
mock/task-completed.json
```

页面内容必须来自 Mock，不要硬编码在组件里。

---

## 七、交互要求

实现以下 mock 交互：

```text
1. 首页输入“上个月采购金额是多少？”后跳转执行页。
2. 点击推荐追问“为什么上涨？”后追加第二轮问答。
3. 点击“查看 SQL”展开右侧 SQL 区。
4. 点击“查看完整来源”切换右侧来源详情。
5. 点击“查看全部”显示更多明细或弹出详情区域。
6. 点击“导出明细”进入导出成功状态。
7. 点击“生成分析报告”进入完成态。
```

---

## 八、视觉要求

```text
现代企业 SaaS 风格
白色 / 浅灰背景
蓝色主色
绿色表示可信和增长
红色表示风险或下降
圆角卡片
轻阴影
充足留白
中文清晰
```

禁止：

```text
聊天气泡
BI 大屏风
顶部当前问题框
任务计划右侧栏
拥挤布局
```

---

## 九、验收标准

```text
能够从首页进入找数问数执行页。
执行页无当前问题输入区。
执行页无聊天气泡。
Xino 回复有文本说明和结果卡片。
右侧为答案依据。
可以查看 SQL 和来源。
可以继续追问。
可以展示完成态。
```
