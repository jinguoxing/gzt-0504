# 待我处理页面｜Mock 数据规格

## 1. 文件清单

```text
mock/review-queue.json
mock/review-item-detail.json
mock/review-queue-filters.json
```

## 2. review-queue.json 结构

```ts
interface ReviewQueueMock {
  stats: ReviewQueueStats
  filters: ReviewQueueFilters
  items: ReviewQueueItem[]
  total: number
  page: number
  pageSize: number
  overview: ReviewProcessingOverview
  quickViews: ReviewQuickView[]
}
```

## 3. 必须覆盖的数据类型

Mock 数据必须覆盖：

```text
待确认
待审核
异常
继续执行
高优先级
中优先级
今日到期
尽快处理
可继续执行
```

## 4. 必须包含的 8 条事项

```text
字段语义确认：订单金额
字段语义确认：supplier_code
待审核：订单对象映射修复
待审核：供应商对象关系确认
异常处理：数据连接异常
异常处理：Schema 读取失败
继续执行：数据标准落地任务
继续执行：采购主数据修复任务
```

## 5. review-item-detail.json

用于事项详情页或详情抽屉。

建议包含：

```text
事项基本信息
来源任务
所属阶段
上下文说明
推荐处理动作
风险信息
相关字段 / 对象 / 文件
处理记录
评论记录
```

## 6. review-queue-filters.json

用于筛选下拉选项。

包含：

```text
状态选项
类型选项
来源任务选项
发起人选项
优先级选项
截止时间选项
```
