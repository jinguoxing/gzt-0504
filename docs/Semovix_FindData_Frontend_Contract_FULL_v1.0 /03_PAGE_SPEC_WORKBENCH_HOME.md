# 03_PAGE_SPEC_WORKBENCH_HOME.md

# AI 工作台首页页面规格 v1.0

## 1. 页面定位

AI 工作台首页是所有任务和问题的统一入口。

用户可以输入：

```text
找数问数类问题
治理任务目标
建模需求
文件分析需求
数据源排查需求
```

本合同重点约束：当用户输入找数问数问题时，首页如何把用户带入找数问数执行页。

---

## 2. 页面布局

```text
左侧导航
顶部全局栏
中间大输入区
下方轻量辅助区
```

首页默认不显示右侧栏。

---

## 3. 中间大输入区

### 标题

```text
今天想让 Xino 帮你完成什么？
```

### 副标题

```text
直接描述你的问题或目标，Xino 会理解意图并选择合适的工作方式。
```

### 输入框 placeholder

```text
输入问题或任务目标，或 @ 指标 / 数据源 / 文件 / 知识库 ...
```

### 输入框能力

```text
@ 指标
@ 数据源
@ 文件
上传附件
发送
```

---

## 4. 首页不要过度配置

首页不应该要求用户先选择：

```text
数据源
模板
执行阶段
输出格式
```

这些可以作为轻量入口，但不是主流程。

---

## 5. 找数问数示例建议

首页下方可以展示轻量示例：

```text
上个月采购金额是多少？
最近 30 天订单量趋势怎么样？
采购金额最高的前 10 个供应商是谁？
为什么本月库存周转率下降？
销售额这个指标怎么算？
```

点击示例后自动填入输入框。

---

## 6. 意图识别规则

用户提交后，首页进入 `intent_detecting` 状态。

### 找数问数判断条件

命中以下特征时识别为 `data_qa`：

```text
询问某个指标值
询问趋势
询问排名
询问同比/环比
询问维度拆解
询问为什么变化
询问数据在哪里
询问指标怎么算
```

### 示例

| 用户输入 | intent | queryType |
|---|---|---|
| 上个月采购金额是多少？ | `data_qa` | `single_metric` |
| 最近 12 个月采购金额趋势 | `data_qa` | `trend` |
| 按供应商拆解采购金额 | `data_qa` | `breakdown` |
| 为什么本月采购金额上涨？ | `data_qa` | `insight` |
| 采购金额这个指标怎么算？ | `data_qa` | `metric_definition` |

---

## 7. 提交后的前端行为

```text
1. 用户输入问题。
2. 点击发送。
3. 输入框显示 loading。
4. Xino 识别意图。
5. 若 intent=data_qa，创建 DataQaSession。
6. 跳转 /ai-workbench/data-qa/:sessionId。
```

### 跳转时传入的数据

```ts
{
  sessionId: string;
  originalQuestion: string;
  intent: 'data_qa';
  queryType: 'single_metric' | 'trend' | 'comparison' | 'breakdown' | 'ranking' | 'insight' | 'lookup';
}
```

---

## 8. 首页组件

```text
AppShell
LeftNav
TopBar
WorkbenchHero
WorkbenchInput
IntentSuggestionList
RecentTaskList
CommonResourceChips
```

---

## 9. 验收标准

```text
首页主视觉必须是输入框。
找数问数问题提交后必须跳转执行页。
不得在首页弹出治理类任务草稿。
不得要求用户先配置数据源。
示例问题和最近任务不能喧宾夺主。
```
