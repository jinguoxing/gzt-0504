import React, { useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import mockData from '@/mock/data-query.json';
import DataQaCompletedView from '@/components/data-qa/DataQaCompletedView';
import DataQaHeader from '@/components/data-qa/DataQaHeader';
import QuestionThread from '@/components/data-qa/QuestionThread';
import FollowupInputBar from '@/components/data-qa/FollowupInputBar';
import AnswerEvidenceSidebar, { RightPanelMode } from '@/components/data-qa/AnswerEvidenceSidebar';
import type { DataQaSession, DataQaMessage, DataQaResultBlock, DataQaResultAction } from '@/types';

const initialSession = mockData as unknown as DataQaSession;
const clarificationData = (mockData as any).clarificationExample;
const completedData = (mockData as any).completedExample;
const fieldReview = (mockData as any).fieldReview;

/** Detect query type from the user's question text */
function detectQueryType(text: string): string {
  if (text.includes('明细') || text.includes('导出') || text.includes('所有')) return 'detail_export';
  if (text.includes('分析') || text.includes('为什么') || text.includes('报告')) return 'analysis_plan';
  if (text.includes('排名') || text.includes('前') || text.includes('Top') || text.includes('最高') || text.includes('最低')) return 'ranking';
  if (text.includes('拆解') || text.includes('按')) return 'breakdown';
  if (text.includes('怎么样')) return 'clarification';
  return 'single_metric';
}

/** Generate mock messages based on query type and user question */
function buildMockMessages(question: string, queryType: string): DataQaMessage[] {
  const now = new Date();
  const displayTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const userMsg: DataQaMessage = {
    id: 'msg_user_001',
    role: 'user',
    createdAt: now.toISOString(),
    displayTime,
    text: question,
  };

  if (queryType === 'detail_export') {
    return [
      userMsg,
      {
        id: 'msg_xino_001',
        role: 'xino',
        createdAt: now.toISOString(),
        displayTime,
        text: '这个查询涉及较大数据量，我先做一个查询预检，确认后继续。',
        resultBlocks: [{
          id: 'rb_preflight_001',
          type: 'query_preflight' as any,
          title: '查询预检',
          data: {
            estimatedRows: 12400000,
            estimatedTime: '约 45 秒',
            tables: 'dwd_scm_purchase_order_line',
            permissionStatus: '可查询，导出受限',
            riskWarning: '数据量较大，建议先缩小时间范围',
          },
        }],
      },
    ];
  }

  if (queryType === 'analysis_plan') {
    return [
      userMsg,
      {
        id: 'msg_xino_001',
        role: 'xino',
        createdAt: now.toISOString(),
        displayTime,
        text: '这是一个复杂的分析型问题，我先制定一个分析计划供你确认。',
        resultBlocks: [{
          id: 'rb_analysis_plan_001',
          type: 'analysis_plan' as any,
          title: '分析计划',
          data: {
            analysisDirections: [
              '时间趋势：查看近 12 个月采购金额变化',
              '品类拆解：识别贡献最大的采购品类',
              '供应商拆解：识别金额增长最大的供应商',
              '大额订单：检查是否有异常大额订单',
            ],
            estimatedTime: '约 20 秒',
            outputContent: '原因结论、贡献度分析、明细证据、可导出报告',
          },
        }],
      },
    ];
  }

  if (queryType === 'ranking') {
    return [
      userMsg,
      {
        id: 'msg_xino_001',
        role: 'xino',
        createdAt: now.toISOString(),
        displayTime,
        text: '根据采购金额排名，以下是前 10 大供应商：',
        resultBlocks: [{
          id: 'rb_ranking_001',
          type: 'ranking' as any,
          title: '供应商采购金额排名',
          data: {
            metricName: '采购金额',
            period: '2026-04-01 至 2026-04-30',
            items: [
              { rank: 1, name: '华东先进设备集团', value: '¥3,420,000', share: '27.4%', momChange: '+12.3%' },
              { rank: 2, name: '智造科技材料有限公司', value: '¥2,850,000', share: '22.8%', momChange: '+8.1%' },
              { rank: 3, name: '南方精密零部件厂', value: '¥1,960,000', share: '15.7%', momChange: '-3.2%' },
              { rank: 4, name: '北方钢铁贸易公司', value: '¥1,520,000', share: '12.2%', momChange: '+15.6%' },
              { rank: 5, name: '中信化工集团', value: '¥1,230,000', share: '9.9%', momChange: '+2.4%' },
              { rank: 6, name: '深圳电子元器件厂', value: '¥680,000', share: '5.4%', momChange: '-1.8%' },
              { rank: 7, name: '成都机械制造有限公司', value: '¥350,000', share: '2.8%', momChange: '+22.1%' },
              { rank: 8, name: '武汉光电科技公司', value: '¥210,000', share: '1.7%', momChange: '+5.5%' },
              { rank: 9, name: '杭州智能装备公司', value: '¥166,320', share: '1.3%', momChange: '-8.2%' },
              { rank: 10, name: '重庆新材料科技', value: '¥100,000', share: '0.8%', momChange: '+0.6%' },
            ],
          },
        }],
      },
    ];
  }

  if (queryType === 'breakdown') {
    return [
      userMsg,
      {
        id: 'msg_xino_001',
        role: 'xino',
        createdAt: now.toISOString(),
        displayTime,
        text: '按维度拆解采购金额如下：',
        resultBlocks: [{
          id: 'rb_breakdown_001',
          type: 'breakdown' as any,
          title: '按供应商拆解采购金额',
          data: {
            dimensionName: '供应商',
            metricName: '采购金额',
            period: '2026-04-01 至 2026-04-30',
            items: [
              { name: '华东先进设备集团', value: '¥3,420,000', share: 27.4, trend: 'up', change: '+12.3%' },
              { name: '智造科技材料有限公司', value: '¥2,850,000', share: 22.8, trend: 'up', change: '+8.1%' },
              { name: '南方精密零部件厂', value: '¥1,960,000', share: 15.7, trend: 'down', change: '-3.2%' },
              { name: '北方钢铁贸易公司', value: '¥1,520,000', share: 12.2, trend: 'up', change: '+15.6%' },
              { name: '中信化工集团', value: '¥1,230,000', share: 9.9, trend: 'up', change: '+2.4%' },
            ],
          },
        }],
      },
    ];
  }

  // Default: single_metric — use the standard mock data
  return [...initialSession.messages];
}

export default function DataQueryState() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const panel = searchParams.get('panel');
  const mode = searchParams.get('mode');
  const status = searchParams.get('status');
  const queryQuestion = searchParams.get('q') ? decodeURIComponent(searchParams.get('q')!) : null;

  // Try to read session from sessionStorage
  const sessionData = (() => {
    if (!sessionId || sessionId === 'dqa_001') return null;
    try {
      const raw = sessionStorage.getItem(`data-query-session:${sessionId}`);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  const originalQuestion = sessionData?.originalQuestion || queryQuestion;
  const queryType = originalQuestion ? detectQueryType(originalQuestion) : 'single_metric';

  // Completed mode — render dedicated completed view
  const [showCompleted, setShowCompleted] = useState(status === 'completed');
  if (showCompleted) {
    return (
      <DataQaCompletedView
        data={completedData}
        onResume={() => {
          setShowCompleted(false);
          setSearchParams({}, { replace: true });
        }}
      />
    );
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>(
    (panel as RightPanelMode) || 'evidence'
  );
  const [inputVal, setInputVal] = useState('');
  const [isXinoTyping, setIsXinoTyping] = useState(false);
  const [exportState, setExportState] = useState<'idle' | 'exporting' | 'done'>('idle');
  const [copied, setCopied] = useState(false);
  const [isClarifying, setIsClarifying] = useState(mode === 'clarify');

  // Mutable messages — initialized from mock, overridden by real question if available
  const [messages, setMessages] = useState<DataQaMessage[]>(() =>
    mode === 'clarify'
      ? [
          {
            id: 'msg_clarify_user',
            role: 'user' as const,
            createdAt: new Date().toISOString(),
            displayTime: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
            text: clarificationData?.userQuestion || '这个月销售怎么样？',
          },
          {
            id: 'msg_clarify_xino',
            role: 'xino' as const,
            createdAt: new Date().toISOString(),
            displayTime: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
            text: clarificationData?.xinoText || '这个问题涉及多个可能口径，请确认你想查看的指标。',
            resultBlocks: [clarificationData?.clarificationBlock],
          },
        ]
      : originalQuestion && sessionId !== 'dqa_001'
        ? buildMockMessages(originalQuestion, queryType)
        : [...initialSession.messages]
  );
  const evidence = initialSession.evidence;

  const threadEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => threadEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, []);

  // ─── Action handler ─────────────────────────────────────
  const handleAction = useCallback((action: DataQaResultAction, _block: DataQaResultBlock) => {
    switch (action.actionType) {
      case 'open_sql':
        setIsSidebarOpen(true);
        setRightPanelMode('sql_detail');
        break;
      case 'open_source':
        setIsSidebarOpen(true);
        setRightPanelMode('source_detail');
        break;
      case 'export':
        setExportState('exporting');
        setTimeout(() => setExportState('done'), 2000);
        break;
      case 'generate_report':
        setExportState('exporting');
        setTimeout(() => setExportState('done'), 2500);
        break;
      case 'open_detail':
        setIsSidebarOpen(true);
        setRightPanelMode('row_detail');
        break;
      default:
        break;
    }
  }, []);

  // ─── Clarification confirm handler ──────────────────────
  const handleClarify = useCallback((_selections: { metric: string; timeRange: string; scope?: string }) => {
    setIsClarifying(false);
    setMessages([...initialSession.messages]);
    scrollToBottom();
  }, [scrollToBottom]);

  const handleClarifyCancel = useCallback(() => {
    setIsClarifying(false);
    setMessages([]);
  }, []);

  // ─── Followup / submit handler ──────────────────────────
  const handleFollowup = useCallback((question: string) => {
    if (isXinoTyping) return;

    const now = new Date();
    const displayTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const userMsg: DataQaMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      createdAt: now.toISOString(),
      displayTime,
      text: question,
    };
    setMessages(prev => [...prev, userMsg]);
    scrollToBottom();

    setIsXinoTyping(true);
    setTimeout(() => {
      const xinoMsg: DataQaMessage = {
        id: `msg_xino_${Date.now()}`,
        role: 'xino',
        createdAt: now.toISOString(),
        displayTime,
        text: generateMockResponse(question),
        resultBlocks: generateMockResultBlocks(question),
      };
      setMessages(prev => [...prev, xinoMsg]);
      setIsXinoTyping(false);
      scrollToBottom();
    }, 1200 + Math.random() * 800);
  }, [isXinoTyping, scrollToBottom]);

  const handleSubmit = () => {
    const text = inputVal.trim();
    if (!text || isXinoTyping) return;
    setInputVal('');
    handleFollowup(text);
  };

  // ─── Header action handlers ─────────────────────────────
  const handleCopy = () => {
    const text = messages.map(m => `${m.role === 'user' ? '你' : 'Xino'}: ${m.text}`).join('\n\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex h-full bg-[#F8FAFC]">
      {/* Center Execution Area */}
      <div className="flex-1 flex flex-col h-full relative border-r border-gray-200 min-w-0">

        <DataQaHeader
          copied={copied}
          onCopy={handleCopy}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Export success toast */}
        {exportState === 'done' && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-[13px] font-medium px-4 py-2.5 rounded-xl shadow-lg">
            <CheckCircle2 size={16} />
            导出完成：采购订单明细.xlsx
            <button onClick={() => setExportState('idle')} className="ml-2 text-green-500 hover:text-green-700">✕</button>
          </div>
        )}

        <QuestionThread
          messages={messages}
          isXinoTyping={isXinoTyping}
          onAction={handleAction}
          onFollowup={handleFollowup}
          onClarify={handleClarify}
          onClarifyCancel={handleClarifyCancel}
          threadEndRef={threadEndRef}
          userName={initialSession.createdBy.name}
        />

        {/* Bottom Input — hidden during clarification */}
        {!isClarifying && (
          <FollowupInputBar
            value={inputVal}
            onChange={setInputVal}
            onSubmit={handleSubmit}
            disabled={isXinoTyping}
          />
        )}
      </div>

      {/* Right Sidebar — hidden during clarification */}
      {isSidebarOpen && !isClarifying && (
        <AnswerEvidenceSidebar
          evidence={evidence}
          fieldReview={fieldReview}
          panelMode={rightPanelMode}
          onPanelModeChange={setRightPanelMode}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

// ─── Mock response generators ──────────────────────────────

function generateMockResponse(question: string): string {
  if (question.includes('供应商')) return '按供应商维度拆解后，采购金额分布如下：';
  if (question.includes('趋势')) return '最近 30 天的采购金额趋势呈现先升后稳的走势。';
  if (question.includes('为什么') || question.includes('上涨') || question.includes('下降'))
    return '我从多个维度进行了归因分析，主要原因如下：';
  if (question.includes('导出')) return '正在为您导出采购明细数据。';
  return `关于「${question.slice(0, 30)}」，我已查询到相关结果。`;
}

function generateMockResultBlocks(question: string): DataQaResultBlock[] {
  if (question.includes('供应商')) {
    return [
      {
        id: `rb_dyn_${Date.now()}_1`,
        type: 'data_table',
        title: '按供应商拆解采购金额',
        data: {
          filters: ['时间=2026-04'],
          columns: [
            { key: 'supplier', label: '供应商' },
            { key: 'amount', label: '采购金额' },
            { key: 'share', label: '占比' },
          ],
          rows: [
            { supplier: '供应商 A', amount: '¥4,200,000', share: '33.6%' },
            { supplier: '供应商 B', amount: '¥3,100,000', share: '24.8%' },
            { supplier: '供应商 C', amount: '¥2,500,000', share: '20.0%' },
          ],
          total: 15,
          previewLimit: 3,
        },
        actions: [
          { id: `act_${Date.now()}_1`, label: '导出明细', actionType: 'export' as const },
        ],
      },
      {
        id: `rb_dyn_${Date.now()}_2`,
        type: 'recommendation',
        title: '你还可以继续问',
        data: { items: ['供应商 A 采购明细', '同比变化', '供应商评分'] },
      },
    ];
  }

  return [
    {
      id: `rb_dyn_${Date.now()}_1`,
      type: 'recommendation' as const,
      title: '你还可以继续问',
      data: { items: ['按供应商拆解', '看趋势变化', '导出明细'] },
    },
  ];
}
