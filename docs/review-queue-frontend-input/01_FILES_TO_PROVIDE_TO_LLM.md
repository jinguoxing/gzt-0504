# 待我处理页面｜需要给大模型的代码文件清单

## 1. 必须给的全局约束文件

```text
Semovix_AI_Workbench_Design_Prompt_Pack_v1_1_整合版.md
```

用途限定：

```text
只用于全局外壳、Logo、顶部栏、左侧栏、用户、色彩、字体、卡片、表格风格约束。
不要让大模型用它推导待我处理页面功能结构。
```

## 2. 必须给的本专项合同文件

```text
review-queue-frontend-input/
├── 00_README_INPUT_PACKAGE.md
├── 02_REVIEW_QUEUE_PAGE_SPEC.md
├── 03_REVIEW_QUEUE_ROUTES_AND_NAV.md
├── 04_REVIEW_QUEUE_INTERACTION_RULES.md
├── 05_REVIEW_QUEUE_COMPONENT_SPEC.md
├── 06_REVIEW_QUEUE_DATA_MODEL_TYPES.md
├── 07_REVIEW_QUEUE_MOCK_DATA_SPEC.md
├── 08_REVIEW_QUEUE_ACCEPTANCE_CRITERIA.md
├── 09_REVIEW_QUEUE_IMPLEMENTATION_PROMPT.md
├── 10_REVIEW_QUEUE_TEST_CASES.md
└── mock/
    ├── review-queue.json
    ├── review-item-detail.json
    └── review-queue-filters.json
```

## 3. 必须给的当前代码文件

### 路由与导航

```text
src/routes/index.tsx
src/config/menuConfig.ts
src/components/layout/AppShell.tsx
src/components/layout/LeftNav.tsx
src/components/layout/TopBar.tsx
```

原因：

```text
需要新增 /tasks/reviews 路由，并保证它位于 /tasks/:taskId 动态路由之前。
需要保持左侧“任务”高亮。
需要保证 AppShell / LeftNav / TopBar 不被重做。
```

### 任务中心与全部任务页

```text
src/views/task-center/TaskCenter.tsx
src/views/task-list/TaskListState.tsx
```

原因：

```text
任务中心的“待我处理 查看全部”要跳到 /tasks/reviews?assignee=me。
全部任务页和待处理事项页要区分：全部任务页展示 Task，待我处理页展示 ActionItem。
```

### 详情与执行链路

```text
src/views/review/
src/views/execution/
src/views/completed/
```

原因：

```text
待处理事项的操作按钮需要跳转：
进入确认 → /tasks/:taskId/review/:reviewId
去审核 → /tasks/:taskId/review/:reviewId
查看异常 → /tasks/:taskId/review/:reviewId 或异常详情
继续执行 → /tasks/:taskId?stageId=xxx
```

### 类型、mock 与样式

```text
src/types/
src/mock/
src/index.css
```

原因：

```text
需要新增或补齐 ReviewQueueItem、ReviewItemType、ReviewItemStatus、Priority 等类型。
需要补齐 mock review queue 数据。
需要确保状态色只使用蓝 / 绿 / 橙 / 红 / 灰。
```

## 4. 可新增文件建议

推荐新增：

```text
src/views/review-queue/ReviewQueue.tsx
src/views/review-queue/components/ReviewQueueStats.tsx
src/views/review-queue/components/ReviewQueueFilters.tsx
src/views/review-queue/components/ReviewQueueTable.tsx
src/views/review-queue/components/ReviewQueueSidePanel.tsx
src/views/review-queue/mockReviewQueue.ts
```

如果项目偏向单文件实现，也可以只新增：

```text
src/views/review-queue/ReviewQueue.tsx
```

但要避免文件过长、逻辑混乱。

## 5. 不建议给的文件

本次不要给大模型无关页面，避免改偏：

```text
src/views/data-query/
src/views/unrelated-pages/
node_modules/
dist/
构建产物
图片资源大文件
```

## 6. 本次禁止改动范围

```text
不要重做 AI 工作台首页
不要重做草稿抽屉页
不要重做任务执行页
不要重做完成态页面
不要改变品牌 Logo
不要改变左侧导航顺序
不要改变顶部栏结构
不要把任务中心改成全部任务页
不要把待我处理页做成任务列表页
```
