import React, { useState } from 'react';
import { Sparkles, User, ChevronRight, ChevronDown, Download, Send, AlertCircle, Maximize2, Table, PanelRight, TrendingUp, TrendingDown, Database, Copy, RefreshCw, Share2, HelpCircle, FileText, Code, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import mockData from '@/mock/data-query.json';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const round1 = mockData.rounds[0];
const round2 = mockData.rounds[1];
const r1Resp = round1.xinoResponse;
const r2Resp = round2.xinoResponse;
const trendData = r1Resp.trend.data;
const contributionData = r2Resp.attribution.contributionData;
const sidebarCtx = mockData.sidebarContext;

export default function DataQueryState() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSqlExpanded, setIsSqlExpanded] = useState(false);
  const [isContextExpanded, setIsContextExpanded] = useState(false);
  const [inputVal, setInputVal] = useState('');

  return (
    <div className="flex h-full bg-[#F8FAFC]">
      {/* Center Execution Area */}
      <div className="flex-1 flex flex-col h-full relative border-r border-gray-200 min-w-0">
        
        {/* Top Header */}
        <div className="px-8 py-5 bg-white border-b border-gray-200 flex-shrink-0 flex items-start justify-between z-10 shadow-sm">
          <div>
            <h2 className="text-[20px] font-bold text-gray-900 mb-1.5">找数问数</h2>
            <p className="text-[13px] text-gray-500">用自然语言快速获取指标结果、趋势分析与数据依据</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-9 px-3 flex items-center justify-center gap-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors shadow-sm text-[13px] font-medium">
              <Copy size={15} />
              <span>复制</span>
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
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={cn("w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg transition-colors shadow-sm", isSidebarOpen ? "text-blue-600 bg-blue-50 border-blue-200" : "text-gray-600 hover:bg-gray-50")}
            >
              <PanelRight size={16} />
            </button>
          </div>
        </div>

        {/* Q&A Flow Area */}
        <div className="flex-1 overflow-y-auto w-full flex justify-center py-10 px-8 pb-32">
          <div className="w-full max-w-[840px] space-y-10">
            
            {/* ROUND 1 */}
            {/* User Query */}
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-2 text-[12px] text-gray-400">
                <span className="font-semibold text-gray-900">{mockData.user.name}</span>
                <span>{round1.userQuery.createdAt}</span>
              </div>
              <div className="text-[14px] text-gray-900 bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm max-w-xl leading-relaxed">
                {round1.userQuery.content}
              </div>
            </div>

            {/* Xino Response */}
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-2 text-[12px] text-gray-400">
                <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white">
                  <Sparkles size={11} />
                </div>
                <span className="font-semibold text-gray-900">Xino</span>
                <span>{r1Resp.createdAt}</span>
              </div>
              
              {/* Text Description */}
              <div className="text-[14px] text-gray-800 leading-relaxed max-w-2xl px-1">
                <p className="mb-2">{r1Resp.summary}</p>
                <p className="text-gray-600">{r1Resp.detail}</p>
              </div>

              {/* Core Cards Grid */}
              <div className="w-full grid grid-cols-2 gap-4 mt-2">
                
                {/* Card 1: Core Answer */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-[14px] font-medium text-gray-600 mb-3">{r1Resp.coreMetric.label}</h3>
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-[36px] font-bold text-gray-900 tracking-tight leading-none">{r1Resp.coreMetric.valueFormatted}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[12px] font-semibold bg-green-50 text-green-700 border border-green-100">
                        <TrendingUp size={14} />
                        {r1Resp.coreMetric.momChange.label}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[12px] font-semibold bg-green-50 text-green-700 border border-green-100">
                        <TrendingUp size={14} />
                        {r1Resp.coreMetric.yoyChange.label}
                      </span>
                    </div>
                  </div>
                  <div className="mt-8 pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-gray-500">统计周期</span>
                      <span className="text-gray-900 font-medium font-mono">{r1Resp.coreMetric.period}</span>
                    </div>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-gray-500">口径</span>
                      <span className="text-gray-900 font-medium">{r1Resp.coreMetric.calibre}</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Trend / Contrast */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col h-full">
                  <h3 className="text-[14px] font-medium text-gray-600 mb-4">采购金额趋势与对比</h3>
                  <div className="flex gap-6 h-full">
                    {/* Left stats */}
                    <div className="flex flex-col justify-center space-y-3 shrink-0">
                      <div>
                        <div className="text-[11px] text-gray-500 mb-0.5">{r1Resp.trend.currentMonth.label}</div>
                        <div className="text-[14px] font-semibold text-gray-900">{r1Resp.trend.currentMonth.valueFormatted}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-gray-500 mb-0.5">{r1Resp.trend.previousMonth.label}</div>
                        <div className="text-[14px] font-semibold text-gray-900">{r1Resp.trend.previousMonth.valueFormatted}</div>
                      </div>
                      <div className="h-px w-full bg-gray-100 my-1"></div>
                      <div className="flex items-center gap-2">
                         <span className="text-[11px] text-gray-500">变化</span>
                         <span className="text-[13px] font-bold text-green-600">{r1Resp.trend.change.valueFormatted}</span>
                      </div>
                    </div>
                    {/* Right Chart */}
                    <div className="flex-1 w-full min-w-0 border-l border-gray-100 pl-6 flex flex-col">
                       <span className="text-[11px] text-gray-500 mb-2 block">过去 12 个月趋势</span>
                       <div className="flex-1 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                              <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                labelStyle={{ color: '#4B5563', fontSize: '12px', marginBottom: '4px' }}
                                itemStyle={{ color: '#111827', fontSize: '13px', fontWeight: 600 }}
                                formatter={(value: number) => [`¥${value.toLocaleString()}`, '金额']}
                              />
                              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#2563EB' }} />
                            </LineChart>
                         </ResponsiveContainer>
                       </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-start gap-2">
                    <Sparkles size={14} className="text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-[12px] text-gray-700">{r1Resp.trend.insight}</span>
                  </div>
                </div>

                {/* Card 3: Data Source Summary */}
                <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-[14px] font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Database size={15} className="text-gray-400" />
                      数据依据说明
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-gray-500">表</span>
                        <span className="font-mono text-gray-800 bg-gray-50 px-1.5 py-0.5 rounded">{r1Resp.dataBasis.table}</span>
                      </div>
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-gray-500">字段</span>
                        <span className="font-mono text-gray-800">{r1Resp.dataBasis.field}</span>
                      </div>
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-gray-500">更新时间</span>
                        <span className="text-gray-800 font-mono">{r1Resp.dataBasis.updatedTime}</span>
                      </div>
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-gray-500">可信度</span>
                        <span className="text-green-600 font-medium">{r1Resp.dataBasis.confidence}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[12px] font-medium rounded-lg transition-colors">
                      查看完整来源
                    </button>
                    <button className="flex-1 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[12px] font-medium rounded-lg transition-colors">
                      查看 SQL
                    </button>
                  </div>
                </div>

                {/* Card 4: Recommended Questions */}
                <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm">
                  <h3 className="text-[14px] font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <HelpCircle size={15} className="text-blue-500" />
                    你还可以继续问
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {r1Resp.suggestions.map((suggestion, i) => (
                      <button key={suggestion} className={cn(
                        "px-3 py-1.5 rounded-lg text-[13px] transition-colors",
                        i === 0
                          ? "bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                      )}>
                        {suggestion === '导出采购明细' && <Download size={12} className="inline mr-1" />}
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* ROUND 2 */}
            {/* User Query */}
            <div className="flex flex-col items-end gap-1.5 pt-4">
              <div className="flex items-center gap-2 text-[12px] text-gray-400">
                <span className="font-semibold text-gray-900">{mockData.user.name}</span>
                <span>{round2.userQuery.createdAt}</span>
              </div>
              <div className="text-[14px] text-gray-900 bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm max-w-xl leading-relaxed">
                {round2.userQuery.content}
              </div>
            </div>

            {/* Xino Response */}
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-2 text-[12px] text-gray-400">
                <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white">
                  <Sparkles size={11} />
                </div>
                <span className="font-semibold text-gray-900">Xino</span>
                <span>{r2Resp.createdAt}</span>
              </div>

              {/* Text Description */}
              <div className="text-[14px] text-gray-800 leading-relaxed max-w-2xl px-1">
                {r2Resp.summary}
              </div>

              {/* Cards Grid Round 2 */}
              <div className="w-full grid grid-cols-2 gap-4 mt-2">
                
                {/* Reason Explanation */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm col-span-1">
                  <h3 className="text-[15px] font-semibold text-gray-900 mb-2">上涨原因归因结论</h3>
                  <p className="text-[13px] text-gray-600 mb-4 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                    {r2Resp.attribution.conclusion.split('8.6%').map((part, i, arr) =>
                      i < arr.length - 1 ? <React.Fragment key={i}>{part}<span className="font-bold text-blue-700">8.6%</span></React.Fragment> : part
                    )}
                  </p>
                  <div className="space-y-3">
                    {r2Resp.attribution.reasons.map((reason) => (
                      <div key={reason.index} className="flex gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px] font-bold shrink-0">{reason.index}</div>
                        <p className="text-[13px] text-gray-800 pt-0.5">{reason.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contribution Chart */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm col-span-1 flex flex-col">
                  <h3 className="text-[14px] font-medium text-gray-600 mb-4">贡献度拆解</h3>
                  <div className="flex-1 w-full min-h-[140px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={contributionData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="reason" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4B5563' }} width={100} />
                        <Tooltip
                          cursor={{ fill: '#F3F4F6' }}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          formatter={(value: number, name: string, props: any) => {
                            return [`¥${value.toLocaleString()} (${props.payload.percentage}%)`, '影响金额'];
                          }}
                        />
                        <Bar dataKey="value" barSize={24} radius={[0, 4, 4, 0]}>
                           {contributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Detail Table Fragment */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm col-span-2 overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-[14px] font-medium text-gray-900">{r2Resp.detailTable.title}</h3>
                    <button className="text-[12px] text-blue-600 font-medium hover:text-blue-700">查看全部</button>
                  </div>
                  <div className="p-4 bg-gray-50/50">
                    <div className="flex flex-wrap gap-2 mb-3">
                       {r2Resp.detailTable.filters.map((f) => (
                         <span key={f.label} className="px-2 py-0.5 rounded text-[11px] bg-white border border-gray-200 text-gray-600">{f.label} = {f.value}</span>
                       ))}
                    </div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            {r2Resp.detailTable.columns.map((col) => (
                              <th key={col} className={cn(
                                "px-4 py-2.5 text-[12px] font-semibold text-gray-600",
                                col === '金额 (¥)' ? "text-right" : col === '状态' ? "border-l border-gray-200 text-center" : ""
                              )}>{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="text-[13px]">
                          {r2Resp.detailTable.rows.map((row, i) => (
                            <tr key={row.orderNo} className={cn("hover:bg-gray-50 transition-colors", i < r2Resp.detailTable.rows.length - 1 && "border-b border-gray-100")}>
                              <td className="px-4 py-2.5 font-mono text-gray-900">{row.orderNo}</td>
                              <td className="px-4 py-2.5 text-gray-700">{row.supplier}</td>
                              <td className="px-4 py-2.5 text-gray-500 font-mono">{row.date}</td>
                              <td className="px-4 py-2.5 text-gray-900 font-medium text-right">{row.amount.toLocaleString()}</td>
                              <td className="px-4 py-2.5 border-l border-gray-100 text-center"><span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-[11px] font-medium">{row.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-3">
                     <button className="px-4 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md text-[12px] font-medium hover:bg-gray-50 shadow-sm transition-colors">{r2Resp.detailTable.actions[0]}</button>
                     <button className="px-4 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md text-[12px] font-medium hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-1"><Download size={14}/> {r2Resp.detailTable.actions[1]}</button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Global Bottom Input */ }
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC] to-transparent">
          <div className="max-w-[800px] mx-auto relative bg-white border border-gray-200 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex items-end p-2 transition-all focus-within:shadow-[0_4px_24px_rgba(37,99,235,0.12)] focus-within:border-blue-300">
            <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors shrink-0 mb-0.5">
              <FileText size={20} />
            </button>
            <textarea 
              rows={1}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="继续追问业务数据，或 @ 指标 / 维度 / 数据表 ..."
              className="flex-1 resize-none bg-transparent border-0 focus:ring-0 text-[15px] p-3 max-h-[160px] overflow-y-auto leading-relaxed text-gray-900 placeholder:text-gray-400 font-medium"
              style={{ minHeight: '48px' }}
            />
            <div className="flex items-center gap-1.5 p-1 mb-0.5 shrink-0">
              <button 
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-sm",
                  inputVal.trim() 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-blue-600 text-white"
                )}
              >
                <Send size={18} className={inputVal.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
              </button>
            </div>
          </div>
          <div className="text-center mt-3">
             <span className="text-[11px] text-gray-400">内容由 Semovix Xino 智能生成，请核对重要数据结果。</span>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Answer Basis */}
      {isSidebarOpen && (
        <div className="w-[360px] bg-white flex flex-col flex-shrink-0 shadow-[-1px_0_0_#E5E7EB] z-10 animate-in slide-in-from-right-2 duration-300 relative border-l border-gray-200">
           <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-3 bg-[#F8FAFC]/50 shrink-0">
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200/50 transition-colors"
                title="关闭侧边栏"
              >
                <PanelRight size={16} />
              </button>
              <h3 className="font-semibold text-gray-900 flex-1 text-[15px]">答案依据</h3>
           </div>
           
           <div className="flex-1 overflow-y-auto p-5 space-y-5">
              
              {/* Box 1: Current Metric (Default Open) */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <h4 className="font-semibold text-[13px] text-gray-900 leading-none">当前口径</h4>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">分析指标</span>
                    <span className="text-[14px] text-gray-900 font-medium">{sidebarCtx.calibre.metric}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">时间范围</span>
                    <span className="text-[13px] text-gray-800 font-mono bg-gray-50 px-1.5 py-0.5 rounded w-fit">{sidebarCtx.calibre.timeRange}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">计算口径</span>
                    <span className="text-[13px] text-gray-800">{sidebarCtx.calibre.calibre}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">统计范围</span>
                    <span className="text-[13px] text-gray-800 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full w-fit">{sidebarCtx.calibre.scope}</span>
                  </div>
                  <div className="flex flex-col gap-1 pt-1 mt-1 border-t border-gray-100">
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">筛选条件</span>
                    <div className="flex flex-wrap gap-1.5">
                      {sidebarCtx.calibre.filters.map((f) => (
                        <span key={f.label} className={cn(
                          "text-[12px] px-2 py-0.5 rounded",
                          f.type === 'warning' ? "bg-red-50 text-red-700 border border-red-100" : "bg-gray-100 text-gray-700"
                        )}>{f.label} = {f.value}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 2: Data Source (Default Open) */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <h4 className="font-semibold text-[13px] text-gray-900 leading-none">数据依据</h4>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">数据源</span>
                    <span className="text-[13px] text-gray-800 font-mono">{sidebarCtx.dataSource.name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">来源表</span>
                    <span className="text-[13px] text-gray-800 font-mono text-blue-600 cursor-pointer hover:underline">{sidebarCtx.dataSource.table}</span>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex flex-col gap-1 flex-1">
                       <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">来源字段</span>
                       <span className="text-[13px] text-gray-800 font-mono truncate">{sidebarCtx.dataSource.field}</span>
                     </div>
                     <div className="flex flex-col gap-1 flex-1">
                       <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">时间字段</span>
                       <span className="text-[13px] text-gray-800 font-mono truncate">{sidebarCtx.dataSource.timeField}</span>
                     </div>
                  </div>
                  <div className="pt-2 mt-2 border-t border-gray-100 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                       <span className="text-[12px] text-gray-500">更新时间</span>
                       <span className="text-[12px] text-gray-800 font-mono">{sidebarCtx.dataSource.updatedTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[12px] text-gray-500">权限状态</span>
                       <span className="text-[12px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded font-medium">{sidebarCtx.dataSource.permission}</span>
                    </div>
                     <div className="flex items-center justify-between">
                       <span className="text-[12px] text-gray-500">数据质量</span>
                       <span className="text-[12px] text-gray-800">{sidebarCtx.dataSource.quality}</span>
                    </div>
                     <div className="flex items-center justify-between">
                       <span className="text-[12px] text-gray-500">综合可信度</span>
                       <span className="text-[12px] text-green-600 font-bold flex items-center gap-1"><CheckCircle2 size={12}/> {sidebarCtx.dataSource.confidence}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 3: Query Plan / SQL (Default Collapsed) */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                <button 
                  onClick={() => setIsSqlExpanded(!isSqlExpanded)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-semibold text-[13px] text-gray-900 leading-none">查询计划 / SQL</h4>
                  <ChevronDown size={16} className={cn("text-gray-400 transition-transform duration-200", isSqlExpanded && "rotate-180")} />
                </button>
                
                {!isSqlExpanded && (
                  <div className="px-4 pb-3">
                    <p className="text-[12px] text-gray-500">使用时间过滤、字段裁剪和指标口径匹配生成查询。</p>
                  </div>
                )}
                
                {isSqlExpanded && (
                  <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                    <div className="mb-4 space-y-1">
                      <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block mb-1.5">查询步骤</span>
                      <ol className="text-[12px] text-gray-700 list-decimal pl-4 space-y-1">
                         {r1Resp.sqlPlan.steps.map((step) => (
                           <li key={step}>{step}</li>
                         ))}
                      </ol>
                    </div>
                    
                    <div className="mb-4">
                       <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block mb-1.5">SQL 摘要</span>
                       <div className="bg-[#1E293B] rounded-lg p-3 overflow-x-auto">
<pre className="text-[11px] text-[#E2E8F0] font-mono whitespace-pre-wrap leading-relaxed">{r1Resp.sqlPlan.sql}</pre>
                       </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200/60 grid grid-cols-2 gap-2 text-[12px]">
                       <div className="flex flex-col">
                          <span className="text-gray-500">执行耗时</span>
                          <span className="text-gray-900 font-medium font-mono">{r1Resp.sqlPlan.executionTime}</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-gray-500">扫描行数</span>
                          <span className="text-gray-900 font-medium font-mono">{r1Resp.sqlPlan.scannedRows.toLocaleString()}</span>
                       </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Box 4: Context (Default Collapsed) */}
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
                            {mockData.rounds.map((round, i) => (
                              <div key={round.id} className={cn("text-[12px]", i === mockData.rounds.length - 1 ? "font-medium text-gray-900" : "text-gray-600")}>{i + 1}. {round.userQuery.content}</div>
                            ))}
                         </div>
                       </div>
                       <div className="pt-3 border-t border-gray-200/60">
                         <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block mb-1">当前分析方向</span>
                         <span className="text-[13px] font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded inline-block">采购金额变化归因</span>
                       </div>
                    </div>
                  </div>
                )}
              </div>

           </div>
        </div>
      )}
    </div>
  );
}
