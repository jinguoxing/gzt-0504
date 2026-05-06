import React from 'react';
import type { ResultBlock, GraphStats, GraphNode, GraphEdge } from '@/types';
import { cn } from '@/utils/cn';
import { Share2, Box, ArrowRight } from 'lucide-react';

/**
 * GraphResult — 关系图谱模板
 * 展示业务对象/血缘关系的图谱预览
 */
export default function GraphResult({ block }: { block: ResultBlock }) {
  const stats = block.data.stats as GraphStats | undefined;
  const nodes = (block.data.nodes as GraphNode[]) || [];
  const edges = (block.data.edges as GraphEdge[]) || [];

  // Build a simple adjacency display
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // Group edges by source for display
  const edgesBySource = new Map<string, GraphEdge[]>();
  edges.forEach(edge => {
    const list = edgesBySource.get(edge.source) || [];
    list.push(edge);
    edgesBySource.set(edge.source, list);
  });

  const typeColors: Record<string, { bg: string; border: string; text: string }> = {
    business_object: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
    field: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    table: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    metric: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  };

  const defaultTypeStyle = { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' };

  return (
    <div className="space-y-3">
      {block.summary && <p className="text-[13px] text-gray-600">{block.summary}</p>}

      {/* Stats bar */}
      {stats && (
        <div className="flex items-center gap-4 text-[12px]">
          <span className="flex items-center gap-1.5 text-gray-600">
            <Box size={13} className="text-blue-500" />
            {stats.nodeCount} 个节点
          </span>
          <span className="flex items-center gap-1.5 text-gray-600">
            <Share2 size={13} className="text-green-500" />
            {stats.edgeCount} 条关系
          </span>
        </div>
      )}

      {/* Node & Edge list (compact representation) */}
      {nodes.length > 0 && (
        <div className="space-y-1.5 max-h-[280px] overflow-y-auto custom-scrollbar">
          {nodes.map(node => {
            const style = typeColors[node.type] || defaultTypeStyle;
            const outEdges = edgesBySource.get(node.id) || [];
            return (
              <div key={node.id}>
                <div className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[12px] font-medium",
                  style.bg, style.border, style.text
                )}>
                  <Box size={11} />
                  {node.label}
                </div>
                {outEdges.length > 0 && (
                  <div className="ml-6 mt-1 space-y-1">
                    {outEdges.map((edge, i) => {
                      const targetNode = nodeMap.get(edge.target);
                      const targetStyle = targetNode ? (typeColors[targetNode.type] || defaultTypeStyle) : defaultTypeStyle;
                      return (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                          <ArrowRight size={10} className="text-gray-300 flex-shrink-0" />
                          {edge.label && <span className="text-gray-400">{edge.label}</span>}
                          {targetNode && (
                            <span className={cn("px-1.5 py-0.5 rounded border", targetStyle.bg, targetStyle.border, targetStyle.text)}>
                              {targetNode.label}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Placeholder when no nodes */}
      {nodes.length === 0 && stats?.placeholder && (
        <div className="text-center py-6 text-[13px] text-gray-400">
          {stats.placeholder}
        </div>
      )}
    </div>
  );
}
