# 01_PAGE_FLOW_AND_STATE_MODEL.md

# 找数问数页面流程与状态模型 v1.0

## 1. 主流程

```text
AI 工作台首页
↓
用户输入自然语言问题
↓
Xino 判断意图
↓
若意图 = 找数问数
↓
跳转到找数问数执行页
↓
展示用户问题条 + Xino 答案 + 结果模板
↓
用户继续追问 / 查看来源 / 查看 SQL / 导出明细
↓
进入详情态 / 深度分析态 / 完成态
```

---

## 2. 页面状态总览

| 状态 ID | 状态名称 | 路由 | 描述 |
|---|---|---|---|
| `workbench_home` | AI 工作台首页 | `/ai-workbench` | 用户输入自然语言任务或问题 |
| `intent_detecting` | 意图识别中 | `/ai-workbench` 内部状态 | Xino 正在识别是问数、治理、建模还是其他任务 |
| `data_qa_executing` | 找数问数执行态 | `/ai-workbench/data-qa/:sessionId` | 展示答案、趋势、依据、继续追问 |
| `data_qa_clarifying` | 口径确认态 | `/ai-workbench/data-qa/:sessionId?mode=clarify` | 问题存在歧义，需要用户确认指标/时间/范围 |
| `data_qa_review_detail` | 详情审阅态 | `/ai-workbench/data-qa/:sessionId?panel=detail` | 点击指标、字段、表、SQL、明细行后的右侧详情 |
| `data_qa_completed` | 完成态 | `/ai-workbench/data-qa/:sessionId?status=completed` | 结果已保存、导出或生成分析报告 |
| `governance_task_redirect` | 治理任务跳转态 | `/tasks/:taskId` | 用户将问数结果转成治理/修复任务 |

---

## 3. 意图识别状态

用户在首页输入问题后，Xino 必须先判断意图类型。

### 输入示例

```text
上个月采购金额是多少？
```

### 识别结果

```json
{
  "intent": "data_qa",
  "confidence": 0.94,
  "queryType": "single_metric",
  "targetRoute": "/ai-workbench/data-qa/dqa_001"
}
```

### 前端行为

```text
1. 首页输入框进入 loading 状态。
2. 显示轻量提示：Xino 正在理解你的问题。
3. 识别为 data_qa 后跳转执行页。
4. 不打开任务草稿抽屉。
5. 不进入治理任务执行页。
```

---

## 4. 找数问数执行页状态

### 4.1 `answer_ready`

答案已生成。

中间区展示：

```text
用户提问条
Xino 文本说明
核心答案卡
趋势/对比卡
数据依据摘要卡
推荐追问
```

右侧栏展示：

```text
答案依据
- 当前口径
- 数据依据
- 查询计划 / SQL（折叠）
```

---

### 4.2 `clarification_required`

问题存在歧义。

示例：

```text
这个月销售怎么样？
```

需要确认：

```text
销售额 / 订单量 / 毛利 / 客单价
自然月 / 财务月
已支付 / 已发货 / 全部订单
```

前端展示 `ClarificationPanel`，不直接跳结果页。

---

### 4.3 `followup_analysis`

用户继续追问。

示例：

```text
为什么本月采购金额上涨？
```

中间区追加：

```text
用户追问条
Xino 文本说明
原因解释卡
贡献度分析卡
后续动作卡
```

---

### 4.4 `detail_open`

用户点击明细、来源、SQL、指标或图表节点。

右侧栏切换为详情模式：

```text
字段详情
指标口径详情
SQL 执行详情
订单明细详情
数据来源详情
```

---

### 4.5 `exporting`

用户点击导出明细、生成报告。

前端展示：

```text
导出中
导出完成
下载文件
保存到文件
```

---

### 4.6 `completed`

会话已保存、导出或生成报告。

展示：

```text
本次问数结果已保存
核心答案
追问记录
交付物
后续推荐
```

---

## 5. 状态转换图

```text
workbench_home
  └─ submit question
      └─ intent_detecting
          ├─ data_qa → data_qa_executing
          ├─ data_qa ambiguous → data_qa_clarifying
          ├─ governance_task → governance_task_redirect
          └─ unknown → fallback

data_qa_executing
  ├─ follow-up question → followup_analysis
  ├─ click evidence → detail_open
  ├─ click sql → detail_open
  ├─ export → exporting
  ├─ generate report → completed
  └─ create governance task → governance_task_redirect
```

---

## 6. 找数问数与任务草稿的关系

默认情况下，找数问数不需要任务草稿。

仅以下情况需要轻量确认态：

```text
口径不清
查询范围过大
查询涉及敏感数据
用户要求生成正式分析报告
用户要求发起治理/修复任务
```

此时使用 `04_PAGE_SPEC_DRAFT_DRAWER.md` 中定义的轻量确认面板。
