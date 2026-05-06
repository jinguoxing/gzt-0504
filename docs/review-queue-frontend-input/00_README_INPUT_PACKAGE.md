# 待我处理页面｜前端交互输入包说明

## 1. 这个输入包解决什么问题

本包用于让代码大模型实现或整改 Semovix 的「待我处理」独立页面。

该页面不是「全部任务」页面，也不是任务中心摘要页，而是一个 **Action Item / Review Queue / 待处理事项队列页**。

页面核心目标：

```text
用户进入后，可以集中查看自己需要处理的事项，包括待确认、待审核、异常处理、继续执行，并完成筛选、排序、批量操作、进入详情和跳转来源任务。
```

## 2. 与其他页面的边界

| 页面 | 对象 | 页面定位 |
|---|---|---|
| 任务中心 `/tasks` | 摘要与行动入口 | 我的行动首页，展示待我处理、重点运行任务、最近交付物 |
| 全部任务 `/tasks/all` | Task | 完整任务库，支持筛选、排序、分页、批量管理 |
| 待我处理 `/tasks/reviews` | ReviewQueueItem / ActionItem | 我的待处理事项队列，支持确认、审核、异常处理、继续执行 |
| 任务执行 `/tasks/:taskId` | 单个任务 | 查看一个任务的阶段推进、结果卡片和任务计划 |
| 审核详情 `/tasks/:taskId/review/:reviewId` | 单个事项详情 | 处理某一个字段、对象、异常或审核事项 |

## 3. 给大模型时的推荐顺序

请按以下顺序喂给代码大模型：

```text
1. Semovix_AI_Workbench_Design_Prompt_Pack_v1_1_整合版.md
   - 只作为全局外壳与视觉风格约束
   - 不作为待我处理页面功能合同

2. 本输入包全部文件
   - 00_README_INPUT_PACKAGE.md
   - 01_FILES_TO_PROVIDE_TO_LLM.md
   - 02_REVIEW_QUEUE_PAGE_SPEC.md
   - 03_REVIEW_QUEUE_ROUTES_AND_NAV.md
   - 04_REVIEW_QUEUE_INTERACTION_RULES.md
   - 05_REVIEW_QUEUE_COMPONENT_SPEC.md
   - 06_REVIEW_QUEUE_DATA_MODEL_TYPES.md
   - 07_REVIEW_QUEUE_MOCK_DATA_SPEC.md
   - 08_REVIEW_QUEUE_ACCEPTANCE_CRITERIA.md
   - 09_REVIEW_QUEUE_IMPLEMENTATION_PROMPT.md
   - 10_REVIEW_QUEUE_TEST_CASES.md
   - mock/*.json

3. 当前仓库相关代码文件
   - 见 01_FILES_TO_PROVIDE_TO_LLM.md
```

## 4. 全局外壳优先级说明

全局外壳仍以 Semovix 统一规范为准：

```text
Logo：Semovix
副标题：语义治理与智能工作台
左侧导航：首页 / AI 工作台 / 任务 / 文件 / 历史记录 / 与我共享
当前页面高亮：任务
顶部项目：供应链语义治理项目
顶部搜索：搜索任务、文件、对象、知识库...
用户：李桐 / liming@semovix.com
底部空间：语义模型与治理空间
```

如果与本包有冲突：

```text
全局外壳、品牌、顶部栏、左侧栏、颜色风格，以全局设计规范为准。
待我处理页面功能、路由、交互、数据模型、验收标准，以本包为准。
```

## 5. 输出期望

大模型完成后应输出：

```text
新增或整改 /tasks/reviews 页面
修复任务中心“待我处理 查看全部”的跳转
补齐待处理事项数据模型
补齐 mock 数据
补齐筛选、排序、批量操作、分页、详情跳转交互
保持全局外壳和视觉样式一致
```
