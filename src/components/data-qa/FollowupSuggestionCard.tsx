import React from 'react';
import type { DataQaResultBlock, RecommendationData } from '@/types';
import { cn } from '@/utils/cn';
import { HelpCircle, MessageCircle } from 'lucide-react';
import type { OnFollowup } from './DataQaResultBlockRenderer';

export default function FollowupSuggestionCard({ block, onFollowup }: { block: DataQaResultBlock; onFollowup?: OnFollowup }) {
  const data = block.data as unknown as RecommendationData;
  const items = data.items || [];

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      <div className="flex items-center gap-2 text-[14px] font-medium text-gray-600 mb-3">
        <HelpCircle size={15} className="text-blue-600" />
        {block.title}
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => onFollowup?.(item)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors',
              i === 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200',
            )}
          >
            <MessageCircle size={13} />
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
