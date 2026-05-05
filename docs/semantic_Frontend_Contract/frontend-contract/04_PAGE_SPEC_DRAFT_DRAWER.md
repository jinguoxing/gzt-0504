# 04_PAGE_SPEC_DRAFT_DRAWER

## 1. 页面定位

草稿抽屉态是任务正式执行前的确认状态。它不是独立页面，而是在 `/ai-workbench` 当前页右侧滑出的任务草稿抽屉。

页面心智：

```text
中间继续对话，右侧确认草稿
```

## 2. 页面布局

```text
WorkbenchPage(draft state)
├── LeftNav
├── TopBar
├── CenterConversationArea
│   ├── UserInstructionBlock
│   ├── XinoTextBlock
│   ├── ChangeSummaryCard(optional)
│   ├── SuggestedAdjustmentChips
│   └── FollowupInput
└── TaskDraftDrawer
    ├── DrawerHeader
    ├── DraftUnderstandingSection
    ├── DraftKeyConfigSection
    ├── DraftPlanSection
    ├── DraftRiskSection
    ├── DraftStageSummary
    ├── RecentChanges(optional)
    └── FixedActionBar
```

## 3. 中间对话区

### 3.1 用户消息

右侧轻量指令块：

```text
请对供应链数据库进行语义治理，扫描 Schema、识别业务相关表、理解字段语义、生成业务对象与交付物。
```

### 3.2 Xino 回复

左侧工作输出块：

```text
我已根据你的目标生成任务草稿，你可以继续告诉我需要调整的范围、数据源和交付物。
```

推荐调整 chips：

- 只扫描采购相关 Schema
- 增加 Excel 明细文件
- 增加字段质量报告
- 调整并行度为 10

### 3.3 跟进输入框

Placeholder：

```text
继续告诉 Xino 你的调整要求，例如：只扫描采购相关 Schema，增加 Excel 明细…
```

## 4. 右侧任务草稿抽屉

### 4.1 抽屉尺寸

```text
桌面端宽度：520px - 560px
复杂内容内部滚动
底部操作固定
```

### 4.2 抽屉顶部

```text
任务草稿 · 待确认
尚未开始执行
```

必须明确这不是执行中任务。

### 4.3 任务理解

展示：

- 任务名称
- 目标摘要
- 任务类型标签
- 编辑入口

样本：

```text
任务名称：供应链语义治理闭环任务
任务类型：语义治理 / Schema 扫描 / 业务对象生成 / 交付物生成
```

### 4.4 关键配置

配置项：

| 配置 | 内容 | 操作 |
|---|---|---|
| 数据源 | supply_chain_prod / MySQL / 已连接 | 更换 |
| 扫描范围 | ods_scm, dwd_scm / 2 个 Schema | 编辑范围 |
| 上下文资源 | 3 个文件 | 继续上传 |
| 交付物 | 6 项 | 调整 |

### 4.5 推荐执行方案

```text
供应链语义治理方案
推荐
基于供应链领域最佳实践的治理流程与规则配置方案
```

操作：查看详情 / 更换方案。

### 4.6 风险提醒

```text
预计扫描约 286 张表、4,920 个字段。
部分字段命名不规范，可能需要人工确认。
建议先确认扫描范围。
```

### 4.7 执行阶段摘要

```text
预计 8 个阶段 · 约 2.5 小时
```

默认折叠，点击展开展示阶段。

### 4.8 底部固定操作

```text
保存草稿
高级配置
创建并开始执行
```

主按钮：`创建并开始执行`。

## 5. 对话调整联动规则

### 5.1 用户通过对话调整

示例：

```text
只扫描采购相关 Schema。
```

系统动作：

```text
更新 TaskDraft.scanScope
中间追加 ChangeSummaryResult
右侧扫描范围卡片高亮“刚刚更新”
更新预计耗时与风险等级
```

### 5.2 用户通过卡片编辑

示例：点击“编辑范围”。

系统动作：

```text
打开范围选择器
保存后更新 TaskDraft
中间追加 Xino 说明：已将扫描范围更新为 ods_scm、dwd_scm
```

## 6. 设计约束

- 不要把草稿抽屉做成独立页面。
- 不要让用户误以为任务已经执行。
- 中间对话和右侧草稿必须有联动感。
- 右侧抽屉信息要分区清晰，不要堆满。
