import React from 'react';
import type { ResultBlock } from '@/types';
import TextSummaryResult from './TextSummaryResult';
import MetricSummaryResult from './MetricSummaryResult';
import TableResult from './TableResult';
import IssueListResult from './IssueListResult';
import ChangeSummaryResult from './ChangeSummaryResult';
import ConfirmationResult from './ConfirmationResult';
import DeliverableResult from './DeliverableResult';

/**
 * ResultBlockRenderer — 合同 P-10 / F-06
 * 根据 block.type 分发到对应模板组件渲染。
 */
export default function ResultBlockRenderer({ block }: { block: ResultBlock }) {
  switch (block.type) {
    case 'text_summary':
      return <TextSummaryResult block={block} />;
    case 'metric_summary':
      return <MetricSummaryResult block={block} />;
    case 'table':
      return <TableResult block={block} />;
    case 'issue_list':
      return <IssueListResult block={block} />;
    case 'change_summary':
      return <ChangeSummaryResult block={block} />;
    case 'confirmation':
      return <ConfirmationResult block={block} />;
    case 'deliverable_list':
      return <DeliverableResult block={block} />;
    default:
      return <FallbackResult block={block} />;
  }
}

/** Fallback — 兜底渲染 */
function FallbackResult({ block }: { block: ResultBlock }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
      <div className="text-[13px] font-semibold text-gray-900 mb-2">{block.title}</div>
      {block.summary && <p className="text-[13px] text-gray-600">{block.summary}</p>}
      <div className="mt-2 text-[12px] text-gray-400">未知模板类型: {block.type}</div>
    </div>
  );
}
