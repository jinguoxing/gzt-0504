import React, { useState } from 'react';
import {
  ChevronRight, Check, X, Edit2, AlertTriangle, Eye, Download,
  FileText, CheckCircle2, Clock, ArrowLeft, Filter, Sparkles
} from 'lucide-react';
import { cn } from '@/utils/cn';
import mockData from '@/mock/field-review.json';
import { confidencePercent, priorityLabel, priorityColor, statusLabel } from '@/mock/helpers';

const TABS = [
  { key: 'all', label: '全部', count: mockData.overview.pendingFields + mockData.overview.conflictFields + mockData.overview.abnormalFields + mockData.overview.processedFields },
  { key: 'pending', label: '待确认', count: mockData.overview.pendingFields },
  { key: 'conflict', label: '冲突', count: mockData.overview.conflictFields },
  { key: 'abnormal', label: '异常', count: mockData.overview.abnormalFields },
  { key: 'processed', label: '已处理', count: mockData.overview.processedFields },
];

const FIELDS = mockData.fields.map(field => ({
  id: field.id,
  fieldName: field.fieldName,
  tableName: field.tableName,
  semanticA: field.semanticA,
  semanticB: field.semanticB,
  confidence: confidencePercent(field.confidence),
  risk: field.riskLevel,
  action: field.recommendedAction,
  status: field.status,
  samples: field.samples,
  evidence: field.evidence,
  similarFields: field.similarFields,
}));

const STAGES = mockData.sidePanel.plan.map(stage => ({
  name: stage.name,
  status: stage.status,
}));

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
            <span className="text-gray-600">{mockData.task.currentStage.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[20px] font-bold text-gray-900">{mockData.task.name}</h1>
                <span className={cn('text-[12px] font-medium px-2.5 py-1 rounded-full', priorityColor(mockData.task.status))}>{statusLabel(mockData.task.status)}</span>
              </div>
              <p className="text-[13px] text-gray-500 mt-1">
                {mockData.task.currentStage.name} {mockData.task.currentStage.index}/{mockData.task.stages.length} · 整体进度 {mockData.task.progress}%
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
              { label: '待确认字段', value: mockData.overview.pendingFields, color: 'text-orange-600' },
              { label: '冲突字段', value: mockData.overview.conflictFields, color: 'text-red-600' },
              { label: '异常字段', value: mockData.overview.abnormalFields, color: 'text-orange-600' },
              { label: '已处理', value: mockData.overview.processedFields, color: 'text-green-600' },
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
                      {priorityLabel(field.risk)}
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
                当前有 {mockData.overview.conflictFields} 个冲突字段，建议优先处理风险级别为<b>高/中</b>且置信度差异较大的字段。
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
                <div className="bg-gray-50 rounded-lg px-3 py-2"><span className="text-gray-400">状态</span><br /><span className="text-gray-700 font-medium">{statusLabel(selectedField.status)}</span></div>
                <div className="bg-gray-50 rounded-lg px-3 py-2"><span className="text-gray-400">置信度</span><br /><span className="text-gray-700 font-medium">{selectedField.confidence}%</span></div>
                <div className="bg-gray-50 rounded-lg px-3 py-2"><span className="text-gray-400">风险级别</span><br /><span className={cn('font-medium', riskColor[selectedField.risk])}>{priorityLabel(selectedField.risk)}</span></div>
              </div>

              {/* Sample Values */}
              {selectedField.samples && selectedField.samples.length > 0 && (
                <div>
                  <h4 className="text-[12px] text-gray-400 font-medium mb-2">字段样例值</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedField.samples.map((v: string) => (
                      <span key={v} className="bg-gray-100 text-gray-600 text-[12px] px-2 py-1 rounded font-mono">{v}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence */}
              {selectedField.evidence && selectedField.evidence.length > 0 && (
                <div>
                  <h4 className="text-[12px] text-gray-400 font-medium mb-2">推断依据</h4>
                  <div className="space-y-1.5">
                    {selectedField.evidence.map((line: string, idx: number) => (
                      <p key={idx} className="text-gray-600">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Similar Fields */}
              {selectedField.similarFields && selectedField.similarFields.length > 0 && (
                <div>
                  <h4 className="text-[12px] text-gray-400 font-medium mb-2">相似字段</h4>
                  <div className="space-y-2">
                    {selectedField.similarFields.map((sf: { fieldName: string; semantic: string; confidence: number }, idx: number) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-gray-700 font-medium">{sf.fieldName} ({sf.semantic})</span>
                        <span className="text-blue-600 font-medium text-[12px]">{confidencePercent(sf.confidence)}%</span>
                      </div>
                    ))}
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
