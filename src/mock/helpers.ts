/**
 * Mock data helper functions for transforming API-style mock data to UI-ready format.
 */

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return i >= 2 ? `${value.toFixed(2)} ${sizes[i]}` : `${Math.round(value)} ${sizes[i]}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function confidencePercent(confidence: number): number {
  return confidence <= 1 ? Math.round(confidence * 100) : confidence;
}

const STATUS_MAP: Record<string, string> = {
  DRAFT: '草稿',
  READY: '待启动',
  RUNNING: '执行中',
  WAITING_CONFIRMATION: '待确认',
  WAITING_REVIEW: '待审核',
  BLOCKED: '异常',
  COMPLETED: '已完成',
  ARCHIVED: '已归档',
  PENDING: '待开始',
  FAILED: '失败',
  SKIPPED: '已跳过',
  PROCESSING: '处理中',
  RESOLVED: '已处理',
  REJECTED: '已驳回',
  IGNORED: '已忽略',
  EXPIRED: '已过期',
};

export function statusLabel(status: string): string {
  return STATUS_MAP[status] || status;
}

const PRIORITY_MAP: Record<string, string> = {
  HIGH: '高',
  MEDIUM: '中',
  LOW: '低',
};

export function priorityLabel(priority: string): string {
  return PRIORITY_MAP[priority] || priority;
}

export function priorityColor(priority: string): string {
  switch (priority) {
    case 'HIGH': return 'text-red-600 bg-red-50';
    case 'MEDIUM': return 'text-orange-600 bg-orange-50';
    case 'LOW': return 'text-green-600 bg-green-50';
    default: return 'text-gray-600 bg-gray-50';
  }
}
