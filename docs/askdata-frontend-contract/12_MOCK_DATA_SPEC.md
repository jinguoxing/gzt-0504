# 12_MOCK_DATA_SPEC.md

# 找数问数 Mock 数据规格 v1.0

## 1. Mock 文件清单

```text
mock/workbench-home.json
mock/task-draft.json
mock/task-execution.json
mock/field-review.json
mock/task-completed.json
```

说明：文件名沿用通用前端合同命名，但内容已经按找数问数场景适配。

---

## 2. `workbench-home.json`

用于 AI 工作台首页。

必须包含：

```text
项目空间
首页输入框 placeholder
示例问题
最近问数记录
常用资源
意图识别结果样例
```

---

## 3. `task-draft.json`

找数问数默认不需要任务草稿。

此文件用于：

```text
口径确认态
查询确认态
分析任务确认态
```

必须包含：

```text
clarificationRequired
metricCandidates
timeRangeOptions
recommendedDefault
confirmActions
```

---

## 4. `task-execution.json`

用于找数问数执行页 v3。

必须覆盖：

```text
用户第一问
Xino 第一轮回答
核心答案卡
趋势/对比卡
数据依据摘要卡
推荐追问
用户第二轮追问
原因解释卡
贡献度分析卡
后续动作卡
明细表节选卡
右侧答案依据
```

---

## 5. `field-review.json`

用于详情审阅态。

虽然文件名叫 field-review，但在找数问数中承载：

```text
指标详情
数据来源详情
SQL 详情
明细行详情
可信度说明
```

---

## 6. `task-completed.json`

用于完成态。

必须包含：

```text
保存结果
追问链路
交付物
后续推荐
归档信息
```

---

## 7. Mock 使用要求

```text
页面内容必须从 Mock 中读取。
不要在组件里硬编码业务文案。
Mock 数据必须覆盖右侧栏、结果卡片、表格、追问、SQL。
```
