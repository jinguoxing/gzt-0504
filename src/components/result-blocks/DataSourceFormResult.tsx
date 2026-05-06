import React, { useState } from 'react';
import type { ResultBlock, DataSourceFormData } from '@/types';
import { cn } from '@/utils/cn';
import { Database, Check, X, Loader2, Wifi, WifiOff, ShieldAlert } from 'lucide-react';

const statusConfig: Record<string, { icon: React.ElementType; text: string; bg: string; label: string }> = {
  CONNECTED: { icon: Wifi, text: 'text-green-600', bg: 'bg-green-50', label: '已连接' },
  DISCONNECTED: { icon: WifiOff, text: 'text-gray-500', bg: 'bg-gray-100', label: '未连接' },
  PERMISSION_REQUIRED: { icon: ShieldAlert, text: 'text-amber-600', bg: 'bg-amber-50', label: '需要权限' },
};

/**
 * DataSourceFormResult — 数据源选择表单模板
 * 展示可选数据源列表 + 连接测试 + 选择确认
 */
export default function DataSourceFormResult({ block }: { block: ResultBlock }) {
  const formData = block.data as unknown as DataSourceFormData;
  const options = formData.options || [];
  const initialSelectedId = formData.selectedId || '';
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const [testState, setTestState] = useState<'idle' | 'testing' | 'success' | 'fail'>('idle');

  const connResult = formData.connectionTestResult;
  const showTest = formData.showConnectionTest !== false;

  const handleTest = () => {
    if (!selectedId) return;
    setTestState('testing');
    setTimeout(() => {
      const selected = options.find(o => o.id === selectedId);
      if (selected?.status === 'CONNECTED') {
        setTestState('success');
      } else {
        setTestState('fail');
      }
    }, 800);
  };

  if (options.length === 0) {
    return (
      <div className="text-[13px] text-gray-500 py-3 text-center">
        暂无可用的数据源，请先配置数据源连接。
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {block.summary && <p className="text-[13px] text-gray-600">{block.summary}</p>}

      {/* Data source option list */}
      <div className="space-y-2">
        {options.map((ds) => {
          const isSelected = selectedId === ds.id;
          const config = statusConfig[ds.status] || statusConfig.DISCONNECTED;
          const StatusIcon = config.icon;

          return (
            <label
              key={ds.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                isSelected
                  ? "border-blue-400 bg-blue-50/40 shadow-sm"
                  : "border-gray-200 bg-white hover:border-blue-200"
              )}
            >
              <input
                type="radio"
                name={`ds-${block.id}`}
                checked={isSelected}
                onChange={() => {
                  setSelectedId(ds.id);
                  setTestState('idle');
                }}
                className="accent-blue-600 mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Database size={14} className={cn("flex-shrink-0", isSelected ? "text-blue-600" : "text-gray-400")} />
                  <span className="text-[14px] font-semibold text-gray-900">{ds.name}</span>
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium",
                    config.bg, config.text
                  )}>
                    <StatusIcon size={10} />
                    {config.label}
                  </span>
                </div>
                <div className="text-[12px] text-gray-500 mt-1">
                  {ds.type} · {ds.host}{ds.port ? `:${ds.port}` : ''}
                </div>
                {ds.selectedTableCount !== undefined && (
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    已选表 {ds.selectedTableCount} 张
                    {ds.scannedFieldCount !== undefined && ` · ${ds.scannedFieldCount.toLocaleString()} 个字段`}
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Connection test + submit */}
      {showTest && selectedId && (
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleTest}
            disabled={testState === 'testing'}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors",
              testState === 'testing'
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            )}
          >
            {testState === 'testing' ? (
              <span className="flex items-center gap-1.5">
                <Loader2 size={12} className="animate-spin" />
                测试中...
              </span>
            ) : '测试连接'}
          </button>

          {testState === 'success' && (
            <span className="flex items-center gap-1.5 text-[12px] text-green-600 font-medium">
              <Check size={14} />
              连接正常（{connResult?.latencyMs ?? '45'}ms）
            </span>
          )}
          {testState === 'fail' && (
            <span className="flex items-center gap-1.5 text-[12px] text-red-600 font-medium">
              <X size={14} />
              连接失败
            </span>
          )}

          <button
            className={cn(
              "ml-auto px-4 py-1.5 rounded-lg text-[12px] font-medium transition-colors",
              testState === 'success'
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-600/60 text-white cursor-default"
            )}
          >
            确认选择
          </button>
        </div>
      )}

      {/* Initial connection test result from data */}
      {connResult && testState === 'idle' && (
        <div className={cn(
          "flex items-center gap-2 text-[12px] rounded-lg px-3 py-2",
          connResult.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        )}>
          {connResult.success ? <Check size={14} /> : <X size={14} />}
          {connResult.message || (connResult.success ? '连接正常' : '连接失败')}
          {connResult.latencyMs && connResult.success && `（${connResult.latencyMs}ms）`}
        </div>
      )}
    </div>
  );
}
