import React from 'react';
import type { DataQaResultBlock, DataSourceTraceData, DataQaResultAction } from '@/types';
import { cn } from '@/utils/cn';
import { Database, Clock, ShieldCheck, ShieldAlert, ShieldQuestion, ExternalLink } from 'lucide-react';
import type { OnAction } from './DataQaResultBlockRenderer';

const confidenceConfig: Record<string, { icon: typeof ShieldCheck; label: string; className: string }> = {
  high: { icon: ShieldCheck, label: '高', className: 'text-green-600 bg-green-50 border-green-100' },
  medium: { icon: ShieldAlert, label: '中', className: 'text-amber-600 bg-amber-50 border-amber-100' },
  low: { icon: ShieldQuestion, label: '低', className: 'text-red-600 bg-red-50 border-red-100' },
};

export default function DataSourceTraceCard({ block, onAction }: { block: DataQaResultBlock; onAction?: OnAction }) {
  const data = block.data as unknown as DataSourceTraceData;
  const actions = block.actions || [];
  const conf = confidenceConfig[data.confidence] || confidenceConfig.medium;
  const ConfIcon = conf.icon;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      <div className="flex items-center gap-2 text-[14px] font-medium text-gray-600 mb-4">
        <Database size={15} className="text-blue-600" />
        {block.title}
      </div>

      <div className="space-y-2.5 mb-4">
        <KVRow label="数据来源" value={data.dataSource} />
        <KVRow label="来源表" value={data.sourceTable} />
        <KVRow label="来源字段" value={data.sourceField} />
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-gray-400">更新时间</span>
          <span className="inline-flex items-center gap-1 text-gray-700">
            <Clock size={12} className="text-gray-400" />
            {data.updatedAt}
          </span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-gray-400">可信度</span>
          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-medium border', conf.className)}>
            <ConfIcon size={12} />
            {conf.label}
          </span>
        </div>
      </div>

      {actions.length > 0 && (
        <div className="border-t border-gray-100 pt-3 flex items-center gap-2 flex-wrap">
          {actions.map((action: DataQaResultAction) => (
            <button
              key={action.id}
              onClick={() => onAction?.(action, block)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg transition-colors"
            >
              <ExternalLink size={12} />
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function KVRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-700 font-mono text-[12px]">{value}</span>
    </div>
  );
}
