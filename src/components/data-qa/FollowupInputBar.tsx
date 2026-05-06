import React from 'react';
import { Send, FileText } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * FollowupInputBar — 底部继续追问输入框
 * 合同 08_COMPONENT_SPEC: FollowupInputBar
 */
export default function FollowupInputBar({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="p-4 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC] to-transparent flex-shrink-0">
      <div className="max-w-[780px] mx-auto relative bg-white border border-gray-200 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex items-end p-2 transition-all focus-within:shadow-[0_4px_24px_rgba(37,99,235,0.12)] focus-within:border-blue-300">
        <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors shrink-0 mb-0.5">
          <FileText size={20} />
        </button>
        <textarea
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder="继续追问业务数据，或 @ 指标 / 维度 / 数据表 ..."
          className="flex-1 resize-none bg-transparent border-0 focus:ring-0 text-[15px] p-3 max-h-[160px] overflow-y-auto leading-relaxed text-gray-900 placeholder:text-gray-400 font-medium"
          style={{ minHeight: '48px' }}
        />
        <div className="flex items-center gap-1.5 p-1 mb-0.5 shrink-0">
          <button
            onClick={onSubmit}
            disabled={!value.trim() || disabled}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-sm",
              value.trim() && !disabled
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400"
            )}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
      <div className="text-center mt-2">
        <span className="text-[11px] text-gray-400">内容由 Semovix Xino 智能生成，请核对重要数据结果。</span>
      </div>
    </div>
  );
}
