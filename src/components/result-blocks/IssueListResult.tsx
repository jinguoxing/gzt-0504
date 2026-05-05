import React from 'react';
import type { ResultBlock, IssueItem } from '@/types';
import { cn } from '@/utils/cn';

const severityConfig: Record<string, { border: string; bg: string; badgeBg: string; badgeText: string }> = {
  high: {
    border: 'border-red-200',
    bg: 'bg-red-50/50',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-700',
  },
  medium: {
    border: 'border-amber-200',
    bg: 'bg-amber-50/50',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
  },
  low: {
    border: 'border-blue-200',
    bg: 'bg-blue-50/50',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
  },
};

/**
 * IssueListResult — P0 模板 4
 * 问题列表（高风险/中风险/低风险卡片）
 */
export default function IssueListResult({ block }: { block: ResultBlock }) {
  const issues = (block.data.issues as IssueItem[]) || [];

  return (
    <div className="space-y-3">
      {block.summary && <p className="text-[13px] text-gray-600">{block.summary}</p>}
      {issues.map((issue) => {
        const config = severityConfig[issue.severity] || severityConfig.medium;
        return (
          <div key={issue.id} className={cn("border rounded-xl p-4", config.border, config.bg)}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className={cn("px-1.5 py-0.5 text-[10px] rounded font-bold", config.badgeBg, config.badgeText)}>
                  {issue.severity === 'high' ? '高风险' : issue.severity === 'medium' ? '中风险' : '低风险'}
                </span>
                <span className="text-[13px] font-semibold text-gray-900">{issue.title}</span>
              </div>
              {issue.detailLabel && (
                <button className="text-[12px] text-blue-600 font-medium">{issue.detailLabel}</button>
              )}
            </div>
            <p className="text-[12px] text-gray-600">{issue.description}</p>
          </div>
        );
      })}
    </div>
  );
}
