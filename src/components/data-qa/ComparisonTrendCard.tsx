import React from 'react';
import type { DataQaResultBlock, ComparisonTrendData } from '@/types';
import { cn } from '@/utils/cn';
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/**
 * ComparisonTrendCard — 找数问数结果模板
 * 对比 + 趋势折线图卡片
 */
export default function ComparisonTrendCard({ block }: { block: DataQaResultBlock }) {
  const data = block.data as unknown as ComparisonTrendData;
  const deltaIsPositive = data.delta.value >= 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      {/* Title */}
      <div className="text-[14px] font-medium text-gray-600 mb-4">{block.title}</div>

      {/* Body: left comparison + right chart */}
      <div className="flex gap-6 mb-4">
        {/* Left: comparison numbers */}
        <div className="flex-shrink-0 space-y-3 min-w-[160px]">
          <div>
            <div className="text-[12px] text-gray-400 mb-0.5">{data.current.label}</div>
            <div className="text-[24px] font-bold tracking-tight text-gray-900">
              {data.current.formattedValue}
            </div>
          </div>
          <div>
            <div className="text-[12px] text-gray-400 mb-0.5">{data.previous.label}</div>
            <div className="text-[18px] font-semibold text-gray-600">
              {data.previous.formattedValue}
            </div>
          </div>
          <div
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-medium',
              deltaIsPositive
                ? 'bg-green-50 text-green-700 border border-green-100'
                : 'bg-red-50 text-red-700 border border-red-100',
            )}
          >
            {deltaIsPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {data.delta.formattedValue} ({deltaIsPositive ? '+' : ''}{data.delta.rate.toFixed(1)}%)
          </div>
        </div>

        {/* Right: trend line chart */}
        {data.trend && data.trend.length > 0 && (
          <div className="flex-1 h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#2563EB' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Footer: key findings */}
      {data.keyFindings && data.keyFindings.length > 0 && (
        <div className="border-t border-gray-100 pt-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-blue-600 mb-1">
            <Sparkles size={13} />
            关键发现
          </div>
          {data.keyFindings.map((finding, i) => (
            <div key={i} className="text-[12px] text-gray-600 pl-5">
              {finding}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
