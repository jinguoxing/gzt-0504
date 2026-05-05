# 06_PAGE_SPEC_REVIEW_DETAIL.md

# 找数问数详情审阅态页面规格 v1.0

## 1. 页面定位

详情审阅态用于用户在找数问数执行页中点击：

```text
指标
数据依据
查看完整来源
查看 SQL
明细表行
供应商拆解项
趋势图异常点
```

后，右侧栏或抽屉展示更详细的信息。

---

## 2. 触发入口

| 点击对象 | 打开详情 |
|---|---|
| 核心答案卡中的口径 | 指标口径详情 |
| 数据依据摘要卡 | 数据来源详情 |
| 查看 SQL | 查询计划 / SQL 详情 |
| 明细表某行 | 订单明细详情 |
| 趋势图某个月份 | 时间点详情 |
| 供应商拆解某供应商 | 供应商贡献详情 |
| 可信度标签 | 可信度解释详情 |

---

## 3. 展示位置

默认在右侧栏切换为详情模式。

不建议弹出遮挡中间内容的大弹窗，除非是查看完整 SQL 或全屏表格。

---

## 4. 指标口径详情

标题：

```text
指标口径详情
```

内容：

```text
指标名称：采购金额
业务定义：统计指定时间范围内已审核采购订单的含税金额
计算公式：SUM(amount_tax_included)
时间字段：po_approved_date
默认过滤：order_status = approved
排除条件：订单类型 ≠ 作废
所属业务域：供应链
维护状态：已注册
最后更新：2026-05-01
```

操作：

```text
查看指标定义
按此口径继续查询
复制口径
```

---

## 5. 数据来源详情

标题：

```text
数据来源详情
```

内容：

```text
数据源：supply_chain_prod
数据源类型：MySQL
来源表：dwd_scm_purchase_order_line
来源字段：amount_tax_included
时间字段：po_approved_date
关联维表：dim_supplier, dim_material
数据更新时间：2026-05-04 09:30
同步状态：成功
质量状态：通过最近一次质量检查
权限状态：可查询
可信度：高
```

操作：

```text
查看字段定义
查看血缘
查看数据质量
复制来源信息
```

---

## 6. SQL / 查询计划详情

标题：

```text
查询计划 / SQL
```

内容：

```text
1. 匹配指标：采购金额
2. 确定时间范围：2026-04-01 至 2026-04-30
3. 选择事实表：dwd_scm_purchase_order_line
4. 应用过滤条件：订单状态 = 已审核
5. 聚合方式：SUM(amount_tax_included)
6. 返回结果：单指标 + 环比 + 趋势
```

SQL：

```sql
SELECT SUM(amount_tax_included) AS purchase_amount
FROM dwd_scm_purchase_order_line
WHERE po_approved_date BETWEEN '2026-04-01' AND '2026-04-30'
  AND order_status = 'approved';
```

执行信息：

```text
查询耗时：2.3 秒
扫描行数：184,320
缓存状态：未命中
索引使用：po_approved_date_idx
权限状态：可查询
```

操作：

```text
复制 SQL
重新执行
下载结果
查看执行计划
```

---

## 7. 明细行详情

标题：

```text
采购订单详情
```

内容示例：

```text
订单号：PO2026040101
供应商：华东物料供应商 A
订单日期：2026-04-02
金额：¥1,280,000
状态：已审核
物料数量：12,000
业务域：供应链
来源表：dwd_scm_purchase_order_line
```

操作：

```text
查看完整订单
按供应商继续分析
按物料继续分析
导出该订单
```

---

## 8. 可信度解释详情

标题：

```text
可信度说明
```

内容：

```text
可信度：高
原因：
- 指标口径已在语义层注册
- 来源表为 DWD 明细事实表
- 来源字段注释完整
- 最近一次同步成功
- 最近一次数据质量检查通过
```

---

## 9. 前端状态

```ts
rightPanelMode:
  | 'evidence'
  | 'metric_detail'
  | 'source_detail'
  | 'sql_detail'
  | 'row_detail'
  | 'trend_point_detail'
  | 'supplier_detail'
  | 'confidence_detail'
```

---

## 10. 验收标准

```text
点击来源、SQL、明细行必须能打开详情。
详情不应遮挡主回答流。
详情信息必须能解释答案从哪里来。
专业信息默认放右侧，不打扰普通用户。
```
