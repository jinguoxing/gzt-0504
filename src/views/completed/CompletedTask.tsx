import React, { useState } from 'react';
import {
  ChevronRight, CheckCircle2, FileText, Download, Share2, RotateCw,
  Archive, ExternalLink, Package, Eye, Clock
} from 'lucide-react';
import { cn } from '@/utils/cn';

const STAGE_TIMELINE = [
  { name: '选择与采集', summary: '完成数据源选择与连接', time: '05-16 09:10' },
  { name: 'Schema 扫描', summary: '扫描 128 张表，4,920 个字段', time: '05-16 09:20' },
  { name: '业务表识别', summary: '识别供应链业务相关表', time: '05-16 09:32' },
  { name: '字段候选生成', summary: '生成字段语义候选', time: '05-16 09:40' },
  { name: '字段语义理解', summary: '准确率 92%', time: '05-16 09:45' },
  { name: '业务对象生成', summary: '对象 12 个', time: '05-16 09:45' },
  { name: '关系发现与校验', summary: '确认关系 21 条', time: '05-16 10:15' },
  { name: '标准映射与对齐', summary: '匹配率 88%', time: '05-16 10:40' },
];

const DELIVERABLES = [
  { name: '语义治理报告.pdf', desc: '总体治理结果、关键发现、指标统计与结论', time: '2025-05-16 14:30', type: 'PDF', size: '1.26 MB' },
  { name: '字段语义理解结果.xlsx', desc: '字段级语义理解结果、置信度与建议分类', time: '2025-05-16 14:12', type: 'XLSX', size: '240 KB' },
  { name: '业务对象清单.xlsx', desc: '业务对象定义、属性清单与标准映射', time: '2025-05-16 13:58', type: 'XLSX', size: '125 KB' },
  { name: '语义关系网络.zip', desc: '对象关系网络图与可视化文件', time: '2025-05-16 13:45', type: 'ZIP', size: '61 MB' },
  { name: '待确认任务清单.xlsx', desc: '后续需业务方确认的条目与说明', time: '2025-05-16 13:40', type: 'XLSX', size: '59 KB' },
  { name: '实施建议报告.pdf', desc: '治理改进建议、优先级与实施路线图', time: '2025-05-16 14:30', type: 'PDF', size: '1.36 MB' },
];

const RESULT_SUMMARY = [
  '识别并统一了 12 个核心业务对象，覆盖采购、库存、订单等关键域。',
  '发现 21 条关键对象关系，完善了业务关系网络。',
  '标准映射覆盖率达 88%，提升数据一致性与可用性。',
  '修复 15 条高影响冲突，数据质量得到显著提升。',
];

const NEXT_STEPS = [
  '重点跟进待确认的 3 个高置信冲突项。',
  '补充并完善 2 项标准映射说明。',
  '基于实施建议，制定治理改进计划。',
  '持续监控关键指标，保障治理成效落地。',
];

const SIDEBAR_TABS = ['任务总结', '交付物预览', '活动记录'];

export default function CompletedTask() {
  const [activeTab, setActiveTab] = useState('任务总结');

  return (
    <div className="flex h-full bg-[#F8FAFC]">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto border-r border-gray-200">
        {/* Header */}
        <div className="px-8 py-5 bg-white border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2 text-[13px] text-gray-400 mb-2">
            <span>任务</span><ChevronRight size={14} />
            <span className="text-gray-600">供应链语义治理闭环任务</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[20px] font-bold text-gray-900">供应链语义治理闭环任务</h1>
                <span className="bg-green-50 text-green-700 text-[12px] font-medium px-2.5 py-1 rounded-full">已完成</span>
              </div>
              <p className="text-[13px] text-gray-500 mt-1">
                项目：供应链语义治理项目 · 创建人：李桐 · 阶段：8/8 · 进度：100% · 完成时间：2025-05-16 14:32
              </p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 space-y-8">
          {/* Completion Summary Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle2 size={22} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-gray-900">任务已完成</h2>
                <p className="text-[13px] text-gray-500">感谢团队协作，供应链语义治理闭环任务已顺利完成！</p>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-4 mt-6">
              {[
                { label: '已扫描字段', value: '4,920', color: 'text-green-700' },
                { label: '已生成业务对象', value: '12', color: 'text-green-700' },
                { label: '已确认对象关系', value: '21', color: 'text-green-700' },
                { label: '已产出交付物', value: '6', color: 'text-green-700' },
                { label: '待跟进事项', value: '2', color: 'text-orange-600' },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl px-4 py-4 text-center">
                  <div className={cn('text-[24px] font-bold', item.color)}>{item.value}</div>
                  <div className="text-[12px] text-gray-500 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <Eye size={14} />查看报告
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 size={14} />共享结果
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <RotateCw size={14} />发起下一轮任务
              </button>
            </div>
          </div>

          {/* Stage Timeline */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-[16px] font-semibold text-gray-900 mb-5">阶段完成总结</h3>
            <div className="grid grid-cols-4 gap-4">
              {STAGE_TIMELINE.map((stage, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-green-50/50 rounded-xl p-4">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 size={14} className="text-white" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-gray-900">{stage.name}</div>
                    <div className="text-[12px] text-gray-500 mt-0.5">{stage.summary}</div>
                    <div className="text-[11px] text-gray-400 mt-1">{stage.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables Table */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-[16px] font-semibold text-gray-900 mb-5">交付物</h3>
            <table className="w-full">
              <thead>
                <tr className="text-[12px] text-gray-400 font-medium border-b border-gray-100">
                  <th className="pb-3 text-left">名称</th>
                  <th className="pb-3 text-left">用途说明</th>
                  <th className="pb-3 text-left">大小</th>
                  <th className="pb-3 text-left">最后更新</th>
                  <th className="pb-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {DELIVERABLES.map((file, idx) => (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-gray-400" />
                        <span className="text-[13px] font-medium text-gray-900">{file.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-[13px] text-gray-500">{file.desc}</td>
                    <td className="py-3 text-[13px] text-gray-400">{file.size}</td>
                    <td className="py-3 text-[13px] text-gray-400">{file.time}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-[12px] text-blue-600 hover:bg-blue-50 px-2 py-1 rounded">预览</button>
                        <button className="text-[12px] text-gray-500 hover:bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                          <Download size={12} />下载
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Result Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-[16px] font-semibold text-gray-900 mb-4">结果摘要</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-[14px] font-medium text-gray-700 mb-3">关键业务发现</h4>
                <div className="space-y-2">
                  {RESULT_SUMMARY.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[13px] text-gray-600">
                      <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[14px] font-medium text-gray-700 mb-3">下一步建议</h4>
                <div className="space-y-2">
                  {NEXT_STEPS.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[13px] text-gray-600">
                      <ChevronRight size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[360px] bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 flex-shrink-0">
          {SIDEBAR_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 py-3 text-[13px] font-medium transition-colors border-b-2',
                activeTab === tab
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-400 border-transparent hover:text-gray-600'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === '任务总结' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-[13px] font-semibold text-gray-700 mb-3">整体概览</h4>
                <div className="space-y-2">
                  {[
                    { label: '整体进度', value: '100%' },
                    { label: '任务已完成', value: '8 / 8 阶段' },
                    { label: '创建时间', value: '2025-05-15 09:00' },
                    { label: '完成时间', value: '2025-05-16 14:32' },
                    { label: '耗时', value: '1 天 5 小时 32 分钟' },
                    { label: '参与成员', value: '5 人' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between text-[12px]">
                      <span className="text-gray-400">{item.label}</span>
                      <span className="text-gray-700 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-[13px] font-semibold text-gray-700 mb-3">关键指标</h4>
                <div className="space-y-2">
                  {[
                    { label: '扫描字段总数', value: '4,920' },
                    { label: '生成业务对象', value: '12' },
                    { label: '确认对象关系', value: '21 / 26' },
                    { label: '标准映射覆盖率', value: '88%' },
                    { label: '冲突修复率', value: '88%' },
                    { label: '业务确认通过率', value: '95%' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between text-[12px]">
                      <span className="text-gray-400">{item.label}</span>
                      <span className="text-gray-700 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-[13px] font-semibold text-gray-700 mb-3">快速操作</h4>
                <div className="space-y-2">
                  {[
                    { icon: RotateCw, label: '再次运行相同任务' },
                    { icon: Download, label: '导出任务配置' },
                    { icon: Archive, label: '归档任务' },
                  ].map(item => (
                    <button key={item.label} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <item.icon size={14} className="text-gray-400" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === '交付物预览' && (
            <div className="space-y-3">
              {DELIVERABLES.map((file, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText size={16} className="text-gray-400" />
                    <span className="text-[13px] font-medium text-gray-900">{file.name}</span>
                  </div>
                  <p className="text-[12px] text-gray-500 mb-2">{file.desc}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400">{file.size}</span>
                    <span className="text-[11px] text-gray-400">·</span>
                    <span className="text-[11px] text-gray-400">{file.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === '活动记录' && (
            <div className="space-y-4">
              {[
                { time: '14:32', user: 'Xino', action: '完成任务，生成所有交付物' },
                { time: '13:30', user: '李桐', action: '确认业务验证通过' },
                { time: '11:20', user: 'Xino', action: '完成冲突检测与修复，修复 15 条' },
                { time: '10:40', user: 'Xino', action: '完成标准映射，匹配率 88%' },
                { time: '10:15', user: 'Xino', action: '发现 21 条对象关系' },
                { time: '09:45', user: 'Xino', action: '生成 12 个业务对象' },
                { time: '09:10', user: 'Xino', action: '开始执行任务' },
                { time: '09:00', user: '李桐', action: '创建任务并开始执行' },
              ].map((log, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5" />
                    {idx < 7 && <div className="w-px h-full bg-gray-200 min-h-[20px]" />}
                  </div>
                  <div>
                    <div className="text-[12px] text-gray-400">{log.time}</div>
                    <div className="text-[13px] text-gray-700">
                      <span className="font-medium">{log.user}</span> {log.action}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
