# 00_FRONTEND_OVERVIEW

## 1. 项目目标

本前端合同用于生成 **Semovix / Xino 语义治理与智能工作台** 的前端页面原型与后续实现。

产品核心心智：

```text
用户说需求 → Xino 理解意图 → 生成任务草稿 → 用户通过对话/卡片调整 → 创建并执行 → 阶段推进 → 结构化结果 → 交付物闭环
```

本合同覆盖以下核心页面与状态：

1. **AI 工作台首页**：极简任务输入入口。
2. **草稿抽屉态**：输入后在当前页右侧打开任务草稿抽屉，不跳独立确认页。
3. **任务执行页**：任务正式创建后，展示当前阶段、阶段结果、右侧任务计划。
4. **详情确认态**：点击字段、对象、风险项后，右侧展示详情并支持确认/修改/忽略。
5. **完成态**：任务完成后展示交付物、总结和下一步建议。

## 2. 实现原则

### 2.1 AI 原生，而不是表单优先

首页不要做成复杂配置表单。用户先表达目标，Xino 再生成任务草稿。

### 2.2 草稿能力必须存在，但默认不做独立页面

语义治理任务涉及数据源、扫描范围、上下文、执行方案和交付物，不能直接执行。默认使用右侧抽屉承载草稿确认。

### 2.3 执行页不是聊天页

执行页中间区域是 **任务流式对话 + 结构化结果卡片**，不是普通聊天窗口。

规则：

```text
用户消息：右侧轻量指令块
Xino 消息：左侧工作输出块
Xino 输出 = 普通文本说明 + 结构化结果模板
禁止传统 IM 气泡
禁止左侧大序号流程线
```

### 2.4 结果展示必须模板化

Xino 返回不同场景的结果时，前端必须按 `resultType` 渲染到固定模板，避免大模型或前端临时发挥。

核心模板包括：

- `text_summary`
- `metric_summary`
- `table`
- `issue_list`
- `change_summary`
- `stage_progress`
- `confirmation`
- `graph`
- `deliverable_list`
- `recommendation`
- `config_form`
- `fallback`

## 3. 技术建议

推荐技术栈：

```text
React + TypeScript + Vite + Tailwind CSS + lucide-react
```

实现阶段先使用 mock 数据，不接真实后端接口。所有页面内容必须从 mock 或状态模型读取，避免硬编码散落在组件中。

## 4. 推荐目录

```text
src
├── app
│   ├── App.tsx
│   ├── routes.tsx
│   └── AppShell.tsx
├── pages
│   ├── WorkbenchPage.tsx
│   └── TaskPage.tsx
├── components
│   ├── layout
│   ├── workbench
│   ├── conversation
│   ├── draft
│   ├── task
│   ├── result
│   └── detail
├── mocks
├── types
└── styles
```

## 5. 非目标

本阶段不实现：

- 真实数据源连接。
- 真实文件上传解析。
- 后端任务调度。
- 权限体系。
- 多人协作实时同步。

本阶段重点是：

```text
页面结构正确
交互流转正确
组件可复用
Mock 数据驱动
视觉风格统一
```
