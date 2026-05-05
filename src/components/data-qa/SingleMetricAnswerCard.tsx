import React from 'react';
import type { DataQaResultBlock, SingleMetricAnswerData } from '@/types';
import { cn } from '@/utils/cn';
import { TrendingUp, TrendingDown, Calendar, Info } from 'lucide-react';

/**
 * SingleMetricAnswerCard — 找数问数结果模板
 * 大数字卡片，展示核心指标值 + 环比/同比变化
 */
export default function SingleMetricAnswerCard({ block }: { block: DataQaResultBlock }) {
  const data = block.data as unknown as SingleMetricAnswerData;

  const title = data.metricName || block.title;
  const mom = data.mom;
  const yoy = data.yoy;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      {/* Title */}
      <div className="text-[14px] font-medium text-gray-600 mb-3">{title}</div>

      {/* Big number */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-[36px] font-bold tracking-tight text-gray-900">
          {data.formattedValue}
        </span>
        {data.unit && (
          <span className="text-[14px] font-medium text-gray-500">{data.unit}</span>
        )}
      </div>

      {/* MoM / YoY badges */}
      {(mom != null || yoy != null) && (
        <div className="flex items-center gap-2 mb-3">
          {mom != null && <DeltaBadge label="环比" value={mom} />}
          {yoy != null && <DeltaBadge label="同比" value={yoy} />}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-4 text-[12px] text-gray-400">
        {data.period && (
          <span className="inline-flex items-center gap-1">
            <Calendar size={12} />
            {data.period}
          </span>
        )}
        {data.definition && (
          <span className="inline-flex items-center gap-1">
            <Info size={12} />
            {data.definition}
          </span>
        )}
      </div>
    </div>
  );
}

/** Delta badge — pill with trend icon */
function DeltaBadge({ label, value }: { label: string; value: number }) {
  const isPositive = value >= 0;
  const absValue = Math.abs(value);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-medium',
        isPositive
          ? 'bg-green-50 text-green-700 border border-green-100'
          : 'bg-red-50 text-red-700 border border-red-100',
      )}
    >
      {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {label} {isPositive ? '+' : ''}{absValue.toFixed(1)}%
    </span>
  );
}
