import React, { useState } from 'react';
import { 
  Search, Filter, ChevronDown, Settings, Download, Plus, MoreHorizontal, 
  List, Star, AlertCircle, Archive, LayoutGrid, CheckCircle2, Clock, 
  CircleDot, HelpCircle, Inbox, Users
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface TaskRow {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  project: string;
  stage: string;
  stageProgress: string;
  progress: number;
  owner: string;
  priority: '高' | '中' | '低';
  pendingCount: number;
  status: '执行中' | '已完成' | '异常' | '待确认' | '待审核';
  updatedAt: string;
}

const tableData: TaskRow[] = [
  { id: '1', name: '供应链语义治理闭环任务', subtitle: '供应链语义治理团队', type: '语义治理', project: '供应链语义治理项目', stage: '字段语义理解', stageProgress: '5/8', progress: 78, owner: '李桐', priority: '高', pendingCount: 3, status: '执行中', updatedAt: '今天 09:50' },
  { id: '2', name: '数据标准落地任务', subtitle: '标准管理团队', type: '标准管理', project: '供应链语义治理项目', stage: '标准映射', stageProgress: '3/6', progress: 54, owner: '张悦', priority: '中', pendingCount: 2, status: '执行中', updatedAt: '今天 09:35' },
  { id: '3', name: '主数据对象建模任务', subtitle: '主数据建模组', type: '主数据', project: '主数据治理项目', stage: '模型设计', stageProgress: '6/6', progress: 100, owner: '王强', priority: '中', pendingCount: 0, status: '已完成', updatedAt: '昨天 17:48' },
  { id: '4', name: '元数据自动采集任务', subtitle: '数据平台团队', type: '元数据', project: '平台治理项目', stage: '数据采集', stageProgress: '2/5', progress: 32, owner: '刘欣', priority: '高', pendingCount: 1, status: '异常', updatedAt: '昨天 16:22' },
  { id: '5', name: '客户语义治理任务', subtitle: '客户治理团队', type: '语义治理', project: '客户语义治理项目', stage: '业务对象识别', stageProgress: '4/7', progress: 61, owner: '陈晨', priority: '中', pendingCount: 4, status: '待确认', updatedAt: '今天 08:40' },
  { id: '6', name: '指标体系建设任务', subtitle: '经营分析团队', type: '标准管理', project: '经营分析项目', stage: '指标定义梳理', stageProgress: '2/5', progress: 40, owner: '周宁', priority: '低', pendingCount: 2, status: '待审核', updatedAt: '昨天 15:10' },
  { id: '7', name: '数据质量巡检任务', subtitle: '数据质量团队', type: '质量巡检', project: '供应链语义治理项目', stage: '规则执行', stageProgress: '5/5', progress: 100, owner: '李桐', priority: '低', pendingCount: 0, status: '已完成', updatedAt: '昨天 11:20' },
  { id: '8', name: '采购主数据修复任务', subtitle: '采购数据团队', type: '主数据', project: '采购管理项目', stage: '字段修复', stageProgress: '1/4', progress: 18, owner: '孙浩', priority: '高', pendingCount: 5, status: '执行中', updatedAt: '今天 10:05' },
];

export default function TaskListState() {
  const [activeScope, setActiveScope] = useState('全部任务');
  const [activeView, setActiveView] = useState('默认视图');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const toggleTaskSelection = (id: string) => {
    if (selectedTasks.includes(id)) {
      setSelectedTasks(selectedTasks.filter(t => t !== id));
    } else {
      setSelectedTasks([...selectedTasks, id]);
    }
  };

  const selectAll = () => {
    if (selectedTasks.length === tableData.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tableData.map(t => t.id));
    }
  };

  return (
    <div className="flex h-full bg-[#F8FAFC]">
      {/* Center Main Area */}
      <div className="flex-1 flex flex-col h-full relative border-r border-gray-200 min-w-0">
        <div className="flex-1 overflow-y-auto w-full py-6 px-6">
          <div className="w-full max-w-[1200px] mx-auto">
            
            {/* 1. Breadcrumbs + Title */}
            <div className="mb-6">
               <div className="flex items-center text-[12px] text-gray-500 mb-2">
                 <span className="hover:text-blue-600 cursor-pointer">任务</span>
                 <span className="mx-1.5">/</span>
                 <span className="text-gray-900 font-medium">全部任务</span>
               </div>
               <div className="flex justify-between items-start">
                  <div>
                     <h1 className="text-[24px] font-bold text-gray-900 mb-1.5">全部任务</h1>
                     <p className="text-[13px] text-gray-500">查看当前范围内的全部任务，支持按状态、类型、负责人和时间进行筛选与管理。</p>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                     <button className="h-8 px-4 bg-white border border-gray-200 text-gray-700 rounded-lg text-[13px] font-medium shadow-sm hover:bg-gray-50 flex items-center gap-1.5 transition-colors">
                        <Download size={14} /> 导出列表
                     </button>
                     <button className="h-8 px-4 bg-blue-600 text-white rounded-lg text-[13px] font-medium shadow-sm hover:bg-blue-700 flex items-center gap-1.5 transition-colors">
                        <Plus size={14} /> 新建任务
                     </button>
                  </div>
               </div>
            </div>

            {/* 2. Scope & View Switch */}
            <div className="flex items-center justify-between border-b border-gray-200 mb-6">
              <div className="flex gap-6 relative top-[1px]">
                 {['我的任务', '团队任务', '全部任务'].map(scope => (
                   <button 
                     key={scope}
                     onClick={() => setActiveScope(scope)}
                     className={cn(
                       "px-1 py-2.5 text-[14px] font-medium transition-colors border-b-2",
                       activeScope === scope ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-gray-900"
                     )}
                   >
                     {scope}
                   </button>
                 ))}
              </div>
              <div className="flex bg-gray-100/80 p-0.5 rounded-lg border border-gray-200/50 mb-2">
                 {[
                   { id: '默认视图', icon: <LayoutGrid size={13}/> },
                   { id: '我关注的', icon: <Star size={13}/> },
                   { id: '异常任务', icon: <AlertCircle size={13}/> },
                   { id: '已归档', icon: <Archive size={13}/> },
                 ].map(view => (
                   <button
                     key={view.id}
                     onClick={() => setActiveView(view.id)}
                     className={cn(
                       "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all shadow-sm",
                       activeView === view.id ? "bg-white text-gray-900 border border-gray-200/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 border-transparent"
                     )}
                   >
                     {view.icon} {view.id}
                   </button>
                 ))}
              </div>
            </div>

            {/* 3. Stats Bar */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm flex flex-col hover:border-blue-200 transition-colors cursor-pointer">
                 <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium mb-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> 全部任务
                 </div>
                 <div className="text-[24px] font-bold text-gray-800">128</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm flex flex-col hover:border-blue-200 transition-colors cursor-pointer">
                 <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium mb-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> 执行中
                 </div>
                 <div className="text-[24px] font-bold text-blue-600">36</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm flex flex-col hover:border-amber-200 transition-colors cursor-pointer">
                 <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium mb-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> 待确认
                 </div>
                 <div className="text-[24px] font-bold text-amber-600">17</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm flex flex-col hover:border-green-200 transition-colors cursor-pointer">
                 <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium mb-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> 已完成
                 </div>
                 <div className="text-[24px] font-bold text-green-600">75</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm flex flex-col hover:border-red-200 transition-colors cursor-pointer">
                 <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium mb-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> 异常任务
                 </div>
                 <div className="text-[24px] font-bold text-red-600">4</div>
              </div>
            </div>

            {/* 4. Filter Toolbar */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                 <div className="relative w-64">
                   <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                   <input 
                     type="text" 
                     placeholder="搜索任务名称" 
                     className="w-full h-8 pl-8 pr-3 text-[13px] bg-gray-50 border border-gray-200 rounded-md focus:border-blue-500 focus:bg-white outline-none transition-colors placeholder:text-gray-400"
                   />
                 </div>
                 <button className="h-8 px-3 bg-white border border-gray-200 text-gray-700 rounded-md text-[13px] flex items-center justify-between gap-2 hover:bg-gray-50 min-w-[80px]">
                   <span className="text-gray-500">状态:</span> 全部 <ChevronDown size={14} className="text-gray-400"/>
                 </button>
                 <button className="h-8 px-3 bg-white border border-gray-200 text-gray-700 rounded-md text-[13px] flex items-center justify-between gap-2 hover:bg-gray-50 min-w-[80px]">
                   <span className="text-gray-500">类型:</span> 全部 <ChevronDown size={14} className="text-gray-400"/>
                 </button>
                 <button className="h-8 px-3 bg-white border border-gray-200 text-gray-700 rounded-md text-[13px] flex items-center justify-between gap-2 hover:bg-gray-50 max-w-[200px] truncate">
                   <span className="text-gray-500 shrink-0">项目:</span> <span className="truncate">供应链语义治理项目</span> <ChevronDown size={14} className="text-gray-400 shrink-0"/>
                 </button>
                 <button className="h-8 px-3 bg-white border border-gray-200 text-gray-700 rounded-md text-[13px] flex items-center justify-between gap-2 hover:bg-gray-50 min-w-[90px]">
                   <span className="text-gray-500">负责人:</span> 全部 <ChevronDown size={14} className="text-gray-400"/>
                 </button>
                 <button className="h-8 px-3 bg-white border border-gray-200 text-gray-700 rounded-md text-[13px] flex items-center justify-between gap-2 hover:bg-gray-50 min-w-[90px]">
                   <span className="text-gray-500">优先级:</span> 全部 <ChevronDown size={14} className="text-gray-400"/>
                 </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <button className="h-8 px-3 bg-white border border-gray-200 text-gray-700 rounded-md text-[13px] flex items-center justify-between gap-2 hover:bg-gray-50 min-w-[120px]">
                     <span className="text-gray-500">时间:</span> 最近更新时间 <ChevronDown size={14} className="text-gray-400"/>
                   </button>
                   <button className="text-[13px] text-blue-600 hover:text-blue-700 font-medium px-2">重置筛选</button>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                   <span className="text-gray-500">排序:</span>
                   <button className="font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1">最近更新 <ChevronDown size={14} className="text-gray-400"/></button>
                   <div className="w-px h-4 bg-gray-200 mx-2"></div>
                   <button className="text-gray-600 hover:text-gray-900 flex items-center gap-1.5 px-2 font-medium">
                     <List size={14}/> 批量操作
                   </button>
                   <button className="text-gray-600 hover:text-gray-900 flex items-center gap-1.5 px-2 font-medium">
                     <Settings size={14}/> 列设置
                   </button>
                </div>
              </div>
            </div>

            {/* 5. Batch Selection Bar */}
            {selectedTasks.length > 0 && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 mb-4 flex items-center justify-between animate-in fade-in duration-200">
                <div className="flex items-center gap-2 pl-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">{selectedTasks.length}</div>
                  <span className="text-[13px] text-blue-800 font-medium">已选择 {selectedTasks.length} 个任务</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="h-7 px-3 bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 rounded text-[12px] font-medium transition-colors">批量转派</button>
                  <button className="h-7 px-3 bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 rounded text-[12px] font-medium transition-colors">批量归档</button>
                  <button className="h-7 px-3 bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 rounded text-[12px] font-medium transition-colors">批量导出</button>
                  <div className="w-px h-3 bg-blue-200 mx-1"></div>
                  <button onClick={() => setSelectedTasks([])} className="text-blue-500 hover:text-blue-700 px-1 text-[13px]">关闭 ✕</button>
                </div>
              </div>
            )}

            {/* 6. Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200">
                      <th className="px-4 py-3 w-10">
                        <input 
                          type="checkbox" 
                          checked={selectedTasks.length === tableData.length}
                          onChange={selectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                        />
                      </th>
                      <th className="px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">任务名称</th>
                      <th className="px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">类型 / 所属项目</th>
                      <th className="px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">当前阶段</th>
                      <th className="px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">负责人</th>
                      <th className="px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase tracking-wider text-center">优先级</th>
                      <th className="px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase tracking-wider text-center">待处理</th>
                      <th className="px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">状态</th>
                      <th className="px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">最近更新时间</th>
                      <th className="px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase tracking-wider text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tableData.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-4 py-3.5">
                          <input 
                            type="checkbox" 
                            checked={selectedTasks.includes(row.id)}
                            onChange={() => toggleTaskSelection(row.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-opacity opacity-50 group-hover:opacity-100 checked:opacity-100" 
                          />
                        </td>
                        <td className="px-4 py-3.5 min-w-[240px]">
                          <div className="flex flex-col">
                            <button className="text-[13.5px] font-medium text-blue-600 hover:text-blue-800 hover:underline text-left truncate max-w-[260px]">{row.name}</button>
                            <span className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[260px]">{row.subtitle}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                           <div className="flex flex-col">
                            <span className="text-[13px] text-gray-800">{row.type}</span>
                            <span className="text-[11.5px] text-gray-500 mt-0.5">{row.project}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 min-w-[160px]">
                          <div className="flex flex-col gap-1.5 cursor-pointer hover:bg-gray-100 p-1.5 -ml-1.5 rounded-md transition-colors w-fit">
                            <span className="text-[13px] text-gray-800 font-medium hover:text-blue-600">{row.stage} <span className="text-gray-400 font-normal ml-1">{row.stageProgress}</span></span>
                            <div className="flex items-center gap-2">
                               <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                 <div 
                                   className={cn("h-full rounded-full", row.progress === 100 ? "bg-green-500" : "bg-blue-500")}
                                   style={{ width: `${row.progress}%` }}
                                 ></div>
                               </div>
                               <span className="text-[11px] font-mono text-gray-500">{row.progress}%</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <button className="flex items-center gap-2 hover:bg-gray-100 p-1 -ml-1 rounded transition-colors">
                            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                              {row.owner.charAt(0)}
                            </div>
                            <span className="text-[13px] text-gray-700">{row.owner}</span>
                          </button>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="inline-flex items-center gap-1.5">
                             <div className={cn("w-2 h-2 rounded-full", 
                               row.priority === '高' ? "bg-red-500" : 
                               row.priority === '中' ? "bg-amber-500" : "bg-gray-400"
                             )}></div>
                             <span className="text-[12px] text-gray-600">{row.priority}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                           {row.pendingCount > 0 ? (
                             <button className="inline-flex items-center justify-center min-w-[18px] h-5 px-1 bg-amber-50 border border-amber-200 text-amber-700 rounded text-[11px] font-bold hover:bg-amber-100 transition-colors">
                               {row.pendingCount}
                             </button>
                           ) : (
                             <span className="text-gray-300 text-[12px] font-mono">0</span>
                           )}
                        </td>
                        <td className="px-4 py-3.5">
                          <button className={cn("inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium border hover:opacity-80 transition-opacity", 
                            row.status === '执行中' ? "bg-blue-50 text-blue-700 border-blue-100" :
                            row.status === '已完成' ? "bg-green-50 text-green-700 border-green-100" :
                            row.status === '待确认' ? "bg-amber-50 text-amber-700 border-amber-100" :
                            row.status === '待审核' ? "bg-amber-50 text-amber-700 border-amber-100" :
                            row.status === '异常' ? "bg-red-50 text-red-700 border-red-100" : ""
                          )}>
                             {row.status}
                          </button>
                        </td>
                        <td className="px-4 py-3.5 text-[12px] text-gray-500 font-mono">
                           {row.updatedAt}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <button className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 7. Pagination */}
            <div className="flex items-center justify-between mb-8">
              <div className="text-[13px] text-gray-500">
                共 <span className="font-semibold text-gray-900 pr-1">128</span> 条任务记录
              </div>
              <div className="flex items-center gap-2">
                 <button className="px-3 h-8 text-[13px] text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors">上一页</button>
                 <div className="flex items-center gap-1">
                    <button className="w-8 h-8 flex items-center justify-center text-[13px] font-medium rounded bg-blue-50 text-blue-600 border border-blue-200">1</button>
                    <button className="w-8 h-8 flex items-center justify-center text-[13px] font-medium rounded text-gray-600 hover:bg-gray-100">2</button>
                    <button className="w-8 h-8 flex items-center justify-center text-[13px] font-medium rounded text-gray-600 hover:bg-gray-100">3</button>
                    <button className="w-8 h-8 flex items-center justify-center text-[13px] font-medium rounded text-gray-600 hover:bg-gray-100">4</button>
                    <button className="w-8 h-8 flex items-center justify-center text-[13px] font-medium rounded text-gray-600 hover:bg-gray-100">5</button>
                    <span className="w-8 h-8 flex items-center justify-center text-[13px] text-gray-400">...</span>
                    <button className="w-8 h-8 flex items-center justify-center text-[13px] font-medium rounded text-gray-600 hover:bg-gray-100">13</button>
                 </div>
                 <button className="px-3 h-8 text-[13px] text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors">下一页</button>
                 <div className="ml-4 h-8 px-2 flex items-center gap-2 text-[13px] text-gray-500 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition-colors">
                    20 条/页 <ChevronDown size={14}/>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Right Sidebar - Summaries & Tips */}
      <div className="w-[320px] bg-[#F8FAFC] flex flex-col flex-shrink-0 border-l border-gray-200 z-10 px-5 py-6 space-y-6 overflow-y-auto hidden lg:flex">
         
         {/* Filter Summary */}
         <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
           <h3 className="text-[14px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
             <Filter size={15} className="text-gray-400"/> 筛选摘要
           </h3>
           <div className="space-y-3 mb-4">
              <div className="flex flex-col gap-1">
                 <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">当前范围</span>
                 <span className="text-[13px] text-gray-900 font-medium">全部任务</span>
              </div>
              <div className="flex border-t border-gray-100 pt-3">
                 <div className="flex-1 flex flex-col gap-1">
                   <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">状态</span>
                   <span className="text-[13px] text-gray-800">全部</span>
                 </div>
                 <div className="flex-1 flex flex-col gap-1">
                   <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">类型</span>
                   <span className="text-[13px] text-gray-800">全部</span>
                 </div>
              </div>
              <div className="flex flex-col gap-1 border-t border-gray-100 pt-3">
                 <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">项目</span>
                 <span className="text-[13px] text-blue-600 truncate bg-blue-50/50 px-2 py-1 rounded-md border border-blue-100/50 w-fit">供应链语义治理项目</span>
              </div>
              <div className="flex flex-col gap-1 border-t border-gray-100 pt-3">
                 <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">最近更新时间</span>
                 <span className="text-[13px] text-gray-800">最近 30 天</span>
              </div>
           </div>
           <button className="text-[12px] text-blue-600 hover:text-blue-800 font-medium w-full text-center py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
             清空全部筛选
           </button>
         </div>

         {/* Quick Views */}
         <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
           <h3 className="text-[14px] font-semibold text-gray-900 mb-3 flex items-center gap-2">
             <Star size={15} className="text-gray-400"/> 快捷视图
           </h3>
           <div className="space-y-1">
             <button className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors group">
                <span className="text-[13px] text-gray-700 flex items-center gap-2 group-hover:text-blue-600"><Star size={14} className="text-gray-400 group-hover:text-blue-500"/> 我关注的任务</span>
                <span className="text-[12px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">12</span>
             </button>
             <button className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-red-50 rounded-lg transition-colors group">
                <span className="text-[13px] text-gray-700 flex items-center gap-2 group-hover:text-red-700"><AlertCircle size={14} className="text-red-400 group-hover:text-red-500"/> 异常任务</span>
                <span className="text-[12px] font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded-full">4</span>
             </button>
             <button className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-amber-50 rounded-lg transition-colors group">
                <span className="text-[13px] text-gray-700 flex items-center gap-2 group-hover:text-amber-700"><Users size={14} className="text-amber-400 group-hover:text-amber-500"/> 待我审核</span>
                <span className="text-[12px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">6</span>
             </button>
             <button className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-green-50 rounded-lg transition-colors group">
                <span className="text-[13px] text-gray-700 flex items-center gap-2 group-hover:text-green-700"><CheckCircle2 size={14} className="text-green-400 group-hover:text-green-500"/> 近 7 天完成</span>
                <span className="text-[12px] font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">18</span>
             </button>
           </div>
         </div>

         {/* Help & Tips */}
         <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
           <h3 className="text-[14px] font-semibold text-gray-900 mb-3 flex items-center gap-2">
             <HelpCircle size={15} className="text-blue-500"/> 说明 / 提示
           </h3>
           <ul className="space-y-3 pl-1">
             <li className="flex items-start gap-2.5">
               <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
               <span className="text-[12px] text-gray-600 leading-relaxed">支持勾选左侧选择框批量管理任务。</span>
             </li>
             <li className="flex items-start gap-2.5">
               <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
               <span className="text-[12px] text-gray-600 leading-relaxed">点击 <span className="font-medium text-gray-800">任务名称</span> 进入详情页，点击进度条可直达当前阶段。</span>
             </li>
             <li className="flex items-start gap-2.5">
               <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
               <span className="text-[12px] text-gray-600 leading-relaxed">点击表格中的 <span className="font-medium text-gray-800">状态</span> 或 <span className="font-medium text-gray-800">负责人</span> 可快速添加筛选。</span>
             </li>
             <li className="flex items-start gap-2.5">
               <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
               <span className="text-[12px] text-gray-600 leading-relaxed">可通过顶部的「导出列表」一键导出当前筛选结果。</span>
             </li>
           </ul>
         </div>

      </div>
    </div>
  );
}
