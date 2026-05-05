# 02_ROUTES.md

# 找数问数前端路由设计 v1.0

## 1. 路由总览

| 路由 | 页面/状态 | 说明 |
|---|---|---|
| `/ai-workbench` | AI 工作台首页 | 用户输入自然语言问题或任务 |
| `/ai-workbench?intent=detecting` | 意图识别中 | 首页内部 loading 状态 |
| `/ai-workbench/data-qa/:sessionId` | 找数问数执行页 | 问数结果主页面 |
| `/ai-workbench/data-qa/:sessionId?mode=clarify` | 口径确认态 | 问题存在歧义 |
| `/ai-workbench/data-qa/:sessionId?panel=evidence` | 答案依据面板 | 默认右侧栏 |
| `/ai-workbench/data-qa/:sessionId?panel=sql` | SQL / 查询计划详情 | 专业详情视图 |
| `/ai-workbench/data-qa/:sessionId?panel=source` | 数据来源详情 | 来源、字段、血缘详情 |
| `/ai-workbench/data-qa/:sessionId?panel=row-detail&rowId=xxx` | 明细行详情 | 订单、供应商、字段等明细 |
| `/ai-workbench/data-qa/:sessionId?status=completed` | 完成态 | 已导出/已保存/已生成报告 |
| `/tasks/:taskId` | 治理类任务页 | 由问数结果发起治理任务后跳转 |

---

## 2. 路由职责

## 2.1 `/ai-workbench`

职责：

```text
提供极简输入入口
支持自然语言输入
支持 @ 指标 / 数据源 / 文件 / 知识库
识别用户意图
```

进入找数问数：

```text
用户输入：上个月采购金额是多少？
点击发送
Xino 判断为 data_qa
跳转 /ai-workbench/data-qa/dqa_001
```

---

## 2.2 `/ai-workbench/data-qa/:sessionId`

职责：

```text
展示找数问数结果
承接用户问题
展示 Xino 答案
展示结构化结果模板
展示答案依据
支持继续追问
```

页面不得包含顶部当前问题输入框。

---

## 2.3 `?mode=clarify`

触发条件：

```text
问题口径不明确
指标匹配多个候选
时间范围不明确
需要确认权限或范围
```

示例：

```text
这个月销售怎么样？
```

页面展示：

```text
口径确认卡
推荐默认口径
可选项
确认后查询
```

---

## 2.4 `?panel=evidence`

默认右侧栏状态。

展示：

```text
当前口径
数据依据
查询计划 / SQL（折叠）
追问上下文（折叠）
```

---

## 2.5 `?panel=sql`

展示 SQL / 查询计划详情。

包含：

```text
查询步骤
SQL
执行耗时
扫描行数
缓存状态
权限状态
```

---

## 2.6 `?panel=source`

展示数据来源详情。

包含：

```text
数据源
来源表
来源字段
时间字段
关联维表
更新时间
质量状态
血缘入口
```

---

## 2.7 `?panel=row-detail&rowId=xxx`

当用户点击表格明细行时打开。

示例：

```text
采购订单 PO2026040101 的明细详情
```

---

## 2.8 `?status=completed`

用于结果已保存、导出或生成报告后的页面状态。

展示：

```text
问数结果摘要
追问链路
交付物
后续动作
```

---

## 3. 路由状态恢复

页面刷新后必须能通过 `sessionId` 恢复：

```text
当前问题
问答消息流
结果卡片
答案依据
追问上下文
右侧栏状态
```

---

## 4. 不建议使用的路由

找数问数不要默认使用：

```text
/tasks/:taskId
/tasks/:taskId?panel=plan
```

因为这会把找数问数误导成治理类长任务。

只有当用户点击：

```text
发起治理任务
生成修复任务
进入语义治理闭环
```

才跳转 `/tasks/:taskId`。
