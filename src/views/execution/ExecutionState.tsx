import React, { useState } from 'react';
import { Share2, MoreHorizontal, User, Sparkles, CheckCircle2, ChevronRight, ChevronDown, Download, Send, FileText, Database, AlertCircle, RefreshCw, ArrowLeft, AlertTriangle, HelpCircle, Network, Maximize2, Table, PanelRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import mockData from '@/mock/task-execution.json';

const task = mockData.task;
const completedStages = task.stages.filter(s => s.status === 'COMPLETED');
const currentStage = task.stages.find(s => s.status === 'RUNNING');
const pendingStages = task.stages.filter(s => s.status === 'PENDING');

/** Xino Block Header — 统一头部 */
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

export default function ExecutionState() {
  const [activeTab, setActiveTab] = useState<'plan' | 'detail'>('plan');
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isPlanExpanded, setIsPlanExpanded] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={cn("w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg transition-colors shadow-sm", isSidebarOpen ? "text-blue-600 bg-blue-50 border-blue-200" : "text-gray-600 hover:bg-gray-50")}
            >
              <PanelRight size={16} />
            </button>
          </div>
        </div>

        {/* Task Stream Area */}
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
                  阶段 5 / 8
                </div>
              </div>
              <div className="flex items-end justify-between mb-4">
                <h3 className="text-[22px] font-bold text-white leading-tight">字段语义理解</h3>
                <div className="text-[36px] font-bold text-white leading-none tracking-tight">78%</div>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-5">
                <div className="h-full bg-white rounded-full transition-all duration-500 relative" style={{ width: '78%' }}>
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
              </div>
              <p className="text-[14px] text-blue-100 leading-relaxed mb-5">
                已自动理解 <span className="font-semibold text-white">3,812</span> 个字段，仍有 <span className="font-semibold text-amber-300">326</span> 个待确认字段与 <span className="font-semibold text-red-300">41</span> 个冲突字段，需要人工确认后继续推进。
              </p>
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

            {/* ===================== Conversation Stream ===================== */}

            {/* --- Block 0: DataSourceConnection --- */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6">
              <XinoBlockHeader icon={<Database size={12} />} iconBg="bg-green-600" time="09:15" tag="前置准备" />
              <p className="text-[14px] text-gray-700 leading-relaxed mb-5">
                已成功连接到数据源 <code className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[12px] font-mono mx-0.5">supply_chain_prod</code>。成功读取数据库模式和表结构，即将进入数据扫描。
              </p>
              <div className="space-y-2.5 border-t border-gray-100 pt-5">
                {[
                  { label: '连接地址', value: '10.10.10.25:3306' },
                  { label: '数据库名称', value: 'supply_chain_prod' },
                  { label: '扫描表总数', value: '185' },
                  { label: '连接测试状态', value: '正常 (45ms)', valueClass: 'text-green-600' },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between text-[13px]">
                    <span className="text-gray-500">{row.label}</span>
                    <span className={cn("font-medium text-gray-800 font-mono", row.valueClass)}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[12px] text-green-600 font-medium">
                <CheckCircle2 size={13} /> 已完成
              </div>
            </div>

            {/* --- User 1 --- */}
            <div className="flex justify-end">
              <div className="border-l-2 border-blue-200 pl-4 py-1 max-w-md">
                <div className="flex items-center gap-2 mb-1 justify-end">
                  <span className="text-[12px] text-gray-400">09:30</span>
                  <span className="font-medium text-[13px] text-gray-700">李桐</span>
                </div>
                <p className="text-[14px] text-gray-700 leading-relaxed text-right">
                  排除表名包含 temp_ 和 backup_ 的表。
                </p>
              </div>
            </div>

            {/* --- Block 1: Config Adjustment --- */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6">
              <XinoBlockHeader icon={<Sparkles size={12} />} iconBg="bg-blue-600" time="09:31" tag="配置调整" />
              <p className="text-[14px] text-gray-700 leading-relaxed mb-5">
                已收到您的指令。已为您更新数据源过滤规则，排除了不必要的临时表和备份表。
              </p>
              <div className="space-y-2.5 border-t border-gray-100 pt-5">
                {[
                  { label: '排除规则', from: '无', to: 'temp_*, backup_*', toClass: 'text-blue-700 font-mono' },
                  { label: '预计扫描表数量', from: '185', to: '142', toClass: 'text-blue-700' },
                  { label: '预计节省时间', from: '', to: '约 0.5 小时', toClass: 'text-blue-700' },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between text-[13px]">
                    <span className="text-gray-500">{row.label}</span>
                    <div className="flex items-center gap-2">
                      {row.from && <span className="text-gray-400 line-through">{row.from}</span>}
                      {row.from && <span className="text-gray-300">&rarr;</span>}
                      <span className={cn("font-medium", row.toClass)}>{row.to}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[12px] text-green-600 font-medium">
                <CheckCircle2 size={13} /> 已确认
              </div>
            </div>

            {/* --- Block 2: IssueList + Confirmation --- */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6">
              <XinoBlockHeader icon={<Sparkles size={12} />} iconBg="bg-blue-600" time="09:40" tag="阶段 4: 候选字段生成" />
              <p className="text-[14px] text-gray-700 leading-relaxed mb-5">
                在执行「字段的候选生成」过程中，我发现了一些数据模式特征异常。这可能会影响后续的语义识别准确度，建议您先确认处理方式。
              </p>
              <div className="space-y-3 border-t border-gray-100 pt-5">
                <div className="border border-red-200 bg-red-50/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] rounded font-bold">高风险</span>
                      <span className="text-[13px] font-semibold text-gray-900">字符集编码不一致</span>
                    </div>
                    <button className="text-[12px] text-blue-600 font-medium">查看 12 张受影响表</button>
                  </div>
                  <p className="text-[12px] text-gray-600"><code className="font-mono text-gray-800">supplier_info</code> 等表的字符集为 latin1，与库默认 utf8mb4 不一致，可能导致语义解析乱码。</p>
                </div>
                <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded font-bold">中风险</span>
                      <span className="text-[13px] font-semibold text-gray-900">缺失唯一业务主键</span>
                    </div>
                    <button className="text-[12px] text-blue-600 font-medium">查看 5 张受影响表</button>
                  </div>
                  <p className="text-[12px] text-gray-600"><code className="font-mono text-gray-800">daily_report</code> 等表缺失实体标识且无自增主键，可能导致血缘推断置信度下降。</p>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-3">
                <HelpCircle size={14} className="text-blue-500 flex-shrink-0" />
                <span className="text-[13px] text-gray-700">是否强制按照 utf8mb4 解析编码，并跳过无标识表？</span>
                <button className="ml-auto px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[12px] font-medium hover:bg-blue-700">是，已应用建议</button>
              </div>
            </div>

            {/* --- User 2 --- */}
            <div className="flex justify-end">
              <div className="border-l-2 border-blue-200 pl-4 py-1 max-w-md">
                <div className="flex items-center gap-2 mb-1 justify-end">
                  <span className="text-[12px] text-gray-400">09:45</span>
                  <span className="font-medium text-[13px] text-gray-700">李桐</span>
                </div>
                <p className="text-[14px] text-gray-700 leading-relaxed text-right">
                  请继续推进字段语义理解，并重点识别冲突字段。
                </p>
              </div>
            </div>

            {/* --- Block 3: Stage Result (主块 — 指标 + 表格) --- */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6">
              <XinoBlockHeader
                icon={<Sparkles size={12} />}
                iconBg="bg-blue-600"
                time="09:46"
                tag="阶段 5: 字段语义理解"
              />
              {/* Text Summary */}
              <p className="text-[14px] text-gray-700 leading-relaxed mb-5">
                基于您的要求，已完成对 ods_scm 和 dwd_scm 的字段语义扫描。已重点识别出业务词典与推断规则不一致的冲突字段。以下是当前阶段的关键结果，建议优先处理冲突字段。
              </p>

              {/* Metric Cards */}
              <div className="grid grid-cols-5 gap-3 mb-5">
                {[
                  { label: '自动通过', value: '3,812', color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
                  { label: '待确认', value: '326', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
                  { label: '冲突字段', value: '41', color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
                  { label: '异常模式', value: '37', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' },
                  { label: '建议忽略', value: '704', color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200' },
                ].map((m) => (
                  <div key={m.label} className={cn("rounded-xl p-3 border text-center", m.bg)}>
                    <div className="text-[12px] text-gray-600 mb-1 font-medium">{m.label}</div>
                    <div className={cn("text-[18px] font-bold font-mono tracking-tight", m.color)}>{m.value}</div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[13px] font-semibold text-gray-900">字段明细概览</h4>
                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-medium border border-amber-200">仅显示冲突与待确认</span>
                  </div>
                  <button className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-900 transition-colors">
                    <Download size={12} /> 导出明细
                  </button>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-2.5 text-[12px] font-semibold text-gray-500">字段名</th>
                      <th className="px-4 py-2.5 text-[12px] font-semibold text-gray-500">推断语义</th>
                      <th className="px-4 py-2.5 text-[12px] font-semibold text-gray-500">置信度</th>
                      <th className="px-4 py-2.5 text-[12px] font-semibold text-gray-500">来源</th>
                      <th className="px-4 py-2.5 text-[12px] font-semibold text-gray-500 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { field: 'po_status', semantic: '采购订单状态', conf: '0.97', confW: 'w-[97%]', source: '规则推断冲突' },
                      { field: 'supplier_code', semantic: '供应商编码', conf: '0.96', confW: 'w-[96%]', source: '待人工确认' },
                      { field: 'wh_id', semantic: '仓库ID', conf: '0.93', confW: 'w-[93%]', source: '待人工确认' },
                      { field: 'create_dt', semantic: '创建日期', conf: '0.89', confW: 'w-[89%]', source: '待人工确认' },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        className={cn("transition-colors cursor-pointer", selectedRow?.field === row.field ? "bg-blue-50/50" : "hover:bg-gray-50")}
                        onClick={() => setSelectedRow(row)}
                      >
                        <td className="px-4 py-3 text-[13px] font-medium text-blue-600">{row.field}</td>
                        <td className="px-4 py-3 text-[13px] font-semibold text-gray-900">{row.semantic}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 w-24">
                            <span className={cn("text-[13px] font-medium w-8", row.source === '规则推断冲突' ? 'text-red-600' : 'text-amber-600')}>{row.conf}</span>
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className={cn("h-full rounded-full", row.source === '规则推断冲突' ? 'bg-red-500' : 'bg-amber-500', row.confW)}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[12px]">
                          {row.source === '规则推断冲突' ? (
                            <span className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 inline-flex items-center gap-1">
                              <AlertTriangle size={10} /> 冲突
                            </span>
                          ) : (
                            <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 inline-flex items-center gap-1">
                              待确认
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="px-2.5 py-1 border border-gray-200 hover:border-blue-300 hover:text-blue-600 text-gray-600 text-[12px] font-semibold rounded-lg transition-colors">修改</button>
                            <button className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[12px] font-semibold rounded-lg transition-colors">确认</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-2.5 bg-gray-50/80 border-t border-gray-200 flex justify-center">
                  <button className="text-[12px] text-blue-600 hover:text-blue-700 font-medium">查看完整表格 (4,920 行)</button>
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2.5">
                <span className="text-[12px] text-gray-500 font-medium mr-1 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-blue-500" /> 推荐下一步:
                </span>
                <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-[12px] text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                  批量确认高置信字段
                </button>
                <button className="px-3 py-1.5 border border-red-200 rounded-lg text-[12px] text-red-600 hover:bg-red-50 font-medium transition-colors">
                  处理 41 个冲突字段
                </button>
                <button className="px-3 py-1.5 bg-blue-600 rounded-lg text-[12px] text-white hover:bg-blue-700 font-medium transition-colors ml-auto flex items-center gap-1">
                  继续生成对象模型 <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* --- Block 4: Graph + Deliverable --- */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6">
              <XinoBlockHeader icon={<Sparkles size={12} />} iconBg="bg-blue-600" time="09:50" tag="阶段 6: 业务对象生成" />
              <p className="text-[14px] text-gray-700 leading-relaxed mb-5">
                阶段 6 的「业务对象生成」已初步完成。我提取到了供应链核心领域的 12 个业务对象及它们的关联网络。您可以预览结果，也可以查看产出的治理报告。
              </p>
              <div className="border-t border-gray-100 pt-5 space-y-4">
                <p className="text-[13px] text-gray-600">已生成供应链领域核心业务对象 12 个，识别对象关系 21 条。</p>
                <div className="h-[200px] bg-gray-50 border border-gray-200 rounded-xl relative overflow-hidden flex items-center justify-center">
                  <div className="absolute top-3 left-3 bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-[12px] font-medium text-gray-600 shadow-sm">
                    节点数: 12 · 边数: 21
                  </div>
                  <div className="text-gray-400 flex flex-col items-center">
                    <Network size={28} className="mb-2 opacity-40 text-gray-300" />
                    <span className="text-[13px]">业务对象关系图谱渲染区</span>
                  </div>
                  <button className="absolute bottom-3 right-3 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] font-medium text-gray-700 hover:text-blue-600 flex items-center gap-1.5 transition-colors shadow-sm">
                    <Maximize2 size={12} /> 全屏探索
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-gray-200 rounded-xl p-3.5 flex gap-3 hover:border-blue-300 transition-colors cursor-pointer">
                    <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={16} />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-[13px] font-semibold text-gray-900 truncate">语义治理报告.pdf</div>
                      <div className="text-[11px] text-gray-500 mt-0.5 truncate">管理者查看治理结论</div>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-3.5 flex gap-3 hover:border-blue-300 transition-colors cursor-pointer">
                    <div className="w-9 h-9 bg-green-50 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Table size={16} />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-[13px] font-semibold text-gray-900 truncate">业务对象清单.xlsx</div>
                      <div className="text-[11px] text-gray-500 mt-0.5 truncate">业务和研发对齐对象模型</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Block 5: Fallback + ConfigForm --- */}
            <div className="bg-white rounded-2xl border border-rose-200/80 p-6">
              <XinoBlockHeader icon={<AlertTriangle size={12} />} iconBg="bg-rose-600" time="09:55" tag="前置校验失败" />
              <p className="text-[14px] text-gray-700 leading-relaxed mb-5">
                前置校验失败。我在尝试连接 <code className="bg-gray-100 text-gray-700 px-1 py-0.5 rounded text-[12px]">supply_chain_prod</code> 主库时遇到了连接超时的问题，请核对凭据或修改数据库配置重试。
              </p>
              <div className="space-y-4 border-t border-gray-100 pt-5">
                <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-4">
                  <h3 className="text-[14px] font-semibold text-rose-800 mb-2">数据源连接异常</h3>
                  <p className="text-[13px] text-rose-700/80 mb-3">无法连接到业务主库 <code className="font-mono">supply_chain_prod</code>。请验证凭据。</p>
                  <div className="text-[12px] text-rose-600/70 mb-4 bg-rose-100/50 p-2.5 rounded-lg font-mono">
                    Error: Connection timed out after 10000ms.
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-[12px] font-medium hover:bg-rose-700">重试连接</button>
                    <button className="px-3.5 py-1.5 bg-white border border-rose-200 text-rose-700 rounded-lg text-[12px] font-medium hover:bg-rose-50">联系系统管理员</button>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-xl p-4">
                  <h4 className="text-[14px] font-semibold text-gray-900 mb-4 flex items-center gap-1.5">
                    <Database size={14} className="text-gray-400" /> 更新数据库连接配置
                  </h4>
                  <div className="space-y-3 max-w-sm">
                    {[
                      { label: 'Host', default: '10.10.10.25' },
                      { label: 'Port', default: '3306' },
                      { label: 'Password', default: '*********', type: 'password' },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="block text-[12px] font-medium text-gray-700 mb-1">{f.label}</label>
                        <input type={f.type || 'text'} className="w-full h-8 px-2.5 text-[13px] border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" defaultValue={f.default} />
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 mt-4 border-t border-gray-100 flex justify-end gap-2">
                    <button className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-[12px] font-medium hover:bg-gray-50">取消</button>
                    <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-[12px] font-medium hover:bg-blue-700">保存并测试</button>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Block 6: StageProgress --- */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6">
              <XinoBlockHeader icon={<Sparkles size={12} />} iconBg="bg-blue-600" time="10:00" />
              <p className="text-[14px] text-gray-700 leading-relaxed mb-5">
                目前开始执行第 7 阶段「血缘与影响分析」，正在对解析日志表进行全盘扫描。您可以随时查看下面的实时运行状态。
              </p>
              <div className="border-t border-gray-100 pt-5">
                <div className="border border-blue-200 bg-blue-50/40 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                        <RefreshCw size={16} className="animate-spin" />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-semibold text-gray-900 leading-tight mb-0.5">阶段 7: 血缘与影响分析</h3>
                        <div className="text-[12px] text-blue-600 font-medium">执行中 (扫描解析日志表)</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[20px] font-bold text-blue-600 font-mono tracking-tight">45%</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">预计剩余 3 分钟</div>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-blue-500 rounded-full w-[45%] relative">
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[12px] text-gray-500">
                    <div className="flex gap-4">
                      <span>已解析: <strong className="text-gray-900">1.2w 行</strong></span>
                      <span>异常: <strong className="text-amber-600">2 项</strong></span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">查看实时日志 &rarr;</button>
                  </div>
                </div>
              </div>
            </div>

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
            <div className="flex-1 overflow-y-auto w-full">
              <div className="p-6 space-y-8">
              {activeTab === 'plan' ? (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div>
                    <div
                      className="flex items-center justify-between mb-2 cursor-pointer group"
                      onClick={() => setIsPlanExpanded(!isPlanExpanded)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-gray-900 tracking-wide uppercase group-hover:text-blue-600 transition-colors">整体进度</span>
                        <ChevronDown size={14} className={cn("text-gray-400 group-hover:text-blue-500 transition-transform duration-200", isPlanExpanded ? "rotate-180" : "")} />
                      </div>
                      <span className="text-[14px] font-bold text-blue-600">{task.progress}%</span>
                    </div>
                    <div className={cn("w-full h-2 bg-gray-100 rounded-full overflow-hidden transition-all", isPlanExpanded && "mb-6")}>
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${task.progress}%` }}></div>
                    </div>
                    {isPlanExpanded && (
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
                                <div className={cn(
                                  "text-[14px] font-semibold",
                                  status === 'done' ? "text-gray-900" : status === 'active' ? "text-blue-600" : "text-gray-400"
                                )}>
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
                    )}
                  </div>
                  <div className="w-full h-px bg-[#E5E7EB]"></div>
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
                  <div>
                    <h4 className="text-[14px] font-semibold text-gray-900 mb-3">最新交付物</h4>
                    <div className="space-y-2">
                      {[
                        { name: '字段语义理解进度报告', ext: '.md', time: '10:20' },
                        { name: '冲突字段清单', ext: '.xlsx', time: '10:15' },
                        { name: '字段语义理解结果', ext: '.csv', time: '10:05' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-colors">
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
                          <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-white text-gray-400 hover:text-blue-600 transition-colors">
                            <Download size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <h4 className="text-[14px] font-semibold text-gray-900 mb-3">基本信息</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-gray-500">任务 ID</span>
                        <span className="font-medium text-gray-900 tracking-wider">{task.id}</span>
                      </div>
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-gray-500">创建人</span>
                        <span className="font-medium text-gray-900">{task.creator.name}</span>
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
                  <div>
                    <h4 className="text-[14px] font-semibold text-gray-900 mb-3">实施范围</h4>
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2">
                      <div className="text-[13px] text-gray-700 flex">
                        <span className="text-gray-500 w-[60px] flex-shrink-0">连接：</span>
                        <span className="font-medium">{task.dataSource.name}<br/><span className="text-[12px] font-normal text-gray-500">{task.dataSource.type} ({task.dataSource.host})</span></span>
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
                  <div>
                    <h4 className="text-[14px] font-semibold text-gray-900 mb-3">参考信息源</h4>
                    <div className="space-y-2">
                      {['采购子系统_V2.pdf', 'SCM_2024汇总表.xlsx', '仓储与物流接口文档.docx'].map(f => (
                        <div key={f} className="flex items-center gap-2 text-[13px] text-gray-700">
                          <FileText size={14} className="text-gray-400" /> {f}
                        </div>
                      ))}
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
      )}
    </div>
  );
}
