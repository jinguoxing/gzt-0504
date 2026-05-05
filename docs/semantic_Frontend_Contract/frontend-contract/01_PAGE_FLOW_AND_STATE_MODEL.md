# 01_PAGE_FLOW_AND_STATE_MODEL

## 1. 总体流程

```text
/ai-workbench
  首页空白态
    ↓ 用户输入任务目标
  解析中态
    ↓ Xino 生成任务草稿
  草稿抽屉态
    ↓ 用户通过对话或卡片调整草稿
  草稿已确认
    ↓ 点击“创建并开始执行”
/tasks/:taskId
  执行中主态
    ↓ 阶段结果产生
  详情确认态
    ↓ 全部阶段完成
  完成态
```

## 2. 页面状态

### 2.1 Workbench 页面状态

| 状态 | 名称 | 说明 |
|---|---|---|
| `empty` | 首页空白态 | 只展示主输入框和轻量辅助内容 |
| `parsing` | 解析中态 | Xino 正在识别意图、匹配资源、生成草稿 |
| `draft` | 草稿抽屉态 | 右侧滑出任务草稿抽屉，中间保留对话 |
| `draft_changed` | 草稿已调整 | 用户通过对话或卡片修改草稿，抽屉同步更新 |
| `creating` | 创建中 | 点击创建后，生成正式任务并跳转执行页 |

### 2.2 Task 页面状态

| 状态 | 名称 | 说明 |
|---|---|---|
| `executing` | 执行中主态 | 展示当前任务焦点、阶段结果、任务计划 |
| `review_detail` | 详情确认态 | 点击字段/对象/风险项后，右侧展示详情 |
| `waiting_confirm` | 待确认态 | 当前阶段需要用户确认后才能继续 |
| `completed` | 完成态 | 展示任务总结、交付物、下一步建议 |
| `failed` | 失败态 | 展示失败原因和重试/修改入口 |

## 3. 右侧栏状态模型

| 页面状态 | 右侧栏内容 | 职责 |
|---|---|---|
| 首页空白态 | 无右侧栏 | 保持首页简洁 |
| 草稿抽屉态 | `TaskDraftDrawer` | 定任务、确认配置 |
| 执行态 | `TaskPlanSidebar` | 看进度、看上下文、看风险 |
| 详情确认态 | `FieldDetailPanel` / `ObjectDetailPanel` / `IssueDetailPanel` | 看详情、做确认 |
| 完成态 | `TaskSummarySidebar` | 看总结、继续复用 |

## 4. 对话流状态

### 4.1 消息类型

| 类型 | 说明 |
|---|---|
| `user_instruction` | 用户输入的任务目标或调整要求 |
| `xino_text` | Xino 普通文本说明 |
| `draft_change` | 草稿变更摘要 |
| `task_event` | 阶段开始、完成、暂停、失败等事件 |
| `stage_result` | 阶段结构化结果 |
| `confirmation` | 需要用户确认的操作 |
| `error` | 异常、失败、无结果 |

### 4.2 消息布局规则

```text
用户消息：右侧对齐，轻量指令块，不做传统聊天气泡。
Xino 消息：左侧对齐，包含文本说明 + 结果模板。
结果模板：嵌入 Xino 消息下方，使用统一卡片样式。
```

## 5. 草稿调整流程

```text
用户输入：“只扫描采购相关 Schema”
→ Xino 识别为 scanScope 修改
→ 更新 TaskDraft.scanScope
→ 中间追加 ChangeSummaryResult
→ 右侧草稿抽屉对应卡片高亮“刚刚更新”
```

## 6. 执行阶段推进流程

```text
任务进入阶段 N
→ 右侧任务计划高亮阶段 N
→ 中间显示 Xino 文本说明
→ 阶段产生 resultBlocks
→ ResultBlockRenderer 按 resultType 渲染模板
→ 若有待确认项，底部和右侧展示推荐动作
```
