import React from 'react';
import type { ResultBlock } from '@/types';
import TextSummaryResult from './TextSummaryResult';
import MetricSummaryResult from './MetricSummaryResult';
import TableResult from './TableResult';
import IssueListResult from './IssueListResult';
import ChangeSummaryResult from './ChangeSummaryResult';
import ConfirmationResult from './ConfirmationResult';
import DeliverableResult from './DeliverableResult';
import StageProgressResult from './StageProgressResult';
import GraphResult from './GraphResult';
import RecommendationResult from './RecommendationResult';
import ConfigFormResult from './ConfigFormResult';
import DataSourceFormResult from './DataSourceFormResult';
import FallbackResult from './FallbackResult';

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
    case 'stage_progress':
      return <StageProgressResult block={block} />;
    case 'graph':
      return <GraphResult block={block} />;
    case 'recommendation':
      return <RecommendationResult block={block} />;
    case 'config_form':
      return <ConfigFormResult block={block} />;
    case 'data_source_form':
      return <DataSourceFormResult block={block} />;
    default:
      return <FallbackResult block={block} />;
  }
}
