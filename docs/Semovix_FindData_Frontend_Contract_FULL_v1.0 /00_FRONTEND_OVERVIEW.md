# 00_FRONTEND_OVERVIEW.md

# Semovix / Xino 找数问数前端页面合同总览 v1.0

## 1. 合同目标

本合同用于约束 Semovix AI 工作台中「找数问数」场景的前端页面实现。

核心目标是让前端和大模型生成页面时明确：

```text
AI 工作台首页输入自然语言问题
→ Xino 判断为找数问数意图
→ 跳转到找数问数执行页
→ 页面承接问题、直接回答、解释口径、展示证据、支持继续追问
```

本合同优先服务于「找数问数」场景，不是治理类长流程任务。

---

## 2. 场景定位

找数问数的产品心智是：

```text
答案优先
口径透明
来源可信
支持继续分析
```

用户常见问题：

```text
上个月采购金额是多少？
本月销售额同比增长多少？
最近 30 天订单量趋势怎么样？
采购金额最高的前 10 个供应商是谁？
为什么本月采购金额上涨？
这个数是怎么算的？
数据来自哪张表？
```

---

## 3. 与治理类执行页的区别

| 项目 | 治理类任务执行页 | 找数问数执行页 |
|---|---|---|
| 任务性质 | 长流程、多阶段、可交付 | 短链路、问答分析、可追问 |
| 右侧栏核心 | 任务计划 / 任务详情 / 活动 | 答案依据 / 当前口径 / 数据依据 / SQL |
| 中间区域 | 阶段推进 + 结果模板 | 问答流 + 答案模板 + 证据 |
| 首要问题 | 任务跑到哪一步了 | 这个数是多少、怎么算、从哪来 |
| 交互重点 | 阶段确认、修复、交付物 | 继续追问、拆解、查看来源、导出 |

因此找数问数页面不得直接复用治理类的「任务计划」右侧栏。

---

## 4. 核心页面与状态

本合同覆盖以下页面/状态：

| 文件 | 内容 |
|---|---|
| `03_PAGE_SPEC_WORKBENCH_HOME.md` | AI 工作台首页，用户输入自然语言问题 |
| `04_PAGE_SPEC_DRAFT_DRAWER.md` | 找数问数默认不需要草稿抽屉，仅在歧义/高影响分析任务时使用确认态 |
| `05_PAGE_SPEC_TASK_EXECUTION.md` | 找数问数执行页 v3 主页面 |
| `06_PAGE_SPEC_REVIEW_DETAIL.md` | 指标、字段、表、SQL、明细行等详情审阅态 |
| `07_PAGE_SPEC_COMPLETED_TASK.md` | 问数会话保存、导出、生成报告后的完成态 |

---

## 5. 设计原则

### 5.1 不要顶部当前问题输入区

用户已经在 AI 工作台首页输入问题，执行页顶部不要再出现：

```text
当前问题输入框
当前问题卡片
重新输入问题的大框
```

执行页的问题只能作为问答流中的第一条用户消息出现。

### 5.2 不要传统聊天气泡

禁止：

```text
左右气泡
气泡尖角
胶囊聊天泡泡
像 IM / 微信 / 客服窗口的消息样式
```

推荐：

```text
用户：右对齐轻量提问条
Xino：左对齐文本说明 + 独立结果卡片组
```

### 5.3 Xino 回复必须包含两层

```text
普通文本说明
+ 结构化结果模板
```

示例：

```text
Xino · 09:32
上个月采购金额为 ¥12,486,320，环比增长 8.6%，同比增长 12.3%。
本次使用“已审核采购订单含税金额”口径，统计周期为 2026-04-01 至 2026-04-30。

[核心答案卡]
[趋势/对比卡]
[数据依据摘要卡]
[推荐追问]
```

### 5.4 首屏必须克制

首屏最多展示 4 个主要结果模块：

```text
核心答案
趋势/对比
数据依据摘要
推荐追问
```

明细表、SQL、复杂拆解、原因归因应延后或折叠。

---

## 6. 推荐技术实现

建议使用：

```text
React + TypeScript + Tailwind CSS
组件化 ResultBlockRenderer
Mock 数据驱动页面
前端状态模拟，不依赖真实后端
```

---

## 7. 交付物

本合同包包含：

```text
/frontend-contract
├── 00_FRONTEND_OVERVIEW.md
├── 01_PAGE_FLOW_AND_STATE_MODEL.md
├── 02_ROUTES.md
├── 03_PAGE_SPEC_WORKBENCH_HOME.md
├── 04_PAGE_SPEC_DRAFT_DRAWER.md
├── 05_PAGE_SPEC_TASK_EXECUTION.md
├── 06_PAGE_SPEC_REVIEW_DETAIL.md
├── 07_PAGE_SPEC_COMPLETED_TASK.md
├── 08_COMPONENT_SPEC.md
├── 09_DESIGN_TOKENS.md
├── 10_INTERACTION_RULES.md
├── 11_DATA_MODEL_TYPES.md
├── 12_MOCK_DATA_SPEC.md
├── 13_ACCEPTANCE_CRITERIA.md
├── 14_IMPLEMENTATION_PROMPT.md
└── mock
    ├── workbench-home.json
    ├── task-draft.json
    ├── task-execution.json
    ├── field-review.json
    └── task-completed.json
```
