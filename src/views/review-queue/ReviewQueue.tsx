import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, Search, Filter, RotateCcw, Settings, 
  ChevronDown, CheckCircle2, AlertTriangle, Clock, Eye,
  Play, MoreHorizontal, X, FileText, User, 
  ArrowRight, Sparkles, Download, ListTodo, Activity, Users, Zap
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface ReviewItem {
  id: string;
  name: string;
  type: '待确认' | '待审核' | '异常' | '继续执行';
  sourceTask: string;
  stage: string;
  initiator: string;
  initTime: string;
  priority: '高' | '中' | '低';
  deadline: string;
  status: '待处理' | '待审核' | '异常' | '可继续执行' | '已处理' | '已忽略';
  action: string;
}

const REVIEW_DATA: ReviewItem[] = [
  {
    id: '1',
    name: '字段语义确认：订单金额',
    type: '待确认',
    sourceTask: '供应链语义治理闭环任务',
    stage: '字段语义理解 5/8',
    initiator: 'Xino',
    initTime: '今天 09:20',
    priority: '中',
    deadline: '今天 18:00',
    status: '待处理',
    action: '进入确认',
  },
  {
    id: '2',
    name: '字段语义确认：supplier_code',
    type: '待确认',
    sourceTask: '供应链语义治理闭环任务',
    stage: '字段语义理解 5/8',
    initiator: 'Xino',
    initTime: '今天 09:24',
    priority: '中',
    deadline: '今天 18:00',
    status: '待处理',
    action: '进入确认',
  },
  {
    id: '3',
    name: '待审核：订单对象映射修复',
    type: '待审核',
    sourceTask: '订单对象映射修复任务',
    stage: '对象关系校验 4/6',
    initiator: '张悦',
    initTime: '今天 11:18',
    priority: '高',
    deadline: '今天 17:00',
    status: '待审核',
    action: '去审核',
  },
  {
    id: '4',
    name: '待审核：供应商对象关系确认',
    type: '待审核',
    sourceTask: '客户语义治理任务',
    stage: '对象关系校验 3/6',
    initiator: '陈晨',
    initTime: '今天 10:42',
    priority: '中',
    deadline: '明天 12:00',
    status: '待审核',
    action: '去审核',
  },
  {
    id: '5',
    name: '异常处理：数据连接异常',
    type: '异常',
    sourceTask: '元数据自动采集任务',
    stage: '数据源连接 2/5',
    initiator: '系统',
    initTime: '今天 10:21',
    priority: '高',
    deadline: '尽快处理',
    status: '异常',
    action: '查看异常',
  },
  {
    id: '6',
    name: '异常处理：Schema 读取失败',
    type: '异常',
    sourceTask: '元数据自动采集任务',
    stage: 'Schema 扫描 3/5',
    initiator: '系统',
    initTime: '昨天 16:40',
    priority: '高',
    deadline: '尽快处理',
    status: '异常',
    action: '查看异常',
  },
  {
    id: '7',
    name: '继续执行：数据标准落地任务',
    type: '继续执行',
    sourceTask: '数据标准落地任务',
    stage: '标准映射 3/6',
    initiator: '王强',
    initTime: '昨天 17:05',
    priority: '中',
    deadline: '今天 20:00',
    status: '可继续执行',
    action: '继续执行',
  },
  {
    id: '8',
    name: '继续执行：采购主数据修复任务',
    type: '继续执行',
    sourceTask: '采购主数据修复任务',
    stage: '字段修复 1/4',
    initiator: '孙浩',
    initTime: '今天 10:05',
    priority: '高',
    deadline: '今天 19:00',
    status: '可继续执行',
    action: '继续执行',
  },
];

const KPI_CARDS = [
  { label: '全部事项', value: 17, trend: '+2', color: 'blue', icon: ListTodo },
  { label: '待确认', value: 6, trend: '+1', color: 'orange', icon: FileText },
  { label: '待审核', value: 4, trend: '-1', color: 'orange', icon: Eye },
  { label: '异常处理', value: 3, trend: '+1', color: 'red', icon: AlertTriangle },
  { label: '继续执行', value: 4, trend: '+1', color: 'green', icon: Play },
];

export default function ReviewQueue() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('全部');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSelectAll = () => {
    if (selectedIds.length === REVIEW_DATA.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(REVIEW_DATA.map(item => item.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="flex-1 flex bg-[#F8FAFC] overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
        <div className="p-6 pb-20">
          {/* Breadcrumb & Title */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-[13px] text-gray-400 mb-2">
                <span className="hover:text-gray-600 cursor-pointer" onClick={() => navigate('/tasks')}>任务</span>
                <ChevronRight size={14} />
                <span className="text-gray-600">待我处理</span>
              </div>
              <h1 className="text-[24px] font-bold text-gray-900 mb-1">待我处理</h1>
              <p className="text-[14px] text-gray-500">查看待确认、待审核、异常处理与继续执行事项，按优先级和来源任务快速推进处理。</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[14px] font-medium hover:bg-blue-700 transition-colors shadow-sm">批量处理</button>
              <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-[14px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download size={16} /> 导出事项
              </button>
            </div>
          </div>

          {/* Type Tabs */}
          <div className="flex items-center gap-8 mb-6 border-b border-gray-200">
            {['全部', '待确认', '待审核', '异常', '继续执行'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-3 text-[14px] font-medium transition-all relative",
                  activeTab === tab ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                )}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
              </button>
            ))}
          </div>

          {/* KPI Overview */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {KPI_CARDS.map(card => (
              <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] text-gray-500 font-medium">{card.label}</span>
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    card.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                    card.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                    card.color === 'red' ? 'bg-red-50 text-red-600' :
                    'bg-green-50 text-green-600'
                  )}>
                    <card.icon size={16} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[24px] font-bold text-gray-900">{card.value}</span>
                  <span className={cn(
                    "text-[12px] font-medium",
                    card.trend.startsWith('+') ? "text-green-600" : "text-red-600"
                  )}>较昨日 {card.trend}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索事项名称"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-10 pr-4 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-lg text-[13px] outline-none transition-all"
                />
              </div>
              <FilterSelect label="状态" options={['全部', '待处理', '处理中', '待审核', '异常', '已处理', '已忽略']} />
              <FilterSelect label="类型" options={['全部', '待确认', '待审核', '异常', '继续执行']} />
              <FilterSelect label="来源任务" options={['全部', '供应链语义治理', '订单修复', '客户治理']} />
              <FilterSelect label="发起人" options={['全部', 'Xino', '系统', '李桐']} />
              <FilterSelect label="优先级" options={['全部', '高', '中', '低']} />
              <FilterSelect label="截止时间" options={['全部', '今天', '近3天', '已逾期']} />
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[13px] text-gray-500">
                  <span>排序：</span>
                  <button className="flex items-center gap-1 text-gray-900 font-medium">
                    优先级 <ChevronDown size={14} />
                  </button>
                </div>
                <button className="text-[13px] text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                  <RotateCcw size={14} /> 重置筛选
                </button>
              </div>
              <button className="text-[13px] text-gray-600 hover:text-gray-900 flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg">
                <Settings size={14} /> 列设置
              </button>
            </div>
          </div>

          {/* Batch Selection Bar */}
          {selectedIds.length > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center justify-between mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-4">
                <span className="text-[14px] text-blue-700 font-medium px-1">已选择 {selectedIds.length} 个事项</span>
                <div className="h-4 w-px bg-blue-200" />
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 bg-white border border-blue-200 text-blue-600 text-[12px] font-medium rounded-md hover:bg-blue-50 transition-colors shadow-sm">批量确认</button>
                  <button className="px-3 py-1 bg-white border border-blue-200 text-blue-600 text-[12px] font-medium rounded-md hover:bg-blue-50 transition-colors shadow-sm">批量转派</button>
                  <button className="px-3 py-1 bg-white border border-blue-200 text-blue-600 text-[12px] font-medium rounded-md hover:bg-blue-50 transition-colors shadow-sm">批量忽略</button>
                </div>
              </div>
              <button onClick={() => setSelectedIds([])} className="p-1 hover:bg-blue-100 rounded-md text-blue-500 transition-colors">
                <X size={16} />
              </button>
            </div>
          )}

          {/* Main Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-5 py-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === REVIEW_DATA.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-4 text-[13px] font-semibold text-gray-600">事项名称</th>
                  <th className="px-4 py-4 text-[13px] font-semibold text-gray-600">类型</th>
                  <th className="px-4 py-4 text-[13px] font-semibold text-gray-600">来源任务</th>
                  <th className="px-4 py-4 text-[13px] font-semibold text-gray-600">所属阶段</th>
                  <th className="px-4 py-4 text-[13px] font-semibold text-gray-600">发起人</th>
                  <th className="px-4 py-4 text-[13px] font-semibold text-gray-600">发起时间</th>
                  <th className="px-4 py-4 text-[13px] font-semibold text-gray-600">优先级</th>
                  <th className="px-4 py-4 text-[13px] font-semibold text-gray-600">截止时间</th>
                  <th className="px-4 py-4 text-[13px] font-semibold text-gray-600">状态</th>
                  <th className="px-4 py-4 text-[13px] font-semibold text-gray-600 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {REVIEW_DATA.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <button className="text-[14px] font-medium text-blue-600 hover:text-blue-700 text-left line-clamp-1">{item.name}</button>
                    </td>
                    <td className="px-4 py-4">
                      <Badge type={item.type}>{item.type}</Badge>
                    </td>
                    <td className="px-4 py-4">
                      <button className="text-[13px] text-gray-600 hover:text-blue-600 transition-colors truncate max-w-[150px] text-left">{item.sourceTask}</button>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[13px] text-gray-500 whitespace-nowrap">{item.stage}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {item.initiator === 'Xino' ? <Sparkles size={14} className="text-blue-500" /> : <User size={14} className="text-gray-400" />}
                        <span className="text-[13px] text-gray-700">{item.initiator}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-[13px] text-gray-400">{item.initTime}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          item.priority === '高' ? 'bg-red-500' : item.priority === '中' ? 'bg-orange-500' : 'bg-gray-400'
                        )} />
                        <span className="text-[13px] text-gray-700">{item.priority}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={cn(
                        "text-[13px]",
                        item.deadline === '尽快处理' ? 'text-red-600 font-medium' : 'text-gray-500'
                      )}>{item.deadline}</span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[12px] font-medium hover:bg-blue-100 transition-colors">
                        {item.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[13px] text-gray-500">共 17 条</span>
              <div className="flex items-center gap-2">
                <button className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50" disabled>上一页</button>
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-600 text-white text-[13px] font-medium shadow-sm">1</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-[13px] text-gray-600 transition-colors">2</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-[13px] text-gray-600 transition-colors">3</button>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600">下一页</button>
                <select className="ml-2 text-[12px] border border-gray-200 rounded-md px-1.5 py-1 bg-white">
                  <option>10 条/页</option>
                  <option>20 条/页</option>
                  <option>50 条/页</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[320px] border-l border-gray-200 bg-[#F8FAFC] flex flex-col p-4 space-y-4 overflow-y-auto custom-scrollbar">
        {/* Processing Overview */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-bold text-gray-900">处理概览</h3>
            <div className="flex items-center gap-1 text-[11px] text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
              今天 2024-05-20 <ChevronDown size={12} />
            </div>
          </div>
          <div className="space-y-4">
            <OverviewItem label="我待确认的事项" value={6} icon={<FileText size={14} className="text-orange-500" />} />
            <OverviewItem label="我待审核的事项" value={4} icon={<Eye size={14} className="text-orange-500" />} />
            <OverviewItem label="我处理的异常" value={3} icon={<AlertTriangle size={14} className="text-red-500" />} />
            <OverviewItem label="我可继续执行" value={4} icon={<Play size={14} className="text-green-500" />} />
            <OverviewItem label="即将到期" value={5} icon={<Clock size={14} className="text-orange-500" />} />
            <div className="h-px bg-gray-50 my-2" />
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-gray-500">平均处理时长</span>
              <span className="font-bold text-gray-900">2.4h</span>
            </div>
          </div>
        </div>

        {/* Quick Views */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-[14px] font-bold text-gray-900 mb-4">快捷视图</h3>
          <div className="space-y-3">
            <QuickViewItem label="高优先级事项" count={7} color="red" />
            <QuickViewItem label="今日到期" count={5} color="orange" />
            <QuickViewItem label="异常事项" count={3} color="red" />
            <QuickViewItem label="我发起的事项" count={4} color="blue" />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-[14px] font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-blue-500" /> 说明 / 提示
          </h3>
          <ul className="space-y-3">
            <TipItem text="点击事项名称进入详情页" />
            <TipItem text="点击来源任务可跳转任务详情" />
            <TipItem text="支持批量确认、转派与忽略" />
            <TipItem text="异常事项应优先处理" />
          </ul>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="flex items-center gap-1.5 h-9 px-3 bg-gray-50 border border-transparent rounded-lg hover:border-gray-200 cursor-pointer transition-all">
      <span className="text-[13px] text-gray-500 whitespace-nowrap">{label}：</span>
      <span className="text-[13px] font-medium text-gray-900">{options[0]}</span>
      <ChevronDown size={14} className="text-gray-400" />
    </div>
  );
}

function Badge({ type, children }: { type: string; children: React.ReactNode }) {
  const styles: Record<string, string> = {
    '待确认': 'bg-orange-50 text-orange-700',
    '待审核': 'bg-orange-50 text-orange-700',
    '异常': 'bg-red-50 text-red-700',
    '继续执行': 'bg-green-50 text-green-700',
  };
  return (
    <span className={cn("px-2 py-0.5 rounded text-[12px] font-medium whitespace-nowrap", styles[type] || 'bg-gray-100 text-gray-600')}>
      {children}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    '待处理': 'bg-blue-50 text-blue-600',
    '待审核': 'bg-orange-50 text-orange-600',
    '异常': 'bg-red-50 text-red-600',
    '可继续执行': 'bg-green-50 text-green-600',
    '已处理': 'bg-green-50 text-green-600',
    '已忽略': 'bg-gray-100 text-gray-500',
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[12px] font-medium whitespace-nowrap border", styles[status] || 'bg-gray-50 text-gray-500')}>
      {status}
    </span>
  );
}

function OverviewItem({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-md bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
          {icon}
        </div>
        <span className="text-[13px] text-gray-600 group-hover:text-blue-600 transition-colors">{label}</span>
      </div>
      <span className="text-[14px] font-bold text-gray-900">{value}</span>
    </div>
  );
}

function QuickViewItem({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all group">
      <span className="text-[13px] text-gray-700 group-hover:text-blue-600 transition-colors">{label}</span>
      <span className={cn(
        "text-[12px] font-bold px-1.5 rounded",
        color === 'red' ? "text-red-600" : color === 'orange' ? "text-orange-600" : "text-blue-600"
      )}>{count}</span>
    </div>
  );
}

function TipItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-[12px] text-gray-500 leading-tight">
      <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
      {text}
    </li>
  );
}
