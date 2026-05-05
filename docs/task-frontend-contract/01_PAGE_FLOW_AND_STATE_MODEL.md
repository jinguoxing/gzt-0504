# 01｜Page Flow and State Model

## 1. 总体页面流

```text
/workbench
  用户输入任务目标
  ↓
/workbench?draftId=:draftId
  右侧草稿抽屉出现，用户确认或调整
  ↓ 创建并开始执行
/tasks/:taskId
  任务执行页，展示当前阶段、结果、右侧任务计划
  ↓ 出现待确认/待审核事项
/tasks/:taskId/review/:reviewId
  字段确认、对象审核、冲突处理
  ↓ 确认完成
/tasks/:taskId
  任务继续推进
  ↓ 全部阶段完成
/tasks/:taskId/completed
  完成态、交付物、下一步推荐
```

任务中心独立承载任务管理流：

```text
/tasks
  查看任务中心摘要
  ↓ 点击运行中的任务查看全部
/tasks/all?scope=my&status=running
  查看执行中任务列表
  ↓ 点击任务名称
/tasks/:taskId
```

全部任务列表承载完整任务池：

```text
/tasks/all
  搜索 / 筛选 / 排序 / 批量管理
```

---

## 2. 任务状态机

```text
DRAFT 草稿
  → READY 待启动
  → RUNNING 执行中
  → WAITING_CONFIRMATION 待确认
  → WAITING_REVIEW 待审核
  → BLOCKED 异常/阻塞
  → COMPLETED 已完成
  → ARCHIVED 已归档
```

状态说明：

| 状态 | 中文 | 可操作项 |
|---|---|---|
| DRAFT | 草稿 | 编辑、保存、创建并开始执行 |
| READY | 待启动 | 开始执行、编辑配置 |
| RUNNING | 执行中 | 查看进度、暂停、查看结果 |
| WAITING_CONFIRMATION | 待确认 | 进入确认、批量确认、修改、忽略 |
| WAITING_REVIEW | 待审核 | 审核通过、驳回、转派 |
| BLOCKED | 异常 | 查看异常、重试、转派、终止 |
| COMPLETED | 已完成 | 查看交付物、复用、归档 |
| ARCHIVED | 已归档 | 查看、恢复，按权限 |

---

## 3. 阶段状态机

```text
PENDING 待开始
→ RUNNING 执行中
→ WAITING_USER 待用户处理
→ COMPLETED 已完成
→ FAILED 失败
→ SKIPPED 已跳过
```

任务执行页必须只突出当前阶段，历史阶段压缩展示。

---

## 4. 草稿抽屉状态

| 状态 | 说明 | UI 表达 |
|---|---|---|
| empty | 首页无草稿 | 不显示右侧栏 |
| parsing | Xino 正在解析 | 中间消息流显示解析中 |
| draft_ready | 草稿可确认 | 右侧抽屉显示“任务草稿 · 待确认” |
| draft_changed | 对话修改草稿 | 变更摘要卡 + 草稿项蓝色高亮 |
| submitting | 创建中 | 主按钮 loading |
| failed | 创建失败 | 错误提示 + 重试 |

---

## 5. 任务中心状态模型

任务中心默认 scope 为 `my`。

```ts
scope: 'my' | 'team' | 'all'
```

模块联动：

| scope | KPI | 运行中的任务 | 待我处理 | 右侧看板 |
|---|---|---|---|---|
| my | 我的任务统计 | 与我相关的执行中任务 | 处理人=我 | 我的看板 |
| team | 团队任务统计 | 团队执行中任务 | 团队待处理 | 团队看板 |
| all | 权限内全部统计 | 全部执行中任务 | 全部待处理，可受权限限制 | 全局看板 |

### 任务中心查看全部规则

| 来源模块 | 路由 | 自动筛选 |
|---|---|---|
| 指标：全部任务 | `/tasks/all` | `scope=current` |
| 指标：执行中 | `/tasks/all` | `scope=current&status=RUNNING` |
| 指标：待我处理 | `/tasks/reviews` | `assignee=me&status=pending` |
| 指标：已完成 | `/tasks/all` | `status=COMPLETED` |
| 指标：异常任务 | `/tasks/all` | `status=BLOCKED` |
| 运行中的任务 查看全部 | `/tasks/all` | `status=RUNNING` |
| 待我处理 查看全部 | `/tasks/reviews` | `assignee=me` |
| 最近交付物 查看全部 | `/resources/deliverables` | `sort=recent` |

---

## 6. 全部任务列表状态模型

```ts
interface TaskListState {
  scope: 'my' | 'team' | 'all';
  view: 'default' | 'starred' | 'abnormal' | 'archived';
  keyword: string;
  filters: {
    status?: TaskStatus | 'ALL';
    type?: TaskType | 'ALL';
    projectId?: string | 'ALL';
    ownerId?: string | 'ALL';
    priority?: Priority | 'ALL';
    timeField?: 'updatedAt' | 'createdAt';
    timeRange?: 'today' | 'last7d' | 'last30d' | 'custom';
  };
  sort: 'recentUpdated' | 'createdAt' | 'priority';
  selectedTaskIds: string[];
  pagination: { page: number; pageSize: number; total: number };
}
```

表格选中项大于 0 时显示批量提示条。

---

## 7. Review Item 状态模型

```text
PENDING 待处理
→ PROCESSING 处理中
→ RESOLVED 已处理
→ REJECTED 已驳回
→ IGNORED 已忽略
→ EXPIRED 已过期
```

Review Item 包括：

- 字段语义确认
- 冲突字段处理
- 业务对象审核
- 标准映射审核
- 异常处理
- 继续执行
- 交付物确认

---

## 8. 交付物流

```text
阶段产物生成
→ 显示在任务执行页右侧“最新交付物”
→ 任务完成后汇总到完成态交付物表
→ 资源中心 / 交付物可统一检索
→ 可复用生成下一轮任务草稿
```
