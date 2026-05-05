/**
 * 路由路径映射
 * 对齐 docs/task-frontend-contract/02_ROUTES.md
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
