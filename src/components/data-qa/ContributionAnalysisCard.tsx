import React from 'react';
import type { DataQaResultBlock, ContributionAnalysisData } from '@/types';
import { cn } from '@/utils/cn';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const BAR_COLORS = ['#3B82F6', '#60A5FA', '#93C5FD'];

/**
 * ContributionAnalysisCard — 找数问数结果模板
 * 贡献度分析横向条形图
 */
export default function ContributionAnalysisCard({ block }: { block: DataQaResultBlock }) {
  const data = block.data as unknown as ContributionAnalysisData;
  const items = data.items || [];

  // Recharts data — bar chart uses "name" for Y-axis labels and "percent" for bar width
  const chartData = items.map((item) => ({
    name: item.label,
    percent: item.percent,
    formattedValue: item.formattedValue,
  }));

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      {/* Title */}
      <div className="text-[14px] font-medium text-gray-600 mb-4">{block.title}</div>

      {/* Horizontal bar chart */}
      {chartData.length > 0 && (
        <div className="h-[Math.max(200, chartData.length * 40)]px" style={{ height: Math.max(200, chartData.length * 44) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: '#374151' }}
                axisLine={false}
                tickLine={false}
                width={100}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, '贡献占比']}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              />
              <Bar dataKey="percent" radius={[0, 4, 4, 0]} barSize={20}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Legend with values */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[12px]">
            <span
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }}
            />
            <span className="text-gray-600">{item.label}</span>
            <span className="font-semibold text-gray-900">{item.formattedValue}</span>
            <span className="text-gray-400">({item.percent}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
