# 14｜Implementation Prompt

你是一名资深前端工程师，请按照本 `/frontend-contract` 目录下的合同文件，实现 Semovix AI 工作台与任务中心相关页面。实现时必须优先遵守全局产品外壳、视觉规范、页面流程和交互规则。

## 1. 实现范围

必须实现以下页面：

```text
/workbench
/workbench?draftId=:draftId
/tasks
/tasks/all
/tasks/:taskId
/tasks/:taskId/review/:reviewId
/tasks/:taskId/completed
```

页面分别对应：

```text
AI 工作台首页
草稿抽屉态
任务中心
全部任务列表
任务执行页
字段确认 / 冲突处理页
任务完成态 / 交付物页
```

---

## 2. 全局实现要求

### 2.1 AppShell

必须先实现统一 AppShell：

```text
LeftNav + TopBar + MainContent + OptionalRightPanel
```

所有页面使用同一个 AppShell，禁止每页复制不同外壳。

### 2.2 品牌与导航

严格保持：

```text
Semovix
语义治理与智能工作台
```

左侧导航顺序：

```text
首页
AI 工作台
任务
文件
历史记录
与我共享
```

顶部栏固定：

```text
供应链语义治理项目
搜索任务、文件、对象、知识库...
李桐
```

---

## 3. 技术建议

推荐：

```text
React + TypeScript
Tailwind CSS 或 CSS Modules
组件化实现
mock JSON 驱动页面
```

如果使用 React：

- 所有页面组件放在 `pages` 或 `routes`。
- 通用组件放在 `components`。
- 类型定义从 `11_DATA_MODEL_TYPES.md` 转为 `types.ts`。
- Mock 数据从 `mock/*.json` 加载。

---

## 4. 页面实现顺序

建议按以下顺序实现：

```text
1. Design Tokens / 基础样式
2. AppShell / LeftNav / TopBar
3. AI 工作台首页
4. 草稿抽屉态
5. 任务中心
6. 全部任务列表
7. 任务执行页
8. Review Detail
9. Completed Task
```

---

## 5. 样式原则

必须遵守：

```text
白色 / 浅灰背景
蓝色主色
轻量状态色
圆角卡片
浅灰边框
轻阴影
高可读性中文字体
```

禁止：

```text
深色左侧栏
多彩功能卡片
营销海报风
BI 大屏风
传统聊天气泡
伪中文乱码
```

---

## 6. 任务中心实现重点

任务中心 `/tasks` 必须包含：

```text
页面标题：任务中心
范围切换：我的任务 / 团队任务 / 全部任务
KPI：全部任务、执行中、待我处理、已完成、异常任务
运行中的任务
待我处理
最近访问
快捷开始
右侧：我的看板、最近活动、最近交付物
```

默认 scope 为：

```text
我的任务
```

所有“查看全部”必须按 `10_INTERACTION_RULES.md` 带筛选跳转。

---

## 7. 全部任务列表实现重点

全部任务列表 `/tasks/all` 必须包含：

```text
面包屑：任务 / 全部任务
标题：全部任务
范围切换：我的任务 / 团队任务 / 全部任务，默认全部任务选中
视图切换：默认视图 / 我关注的 / 异常任务 / 已归档
KPI 概览
搜索与筛选工具栏
批量选择提示条
任务表格
分页
右侧筛选摘要 / 快捷视图 / 说明提示
```

表格列必须包含：

```text
选择框
任务名称
类型
所属项目
当前阶段
整体进度
负责人
优先级
待处理数
状态
最近更新时间
操作
```

选中多个任务时显示：

```text
已选择 N 个任务
批量转派 / 批量归档 / 批量导出
```

---

## 8. 任务执行页实现重点

任务执行页 `/tasks/:taskId` 必须突出当前阶段：

```text
当前任务焦点
任务流式对话
当前阶段结果卡
最近完成阶段折叠
下一步行动输入区
右侧任务计划 / 任务详情 Tab
```

禁止展开所有历史阶段。

---

## 9. Review Detail 实现重点

Review Detail `/tasks/:taskId/review/:reviewId` 必须支持：

```text
Tab 筛选
字段确认表格
字段详情面板
Xino 建议卡
批量确认
确认 A / 确认 B / 手动修改 / 忽略
```

---

## 10. 完成态实现重点

Completed Task `/tasks/:taskId/completed` 必须包含：

```text
任务已完成总结
阶段完成时间线
交付物列表
结果摘要
下一步推荐
右侧任务总结
```

---

## 11. Mock 数据

使用 `/mock` 下的 JSON 文件驱动页面：

```text
workbench-home.json
task-draft.json
task-execution.json
field-review.json
task-completed.json
```

若实现任务中心和全部任务列表需要更多数据，可以基于上述 mock 派生：

- 从 `task-execution.json.task` 构造运行中任务。
- 从 `field-review.json` 构造待我处理。
- 从 `task-completed.json.deliverables` 构造最近交付物。
- 可在代码中临时定义 `taskCenterMock` 与 `allTasksMock`，但字段必须遵守 `11_DATA_MODEL_TYPES.md`。

---

## 12. 验收

完成后逐项对照：

```text
13_ACCEPTANCE_CRITERIA.md
```

若任何页面出现：

```text
Logo 不一致
左侧导航不一致
顶部栏不一致
颜色过多
传统聊天气泡
页面像 BI 大屏
表格文字模糊
伪中文乱码
```

则视为不通过。
