/**
 * 路由路径映射
 * 对齐 docs/semantic_Frontend_Contract/02_ROUTES.md
 *
 * 草稿抽屉态通过 /workbench?draftId=:id 控制（P-03）
 */
export const ROUTE_PATH_MAP: Record<string, string> = {
  workbench: '/workbench',
  workbench_draft: '/workbench?draftId=:id',
  tasks: '/tasks',
  tasks_all: '/tasks/all',
  tasks_reviews: '/tasks/reviews',
  task_detail: '/tasks/:taskId',
  task_review: '/tasks/:taskId/review/:reviewId',
  task_completed: '/tasks/:taskId/completed',
  data_query: '/data-query',
};
