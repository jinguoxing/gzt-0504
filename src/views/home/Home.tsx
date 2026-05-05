import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Paperclip, AtSign, Mic, History, Send, ChevronRight, Database, BarChart3 } from 'lucide-react';

const SCENARIOS = [
  {
    key: 'semantic-governance',
    title: '语义治理',
    description: '扫描数据库 Schema，识别业务表，理解字段语义，生成业务对象与交付物。',
    path: '/draft',
    icon: Database,
    buttonText: '开始治理',
    color: 'blue',
  },
  {
    key: 'data-query',
    title: '找数问数',
    description: '用自然语言查询业务数据，获取指标结果、趋势分析与数据依据。',
    path: '/data-query',
    icon: BarChart3,
    buttonText: '开始提问',
    color: 'emerald',
  },
];

export default function Home() {
  const navigate = useNavigate();

  const handleSend = () => {
    navigate('/draft');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full px-6 bg-[#F8FAFC]">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h2 className="text-[32px] font-bold text-gray-900 mb-3 tracking-tight">
            今天想让 Xino 帮你完成什么？
          </h2>
          <p className="text-[16px] text-gray-500 font-medium">
            把目标告诉我，Xino 会理解你的需求，并规划可执行的任务路径。
          </p>
        </div>

        {/* Big Input Area */}
        <div className="w-full max-w-3xl relative mb-6">
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 p-4 transition-shadow focus-within:shadow-[0_8px_30px_rgb(37,99,235,0.08)] focus-within:border-blue-300">
            <textarea
              className="w-full min-h-[120px] resize-none outline-none text-[16px] leading-relaxed placeholder:text-gray-400 bg-transparent text-gray-900"
              placeholder="输入任务目标，或 @ 数据源 / 文件 / 对象 / 知识库"
              defaultValue="请对供应链数据库进行语义治理，扫描 Schema、识别业务相关表、理解字段语义、生成业务对象与交付物。"
            ></textarea>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1.5 text-gray-400">
                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors">
                  <Paperclip size={18} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors">
                  <AtSign size={18} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors">
                  <Mic size={18} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors">
                  <History size={18} />
                </button>
              </div>
              <button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-[14px] transition-colors shadow-sm"
              >
                发送给 Xino
                <Send size={16} />
              </button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-[13px] text-gray-400">
              可通过 @ 引用数据源、文件、对象或知识库，Xino 会自动整理为任务草稿。
            </p>
          </div>
        </div>

        {/* Scenario Cards */}
        <div className="w-full max-w-3xl mt-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-[13px] text-gray-400 font-medium">或者选择一个场景</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {SCENARIOS.map((scenario) => {
              const Icon = scenario.icon;
              const colorClasses = scenario.color === 'blue'
                ? {
                    iconBg: 'bg-blue-50',
                    iconText: 'text-blue-600',
                    buttonBg: 'bg-blue-600 hover:bg-blue-700',
                    borderHover: 'hover:border-blue-200',
                    shadowHover: 'hover:shadow-blue-100',
                  }
                : {
                    iconBg: 'bg-emerald-50',
                    iconText: 'text-emerald-600',
                    buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
                    borderHover: 'hover:border-emerald-200',
                    shadowHover: 'hover:shadow-emerald-100',
                  };

              return (
                <button
                  key={scenario.key}
                  onClick={() => navigate(scenario.path)}
                  className={`bg-white border border-gray-200 ${colorClasses.borderHover} rounded-2xl p-6 text-left transition-all shadow-sm hover:shadow-lg ${colorClasses.shadowHover} group`}
                >
                  <div className={`w-10 h-10 ${colorClasses.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon size={20} className={colorClasses.iconText} />
                  </div>
                  <h3 className="text-[16px] font-semibold text-gray-900 mb-2">{scenario.title}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed mb-4">{scenario.description}</p>
                  <span className={`inline-flex items-center gap-1.5 ${colorClasses.buttonBg} text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors`}>
                    {scenario.buttonText}
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Collapsed Sections */}
        <div className="w-full max-w-3xl mt-10 flex items-center justify-center gap-8">
          {[
            { label: '常用任务', count: 4 },
            { label: '最近继续', count: 3 },
            { label: '常用资源', count: 5 }
          ].map((item) => (
            <button key={item.label} className="flex items-center gap-2 text-[14px] text-gray-500 hover:text-gray-900 transition-colors group">
              <span className="font-medium">{item.label} <span className="text-gray-400 font-normal">{item.count} 个</span></span>
              <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-6 text-center w-full">
        <p className="text-[12px] text-gray-400">
          Xino 会根据你的目标，自动识别任务类型、推荐数据源、规划执行步骤。
        </p>
      </div>
    </div>
  );
}
