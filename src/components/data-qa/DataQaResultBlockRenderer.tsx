import React from 'react';
import type { DataQaResultBlock, DataQaResultAction } from '@/types';
import SingleMetricAnswerCard from './SingleMetricAnswerCard';
import ComparisonTrendCard from './ComparisonTrendCard';
import DataSourceTraceCard from './DataSourceTraceCard';
import FollowupSuggestionCard from './FollowupSuggestionCard';
import InsightExplanationCard from './InsightExplanationCard';
import ContributionAnalysisCard from './ContributionAnalysisCard';
import DataTablePreviewCard from './DataTablePreviewCard';
import ClarificationCard from './ClarificationCard';
import FallbackResultCard from './FallbackResultCard';
import QueryPreflightCard from './QueryPreflightCard';
import AnalysisPlanCard from './AnalysisPlanCard';
import RankingCard from './RankingCard';
import BreakdownCard from './BreakdownCard';

export type OnAction = (action: DataQaResultAction, block: DataQaResultBlock) => void;
export type OnFollowup = (question: string) => void;
export type OnClarify = (selections: { metric: string; timeRange: string; scope?: string }) => void;

/**
 * DataQaResultBlockRenderer — 找数问数合同 08_COMPONENT_SPEC
 * 根据 block.type 分发到对应结果模板组件渲染。
 */
export default function DataQaResultBlockRenderer({
  block,
  onAction,
  onCardAction,
  onFollowup,
  onClarify,
  onClarifyCancel,
}: {
  block: DataQaResultBlock;
  onAction?: OnAction;
  onCardAction?: (action: string, block: DataQaResultBlock) => void;
  onFollowup?: OnFollowup;
  onClarify?: OnClarify;
  onClarifyCancel?: () => void;
}) {
  const commonProps = { block, onAction };

  switch (block.type) {
    case 'single_metric_answer':
      return <SingleMetricAnswerCard block={block} />;
    case 'comparison_trend':
      return <ComparisonTrendCard block={block} />;
    case 'data_source_trace':
      return <DataSourceTraceCard {...commonProps} />;
    case 'recommendation':
      return <FollowupSuggestionCard block={block} onFollowup={onFollowup} />;
    case 'insight_explanation':
      return <InsightExplanationCard block={block} />;
    case 'contribution_analysis':
      return <ContributionAnalysisCard block={block} />;
    case 'data_table':
      return <DataTablePreviewCard {...commonProps} />;
    case 'clarification':
      return <ClarificationCard block={block} onConfirm={onClarify} onCancel={onClarifyCancel} />;
    case 'query_preflight':
      return <QueryPreflightCard block={block} onAction={onCardAction} />;
    case 'analysis_plan':
      return <AnalysisPlanCard block={block} onAction={onCardAction} />;
    case 'ranking':
      return <RankingCard block={block} />;
    case 'breakdown':
      return <BreakdownCard block={block} />;
    default:
      return <FallbackResultCard block={block} />;
  }
}
