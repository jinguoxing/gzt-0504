import React from 'react';
import type { DataQaResultBlock, DataTableData, DataQaResultAction } from '@/types';
import { cn } from '@/utils/cn';
import { ExternalLink, Filter, ArrowRight } from 'lucide-react';
import type { OnAction } from './DataQaResultBlockRenderer';

export default function DataTablePreviewCard({ block, onAction }: { block: DataQaResultBlock; onAction?: OnAction }) {
  const data = block.data as unknown as DataTableData;
  const columns = data.columns || [];
  const rows = data.rows || [];
  const filters = data.filters || [];
  const total = data.total ?? rows.length;
  const actions = block.actions || [];

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="text-[14px] font-medium text-gray-600">{block.title}</div>
        {total > (data.previewLimit ?? rows.length) && (
          <button className="inline-flex items-center gap-1 text-[12px] font-medium text-blue-600 hover:text-blue-700 transition-colors">
            查看全部 ({total.toLocaleString()} 行)
            <ArrowRight size={12} />
          </button>
        )}
      </div>

      {/* Filter pills */}
      {filters.length > 0 && (
        <div className="px-5 py-2 bg-gray-50/60 border-b border-gray-100 flex items-center gap-2 flex-wrap">
          <Filter size={12} className="text-gray-400 flex-shrink-0" />
          {filters.map((filter, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100"
            >
              {filter}
            </span>
          ))}
        </div>
      )}

      {/* Table */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/40">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2.5 text-[12px] font-semibold text-gray-500">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2.5 text-[13px] text-gray-700">
                  {formatCellValue(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer with actions */}
      {actions.length > 0 && (
        <div className="px-5 py-2.5 bg-gray-50/60 border-t border-gray-100 flex items-center gap-2">
          {actions.map((action: DataQaResultAction) => (
            <button
              key={action.id}
              onClick={() => onAction?.(action, block)}
              className={cn(
                'inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors',
                action.actionType === 'export'
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100'
                  : 'text-gray-600 bg-white hover:bg-gray-50 border border-gray-200',
              )}
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

/** Format a cell value for display */
function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'number') return value.toLocaleString();
  return String(value);
}
