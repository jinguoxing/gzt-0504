import React, { useState } from 'react';
import {
  ChevronRight, Check, X, Edit2, AlertTriangle, Eye, Download,
  FileText, CheckCircle2, Clock, ArrowLeft, Filter, Sparkles
} from 'lucide-react';
import { cn } from '@/utils/cn';

const TABS = [
  { key: 'all', label: '全部', count: 532 },
  { key: 'pending', label: '待确认', count: 326 },
  { key: 'conflict', label: '冲突', count: 41 },
  { key: 'abnormal', label: '异常', count: 37 },
  { key: 'processed', label: '已处理', count: 128 },
];

const FIELDS = [
  { id: 'field-po-status', fieldName: 'po_status', tableName: 'po_status', semanticA: '采购订单状态', semanticB: '采购订单处理状态', confidence: 62, risk: 'MEDIUM', action: 'CONFIRM_A', status: 'PENDING' },
  { id: 'field-supplier-code', fieldName: 'supplier_code', tableName: 'supplier_info', semanticA: '供应商编码', semanticB: '供应商内部编码', confidence: 88, risk: 'LOW', action: 'CONFIRM_A', status: 'PENDING' },
  { id: 'field-wh-id', fieldName: 'wh_id', tableName: 'warehouse', semanticA: '仓库标识', semanticB: '仓库ID', confidence: 80, risk: 'LOW', action: 'CONFIRM_B', status: 'PENDING' },
  { id: 'field-line-type', fieldName: 'line_type', tableName: 'po_line', semanticA: '订单行类型', semanticB: '行项目类型', confidence: 45, risk: 'MEDIUM', action: 'MANUAL_EDIT', status: 'PENDING' },
  { id: 'field-buyer-name', fieldName: 'buyer_name', tableName: 'buyer', semanticA: '采购员姓名', semanticB: '采购负责人姓名', confidence: 55, risk: 'MEDIUM', action: 'MANUAL_EDIT', status: 'PENDING' },
];

const STAGES = [
  { name: '选择与采集', status: 'COMPLETED' },
  { name: 'Schema 扫描', status: 'COMPLETED' },
  { name: '业务表识别', status: 'COMPLETED' },
  { name: '字段候选生成', status: 'COMPLETED' },
  { name: '字段语义理解', status: 'RUNNING' },
  { name: '业务对象生成', status: 'PENDING' },
  { name: '血缘与影响分析', status: 'PENDING' },
  { name: '质量校验与校准', status: 'PENDING' },
];

const riskColor: Record<string, string> = {
  HIGH: 'text-red-600 bg-red-50',
  MEDIUM: 'text-orange-600 bg-orange-50',
  LOW: 'text-green-600 bg-green-50',
};

export default function ReviewDetail() {
  const [activeTab, setActiveTab] = useState('conflict');
  const [selectedField, setSelectedField] = useState(FIELDS[0]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="flex h-full bg-[#F8FAFC]">
      {/* Left: Main Table */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200">
        {/* Header */}
        <div className="px-8 py-5 bg-white border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2 text-[13px] text-gray-400 mb-2">
            <span>任务</span><ChevronRight size={14} />
            <span className="text-gray-600">字段确认与冲突处理</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[20px] font-bold text-gray-900">供应链语义治理闭环任务</h1>
                <span className="bg-blue-50 text-blue-700 text-[12px] font-medium px-2.5 py-1 rounded-full">执行中</span>
              </div>
              <p className="text-[13px] text-gray-500 mt-1">
                字段确认与冲突处理 5/8 · 整体进度 63%
              </p>
            </div>
            <div className="flex items-center gap-2">
              {selectedIds.length > 0 && (
                <>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <Check size={14} />批量确认
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <X size={14} />批量忽略
                  </button>
                </>
              )}
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Download size={14} />导出清单
              </button>
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="px-8 py-4 bg-white border-b border-gray-100">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: '待确认字段', value: 326, color: 'text-orange-600' },
              { label: '冲突字段', value: 41, color: 'text-red-600' },
              { label: '异常字段', value: 37, color: 'text-orange-600' },
              { label: '已处理', value: 128, color: 'text-green-600' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                <span className={cn('text-[20px] font-bold', item.color)}>{item.value}</span>
                <span className="text-[13px] text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-8 py-3 bg-white border-b border-gray-200 flex items-center gap-1">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-4 py-2 rounded-lg text-[13px] font-medium transition-colors',
                activeTab === tab.key ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
              )}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
          <div className="flex-1" />
          <button className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <Filter size={14} />筛选
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-8 py-4">
          <table className="w-full">
            <thead>
              <tr className="text-[12px] text-gray-400 font-medium uppercase tracking-wide border-b border-gray-100">
                <th className="w-10 py-3 text-left"><input type="checkbox" className="rounded" /></th>
                <th className="py-3 text-left">字段名</th>
                <th className="py-3 text-left">所在表</th>
                <th className="py-3 text-left">推断语义 A</th>
                <th className="py-3 text-left">推断语义 B</th>
                <th className="py-3 text-right">置信度</th>
                <th className="py-3 text-center">风险</th>
                <th className="py-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {FIELDS.map(field => (
                <tr
                  key={field.id}
                  onClick={() => setSelectedField(field)}
                  className={cn(
                    'border-b border-gray-50 cursor-pointer transition-colors',
                    selectedField?.id === field.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                  )}
                >
                  <td className="py-3" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(field.id)}
                      onChange={() => toggleSelect(field.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="py-3 text-[13px] font-semibold text-gray-900">{field.fieldName}</td>
                  <td className="py-3 text-[13px] text-gray-500">{field.tableName}</td>
                  <td className="py-3 text-[13px] text-gray-700">{field.semanticA}</td>
                  <td className="py-3 text-[13px] text-gray-500">{field.semanticB}</td>
                  <td className="py-3 text-[13px] text-right font-medium text-gray-700">{field.confidence}%</td>
                  <td className="py-3 text-center">
                    <span className={cn('text-[12px] font-medium px-2 py-0.5 rounded', riskColor[field.risk])}>
                      {field.risk === 'HIGH' ? '高' : field.risk === 'MEDIUM' ? '中' : '低'}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="text-[12px] text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors">确认A</button>
                      <button className="text-[12px] text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded transition-colors">确认B</button>
                      <button className="text-[12px] text-gray-500 hover:bg-gray-100 px-2 py-1 rounded transition-colors">
                        <Edit2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Xino Suggestion */}
        <div className="px-8 py-4 bg-white border-t border-gray-200 flex-shrink-0">
          <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles size={14} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] text-blue-800">
                当前有 41 个冲突字段，建议优先处理风险级别为<b>高/中</b>且置信度差异较大的字段。
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button className="text-[12px] font-medium text-blue-600 bg-white px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">推荐排序</button>
                <button className="text-[12px] font-medium text-blue-600 bg-white px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">仅看高风险</button>
                <button className="text-[12px] font-medium text-blue-600 bg-white px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">按影响范围排序</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Detail Panel */}
      <div className="w-[400px] flex flex-col bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto">
        {selectedField ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-gray-900">{selectedField.fieldName}</h3>
                <span className="text-[12px] font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded">冲突</span>
              </div>
            </div>

            <div className="space-y-4 text-[13px]">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg px-3 py-2"><span className="text-gray-400">所在表</span><br /><span className="text-gray-700 font-medium">{selectedField.tableName}</span></div>
                <div className="bg-gray-50 rounded-lg px-3 py-2"><span className="text-gray-400">状态</span><br /><span className="text-gray-700 font-medium">待确认</span></div>
                <div className="bg-gray-50 rounded-lg px-3 py-2"><span className="text-gray-400">置信度</span><br /><span className="text-gray-700 font-medium">{selectedField.confidence}%</span></div>
                <div className="bg-gray-50 rounded-lg px-3 py-2"><span className="text-gray-400">风险级别</span><br /><span className={cn('font-medium', riskColor[selectedField.risk])}>{selectedField.risk === 'HIGH' ? '高' : selectedField.risk === 'MEDIUM' ? '中' : '低'}</span></div>
              </div>

              {/* Sample Values */}
              {selectedField.id === 'field-po-status' && (
                <div>
                  <h4 className="text-[12px] text-gray-400 font-medium mb-2">字段样例值</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {['NEW', 'APPROVED', 'REJECTED', 'CANCELLED', 'CLOSED', 'ON_HOLD'].map(v => (
                      <span key={v} className="bg-gray-100 text-gray-600 text-[12px] px-2 py-1 rounded font-mono">{v}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence */}
              {selectedField.id === 'field-po-status' && (
                <div>
                  <h4 className="text-[12px] text-gray-400 font-medium mb-2">推断依据</h4>
                  <div className="space-y-1.5">
                    <p className="text-gray-600">来源：采购订单状态码字典</p>
                    <p className="text-gray-600">匹配度：78%</p>
                    <p className="text-gray-600">在采购流程中表示订单当前状态</p>
                  </div>
                </div>
              )}

              {/* Similar Fields */}
              {selectedField.id === 'field-po-status' && (
                <div>
                  <h4 className="text-[12px] text-gray-400 font-medium mb-2">相似字段</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <span className="text-gray-700 font-medium">order_status (订单状态)</span>
                      <span className="text-blue-600 font-medium text-[12px]">89%</span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <span className="text-gray-700 font-medium">po_order_status (采购订单状态)</span>
                      <span className="text-blue-600 font-medium text-[12px]">82%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Related Objects */}
              <div>
                <h4 className="text-[12px] text-gray-400 font-medium mb-2">相关业务对象</h4>
                <div className="flex flex-wrap gap-2">
                  {['采购订单 (PO)', '采购流程', '供应商管理'].map(obj => (
                    <span key={obj} className="bg-blue-50 text-blue-700 text-[12px] px-3 py-1.5 rounded-lg">{obj}</span>
                  ))}
                </div>
              </div>

              {/* Operation History */}
              <div>
                <h4 className="text-[12px] text-gray-400 font-medium mb-2">操作记录</h4>
                <div className="space-y-2 text-[12px] text-gray-500">
                  <div className="flex items-center gap-2"><Clock size={12} /> 09:32 Xino 自动识别为冲突字段</div>
                  <div className="flex items-center gap-2"><Eye size={12} /> 09:35 李桐 查看并开始处理</div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 mt-6 pt-4">
              <h4 className="text-[12px] text-gray-400 font-medium mb-3">任务计划</h4>
              <div className="space-y-2">
                {STAGES.map((stage, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[12px]">
                    {stage.status === 'COMPLETED' ? <CheckCircle2 size={14} className="text-green-500" /> :
                     stage.status === 'RUNNING' ? <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-500 bg-blue-100" /> :
                     <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300" />}
                    <span className={cn(
                      stage.status === 'COMPLETED' ? 'text-gray-400 line-through' :
                      stage.status === 'RUNNING' ? 'text-blue-600 font-medium' : 'text-gray-400'
                    )}>{stage.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-[14px]">
            点击左侧字段查看详情
          </div>
        )}
      </div>
    </div>
  );
}
