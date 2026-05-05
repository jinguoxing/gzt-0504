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
        <Route path="/" element={<Home />} />
        <Route path="/draft" element={<DraftState onExecute={() => {}} />} />
        <Route path="/execution" element={<ExecutionState />} />
        <Route path="/data-query" element={<DataQueryState />} />
        <Route path="/task-list" element={<TaskListState />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
