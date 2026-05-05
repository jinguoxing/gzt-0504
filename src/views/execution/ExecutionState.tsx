import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Share2, MoreHorizontal, Sparkles, CheckCircle2, ChevronRight,
  ChevronDown, Download, Send, FileText, Database, AlertCircle,
  AlertTriangle, RefreshCw, ArrowLeft, Network, Maximize2,
  Table, PanelRight, HelpCircle,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import type { XinoMessage, ResultBlock } from '@/types';
import ResultBlockRenderer from '@/components/result-blocks/ResultBlockRenderer';
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

// ==================== Sub-components ====================

function XinoBlockHeader({ icon, iconBg, time, tag }: {
  icon: React.ReactNode;
  iconBg: string;
  time: string;
  tag?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <div className={cn("w-6 h-6 rounded flex items-center justify-center text-white flex-shrink-0", iconBg)}>
        {icon}
      </div>
      <span className="font-semibold text-[13px] text-gray-900">Xino</span>
      <span className="text-[12px] text-gray-400">{time}</span>
      {tag && <span className="text-[11px] text-gray-400 ml-1">{tag}</span>}
    </div>
  );
}

/** 单条 Xino 消息块 */
function XinoMessageBlock({ msg }: { msg: XinoMessage }) {
  const { icon, iconBg } = getXinoIconConfig(msg);
  const time = fmtTime(msg.createdAt);
  const tag = msg.stageName ? `阶段 ${msg.stageName}` : undefined;
  const hasBlocks = msg.resultBlocks && msg.resultBlocks.length > 0;
  const hasSingleBlock = msg.resultBlocks?.length === 1;
  const blockStatus = hasSingleBlock ? msg.resultBlocks![0].status : undefined;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-6">
      <XinoBlockHeader icon={icon} iconBg={iconBg} time={time} tag={tag} />

      {/* Text Summary Layer */}
      <p className="text-[14px] text-gray-700 leading-relaxed mb-5">
        {msg.text}
      </p>

      {/* Structured Result Layer */}
      {hasBlocks && (
        <div className="border-t border-gray-100 pt-5 space-y-5">
          {msg.resultBlocks!.map((block) => (
            <div key={block.id}><ResultBlockRenderer block={block as ResultBlock} /></div>
          ))}
        </div>
      )}

      {/* Block Status */}
      {blockStatus && blockStatus !== 'waiting_confirm' && (
        <div className="mt-4">
          {getBlockStatusBadge(blockStatus)}
        </div>
      )}
    </div>
  );
}

/** 用户消息 */
function UserMessageBlock({ msg }: { msg: XinoMessage }) {
  const time = fmtTime(msg.createdAt);
  return (
    <div className="flex justify-end">
      <div className="border-l-2 border-blue-200 pl-4 py-1 max-w-md">
        <div className="flex items-center gap-2 mb-1 justify-end">
          <span className="text-[12px] text-gray-400">{time}</span>
          <span className="font-medium text-[13px] text-gray-700">{msg.authorName}</span>
        </div>
        <p className="text-[14px] text-gray-700 leading-relaxed text-right">{msg.text}</p>
      </div>
    </div>
  );
}

// ==================== Main Component ====================

export default function ExecutionState() {
  const [searchParams, setSearchParams] = useSearchParams();

  // F-02: URL 可恢复状态
  const panelParam = searchParams.get('panel') as 'plan' | 'detail' | null;
  const fieldIdParam = searchParams.get('fieldId');

  const [activeTab, setActiveTab] = useState<'plan' | 'detail'>(panelParam || 'plan');
  const [selectedRow, setSelectedRow] = useState<any>(
    fieldIdParam ? { field: fieldIdParam, semantic: '', confidence: '0', source: '' } : null
  );
  const [isPlanExpanded, setIsPlanExpanded] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sync tab changes to URL
  const handleTabChange = (tab: 'plan' | 'detail') => {
    setActiveTab(tab);
    setSearchParams(prev => {
      prev.set('panel', tab);
      if (prev.has('fieldId')) prev.delete('fieldId');
      return prev;
    }, { replace: true });
  };

  // Sync field selection to URL
  const handleFieldSelect = (row: any) => {
    setSelectedRow(row);
    setSearchParams(prev => {
      prev.set('fieldId', row.field);
      return prev;
    }, { replace: true });
  };

  const handleFieldBack = () => {
    setSelectedRow(null);
    setSearchParams(prev => {
      prev.delete('fieldId');
      return prev;
    }, { replace: true });
  };

  return (
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
              <span>创建人：{task.creator.name}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>当前阶段：<span className="font-medium text-gray-700">{currentStage?.index} / {task.stages.length}</span></span>
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
                if (!next) setSearchParams(prev => { prev.delete('panel'); prev.delete('fieldId'); return prev; }, { replace: true });
              }}
              className={cn("w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg transition-colors shadow-sm", isSidebarOpen ? "text-blue-600 bg-blue-50 border-blue-200" : "text-gray-600 hover:bg-gray-50")}
            >
              <PanelRight size={16} />
            </button>
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto w-full flex justify-center py-8">
          <div className="w-full max-w-[780px] px-6 space-y-8">

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

            {/* P-09: Task Focus Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-[0_8px_30px_rgba(37,99,235,0.2)] text-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-[11px] font-bold text-blue-200 uppercase tracking-widest">当前任务焦点</div>
                <div className="flex-1"></div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/15 rounded-md text-[12px] font-medium backdrop-blur-sm">
                  阶段 {currentStage?.index} / {task.stages.length}
                </div>
              </div>
              <div className="flex items-end justify-between mb-4">
                <h3 className="text-[22px] font-bold text-white leading-tight">{currentStage?.name}</h3>
                <div className="text-[36px] font-bold text-white leading-none tracking-tight">{task.progress}%</div>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-5">
                <div className="h-full bg-white rounded-full transition-all duration-500 relative" style={{ width: `${task.progress}%` }}>
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
              </div>
              <p className="text-[14px] text-blue-100 leading-relaxed mb-5">{currentStage?.summary}</p>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-white hover:bg-blue-50 text-blue-700 rounded-lg text-[13px] font-semibold transition-colors shadow-sm">
                  查看冲突字段
                </button>
                <button className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-lg text-[13px] font-semibold transition-colors border border-white/20 backdrop-blur-sm">
                  批量确认高置信字段
                </button>
                <button className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-lg text-[13px] font-semibold transition-colors border border-white/20 backdrop-blur-sm">
                  继续生成对象模型
                </button>
              </div>
            </div>

            {/* ===================== Data-driven Conversation Stream ===================== */}
            {conversation.map((msg) => (
              <div key={msg.id}>
                {msg.role === 'user'
                  ? <UserMessageBlock msg={msg} />
                  : <XinoMessageBlock msg={msg} />}
              </div>
            ))}

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
          {selectedRow ? (
            <FieldDetailPanel selectedRow={selectedRow} onBack={handleFieldBack} />
          ) : (
            <TaskSidePanel
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              isPlanExpanded={isPlanExpanded}
              setIsPlanExpanded={setIsPlanExpanded}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ==================== Sidebar Sub-components ====================

function FieldDetailPanel({ selectedRow, onBack }: { selectedRow: any; onBack: () => void }) {
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
          <div className="text-[18px] font-bold text-gray-900 font-mono tracking-tight">{selectedRow.field}</div>
        </div>
        <div>
          <h4 className="text-[12px] font-medium text-gray-500 mb-2 uppercase tracking-wide">推断结果</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-600">业务语义</span>
              <span className="font-semibold text-gray-900">{selectedRow.semantic}</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-600">置信度</span>
              <span className="font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                {(parseFloat(selectedRow.confidence) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
        <div className="w-full h-px bg-gray-100"></div>
        <div>
          <h4 className="text-[12px] font-medium text-gray-500 mb-2 uppercase tracking-wide">推断依据</h4>
          <p className="text-[13px] text-gray-700 bg-blue-50/50 border border-blue-100 rounded-lg p-3 leading-relaxed">
            通过 <span className="font-medium">[{selectedRow.source}]</span> 识别。该字段命名符合常规约束，并且在业务系统中被高频作为核心状态标示符。
          </p>
        </div>
      </div>
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3 flex-shrink-0">
        <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-[13px] font-semibold py-2 rounded-lg transition-colors">修改</button>
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold py-2 rounded-lg transition-colors">确认通过</button>
      </div>
    </div>
  );
}

function TaskSidePanel({ activeTab, setActiveTab, isPlanExpanded, setIsPlanExpanded }: {
  activeTab: 'plan' | 'detail';
  setActiveTab: (t: 'plan' | 'detail') => void;
  isPlanExpanded: boolean;
  setIsPlanExpanded: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* P-11: Status context bar — 根据任务状态显示不同上下文 */}
      <div className="px-4 py-3 bg-blue-50/60 border-b border-blue-100 flex items-center gap-2 flex-shrink-0">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
        <span className="text-[12px] font-medium text-blue-700">
          执行态 · 阶段 {currentStage?.index}/{task.stages.length} · {currentStage?.name}
        </span>
        <span className="text-[11px] text-blue-500 ml-auto">进度 {task.progress}%</span>
      </div>
      <div className="flex border-b border-[#E5E7EB] flex-shrink-0">
        <button
          onClick={() => setActiveTab('plan')}
          className={cn("flex-1 py-4 text-[14px] transition-colors", activeTab === 'plan' ? "font-semibold text-blue-600 border-b-2 border-blue-600" : "font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent")}
        >任务计划</button>
        <button
          onClick={() => setActiveTab('detail')}
          className={cn("flex-1 py-4 text-[14px] transition-colors", activeTab === 'detail' ? "font-semibold text-blue-600 border-b-2 border-blue-600" : "font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent")}
        >任务详情</button>
      </div>
      <div className="flex-1 overflow-y-auto w-full">
        <div className="p-6 space-y-8">
          {activeTab === 'plan' ? (
            <PlanTab isPlanExpanded={isPlanExpanded} setIsPlanExpanded={setIsPlanExpanded} />
          ) : (
            <DetailTab />
          )}
          <div className="h-4"></div>
        </div>
      </div>
    </div>
  );
}

function PlanTab({ isPlanExpanded, setIsPlanExpanded }: { isPlanExpanded: boolean; setIsPlanExpanded: (v: boolean) => void }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2 cursor-pointer group" onClick={() => setIsPlanExpanded(!isPlanExpanded)}>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-gray-900 tracking-wide uppercase group-hover:text-blue-600 transition-colors">整体进度</span>
            <ChevronDown size={14} className={cn("text-gray-400 group-hover:text-blue-500 transition-transform duration-200", isPlanExpanded && "rotate-180")} />
          </div>
          <span className="text-[14px] font-bold text-blue-600">{task.progress}%</span>
        </div>
        <div className={cn("w-full h-2 bg-gray-100 rounded-full overflow-hidden transition-all", isPlanExpanded && "mb-6")}>
          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${task.progress}%` }}></div>
        </div>
        {isPlanExpanded && <StageTimeline />}
      </div>

      <div className="w-full h-px bg-[#E5E7EB]"></div>

      {/* Data Source */}
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

      {/* Risks */}
      <div>
        <h4 className="flex items-center gap-2 text-[14px] font-semibold text-gray-900 mb-3">
          <AlertCircle size={16} className="text-red-500" />
          风险与待处理
        </h4>
        <div className="space-y-2">
          {sidePanel.risks.map((risk) => {
            const isHigh = risk.level === 'HIGH';
            return (
              <div key={risk.id} className={cn("border rounded-lg p-3 flex justify-between items-center group transition-colors cursor-pointer", isHigh ? "bg-red-50 border-red-100 hover:bg-red-100" : "bg-amber-50 border-amber-100 hover:bg-amber-100")}>
                <div className="flex items-center gap-2">
                  <div className={cn("w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-[13px] shadow-sm", isHigh ? "text-red-600" : "text-amber-600")}>
                    {isHigh ? '41' : '37'}
                  </div>
                  <div>
                    <div className={cn("text-[13px] font-semibold", isHigh ? "text-red-900" : "text-amber-900")}>{risk.title}</div>
                  </div>
                </div>
                <span className={cn("text-[12px] font-medium opacity-0 group-hover:opacity-100 transition-opacity", isHigh ? "text-red-600" : "text-amber-600")}>{risk.actionLabel} &rarr;</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deliverables */}
      <div>
        <h4 className="text-[14px] font-semibold text-gray-900 mb-3">最新交付物</h4>
        <div className="space-y-2">
          {sidePanel.deliverables.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-colors">
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

function DetailTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h4 className="text-[14px] font-semibold text-gray-900 mb-3">基本信息</h4>
        <div className="space-y-3">
          {[
            { label: '任务 ID', value: task.id },
            { label: '创建人', value: task.creator.name },
            { label: '创建时间', value: '今天 09:30' },
          ].map(row => (
            <div key={row.label} className="flex justify-between items-center text-[13px]">
              <span className="text-gray-500">{row.label}</span>
              <span className="font-medium text-gray-900">{row.value}</span>
            </div>
          ))}
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-gray-500">当前状态</span>
            <div className="flex items-center gap-1.5 font-medium text-blue-600">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
              执行中 (阶段 {currentStage?.index}/{task.stages.length})
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-[#E5E7EB]"></div>

      <div>
        <h4 className="text-[14px] font-semibold text-gray-900 mb-3">实施范围</h4>
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2">
          <div className="text-[13px] text-gray-700 flex">
            <span className="text-gray-500 w-[60px] flex-shrink-0">连接：</span>
            <span className="font-medium">{task.dataSource.name}<br /><span className="text-[12px] font-normal text-gray-500">{task.dataSource.type} ({task.dataSource.host})</span></span>
          </div>
          <div className="text-[13px] text-gray-700 flex">
            <span className="text-gray-500 w-[60px] flex-shrink-0">Schema：</span>
            <span className="font-medium">{task.dataSource.database}</span>
          </div>
          <div className="text-[13px] text-gray-700 flex">
            <span className="text-gray-500 w-[60px] flex-shrink-0">排除规则：</span>
            <span className="font-medium">backup_*, temp_*</span>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-[#E5E7EB]"></div>

      <div>
        <h4 className="text-[14px] font-semibold text-gray-900 mb-3">运行配置</h4>
        <div className="space-y-3">
          {[
            { label: '执行并行度', value: '10 线程' },
            { label: '自动确认阈值', value: '置信度 > 0.95' },
            { label: '异常中断策略', value: '超过 50 个冲突时暂停' },
            { label: '底层模型支撑', value: 'Gemini 3.1 Pro + 业务词典向量库' },
          ].map(row => (
            <div key={row.label} className="flex justify-between items-center text-[13px]">
              <span className="text-gray-500">{row.label}</span>
              <span className="font-medium text-gray-900">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-[#E5E7EB]"></div>

      <div>
        <h4 className="text-[14px] font-semibold text-gray-900 mb-3">参考信息源</h4>
        <div className="space-y-2">
          {task.contextResources.map((f) => (
            <div key={f.id} className="flex items-center gap-2 text-[13px] text-gray-700">
              <FileText size={14} className="text-gray-400" /> {f.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StageTimeline() {
  return (
    <div className="relative animate-in slide-in-from-top-2 duration-300">
      <div className="absolute left-[9px] top-4 bottom-8 w-px bg-gray-200"></div>
      <ul className="space-y-5 relative">
        {task.stages.map((stage) => {
          const status = stage.status === 'COMPLETED' ? 'done' : stage.status === 'RUNNING' ? 'active' : 'pending';
          return (
            <li key={stage.id} className="flex gap-4 relative">
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
                <div className={cn("text-[14px] font-semibold", status === 'done' ? "text-gray-900" : status === 'active' ? "text-blue-600" : "text-gray-400")}>
                  {stage.index}. {stage.name}
                </div>
                <div className="text-[12px] text-gray-500 mt-1">
                  {status === 'done' ? '已完成' : status === 'active' ? '执行中' : '待开始'}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
