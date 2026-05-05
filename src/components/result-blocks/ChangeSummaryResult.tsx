import React from 'react';
import type { ResultBlock, ChangeRow } from '@/types';
import { cn } from '@/utils/cn';

/**
 * ChangeSummaryResult — P0 模板 5
 * 变更摘要（from → to 对比行）
 */
export default function ChangeSummaryResult({ block }: { block: ResultBlock }) {
  const changes = (block.data.changes as ChangeRow[]) || [];

  return (
    <div className="space-y-2.5">
      {block.summary && <p className="text-[13px] text-gray-600">{block.summary}</p>}
      {changes.map((row, i) => (
        <div key={i} className="flex items-center justify-between text-[13px]">
          <span className="text-gray-500">{row.label}</span>
          <div className="flex items-center gap-2">
            {row.from && <span className="text-gray-400 line-through">{row.from}</span>}
            {row.from && <span className="text-gray-300">&rarr;</span>}
            <span className={cn("font-medium", row.toClass || 'text-blue-700')}>{row.to}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
