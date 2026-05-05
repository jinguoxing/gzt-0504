import React from 'react';
import type { DataQaResultBlock } from '@/types';
import { cn } from '@/utils/cn';
import { AlertTriangle } from 'lucide-react';

/**
 * FallbackResultCard — 找数问数结果模板
 * 未知模板类型的兜底渲染卡片
 */
export default function FallbackResultCard({ block }: { block: DataQaResultBlock }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      {/* Title */}
      {block.title && (
        <div className="text-[14px] font-medium text-gray-600 mb-2">{block.title}</div>
      )}

      {/* Summary */}
      {block.summary && (
        <p className="text-[13px] text-gray-700 mb-3 leading-relaxed">{block.summary}</p>
      )}

      {/* Unknown type notice */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
        <AlertTriangle size={14} className="text-amber-600 flex-shrink-0" />
        <span className="text-[12px] text-amber-700">
          未知模板类型: <code className="font-mono font-semibold">{block.type}</code>
        </span>
      </div>
    </div>
  );
}
