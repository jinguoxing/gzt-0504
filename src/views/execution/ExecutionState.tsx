import React, { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Share2, MoreHorizontal, Sparkles, CheckCircle2, ChevronRight,
  ChevronDown, Download, Send, FileText, Database, AlertCircle,
  AlertTriangle, RefreshCw, ArrowLeft, Network, Maximize2,
  Table, PanelRight, HelpCircle, Clock, Eye, RotateCw,
  Copy, ExternalLink, ShieldAlert,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import type { XinoMessage, ResultBlock } from '@/types';
import ResultBlockRenderer from '@/components/result-blocks/ResultBlockRenderer';
import { ResultBlockNavContext, type ResultBlockNavContextType } from '@/components/result-blocks/ResultBlockNav';
import mockData from '@/mock/task-execution.json';

const task = mockData.task;
const conversation = mockData.conversation as XinoMessage[];
const sidePanel = mockData.sidePanel;

const completedStages = task.stages.filter(s => s.status === 'COMPLETED');
const currentStage = task.stages.find(s => s.status === 'RUNNING');

/** 提取时间字符串 (HH:mm) */
function fmtTime(iso: string) {
  return iso.replace(/^.*T(\d{2}:\d{2}).*$/, '$1');
}

/** 根据 messageType 获取 Xino block 的图标配置 */
function getXinoIconConfig(msg: XinoMessage) {
  if (msg.messageType === 'error') return { icon: <AlertTriangle size={12} />, iconBg: 'bg-rose-600' };
  if (msg.messageType === 'draft_change') return { icon: <Sparkles size={12} />, iconBg: 'bg-blue-600' };
  if (msg.messageType === 'confirmation') return { icon: <HelpCircle size={12} />, iconBg: 'bg-amber-600' };
  return { icon: <Sparkles size={12} />, iconBg: 'bg-blue-600' };
}

/** 根据 resultBlock status 获取状态标识 */
function getBlockStatusBadge(status?: string) {
  if (status === 'success') return <span className="flex items-center gap-1.5 text-[12px] text-green-600 font-medium"><CheckCircle2 size={13} /> 已完成</span>;
  if (status === 'warning') return <span className="flex items-center gap-1.5 text-[12px] text-amber-600 font-medium"><AlertCircle size={13} /> 需关注</span>;
  if (status === 'error') return <span className="flex items-center gap-1.5 text-[12px] text-rose-600 font-medium"><AlertTriangle size={13} /> 异常</span>;
  if (status === 'running') return <span className="flex items-center gap-1.5 text-[12px] text-blue-600 font-medium"><RefreshCw size={13} className="animate-spin" /> 执行中</span>;
  if (status === 'waiting_confirm') return null;
  return null;
}

// ==================== Detail types ====================
interface FieldDetail {
  field: string;
  semantic: string;
  confidence: string | number;
  source: string;
}

interface IssueDetail {
  id: string;
  title: string;
  severity: string;
  description?: string;
}

interface DeliverableDetail {
  id: string;
  name: string;
  type: string;
  description?: string;
}

type DetailPanel =
  | { kind: 'field'; data: FieldDetail }
  | { kind: 'issue'; data: IssueDetail }
  | { kind: 'deliverable'; data: DeliverableDetail }
  | null;

// ==================== Sub-components ====================

/** 单条 Xino 消息块 — 左侧工作输出，两层结构 */
function XinoMessageBlock({ msg }: { msg: XinoMessage }) {
  const { icon, iconBg } = getXinoIconConfig(msg);
  const time = fmtTime(msg.createdAt);
  const hasBlocks = msg.resultBlocks && msg.resultBlocks.length > 0;

  return (
    <div className="flex gap-3 max-w-full">
      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-0.5", iconBg)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        {/* 第一层：文本说明 */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-semibold text-[13px] text-gray-900">Xino</span>
          <span className="text-[12px] text-gray-400">{time}</span>
          {msg.stageName && (
            <span className="text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{msg.stageName}</span>
          )}
        </div>
        <p className="text-[14px] text-gray-700 leading-relaxed">{msg.text}</p>

        {/* 第二层：结构化结果模板 */}
        {hasBlocks && (
          <div className="mt-5 space-y-4">
            {msg.resultBlocks!.map((block) => (
              <div key={block.id} className="bg-white rounded-xl border border-gray-200/80 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[13px] font-semibold text-gray-900">{block.title}</span>
                  {getBlockStatusBadge(block.status)}
                </div>
                <ResultBlockRenderer block={block as ResultBlock} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** 用户消息 — 右侧轻量指令块 */
function UserMessageBlock({ msg }: { msg: XinoMessage }) {
  const time = fmtTime(msg.createdAt);
  return (
    <div className="flex justify-end">
      <div className="w-[45%] min-w-[280px]">
        <div className="flex items-center gap-2 mb-1 justify-end">
          <span className="text-[12px] text-gray-400">{time}</span>
          <span className="font-medium text-[13px] text-gray-600">{msg.authorName}</span>
        </div>
        <div className="bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-2.5">
          <p className="text-[14px] text-gray-800 leading-relaxed">{msg.text}</p>
        </div>
      </div>
    </div>
  );
}

/** 阶段分组 */
interface StageGroup {
  stageId: string;
  stageName: string;
  stageStatus: string;
  messages: XinoMessage[];
}

function groupByStage(messages: XinoMessage[]): StageGroup[] {
  const groups: StageGroup[] = [];
  let currentGroup: StageGroup | null = null;
  for (const msg of messages) {
    if (msg.role === 'user' && !msg.stageId) {
      if (currentGroup) currentGroup.messages.push(msg);
      continue;
    }
    const stageId = msg.stageId || 'system';
    const stageName = msg.stageName || '';
    const taskStage = task.stages.find(s => s.id === stageId);
    const stageStatus = taskStage?.status || 'COMPLETED';
    if (!currentGroup || currentGroup.stageId !== stageId) {
      currentGroup = { stageId, stageName, stageStatus, messages: [] };
      groups.push(currentGroup);
    }
    currentGroup.messages.push(msg);
  }
  return groups;
}

// ==================== Main Component ====================

export default function ExecutionState() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL state for restoration after refresh
  const fieldIdParam = searchParams.get('fieldId');
  const issueIdParam = searchParams.get('issueId');
  const deliverableIdParam = searchParams.get('deliverableId');
  const panelParam = searchParams.get('panel') as 'plan' | 'detail' | null;

  const [activeTab, setActiveTab] = useState<'plan' | 'detail'>(panelParam || 'plan');
  const [isPlanExpanded, setIsPlanExpanded] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Detail panel state
  const [detailPanel, setDetailPanel] = useState<DetailPanel>(() => {
    if (fieldIdParam) return { kind: 'field', data: { field: fieldIdParam, semantic: '采购订单状态', confidence: 0.97, source: '规则推断冲突' } };
    if (issueIdParam) return { kind: 'issue', data: { id: issueIdParam, title: '字符集编码不一致', severity: 'high', description: 'supplier_info 等表的字符集为 latin1，与库默认 utf8mb4 不一致。' } };
    if (deliverableIdParam) return { kind: 'deliverable', data: { id: deliverableIdParam, name: '冲突字段明细.xlsx', type: 'XLSX', description: '含字段名、推断语义、置信度、冲突原因' } };
    return null;
  });

  const stageGroups = useMemo(() => groupByStage(conversation), []);
  const [expandedStages, setExpandedStages] = useState<Set<string>>(() => {
    const current = new Set<string>();
    if (currentStage) current.add(currentStage.id);
    // If URL has a param for a specific stage, expand it too
    return current;
  });

  const toggleStage = (stageId: string) => {
    setExpandedStages(prev => {
      const next = new Set(prev);
      if (next.has(stageId)) next.delete(stageId); else next.add(stageId);
      return next;
    });
  };

  // Navigation context callbacks
  const updateUrl = useCallback((params: Record<string, string | null>) => {
    setSearchParams(prev => {
      // Clear all detail params first
      prev.delete('fieldId');
      prev.delete('issueId');
      prev.delete('deliverableId');
      for (const [k, v] of Object.entries(params)) {
        if (v) prev.set(k, v); else prev.delete(k);
      }
      return prev;
    }, { replace: true });
  }, [setSearchParams]);

  const navContext = useMemo<ResultBlockNavContextType>(() => ({
    onFieldClick: (field) => {
      setDetailPanel({ kind: 'field', data: field });
      updateUrl({ fieldId: field.field });
    },
    onIssueClick: (issue) => {
      setDetailPanel({ kind: 'issue', data: issue });
      updateUrl({ issueId: issue.id });
    },
    onDeliverableClick: (deliverable) => {
      setDetailPanel({ kind: 'deliverable', data: deliverable });
      updateUrl({ deliverableId: deliverable.id });
    },
  }), [updateUrl]);

  const handleTabChange = (tab: 'plan' | 'detail') => {
    setActiveTab(tab);
    setSearchParams(prev => {
      prev.set('panel', tab);
      return prev;
    }, { replace: true });
  };

  const handleDetailBack = () => {
    setDetailPanel(null);
    updateUrl({});
  };

  return (
    <ResultBlockNavContext.Provider value={navContext}>
      <div className="flex h-full bg-[#F8FAFC]">
        {/* Center Execution Area */}
        <div className="flex-1 flex flex-col h-full relative border-r border-[#E5E7EB] min-w-0">
          {/* Task Header */}
          <div className="px-8 py-5 bg-white border-b border-[#E5E7EB] flex-shrink-0 flex items-start justify-between z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-[20px] font-bold text-gray-900 truncate max-w-lg">{task.name}</h2>
                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[12px] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                  执行中
                </span>
              </div>
              <div className="flex items-center gap-4 text-[13px] text-gray-500">
                <span>项目：{task.project.name}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>当前阶段：<span className="font-medium text-gray-700">{currentStage?.name}</span> <span className="text-gray-400">{currentStage?.index}/{task.stages.length}</span></span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>整体进度：<span className="font-medium text-gray-700">{task.progress}%</span></span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>最近更新：09:50</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                <Share2 size={16} />
              </button>
              <button className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                <MoreHorizontal size={16} />
              </button>
              <button
                onClick={() => {
                  const next = !isSidebarOpen;
                  setIsSidebarOpen(next);
                  if (!next) updateUrl({});
                }}
                className={cn("w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg transition-colors shadow-sm", isSidebarOpen ? "text-blue-600 bg-blue-50 border-blue-200" : "text-gray-600 hover:bg-gray-50")}
              >
                <PanelRight size={16} />
              </button>
            </div>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 overflow-y-auto w-full flex justify-center py-8">
            <div className="w-full max-w-[780px] px-6 space-y-6">

              {/* Completed Stages Strip */}
              <div className="flex items-center gap-3 text-[13px] text-gray-500 flex-wrap">
                {completedStages.map((stage, i) => (
                  <React.Fragment key={stage.id}>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-green-500" />
                      <span>{stage.name}</span>
                    </div>
                    {i < completedStages.length - 1 && <ChevronRight size={12} className="text-gray-300" />}
                  </React.Fragment>
                ))}
                <span className="text-[12px] text-gray-400 ml-auto">已完成</span>
              </div>

              {/* Pending items alert strip */}
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-[13px] text-amber-800">
                <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
                <span>待处理：41 个冲突字段、326 个待确认字段，建议先处理高风险冲突。</span>
                <button className="ml-auto text-[12px] font-medium text-amber-600 hover:text-amber-800 whitespace-nowrap transition-colors">查看详情 →</button>
              </div>

              {/* Stage-grouped Conversation Stream */}
              {stageGroups.map((group) => {
                const isExpanded = expandedStages.has(group.stageId);
                const isCurrentStage = currentStage?.id === group.stageId;
                const isCompleted = group.stageStatus === 'COMPLETED';
                const messageCount = group.messages.length;
                return (
                  <div key={group.stageId}>
                    {!isCurrentStage && messageCount > 0 && (
                      <button
                        onClick={() => toggleStage(group.stageId)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-left mb-4"
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <span className={cn("text-[13px] font-semibold", isCompleted ? "text-gray-700" : "text-gray-400")}>
                            {group.stageName}
                          </span>
                          {isCompleted && <span className="text-[12px] text-gray-400 ml-2">已完成</span>}
                        </div>
                        <span className="text-[12px] text-gray-400 flex-shrink-0">{messageCount} 条消息</span>
                        <ChevronDown size={14} className={cn("text-gray-400 transition-transform duration-200", isExpanded && "rotate-180")} />
                      </button>
                    )}
                    {(isCurrentStage || isExpanded) && (
                      <div className="space-y-6">
                        {group.messages.map((msg) => (
                          <div key={msg.id}>
                            {msg.role === 'user'
                              ? <UserMessageBlock msg={msg} />
                              : <XinoMessageBlock msg={msg} />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="h-10"></div>
            </div>
          </div>

          {/* Bottom Input Area */}
          <div className="p-4 bg-white border-t border-[#E5E7EB] flex-shrink-0 flex flex-col items-center">
            <div className="w-full max-w-[780px]">
              <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-1 custom-scrollbar">
                {['仅显示冲突字段', '批量确认置信度 > 0.95 的字段', '调整业务规则', '导出字段理解结果'].map((action) => (
                  <button key={action} className="flex-shrink-0 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-[12px] text-gray-600 whitespace-nowrap transition-colors">
                    {action}
                  </button>
                ))}
              </div>
              <div className="w-full bg-white rounded-xl shadow-sm border border-gray-300 p-2 pl-4 flex gap-3 items-end focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <textarea
                  className="flex-1 min-h-[24px] max-h-[100px] py-1.5 resize-y outline-none text-[14px] leading-relaxed placeholder:text-gray-400 bg-transparent custom-scrollbar"
                  placeholder="输入指令或问题，获取 Xino 的建议…"
                  rows={1}
                ></textarea>
                <button className="w-8 h-8 mb-0.5 flex-shrink-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Task Sidebar */}
        {isSidebarOpen && (
          <div className="w-[360px] bg-white flex flex-col flex-shrink-0 shadow-[-1px_0_0_#E5E7EB] z-10 animate-in slide-in-from-right-2 duration-300">
            {detailPanel ? (
              <DetailPanelRouter panel={detailPanel} onBack={handleDetailBack} />
            ) : (
              <TaskSidePanel
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                isPlanExpanded={isPlanExpanded}
                setIsPlanExpanded={setIsPlanExpanded}
                onIssueClick={(issue) => { setDetailPanel({ kind: 'issue', data: issue }); updateUrl({ issueId: issue.id }); }}
                onDeliverableClick={(deliv) => { setDetailPanel({ kind: 'deliverable', data: deliv }); updateUrl({ deliverableId: deliv.id }); }}
              />
            )}
          </div>
        )}
      </div>
    </ResultBlockNavContext.Provider>
  );
}

// ==================== Detail Panel Router ====================

function DetailPanelRouter({ panel, onBack }: { panel: DetailPanel; onBack: () => void }) {
  if (!panel) return null;
  if (panel.kind === 'field') return <FieldDetailPanel data={panel.data} onBack={onBack} />;
  if (panel.kind === 'issue') return <IssueDetailPanel data={panel.data} onBack={onBack} />;
  if (panel.kind === 'deliverable') return <DeliverableDetailPanel data={panel.data} onBack={onBack} />;
  return null;
}

// ==================== Field Detail Panel ====================

function FieldDetailPanel({ data, onBack }: { data: FieldDetail; onBack: () => void }) {
  const confNum = typeof data.confidence === 'number' ? data.confidence : parseFloat(String(data.confidence)) || 0;
  const confPct = Math.round(confNum * 100);
  const isConflict = data.source.includes('冲突');

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-2 duration-200">
      <div className="px-4 py-4 border-b border-gray-200 flex items-center gap-3 flex-shrink-0">
        <button onClick={onBack} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <h3 className="text-[15px] font-semibold text-gray-900">字段详情</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-[12px] text-gray-500 mb-1">字段名称</div>
          <div className="text-[18px] font-bold text-gray-900 font-mono tracking-tight">{data.field}</div>
        </div>
        <div>
          <h4 className="text-[12px] font-medium text-gray-500 mb-2 uppercase tracking-wide">推断结果</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-600">业务语义</span>
              <span className="font-semibold text-gray-900">{data.semantic}</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-600">置信度</span>
              <span className={cn("font-semibold px-2 py-0.5 rounded border", isConflict ? "text-red-600 bg-red-50 border-red-100" : "text-green-600 bg-green-50 border-green-100")}>
                {confPct}%
              </span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-600">来源</span>
              <span className={cn("font-medium", isConflict ? "text-red-600" : "text-gray-700")}>{data.source || '—'}</span>
            </div>
          </div>
        </div>
        <div className="w-full h-px bg-gray-100"></div>
        <div>
          <h4 className="text-[12px] font-medium text-gray-500 mb-2 uppercase tracking-wide">推断依据</h4>
          <p className="text-[13px] text-gray-700 bg-blue-50/50 border border-blue-100 rounded-lg p-3 leading-relaxed">
            通过 <span className="font-medium">[{data.source}]</span> 识别。该字段命名符合常规约束，并且在业务系统中被高频作为核心标示符。
          </p>
        </div>
        {/* Related business objects */}
        <div>
          <h4 className="text-[12px] font-medium text-gray-500 mb-2 uppercase tracking-wide">相关业务对象</h4>
          <div className="flex flex-wrap gap-2">
            {['采购订单 (PO)', '采购流程', '供应商管理'].map(obj => (
              <span key={obj} className="bg-blue-50 text-blue-700 text-[12px] px-3 py-1.5 rounded-lg">{obj}</span>
            ))}
          </div>
        </div>
        {/* Operation history */}
        <div>
          <h4 className="text-[12px] font-medium text-gray-500 mb-2 uppercase tracking-wide">操作记录</h4>
          <div className="space-y-2 text-[12px] text-gray-500">
            <div className="flex items-center gap-2"><Clock size={12} /> 09:32 Xino 自动识别{isConflict ? '为冲突字段' : ''}</div>
            <div className="flex items-center gap-2"><Eye size={12} /> 09:35 李桐 查看并开始处理</div>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3 flex-shrink-0">
        <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-[13px] font-semibold py-2 rounded-lg transition-colors">修改</button>
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold py-2 rounded-lg transition-colors">确认通过</button>
      </div>
    </div>
  );
}

// ==================== Issue Detail Panel ====================

function IssueDetailPanel({ data, onBack }: { data: IssueDetail; onBack: () => void }) {
  const isHigh = data.severity === 'high';
  const isMedium = data.severity === 'medium';

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-2 duration-200">
      <div className="px-4 py-4 border-b border-gray-200 flex items-center gap-3 flex-shrink-0">
        <button onClick={onBack} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <h3 className="text-[15px] font-semibold text-gray-900">风险详情</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Title + severity badge */}
        <div className="flex items-start gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", isHigh ? "bg-red-100" : isMedium ? "bg-amber-100" : "bg-blue-100")}>
            <ShieldAlert size={20} className={isHigh ? "text-red-600" : isMedium ? "text-amber-600" : "text-blue-600"} />
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-gray-900">{data.title}</h4>
            <span className={cn("inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[11px] font-medium",
              isHigh ? "bg-red-50 text-red-700" : isMedium ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"
            )}>
              {isHigh ? '高风险' : isMedium ? '中风险' : '低风险'}
            </span>
          </div>
        </div>

        {/* Description */}
        {data.description && (
          <div>
            <h4 className="text-[12px] font-medium text-gray-500 mb-2 uppercase tracking-wide">问题描述</h4>
            <p className="text-[13px] text-gray-700 leading-relaxed bg-gray-50 border border-gray-200 rounded-lg p-3">
              {data.description}
            </p>
          </div>
        )}

        {/* Impact */}
        <div>
          <h4 className="text-[12px] font-medium text-gray-500 mb-2 uppercase tracking-wide">影响范围</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-600">受影响表数</span>
              <span className="font-semibold text-gray-900">12 张</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-600">受影响字段数</span>
              <span className="font-semibold text-gray-900">{isHigh ? '41' : '37'} 个</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-600">影响下游任务</span>
              <span className="font-semibold text-amber-600">业务对象生成、血缘分析</span>
            </div>
          </div>
        </div>

        {/* Suggested action */}
        <div>
          <h4 className="text-[12px] font-medium text-gray-500 mb-2 uppercase tracking-wide">建议操作</h4>
          <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3">
            <p className="text-[13px] text-gray-700">
              {isHigh
                ? '建议立即处理，统一字符集编码后再继续后续阶段的执行。'
                : '建议在质量校验阶段前完成确认，避免影响最终交付物质量。'}
            </p>
          </div>
        </div>

        {/* Operation history */}
        <div>
          <h4 className="text-[12px] font-medium text-gray-500 mb-2 uppercase tracking-wide">操作记录</h4>
          <div className="space-y-2 text-[12px] text-gray-500">
            <div className="flex items-center gap-2"><Clock size={12} /> 09:40 Xino 自动检测到该风险</div>
            <div className="flex items-center gap-2"><Eye size={12} /> 09:42 李桐 查看风险详情</div>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3 flex-shrink-0">
        <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-[13px] font-semibold py-2 rounded-lg transition-colors">忽略</button>
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold py-2 rounded-lg transition-colors">立即处理</button>
      </div>
    </div>
  );
}

// ==================== Deliverable Detail Panel ====================

function DeliverableDetailPanel({ data, onBack }: { data: DeliverableDetail; onBack: () => void }) {
  const iconConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    PDF: { bg: 'bg-blue-50', text: 'text-blue-600', icon: <FileText size={24} /> },
    XLSX: { bg: 'bg-green-50', text: 'text-green-600', icon: <Table size={24} /> },
    CSV: { bg: 'bg-green-50', text: 'text-green-600', icon: <Table size={24} /> },
    ZIP: { bg: 'bg-amber-50', text: 'text-amber-600', icon: <FileText size={24} /> },
  };
  const config = iconConfig[data.type] || iconConfig.PDF;

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-2 duration-200">
      <div className="px-4 py-4 border-b border-gray-200 flex items-center gap-3 flex-shrink-0">
        <button onClick={onBack} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <h3 className="text-[15px] font-semibold text-gray-900">交付物详情</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* File header */}
        <div className="flex items-center gap-4">
          <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0", config.bg, config.text)}>
            {config.icon}
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-gray-900">{data.name}</h4>
            <span className="text-[12px] text-gray-500">{data.type} 文件</span>
          </div>
        </div>

        {/* Description */}
        {data.description && (
          <div>
            <h4 className="text-[12px] font-medium text-gray-500 mb-2 uppercase tracking-wide">用途说明</h4>
            <p className="text-[13px] text-gray-700 leading-relaxed">{data.description}</p>
          </div>
        )}

        {/* File metadata */}
        <div>
          <h4 className="text-[12px] font-medium text-gray-500 mb-2 uppercase tracking-wide">文件信息</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-600">生成者</span>
              <span className="font-medium text-gray-900">Xino</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-600">生成时间</span>
              <span className="font-medium text-gray-900">今天 09:49</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-600">关联阶段</span>
              <span className="font-medium text-gray-900">字段语义理解</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3 flex-shrink-0">
        <button className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-[13px] font-semibold py-2 rounded-lg transition-colors">
          <Eye size={14} /> 预览
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold py-2 rounded-lg transition-colors">
          <Download size={14} /> 下载
        </button>
      </div>
    </div>
  );
}

// ==================== Sidebar Sub-components ====================

function TaskSidePanel({ activeTab, setActiveTab, isPlanExpanded, setIsPlanExpanded, onIssueClick, onDeliverableClick }: {
  activeTab: 'plan' | 'detail';
  setActiveTab: (t: 'plan' | 'detail') => void;
  isPlanExpanded: boolean;
  setIsPlanExpanded: (v: boolean) => void;
  onIssueClick: (issue: { id: string; title: string; severity: string }) => void;
  onDeliverableClick: (deliv: { id: string; name: string; type: string; description?: string }) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-[#E5E7EB] flex-shrink-0">
        <button
          onClick={() => setActiveTab('plan')}
          className={cn("flex-1 py-3.5 text-[14px] transition-colors", activeTab === 'plan' ? "font-semibold text-blue-600 border-b-2 border-blue-600" : "font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent")}
        >任务计划</button>
        <button
          onClick={() => setActiveTab('detail')}
          className={cn("flex-1 py-3.5 text-[14px] transition-colors", activeTab === 'detail' ? "font-semibold text-blue-600 border-b-2 border-blue-600" : "font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent")}
        >任务详情</button>
      </div>
      <div className="flex-1 overflow-y-auto w-full">
        <div className="p-5 space-y-6">
          {activeTab === 'plan' ? (
            <PlanTab isPlanExpanded={isPlanExpanded} setIsPlanExpanded={setIsPlanExpanded} />
          ) : (
            <DetailTab onIssueClick={onIssueClick} onDeliverableClick={onDeliverableClick} />
          )}
          <div className="h-4"></div>
        </div>
      </div>
    </div>
  );
}

function PlanTab({ isPlanExpanded, setIsPlanExpanded }: {
  isPlanExpanded: boolean;
  setIsPlanExpanded: (v: boolean) => void;
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2 cursor-pointer group" onClick={() => setIsPlanExpanded(!isPlanExpanded)}>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-gray-900 tracking-wide uppercase group-hover:text-blue-600 transition-colors">整体进度</span>
            <ChevronDown size={14} className={cn("text-gray-400 group-hover:text-blue-500 transition-transform duration-200", isPlanExpanded && "rotate-180")} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-gray-500">已完成 {completedStages.length} / {task.stages.length} 个阶段</span>
            <span className="text-[14px] font-bold text-blue-600">{task.progress}%</span>
          </div>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${task.progress}%` }}></div>
        </div>
        <StageTimeline />
      </div>
    </div>
  );
}

function DetailTab({ onIssueClick, onDeliverableClick }: {
  onIssueClick: (issue: { id: string; title: string; severity: string }) => void;
  onDeliverableClick: (deliv: { id: string; name: string; type: string; description?: string }) => void;
}) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Section 1: Context / Data Source */}
      <div>
        <h4 className="text-[14px] font-semibold text-gray-900 mb-3">上下文 / 数据源</h4>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-gray-900 font-semibold text-[13px]">
              <Database size={14} className="text-gray-500" />
              {task.dataSource.name}
            </div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] bg-green-50 text-green-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              已连接
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-gray-500">数据源类型</span>
              <span className="text-gray-700 font-medium">{task.dataSource.type}</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-gray-500">主机</span>
              <span className="text-gray-700 font-medium">{task.dataSource.host}</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-gray-500">扫描范围</span>
              <span className="text-gray-700 font-medium">{task.dataSource.database}</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-gray-500">权限状态</span>
              <span className="text-green-600 font-medium">具备只读权限</span>
            </div>
          </div>
          <div className="flex gap-4 text-[12px] pt-3 mt-3 border-t border-gray-200">
            <div>已选表：<span className="font-semibold text-gray-900">{task.dataSource.selectedTableCount.toLocaleString()}</span></div>
            <div>扫描字段：<span className="font-semibold text-gray-900">{task.dataSource.scannedFieldCount.toLocaleString()}</span></div>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-[#E5E7EB]"></div>

      {/* Section 2: Risks */}
      <div>
        <h4 className="flex items-center gap-2 text-[14px] font-semibold text-gray-900 mb-3">
          <AlertCircle size={16} className="text-red-500" />
          风险与待处理
        </h4>
        <div className="space-y-2">
          {sidePanel.risks.map((risk) => {
            const isHigh = risk.level === 'HIGH';
            return (
              <div
                key={risk.id}
                onClick={() => onIssueClick({ id: risk.id, title: risk.title, severity: isHigh ? 'high' : 'medium' })}
                className={cn("border rounded-lg p-3 flex justify-between items-center group transition-colors cursor-pointer", isHigh ? "bg-red-50 border-red-100 hover:bg-red-100" : "bg-amber-50 border-amber-100 hover:bg-amber-100")}
              >
                <div className="flex items-center gap-2">
                  <div className={cn("w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-[13px] shadow-sm", isHigh ? "text-red-600" : "text-amber-600")}>
                    {isHigh ? '41' : '37'}
                  </div>
                  <div className={cn("text-[13px] font-semibold", isHigh ? "text-red-900" : "text-amber-900")}>{risk.title}</div>
                </div>
                <span className={cn("text-[12px] font-medium opacity-0 group-hover:opacity-100 transition-opacity", isHigh ? "text-red-600" : "text-amber-600")}>{risk.actionLabel} &rarr;</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full h-px bg-[#E5E7EB]"></div>

      {/* Section 3: Deliverables */}
      <div>
        <h4 className="text-[14px] font-semibold text-gray-900 mb-3">最新交付物</h4>
        <div className="space-y-2">
          {sidePanel.deliverables.map((item) => (
            <div
              key={item.id}
              onClick={() => onDeliverableClick({ id: item.id, name: item.name, type: item.type, description: item.description })}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-colors"
            >
              <div className="flex items-start gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 mt-0.5">
                  <FileText size={16} />
                </div>
                <div>
                  <div className="text-[13px] font-medium text-gray-900 truncate">{item.name}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{item.description}</div>
                </div>
              </div>
              <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-white text-gray-400 hover:text-blue-600 transition-colors">
                <Download size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 侧边栏阶段时间线 */
function StageTimeline() {
  return (
    <div className="relative animate-in slide-in-from-top-2 duration-300">
      <div className="absolute left-[9px] top-3 bottom-4 w-px bg-gray-200"></div>
      <ul className="space-y-4 relative">
        {task.stages.map((stage) => {
          const status = stage.status === 'COMPLETED' ? 'done' : stage.status === 'RUNNING' ? 'active' : 'pending';
          return (
            <li key={stage.id} className="flex gap-3.5 relative">
              {status === 'done' && (
                <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white flex-shrink-0 mt-0.5 z-10 shadow-sm">
                  <CheckCircle2 size={12} strokeWidth={3} />
                </div>
              )}
              {status === 'active' && (
                <div className="w-5 h-5 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5 z-10">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
              )}
              {status === 'pending' && (
                <div className="w-5 h-5 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5 z-10"></div>
              )}
              <div>
                <div className={cn("text-[13px] font-medium", status === 'done' ? "text-gray-700" : status === 'active' ? "text-blue-600" : "text-gray-400")}>
                  {stage.name}
                </div>
                {stage.summary && status !== 'pending' && (
                  <div className="text-[12px] text-gray-500 mt-0.5">{stage.summary}</div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
