import { Home, Sparkles, ListTodo, FileText, Clock, Share2 } from 'lucide-react';
import type { NavItem } from '@/types';

/**
 * 主导航菜单项
 * 对齐 docs/task-frontend-contract/00_FRONTEND_OVERVIEW.md
 * 高亮规则对齐 02_ROUTES.md
 */
export const NAV_ITEMS: NavItem[] = [
  { label: '首页', icon: Home, path: '/workbench', highlightPattern: '/workbench' },
  { label: 'AI 工作台', icon: Sparkles, path: '/workbench', highlightPattern: '/workbench' },
  { label: '任务', icon: ListTodo, path: '/tasks', highlightPattern: '/tasks' },
  { label: '文件', icon: FileText, path: '/', highlightPattern: '/resources' },
  { label: '历史记录', icon: Clock, path: '/', highlightPattern: '/' },
  { label: '与我共享', icon: Share2, path: '/', highlightPattern: '/' },
];
