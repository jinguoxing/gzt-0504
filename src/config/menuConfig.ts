import { Home, Sparkles, ListTodo, FileText, Clock, Share2 } from 'lucide-react';
import type { NavItem } from '@/types';

/** 主导航菜单项 */
export const NAV_ITEMS: NavItem[] = [
  { label: '首页', icon: Home, path: '/' },
  { label: 'AI 工作台', icon: Sparkles, path: '/' },
  { label: '任务', icon: ListTodo, path: '/task-list' },
  { label: '文件', icon: FileText, path: '/' },
  { label: '历史记录', icon: Clock, path: '/' },
  { label: '与我共享', icon: Share2, path: '/' },
];
