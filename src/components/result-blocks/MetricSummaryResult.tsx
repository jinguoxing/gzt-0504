import React from 'react';
import type { ResultBlock, MetricItem } from '@/types';
import { cn } from '@/utils/cn';

const toneMap: Record<string, { text: string; bg: string }> = {
  green: { text: 'text-green-600', bg: 'bg-green-50 border-green-100' },
  orange: { text: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
  red: { text: 'text-red-600', bg: 'bg-red-50 border-red-100' },
  rose: { text: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' },
  blue: { text: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
  gray: { text: 'text-gray-600', bg: 'bg-gray-50 border-gray-200' },
};

/**
 * MetricSummaryResult — P0 模板 2
 * 指标卡片网格
 */
export default function MetricSummaryResult({ block }: { block: ResultBlock }) {
  const metrics = (block.data.metrics as MetricItem[]) || [];

  return (
    <div className="space-y-2">
      {block.summary && <p className="text-[13px] text-gray-600">{block.summary}</p>}
      <div className={cn("grid gap-3", metrics.length <= 4 ? "grid-cols-2" : "grid-cols-5")}>
        {metrics.map((m) => {
          const tone = toneMap[m.tone] || toneMap.gray;
          return (
            <div key={m.key} className={cn("rounded-xl p-3 border text-center", tone.bg)}>
              <div className="text-[12px] text-gray-600 mb-1 font-medium">{m.label}</div>
              <div className={cn("text-[18px] font-bold font-mono tracking-tight", tone.text)}>
                {typeof m.value === 'number' ? m.value.toLocaleString() : m.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
