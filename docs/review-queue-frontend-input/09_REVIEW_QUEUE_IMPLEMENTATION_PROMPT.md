# 待我处理页面｜给代码大模型的最终实施 Prompt

你是前端工程大模型。请基于我提供的 Semovix 全局样式规范、本待我处理页面专项合同，以及当前代码文件，完成「待我处理」页面的前端实现或整改。

## 一、任务背景

我们正在补齐 Semovix 任务中心体系中的独立“待我处理”页面。

该页面不是任务列表页，而是当前用户的事项处理队列。

页面对象是：

```text
ReviewQueueItem / ActionItem / 待处理事项
```

不是：

```text
Task / 任务
```

## 二、必须完成的目标

1. 新增或修复 `/tasks/reviews` 页面。
2. 确保 `/tasks/reviews` 路由放在 `/tasks/:taskId` 动态路由之前。
3. 从任务中心点击“待我处理 查看全部”跳转到 `/tasks/reviews?assignee=me`。
4. 页面展示具体事项，不展示完整任务列表。
5. 支持 Tab：全部 / 待确认 / 待审核 / 异常 / 继续执行。
6. 支持搜索、筛选、排序、分页。
7. 支持勾选事项和批量操作。
8. 行级操作支持进入确认、去审核、查看异常、继续执行。
9. 保持 Semovix 全局外壳一致。
10. 颜色收敛为蓝 / 绿 / 橙 / 红 / 灰。

## 三、允许新增的文件

推荐新增：

```text
src/views/review-queue/ReviewQueue.tsx
src/views/review-queue/components/ReviewQueueStats.tsx
src/views/review-queue/components/ReviewQueueFilters.tsx
src/views/review-queue/components/ReviewQueueTable.tsx
src/views/review-queue/components/ReviewQueueSidePanel.tsx
src/views/review-queue/mockReviewQueue.ts
```

如果当前项目偏向单文件页面，可以先只新增：

```text
src/views/review-queue/ReviewQueue.tsx
```

但不要让单文件过度混乱。

## 四、必须修改的文件

```text
src/routes/index.tsx
src/views/task-center/TaskCenter.tsx
src/types/* 或新增对应类型文件
src/mock/* 或新增 mock 数据
```

如果需要保持导航高亮，也可检查：

```text
src/config/menuConfig.ts
src/components/layout/LeftNav.tsx
```

## 五、页面结构

实现以下结构：

```text
任务 / 待我处理
待我处理
副标题
批量处理 / 导出事项

Tab：全部 / 待确认 / 待审核 / 异常 / 继续执行

指标卡：全部事项 / 待确认 / 待审核 / 异常处理 / 继续执行

筛选区：搜索 / 状态 / 类型 / 来源任务 / 发起人 / 优先级 / 截止时间 / 排序 / 重置 / 列设置

批量选择条：已选择 N 个事项 / 批量确认 / 批量转派 / 批量忽略

事项表格：事项名称 / 类型 / 来源任务 / 所属阶段 / 发起人 / 发起时间 / 优先级 / 截止时间 / 状态 / 操作

分页

右侧栏：处理概览 / 快捷视图 / 说明提示
```

## 六、表格事项数据

至少包含以下 8 条：

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

## 七、交互要求

### Tab

```text
全部 → all
待确认 → type=CONFIRM
待审核 → type=APPROVAL
异常 → type=EXCEPTION
继续执行 → type=RESUME
```

### 搜索

搜索字段：

```text
事项名称
来源任务名称
所属阶段名称
```

### 筛选

支持组合筛选：

```text
状态
类型
来源任务
发起人
优先级
截止时间
```

### 批量操作

选中事项后显示批量操作条。

### 行级跳转

```text
进入确认 → /tasks/:taskId/review/:reviewId
去审核 → /tasks/:taskId/review/:reviewId
查看异常 → /tasks/:taskId/review/:reviewId?mode=exception
继续执行 → /tasks/:taskId?stageId=:stageId&resume=true
```

## 八、禁止事项

```text
不要重做 AppShell / LeftNav / TopBar
不要改变 Logo、用户、导航顺序
不要把 /tasks/reviews 放在 /tasks/:taskId 后面
不要把待我处理页面做成全部任务表格
不要在本次任务中重做 AI 工作台首页、草稿抽屉、任务执行页、完成页
不要使用多余颜色，不要引入紫色、粉色、青色等额外状态色
不要使用传统聊天气泡
不要做成 BI 大屏或营销页面
```

## 九、输出要求

请输出：

```text
1. 修改/新增的文件清单
2. 每个文件的核心改动说明
3. 完整代码
4. 路由顺序说明
5. 交互自测说明
6. 是否满足验收标准
```
