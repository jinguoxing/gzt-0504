import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell';
import Home from '@/views/home/Home';
import ExecutionState from '@/views/execution/ExecutionState';
import DataQueryState from '@/views/data-query/DataQueryState';
import TaskListState from '@/views/task-list/TaskListState';
import TaskCenter from '@/views/task-center/TaskCenter';
import ReviewQueue from '@/views/review-queue/ReviewQueue';
import ReviewDetail from '@/views/review/ReviewDetail';
import CompletedTask from '@/views/completed/CompletedTask';

export default function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        {/* 默认跳转到 AI 工作台 */}
        <Route path="/" element={<Navigate to="/workbench" replace />} />

        {/* AI 工作台首页 — 合同要求 /ai-workbench 可访问 */}
        <Route path="/ai-workbench" element={<Home />} />

        {/* AI 工作台首页（支持 ?draftId=:id 草稿抽屉态） */}
        <Route path="/workbench" element={<Home />} />

        {/* 任务中心摘要页 */}
        <Route path="/tasks" element={<TaskCenter />} />

        {/* 全部任务列表 */}
        <Route path="/tasks/all" element={<TaskListState />} />

        {/* 待处理事项列表 */}
        <Route path="/tasks/reviews" element={<ReviewQueue />} />

        {/* 任务执行页（动态 taskId） */}
        <Route path="/tasks/:taskId" element={<ExecutionState />} />

        {/* 审核详情页 */}
        <Route path="/tasks/:taskId/review/:reviewId" element={<ReviewDetail />} />

        {/* 任务完成态 */}
        <Route path="/tasks/:taskId/completed" element={<CompletedTask />} />

        {/* 找数问数执行页 — 合同路由 /ai-workbench/data-qa/:sessionId */}
        <Route path="/ai-workbench/data-qa/:sessionId" element={<DataQueryState />} />

        {/* 旧路由兼容跳转 */}
        <Route path="/data-query" element={<Navigate to="/ai-workbench/data-qa/dqa_001" replace />} />

        {/* 兜底跳转 */}
        <Route path="*" element={<Navigate to="/workbench" replace />} />
      </Routes>
    </AppShell>
  );
}
