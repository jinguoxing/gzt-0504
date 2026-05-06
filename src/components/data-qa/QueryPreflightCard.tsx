import React, { useState } from 'react';
import { ShieldCheck, Clock, Database, AlertTriangle, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { DataQaResultBlock } from '@/types';

export default function QueryPreflightCard({ block }: { block: DataQaResultBlock }) {
  const [status, setStatus] = useState<'pending' | 'confirmed' | 'cancelled'>('pending');
  const { data } = block;

  if (status === 'confirmed') {
    return (
      <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/40">
        <div className="flex items-center gap-2 text-[14px] text-blue-700 font-medium">
          <ShieldCheck size={16} />
          查询已确认，正在执行...
        </div>
      </div>
    );
  }

  if (status === 'cancelled') {
    return (
      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
        <div className="text-[14px] text-gray-500">查询已取消</div>
      </div>
    );
  }

  return (
    <div className="border border-amber-200 rounded-xl overflow-hidden shadow-sm bg-white">
      <div className="px-4 py-3 border-b border-amber-100 bg-amber-50/50 flex items-center gap-2">
        <ShieldCheck size={16} className="text-amber-600" />
        <h4 className="font-semibold text-[14px] text-gray-900">{block.title}</h4>
      </div>
      <div className="p-4 space-y-3">
        <InfoRow icon={<Database size={14} />} label="预计扫描行数" value={(data.estimatedRows as number)?.toLocaleString() || '—'} />
        <InfoRow icon={<Clock size={14} />} label="预计耗时" value={(data.estimatedTime as string) || '—'} />
        <InfoRow icon={<Database size={14} />} label="涉及数据表" value={(data.tables as string) || '—'} mono />
        <InfoRow icon={<ShieldCheck size={14} />} label="权限状态" value={(data.permissionStatus as string) || '—'} />
        {(data.riskWarning as string) && (
          <div className="flex items-start gap-2 text-[13px] text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>{data.riskWarning as string}</span>
          </div>
        )}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={() => setStatus('confirmed')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1"
          >
            继续查询 <ChevronRight size={14} />
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-[13px] font-medium transition-colors">
            缩小范围
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-[13px] font-medium transition-colors">
            只看汇总
          </button>
          <button
            onClick={() => setStatus('cancelled')}
            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-lg text-[13px] font-medium transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="flex items-center gap-2 text-gray-500">
        {icon} {label}
      </span>
      <span className={cn('text-gray-900 font-medium', mono && 'font-mono')}>{value}</span>
    </div>
  );
}
