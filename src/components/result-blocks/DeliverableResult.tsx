import React from 'react';
import type { ResultBlock, DeliverableItem } from '@/types';
import { cn } from '@/utils/cn';
import { FileText, Table, Download } from 'lucide-react';

const iconMap: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
  PDF: { icon: <FileText size={16} />, bg: 'bg-blue-50', text: 'text-blue-600' },
  XLSX: { icon: <Table size={16} />, bg: 'bg-green-50', text: 'text-green-600' },
  CSV: { icon: <Table size={16} />, bg: 'bg-green-50', text: 'text-green-600' },
  MD: { icon: <FileText size={16} />, bg: 'bg-gray-100', text: 'text-gray-600' },
};

/**
 * DeliverableResult — P0 模板 7
 * 交付物列表
 */
export default function DeliverableResult({ block }: { block: ResultBlock }) {
  const items = (block.data.items as DeliverableItem[]) || [];

  if (items.length === 0) return null;

  const isGrid = items.length <= 4;

  return (
    <div className="space-y-2">
      {block.summary && <p className="text-[13px] text-gray-600 mb-2">{block.summary}</p>}
      <div className={isGrid ? "grid grid-cols-2 gap-3" : "space-y-2"}>
        {items.map((item) => {
          const config = iconMap[item.type] || iconMap.PDF;
          return (
            <div
              key={item.id}
              className={cn(
                "hover:border-blue-300 transition-colors cursor-pointer",
                isGrid
                  ? "border border-gray-200 rounded-xl p-3.5 flex gap-3"
                  : "flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-blue-50/50"
              )}
            >
              <div className="flex items-start gap-3 overflow-hidden">
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", config.bg, config.text)}>
                  {config.icon}
                </div>
                <div className="overflow-hidden">
                  <div className="text-[13px] font-semibold text-gray-900 truncate">
                    {item.name}
                  </div>
                  {item.description && (
                    <div className="text-[11px] text-gray-500 mt-0.5 truncate">{item.description}</div>
                  )}
                  {item.time && !isGrid && (
                    <div className="text-[11px] text-gray-500 mt-0.5">{item.time}</div>
                  )}
                </div>
              </div>
              {!isGrid && (
                <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-white text-gray-400 hover:text-blue-600 transition-colors">
                  <Download size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
