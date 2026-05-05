import React from 'react';
import { PanelRight, Copy, RefreshCw, Share2, CheckCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * DataQaHeader — 找数问数执行页顶部标题与轻操作
 * 合同 08_COMPONENT_SPEC: DataQaHeader
 */
export default function DataQaHeader({
  copied,
  onCopy,
  isSidebarOpen,
  onToggleSidebar,
}: {
  copied: boolean;
  onCopy: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}) {
  return (
    <div className="px-8 py-5 bg-white border-b border-gray-200 flex-shrink-0 flex items-start justify-between z-10 shadow-sm">
      <div>
        <h2 className="text-[20px] font-bold text-gray-900 mb-1.5">找数问数</h2>
        <p className="text-[13px] text-gray-500">用自然语言快速获取指标结果、趋势分析与数据依据</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onCopy}
          className="h-9 px-3 flex items-center justify-center gap-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors shadow-sm text-[13px] font-medium"
        >
          {copied ? <CheckCircle size={15} className="text-green-500" /> : <Copy size={15} />}
          <span>{copied ? '已复制' : '复制'}</span>
        </button>
        <button className="h-9 px-3 flex items-center justify-center gap-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors shadow-sm text-[13px] font-medium">
          <RefreshCw size={15} />
          <span>重新发起</span>
        </button>
        <button className="h-9 px-3 flex items-center justify-center gap-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors shadow-sm text-[13px] font-medium">
          <Share2 size={15} />
          <span>分享</span>
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1"></div>
        <button
          onClick={onToggleSidebar}
          className={cn("w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg transition-colors shadow-sm", isSidebarOpen ? "text-blue-600 bg-blue-50 border-blue-200" : "text-gray-600 hover:bg-gray-50")}
        >
          <PanelRight size={16} />
        </button>
      </div>
    </div>
  );
}
