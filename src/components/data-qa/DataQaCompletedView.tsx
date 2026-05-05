import React, { useState } from 'react';
import {
  CheckCircle2, ChevronRight, Download, FileSpreadsheet, FileText, FileCode, FileJson,
  Share2, RefreshCw, MessageCircle, BarChart3, Wrench, BookOpen, Users, Eye,
} from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * DataQaCompletedView — 找数问数完成态
 * 合同 07_PAGE_SPEC_COMPLETED_TASK.md
 */
export default function DataQaCompletedView({
  data,
  onResume,
}: {
  data: {
    title: string;
    summary: {
      question: string;
      answer: string;
      mom: string;
      yoy: string;
      period: string;
      definition: string;
    };
    followupChain: string[];
    deliverables: Array<{
      id: string;
      filename: string;
      fileType: string;
      purpose: string;
      createdAt: string;
    }>;
    archive: {
      savedAt: string;
      createdBy: string;
      dataSource: string;
      confidence: string;
      shared: boolean;
    };
    nextActions: string[];
  };
  onResume?: () => void;
}) {
  const [expandedFollowup, setExpandedFollowup] = useState<number | null>(null);

  const fileIcon: Record<string, React.ElementType> = {
    xlsx: FileSpreadsheet,
    pdf: FileText,
    txt: FileCode,
    json: FileJson,
  };

  const nextActionIcons: React.ElementType[] = [
    MessageCircle, BarChart3, Wrench, BookOpen, Share2,
  ];

  return (
    <div className="flex h-full bg-[#F8FAFC]">
      {/* Center */}
      <div className="flex-1 flex flex-col h-full border-r border-gray-200 min-w-0">
        {/* Header */}
        <div className="px-8 py-5 bg-white border-b border-gray-200 flex-shrink-0 flex items-start justify-between z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 size={22} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-gray-900">{data.title}</h2>
              <p className="text-[13px] text-gray-500 mt-0.5">结果已归档，可随时查看、下载或继续追问</p>
            </div>
          </div>
          <button
            onClick={onResume}
            className="h-9 px-4 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-medium transition-colors shadow-sm"
          >
            <MessageCircle size={15} />
            继续追问
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-8 px-8">
          <div className="max-w-[800px] mx-auto space-y-8">

            {/* Summary card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-[15px] font-semibold text-gray-900 mb-4">本次问数结果</h3>
              <div className="grid grid-cols-2 gap-4">
                <SummaryField label="问题" value={data.summary.question} />
                <SummaryField label="答案" value={data.summary.answer} highlight />
                <SummaryField label="环比" value={data.summary.mom} />
                <SummaryField label="同比" value={data.summary.yoy} />
                <SummaryField label="统计周期" value={data.summary.period} />
                <SummaryField label="口径" value={data.summary.definition} />
              </div>
            </div>

            {/* Followup chain */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-[15px] font-semibold text-gray-900">追问链路</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {data.followupChain.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setExpandedFollowup(expandedFollowup === i ? null : i)}
                    className="w-full px-6 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-semibold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-[13px] text-gray-800 flex-1">{q}</span>
                    <ChevronRight
                      size={14}
                      className={cn("text-gray-400 transition-transform", expandedFollowup === i && "rotate-90")}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            {data.deliverables.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-[15px] font-semibold text-gray-900">交付物</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {data.deliverables.map((file) => {
                    const Icon = fileIcon[file.fileType] || FileText;
                    return (
                      <div key={file.id} className="px-6 py-3.5 flex items-center gap-4">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          <Icon size={18} className="text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-gray-900 truncate">{file.filename}</p>
                          <p className="text-[11px] text-gray-500">{file.purpose} · {file.createdAt}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors" title="预览">
                            <Eye size={15} />
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors" title="下载">
                            <Download size={15} />
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors" title="分享">
                            <Share2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Next actions */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-[15px] font-semibold text-gray-900 mb-4">后续推荐</h3>
              <div className="flex flex-wrap gap-2">
                {data.nextActions.map((action, i) => {
                  const Icon = nextActionIcons[i] || MessageCircle;
                  const isFirst = i === 0;
                  return (
                    <button
                      key={i}
                      onClick={isFirst ? onResume : undefined}
                      className={cn(
                        'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors',
                        isFirst
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200',
                      )}
                    >
                      <Icon size={14} />
                      {action}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar — Archive */}
      <div className="w-[360px] bg-white flex flex-col flex-shrink-0 border-l border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200 bg-[#F8FAFC]/50 shrink-0">
          <h3 className="font-semibold text-gray-900 text-[15px]">结果归档</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <ArchiveField label="保存时间" value={data.archive.savedAt} />
          <ArchiveField label="创建人" value={data.archive.createdBy} />
          <ArchiveField label="会话 ID" value="dqa_001" mono />
          <ArchiveField label="数据源" value={data.archive.dataSource} mono />
          <ArchiveField
            label="可信度"
            value={data.archive.confidence}
            badge={{ color: data.archive.confidence === '高' ? 'green' : 'amber' }}
          />
          <ArchiveField label="交付文件" value={`${data.deliverables.length} 个`} />
          <ArchiveField
            label="共享状态"
            value={data.archive.shared ? '已共享' : '未共享'}
            badge={{ color: data.archive.shared ? 'blue' : 'gray' }}
          />
        </div>
      </div>
    </div>
  );
}

function SummaryField({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{label}</span>
      <span className={cn(
        "text-[13px]",
        highlight ? "font-bold text-blue-600 text-[18px]" : "text-gray-800",
      )}>
        {value}
      </span>
    </div>
  );
}

function ArchiveField({ label, value, mono, badge }: { label: string; value: string; mono?: boolean; badge?: { color: string } }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[12px] text-gray-500">{label}</span>
      {badge ? (
        <span className={cn(
          'text-[12px] px-2 py-0.5 rounded font-medium',
          badge.color === 'green' && 'text-green-700 bg-green-50',
          badge.color === 'amber' && 'text-amber-700 bg-amber-50',
          badge.color === 'blue' && 'text-blue-700 bg-blue-50',
          badge.color === 'gray' && 'text-gray-600 bg-gray-100',
        )}>
          {value}
        </span>
      ) : (
        <span className={cn("text-[12px] text-gray-800", mono && "font-mono")}>{value}</span>
      )}
    </div>
  );
}
