# 10_INTERACTION_RULES

## 1. 首页生成草稿

```text
用户输入任务目标
→ 点击“生成任务草稿”
→ Workbench 状态变为 parsing
→ 显示 Xino 正在理解：识别任务类型、匹配数据源、生成执行方案
→ 生成 TaskDraft
→ 右侧打开 TaskDraftDrawer
```

## 2. 草稿对话调整

### 示例

用户输入：

```text
只扫描采购相关 Schema。
```

系统行为：

1. 解析为 `scanScope` 修改。
2. 更新 `TaskDraft.scanScope`。
3. 重新计算预计表数量、预计耗时、风险等级。
4. ConversationStream 追加 `ChangeSummaryResult`。
5. DraftDrawer 中 “扫描范围” 卡片高亮“刚刚更新”。

## 3. 草稿卡片编辑

用户点击右侧抽屉中某配置项编辑按钮：

| 配置项 | 交互 |
|---|---|
| 数据源 | 打开数据源选择器 |
| 扫描范围 | 打开 Schema / 表范围选择器 |
| 上下文资源 | 打开上传/资源选择器 |
| 交付物 | 打开交付物选择器 |
| 执行方案 | 打开方案选择器 |

保存后：

```text
更新 TaskDraft
中间追加 Xino 变更说明
右侧对应卡片高亮
```

## 4. 创建并执行

```text
用户点击“创建并开始执行”
→ 校验必填项：任务目标、数据源、扫描范围、执行方案
→ 若通过，调用 mock createTaskFromDraft
→ 返回 taskId
→ 跳转 /tasks/:taskId
→ task.status = executing
```

## 5. 执行页结果渲染

Xino 消息必须包含 `resultBlocks`。

渲染规则：

```text
ResultBlock.type → ResultBlockRenderer → 具体模板组件
```

一条 Xino 消息可以包含多个 resultBlocks。

## 6. 任务执行推进

```text
阶段开始
→ 右侧任务计划高亮 running 阶段
→ 中间显示 Xino 说明
→ 阶段输出 resultBlocks
→ 用户处理确认项
→ 阶段完成
→ 右侧计划更新
```

## 7. 表格行点击

点击字段表格行：

```text
URL 更新 panel=field-detail&fieldId=xxx
右侧栏显示 FieldDetailPanel
中间表格选中该行
```

## 8. 字段确认

用户点击确认：

```text
更新 Field.status = confirmed
更新统计指标
ConversationStream 追加一条 system/task_event
如果所有 required 确认完成，可允许继续下一阶段
```

## 9. 批量确认

点击“批量确认高置信字段”：

```text
先展示 ConfirmationResult
用户确认后批量更新字段状态
更新待确认数量
```

## 10. 风险处理

点击风险项：

```text
右侧显示 IssueDetailPanel
用户可选择：标记已处理 / 指派成员 / 生成修复任务 / 忽略
```

## 11. 完成任务

最后阶段完成后：

```text
task.status = completed
progress = 100
右侧栏切换 TaskSummarySidebar
中间显示 CompletionSummary + DeliverableResult + RecommendationResult
```

## 12. 异常处理

如果 Xino 无法生成结果：

```text
显示 FallbackResult
给出原因
提供重试 / 修改配置 / 联系管理员
```

## 13. 禁止交互

- 不允许输入后直接执行复杂任务，必须先有草稿确认。
- 不允许跳独立草稿页作为默认路径。
- 不允许执行页使用传统左右气泡聊天。
- 不允许一屏堆满所有未来阶段模板。
