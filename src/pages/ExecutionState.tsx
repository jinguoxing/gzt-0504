import React, { useState } from 'react';
import { Share2, MoreHorizontal, User, Sparkles, CheckCircle2, ChevronRight, ChevronDown, Download, Send, FileText, Database, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ExecutionState() {
  const [activeTab, setActiveTab] = useState<'plan' | 'detail'>('plan');
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isPlanExpanded, setIsPlanExpanded] = useState(true);

  return (
    <div className="flex h-full bg-[#F8FAFC]">
      {/* Center Execution Area */}
      <div className="flex-1 flex flex-col h-full relative border-r border-[#E5E7EB] min-w-0">
        {/* Task Header */}
        <div className="px-8 py-5 bg-white border-b border-[#E5E7EB] flex-shrink-0 flex items-start justify-between z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-[20px] font-bold text-gray-900 truncate max-w-lg">供应链语义治理闭环任务</h2>
              <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[12px] font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                执行中
              </span>
            </div>
            <div className="flex items-center gap-4 text-[13px] text-gray-500">
              <span>项目：供应链语义治理项目</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>创建人：李桐</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>当前阶段：<span className="font-medium text-gray-700">5 / 8</span></span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>整体进度：<span className="font-medium text-gray-700">78%</span></span>
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
          </div>
        </div>

        {/* Task Stream Area */}
        <div className="flex-1 overflow-y-auto w-full flex justify-center py-8">
          <div className="w-full max-w-[800px] px-6 space-y-6">
            
            {/* Completed Stages Strip */}
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors shadow-sm mb-6">
              <div className="flex items-center gap-4 text-[13px] text-gray-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>选择与采集</span>
                </div>
                <ChevronRight size={14} className="text-gray-300" />
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>Schema 扫描</span>
                </div>
                <ChevronRight size={14} className="text-gray-300" />
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>业务表识别</span>
                </div>
                <ChevronRight size={14} className="text-gray-300" />
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>字段候选生成</span>
                </div>
              </div>
              <span className="text-[12px] text-gray-400 font-medium">已完成</span>
            </div>

            {/* Task Focus Card */}
            <div className="bg-white border-2 border-blue-200 rounded-xl p-5 shadow-[0_4px_20px_rgba(37,99,235,0.05)] mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-[12px] font-bold text-blue-600 uppercase tracking-wider">当前任务焦点</div>
              </div>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <h3 className="text-[20px] font-bold text-gray-900 mb-1">字段语义理解</h3>
                  <div className="text-[13px] text-gray-500">阶段 5 / 8</div>
                </div>
                <div className="text-[32px] font-bold text-blue-600 leading-none">78%</div>
              </div>
              <p className="text-[14px] text-gray-700 bg-blue-50/50 rounded-lg p-3 border border-blue-100/50 mb-5">
                已自动理解 <span className="font-semibold text-gray-900">3,812</span> 个字段，仍有 <span className="font-semibold text-amber-600">326</span> 个待确认字段与 <span className="font-semibold text-red-600">41</span> 个冲突字段，需要人工确认后继续推进。
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold transition-colors shadow-sm">
                  查看冲突字段
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-[13px] font-semibold transition-colors shadow-sm">
                  批量确认高置信字段
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-[13px] font-semibold transition-colors shadow-sm">
                  继续生成对象模型
                </button>
              </div>
            </div>

            {/* Task Flow Messages */}
            <div className="space-y-6 pt-2">
              {/* User Message */}
              <div className="flex flex-col items-end w-full mb-6">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[12px] text-gray-400">09:45</span>
                  <span className="font-semibold text-[14px] text-gray-900">李桐</span>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 ml-1">
                    <User size={16} />
                  </div>
                </div>
                <div className="text-[15px] text-gray-800 leading-relaxed text-right max-w-xl mr-11">
                  请继续推进字段语义理解，并重点识别冲突字段。
                </div>
              </div>

              {/* Xino Message */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-sm">
                  <Sparkles size={16} />
                </div>
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-semibold text-[14px] text-gray-900">Xino</span>
                    <span className="text-[12px] text-gray-400">09:46</span>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase font-bold tracking-wide">执行中</span>
                  </div>
                  <div className="text-[15px] text-gray-800 leading-relaxed mb-3">
                    正在进行字段语义理解与冲突检测，已解析字段 4,920 个，已理解 3,812 个。
                  </div>
                  <div className="w-full max-w-sm h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-blue-500 rounded-full w-[78%]"></div>
                  </div>
                  <div className="text-[12px] text-gray-500">字段解析 100% / 语义理解 78% / 冲突检测 62%</div>
                </div>
              </div>
            </div>

            {/* Stage Result Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm mt-8 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                <h4 className="font-bold text-[16px] text-gray-900">字段语义理解结果</h4>
                <p className="text-[13px] text-gray-600 mt-1">
                  本阶段已完成大部分字段的语义理解，高置信字段可批量确认，冲突字段建议优先处理。
                </p>
              </div>
              
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <div className="text-[24px] font-bold text-gray-900">3,812</div>
                    <div className="text-[12px] font-medium text-gray-500 mt-0.5">自动通过字段</div>
                  </div>
                  <div className="w-px h-10 bg-gray-200"></div>
                  <div className="flex-1">
                    <div className="text-[24px] font-bold text-amber-600">326</div>
                    <div className="text-[12px] font-medium text-gray-500 mt-0.5">待确认字段</div>
                  </div>
                  <div className="w-px h-10 bg-gray-200"></div>
                  <div className="flex-1">
                    <div className="text-[24px] font-bold text-red-600">41</div>
                    <div className="text-[12px] font-medium text-gray-500 mt-0.5">冲突字段</div>
                  </div>
                  <div className="w-px h-10 bg-gray-200"></div>
                  <div className="flex-1">
                    <div className="text-[24px] font-bold text-gray-400">37</div>
                    <div className="text-[12px] font-medium text-gray-500 mt-0.5">异常字段</div>
                  </div>
                  <div className="w-px h-10 bg-gray-200"></div>
                  <div className="flex-1">
                    <div className="text-[24px] font-bold text-gray-400">704</div>
                    <div className="text-[12px] font-medium text-gray-500 mt-0.5">建议忽略字段</div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200">
                      <th className="px-5 py-3 text-[12px] font-semibold text-gray-500">字段名</th>
                      <th className="px-5 py-3 text-[12px] font-semibold text-gray-500">推断语义</th>
                      <th className="px-5 py-3 text-[12px] font-semibold text-gray-500">置信度</th>
                      <th className="px-5 py-3 text-[12px] font-semibold text-gray-500">来源</th>
                      <th className="px-5 py-3 text-[12px] font-semibold text-gray-500 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { field: 'po_status', semantic: '采购订单状态', conf: '0.97', confW: 'w-[97%]', source: '业务词典 + 规则推断' },
                      { field: 'supplier_code', semantic: '供应商编码', conf: '0.96', confW: 'w-[96%]', source: '业务词业务 + 相似匹配' },
                      { field: 'wh_id', semantic: '仓库ID', conf: '0.93', confW: 'w-[93%]', source: '业务词典 + 规则推断' },
                      { field: 'create_dt', semantic: '创建日期', conf: '0.89', confW: 'w-[89%]', source: '规则推断' },
                    ].map((row, i) => (
                      <tr 
                        key={i} 
                        className={cn(
                          "transition-colors cursor-pointer",
                          selectedRow?.field === row.field ? "bg-blue-50/50" : "hover:bg-gray-50"
                        )}
                        onClick={() => setSelectedRow(row)}
                      >
                        <td className="px-5 py-3.5 text-[13px] font-medium text-blue-600">{row.field}</td>
                        <td className="px-5 py-3.5 text-[13px] font-semibold text-gray-900">{row.semantic}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2 w-24">
                            <span className="text-[13px] font-medium text-gray-700 w-8">{row.conf}</span>
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full bg-green-500 rounded-full ${row.confW}`}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-[12px] text-gray-500">{row.source}</td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="px-3 py-1 bg-green-50 hover:bg-green-100 text-green-700 text-[12px] font-semibold rounded transition-colors">确认</button>
                            <button className="px-3 py-1 bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-600 text-gray-600 text-[12px] font-semibold rounded transition-colors">修改</button>
                            <button className="px-3 py-1 bg-white text-gray-400 hover:text-gray-600 text-[12px] font-semibold rounded transition-colors">忽略</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-center">
                <button className="text-[13px] text-gray-500 hover:text-gray-900 font-medium transition-colors">
                  查看全部 4,920 个字段 
                </button>
              </div>
            </div>

            <div className="h-10"></div>
          </div>
        </div>

        {/* Bottom Input Area */}
        <div className="p-4 bg-white border-t border-[#E5E7EB] flex-shrink-0 flex flex-col items-center">
          <div className="w-full max-w-[800px]">
            {/* Quick Actions */}
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
      <div className="w-[360px] bg-white flex flex-col flex-shrink-0 shadow-[-1px_0_0_#E5E7EB] z-10">
        {selectedRow ? (
          <div className="flex flex-col h-full animate-in slide-in-from-right-2 duration-200">
            <div className="px-4 py-4 border-b border-gray-200 flex items-center gap-3 flex-shrink-0">
               <button 
                 onClick={() => setSelectedRow(null)} 
                 className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 transition-colors"
               >
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
                       {(parseFloat(selectedRow.conf) * 100).toFixed(0)}%
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
        ) : (
          <div className="flex flex-col h-full">
            {/* Tabs */}
            <div className="flex border-b border-[#E5E7EB] flex-shrink-0">
          <button 
            onClick={() => setActiveTab('plan')}
            className={cn(
              "flex-1 py-4 text-[14px] transition-colors",
              activeTab === 'plan' ? "font-semibold text-blue-600 border-b-2 border-blue-600" : "font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent"
            )}
          >
            任务计划
          </button>
          <button 
            onClick={() => setActiveTab('detail')}
            className={cn(
              "flex-1 py-4 text-[14px] transition-colors",
              activeTab === 'detail' ? "font-semibold text-blue-600 border-b-2 border-blue-600" : "font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent"
            )}
          >
            任务详情
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto w-full">
          <div className="p-6 space-y-8">
            
            {activeTab === 'plan' ? (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Plan Progress & Stages */}
                <div>
                  <div 
                    className="flex items-center justify-between mb-2 cursor-pointer group"
                    onClick={() => setIsPlanExpanded(!isPlanExpanded)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-gray-900 tracking-wide uppercase group-hover:text-blue-600 transition-colors">整体进度</span>
                      <ChevronDown size={14} className={cn("text-gray-400 group-hover:text-blue-500 transition-transform duration-200", isPlanExpanded ? "rotate-180" : "")} />
                    </div>
                    <span className="text-[14px] font-bold text-blue-600">78%</span>
                  </div>
                  <div className={cn("w-full h-2 bg-gray-100 rounded-full overflow-hidden transition-all", isPlanExpanded && "mb-6")}>
                    <div className="h-full bg-blue-500 rounded-full w-[78%]"></div>
                  </div>

                  {isPlanExpanded && (
                    <div className="relative animate-in slide-in-from-top-2 duration-300">
                      <div className="absolute left-[9px] top-4 bottom-8 w-px bg-gray-200"></div>
                      <ul className="space-y-5 relative">
                        {[
                          { title: '1. 选择与采集', status: 'done' },
                          { title: '2. Schema 扫描', status: 'done' },
                          { title: '3. 业务表识别', status: 'done' },
                          { title: '4. 字段候选生成', status: 'done' },
                          { title: '5. 字段语义理解', status: 'active' },
                          { title: '6. 业务对象生成', status: 'pending' },
                          { title: '7. 血缘与影响分析', status: 'pending' },
                          { title: '8. 质量校验与校准', status: 'pending' },
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 relative">
                            {item.status === 'done' && (
                              <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white flex-shrink-0 mt-0.5 z-10 shadow-sm">
                                <CheckCircle2 size={12} strokeWidth={3} />
                              </div>
                            )}
                            {item.status === 'active' && (
                              <div className="w-5 h-5 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5 z-10">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              </div>
                            )}
                            {item.status === 'pending' && (
                              <div className="w-5 h-5 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5 z-10"></div>
                            )}
                            
                            <div>
                              <div className={cn(
                                "text-[14px] font-semibold",
                                item.status === 'done' ? "text-gray-900" : item.status === 'active' ? "text-blue-600" : "text-gray-400"
                              )}>
                                {item.title}
                              </div>
                              <div className="text-[12px] text-gray-500 mt-1">
                                {item.status === 'done' ? '已完成' : item.status === 'active' ? '执行中，高亮' : '待开始'}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="w-full h-px bg-[#E5E7EB]"></div>

                {/* Context / Data Source */}
                <div>
                  <h4 className="text-[14px] font-semibold text-gray-900 mb-3">上下文 / 数据源</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-2 text-gray-900 font-semibold text-[13px]">
                         <Database size={14} className="text-gray-500" />
                         supply_chain_prod
                       </div>
                       <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] bg-green-50 text-green-700 font-medium">
                         <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                         已连接
                       </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-gray-500">数据源类型</span>
                        <span className="text-gray-700 font-medium">MySQL</span>
                      </div>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-gray-500">扫描范围</span>
                        <span className="text-gray-700 font-medium">ods_scm, dwd_scm</span>
                      </div>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-gray-500">权限状态</span>
                        <span className="text-green-600 font-medium">具备只读权限</span>
                      </div>
                    </div>

                    <div className="flex gap-4 text-[12px] pt-3 mt-3 border-t border-gray-200">
                      <div>已选表：<span className="font-semibold text-gray-900">142</span></div>
                      <div>扫描字段：<span className="font-semibold text-gray-900">4,920</span></div>
                    </div>
                  </div>
                </div>

                {/* Risks Reminder */}
                <div>
                  <h4 className="flex items-center gap-2 text-[14px] font-semibold text-gray-900 mb-3">
                    <AlertCircle size={16} className="text-red-500" />
                    风险与待处理
                  </h4>
                  <div className="space-y-2">
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex justify-between items-center group hover:bg-red-100 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center font-bold text-[13px] shadow-sm">41</div>
                        <div>
                          <div className="text-[13px] font-semibold text-red-900">冲突字段</div>
                          <div className="text-[11px] text-red-600/80">规则与推断不一致</div>
                        </div>
                      </div>
                      <span className="text-[12px] font-medium text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">查看 &rarr;</span>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex justify-between items-center group hover:bg-amber-100 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white text-amber-600 flex items-center justify-center font-bold text-[13px] shadow-sm">326</div>
                        <div>
                          <div className="text-[13px] font-semibold text-amber-900">待确认字段</div>
                          <div className="text-[11px] text-amber-600/80">低于自动确认阈值</div>
                        </div>
                      </div>
                      <span className="text-[12px] font-medium text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">去确认 &rarr;</span>
                    </div>
                  </div>
                </div>

                {/* Recent Deliverables */}
                <div>
                  <h4 className="text-[14px] font-semibold text-gray-900 mb-3">最新交付物</h4>
                  <div className="space-y-2">
                    {[
                      { name: '字段语义理解进度报告', ext: '.md', time: '10:20' },
                      { name: '冲突字段清单', ext: '.xlsx', time: '10:15' },
                      { name: '字段语义理解结果', ext: '.csv', time: '10:05' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-colors group relative">
                        <div className="flex items-start gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 mt-0.5">
                            <FileText size={16} />
                          </div>
                          <div>
                            <div className="text-[13px] font-medium text-gray-900 truncate">
                              {item.name}<span className="text-gray-400 font-normal">{item.ext}</span>
                            </div>
                            <div className="text-[11px] text-gray-500 mt-0.5">{item.time}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-white text-gray-400 hover:text-blue-600 transition-colors">
                            <Download size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Detail Section 1: Basic Info */}
                <div>
                  <h4 className="text-[14px] font-semibold text-gray-900 mb-3">基本信息</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-gray-500">任务 ID</span>
                      <span className="font-medium text-gray-900 tracking-wider">TSK-20260504-001</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-gray-500">创建人</span>
                      <span className="font-medium text-gray-900">李桐</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-gray-500">创建时间</span>
                      <span className="font-medium text-gray-900">今天 09:30</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-gray-500">当前状态</span>
                      <div className="flex items-center gap-1.5 font-medium text-blue-600">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                        执行中 (阶段 5/8)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-[#E5E7EB]"></div>

                {/* Detail Section 2: Task Scope */}
                <div>
                  <h4 className="text-[14px] font-semibold text-gray-900 mb-3">实施范围</h4>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2">
                    <div className="text-[13px] text-gray-700 flex">
                      <span className="text-gray-500 w-[60px] flex-shrink-0">连接：</span>
                      <span className="font-medium">supply_chain_prod<br/><span className="text-[12px] font-normal text-gray-500">MySQL (10.10.10.25)</span></span>
                    </div>
                    <div className="text-[13px] text-gray-700 flex">
                      <span className="text-gray-500 w-[60px] flex-shrink-0">Schema：</span>
                      <span className="font-medium">ods_scm, dwd_scm</span>
                    </div>
                    <div className="text-[13px] text-gray-700 flex">
                      <span className="text-gray-500 w-[60px] flex-shrink-0">排除规则：</span>
                      <span className="font-medium">backup_*, temp_*</span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-[#E5E7EB]"></div>

                {/* Detail Section 3: Advanced Config */}
                <div>
                  <h4 className="text-[14px] font-semibold text-gray-900 mb-3">运行配置</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-gray-500">执行并行度</span>
                      <span className="font-medium text-gray-900">10 线程</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-gray-500">自动确认阈值</span>
                      <span className="font-medium text-gray-900">置信度 &gt; 0.95</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-gray-500">异常中断策略</span>
                      <span className="font-medium text-gray-900">超过 50 个冲突时暂停</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-gray-500">底层模型支撑</span>
                      <span className="font-medium text-gray-900">Gemini 3.1 Pro + 业务词典向量库</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full h-px bg-[#E5E7EB]"></div>
                
                {/* Detail Section 4: Context files */}
                <div>
                  <h4 className="text-[14px] font-semibold text-gray-900 mb-3">参考信息源</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[13px] text-gray-700">
                      <FileText size={14} className="text-gray-400" />
                      采购子系统_V2.pdf
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-gray-700">
                      <FileText size={14} className="text-gray-400" />
                      SCM_2024汇总表.xlsx
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-gray-700">
                      <FileText size={14} className="text-gray-400" />
                      仓储与物流接口文档.docx
                    </div>
                  </div>
                </div>

              </div>
            )}

            <div className="h-4"></div>
          </div>
        </div>
          </div>
        )}
      </div>
    </div>
  );
}
