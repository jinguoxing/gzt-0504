import React from 'react';
import type { ResultBlock } from '@/types';
import { AlertCircle } from 'lucide-react';

/**
 * FallbackResult — 安全兜底模板
 * 用于未知 block.type 的安全渲染
 */
export default function FallbackResult({ block }: { block: ResultBlock }) {
  return (
    <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50/50">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle size={14} className="text-gray-400" />
        <span className="text-[13px] font-semibold text-gray-700">{block.title}</span>
      </div>
      {block.summary && <p className="text-[13px] text-gray-600 mb-2">{block.summary}</p>}
      <div className="mt-2 text-[12px] text-gray-400">
        未知模板类型: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">{block.type}</code>
      </div>
      {block.data && Object.keys(block.data).length > 0 && (
        <pre className="mt-3 text-[11px] text-gray-500 bg-white border border-gray-200 rounded-lg p-3 overflow-x-auto font-mono">
          {JSON.stringify(block.data, null, 2)}
        </pre>
      )}
    </div>
  );
}
