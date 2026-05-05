import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell';
import Home from '@/views/home/Home';
import DraftState from '@/views/draft/DraftState';
import ExecutionState from '@/views/execution/ExecutionState';
import DataQueryState from '@/views/data-query/DataQueryState';
import TaskListState from '@/views/task-list/TaskListState';

export default function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        {/* 默认跳转到 AI 工作台 */}
        <Route path="/" element={<Navigate to="/workbench" replace />} />

        {/* AI 工作台首页（草稿抽屉态后续通过 query 参数 ?draftId=:id 实现） */}
        <Route path="/workbench" element={<Home />} />

        {/* 任务中心 */}
        <Route path="/tasks" element={<TaskListState />} />

        {/* 任务执行页（动态 taskId） */}
        <Route path="/tasks/:taskId" element={<ExecutionState />} />

        {/* Review Detail（后续实现） */}
        {/* <Route path="/tasks/:taskId/review/:reviewId" element={<ReviewDetail />} /> */}

        {/* 任务完成态（后续实现） */}
        {/* <Route path="/tasks/:taskId/completed" element={<CompletedTask />} /> */}

        {/* 找数问数 */}
        <Route path="/data-query" element={<DataQueryState />} />

        {/* 草稿页（临时保留，后续改为 /workbench?draftId=:id 右侧抽屉） */}
        <Route path="/draft" element={<DraftState onExecute={() => {}} />} />

        {/* 兜底跳转 */}
        <Route path="*" element={<Navigate to="/workbench" replace />} />
      </Routes>
    </AppShell>
  );
}
