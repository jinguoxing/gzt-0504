import React from 'react';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { DataQaResultBlock } from '@/types';

interface BreakdownItem {
  name: string;
  value: string;
  share: number;
  trend: 'up' | 'down' | 'flat';
  change: string;
}

export default function BreakdownCard({ block }: { block: DataQaResultBlock }) {
  const { data } = block;
  const items = (data.items as BreakdownItem[]) || [];
  const dimensionName = (data.dimensionName as string) || '维度';
  const metricName = (data.metricName as string) || '指标';
  const period = (data.period as string) || '';

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-blue-600" />
          <h4 className="font-semibold text-[14px] text-gray-900">{block.title}</h4>
        </div>
        {period && (
          <span className="text-[12px] text-gray-500">{period}</span>
        )}
      </div>
      <div className="p-4">
        {/* Header labels */}
        <div className="grid grid-cols-[1fr_100px_60px_80px] gap-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2 px-1">
          <span>{dimensionName}</span>
          <span className="text-right">{metricName}</span>
          <span className="text-right">占比</span>
          <span className="text-right">变化趋势</span>
        </div>
        <div className="space-y-1">
          {items.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_100px_60px_80px] gap-3 items-center px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[13px] text-gray-900 font-medium truncate">{item.name}</span>
              </div>
              <span className="text-[13px] text-gray-800 font-mono text-right">{item.value}</span>
              <div className="flex items-center justify-end gap-1.5">
                <div className="w-10 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.min(item.share, 100)}%` }}
                  />
                </div>
                <span className="text-[12px] text-gray-500 w-10 text-right">{item.share}%</span>
              </div>
              <span className={cn(
                "flex items-center justify-end gap-1 text-[13px] font-medium",
                item.trend === 'up' ? "text-red-600" : item.trend === 'down' ? "text-green-600" : "text-gray-500"
              )}>
                {item.trend === 'up' && <TrendingUp size={12} />}
                {item.trend === 'down' && <TrendingDown size={12} />}
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
