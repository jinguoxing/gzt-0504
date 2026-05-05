import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import type { DataQaMessage, DataQaResultBlock, DataQaResultAction } from '@/types';
import DataQaResultBlockRenderer from './DataQaResultBlockRenderer';

/**
 * QuestionThread — 问答流容器
 * 合同 08_COMPONENT_SPEC: QuestionThread
 */
export default function QuestionThread({
  messages,
  isXinoTyping,
  onAction,
  onFollowup,
  onClarify,
  onClarifyCancel,
  threadEndRef,
  userName,
}: {
  messages: DataQaMessage[];
  isXinoTyping: boolean;
  onAction: (action: DataQaResultAction, block: DataQaResultBlock) => void;
  onFollowup: (question: string) => void;
  onClarify: (selections: { metric: string; timeRange: string; scope?: string }) => void;
  onClarifyCancel: () => void;
  threadEndRef: React.RefObject<HTMLDivElement | null>;
  userName: string;
}) {
  const renderResultBlocks = (blocks: DataQaResultBlock[]) => (
    <div className="w-full grid grid-cols-2 gap-4 mt-2">
      {blocks.map((block) => {
        const isFullWidth = block.type === 'data_table' || block.type === 'clarification';
        return (
          <div key={block.id} className={isFullWidth ? 'col-span-2' : undefined}>
            <DataQaResultBlockRenderer
              block={block}
              onAction={onAction}
              onFollowup={onFollowup}
              onClarify={onClarify}
              onClarifyCancel={onClarifyCancel}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto w-full flex justify-center py-10 px-8 pb-32">
      <div className="w-full max-w-[840px] space-y-10">
        {messages.map((msg) => {
          if (msg.role === 'user') {
            return <UserQuestionRow key={msg.id} msg={msg} userName={userName} />;
          }
          return (
            <XinoAnswerBlock key={msg.id} msg={msg} renderBlocks={renderResultBlocks} />
          );
        })}

        {/* Xino typing indicator */}
        {isXinoTyping && (
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-2 text-[12px] text-gray-400">
              <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white">
                <Sparkles size={11} />
              </div>
              <span className="font-semibold text-gray-900">Xino</span>
            </div>
            <div className="flex items-center gap-2 text-[14px] text-gray-500 px-1">
              <Loader2 size={14} className="animate-spin text-blue-600" />
              分析中...
            </div>
          </div>
        )}

        <div ref={threadEndRef} />
      </div>
    </div>
  );
}

/**
 * UserQuestionRow — 用户右侧轻量提问条
 * 合同 08_COMPONENT_SPEC: UserQuestionRow
 */
function UserQuestionRow({ msg, userName }: { key?: string; msg: DataQaMessage; userName: string }) {
  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2 text-[12px] text-gray-400">
        <span className="font-semibold text-gray-900">{userName}</span>
        <span>{msg.displayTime}</span>
      </div>
      <div className="text-[14px] text-gray-900 max-w-xl leading-relaxed">
        {msg.text}
      </div>
    </div>
  );
}

/**
 * XinoAnswerBlock — Xino 左侧文本说明 + 结果模板组
 * 合同 08_COMPONENT_SPEC: XinoAnswerBlock
 */
function XinoAnswerBlock({
  msg,
  renderBlocks,
}: {
  key?: string;
  msg: DataQaMessage;
  renderBlocks: (blocks: DataQaResultBlock[]) => React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-center gap-2 text-[12px] text-gray-400">
        <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white">
          <Sparkles size={11} />
        </div>
        <span className="font-semibold text-gray-900">Xino</span>
        <span>{msg.displayTime}</span>
      </div>
      <div className="text-[14px] text-gray-800 leading-relaxed max-w-2xl px-1">
        {msg.text}
      </div>
      {msg.resultBlocks && msg.resultBlocks.length > 0 && renderBlocks(msg.resultBlocks)}
    </div>
  );
}
