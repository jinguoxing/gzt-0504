# 待我处理页面｜路由与导航合同

## 1. 必须新增或确认的路由

```tsx
<Route path="/tasks/reviews" element={<ReviewQueue />} />
```

## 2. 路由顺序要求

`/tasks/reviews` 必须放在 `/tasks/:taskId` 之前。

正确顺序示例：

```tsx
<Route path="/tasks" element={<TaskCenter />} />
<Route path="/tasks/all" element={<TaskListState />} />
<Route path="/tasks/reviews" element={<ReviewQueue />} />
<Route path="/tasks/:taskId/review/:reviewId" element={<ReviewDetail />} />
<Route path="/tasks/:taskId/completed" element={<CompletedTask />} />
<Route path="/tasks/:taskId" element={<ExecutionState />} />
```

错误示例：

```tsx
<Route path="/tasks/:taskId" element={<ExecutionState />} />
<Route path="/tasks/reviews" element={<ReviewQueue />} />
```

错误原因：

```text
/tasks/reviews 会被动态路由 /tasks/:taskId 误识别为 taskId=reviews。
```

## 3. 入口跳转规则

### 从任务中心进入

任务中心“待我处理 查看全部”跳转：

```ts
navigate('/tasks/reviews?assignee=me')
```

任务中心“待确认”Tab 或指标跳转：

```ts
navigate('/tasks/reviews?assignee=me&type=CONFIRM')
```

任务中心“待审核”跳转：

```ts
navigate('/tasks/reviews?assignee=me&type=APPROVAL')
```

任务中心“异常”跳转：

```ts
navigate('/tasks/reviews?assignee=me&type=EXCEPTION')
```

任务中心“继续执行”跳转：

```ts
navigate('/tasks/reviews?assignee=me&type=RESUME')
```

## 4. URL Query 参数约定

| 参数 | 示例 | 含义 |
|---|---|---|
| `assignee` | `me` | 当前处理人 |
| `type` | `CONFIRM` | 事项类型 |
| `status` | `PENDING` | 事项状态 |
| `priority` | `HIGH` | 优先级 |
| `sourceTaskId` | `task-supply-chain-loop` | 来源任务 |
| `initiator` | `Xino` | 发起人 |
| `deadline` | `today` | 截止时间 |
| `keyword` | `订单金额` | 搜索关键词 |
| `page` | `1` | 页码 |
| `pageSize` | `10` | 每页数量 |

## 5. 页面内部跳转

| 用户动作 | 跳转 |
|---|---|
| 点击事项名称 | `/tasks/:taskId/review/:reviewId` 或打开详情抽屉 |
| 点击来源任务 | `/tasks/:taskId` |
| 点击所属阶段 | `/tasks/:taskId?stageId=:stageId` |
| 点击进入确认 | `/tasks/:taskId/review/:reviewId` |
| 点击去审核 | `/tasks/:taskId/review/:reviewId` |
| 点击查看异常 | `/tasks/:taskId/review/:reviewId?mode=exception` |
| 点击继续执行 | `/tasks/:taskId?stageId=:stageId&resume=true` |

## 6. 左侧导航高亮

当前页面：

```text
/tasks/reviews
```

左侧高亮：

```text
任务
```

## 7. 菜单配置注意事项

如果 `menuConfig.ts` 使用 `highlightPattern`，需要保证：

```ts
{
  key: 'tasks',
  label: '任务',
  path: '/tasks',
  highlightPattern: '/tasks'
}
```

这样以下路由都高亮“任务”：

```text
/tasks
/tasks/all
/tasks/reviews
/tasks/:taskId
/tasks/:taskId/review/:reviewId
/tasks/:taskId/completed
```
