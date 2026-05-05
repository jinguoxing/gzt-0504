import { create } from 'zustand';

interface WorkbenchState {
  /** 当前激活的导航项 */
  activeNav: string;
  /** 设置激活导航 */
  setActiveNav: (nav: string) => void;
}

export const useWorkbenchStore = create<WorkbenchState>((set) => ({
  activeNav: 'AI 工作台',
  setActiveNav: (nav) => set({ activeNav: nav }),
}));
