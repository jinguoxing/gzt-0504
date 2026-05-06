import React from 'react';
import type { ResultBlock, RecommendationItem } from '@/types';
import { cn } from '@/utils/cn';
import { Lightbulb, TrendingUp, AlertTriangle, Info } from 'lucide-react';

const severityIcon: Record<string, { icon: React.ElementType; text: string; bg: string }> = {
  high: { icon: TrendingUp, text: 'text-green-600', bg: 'bg-green-100' },
  medium: { icon: AlertTriangle, text: 'text-amber-600', bg: 'bg-amber-100' },
  low: { icon: Info, text: 'text-blue-600', bg: 'bg-blue-100' },
};

/**
 * RecommendationResult — 推荐建议模板
 * 展示 AI 推荐的操作建议
 */
export default function RecommendationResult({ block: _block }: { block: ResultBlock }) {
  const block = _block;
  const items = (block.data.items as RecommendationItem[]) || [];

  if (items.length === 0) {
    return (
      <div className="text-[13px] text-gray-500 py-2">
        {block.summary || '暂无推荐建议。'}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {block.summary && <p className="text-[13px] text-gray-600">{block.summary}</p>}

      <div className="space-y-2">
        {items.map((item, idx) => {
          const severity = item.confidence !== undefined
            ? item.confidence >= 0.9 ? 'high'
              : item.confidence >= 0.7 ? 'medium'
              : 'low'
            : 'low';
          const config = severityIcon[severity] || severityIcon.low;
          const Icon = config.icon;

          return (
            <div
              key={item.id || idx}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border transition-colors",
                severity === 'high' ? "border-green-200 bg-green-50/30" :
                severity === 'medium' ? "border-amber-200 bg-amber-50/30" :
                "border-gray-200 bg-gray-50/30"
              )}
            >
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", config.bg, config.text)}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-gray-900">{item.title}</span>
                  {item.confidence !== undefined && (
                    <span className={cn(
                      "text-[11px] font-mono px-1.5 py-0.5 rounded",
                      config.bg, config.text
                    )}>
                      置信度 {(item.confidence * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-[12px] text-gray-600 mt-1 leading-relaxed">{item.description}</p>
                )}
                {item.reason && (
                  <p className="text-[11px] text-gray-400 mt-1">原因：{item.reason}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
