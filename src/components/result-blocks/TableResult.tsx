import React, { useContext, useCallback } from 'react';
import type { ResultBlock, TableColumn, TableRow } from '@/types';
import { cn } from '@/utils/cn';
import { Download, AlertTriangle } from 'lucide-react';
import { ResultBlockNavContext } from './ResultBlockNav';

/**
 * TableResult — P0 模板 3
 * 结构化表格 + 表头操作
 */
export default function TableResult({ block }: { block: ResultBlock }) {
  const columns = (block.data.columns as TableColumn[]) || [];
  const rows = (block.data.rows as TableRow[]) || [];
  const totalRows = (block.data.totalRows as number) || rows.length;
  const badge = block.data.badge as string | undefined;
  const showExport = block.data.showExport !== false;
  const nav = useContext(ResultBlockNavContext);

  const isFieldTable = columns.some(c => c.key === 'field' || c.key === 'fieldName');

  const handleRowClick = useCallback((row: TableRow) => {
    if (nav.onFieldClick && row.field) {
      nav.onFieldClick({
        field: String(row.field),
        semantic: String(row.semantic || ''),
        confidence: row.confidence ?? 0,
        source: String(row.source || ''),
      });
    }
  }, [nav]);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Table header bar */}
      <div className="px-4 py-2.5 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-[13px] font-semibold text-gray-900">{block.title}</h4>
          {badge && (
            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-medium border border-amber-200">
              {badge}
            </span>
          )}
        </div>
        {showExport && (
          <button className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-900 transition-colors">
            <Download size={12} /> 导出明细
          </button>
        )}
      </div>

      {/* Table */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2.5 text-[12px] font-semibold text-gray-500">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, i) => (
            <tr
              key={i}
              onClick={() => isFieldTable && handleRowClick(row)}
              className={cn("transition-colors", isFieldTable ? "hover:bg-blue-50 cursor-pointer" : "hover:bg-gray-50")}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-[13px]">
                  <CellRenderer columnKey={col.key} value={row[col.key]} row={row} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      {totalRows > rows.length && (
        <div className="px-4 py-2.5 bg-gray-50/80 border-t border-gray-200 flex justify-center">
          <button className="text-[12px] text-blue-600 hover:text-blue-700 font-medium">
            查看完整表格 ({totalRows.toLocaleString()} 行)
          </button>
        </div>
      )}
    </div>
  );
}

/** 单元格渲染 — 根据 columnKey 特殊处理 */
function CellRenderer({ columnKey, value, row }: { columnKey: string; value: unknown; row: TableRow }) {
  if (columnKey === 'fieldName' || columnKey === 'field') {
    return <span className="font-medium text-blue-600">{String(value)}</span>;
  }

  if (columnKey === 'semantic') {
    return <span className="font-semibold text-gray-900">{String(value)}</span>;
  }

  if (columnKey === 'confidence' || columnKey === 'conf') {
    const num = typeof value === 'number' ? value : parseFloat(String(value));
    const pct = Math.round(num * 100);
    const source = String(row.source || row.status || '');
    const isConflict = source.includes('冲突');
    return (
      <div className="flex items-center gap-2 w-24">
        <span className={cn("text-[13px] font-medium w-8", isConflict ? 'text-red-600' : 'text-amber-600')}>
          {num.toFixed(2)}
        </span>
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full", isConflict ? 'bg-red-500' : 'bg-amber-500')}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  if (columnKey === 'source' || columnKey === 'status') {
    const str = String(value);
    const isConflict = str.includes('冲突');
    return isConflict ? (
      <span className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 inline-flex items-center gap-1">
        <AlertTriangle size={10} /> 冲突
      </span>
    ) : (
      <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 inline-flex items-center gap-1">
        {str}
      </span>
    );
  }

  if (columnKey === 'actions') {
    return (
      <div className="flex items-center justify-end gap-2">
        <button className="px-2.5 py-1 border border-gray-200 hover:border-blue-300 hover:text-blue-600 text-gray-600 text-[12px] font-semibold rounded-lg transition-colors">
          修改
        </button>
        <button className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[12px] font-semibold rounded-lg transition-colors">
          确认
        </button>
      </div>
    );
  }

  return <span className="text-gray-700">{String(value ?? '')}</span>;
}
