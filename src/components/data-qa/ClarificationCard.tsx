import React, { useState } from 'react';
import type { DataQaResultBlock } from '@/types';
import { cn } from '@/utils/cn';
import { AlertCircle, CheckCircle, X, ChevronRight, Sparkles } from 'lucide-react';

/**
 * ClarificationCard — 找数问数口径确认卡
 * 合同 04_PAGE_SPEC_DRAFT_DRAWER.md
 *
 * block.data 结构：
 * {
 *   metricCandidates: string[]        — 指标候选（如 "销售额", "订单量"）
 *   timeRangeOptions: string[]        — 时间口径（如 "自然月", "财务月"）
 *   scopeOptions?: string[]           — 查询范围（如 "已支付", "已发货", "全部"）
 *   recommendedDefault: string        — 推荐口径描述
 * }
 */
export default function ClarificationCard({
  block,
  onConfirm,
  onCancel,
}: {
  block: DataQaResultBlock;
  onConfirm?: (selections: { metric: string; timeRange: string; scope?: string }) => void;
  onCancel?: () => void;
}) {
  const data = block.data as {
    metricCandidates?: string[];
    timeRangeOptions?: string[];
    scopeOptions?: string[];
    recommendedDefault?: string;
  };

  const metrics = data.metricCandidates || [];
  const timeRanges = data.timeRangeOptions || [];
  const scopes = data.scopeOptions || [];

  const [selectedMetric, setSelectedMetric] = useState(metrics[0] || '');
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRanges[0] || '');
  const [selectedScope, setSelectedScope] = useState(scopes[0] || '');

  const handleConfirmRecommended = () => {
    onConfirm?.({
      metric: selectedMetric,
      timeRange: selectedTimeRange,
      scope: selectedScope || undefined,
    });
  };

  return (
    <div className="bg-white border border-amber-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 bg-amber-50/60 border-b border-amber-200 flex items-center gap-2">
        <AlertCircle size={16} className="text-amber-600 shrink-0" />
        <span className="text-[14px] font-semibold text-amber-800">{block.title || '口径确认'}</span>
      </div>

      <div className="p-5 space-y-5">
        {/* Metric candidates */}
        {metrics.length > 0 && (
          <div>
            <label className="text-[13px] font-medium text-gray-700 mb-2 block">你想看的是？</label>
            <div className="flex flex-wrap gap-2">
              {metrics.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMetric(m)}
                  className={cn(
                    'px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all border',
                    selectedMetric === m
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-700'
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Time range options */}
        {timeRanges.length > 0 && (
          <div>
            <label className="text-[13px] font-medium text-gray-700 mb-2 block">时间口径</label>
            <div className="flex flex-wrap gap-2">
              {timeRanges.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTimeRange(t)}
                  className={cn(
                    'px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all border',
                    selectedTimeRange === t
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-700'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Scope options */}
        {scopes.length > 0 && (
          <div>
            <label className="text-[13px] font-medium text-gray-700 mb-2 block">订单范围</label>
            <div className="flex flex-wrap gap-2">
              {scopes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedScope(s)}
                  className={cn(
                    'px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all border',
                    selectedScope === s
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-700'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation */}
        {data.recommendedDefault && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 flex items-start gap-2">
            <Sparkles size={14} className="text-blue-600 mt-0.5 shrink-0" />
            <p className="text-[12px] text-blue-800 leading-relaxed">
              <span className="font-semibold">Xino 推荐：</span>
              {data.recommendedDefault}
            </p>
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
          <button
            onClick={handleConfirmRecommended}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium rounded-lg transition-colors shadow-sm"
          >
            <CheckCircle size={14} />
            按推荐口径查询
          </button>
          <button
            onClick={() => onConfirm?.({ metric: selectedMetric, timeRange: selectedTimeRange, scope: selectedScope || undefined })}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-[13px] font-medium rounded-lg transition-colors"
          >
            手动选择
            <ChevronRight size={13} />
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-gray-500 hover:text-gray-700 text-[13px] font-medium transition-colors ml-auto"
            >
              <X size={14} />
              取消
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
