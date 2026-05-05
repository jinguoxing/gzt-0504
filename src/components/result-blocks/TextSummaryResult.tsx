import React from 'react';
import type { ResultBlock } from '@/types';
import { cn } from '@/utils/cn';

/**
 * TextSummaryResult — P0 模板 1
 * 纯文本摘要 + 可选键值对行
 */
export default function TextSummaryResult({ block }: { block: ResultBlock }) {
  const rows = (block.data.rows as Array<{ label: string; value: string; valueClass?: string }>) || [];

  return (
    <div className="space-y-2.5">
      {block.summary && (
        <p className="text-[13px] text-gray-600">{block.summary}</p>
      )}
      {rows.length > 0 && (
        <div className="space-y-2.5">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center justify-between text-[13px]">
              <span className="text-gray-500">{row.label}</span>
              <span className={cn("font-medium text-gray-800 font-mono", row.valueClass)}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
