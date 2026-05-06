import React, { useState } from 'react';
import {
  ChevronDown, PanelRight, CheckCircle2, CheckCircle,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import type { AnswerEvidence } from '@/types';

export type RightPanelMode =
  | 'evidence'
  | 'metric_detail'
  | 'source_detail'
  | 'sql_detail'
  | 'row_detail'
  | 'confidence_detail';

export const PANEL_TITLES: Record<RightPanelMode, string> = {
  evidence: '答案依据',
  metric_detail: '指标口径详情',
  source_detail: '数据来源详情',
  sql_detail: '查询计划 / SQL',
  row_detail: '明细行详情',
  confidence_detail: '可信度说明',
};

/**
 * AnswerEvidenceSidebar — 找数问数右侧答案依据/详情栏
 * 合同 08_COMPONENT_SPEC: AnswerEvidenceSidebar
 *
 * 支持多种面板模式切换：evidence / metric_detail / source_detail / sql_detail / row_detail / confidence_detail
 */
export default function AnswerEvidenceSidebar({
  evidence,
  fieldReview,
  panelMode,
  onPanelModeChange,
  onClose,
}: {
  evidence: AnswerEvidence;
  fieldReview: any;
  panelMode: RightPanelMode;
  onPanelModeChange: (mode: RightPanelMode) => void;
  onClose: () => void;
}) {
  const [isSqlExpanded, setIsSqlExpanded] = useState(false);
  const [isContextExpanded, setIsContextExpanded] = useState(false);

  return (
    <div className="w-[360px] bg-white flex flex-col flex-shrink-0 shadow-[-1px_0_0_#E5E7EB] z-10 animate-in slide-in-from-right-2 duration-300 relative border-l border-gray-200">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-3 bg-[#F8FAFC]/50 shrink-0">
        {panelMode !== 'evidence' && (
          <button
            onClick={() => onPanelModeChange('evidence')}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200/50 transition-colors"
            title="返回"
          >
            <ChevronDown size={16} className="rotate-90" />
          </button>
        )}
        <h3 className="font-semibold text-gray-900 flex-1 text-[15px]">{PANEL_TITLES[panelMode]}</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200/50 transition-colors"
          title="关闭侧边栏"
        >
          <PanelRight size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">

        {/* ─── Evidence mode (default) ─── */}
        {panelMode === 'evidence' && (<>
          {/* Current Metric Scope — clickable to detail */}
          <button
            onClick={() => onPanelModeChange('metric_detail')}
            className="w-full text-left border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white hover:ring-2 hover:ring-blue-100 transition-all"
          >
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h4 className="font-semibold text-[13px] text-gray-900 leading-none">当前口径</h4>
              <ChevronDown size={14} className="text-gray-400 -rotate-90" />
            </div>
            <div className="p-4 space-y-3">
              <SidebarField label="分析指标" value={evidence.metricScope.metricName} />
              <SidebarField label="时间范围" value={evidence.metricScope.timeRange.label} mono />
              <SidebarField label="计算口径" value={evidence.metricScope.calculationDefinition} />
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">统计范围</span>
                <span className="text-[13px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full w-fit">{evidence.metricScope.businessDomain}</span>
              </div>
            </div>
          </button>

          {/* Data Evidence — clickable to detail, with confidence integrated */}
          <button
            onClick={() => onPanelModeChange('source_detail')}
            className="w-full text-left border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white hover:ring-2 hover:ring-blue-100 transition-all"
          >
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h4 className="font-semibold text-[13px] text-gray-900 leading-none">数据依据</h4>
              <ChevronDown size={14} className="text-gray-400 -rotate-90" />
            </div>
            <div className="p-4 space-y-3">
              <SidebarField label="数据源" value={evidence.dataEvidence.dataSource} mono />
              <SidebarField label="来源表" value={evidence.dataEvidence.sourceTable} mono />
              <div className="flex gap-4">
                <div className="flex flex-col gap-1 flex-1">
                  <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">来源字段</span>
                  <span className="text-[13px] text-gray-800 font-mono truncate">{evidence.dataEvidence.sourceField}</span>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">时间字段</span>
                  <span className="text-[13px] text-gray-800 font-mono truncate">{evidence.dataEvidence.timeField}</span>
                </div>
              </div>
              {/* Confidence integrated into data evidence card */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">可信度</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onPanelModeChange('confidence_detail'); }}
                  className="text-[12px] text-green-600 font-bold flex items-center gap-1 hover:underline"
                >
                  <CheckCircle2 size={12} />
                  {evidence.dataEvidence.confidence === 'high' ? '高' : evidence.dataEvidence.confidence === 'medium' ? '中' : '低'}
                </button>
              </div>
            </div>
          </button>

          {/* Query Plan / SQL — default collapsed */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
            <button
              onClick={() => setIsSqlExpanded(!isSqlExpanded)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-semibold text-[13px] text-gray-900 leading-none">查询计划 / SQL</h4>
              <ChevronDown size={16} className={cn("text-gray-400 transition-transform duration-200", isSqlExpanded && "rotate-180")} />
            </button>
            {isSqlExpanded && (
              <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                <p className="text-[12px] text-gray-500 mb-2">使用时间过滤、字段裁剪和指标口径匹配生成查询。</p>
                <button
                  onClick={(e) => { e.stopPropagation(); onPanelModeChange('sql_detail'); }}
                  className="text-[12px] text-blue-600 font-medium hover:underline"
                >
                  查看完整 SQL →
                </button>
              </div>
            )}
          </div>

          {/* Follow-up Context — default collapsed */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
            <button
              onClick={() => setIsContextExpanded(!isContextExpanded)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-semibold text-[13px] text-gray-900 leading-none">追问上下文</h4>
              <ChevronDown size={16} className={cn("text-gray-400 transition-transform duration-200", isContextExpanded && "rotate-180")} />
            </button>
            {isContextExpanded && (
              <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block mb-2">对话历史</span>
                    <div className="space-y-2 border-l-2 border-blue-200 pl-3">
                      {evidence.followupContext.questions.map((q, i) => (
                        <div key={i} className={cn("text-[12px]", i === evidence.followupContext.questions.length - 1 ? "font-medium text-gray-900" : "text-gray-600")}>
                          {i + 1}. {q}
                        </div>
                      ))}
                    </div>
                  </div>
                  {evidence.followupContext.currentAnalysisFocus && (
                    <div className="pt-3 border-t border-gray-200/60">
                      <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block mb-1">当前分析方向</span>
                      <span className="text-[13px] font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded inline-block">{evidence.followupContext.currentAnalysisFocus}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>)}

        {/* ─── Metric Detail ─── */}
        {panelMode === 'metric_detail' && fieldReview?.metricDetail && (
          <DetailCard>
            <DetailField label="指标名称" value={fieldReview.metricDetail.metricName} />
            <DetailField label="业务定义" value={fieldReview.metricDetail.businessDefinition} />
            <DetailField label="计算公式" value={fieldReview.metricDetail.formula} mono />
            <DetailField label="时间字段" value={fieldReview.metricDetail.timeField} mono />
            <DetailField label="业务域" value={fieldReview.metricDetail.domain} />
            <DetailField label="注册状态" value={fieldReview.metricDetail.status} badge="green" />
            <DetailField label="最近更新" value={fieldReview.metricDetail.lastUpdated} />
            <div className="pt-3 mt-2 border-t border-gray-100">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block mb-2">默认过滤条件</span>
              <div className="flex flex-wrap gap-1.5">
                {fieldReview.metricDetail.defaultFilters?.map((f: string, i: number) => (
                  <span key={i} className="text-[12px] px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-mono">{f}</span>
                ))}
              </div>
            </div>
          </DetailCard>
        )}

        {/* ─── Source Detail ─── */}
        {panelMode === 'source_detail' && fieldReview?.sourceDetail && (
          <DetailCard>
            <DetailField label="数据源" value={fieldReview.sourceDetail.dataSource} mono />
            <DetailField label="类型" value={fieldReview.sourceDetail.sourceType} />
            <DetailField label="来源表" value={fieldReview.sourceDetail.sourceTable} mono />
            <DetailField label="来源字段" value={fieldReview.sourceDetail.sourceField} mono />
            <DetailField label="时间字段" value={fieldReview.sourceDetail.timeField} mono />
            <DetailField label="同步状态" value={fieldReview.sourceDetail.syncStatus} badge="green" />
            <DetailField label="质量状态" value={fieldReview.sourceDetail.qualityStatus} />
            <DetailField label="权限" value={fieldReview.sourceDetail.permissionStatus} />
            <DetailField label="可信度" value={fieldReview.sourceDetail.confidence} badge="green" />
            <DetailField label="更新时间" value={fieldReview.sourceDetail.updatedAt} mono />
            <div className="pt-3 mt-2 border-t border-gray-100">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block mb-2">关联维度</span>
              <div className="flex flex-wrap gap-1.5">
                {fieldReview.sourceDetail.relatedDimensions?.map((d: string, i: number) => (
                  <span key={i} className="text-[12px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono">{d}</span>
                ))}
              </div>
            </div>
          </DetailCard>
        )}

        {/* ─── SQL Detail ─── */}
        {panelMode === 'sql_detail' && (
          <div className="space-y-5">
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <h4 className="font-semibold text-[13px] text-gray-900">查询步骤</h4>
              </div>
              <div className="p-4">
                <ol className="text-[12px] text-gray-700 list-decimal pl-4 space-y-1.5">
                  {evidence.queryPlan.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <h4 className="font-semibold text-[13px] text-gray-900">SQL</h4>
              </div>
              <div className="p-4">
                <div className="bg-[#1E293B] rounded-lg p-3 overflow-x-auto">
                  <pre className="text-[11px] text-[#E2E8F0] font-mono whitespace-pre-wrap leading-relaxed">{evidence.queryPlan.sql}</pre>
                </div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <h4 className="font-semibold text-[13px] text-gray-900">执行统计</h4>
              </div>
              <div className="p-4 grid grid-cols-3 gap-3 text-[12px]">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500">执行耗时</span>
                  <span className="text-gray-900 font-medium font-mono">{evidence.queryPlan.execution.durationMs}ms</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500">扫描行数</span>
                  <span className="text-gray-900 font-medium font-mono">{evidence.queryPlan.execution.scannedRows.toLocaleString()}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500">缓存</span>
                  <span className="text-gray-900 font-medium font-mono">{evidence.queryPlan.execution.cacheStatus === 'miss' ? '未命中' : '命中'}</span>
                </div>
                <div className="flex flex-col gap-1 col-span-3">
                  <span className="text-gray-500">索引</span>
                  <span className="text-gray-900 font-medium font-mono">{evidence.queryPlan.execution.indexUsed}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Row Detail ─── */}
        {panelMode === 'row_detail' && fieldReview?.rowDetail && (
          <DetailCard>
            <DetailField label="订单号" value={fieldReview.rowDetail.orderNo} mono />
            <DetailField label="供应商" value={fieldReview.rowDetail.supplier} />
            <DetailField label="订单日期" value={fieldReview.rowDetail.orderDate} />
            <DetailField label="金额" value={fieldReview.rowDetail.amount} highlight />
            <DetailField label="状态" value={fieldReview.rowDetail.status} badge="green" />
            <DetailField label="来源表" value={fieldReview.rowDetail.sourceTable} mono />
          </DetailCard>
        )}

        {/* ─── Confidence Detail ─── */}
        {panelMode === 'confidence_detail' && fieldReview?.confidenceDetail && (
          <DetailCard>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] text-gray-700 font-medium">综合可信度</span>
              <span className="text-[13px] text-green-700 bg-green-50 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                {fieldReview.confidenceDetail.level}
              </span>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block mb-3">可信度依据</span>
              <ul className="space-y-2.5">
                {fieldReview.confidenceDetail.reasons.map((r: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-gray-800">
                    <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </DetailCard>
        )}

      </div>
    </div>
  );
}

// ─── Sidebar helper components ────────────────────────────

function SidebarField({ label, value, mono, highlight }: { label: string; value: string; mono?: boolean; highlight?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{label}</span>
      <span className={cn(
        "text-[13px] text-gray-800",
        mono && "font-mono bg-gray-50 px-1.5 py-0.5 rounded w-fit",
        highlight && "text-blue-600 cursor-pointer hover:underline"
      )}>
        {value}
      </span>
    </div>
  );
}

function DetailCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white p-5 space-y-3.5">
      {children}
    </div>
  );
}

function DetailField({ label, value, mono, highlight, badge }: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
  badge?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-1">
      <span className="text-[12px] text-gray-500 shrink-0 pt-0.5">{label}</span>
      {badge ? (
        <span className={cn(
          'text-[12px] px-2 py-0.5 rounded font-medium',
          badge === 'green' && 'text-green-700 bg-green-50',
          badge === 'amber' && 'text-amber-700 bg-amber-50',
          badge === 'blue' && 'text-blue-700 bg-blue-50',
        )}>
          {value}
        </span>
      ) : (
        <span className={cn(
          "text-[13px] text-right",
          mono ? "font-mono text-gray-800" : highlight ? "font-bold text-blue-600" : "text-gray-800",
        )}>
          {value}
        </span>
      )}
    </div>
  );
}
