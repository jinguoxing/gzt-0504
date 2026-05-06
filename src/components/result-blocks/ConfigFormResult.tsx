import React from 'react';
import type { ResultBlock, ConfigFormItem } from '@/types';
import { cn } from '@/utils/cn';
import { Settings2, ChevronDown } from 'lucide-react';

/**
 * ConfigFormResult — 配置表单模板
 * 展示可编辑的配置项（只读预览态）
 */
export default function ConfigFormResult({ block }: { block: ResultBlock }) {
  const items = (block.data.items as ConfigFormItem[]) || [];

  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      {block.summary && <p className="text-[13px] text-gray-600">{block.summary}</p>}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.key} className="space-y-1">
            <div className="flex items-center gap-2">
              <label className="text-[12px] font-medium text-gray-700">{item.label}</label>
              {item.description && (
                <span className="text-[11px] text-gray-400">— {item.description}</span>
              )}
            </div>
            {item.type === 'select' ? (
              <div className="relative">
                <div className="w-full text-[13px] border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 flex items-center justify-between">
                  <span>
                    {item.options?.find(o => o.value === item.value)?.label || String(item.value)}
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
              </div>
            ) : item.type === 'toggle' ? (
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-9 h-5 rounded-full relative transition-colors",
                  item.value ? "bg-blue-600" : "bg-gray-300"
                )}>
                  <div className={cn(
                    "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                    item.value ? "translate-x-[18px]" : "translate-x-0.5"
                  )} />
                </div>
                <span className="text-[13px] text-gray-600">
                  {item.value ? '已启用' : '未启用'}
                </span>
              </div>
            ) : (
              <div className="text-[13px] border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800">
                {String(item.value)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
