import React, { useState } from 'react';
import { Sparkles, User, Paperclip, AtSign, Send, X, Edit2, RotateCw, FileText, ChevronDown, Check, Clock, Settings2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function DraftState({ onExecute }: { onExecute: () => void }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(false);
  const [chatStep, setChatStep] = useState(1);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    if (chatStep === 1) {
      setChatStep(2);
      setInputValue('');
    }
  };

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
          
          {/* User Message 1 */}
          <div className="flex flex-col items-end w-full">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[12px] text-gray-400">10:30</span>
              <span className="font-semibold text-[14px] text-gray-900">你</span>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 ml-1">
                <User size={16} />
              </div>
            </div>
            <div className="text-[15px] text-gray-800 leading-relaxed text-right max-w-3xl mr-11">
              请对供应链数据库进行语义治理，扫描 Schema、识别业务相关表、理解字段语义、生成业务对象与交付物。
            </div>
          </div>

          {/* Xino Message 1 */}
          <div className="flex gap-4 max-w-4xl">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-sm">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-semibold text-[14px] text-gray-900">Xino</span>
                <span className="text-[12px] text-gray-400">10:31</span>
              </div>
              <div className="text-[15px] text-gray-800 leading-relaxed mb-4">
                我已理解你的目标，并整理出一个任务草稿。右侧是当前任务配置，你可以直接确认，也可以继续告诉我需要调整的内容。
              </div>
              
              {/* Suggested Chips (Only show in step 1) */}
              {chatStep === 1 && (
                <div className="flex flex-wrap gap-2 animate-in fade-in duration-300">
                  {['只扫描采购相关 Schema', '增加 Excel 明细文件', '增加字段质量报告', '调整并行度为 10'].map(chip => (
                    <button 
                      key={chip} 
                      onClick={() => {
                        setInputValue(chip);
                        if (chip === '只扫描采购相关 Schema') {
                          setTimeout(() => {
                            setChatStep(2);
                            setInputValue('');
                          }, 300);
                        }
                      }}
                      className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-[13px] text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {chatStep === 2 && (
            <>
              {/* User Message 2 */}
              <div className="flex flex-col items-end w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[12px] text-gray-400">10:31</span>
                  <span className="font-semibold text-[14px] text-gray-900">你</span>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 ml-1">
                    <User size={16} />
                  </div>
                </div>
                <div className="text-[15px] text-gray-800 leading-relaxed text-right max-w-3xl mr-11">
                  只扫描采购相关 Schema，不要扫描全库。
                </div>
              </div>

              {/* Xino Summary Card */}
              <div className="flex gap-4 max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150 fill-mode-both">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-sm">
                  <Sparkles size={16} />
                </div>
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-semibold text-[14px] text-gray-900">Xino</span>
                    <span className="text-[12px] text-gray-400">10:32</span>
                  </div>
                  
                  <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm max-w-md mt-2">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <h4 className="font-semibold text-[14px] text-gray-900">已更新任务草稿</h4>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-[13px] flex items-start gap-4">
                        <span className="text-gray-500 w-24 flex-shrink-0">扫描范围：</span>
                        <span className="text-gray-900">全库 <span className="text-gray-400 mx-1">→</span> <span className="text-blue-600 font-medium">ods_scm, dwd_scm</span></span>
                      </div>
                      <div className="text-[13px] flex items-start gap-4">
                        <span className="text-gray-500 w-24 flex-shrink-0">预计扫描表：</span>
                        <span className="text-gray-900">286 <span className="text-gray-400 mx-1">→</span> 142</span>
                      </div>
                      <div className="text-[13px] flex items-start gap-4">
                        <span className="text-gray-500 w-24 flex-shrink-0">预计耗时：</span>
                        <span className="text-gray-900">2.5 小时 <span className="text-gray-400 mx-1">→</span> 1.4 小时</span>
                      </div>
                      <div className="text-[13px] flex items-start gap-4">
                        <span className="text-gray-500 w-24 flex-shrink-0">风险等级：</span>
                        <span className="text-gray-900">中 <span className="text-gray-400 mx-1">→</span> 低</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="h-4"></div>
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
              className="flex-1 min-h-[24px] max-h-[100px] py-1.5 resize-y outline-none text-[14px] leading-relaxed placeholder:text-gray-400 bg-transparent custom-scrollbar"
              placeholder="继续告诉 Xino 你的调整要求，例如：增加 Excel 明细、调整交付物、限制 Schema 范围…"
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
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-lg transition-colors flex-shrink-0",
                  inputValue.trim() || chatStep === 1 ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-100 text-gray-400"
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
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[12px] font-medium bg-slate-100 text-slate-600 mt-2">
                尚未开始执行
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
                <div className="text-[14px] font-semibold text-gray-900 mb-1">供应链语义治理闭环任务</div>
                <p className="text-[13px] text-gray-600 leading-relaxed mb-3">
                  对供应链数据库进行语义治理，扫描 Schema，识别业务相关表，理解字段语义，生成业务对象与交付物。
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['语义治理', 'Schema 扫描', '业务对象生成', '交付物生成'].map(tag => (
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
                <div className="flex items-start justify-between bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-colors">
                  <div>
                    <div className="text-[12px] font-medium text-gray-500 mb-1">数据源</div>
                    <div className="text-[14px] font-semibold text-gray-900">supply_chain_prod</div>
                    <div className="text-[12px] text-gray-500 mt-1">MySQL · 10.10.10.25:3306</div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[12px] bg-green-50 text-green-700 mt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      已连接
                    </div>
                  </div>
                  <button className="text-[13px] text-blue-600 hover:text-blue-700 font-medium">更换</button>
                </div>

                {/* Scan Scope dynamically toggled by chatStep */}
                <div className={cn(
                  "flex items-start justify-between rounded-xl p-4 transition-colors",
                  chatStep === 2 ? "bg-blue-50/50 border border-blue-200" : "bg-white border border-gray-200 hover:border-blue-200"
                )}>
                  <div>
                    <div className={cn("text-[12px] font-medium mb-1 flex items-center gap-2", chatStep === 2 ? "text-blue-600" : "text-gray-500")}>
                      扫描范围
                      {chatStep === 2 && <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-medium">刚刚通过对话更新</span>}
                    </div>
                    <div className="text-[14px] font-semibold text-gray-900">
                      {chatStep === 2 ? 'ods_scm, dwd_scm' : '全库 (286 个 Schema)'}
                    </div>
                    <div className="text-[12px] text-gray-500 mt-1">
                      {chatStep === 2 ? '共 2 个 Schema' : '无限制'}
                    </div>
                  </div>
                  <button className="text-[13px] text-blue-600 hover:text-blue-700 font-medium">编辑范围</button>
                </div>

                {/* Context Resources */}
                <div className="flex items-start justify-between bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-colors">
                  <div>
                    <div className="text-[12px] font-medium text-gray-500 mb-1">上下文资源</div>
                    <div className="text-[14px] font-semibold text-gray-900">3 个文件</div>
                    <div className="text-[12px] text-gray-500 mt-1 flex items-center gap-2">
                      <span className="flex items-center gap-1"><FileText size={12}/> PDF 1 个</span>
                      <span className="flex items-center gap-1"><FileText size={12}/> XLSX 1 个</span>
                      <span className="flex items-center gap-1"><FileText size={12}/> DOCX 1 个</span>
                    </div>
                  </div>
                  <button className="text-[13px] text-blue-600 hover:text-blue-700 font-medium">继续上传</button>
                </div>

                {/* Deliverables */}
                <div className="flex items-start justify-between bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-colors">
                  <div>
                    <div className="text-[12px] font-medium text-gray-500 mb-1">交付物</div>
                    <div className="text-[14px] font-semibold text-gray-900">6 项</div>
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
                  <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded font-medium ml-1">推荐标签</span>
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
                  预计扫描约 {chatStep === 2 ? '142' : '286'} 张表、{chatStep === 2 ? '4,920' : '9,820'} 个字段
                </li>
                <li className="flex items-start gap-2 text-[13px] text-amber-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                  部分字段命名不规范，可能需要人工确认
                </li>
                {chatStep === 2 && (
                  <li className="flex items-start gap-2 text-[13px] text-green-700 animate-in fade-in zoom-in duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                    当前扫描范围已限制为采购相关 Schema
                  </li>
                )}
              </ul>
            </div>

            {/* Section 5: Stage Summary */}
            <div>
              <h4 className="text-[14px] font-semibold text-gray-900 mb-3">执行阶段摘要</h4>
              <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-white">
                <div className="flex items-center gap-4">
                  <div className="text-[14px] font-semibold text-gray-900">预计 8 个阶段</div>
                  <div className="text-[13px] text-gray-500 flex items-center gap-1.5"><Clock size={14}/> 约 {chatStep === 2 ? '1.4' : '2.5'} 小时</div>
                </div>
                <button className="text-[13px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">展开查看 <ChevronDown size={14} /></button>
              </div>
            </div>

            {/* Section 6: Advanced Config Summary (Expandable) */}
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

            {/* Section 7: Recent Adjustments */}
            {chatStep === 2 && (
              <div className="flex items-center gap-2 text-[12px] text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 animate-in fade-in duration-300">
                <RotateCw size={14} className="text-gray-400" />
                <span>10:32 扫描范围已通过对话更新</span>
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
              onClick={onExecute}
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
