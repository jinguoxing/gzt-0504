/** 视图状态类型 */
export type ViewState = 'HOME' | 'DRAFT' | 'EXECUTION' | 'DATA_QUERY' | 'TASK_LIST';

/** 导航项 */
export interface NavItem {
  label: string;
  icon: any;
  path: string;
}

/** 任务行数据 */
export interface TaskRow {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  project: string;
  stage: string;
  stageProgress: string;
  progress: number;
  owner: string;
  priority: '高' | '中' | '低';
  pendingCount: number;
  status: '执行中' | '已完成' | '异常' | '待确认' | '待审核';
  updatedAt: string;
}

/** 执行阶段状态 */
export type StageStatus = 'done' | 'active' | 'pending';

/** 执行阶段 */
export interface ExecutionStage {
  title: string;
  status: StageStatus;
}
