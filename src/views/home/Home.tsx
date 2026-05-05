import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Paperclip, AtSign, Mic, History, Send, ChevronRight, Database, BarChart3,
  Sparkles, User, X, FileText, ChevronDown, Check, Clock, Settings2, RotateCw, Loader2,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import mockData from '@/mock/workbench-home.json';
import draftMockData from '@/mock/task-draft.json';
import { formatTime } from '@/mock/helpers';

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

const SCENARIOS = [
  {
    key: 'semantic-governance',
    title: '语义治理',
    description: '扫描数据库 Schema，识别业务表，理解字段语义，生成业务对象与交付物。',
    color: 'blue' as const,
    draftId: 'draft-supply-chain-loop',
    icon: Database,
    buttonText: '开始治理',
  },
  {
    key: 'data-query',
    title: '找数问数',
    description: '用自然语言查询业务数据，获取指标结果、趋势分析与数据依据。',
    color: 'emerald' as const,
    path: '/data-query',
    icon: BarChart3,
    buttonText: '开始提问',
  },
];

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

  const handleSend = () => {
    if (workbenchState === 'empty') {
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

  const handleScenarioClick = (scenario: typeof SCENARIOS[number]) => {
    if (scenario.path) {
      navigate(scenario.path);
    } else if (scenario.draftId) {
      setSearchParams({ draftId: scenario.draftId });
    }
  };

  const handleExecute = () => {
    navigate('/tasks/task-supply-chain-loop');
  };

  // ========================
  // Empty State (首页空白态)
  // ========================
  if (workbenchState === 'empty') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full px-6 bg-[#F8FAFC]">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <h2 className="text-[32px] font-bold text-gray-900 mb-3 tracking-tight">
              {mockData.heroTitle}
            </h2>
            <p className="text-[16px] text-gray-500 font-medium">
              {mockData.heroSubtitle}
            </p>
          </div>

          {/* Big Input Area */}
          <div className="w-full max-w-3xl relative mb-6">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 p-4 transition-shadow focus-within:shadow-[0_8px_30px_rgb(37,99,235,0.08)] focus-within:border-blue-300">
              <textarea
                className="w-full min-h-[120px] resize-none outline-none text-[16px] leading-relaxed placeholder:text-gray-400 bg-transparent text-gray-900"
                placeholder={mockData.inputPlaceholder}
                defaultValue="请对供应链数据库进行语义治理，扫描 Schema、识别业务相关表、理解字段语义、生成业务对象与交付物。"
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
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-[14px] transition-colors shadow-sm"
                >
                  生成任务草稿
                  <Send size={16} />
                </button>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-[13px] text-gray-400">
                可通过 @ 引用数据源、文件、对象或知识库，Xino 会自动整理为任务草稿。
              </p>
            </div>
          </div>

          {/* Scenario Cards */}
          <div className="w-full max-w-3xl mt-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-[13px] text-gray-400 font-medium">或者选择一个场景</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {SCENARIOS.map((scenario) => {
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

          {/* Collapsed Sections */}
          <div className="w-full max-w-3xl mt-10 flex items-center justify-center gap-8">
            {[
              { label: '常用任务', count: mockData.collapsedSections.commonTasks },
              { label: '最近继续', count: mockData.collapsedSections.recentContinue },
              { label: '常用资源', count: mockData.collapsedSections.commonResources }
            ].map((item) => (
              <button key={item.label} className="flex items-center gap-2 text-[14px] text-gray-500 hover:text-gray-900 transition-colors group">
                <span className="font-medium">{item.label} <span className="text-gray-400 font-normal">{item.count} 个</span></span>
                <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Hint */}
        <div className="absolute bottom-6 text-center w-full">
          <p className="text-[12px] text-gray-400">
            Xino 会根据你的目标，自动识别任务类型、推荐数据源、规划执行步骤。
          </p>
        </div>
      </div>
    );
  }

  // ========================
  // Draft State (草稿抽屉态)
  // ========================
  const draft = draftMockData.draft;

  // Determine display values based on whether scope was changed via conversation
  const scopeDisplay = draftScopeChanged
    ? { label: draft.scanScope.schemas.join(', '), count: `${draft.scanScope.schemas.length} 个 Schema` }
    : { label: '全库 (286 个 Schema)', count: '无限制' };
  const estimatedTables = draftScopeChanged ? draft.scanScope.estimatedTables : '286';
  const estimatedFields = draftScopeChanged ? draft.scanScope.estimatedFields : '9,820';
  const estimatedHours = draftScopeChanged ? '1.4' : '2.5';

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
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.role === 'user' ? (
                /* User Message */
                <div className="flex flex-col items-end w-full">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[12px] text-gray-400">{formatTime(msg.createdAt)}</span>
                    <span className="font-semibold text-[14px] text-gray-900">{draftMockData.conversation[0].authorName}</span>
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 ml-1">
                      <User size={16} />
                    </div>
                  </div>
                  <div className="text-[15px] text-gray-800 leading-relaxed text-right max-w-3xl mr-11">
                    {msg.content}
                  </div>
                </div>
              ) : (
                /* Xino Message */
                <div className="flex gap-4 max-w-4xl">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-sm">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-semibold text-[14px] text-gray-900">Xino</span>
                      <span className="text-[12px] text-gray-400">{formatTime(msg.createdAt)}</span>
                    </div>
                    <div className="text-[15px] text-gray-800 leading-relaxed mb-4">
                      {msg.content}
                    </div>

                    {/* Change Summary Card */}
                    {msg.changeSummary && (
                      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm max-w-md mt-2">
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
                              <span className="text-gray-900">{chg.from} <span className="text-gray-400 mx-1">→</span> <span className="text-blue-600 font-medium">{chg.to}</span></span>
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
            <div className="flex gap-4 max-w-4xl animate-in fade-in duration-200">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-sm">
                <Sparkles size={16} />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Loader2 size={16} className="text-gray-400 animate-spin" />
                <span className="text-[14px] text-gray-400">Xino 正在理解你的要求…</span>
              </div>
            </div>
          )}

          {/* Suggested Chips — show only when not typing and no adjustments yet */}
          {!isXinoTyping && !hasAdjustments && (
            <div className="flex flex-wrap gap-2">
              {DRAFT_SUGGESTED_CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-[13px] text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} className="h-4"></div>
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
                <button className="text-[13px] text-blue-600 hover:text-blue-700 font-medium">编辑</button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="text-[14px] font-semibold text-gray-900 mb-1">{draft.name}</div>
                <p className="text-[13px] text-gray-600 leading-relaxed mb-3">{draft.objective}</p>
                <div className="flex flex-wrap gap-1.5">
                  {draft.typeTags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded-md bg-white border border-gray-200 text-[12px] text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: Key Configs */}
            <div>
              <h4 className="text-[14px] font-semibold text-gray-900 mb-3">关键配置</h4>
              <div className="space-y-3">
                {/* Data Source */}
                <div className={cn(
                  "flex items-start justify-between rounded-xl p-4 transition-all",
                  highlightedKey === 'dataSource' ? "bg-blue-50/50 border-2 border-blue-300" : "bg-white border border-gray-200 hover:border-blue-200"
                )}>
                  <div>
                    <div className="text-[12px] font-medium text-gray-500 mb-1">数据源</div>
                    <div className="text-[14px] font-semibold text-gray-900">{draft.dataSource.name}</div>
                    <div className="text-[12px] text-gray-500 mt-1">{draft.dataSource.type} · {draft.dataSource.host}:{draft.dataSource.port}</div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[12px] bg-green-50 text-green-700 mt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      已连接
                    </div>
                  </div>
                  <button className="text-[13px] text-blue-600 hover:text-blue-700 font-medium">更换</button>
                </div>

                {/* Scan Scope */}
                <div className={cn(
                  "flex items-start justify-between rounded-xl p-4 transition-all",
                  highlightedKey === 'scanScope' ? "bg-blue-50/50 border-2 border-blue-300" : "bg-white border border-gray-200 hover:border-blue-200"
                )}>
                  <div>
                    <div className={cn(
                      "text-[12px] font-medium mb-1 flex items-center gap-2",
                      highlightedKey === 'scanScope' ? "text-blue-600" : "text-gray-500"
                    )}>
                      扫描范围
                      {highlightedKey === 'scanScope' && (
                        <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-medium animate-in fade-in zoom-in duration-200">
                          刚刚通过对话更新
                        </span>
                      )}
                    </div>
                    <div className="text-[14px] font-semibold text-gray-900">
                      {scopeDisplay.label}
                    </div>
                    <div className="text-[12px] text-gray-500 mt-1">
                      {scopeDisplay.count}
                    </div>
                  </div>
                  <button className="text-[13px] text-blue-600 hover:text-blue-700 font-medium">编辑范围</button>
                </div>

                {/* Context Resources */}
                <div className={cn(
                  "flex items-start justify-between rounded-xl p-4 transition-all",
                  highlightedKey === 'resources' ? "bg-blue-50/50 border-2 border-blue-300" : "bg-white border border-gray-200 hover:border-blue-200"
                )}>
                  <div>
                    <div className={cn(
                      "text-[12px] font-medium mb-1 flex items-center gap-2",
                      highlightedKey === 'resources' ? "text-blue-600" : "text-gray-500"
                    )}>
                      上下文资源
                      {highlightedKey === 'resources' && (
                        <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-medium animate-in fade-in zoom-in duration-200">
                          刚刚通过对话更新
                        </span>
                      )}
                    </div>
                    <div className="text-[14px] font-semibold text-gray-900">
                      {highlightedKey === 'resources' ? `${draft.contextResources.length + 1} 个文件` : `${draft.contextResources.length} 个文件`}
                    </div>
                    <div className="text-[12px] text-gray-500 mt-1 flex items-center gap-2">
                      {draft.contextResources.map(res => (
                        <span key={res.id} className="flex items-center gap-1"><FileText size={12}/> {res.type}</span>
                      ))}
                      {highlightedKey === 'resources' && (
                        <span className="flex items-center gap-1 text-blue-600 font-medium animate-in fade-in duration-200"><FileText size={12}/> +XLSX</span>
                      )}
                    </div>
                  </div>
                  <button className="text-[13px] text-blue-600 hover:text-blue-700 font-medium">继续上传</button>
                </div>

                {/* Deliverables */}
                <div className={cn(
                  "flex items-start justify-between rounded-xl p-4 transition-all",
                  highlightedKey === 'deliverables' ? "bg-blue-50/50 border-2 border-blue-300" : "bg-white border border-gray-200 hover:border-blue-200"
                )}>
                  <div>
                    <div className={cn(
                      "text-[12px] font-medium mb-1 flex items-center gap-2",
                      highlightedKey === 'deliverables' ? "text-blue-600" : "text-gray-500"
                    )}>
                      交付物
                      {highlightedKey === 'deliverables' && (
                        <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-medium animate-in fade-in zoom-in duration-200">
                          刚刚通过对话更新
                        </span>
                      )}
                    </div>
                    <div className="text-[14px] font-semibold text-gray-900">
                      {highlightedKey === 'deliverables' ? `${draft.deliverableRequirements.length + 1} 项` : `${draft.deliverableRequirements.length} 项`}
                    </div>
                    <div className="text-[12px] text-gray-500 mt-1">对象模型、字典、血缘、质量报告等</div>
                  </div>
                  <button className="text-[13px] text-blue-600 hover:text-blue-700 font-medium">调整</button>
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
          <div className="p-5 border-t border-[#E5E7EB] bg-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
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
