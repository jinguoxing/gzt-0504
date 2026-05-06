import React from 'react';
import { Trophy, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { DataQaResultBlock } from '@/types';

interface RankingItem {
  rank: number;
  name: string;
  value: string;
  share: string;
  momChange: string;
}

export default function RankingCard({ block }: { block: DataQaResultBlock }) {
  const { data } = block;
  const items = (data.items as RankingItem[]) || [];
  const metricName = (data.metricName as string) || '';
  const period = (data.period as string) || '';

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-amber-600" />
          <h4 className="font-semibold text-[14px] text-gray-900">{block.title}</h4>
        </div>
        {period && (
          <span className="text-[12px] text-gray-500">{period}</span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500">
              <th className="px-4 py-2.5 text-left font-medium w-12">排名</th>
              <th className="px-4 py-2.5 text-left font-medium">{metricName ? '对象' : '名称'}</th>
              <th className="px-4 py-2.5 text-right font-medium">指标值</th>
              <th className="px-4 py-2.5 text-right font-medium">占比</th>
              <th className="px-4 py-2.5 text-right font-medium">环比</th>
              <th className="px-4 py-2.5 text-center font-medium w-16">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isUp = item.momChange.startsWith('+');
              return (
                <tr key={item.rank} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-2.5">
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold",
                      item.rank <= 3 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"
                    )}>
                      {item.rank}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-900 font-medium">{item.name}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-gray-800">{item.value}</td>
                  <td className="px-4 py-2.5 text-right text-gray-600">{item.share}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className={cn(
                      "flex items-center justify-end gap-1",
                      isUp ? "text-red-600" : "text-green-600"
                    )}>
                      {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {item.momChange}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button className="text-blue-600 hover:text-blue-700">
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
