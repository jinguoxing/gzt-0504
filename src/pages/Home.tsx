import React from 'react';
import { Paperclip, AtSign, Mic, History, Send, ChevronRight } from 'lucide-react';

export default function Home({ onSend }: { onSend: () => void }) {
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
                onClick={onSend}
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

        {/* Collapsed Sections */}
        <div className="w-full max-w-3xl mt-12 flex items-center justify-center gap-8">
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
