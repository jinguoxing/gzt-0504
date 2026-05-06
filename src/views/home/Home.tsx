import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Paperclip, AtSign, Mic, History, Send, ChevronRight, Database, BarChart3,
  Sparkles, User, X, FileText, ChevronDown, Check, Clock, Settings2, RotateCw, Loader2,
  Plus, Trash2, Save, MessageCircle,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import mockData from '@/mock/workbench-home.json';
import draftMockData from '@/mock/task-draft.json';
import { formatTime } from '@/mock/helpers';
import { dataQaPath } from '@/config/routeConfig';

/** Editable section keys for inline editing */
type EditableSection = 'understanding' | 'dataSource' | 'scanScope' | 'resources' | 'deliverables';

type WorkbenchState = 'empty' | 'parsing' | 'draft';

/** A conversation message in the draft state */
interface DraftMessage {
  id: string;
  role: 'user' | 'xino';
  content: string;
  createdAt: string;
  changeSummary?: {
    title: string;
    changes: { field: string; from: string; to: string }[];
  };
}

/** Keywords mapped to mock draft changes */
const KEYWORD_CHANGES: {
  keywords: string[];
  changeSummary: { title: string; changes: { field: string; from: string; to: string }[] };
  drawerHighlight: string;
}[] = [
  {
    keywords: ['schema', 'schema', '采购', '范围', '扫描'],
    changeSummary: {
      title: '已更新任务草稿',
      changes: [
        { field: '扫描范围', from: '全库', to: 'ods_scm, dwd_scm' },
        { field: '预计扫描表数量', from: '286', to: '142' },
        { field: '预计耗时', from: '2.5 小时', to: '1.4 小时' },
        { field: '风险等级', from: '中', to: '低' },
      ],
    },
    drawerHighlight: 'scanScope',
  },
  {
    keywords: ['excel', 'xlsx', '明细', '文件'],
    changeSummary: {
      title: '已更新上下文资源',
      changes: [
        { field: '上下文资源', from: '3 个文件', to: '4 个文件' },
        { field: '新增文件', from: '—', to: '采购明细.xlsx' },
      ],
    },
    drawerHighlight: 'resources',
  },
  {
    keywords: ['交付', '报告', '交付物'],
    changeSummary: {
      title: '已更新交付物配置',
      changes: [
        { field: '交付物', from: '6 项', to: '7 项' },
        { field: '新增交付物', from: '—', to: '字段质量报告' },
      ],
    },
    drawerHighlight: 'deliverables',
  },
];

function matchChange(input: string) {
  const lower = input.toLowerCase();
  for (const entry of KEYWORD_CHANGES) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return entry;
    }
  }
  // Default generic response
  return {
    changeSummary: {
      title: '已记录你的要求',
      changes: [{ field: '备注', from: '—', to: input.slice(0, 40) }],
    },
    drawerHighlight: '',
  };
}

const SCENARIO_ICON_MAP: Record<string, React.ElementType> = {
  Database,
  BarChart3,
};

const SCENARIOS = (mockData as any).scenarios.map((s: any) => ({
  ...s,
  icon: SCENARIO_ICON_MAP[s.icon] || Database,
  path: s.key === 'data-query' ? dataQaPath('dqa_001') : undefined,
}));

const WEAK_ACTION_ICONS: Record<string, React.ElementType> = {
  '附件': Paperclip,
  '@ 资源': AtSign,
  '语音': Mic,
  '历史': History,
};

const DRAFT_SUGGESTED_CHIPS = [
  '只扫描采购相关 Schema',
  '增加 Excel 明细文件',
  '增加字段质量报告',
  '调整并行度为 10',
];

export default function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Draft state
  const [messages, setMessages] = useState<DraftMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isXinoTyping, setIsXinoTyping] = useState(false);
  const [highlightedKey, setHighlightedKey] = useState('');
  const [draftScopeChanged, setDraftScopeChanged] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inline editing state
  const [editingKey, setEditingKey] = useState<EditableSection | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  // Intent detection state
  const [isDetecting, setIsDetecting] = useState(false);

  // Mutable draft state — initialized from mock, updated by inline edits
  const [draftState, setDraftState] = useState({
    name: draftMockData.draft.name,
    objective: draftMockData.draft.objective,
    dataSourceId: draftMockData.draft.dataSource.id,
    scanScopeSchemas: [...draftMockData.draft.scanScope.schemas],
    isFullScan: false,
    contextResources: [...draftMockData.draft.contextResources],
    deliverableRequirements: [...draftMockData.draft.deliverableRequirements],
  });

  // Edit buffer — holds temp values while editing
  const [editBuffer, setEditBuffer] = useState<{
    name: string;
    objective: string;
    dataSourceId: string;
    scanScopeSchemas: string[];
    isFullScan: boolean;
    contextResources: typeof draftMockData.draft.contextResources;
    deliverableRequirements: string[];
  } | null>(null);

  /** Resolve data source object by id */
  const resolveDataSource = (id: string) =>
    draftMockData.availableDataSources.find(ds => ds.id === id) || draftMockData.availableDataSources[0];

  const draftId = searchParams.get('draftId');
  const workbenchState: WorkbenchState = draftId ? 'draft' : 'empty';

  // Initialize messages from mock when entering draft state
  useEffect(() => {
    if (workbenchState === 'draft' && messages.length === 0) {
      const conv = draftMockData.conversation;
      setMessages([
        {
          id: conv[0].id,
          role: 'user',
          content: conv[0].content,
          createdAt: conv[0].createdAt,
        },
        {
          id: conv[1].id,
          role: 'xino',
          content: conv[1].content,
          createdAt: conv[1].createdAt,
        },
      ]);
    }
  }, [workbenchState]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isXinoTyping]);

  // Clear highlight after 3 seconds
  useEffect(() => {
    if (highlightedKey) {
      const timer = setTimeout(() => setHighlightedKey(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedKey]);

  const handleGenerateDraft = () => {
    setSearchParams({ draftId: 'draft-supply-chain-loop' });
  };

  /** Simple keyword-based intent detection (mock) */
  const detectIntent = (text: string): 'data_qa' | 'governance_task' | 'unknown' => {
    const qaKeywords = ['多少', '趋势', '排名', '同比', '环比', '拆解', '为什么', '上涨', '下降', '怎么算', '在哪里', '最高', '最低', '前 10', '前10', 'Top', '明细', '导出'];
    if (qaKeywords.some(k => text.includes(k))) return 'data_qa';
    const govKeywords = ['治理', '扫描', '建模', '语义', 'Schema', '字段'];
    if (govKeywords.some(k => text.includes(k))) return 'governance_task';
    // Default: treat as data_qa for most natural language questions
    return 'data_qa';
  };

  const handleSend = () => {
    if (workbenchState === 'empty') {
      const text = inputValue.trim();
      if (!text) return;

      const intent = detectIntent(text);
      if (intent === 'data_qa') {
        // Create a new session with the user's real question
        const sessionId = `dqa_${Date.now()}`;
        sessionStorage.setItem(
          `data-query-session:${sessionId}`,
          JSON.stringify({
            sessionId,
            originalQuestion: text,
            intent: 'data_qa',
            createdAt: new Date().toISOString(),
          })
        );
        setIsDetecting(true);
        setTimeout(() => {
          navigate(dataQaPath(sessionId, { q: encodeURIComponent(text) }));
        }, 1200);
        return;
      }
      // Governance or unknown → open draft drawer
      handleGenerateDraft();
      return;
    }
    // Draft mode: handle conversation
    const text = inputValue.trim();
    if (!text || isXinoTyping) return;

    // Add user message
    const userMsg: DraftMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulate Xino thinking → then respond
    setIsXinoTyping(true);
    setTimeout(() => {
      const matched = matchChange(text);
      const xinoMsg: DraftMessage = {
        id: `msg-xino-${Date.now()}`,
        role: 'xino',
        content: matched.changeSummary.changes.length > 0 && matched.drawerHighlight
          ? `已更新任务草稿。${matched.changeSummary.changes.map(c => `${c.field}：${c.from} → ${c.to}`).join('，')}。`
          : `已记录你的要求：「${text.slice(0, 50)}」，我会在任务执行时考虑这一点。`,
        createdAt: new Date().toISOString(),
        changeSummary: matched.drawerHighlight ? matched.changeSummary : undefined,
      };
      setMessages(prev => [...prev, xinoMsg]);
      setIsXinoTyping(false);

      // Highlight the drawer section
      if (matched.drawerHighlight) {
        setHighlightedKey(matched.drawerHighlight);
        // Track if scope changed (affects displayed values)
        if (matched.drawerHighlight === 'scanScope') {
          setDraftScopeChanged(true);
        }
      }
    }, 800 + Math.random() * 600);
  };

  const handleChipClick = (chip: string) => {
    setInputValue('');
    // Directly send as if user typed it
    const userMsg: DraftMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: chip,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);

    setIsXinoTyping(true);
    setTimeout(() => {
      const matched = matchChange(chip);
      const xinoMsg: DraftMessage = {
        id: `msg-xino-${Date.now()}`,
        role: 'xino',
        content: matched.changeSummary.changes.length > 0 && matched.drawerHighlight
          ? `已更新任务草稿。${matched.changeSummary.changes.map(c => `${c.field}：${c.from} → ${c.to}`).join('，')}。`
          : `已记录你的要求：「${chip}」。`,
        createdAt: new Date().toISOString(),
        changeSummary: matched.drawerHighlight ? matched.changeSummary : undefined,
      };
      setMessages(prev => [...prev, xinoMsg]);
      setIsXinoTyping(false);

      if (matched.drawerHighlight) {
        setHighlightedKey(matched.drawerHighlight);
        if (matched.drawerHighlight === 'scanScope') {
          setDraftScopeChanged(true);
        }
      }
    }, 800 + Math.random() * 600);
  };

  const handleScenarioClick = (scenario: any) => {
    if (scenario.path) {
      navigate(scenario.path);
    } else if (scenario.draftId) {
      setSearchParams({ draftId: scenario.draftId });
    }
  };

  const handleExecute = () => {
    navigate('/tasks/task-supply-chain-loop');
  };

  /** Open inline editor for a section */
  const handleStartEdit = (key: EditableSection) => {
    setEditBuffer({
      name: draftState.name,
      objective: draftState.objective,
      dataSourceId: draftState.dataSourceId,
      scanScopeSchemas: [...draftState.scanScopeSchemas],
      isFullScan: draftState.isFullScan,
      contextResources: [...draftState.contextResources],
      deliverableRequirements: [...draftState.deliverableRequirements],
    });
    setEditingKey(key);
  };

  /** Save inline edit: apply changes, close editor, highlight, append Xino message */
  const handleSaveEdit = (sectionKey: EditableSection, changeTitle: string, changes: { field: string; from: string; to: string }[]) => {
    if (!editBuffer) return;

    // Apply changes to draftState
    setDraftState(prev => ({
      ...prev,
      name: editBuffer.name,
      objective: editBuffer.objective,
      dataSourceId: editBuffer.dataSourceId,
      scanScopeSchemas: editBuffer.scanScopeSchemas,
      isFullScan: editBuffer.isFullScan,
      contextResources: editBuffer.contextResources,
      deliverableRequirements: editBuffer.deliverableRequirements,
    }));

    // Close editor
    setEditingKey(null);
    setEditBuffer(null);

    // Highlight the section
    setHighlightedKey(sectionKey);

    // Track scope changes for display
    if (sectionKey === 'scanScope') {
      setDraftScopeChanged(true);
    }

    // Append Xino change message to conversation
    const xinoMsg: DraftMessage = {
      id: `msg-xino-edit-${Date.now()}`,
      role: 'xino',
      content: `已更新任务草稿。${changes.map(c => `${c.field}：${c.from} → ${c.to}`).join('，')}。`,
      createdAt: new Date().toISOString(),
      changeSummary: { title: changeTitle, changes },
    };
    setMessages(prev => [...prev, xinoMsg]);
  };

  /** Cancel inline edit */
  const handleCancelEdit = () => {
    setEditingKey(null);
    setEditBuffer(null);
  };

  /** Save draft with toast */
  const handleSaveDraft = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  // ========================
  // Empty State (首页空白态)
  // ========================
  if (workbenchState === 'empty') {
    const hero = (mockData as any).hero;
    const examples = (mockData as any).examples || [];
    const recentQuestions = (mockData as any).recentQuestions || [];
    const commonResources = (mockData as any).commonResources || [];

    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full px-6 bg-[#F8FAFC] relative">
        {/* Intent Detection Overlay */}
        {isDetecting && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center animate-pulse">
                <Sparkles size={24} className="text-white" />
              </div>
              <div className="text-center">
                <p className="text-[16px] font-semibold text-gray-900 mb-1">Xino 正在理解你的问题</p>
                <p className="text-[14px] text-gray-500">识别意图并准备回答...</p>
              </div>
              <Loader2 size={20} className="text-blue-600 animate-spin" />
            </div>
          </div>
        )}

        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <h2 className="text-[32px] font-bold text-gray-900 mb-3 tracking-tight">
              {hero.title}
            </h2>
            <p className="text-[16px] text-gray-500 font-medium">
              {hero.subtitle}
            </p>
          </div>

          {/* Big Input Area */}
          <div className="w-full max-w-3xl relative mb-6">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 p-4 transition-shadow focus-within:shadow-[0_8px_30px_rgb(37,99,235,0.08)] focus-within:border-blue-300">
              <textarea
                className="w-full min-h-[120px] resize-none outline-none text-[16px] leading-relaxed placeholder:text-gray-400 bg-transparent text-gray-900"
                placeholder={hero.placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              ></textarea>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1.5 text-gray-400">
                  {mockData.weakActions.map((action) => {
                    const Icon = WEAK_ACTION_ICONS[action] || Paperclip;
                    return (
                      <button key={action} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors">
                        <Icon size={18} />
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleSend}
                  disabled={isDetecting || !inputValue.trim()}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-[14px] transition-colors shadow-sm",
                    isDetecting || !inputValue.trim()
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  )}
                >
                  {isDetecting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      识别中...
                    </>
                  ) : (
                    <>
                      发送
                      <Send size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Example Questions */}
          {examples.length > 0 && (
            <div className="w-full max-w-3xl mt-2">
              <div className="flex flex-wrap gap-2 justify-center">
                {examples.map((ex: any) => (
                  <button
                    key={ex.id}
                    onClick={() => {
                      setInputValue(ex.text);
                    }}
                    className="px-4 py-2 rounded-xl text-[13px] text-gray-600 bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all shadow-sm"
                  >
                    <MessageCircle size={13} className="inline mr-1.5 -mt-0.5 text-gray-400" />
                    {ex.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Scenario Cards */}
          <div className="w-full max-w-3xl mt-8">
            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-[13px] text-gray-400 font-medium">或者选择一个场景</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {SCENARIOS.map((scenario: any) => {
                const Icon = scenario.icon;
                const colorClasses = scenario.color === 'blue'
                  ? {
                      iconBg: 'bg-blue-50',
                      iconText: 'text-blue-600',
                      buttonBg: 'bg-blue-600 hover:bg-blue-700',
                      borderHover: 'hover:border-blue-200',
                      shadowHover: 'hover:shadow-blue-100',
                    }
                  : {
                      iconBg: 'bg-emerald-50',
                      iconText: 'text-emerald-600',
                      buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
                      borderHover: 'hover:border-emerald-200',
                      shadowHover: 'hover:shadow-emerald-100',
                    };

                return (
                  <button
                    key={scenario.key}
                    onClick={() => handleScenarioClick(scenario)}
                    className={`bg-white border border-gray-200 ${colorClasses.borderHover} rounded-2xl p-6 text-left transition-all shadow-sm hover:shadow-lg ${colorClasses.shadowHover} group`}
                  >
                    <div className={`w-10 h-10 ${colorClasses.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon size={20} className={colorClasses.iconText} />
                    </div>
                    <h3 className="text-[16px] font-semibold text-gray-900 mb-2">{scenario.title}</h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed mb-4">{scenario.description}</p>
                    <span className={`inline-flex items-center gap-1.5 ${colorClasses.buttonBg} text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors`}>
                      {scenario.buttonText}
                      <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Questions + Common Resources */}
          <div className="w-full max-w-3xl mt-8 flex items-start gap-8">
            {/* Recent Questions */}
            {recentQuestions.length > 0 && (
              <div className="flex-1">
                <h4 className="text-[13px] font-medium text-gray-400 mb-3">最近问数</h4>
                <div className="space-y-1">
                  {recentQuestions.slice(0, 4).map((q: any) => (
                    <button
                      key={q.id}
                      onClick={() => navigate(dataQaPath(q.id))}
                      className="w-full text-left px-3 py-2 rounded-lg text-[13px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center justify-between group"
                    >
                      <span className="truncate flex-1">{q.title}</span>
                      <span className="text-[11px] text-gray-400 ml-2 shrink-0">{q.updatedAt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Common Resources */}
            {commonResources.length > 0 && (
              <div className="flex-1">
                <h4 className="text-[13px] font-medium text-gray-400 mb-3">常用资源</h4>
                <div className="flex flex-wrap gap-2">
                  {commonResources.map((r: any) => (
                    <span key={r.id} className="px-3 py-1.5 rounded-lg text-[12px] bg-white border border-gray-200 text-gray-600">
                      {r.type === 'metric' && '📊 '}{r.type === 'data_source' && '🗄️ '}{r.type === 'table' && '📋 '}{r.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Hint */}
        <div className="absolute bottom-6 text-center w-full">
          <p className="text-[12px] text-gray-400">
            Xino 会根据你的问题，自动识别意图并选择合适的工作方式。
          </p>
        </div>
      </div>
    );
  }

  // ========================
  // Draft State (草稿抽屉态)
  // ========================
  const draft = draftMockData.draft;

  // Determine display values based on draftState
  const scopeDisplay = draftState.isFullScan
    ? { label: '全库', count: '无限制' }
    : draftState.scanScopeSchemas.length > 0
      ? { label: draftState.scanScopeSchemas.join(', '), count: `${draftState.scanScopeSchemas.length} 个 Schema` }
      : draftScopeChanged
        ? { label: draft.scanScope.schemas.join(', '), count: `${draft.scanScope.schemas.length} 个 Schema` }
        : { label: '全库 (286 个 Schema)', count: '无限制' };
  const estimatedTables = draftState.isFullScan ? '286' : draftScopeChanged ? draft.scanScope.estimatedTables : '286';
  const estimatedFields = draftState.isFullScan ? '9,820' : draftScopeChanged ? draft.scanScope.estimatedFields : '9,820';
  const estimatedHours = draftState.isFullScan ? '2.5' : draftScopeChanged ? '1.4' : '2.5';

  // Count user messages to know if any adjustments happened
  const hasAdjustments = messages.filter(m => m.role === 'user').length > 1;

  return (
    <div className="flex h-full bg-[#F8FAFC]">
      {/* Center Conversation Area */}
      <div className="flex-1 flex flex-col h-full relative border-r border-[#E5E7EB]">
        {/* Header */}
        <div className="px-8 py-5 bg-white border-b border-[#E5E7EB] flex-shrink-0 z-10 flex justify-between items-center">
          <div>
            <h2 className="text-[20px] font-bold text-gray-900">AI 工作台</h2>
            <p className="text-[13px] text-gray-500 mt-1">与 Xino 对话，确认任务目标、范围与执行方案。</p>
          </div>
          {!isDrawerOpen && (
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[13px] font-medium transition-colors border border-blue-200"
            >
              <FileText size={16} />
              查看任务草稿
            </button>
          )}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto pt-10 pb-8 scroll-smooth">
          <div className="w-full max-w-[780px] mx-auto px-6 space-y-8">
            {messages.map((msg) => (
              <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {msg.role === 'user' ? (
                  /* User Message - Standard style from execution page */
                  <div className="flex justify-end">
                    <div className="w-[85%] max-w-[580px]">
                      <div className="flex items-center gap-2 mb-1.5 justify-end">
                        <span className="text-[12px] text-gray-400">{formatTime(msg.createdAt)}</span>
                        <span className="font-medium text-[13px] text-gray-600">{draftMockData.conversation[0].authorName}</span>
                      </div>
                      <div className="bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-3 shadow-sm ml-auto inline-block">
                        <p className="text-[14px] text-gray-800 leading-relaxed text-right">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Xino Message - Standard style from execution page */
                  <div className="flex gap-4 max-w-full group">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-sm">
                      <Sparkles size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-semibold text-[13px] text-gray-900">Xino</span>
                        <span className="text-[12px] text-gray-400">{formatTime(msg.createdAt)}</span>
                      </div>
                      <p className="text-[14px] text-gray-700 leading-relaxed">
                        {msg.content}
                      </p>

                      {/* Change Summary Card - Matching execution result blocks */}
                      {msg.changeSummary && (
                        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm max-w-md mt-4 animate-in zoom-in-95 duration-300">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                              <Check size={14} strokeWidth={3} />
                            </div>
                            <h4 className="font-semibold text-[14px] text-gray-900">{msg.changeSummary.title}</h4>
                          </div>
                          <div className="space-y-3">
                            {msg.changeSummary.changes.map((chg, idx) => (
                              <div key={idx} className="text-[13px] flex items-start gap-4">
                                <span className="text-gray-500 w-24 flex-shrink-0">{chg.field}：</span>
                                <span className="text-gray-900 font-medium">
                                  <span className="text-gray-400 font-normal">{chg.from}</span>
                                  <span className="text-gray-300 mx-2">→</span>
                                  <span className="text-blue-600">{chg.to}</span>
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Xino typing indicator */}
            {isXinoTyping && (
              <div className="flex gap-4 max-w-full animate-in fade-in duration-200">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-sm">
                  <Sparkles size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-semibold text-[13px] text-gray-900">Xino</span>
                    <Loader2 size={12} className="text-blue-600 animate-spin" />
                  </div>
                  <span className="text-[14px] text-gray-400">正在理解你的要求并更新草稿…</span>
                </div>
              </div>
            )}

            {/* Suggested Chips — show only when not typing and no adjustments yet */}
            {!isXinoTyping && !hasAdjustments && (
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                {DRAFT_SUGGESTED_CHIPS.map(chip => (
                  <button
                    key={chip}
                    onClick={() => handleChipClick(chip)}
                    className="px-4 py-2 rounded-full border border-gray-200 bg-white text-[13px] text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} className="h-10"></div>
          </div>
        </div>

        {/* Bottom Input Area */}
        <div className="p-4 bg-white border-t border-[#E5E7EB] flex-shrink-0 flex justify-center">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm border border-gray-300 p-2 pl-4 flex gap-3 items-end focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isXinoTyping}
              className="flex-1 min-h-[24px] max-h-[100px] py-1.5 resize-y outline-none text-[14px] leading-relaxed placeholder:text-gray-400 bg-transparent custom-scrollbar disabled:opacity-50"
              placeholder="继续告诉 Xino 你的调整要求，例如：只扫描采购相关 Schema、增加 Excel 明细…"
              rows={1}
            ></textarea>
            <div className="flex items-center gap-2 pb-0.5">
              <div className="flex items-center gap-0.5">
                <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors">
                  <Paperclip size={16} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors">
                  <AtSign size={16} />
                </button>
              </div>
              <button
                onClick={handleSend}
                disabled={isXinoTyping || !inputValue.trim()}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-lg transition-colors flex-shrink-0",
                  inputValue.trim() && !isXinoTyping ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-100 text-gray-400"
                )}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Draft Drawer */}
      {isDrawerOpen && (
        <div className="w-[540px] bg-white flex flex-col flex-shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] z-20 animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between flex-shrink-0">
            <div>
              <h3 className="text-[18px] font-bold text-gray-900 flex items-center gap-2">
                任务草稿 <span className="text-gray-300 font-normal">·</span> 待确认
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  <Clock size={12} />
                  尚未开始执行
                </div>
                {hasAdjustments && (
                  <span className="text-[12px] text-gray-400">已通过对话调整</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Section 1: Task Understanding */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[14px] font-semibold text-gray-900">任务理解</h4>
                {editingKey !== 'understanding' ? (
                  <button
                    onClick={() => handleStartEdit('understanding')}
                    className="text-[13px] text-blue-600 hover:text-blue-700 font-medium"
                  >编辑</button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="text-[13px] text-gray-500 hover:text-gray-700 font-medium"
                    >取消</button>
                    <button
                      onClick={() => {
                        if (!editBuffer) return;
                        const changes: { field: string; from: string; to: string }[] = [];
                        if (editBuffer.name !== draftState.name) changes.push({ field: '任务名称', from: draftState.name, to: editBuffer.name });
                        if (editBuffer.objective !== draftState.objective) changes.push({ field: '任务目标', from: draftState.objective, to: editBuffer.objective });
                        if (changes.length === 0) { handleCancelEdit(); return; }
                        handleSaveEdit('understanding', '已更新任务理解', changes);
                      }}
                      className="text-[13px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    ><Save size={13}/> 保存</button>
                  </div>
                )}
              </div>
              <div className={cn(
                "rounded-xl p-4 border transition-all",
                highlightedKey === 'understanding' ? "bg-blue-50/50 border-2 border-blue-300" : "bg-gray-50 border border-gray-100"
              )}>
                {editingKey === 'understanding' && editBuffer ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[12px] font-medium text-gray-700 block mb-1">任务名称</label>
                      <input
                        type="text"
                        value={editBuffer.name}
                        onChange={e => setEditBuffer({ ...editBuffer, name: e.target.value })}
                        className="w-full text-[14px] border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[12px] font-medium text-gray-700 block mb-1">任务目标</label>
                      <textarea
                        value={editBuffer.objective}
                        onChange={e => setEditBuffer({ ...editBuffer, objective: e.target.value })}
                        rows={3}
                        className="w-full text-[13px] border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-[14px] font-semibold text-gray-900 mb-1">{draftState.name}</div>
                    <p className="text-[13px] text-gray-600 leading-relaxed mb-3">{draftState.objective}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {draft.typeTags.map(tag => (
                        <span key={tag} className="px-2 py-1 rounded-md bg-white border border-gray-200 text-[12px] text-gray-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Section 2: Key Configs */}
            <div>
              <h4 className="text-[14px] font-semibold text-gray-900 mb-3">关键配置</h4>
              <div className="space-y-3">
                {/* Data Source */}
                <div className={cn(
                  "rounded-xl p-4 transition-all",
                  highlightedKey === 'dataSource' ? "bg-blue-50/50 border-2 border-blue-300" : "bg-white border border-gray-200 hover:border-blue-200"
                )}>
                  {editingKey === 'dataSource' && editBuffer ? (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[12px] font-medium text-gray-500">选择数据源</span>
                        <div className="flex items-center gap-2">
                          <button onClick={handleCancelEdit} className="text-[13px] text-gray-500 hover:text-gray-700 font-medium">取消</button>
                          <button
                            onClick={() => {
                              if (!editBuffer) return;
                              const oldDs = resolveDataSource(draftState.dataSourceId);
                              const newDs = resolveDataSource(editBuffer.dataSourceId);
                              if (editBuffer.dataSourceId === draftState.dataSourceId) { handleCancelEdit(); return; }
                              handleSaveEdit('dataSource', '已更新数据源', [
                                { field: '数据源', from: oldDs.name, to: newDs.name },
                                { field: '数据库类型', from: oldDs.type, to: newDs.type },
                                { field: '连接地址', from: `${oldDs.host}:${oldDs.port}`, to: `${newDs.host}:${newDs.port}` },
                              ]);
                            }}
                            className="text-[13px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          ><Save size={13}/> 保存</button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {draftMockData.availableDataSources.map(ds => (
                          <label
                            key={ds.id}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                              editBuffer.dataSourceId === ds.id ? "border-blue-400 bg-blue-50/40" : "border-gray-200 hover:border-blue-200 bg-white"
                            )}
                          >
                            <input
                              type="radio"
                              name="dataSource"
                              checked={editBuffer.dataSourceId === ds.id}
                              onChange={() => setEditBuffer({ ...editBuffer, dataSourceId: ds.id })}
                              className="accent-blue-600"
                            />
                            <div className="flex-1">
                              <div className="text-[14px] font-semibold text-gray-900">{ds.name}</div>
                              <div className="text-[12px] text-gray-500">{ds.type} · {ds.host}:{ds.port}</div>
                            </div>
                            <div className={cn(
                              "text-[12px] px-2 py-0.5 rounded",
                              ds.status === 'CONNECTED' ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                            )}>
                              {ds.status === 'CONNECTED' ? '已连接' : '未连接'}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[12px] font-medium text-gray-500 mb-1">数据源</div>
                        {(() => {
                          const ds = resolveDataSource(draftState.dataSourceId);
                          return (
                            <>
                              <div className="text-[14px] font-semibold text-gray-900">{ds.name}</div>
                              <div className="text-[12px] text-gray-500 mt-1">{ds.type} · {ds.host}:{ds.port}</div>
                              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[12px] bg-green-50 text-green-700 mt-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                已连接
                              </div>
                            </>
                          );
                        })()}
                      </div>
                      <button
                        onClick={() => handleStartEdit('dataSource')}
                        className="text-[13px] text-blue-600 hover:text-blue-700 font-medium"
                      >更换</button>
                    </div>
                  )}
                </div>

                {/* Scan Scope */}
                <div className={cn(
                  "rounded-xl p-4 transition-all",
                  highlightedKey === 'scanScope' ? "bg-blue-50/50 border-2 border-blue-300" : "bg-white border border-gray-200 hover:border-blue-200"
                )}>
                  {editingKey === 'scanScope' && editBuffer ? (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[12px] font-medium text-gray-500">编辑扫描范围</span>
                        <div className="flex items-center gap-2">
                          <button onClick={handleCancelEdit} className="text-[13px] text-gray-500 hover:text-gray-700 font-medium">取消</button>
                          <button
                            onClick={() => {
                              if (!editBuffer) return;
                              const oldLabel = draftState.isFullScan ? '全库' : draftState.scanScopeSchemas.join(', ');
                              const newLabel = editBuffer.isFullScan ? '全库' : editBuffer.scanScopeSchemas.join(', ');
                              if (oldLabel === newLabel && editBuffer.isFullScan === draftState.isFullScan) { handleCancelEdit(); return; }
                              handleSaveEdit('scanScope', '已更新扫描范围', [
                                { field: '扫描范围', from: oldLabel || '无', to: newLabel || '无' },
                              ]);
                            }}
                            className="text-[13px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          ><Save size={13}/> 保存</button>
                        </div>
                      </div>
                      <label className="flex items-center gap-2 mb-3 p-2 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editBuffer.isFullScan}
                          onChange={e => setEditBuffer({ ...editBuffer, isFullScan: e.target.checked })}
                          className="accent-blue-600"
                        />
                        <span className="text-[13px] font-medium text-gray-700">全库扫描</span>
                      </label>
                      {!editBuffer.isFullScan && (
                        <div className="space-y-2">
                          {draftMockData.availableSchemas.map(schema => (
                            <label
                              key={schema.id}
                              className={cn(
                                "flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all",
                                editBuffer.scanScopeSchemas.includes(schema.id) ? "border-blue-400 bg-blue-50/40" : "border-gray-200 bg-white hover:border-blue-200"
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={editBuffer.scanScopeSchemas.includes(schema.id)}
                                onChange={e => {
                                  const checked = e.target.checked;
                                  setEditBuffer({
                                    ...editBuffer,
                                    scanScopeSchemas: checked
                                      ? [...editBuffer.scanScopeSchemas, schema.id]
                                      : editBuffer.scanScopeSchemas.filter(s => s !== schema.id),
                                  });
                                }}
                                className="accent-blue-600"
                              />
                              <div className="flex-1">
                                <span className="text-[13px] font-medium text-gray-900">{schema.name}</span>
                                <span className="text-[12px] text-gray-500 ml-2">{schema.tableCount} 张表</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div>
                        <div className={cn(
                          "text-[12px] font-medium mb-1 flex items-center gap-2",
                          highlightedKey === 'scanScope' ? "text-blue-600" : "text-gray-500"
                        )}>
                          扫描范围
                          {highlightedKey === 'scanScope' && (
                            <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-medium animate-in fade-in zoom-in duration-200">
                              刚刚更新
                            </span>
                          )}
                        </div>
                        <div className="text-[14px] font-semibold text-gray-900">
                          {draftState.isFullScan ? '全库' : draftState.scanScopeSchemas.join(', ') || '未选择'}
                        </div>
                        <div className="text-[12px] text-gray-500 mt-1">
                          {draftState.isFullScan ? '无限制' : `${draftState.scanScopeSchemas.length} 个 Schema`}
                        </div>
                      </div>
                      <button
                        onClick={() => handleStartEdit('scanScope')}
                        className="text-[13px] text-blue-600 hover:text-blue-700 font-medium"
                      >编辑范围</button>
                    </div>
                  )}
                </div>

                {/* Context Resources */}
                <div className={cn(
                  "rounded-xl p-4 transition-all",
                  highlightedKey === 'resources' ? "bg-blue-50/50 border-2 border-blue-300" : "bg-white border border-gray-200 hover:border-blue-200"
                )}>
                  {editingKey === 'resources' && editBuffer ? (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[12px] font-medium text-gray-500">管理上下文资源</span>
                        <div className="flex items-center gap-2">
                          <button onClick={handleCancelEdit} className="text-[13px] text-gray-500 hover:text-gray-700 font-medium">取消</button>
                          <button
                            onClick={() => {
                              if (!editBuffer) return;
                              const oldCount = draftState.contextResources.length;
                              const newCount = editBuffer.contextResources.length;
                              if (oldCount === newCount) { handleCancelEdit(); return; }
                              const addedNames = editBuffer.contextResources
                                .filter(r => !draftState.contextResources.some(old => old.id === r.id))
                                .map(r => r.name);
                              const removedNames = draftState.contextResources
                                .filter(r => !editBuffer.contextResources.some(cur => cur.id === r.id))
                                .map(r => r.name);
                              const changes: { field: string; from: string; to: string }[] = [];
                              if (addedNames.length > 0) changes.push({ field: '新增资源', from: '—', to: addedNames.join(', ') });
                              if (removedNames.length > 0) changes.push({ field: '移除资源', from: removedNames.join(', '), to: '—' });
                              changes.push({ field: '资源总数', from: `${oldCount} 个`, to: `${newCount} 个` });
                              handleSaveEdit('resources', '已更新上下文资源', changes);
                            }}
                            className="text-[13px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          ><Save size={13}/> 保存</button>
                        </div>
                      </div>
                      {/* Current resources with remove buttons */}
                      <div className="space-y-2 mb-3">
                        <div className="text-[12px] font-medium text-gray-500 mb-1">已添加（{editBuffer.contextResources.length}）</div>
                        {editBuffer.contextResources.length === 0 && (
                          <div className="text-[12px] text-gray-400 py-2">暂无资源</div>
                        )}
                        {editBuffer.contextResources.map(res => (
                          <div key={res.id} className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-white">
                            <FileText size={14} className="text-gray-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] text-gray-900 truncate">{res.name}</div>
                              <div className="text-[11px] text-gray-400">{res.type}</div>
                            </div>
                            <button
                              onClick={() => setEditBuffer({
                                ...editBuffer,
                                contextResources: editBuffer.contextResources.filter(r => r.id !== res.id),
                              })}
                              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 rounded transition-colors"
                            ><Trash2 size={14}/></button>
                          </div>
                        ))}
                      </div>
                      {/* Available uploads to add */}
                      {(() => {
                        const available = draftMockData.availableUploads.filter(
                          u => !editBuffer.contextResources.some(r => r.id === u.id)
                        );
                        if (available.length === 0) return null;
                        return (
                          <div className="space-y-2">
                            <div className="text-[12px] font-medium text-gray-500 mb-1">可添加</div>
                            {available.map(upload => (
                              <div key={upload.id} className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-gray-50">
                                <FileText size={14} className="text-gray-400 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-[13px] text-gray-700 truncate">{upload.name}</div>
                                  <div className="text-[11px] text-gray-400">{upload.type}</div>
                                </div>
                                <button
                                  onClick={() => setEditBuffer({
                                    ...editBuffer,
                                    contextResources: [...editBuffer.contextResources, {
                                      id: upload.id,
                                      name: upload.name,
                                      type: upload.type,
                                      sizeBytes: upload.sizeBytes,
                                      uploadedBy: draftMockData.draft.contextResources[0]?.uploadedBy || { id: 'u-litong', name: '李桐', email: 'liming@semovix.com', avatarUrl: '/avatars/litong.png', role: 'owner' },
                                      uploadedAt: new Date().toISOString(),
                                    }],
                                  })}
                                  className="w-6 h-6 flex items-center justify-center text-blue-600 hover:text-blue-700 rounded transition-colors"
                                ><Plus size={14}/></button>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div>
                        <div className={cn(
                          "text-[12px] font-medium mb-1 flex items-center gap-2",
                          highlightedKey === 'resources' ? "text-blue-600" : "text-gray-500"
                        )}>
                          上下文资源
                          {highlightedKey === 'resources' && (
                            <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-medium animate-in fade-in zoom-in duration-200">
                              刚刚更新
                            </span>
                          )}
                        </div>
                        <div className="text-[14px] font-semibold text-gray-900">
                          {draftState.contextResources.length} 个文件
                        </div>
                        <div className="text-[12px] text-gray-500 mt-1 flex items-center gap-2">
                          {draftState.contextResources.map(res => (
                            <span key={res.id} className="flex items-center gap-1"><FileText size={12}/> {res.type}</span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleStartEdit('resources')}
                        className="text-[13px] text-blue-600 hover:text-blue-700 font-medium"
                      >继续上传</button>
                    </div>
                  )}
                </div>

                {/* Deliverables */}
                <div className={cn(
                  "rounded-xl p-4 transition-all",
                  highlightedKey === 'deliverables' ? "bg-blue-50/50 border-2 border-blue-300" : "bg-white border border-gray-200 hover:border-blue-200"
                )}>
                  {editingKey === 'deliverables' && editBuffer ? (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[12px] font-medium text-gray-500">调整交付物</span>
                        <div className="flex items-center gap-2">
                          <button onClick={handleCancelEdit} className="text-[13px] text-gray-500 hover:text-gray-700 font-medium">取消</button>
                          <button
                            onClick={() => {
                              if (!editBuffer) return;
                              const oldItems = draftState.deliverableRequirements;
                              const newItems = editBuffer.deliverableRequirements;
                              const added = newItems.filter(i => !oldItems.includes(i));
                              const removed = oldItems.filter(i => !newItems.includes(i));
                              if (added.length === 0 && removed.length === 0) { handleCancelEdit(); return; }
                              const changes: { field: string; from: string; to: string }[] = [];
                              if (added.length > 0) changes.push({ field: '新增交付物', from: '—', to: added.join(', ') });
                              if (removed.length > 0) changes.push({ field: '移除交付物', from: removed.join(', '), to: '—' });
                              changes.push({ field: '交付物总数', from: `${oldItems.length} 项`, to: `${newItems.length} 项` });
                              handleSaveEdit('deliverables', '已更新交付物配置', changes);
                            }}
                            className="text-[13px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          ><Save size={13}/> 保存</button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        {draftMockData.availableDeliverables.map(item => (
                          <label
                            key={item}
                            className={cn(
                              "flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all",
                              editBuffer.deliverableRequirements.includes(item) ? "border-blue-400 bg-blue-50/40" : "border-gray-200 bg-white hover:border-blue-200"
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={editBuffer.deliverableRequirements.includes(item)}
                              onChange={e => {
                                const checked = e.target.checked;
                                setEditBuffer({
                                  ...editBuffer,
                                  deliverableRequirements: checked
                                    ? [...editBuffer.deliverableRequirements, item]
                                    : editBuffer.deliverableRequirements.filter(d => d !== item),
                                });
                              }}
                              className="accent-blue-600"
                            />
                            <span className="text-[13px] text-gray-900">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div>
                        <div className={cn(
                          "text-[12px] font-medium mb-1 flex items-center gap-2",
                          highlightedKey === 'deliverables' ? "text-blue-600" : "text-gray-500"
                        )}>
                          交付物
                          {highlightedKey === 'deliverables' && (
                            <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-medium animate-in fade-in zoom-in duration-200">
                              刚刚更新
                            </span>
                          )}
                        </div>
                        <div className="text-[14px] font-semibold text-gray-900">
                          {draftState.deliverableRequirements.length} 项
                        </div>
                        <div className="text-[12px] text-gray-500 mt-1">
                          {draftState.deliverableRequirements.slice(0, 4).join('、')}
                          {draftState.deliverableRequirements.length > 4 && '等'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleStartEdit('deliverables')}
                        className="text-[13px] text-blue-600 hover:text-blue-700 font-medium"
                      >调整</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Recommended Scheme */}
            <div>
              <h4 className="text-[14px] font-semibold text-gray-900 mb-3">推荐执行方案</h4>
              <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-green-600" />
                  <div className="text-[14px] font-semibold text-green-900">供应链语义治理方案</div>
                  <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded font-medium ml-1">推荐</span>
                </div>
                <p className="text-[12px] text-green-800/80 mb-3">基于供应链领域最佳实践的治理流程与规则配置方案</p>
                <button className="text-[13px] text-green-700 font-medium hover:text-green-800">查看详情 →</button>
              </div>
            </div>

            {/* Section 4: Risks Overview */}
            <div>
              <h4 className="text-[14px] font-semibold text-gray-900 mb-3">风险提醒</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-[13px] text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0"></div>
                  预计扫描约 {estimatedTables} 张表、{estimatedFields} 个字段
                </li>
                <li className="flex items-start gap-2 text-[13px] text-amber-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                  部分字段命名不规范，可能需要人工确认
                </li>
                {draftScopeChanged && (
                  <li className="flex items-start gap-2 text-[13px] text-green-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                    当前扫描范围已限制，风险等级降低
                  </li>
                )}
              </ul>
            </div>

            {/* Section 5: Stage Summary */}
            <div>
              <h4 className="text-[14px] font-semibold text-gray-900 mb-3">执行阶段摘要</h4>
              <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-white">
                <div className="flex items-center gap-4">
                  <div className="text-[14px] font-semibold text-gray-900">预计 {draft.stages.length} 个阶段</div>
                  <div className="text-[13px] text-gray-500 flex items-center gap-1.5"><Clock size={14}/> 约 {estimatedHours} 小时</div>
                </div>
                <button className="text-[13px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">展开查看 <ChevronDown size={14} /></button>
              </div>
            </div>

            {/* Section 6: Advanced Config (Expandable) */}
            <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsAdvancedExpanded(!isAdvancedExpanded)}
              >
                <span className="text-[13px] text-gray-700 font-medium flex items-center gap-2">
                  <Settings2 size={16} className="text-gray-400" />
                  高级配置
                </span>
                <div className="flex items-center gap-2">
                  {!isAdvancedExpanded && <span className="text-[12px] text-gray-400">范围、采样、并行度...</span>}
                  <ChevronDown size={16} className={cn("text-gray-400 transition-transform duration-200", isAdvancedExpanded && "rotate-180")} />
                </div>
              </div>

              {isAdvancedExpanded && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[12px] font-medium text-gray-700 block mb-1.5">执行并行度</label>
                      <div className="relative">
                        <select className="w-full text-[13px] border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white outline-none focus:border-blue-500 appearance-none">
                          <option>10 (推荐)</option>
                          <option>5</option>
                          <option>20</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[12px] font-medium text-gray-700 block mb-1.5">自动确认阈值</label>
                      <div className="relative">
                        <select className="w-full text-[13px] border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white outline-none focus:border-blue-500 appearance-none">
                          <option>置信度 &gt; 0.95</option>
                          <option>置信度 &gt; 0.90</option>
                          <option>全部需要人工确认</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-gray-700 block mb-1.5">异常中断策略</label>
                    <div className="relative">
                      <select className="w-full text-[13px] border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white outline-none focus:border-blue-500 appearance-none">
                        <option>超过 50 个冲突时暂停</option>
                        <option>出现任一冲突即暂停</option>
                        <option>不暂停，仅记录警告</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 7: Recent Changes */}
            {hasAdjustments && (
              <div className="flex items-center gap-2 text-[12px] text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                <RotateCw size={14} className="text-gray-400" />
                <span>草稿已通过对话调整，可继续修改或直接执行</span>
              </div>
            )}

            <div className="h-6"></div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-5 border-t border-[#E5E7EB] bg-white flex items-center justify-between flex-shrink-0 relative">
            {/* Save Toast */}
            {saveToast && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[13px] font-medium px-4 py-2 rounded-lg shadow-lg animate-in fade-in zoom-in duration-200 flex items-center gap-2 z-30">
                <Check size={14} strokeWidth={3}/>
                草稿已保存
              </div>
            )}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              >
                保存草稿
              </button>
            </div>
            <button
              onClick={handleExecute}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[14px] font-medium transition-colors shadow-sm"
            >
              创建并开始执行
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
