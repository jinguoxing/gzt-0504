import React from 'react';
import type { ResultBlock, StageProgressItem } from '@/types';
import { cn } from '@/utils/cn';
import { Check, Loader2, Circle, AlertTriangle } from 'lucide-react';

const statusConfig: Record<string, { icon: React.ElementType; text: string; bg: string; barBg: string }> = {
  COMPLETED: { icon: Check, text: 'text-green-600', bg: 'bg-green-100', barBg: 'bg-green-500' },
  RUNNING: { icon: Loader2, text: 'text-blue-600', bg: 'bg-blue-100', barBg: 'bg-blue-500' },
  PENDING: { icon: Circle, text: 'text-gray-400', bg: 'bg-gray-100', barBg: 'bg-gray-300' },
  FAILED: { icon: AlertTriangle, text: 'text-red-600', bg: 'bg-red-100', barBg: 'bg-red-500' },
};

/**
 * StageProgressResult — 阶段进度条模板
 * 展示多阶段执行进度
 */
export default function StageProgressResult({ block }: { block: ResultBlock }) {
  const stages = (block.data.stages as StageProgressItem[]) || [];

  if (stages.length === 0) return null;

  const completedCount = stages.filter(s => s.status === 'COMPLETED').length;
  const totalCount = stages.length;

  return (
    <div className="space-y-3">
      {block.summary && <p className="text-[13px] text-gray-600">{block.summary}</p>}

      {/* Overall progress */}
      <div className="flex items-center gap-3 mb-1">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
        <span className="text-[12px] font-medium text-gray-500 flex-shrink-0">
          {completedCount}/{totalCount}
        </span>
      </div>

      {/* Stage list */}
      <div className="space-y-2">
        {stages.map((stage) => {
          const config = statusConfig[stage.status] || statusConfig.PENDING;
          const Icon = config.icon;
          return (
            <div
              key={stage.id}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors",
                stage.status === 'RUNNING' ? "border-blue-200 bg-blue-50/50" :
                stage.status === 'COMPLETED' ? "border-gray-100 bg-gray-50/50" :
                stage.status === 'FAILED' ? "border-red-200 bg-red-50/50" :
                "border-gray-100 bg-white"
              )}
            >
              <div className={cn("w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0", config.bg)}>
                <Icon size={12} className={cn(config.text, stage.status === 'RUNNING' && "animate-spin")} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-[13px] font-medium truncate",
                    stage.status === 'COMPLETED' ? "text-gray-700" :
                    stage.status === 'RUNNING' ? "text-blue-700" :
                    stage.status === 'FAILED' ? "text-red-700" :
                    "text-gray-400"
                  )}>
                    {stage.name}
                  </span>
                  {stage.status === 'RUNNING' && (
                    <span className="text-[12px] text-blue-600 font-mono flex-shrink-0 ml-2">
                      {stage.progress}%
                    </span>
                  )}
                </div>
                {stage.summary && (
                  <p className="text-[12px] text-gray-500 mt-0.5 truncate">{stage.summary}</p>
                )}
                {stage.status === 'RUNNING' && (
                  <div className="mt-1.5 h-1 bg-blue-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${stage.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
