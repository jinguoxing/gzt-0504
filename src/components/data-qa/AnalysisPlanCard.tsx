import React, { useState } from 'react';
import { Brain, Clock, FileText, ChevronRight, CheckCircle2 } from 'lucide-react';
import type { DataQaResultBlock } from '@/types';

export default function AnalysisPlanCard({
  block,
  onAction,
}: {
  block: DataQaResultBlock;
  onAction?: (action: string, block: DataQaResultBlock) => void;
}) {
  const [status, setStatus] = useState<'pending' | 'started' | 'cancelled'>('pending');
  const { data } = block;
  const directions = (data.analysisDirections as string[]) || [];
  const estimatedTime = (data.estimatedTime as string) || '约 20 秒';
  const outputContent = (data.outputContent as string) || '';

  if (status === 'started') {
    return (
      <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/40">
        <div className="flex items-center gap-2 text-[14px] text-blue-700 font-medium">
          <CheckCircle2 size={16} />
          分析计划已确认，正在执行分析...
        </div>
      </div>
    );
  }

  if (status === 'cancelled') {
    return (
      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
        <div className="text-[14px] text-gray-500">分析已取消</div>
      </div>
    );
  }

  const handleAction = (action: string) => {
    if (action === 'cancel') {
      setStatus('cancelled');
    } else if (action === 'start_analysis') {
      setStatus('started');
    }
    onAction?.(action, block);
  };

  return (
    <div className="border border-blue-200 rounded-xl overflow-hidden shadow-sm bg-white">
      <div className="px-4 py-3 border-b border-blue-100 bg-blue-50/50 flex items-center gap-2">
        <Brain size={16} className="text-blue-600" />
        <h4 className="font-semibold text-[14px] text-gray-900">{block.title}</h4>
      </div>
      <div className="p-4 space-y-4">
        <p className="text-[14px] text-gray-700">
          我将从以下方向分析：
        </p>
        <ol className="space-y-2">
          {directions.map((dir, i) => (
            <li key={i} className="flex items-start gap-3 text-[13px] text-gray-800">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="leading-relaxed">{dir}</span>
            </li>
          ))}
        </ol>
        <div className="flex items-center gap-6 text-[13px] text-gray-500 pt-2 border-t border-gray-100">
          <span className="flex items-center gap-1.5">
            <Clock size={13} /> 预计耗时：{estimatedTime}
          </span>
          <span className="flex items-center gap-1.5">
            <FileText size={13} /> 输出：{outputContent}
          </span>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => handleAction('start_analysis')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1"
          >
            开始分析 <ChevronRight size={14} />
          </button>
          <button
            onClick={() => handleAction('adjust_scope')}
            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-[13px] font-medium transition-colors"
          >
            调整范围
          </button>
          <button
            onClick={() => handleAction('summary_only')}
            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-[13px] font-medium transition-colors"
          >
            只看汇总
          </button>
        </div>
      </div>
    </div>
  );
}
