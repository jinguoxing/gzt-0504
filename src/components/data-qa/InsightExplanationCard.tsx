import React from 'react';
import type { DataQaResultBlock, InsightExplanationData } from '@/types';
import { cn } from '@/utils/cn';

/**
 * InsightExplanationCard — 找数问数结果模板
 * 结论 + 归因理由解释卡片
 */
export default function InsightExplanationCard({ block }: { block: DataQaResultBlock }) {
  const data = block.data as unknown as InsightExplanationData;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      {/* Title */}
      <div className="text-[15px] font-semibold text-gray-900 mb-3">{block.title}</div>

      {/* Conclusion */}
      {data.conclusion && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-4">
          <p className="text-[13px] text-blue-800 leading-relaxed">{data.conclusion}</p>
        </div>
      )}

      {/* Numbered reasons */}
      {data.reasons && data.reasons.length > 0 && (
        <div className="space-y-2.5">
          {data.reasons.map((reason, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-semibold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-[13px] text-gray-700 leading-relaxed">{reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
