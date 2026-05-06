/**
 * 路由路径映射
 * 对齐 docs/askdata-frontend-contract/02_ROUTES.md（找数问数）
 * 对齐 docs/semantic_Frontend_Contract/02_ROUTES.md（治理类）
 *
 * 找数问数路由：
 *   /ai-workbench                      AI 工作台首页
 *   /ai-workbench?intent=detecting      意图识别中
 *   /ai-workbench/data-qa/:sessionId    找数问数执行页
 *   ?mode=clarify                       口径确认态
 *   ?panel=evidence|sql|source|row-detail  右侧栏模式
 *   ?status=completed                   完成态
 *
 * 草稿抽屉态通过 /ai-workbench?draftId=:id 控制（P-03）
 */
export const ROUTE_PATH_MAP: Record<string, string> = {
  workbench: '/ai-workbench',
  workbench_draft: '/ai-workbench?draftId=:id',
  ai_workbench: '/ai-workbench',
  data_qa: '/ai-workbench/data-qa/:sessionId',
  tasks: '/tasks',
  tasks_all: '/tasks/all',
  tasks_reviews: '/tasks/reviews',
  task_detail: '/tasks/:taskId',
  task_review: '/tasks/:taskId/review/:reviewId',
  task_completed: '/tasks/:taskId/completed',
};

/** 构建找数问数执行页路由 */
export function dataQaPath(sessionId: string, query?: Record<string, string>) {
  let path = `/ai-workbench/data-qa/${sessionId}`;
  if (query && Object.keys(query).length > 0) {
    const params = new URLSearchParams(query);
    path += `?${params.toString()}`;
  }
  return path;
}
