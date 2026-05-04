import React, { useState } from 'react';
import { Sparkles, User, ChevronRight, ChevronDown, Download, Send, AlertCircle, Maximize2, Table, PanelRight, TrendingUp, TrendingDown, Database, Copy, RefreshCw, Share2, HelpCircle, FileText, Code, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
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

const trendData = [
  { month: '25/05', value: 8500000 },
  { month: '25/06', value: 9200000 },
  { month: '25/07', value: 8800000 },
  { month: '25/08', value: 9500000 },
  { month: '25/09', value: 10200000 },
  { month: '25/10', value: 9800000 },
  { month: '25/11', value: 11000000 },
  { month: '25/12', value: 11500000 },
  { month: '26/01', value: 10800000 },
  { month: '26/02', value: 9900000 },
  { month: '26/03', value: 11412640 },
  { month: '26/04', value: 12486320 },
];

const contributionData = [
  { reason: '原材料采购增加', value: 820000, percentage: 76, color: '#3B82F6' },
  { reason: '新增大额订单', value: 160000, percentage: 15, color: '#60A5FA' },
  { reason: '单价上涨', value: 93680, percentage: 9, color: '#93C5FD' },
];

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
                <span className="font-semibold text-gray-900">李桐</span>
                <span>09:32</span>
              </div>
              <div className="text-[14px] text-gray-900 bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm max-w-xl leading-relaxed">
                上个月采购金额是多少？
              </div>
            </div>

            {/* Xino Response */}
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-2 text-[12px] text-gray-400">
                <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white">
                  <Sparkles size={11} />
                </div>
                <span className="font-semibold text-gray-900">Xino</span>
                <span>09:32</span>
              </div>
              
              {/* Text Description */}
              <div className="text-[14px] text-gray-800 leading-relaxed max-w-2xl px-1">
                <p className="mb-2">上个月采购金额为 ¥12,486,320，环比增长 8.6%，同比增长 12.3%。</p>
                <p className="text-gray-600">本次使用“已审核采购订单含税金额”口径，统计周期为 2026-04-01 至 2026-04-30。下面展示核心结果、趋势和数据依据。</p>
              </div>

              {/* Core Cards Grid */}
              <div className="w-full grid grid-cols-2 gap-4 mt-2">
                
                {/* Card 1: Core Answer */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-[14px] font-medium text-gray-600 mb-3">上个月采购金额</h3>
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-[36px] font-bold text-gray-900 tracking-tight leading-none">¥12,486,320</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[12px] font-semibold bg-green-50 text-green-700 border border-green-100">
                        <TrendingUp size={14} />
                        环比 +8.6%
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[12px] font-semibold bg-green-50 text-green-700 border border-green-100">
                        <TrendingUp size={14} />
                        同比 +12.3%
                      </span>
                    </div>
                  </div>
                  <div className="mt-8 pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-gray-500">统计周期</span>
                      <span className="text-gray-900 font-medium font-mono">2026-04-01 至 2026-04-30</span>
                    </div>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-gray-500">口径</span>
                      <span className="text-gray-900 font-medium">已审核采购订单含税金额</span>
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
                        <div className="text-[11px] text-gray-500 mb-0.5">本月 (04月)</div>
                        <div className="text-[14px] font-semibold text-gray-900">¥ 12,486,320</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-gray-500 mb-0.5">上月 (03月)</div>
                        <div className="text-[14px] font-semibold text-gray-900">¥ 11,412,640</div>
                      </div>
                      <div className="h-px w-full bg-gray-100 my-1"></div>
                      <div className="flex items-center gap-2">
                         <span className="text-[11px] text-gray-500">变化</span>
                         <span className="text-[13px] font-bold text-green-600">+¥ 1,073,680</span>
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
                    <span className="text-[12px] text-gray-700">4 月采购金额最高，近 3 个月持续上升</span>
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
                        <span className="font-mono text-gray-800 bg-gray-50 px-1.5 py-0.5 rounded">dwd_scm_purchase_order_line</span>
                      </div>
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-gray-500">字段</span>
                        <span className="font-mono text-gray-800">amount_tax_included</span>
                      </div>
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-gray-500">更新时间</span>
                        <span className="text-gray-800 font-mono">2026-05-04 09:30</span>
                      </div>
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-gray-500">可信度</span>
                        <span className="text-green-600 font-medium">高</span>
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
                    <button className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[13px] font-medium transition-colors">
                      为什么上涨？
                    </button>
                    <button className="px-3 py-1.5 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-lg text-[13px] transition-colors">
                      按供应商拆解
                    </button>
                    <button className="px-3 py-1.5 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-lg text-[13px] transition-colors">
                      看最近 30 天趋势
                    </button>
                    <button className="px-3 py-1.5 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-lg text-[13px] transition-colors">
                      看前 10 大供应商
                    </button>
                    <button className="px-3 py-1.5 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-lg text-[13px] transition-colors flex items-center gap-1">
                      <Download size={12} />
                      导出采购明细
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* ROUND 2 */}
            {/* User Query */}
            <div className="flex flex-col items-end gap-1.5 pt-4">
              <div className="flex items-center gap-2 text-[12px] text-gray-400">
                <span className="font-semibold text-gray-900">李桐</span>
                <span>09:34</span>
              </div>
              <div className="text-[14px] text-gray-900 bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm max-w-xl leading-relaxed">
                为什么本月采购金额上涨？
              </div>
            </div>

            {/* Xino Response */}
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-2 text-[12px] text-gray-400">
                <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white">
                  <Sparkles size={11} />
                </div>
                <span className="font-semibold text-gray-900">Xino</span>
                <span>09:34</span>
              </div>
              
              {/* Text Description */}
              <div className="text-[14px] text-gray-800 leading-relaxed max-w-2xl px-1">
                我从品类、供应商和大额订单三个角度做了归因分析。本月采购金额环比上涨 8.6%，主要由原材料采购增加驱动。
              </div>

              {/* Cards Grid Round 2 */}
              <div className="w-full grid grid-cols-2 gap-4 mt-2">
                
                {/* Reason Explanation */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm col-span-1">
                  <h3 className="text-[15px] font-semibold text-gray-900 mb-2">上涨原因归因结论</h3>
                  <p className="text-[13px] text-gray-600 mb-4 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                    本月采购金额环比上涨 <span className="font-bold text-blue-700">8.6%</span>，主要由<span className="font-semibold text-gray-900">原材料采购增加</span>驱动。
                  </p>
                  <div className="space-y-3">
                    <div className="flex gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px] font-bold shrink-0">1</div>
                      <p className="text-[13px] text-gray-800 pt-0.5">老供应商原材料采购金额增加 ¥820,000，贡献了 76% 的涨幅段。</p>
                    </div>
                    <div className="flex gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px] font-bold shrink-0">2</div>
                      <p className="text-[13px] text-gray-800 pt-0.5">新增 3 个大额测试设备采购订单，一次性金额达 ¥160,000。</p>
                    </div>
                    <div className="flex gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px] font-bold shrink-0">3</div>
                      <p className="text-[13px] text-gray-800 pt-0.5">核心供应商 A 级部件本月续签指导价单价平均上涨 5.2%。</p>
                    </div>
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
                    <h3 className="text-[14px] font-medium text-gray-900">导致上涨的采购订单明细（节选）</h3>
                    <button className="text-[12px] text-blue-600 font-medium hover:text-blue-700">查看全部</button>
                  </div>
                  <div className="p-4 bg-gray-50/50">
                    <div className="flex flex-wrap gap-2 mb-3">
                       <span className="px-2 py-0.5 rounded text-[11px] bg-white border border-gray-200 text-gray-600">时间 = 2026-04</span>
                       <span className="px-2 py-0.5 rounded text-[11px] bg-white border border-gray-200 text-gray-600">状态 = 已审核</span>
                    </div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-2.5 text-[12px] font-semibold text-gray-600">订单号</th>
                            <th className="px-4 py-2.5 text-[12px] font-semibold text-gray-600">供应商</th>
                            <th className="px-4 py-2.5 text-[12px] font-semibold text-gray-600">订单日期</th>
                            <th className="px-4 py-2.5 text-[12px] font-semibold text-gray-600 text-right">金额 (¥)</th>
                            <th className="px-4 py-2.5 text-[12px] font-semibold text-gray-600 border-l border-gray-200 text-center">状态</th>
                          </tr>
                        </thead>
                        <tbody className="text-[13px]">
                          <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-2.5 font-mono text-gray-900">PO-20260405-012</td>
                            <td className="px-4 py-2.5 text-gray-700">智造科技材料有限公司</td>
                            <td className="px-4 py-2.5 text-gray-500 font-mono">2026-04-05</td>
                            <td className="px-4 py-2.5 text-gray-900 font-medium text-right">245,000</td>
                            <td className="px-4 py-2.5 border-l border-gray-100 text-center"><span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-[11px] font-medium">已审核</span></td>
                          </tr>
                          <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-2.5 font-mono text-gray-900">PO-20260412-008</td>
                            <td className="px-4 py-2.5 text-gray-700">华东先进设备集团</td>
                            <td className="px-4 py-2.5 text-gray-500 font-mono">2026-04-12</td>
                            <td className="px-4 py-2.5 text-gray-900 font-medium text-right">160,000</td>
                            <td className="px-4 py-2.5 border-l border-gray-100 text-center"><span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-[11px] font-medium">已审核</span></td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-2.5 font-mono text-gray-900">PO-20260418-045</td>
                            <td className="px-4 py-2.5 text-gray-700">智造科技材料有限公司</td>
                            <td className="px-4 py-2.5 text-gray-500 font-mono">2026-04-18</td>
                            <td className="px-4 py-2.5 text-gray-900 font-medium text-right">182,500</td>
                            <td className="px-4 py-2.5 border-l border-gray-100 text-center"><span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-[11px] font-medium">已审核</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-3">
                     <button className="px-4 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md text-[12px] font-medium hover:bg-gray-50 shadow-sm transition-colors">生成深入分析报告</button>
                     <button className="px-4 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md text-[12px] font-medium hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-1"><Download size={14}/> 导出明细</button>
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
                    <span className="text-[14px] text-gray-900 font-medium">采购金额</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">时间范围</span>
                    <span className="text-[13px] text-gray-800 font-mono bg-gray-50 px-1.5 py-0.5 rounded w-fit">2026-04-01 至 2026-04-30</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">计算口径</span>
                    <span className="text-[13px] text-gray-800">已审核采购订单含税金额</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">统计范围</span>
                    <span className="text-[13px] text-gray-800 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full w-fit">供应链业务域</span>
                  </div>
                  <div className="flex flex-col gap-1 pt-1 mt-1 border-t border-gray-100">
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">筛选条件</span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[12px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded">订单状态 = 已审核</span>
                      <span className="text-[12px] bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded">订单类型 ≠ 作废</span>
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
                    <span className="text-[13px] text-gray-800 font-mono">supply_chain_prod</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">来源表</span>
                    <span className="text-[13px] text-gray-800 font-mono text-blue-600 cursor-pointer hover:underline">dwd_scm_purchase_order_line</span>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex flex-col gap-1 flex-1">
                       <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">来源字段</span>
                       <span className="text-[13px] text-gray-800 font-mono truncate">amount_tax_inc...</span>
                     </div>
                     <div className="flex flex-col gap-1 flex-1">
                       <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">时间字段</span>
                       <span className="text-[13px] text-gray-800 font-mono truncate">po_approved_da...</span>
                     </div>
                  </div>
                  <div className="pt-2 mt-2 border-t border-gray-100 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                       <span className="text-[12px] text-gray-500">更新时间</span>
                       <span className="text-[12px] text-gray-800 font-mono">2026-05-04 09:30</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[12px] text-gray-500">权限状态</span>
                       <span className="text-[12px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded font-medium">可查询</span>
                    </div>
                     <div className="flex items-center justify-between">
                       <span className="text-[12px] text-gray-500">数据质量</span>
                       <span className="text-[12px] text-gray-800">通过最近一次检查</span>
                    </div>
                     <div className="flex items-center justify-between">
                       <span className="text-[12px] text-gray-500">综合可信度</span>
                       <span className="text-[12px] text-green-600 font-bold flex items-center gap-1"><CheckCircle2 size={12}/> 高</span>
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
                         <li>匹配指标：<span className="font-medium text-gray-900">采购金额</span></li>
                         <li>确定时间：<span className="font-medium text-gray-900">上个月</span></li>
                         <li>选择事实表：<span className="font-mono text-[11px]">dwd_scm_purchase_order_line</span></li>
                         <li>应用过滤：<span className="font-mono text-[11px]">order_status = 'approved'</span></li>
                         <li>聚合方式：<span className="font-mono text-[11px]">SUM(amount_tax_included)</span></li>
                      </ol>
                    </div>
                    
                    <div className="mb-4">
                       <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block mb-1.5">SQL 摘要</span>
                       <div className="bg-[#1E293B] rounded-lg p-3 overflow-x-auto">
<pre className="text-[11px] text-[#E2E8F0] font-mono whitespace-pre-wrap leading-relaxed">
<span className="text-pink-400">SELECT</span> <span className="text-blue-300">SUM</span>(amount_tax_included) <span className="text-pink-400">AS</span> purchase_amount
<span className="text-pink-400">FROM</span> supply_chain_prod.dwd_scm_purchase_order_line
<span className="text-pink-400">WHERE</span> po_approved_date <span className="text-pink-400">BETWEEN</span> <span className="text-amber-300">'2026-04-01'</span> <span className="text-pink-400">AND</span> <span className="text-amber-300">'2026-04-30'</span>
  <span className="text-pink-400">AND</span> order_status = <span className="text-amber-300">'approved'</span>;
</pre>
                       </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200/60 grid grid-cols-2 gap-2 text-[12px]">
                       <div className="flex flex-col">
                          <span className="text-gray-500">执行耗时</span>
                          <span className="text-gray-900 font-medium font-mono">2.3s</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-gray-500">扫描行数</span>
                          <span className="text-gray-900 font-medium font-mono">184,320</span>
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
                            <div className="text-[12px] text-gray-600">1. 上个月采购金额是多少？</div>
                            <div className="text-[12px] font-medium text-gray-900">2. 为什么本月采购金额上涨？</div>
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
