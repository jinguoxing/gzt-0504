# 02｜Routes

## 1. 路由总览

| 路由 | 页面 | 说明 |
|---|---|---|
| `/` | Redirect | 默认跳转 `/workbench` 或 `/tasks`，按产品设置 |
| `/workbench` | AI 工作台首页 | 用户自然语言发起任务 |
| `/workbench?draftId=:draftId` | 草稿抽屉态 | 当前页右侧展示任务草稿抽屉 |
| `/tasks` | 任务中心 | 任务摘要、待处理、最近交付物、看板 |
| `/tasks/all` | 全部任务列表 | 完整任务列表、筛选、批量操作 |
| `/tasks/reviews` | 待处理事项列表 | 待确认/待审核/异常/继续执行队列 |
| `/tasks/:taskId` | 任务执行页 | 任务阶段执行、结果展示、任务计划 |
| `/tasks/:taskId/review/:reviewId` | Review Detail | 字段确认、冲突处理、对象审核 |
| `/tasks/:taskId/completed` | Completed Task | 任务完成总结与交付物 |
| `/resources` | 资源中心 | 文件、数据源、交付物等，当前合同仅约束入口 |
| `/resources/deliverables` | 交付物列表 | 最近交付物与任务成果 |
| `/semantic-assets` | 语义资产 | 业务对象、知识网络、字段语义，当前合同仅约束入口 |

---

## 2. 左侧导航高亮规则

| 路由 | 高亮项 |
|---|---|
| `/workbench` | AI 工作台 |
| `/tasks`, `/tasks/all`, `/tasks/reviews`, `/tasks/:taskId*` | 任务 |
| `/resources*` | 文件 |
| `/semantic-assets*` | 可暂不在当前左侧导航显示，后续可并入文件或独立导航 |

---

## 3. 页面跳转规则

### 3.1 AI 工作台 → 草稿抽屉

用户在 `/workbench` 输入目标并点击“发送给 Xino”：

```text
调用任务解析接口
→ 生成 draftId
→ URL 更新为 /workbench?draftId=:draftId
→ 右侧 DraftDrawer 展开
```

### 3.2 草稿抽屉 → 任务执行页

用户点击“创建并开始执行”：

```text
POST /drafts/:draftId/submit
→ 返回 taskId
→ 跳转 /tasks/:taskId
```

### 3.3 任务中心 → 全部任务

| 入口 | 路由示例 |
|---|---|
| 全部任务 KPI | `/tasks/all?scope=my` |
| 执行中 KPI | `/tasks/all?scope=my&status=RUNNING` |
| 异常任务 KPI | `/tasks/all?scope=my&status=BLOCKED` |
| 运行中的任务 查看全部 | `/tasks/all?scope=my&status=RUNNING` |

### 3.4 任务中心 → 待处理事项

```text
/tasks/reviews?assignee=me&status=PENDING
```

### 3.5 全部任务列表 → 任务执行页

点击任务名称：

```text
/tasks/:taskId
```

点击当前阶段：

```text
/tasks/:taskId?focusStage=:stageId
```

点击待处理数：

```text
/tasks/reviews?taskId=:taskId
```

---

## 4. Query 参数约定

### 4.1 `/tasks/all`

| 参数 | 类型 | 示例 |
|---|---|---|
| scope | `my/team/all` | `scope=all` |
| view | `default/starred/abnormal/archived` | `view=default` |
| status | TaskStatus | `status=RUNNING` |
| type | TaskType | `type=SEMANTIC_GOVERNANCE` |
| projectId | string | `projectId=supply-chain` |
| ownerId | string | `ownerId=u-litong` |
| priority | `HIGH/MEDIUM/LOW` | `priority=HIGH` |
| keyword | string | `keyword=供应链` |
| sort | string | `sort=recentUpdated` |
| page | number | `page=1` |
| pageSize | number | `pageSize=20` |

### 4.2 `/tasks/reviews`

| 参数 | 类型 | 示例 |
|---|---|---|
| assignee | string | `assignee=me` |
| type | ReviewType | `type=FIELD_CONFIRMATION` |
| status | ReviewStatus | `status=PENDING` |
| priority | Priority | `priority=HIGH` |
| taskId | string | `taskId=task-supply-chain-loop` |

---

## 5. 路由守卫

- 未登录：跳转登录页。
- 无项目权限：显示无权限状态。
- 无任务权限：任务列表隐藏或详情页提示不可访问。
- 管理员可访问 `scope=all`。
- 普通成员默认只访问 `scope=my`。
