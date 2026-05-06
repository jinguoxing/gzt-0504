import React, { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ChevronRight, Check, X, Edit2, AlertTriangle, Eye, Download,
  FileText, CheckCircle2, Clock, ArrowLeft, Filter, Sparkles,
  Table, ShieldAlert, Copy, ExternalLink, Pencil
} from 'lucide-react';
import { cn } from '@/utils/cn';
import mockData from '@/mock/field-review.json';
import { confidencePercent, priorityLabel, priorityColor, statusLabel } from '@/mock/helpers';

// ─── Types ─────────────────────────────────────────────────────────────

interface FieldRow {
  id: string;
  fieldName: string;
  tableName: string;
  semanticA: string;
  semanticB: string;
  confidence: number;
  risk: string;
  action: string;
  status: string;
  samples?: string[];
  evidence?: string[];
  similarFields?: { fieldName: string; semantic: string; confidence: number }[];
  confirmedSemantic?: string;
}

interface FieldDetailData {
  id: string;
  fieldName: string;
  tableName: string;
  semanticA: string;
  semanticB: string;
  confidence: number;
  risk: string;
  status: string;
  samples?: string[];
  evidence?: string[];
  similarFields?: { fieldName: string; semantic: string; confidence: number }[];
  confirmedSemantic?: string;
}

interface IssueDetailData {
  id: string;
  title: string;
  severity: string;
  description: string;
}

interface DeliverableDetailData {
  id: string;
  name: string;
  type: string;
  description?: string;
  sizeBytes?: number;
}

type DetailPanel =
  | { kind: 'field'; data: FieldDetailData }
  | { kind: 'issue'; data: IssueDetailData }
  | { kind: 'deliverable'; data: DeliverableDetailData }
  | null;

// ─── Constants ─────────────────────────────────────────────────────────

const riskColor: Record<string, string> = {
  HIGH: 'text-red-600 bg-red-50',
  MEDIUM: 'text-orange-600 bg-orange-50',
  LOW: 'text-green-600 bg-green-50',
};

const RISK_ORDER: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

const STATUS_FILTER_MAP: Record<string, string[]> = {
  all: [],
  pending: ['PENDING'],
  conflict: ['PENDING'],
  abnormal: ['PENDING'],
  processed: ['CONFIRMED_A', 'CONFIRMED_B', 'EDITED', 'IGNORED'],
};

// ─── Main Component ────────────────────────────────────────────────────

export default function ReviewDetail() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── State ──────────────────────────────────────────────────────────

  const [fields, setFields] = useState<FieldRow[]>(() =>
    mockData.fields.map(field => ({
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
    }))
  );

  const [activeTab, setActiveTab] = useState('conflict');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortMode, setSortMode] = useState<'default' | 'risk' | 'impact'>('default');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [tableFilter, setTableFilter] = useState<string>('ALL');

  // URL-driven state
  const fieldIdParam = searchParams.get('fieldId');
  const issueIdParam = searchParams.get('issueId');
  const deliverableIdParam = searchParams.get('deliverableId');

  const [selectedFieldId, setSelectedFieldId] = useState<string>(
    () => fieldIdParam || mockData.fields[0]?.id || ''
  );

  const [detailPanel, setDetailPanel] = useState<DetailPanel>(() => {
    if (issueIdParam) {
      const risk = mockData.sidePanel.risks.find(r => r.id === issueIdParam);
      if (risk) return { kind: 'issue', data: { id: risk.id, title: risk.title, severity: risk.level === 'HIGH' ? 'high' : 'medium', description: `${risk.title}，需要尽快处理以避免影响后续阶段。` } };
    }
    if (deliverableIdParam) {
      const deliv = mockData.sidePanel.deliverables.find(d => d.id === deliverableIdParam);
      if (deliv) return { kind: 'deliverable', data: { id: deliv.id, name: deliv.name, type: deliv.type, description: (deliv as any).description, sizeBytes: (deliv as any).sizeBytes } };
    }
    return null;
  });

  // ── Helpers ─────────────────────────────────────────────────────────

  const updateUrl = useCallback((params: Record<string, string | null>) => {
    setSearchParams(prev => {
      prev.delete('fieldId');
      prev.delete('issueId');
      prev.delete('deliverableId');
      for (const [k, v] of Object.entries(params)) {
        if (v) prev.set(k, v); else prev.delete(k);
      }
      return prev;
    }, { replace: true });
  }, [setSearchParams]);

  const selectedField = useMemo(() =>
    fields.find(f => f.id === selectedFieldId) || null
  , [fields, selectedFieldId]);

  // ── Computed: tabs with live counts ──────────────────────────────────

  const tabs = useMemo(() => {
    const pending = fields.filter(f => f.status === 'PENDING').length;
    const conflict = fields.filter(f => f.status === 'PENDING' && f.confidence < 70).length;
    const abnormal = fields.filter(f => f.status === 'PENDING' && f.confidence >= 70).length;
    const processed = fields.filter(f => f.status !== 'PENDING').length;
    return [
      { key: 'all', label: '全部', count: fields.length },
      { key: 'pending', label: '待确认', count: pending },
      { key: 'conflict', label: '冲突', count: conflict },
      { key: 'abnormal', label: '异常', count: abnormal },
      { key: 'processed', label: '已处理', count: processed },
    ];
  }, [fields]);

  // ── Computed: filtered + sorted fields ───────────────────────────────

  const filteredFields = useMemo(() => {
    let result = [...fields];

    // Tab filter
    if (activeTab === 'pending') result = result.filter(f => f.status === 'PENDING');
    else if (activeTab === 'conflict') result = result.filter(f => f.status === 'PENDING' && f.confidence < 70);
    else if (activeTab === 'abnormal') result = result.filter(f => f.status === 'PENDING' && f.confidence >= 70);
    else if (activeTab === 'processed') result = result.filter(f => f.status !== 'PENDING');

    // Risk filter
    if (riskFilter !== 'ALL') result = result.filter(f => f.risk === riskFilter);

    // Table filter
    if (tableFilter !== 'ALL') result = result.filter(f => f.tableName === tableFilter);

    // Sort
    if (sortMode === 'risk') {
      result.sort((a, b) => (RISK_ORDER[a.risk] ?? 9) - (RISK_ORDER[b.risk] ?? 9));
    } else if (sortMode === 'impact') {
      result.sort((a, b) => a.confidence - b.confidence);
    } else {
      result.sort((a, b) => (RISK_ORDER[a.risk] ?? 9) - (RISK_ORDER[b.risk] ?? 9) || a.confidence - b.confidence);
    }

    return result;
  }, [fields, activeTab, riskFilter, tableFilter, sortMode]);

  // ── Computed: filter options ─────────────────────────────────────────

  const tableOptions = useMemo(() => {
    const tables = [...new Set(fields.map(f => f.tableName))];
    return tables;
  }, [fields]);

  // ── Computed: overview stats (dynamic) ───────────────────────────────

  const overviewStats = useMemo(() => ({
    pending: fields.filter(f => f.status === 'PENDING').length,
    conflict: fields.filter(f => f.status === 'PENDING' && f.confidence < 70).length,
    abnormal: fields.filter(f => f.status === 'PENDING' && f.confidence >= 70).length,
    processed: fields.filter(f => f.status !== 'PENDING').length,
  }), [fields]);

  // ── Handlers: field actions ──────────────────────────────────────────

  const handleConfirmA = (fieldId: string) => {
    setFields(prev => prev.map(f =>
      f.id === fieldId ? { ...f, status: 'CONFIRMED_A', confirmedSemantic: f.semanticA } : f
    ));
  };

  const handleConfirmB = (fieldId: string) => {
    setFields(prev => prev.map(f =>
      f.id === fieldId ? { ...f, status: 'CONFIRMED_B', confirmedSemantic: f.semanticB } : f
    ));
  };

  const handleEdit = (fieldId: string) => {
    setFields(prev => prev.map(f =>
      f.id === fieldId ? { ...f, status: 'EDITED' } : f
    ));
  };

  // ── Handlers: batch operations ───────────────────────────────────────

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    const visibleIds = filteredFields.map(f => f.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every(id => selectedIds.includes(id));
    setSelectedIds(allSelected
      ? selectedIds.filter(id => !visibleIds.includes(id))
      : [...new Set([...selectedIds, ...visibleIds])]
    );
  };

  const handleBatchConfirm = () => {
    setFields(prev => prev.map(f =>
      selectedIds.includes(f.id) && f.status === 'PENDING'
        ? { ...f, status: 'CONFIRMED_A', confirmedSemantic: f.semanticA } : f
    ));
    setSelectedIds([]);
  };

  const handleBatchIgnore = () => {
    setFields(prev => prev.map(f =>
      selectedIds.includes(f.id) && f.status === 'PENDING'
        ? { ...f, status: 'IGNORED' } : f
    ));
    setSelectedIds([]);
  };

  // ── Handlers: row / panel clicks ─────────────────────────────────────

  const handleFieldRowClick = (field: FieldRow) => {
    setSelectedFieldId(field.id);
    setDetailPanel(null);
    updateUrl({ fieldId: field.id });
  };

  const handleIssueClick = (risk: { id: string; title: string; level: string }) => {
    setDetailPanel({
      kind: 'issue',
      data: { id: risk.id, title: risk.title, severity: risk.level === 'HIGH' ? 'high' : 'medium', description: `${risk.title}，需要尽快处理以避免影响后续阶段。` }
    });
    updateUrl({ issueId: risk.id });
  };

  const handleDeliverableClick = (deliv: { id: string; name: string; type: string; description?: string; sizeBytes?: number }) => {
    setDetailPanel({
      kind: 'deliverable',
      data: { id: deliv.id, name: deliv.name, type: deliv.type, description: deliv.description, sizeBytes: deliv.sizeBytes }
    });
    updateUrl({ deliverableId: deliv.id });
  };

  const handleDetailBack = () => {
    setDetailPanel(null);
    updateUrl({ fieldId: selectedFieldId });
  };

  // ── Handlers: Xino suggestions ───────────────────────────────────────

  const handleSortByRisk = () => {
    setSortMode('risk');
    setActiveTab('all');
  };

  const handleShowHighRisk = () => {
    setRiskFilter('HIGH');
    setActiveTab('all');
  };

  const handleSortByImpact = () => {
    setSortMode('impact');
    setActiveTab('all');
  };

  // ── Handlers: issue detail actions ───────────────────────────────────

  const handleIssueIgnore = () => {
    handleDetailBack();
  };

  const handleIssueProcess = () => {
    // Navigate to conflict tab to process
    setActiveTab('conflict');
    handleDetailBack();
  };

  // ── Render ───────────────────────────────────────────────────────────

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
                  <button onClick={handleBatchConfirm}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <Check size={14} />批量确认
                  </button>
                  <button onClick={handleBatchIgnore}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
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
              { label: '待确认字段', value: overviewStats.pending, color: 'text-orange-600' },
              { label: '冲突字段', value: overviewStats.conflict, color: 'text-red-600' },
              { label: '异常字段', value: overviewStats.abnormal, color: 'text-orange-600' },
              { label: '已处理', value: overviewStats.processed, color: 'text-green-600' },
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
          {tabs.map(tab => (
            <button key={tab.key}
              onClick={() => { setActiveTab(tab.key); setRiskFilter('ALL'); setTableFilter('ALL'); }}
              className={cn(
                'px-4 py-2 rounded-lg text-[13px] font-medium transition-colors',
                activeTab === tab.key ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
              )}>
              {tab.label} ({tab.count})
            </button>
          ))}
          <div className="flex-1" />
          {/* Filter dropdown */}
          <div className="relative">
            <button onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={cn("flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded-lg transition-colors",
                riskFilter !== 'ALL' || tableFilter !== 'ALL' ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100")}>
              <Filter size={14} />筛选
              {(riskFilter !== 'ALL' || tableFilter !== 'ALL') && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-3 px-4 w-56">
                <div className="mb-3">
                  <span className="text-[12px] text-gray-400 font-medium">风险级别</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(v => (
                      <button key={v} onClick={() => setRiskFilter(v)}
                        className={cn("text-[12px] px-2 py-1 rounded transition-colors",
                          riskFilter === v ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100')}>
                        {v === 'ALL' ? '全部' : priorityLabel(v)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[12px] text-gray-400 font-medium">所在表</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <button onClick={() => setTableFilter('ALL')}
                      className={cn("text-[12px] px-2 py-1 rounded transition-colors",
                        tableFilter === 'ALL' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100')}>
                      全部
                    </button>
                    {tableOptions.map(t => (
                      <button key={t} onClick={() => setTableFilter(t)}
                        className={cn("text-[12px] px-2 py-1 rounded transition-colors",
                          tableFilter === t ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100')}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-8 py-4">
          <table className="w-full">
            <thead>
              <tr className="text-[12px] text-gray-400 font-medium uppercase tracking-wide border-b border-gray-100">
                <th className="w-10 py-3 text-left">
                  <input type="checkbox"
                    checked={filteredFields.length > 0 && filteredFields.every(f => selectedIds.includes(f.id))}
                    onChange={toggleSelectAll}
                    className="rounded" />
                </th>
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
              {filteredFields.map(field => {
                const isProcessed = field.status !== 'PENDING';
                return (
                  <tr key={field.id}
                    onClick={() => handleFieldRowClick(field)}
                    className={cn(
                      'border-b border-gray-50 cursor-pointer transition-colors',
                      selectedField?.id === field.id ? 'bg-blue-50' : 'hover:bg-gray-50',
                      isProcessed && 'opacity-60'
                    )}>
                    <td className="py-3" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={selectedIds.includes(field.id)}
                        onChange={() => toggleSelect(field.id)} className="rounded"
                        disabled={isProcessed} />
                    </td>
                    <td className="py-3">
                      <div className="text-[13px] font-semibold text-gray-900">{field.fieldName}</div>
                      {field.confirmedSemantic && <div className="text-[11px] text-green-600 mt-0.5">→ {field.confirmedSemantic}</div>}
                    </td>
                    <td className="py-3 text-[13px] text-gray-500">{field.tableName}</td>
                    <td className="py-3 text-[13px] text-gray-700">{field.semanticA}</td>
                    <td className="py-3 text-[13px] text-gray-500">{field.semanticB}</td>
                    <td className="py-3 text-[13px] text-right font-medium text-gray-700">{field.confidence}%</td>
                    <td className="py-3 text-center">
                      <span className={cn('text-[12px] font-medium px-2 py-0.5 rounded', riskColor[field.risk])}>
                        {priorityLabel(field.risk)}
                      </span>
                    </td>
                    <td className="py-3 text-center" onClick={e => e.stopPropagation()}>
                      {isProcessed ? (
                        <span className={cn('text-[12px] font-medium px-2 py-1 rounded',
                          field.status === 'IGNORED' ? 'text-gray-400' : 'text-green-600 bg-green-50')}>
                          {field.status === 'CONFIRMED_A' ? '已确认 A' :
                           field.status === 'CONFIRMED_B' ? '已确认 B' :
                           field.status === 'EDITED' ? '已编辑' :
                           field.status === 'IGNORED' ? '已忽略' : field.status}
                        </span>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => handleConfirmA(field.id)}
                            className="text-[12px] text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors">确认A</button>
                          <button onClick={() => handleConfirmB(field.id)}
                            className="text-[12px] text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded transition-colors">确认B</button>
                          <button onClick={() => handleEdit(field.id)}
                            className="text-[12px] text-gray-500 hover:bg-gray-100 px-2 py-1 rounded transition-colors">
                            <Edit2 size={12} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredFields.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <CheckCircle2 size={28} className="mx-auto text-green-400 mb-2" />
                    <p className="text-[14px] text-gray-500">当前分类下没有待处理字段</p>
                  </td>
                </tr>
              )}
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
                当前有 {overviewStats.conflict} 个冲突字段，建议优先处理风险级别为<b>高/中</b>且置信度差异较大的字段。
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button onClick={handleSortByRisk}
                  className={cn("text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors",
                    sortMode === 'risk' ? 'bg-blue-600 text-white' : 'text-blue-600 bg-white hover:bg-blue-100')}>
                  推荐排序
                </button>
                <button onClick={handleShowHighRisk}
                  className={cn("text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors",
                    riskFilter === 'HIGH' ? 'bg-blue-600 text-white' : 'text-blue-600 bg-white hover:bg-blue-100')}>
                  仅看高风险
                </button>
                <button onClick={handleSortByImpact}
                  className={cn("text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors",
                    sortMode === 'impact' ? 'bg-blue-600 text-white' : 'text-blue-600 bg-white hover:bg-blue-100')}>
                  按影响范围排序
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Detail Panel */}
      <div className="w-[400px] flex flex-col bg-white border-l border-gray-200 flex-shrink-0 overflow-hidden">
        {detailPanel ? (
          <ReviewDetailPanelRouter panel={detailPanel} onBack={handleDetailBack} onIssueIgnore={handleIssueIgnore} onIssueProcess={handleIssueProcess} />
        ) : selectedField ? (
          <ReviewFieldDetailPanel
            field={selectedField}
            onConfirmA={() => handleConfirmA(selectedField.id)}
            onConfirmB={() => handleConfirmB(selectedField.id)}
            onEdit={() => handleEdit(selectedField.id)}
            onIssueClick={handleIssueClick}
            onDeliverableClick={handleDeliverableClick}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-[14px]">
            点击左侧字段查看详情
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Detail Panel Router ───────────────────────────────────────────────

function ReviewDetailPanelRouter({ panel, onBack, onIssueIgnore, onIssueProcess }: {
  panel: NonNullable<DetailPanel>;
  onBack: () => void;
  onIssueIgnore: () => void;
  onIssueProcess: () => void;
}) {
  if (panel.kind === 'issue') return <ReviewIssueDetailPanel data={panel.data} onBack={onBack} onIgnore={onIssueIgnore} onProcess={onIssueProcess} />;
  if (panel.kind === 'deliverable') return <ReviewDeliverableDetailPanel data={panel.data} onBack={onBack} />;
  return null;
}

// ─── Field Detail Panel ────────────────────────────────────────────────

function ReviewFieldDetailPanel({ field, onConfirmA, onConfirmB, onEdit, onIssueClick, onDeliverableClick }: {
  field: FieldRow;
  onConfirmA: () => void;
  onConfirmB: () => void;
  onEdit: () => void;
  onIssueClick: (risk: { id: string; title: string; level: string }) => void;
  onDeliverableClick: (deliv: { id: string; name: string; type: string; description?: string; sizeBytes?: number }) => void;
}) {
  const isProcessed = field.status !== 'PENDING';

  return (
    <div className="flex-1 overflow-y-auto p-6 animate-in slide-in-from-right-2 duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-[16px] font-bold text-gray-900">{field.fieldName}</h3>
          {isProcessed ? (
            <span className="text-[12px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
              {field.status === 'CONFIRMED_A' ? '已确认 A' :
               field.status === 'CONFIRMED_B' ? '已确认 B' :
               field.status === 'EDITED' ? '已编辑' :
               field.status === 'IGNORED' ? '已忽略' : field.status}
            </span>
          ) : (
            <span className="text-[12px] font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded">冲突</span>
          )}
        </div>
      </div>

      <div className="space-y-4 text-[13px]">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg px-3 py-2"><span className="text-gray-400">所在表</span><br /><span className="text-gray-700 font-medium">{field.tableName}</span></div>
          <div className="bg-gray-50 rounded-lg px-3 py-2"><span className="text-gray-400">状态</span><br /><span className="text-gray-700 font-medium">{statusLabel(field.status)}</span></div>
          <div className="bg-gray-50 rounded-lg px-3 py-2"><span className="text-gray-400">置信度</span><br /><span className="text-gray-700 font-medium">{field.confidence}%</span></div>
          <div className="bg-gray-50 rounded-lg px-3 py-2"><span className="text-gray-400">风险级别</span><br /><span className={cn('font-medium', riskColor[field.risk])}>{priorityLabel(field.risk)}</span></div>
        </div>

        {/* Confirmed semantic display */}
        {field.confirmedSemantic && (
          <div className="bg-green-50 border border-green-100 rounded-lg px-3 py-2">
            <span className="text-green-600 text-[12px]">已确认语义</span><br />
            <span className="text-gray-900 font-medium">{field.confirmedSemantic}</span>
          </div>
        )}

        {field.samples && field.samples.length > 0 && (
          <div>
            <h4 className="text-[12px] text-gray-400 font-medium mb-2">字段样例值</h4>
            <div className="flex flex-wrap gap-1.5">
              {field.samples.map((v: string) => (
                <span key={v} className="bg-gray-100 text-gray-600 text-[12px] px-2 py-1 rounded font-mono">{v}</span>
              ))}
            </div>
          </div>
        )}

        {field.evidence && field.evidence.length > 0 && (
          <div>
            <h4 className="text-[12px] text-gray-400 font-medium mb-2">推断依据</h4>
            <div className="space-y-1.5">
              {field.evidence.map((line: string, idx: number) => (
                <p key={idx} className="text-gray-600">{line}</p>
              ))}
            </div>
          </div>
        )}

        {field.similarFields && field.similarFields.length > 0 && (
          <div>
            <h4 className="text-[12px] text-gray-400 font-medium mb-2">相似字段</h4>
            <div className="space-y-2">
              {field.similarFields.map((sf: { fieldName: string; semantic: string; confidence: number }, idx: number) => (
                <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-gray-700 font-medium">{sf.fieldName} ({sf.semantic})</span>
                  <span className="text-blue-600 font-medium text-[12px]">{confidencePercent(sf.confidence)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-[12px] text-gray-400 font-medium mb-2">相关业务对象</h4>
          <div className="flex flex-wrap gap-2">
            {['采购订单 (PO)', '采购流程', '供应商管理'].map(obj => (
              <span key={obj} className="bg-blue-50 text-blue-700 text-[12px] px-3 py-1.5 rounded-lg">{obj}</span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[12px] text-gray-400 font-medium mb-2">操作记录</h4>
          <div className="space-y-2 text-[12px] text-gray-500">
            <div className="flex items-center gap-2"><Clock size={12} /> 09:32 Xino 自动识别为冲突字段</div>
            <div className="flex items-center gap-2"><Eye size={12} /> 09:35 李桐 查看并开始处理</div>
            {isProcessed && <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-green-500" /> 09:40 李桐 确认语义</div>}
          </div>
        </div>
      </div>

      {/* Action buttons for pending fields */}
      {!isProcessed && (
        <div className="border-t border-gray-100 mt-6 pt-4 space-y-2">
          <h4 className="text-[12px] text-gray-400 font-medium mb-3">处理操作</h4>
          <button onClick={onConfirmA}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold py-2.5 rounded-lg transition-colors">
            <Check size={14} /> 确认为「{field.semanticA}」
          </button>
          <button onClick={onConfirmB}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold py-2.5 rounded-lg transition-colors">
            <Check size={14} /> 确认为「{field.semanticB}」
          </button>
          <button onClick={onEdit}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-[13px] font-semibold py-2.5 rounded-lg transition-colors">
            <Pencil size={14} /> 手动编辑
          </button>
        </div>
      )}

      {/* Risks */}
      <div className="border-t border-gray-100 mt-6 pt-4">
        <h4 className="flex items-center gap-2 text-[13px] font-semibold text-gray-700 mb-3">
          <AlertTriangle size={14} className="text-red-500" />
          风险与待处理
        </h4>
        <div className="space-y-2">
          {mockData.sidePanel.risks.map((risk) => {
            const isHigh = risk.level === 'HIGH';
            return (
              <div key={risk.id} onClick={() => onIssueClick(risk)}
                className={cn("border rounded-lg p-3 flex justify-between items-center cursor-pointer transition-colors", isHigh ? "bg-red-50 border-red-100 hover:bg-red-100" : "bg-amber-50 border-amber-100 hover:bg-amber-100")}>
                <div className="flex items-center gap-2">
                  <div className={cn("w-6 h-6 rounded-full bg-white flex items-center justify-center font-bold text-[11px] shadow-sm", isHigh ? "text-red-600" : "text-amber-600")}>
                    {isHigh ? '5' : '18'}
                  </div>
                  <span className="text-[12px] font-medium text-gray-700">{risk.title}</span>
                </div>
                <span className="text-[11px] text-gray-400">{risk.actionLabel} →</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deliverables */}
      <div className="border-t border-gray-100 mt-4 pt-4">
        <h4 className="text-[13px] font-semibold text-gray-700 mb-3">最新交付物</h4>
        <div className="space-y-2">
          {mockData.sidePanel.deliverables.map((item) => (
            <div key={item.id}
              onClick={() => onDeliverableClick({ id: item.id, name: item.name, type: item.type, description: (item as any).description, sizeBytes: (item as any).sizeBytes })}
              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-colors">
              <div className="flex items-start gap-3 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 mt-0.5">
                  <FileText size={14} />
                </div>
                <div>
                  <div className="text-[12px] font-medium text-gray-900 truncate">{item.name}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{(item as any).description}</div>
                </div>
              </div>
              <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Stage timeline */}
      <div className="border-t border-gray-100 mt-4 pt-4">
        <h4 className="text-[12px] text-gray-400 font-medium mb-3">任务计划</h4>
        <div className="space-y-2">
          {mockData.sidePanel.plan.map((stage, idx) => (
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
  );
}

// ─── Issue Detail Panel ────────────────────────────────────────────────

function ReviewIssueDetailPanel({ data, onBack, onIgnore, onProcess }: {
  data: IssueDetailData; onBack: () => void; onIgnore: () => void; onProcess: () => void;
}) {
  const isHigh = data.severity === 'high';

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-2 duration-200">
      <div className="px-4 py-4 border-b border-gray-200 flex items-center gap-3 flex-shrink-0">
        <button onClick={onBack} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <h3 className="text-[15px] font-semibold text-gray-900">风险详情</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <div className="flex items-start gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", isHigh ? "bg-red-100" : "bg-amber-100")}>
            <ShieldAlert size={20} className={isHigh ? "text-red-600" : "text-amber-600"} />
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-gray-900">{data.title}</h4>
            <span className={cn("inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[11px] font-medium", isHigh ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700")}>
              {isHigh ? '高风险' : '中风险'}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-[12px] font-medium text-gray-500 mb-2 uppercase tracking-wide">问题描述</h4>
          <p className="text-[13px] text-gray-700 leading-relaxed bg-gray-50 border border-gray-200 rounded-lg p-3">{data.description}</p>
        </div>

        <div>
          <h4 className="text-[12px] font-medium text-gray-500 mb-2 uppercase tracking-wide">影响范围</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-600">受影响字段数</span>
              <span className="font-semibold text-gray-900">{isHigh ? '41' : '37'} 个</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-600">影响下游任务</span>
              <span className="font-semibold text-amber-600">业务对象生成、血缘分析</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-[12px] font-medium text-gray-500 mb-2 uppercase tracking-wide">建议操作</h4>
          <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3">
            <p className="text-[13px] text-gray-700">
              {isHigh
                ? '建议立即处理，优先解决高风险冲突字段后再继续后续阶段的执行。'
                : '建议在质量校验阶段前完成确认，避免影响最终交付物质量。'}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-[12px] font-medium text-gray-500 mb-2 uppercase tracking-wide">操作记录</h4>
          <div className="space-y-2 text-[12px] text-gray-500">
            <div className="flex items-center gap-2"><Clock size={12} /> 09:40 Xino 自动检测到该风险</div>
            <div className="flex items-center gap-2"><Eye size={12} /> 09:42 李桐 查看风险详情</div>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3 flex-shrink-0">
        <button onClick={onIgnore} className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-[13px] font-semibold py-2 rounded-lg transition-colors">忽略</button>
        <button onClick={onProcess} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold py-2 rounded-lg transition-colors">立即处理</button>
      </div>
    </div>
  );
}

// ─── Deliverable Detail Panel ──────────────────────────────────────────

function ReviewDeliverableDetailPanel({ data, onBack }: { data: DeliverableDetailData; onBack: () => void }) {
  const iconConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    PDF: { bg: 'bg-blue-50', text: 'text-blue-600', icon: <FileText size={24} /> },
    XLSX: { bg: 'bg-green-50', text: 'text-green-600', icon: <Table size={24} /> },
    CSV: { bg: 'bg-green-50', text: 'text-green-600', icon: <Table size={24} /> },
  };
  const config = iconConfig[data.type] || iconConfig.XLSX;

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-2 duration-200">
      <div className="px-4 py-4 border-b border-gray-200 flex items-center gap-3 flex-shrink-0">
        <button onClick={onBack} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <h3 className="text-[15px] font-semibold text-gray-900">交付物详情</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <div className="flex items-center gap-4">
          <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0", config.bg, config.text)}>
            {config.icon}
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-gray-900">{data.name}</h4>
            <span className="text-[12px] text-gray-500">{data.type} 文件{data.sizeBytes ? ` · ${(data.sizeBytes / 1024).toFixed(0)} KB` : ''}</span>
          </div>
        </div>

        {data.description && (
          <div>
            <h4 className="text-[12px] font-medium text-gray-500 mb-2 uppercase tracking-wide">用途说明</h4>
            <p className="text-[13px] text-gray-700 leading-relaxed">{data.description}</p>
          </div>
        )}

        <div>
          <h4 className="text-[12px] font-medium text-gray-500 mb-2 uppercase tracking-wide">文件信息</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-600">生成者</span>
              <span className="font-medium text-gray-900">Xino</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-600">关联阶段</span>
              <span className="font-medium text-gray-900">字段语义理解</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3 flex-shrink-0">
        <button className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-[13px] font-semibold py-2 rounded-lg transition-colors">
          <Eye size={14} /> 预览
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold py-2 rounded-lg transition-colors">
          <Download size={14} /> 下载
        </button>
      </div>
    </div>
  );
}
