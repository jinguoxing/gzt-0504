import React from 'react';
import type { ResultBlock, ConfirmOption } from '@/types';
import { cn } from '@/utils/cn';
import { HelpCircle } from 'lucide-react';

/**
 * ConfirmationResult — P0 模板 6
 * 确认请求（问题 + 操作按钮）
 */
export default function ConfirmationResult({ block }: { block: ResultBlock }) {
  const question = (block.data.question as string) || block.title;
  const options = (block.data.options as ConfirmOption[]) || [];

  return (
    <div className="flex items-center gap-3">
      <HelpCircle size={14} className="text-blue-500 flex-shrink-0" />
      <span className="text-[13px] text-gray-700">{question}</span>
      {options.length > 0 ? (
        <div className="ml-auto flex items-center gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors",
                opt.type === 'primary'
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : opt.type === 'danger'
                  ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      ) : (
        <button className="ml-auto px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[12px] font-medium hover:bg-blue-700">
          确认
        </button>
      )}
    </div>
  );
}
