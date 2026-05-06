# 待我处理页面｜组件规格

## 1. 页面级组件

### ReviewQueuePage

职责：

```text
读取 URL query
加载事项数据
维护筛选、排序、分页、选择状态
组合页面头部、指标、筛选、表格、右侧栏
```

建议 Props：无，由路由驱动。

---

## 2. Header 组件

### ReviewQueueHeader

内容：

```text
面包屑：任务 / 待我处理
标题：待我处理
副标题
按钮：批量处理 / 导出事项
```

---

## 3. Tab 组件

### ReviewQueueTabs

Tabs：

```ts
['全部', '待确认', '待审核', '异常', '继续执行']
```

Props：

```ts
type ReviewQueueTabKey = 'ALL' | 'CONFIRM' | 'APPROVAL' | 'EXCEPTION' | 'RESUME'

interface ReviewQueueTabsProps {
  activeTab: ReviewQueueTabKey
  counts: Record<ReviewQueueTabKey, number>
  onChange: (tab: ReviewQueueTabKey) => void
}
```

---

## 4. 指标组件

### ReviewQueueStats

展示：

```text
全部事项
待确认
待审核
异常处理
继续执行
```

Props：

```ts
interface ReviewQueueStatsProps {
  stats: ReviewQueueStats
  onClickMetric?: (type: ReviewItemType | 'ALL') => void
}
```

---

## 5. 筛选组件

### ReviewQueueFilters

包含：

```text
搜索事项名称
状态
类型
来源任务
发起人
优先级
截止时间
排序
重置筛选
列设置
```

Props：

```ts
interface ReviewQueueFiltersProps {
  filters: ReviewQueueFilters
  options: ReviewQueueFilterOptions
  onChange: (next: Partial<ReviewQueueFilters>) => void
  onReset: () => void
  onColumnSettings?: () => void
}
```

---

## 6. 批量操作条

### ReviewQueueBulkBar

显示条件：

```text
selectedIds.length > 0
```

内容：

```text
已选择 N 个事项
批量确认
批量转派
批量忽略
关闭
```

Props：

```ts
interface ReviewQueueBulkBarProps {
  selectedCount: number
  selectedItems: ReviewQueueItem[]
  onBulkConfirm: () => void
  onBulkAssign: () => void
  onBulkIgnore: () => void
  onClear: () => void
}
```

---

## 7. 表格组件

### ReviewQueueTable

列：

```text
选择框
事项名称
类型
来源任务
所属阶段
发起人
发起时间
优先级
截止时间
状态
操作
```

Props：

```ts
interface ReviewQueueTableProps {
  items: ReviewQueueItem[]
  selectedIds: string[]
  onSelectOne: (id: string, checked: boolean) => void
  onSelectAllPage: (checked: boolean) => void
  onOpenItem: (item: ReviewQueueItem) => void
  onOpenTask: (taskId: string) => void
  onOpenStage: (taskId: string, stageId: string) => void
  onPrimaryAction: (item: ReviewQueueItem) => void
}
```

---

## 8. 状态组件

### ReviewItemTypeBadge

类型：

```text
待确认 / 待审核 / 异常 / 继续执行
```

颜色：

```text
待确认：橙色
待审核：橙色
异常：红色
继续执行：绿色或蓝绿色
```

### ReviewItemStatusBadge

状态：

```text
待处理 / 待审核 / 异常 / 可继续执行 / 已处理 / 已忽略
```

### PriorityBadge

```text
高：红点 + 高
中：橙点 + 中
低：灰点 + 低
```

---

## 9. 右侧栏组件

### ReviewQueueSidePanel

包含：

```text
ReviewProcessingOverview
ReviewQuickViews
ReviewQueueTips
```

### ReviewProcessingOverview

内容：

```text
我待确认的事项
我待审核的事项
我处理的异常
我可继续执行
即将到期
平均处理时长
```

### ReviewQuickViews

内容：

```text
高优先级事项
今日到期
异常事项
我发起的事项
```

### ReviewQueueTips

内容：

```text
点击事项名称进入详情页
点击来源任务可跳转任务详情
支持批量确认、转派与忽略
异常事项应优先处理
```

---

## 10. 分页组件

### ReviewQueuePagination

Props：

```ts
interface ReviewQueuePaginationProps {
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}
```
