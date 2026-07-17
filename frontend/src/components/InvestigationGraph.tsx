import React, { useMemo, useState } from 'react';
import type { GraphNode, GraphEdge } from '../types';

interface InvestigationGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId?: string | null;
  onNodeClick?: (node: GraphNode | null) => void;
  className?: string;
}

const NODE_WIDTH = 150;
const NODE_HEIGHT = 46;
const LAYER_GAP = 200;
const NODE_GAP = 64;

const TYPE_COLORS: Record<string, string> = {
  host: '#8B5CF6',
  process: '#3B82F6',
  alert: '#EF4444',
  mitre: '#F59E0B',
};

const TYPE_BG: Record<string, string> = {
  host: 'rgba(139,92,246,0.12)',
  process: 'rgba(59,130,246,0.12)',
  alert: 'rgba(239,68,68,0.12)',
  mitre: 'rgba(245,158,11,0.12)',
};

const TYPE_LABELS: Record<string, string> = {
  host: 'HOST',
  process: 'PROCESS',
  alert: 'ALERT',
  mitre: 'MITRE',
};

export const InvestigationGraph: React.FC<InvestigationGraphProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onNodeClick,
  className = '',
}) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const layout = useMemo(() => {
    const byType: Record<string, GraphNode[]> = { host: [], process: [], alert: [], mitre: [] };
    for (const n of nodes) {
      if (byType[n.type]) byType[n.type].push(n);
    }

    const typeOrder = ['host', 'process', 'alert', 'mitre'];
    const positions: Record<string, { x: number; y: number }> = {};
    let globalMaxY = 0;

    typeOrder.forEach((type, layerIdx) => {
      const group = byType[type] || [];
      const totalHeight = group.length * NODE_HEIGHT + (group.length - 1) * NODE_GAP;
      const startY = -totalHeight / 2 + NODE_HEIGHT / 2;
      const x = layerIdx * LAYER_GAP + 40;

      group.forEach((node, i) => {
        positions[node.id] = { x, y: startY + i * (NODE_HEIGHT + NODE_GAP) };
      });

      const maxY = group.length > 0
        ? startY + (group.length - 1) * (NODE_HEIGHT + NODE_GAP) + NODE_HEIGHT / 2
        : 0;
      if (maxY > globalMaxY) globalMaxY = maxY;
    });

    const padding = 60;
    const minX = 10;
    const maxX = typeOrder.length * LAYER_GAP + 80;
    const minY = -globalMaxY - padding;
    const maxY = globalMaxY + padding;

    return {
      positions,
      width: Math.max(maxX - minX + 60, 600),
      height: Math.max((maxY - minY) + 60, 300),
      offsetX: -minX + 30,
      offsetY: -minY + 30,
    };
  }, [nodes]);

  const edgePaths = useMemo(() => {
    return edges.map((edge) => {
      const src = layout.positions[edge.source];
      const tgt = layout.positions[edge.target];
      if (!src || !tgt) return null;

      const x1 = src.x + NODE_WIDTH / 2 + layout.offsetX;
      const y1 = src.y + layout.offsetY;
      const x2 = tgt.x - NODE_WIDTH / 2 + layout.offsetX;
      const y2 = tgt.y + layout.offsetY;
      const cx = (x1 + x2) / 2;

      // Compute angle for arrowhead
      const dx = x2 - cx;
      const dy = y2 - (y1 + y2) / 2;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      return {
        key: `${edge.source}->${edge.target}`,
        path: `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`,
        label: edge.label,
        type: edge.type,
        arrowX: x2 - 8,
        arrowY: y2 - 2,
        angle: angle,
      };
    }).filter(Boolean) as { key: string; path: string; label: string; type: string; arrowX: number; arrowY: number; angle: number }[];
  }, [edges, layout]);

  const renderedNodes = useMemo(() => {
    return nodes.map((node) => {
      const pos = layout.positions[node.id];
      if (!pos) return null;
      const x = pos.x - NODE_WIDTH / 2 + layout.offsetX;
      const y = pos.y - NODE_HEIGHT / 2 + layout.offsetY;
      const color = TYPE_COLORS[node.type] || '#6B7280';
      const bg = TYPE_BG[node.type] || 'rgba(107,114,128,0.1)';

      const isSelected = selectedNodeId === node.id;
      const isHovered = hoveredNodeId === node.id;
      const strokeWidth = isSelected ? 2.5 : isHovered ? 2 : 1.5;
      const strokeOpacity = isSelected ? 1 : isHovered ? 0.9 : 0.6;

      return (
        <g
          key={node.id}
          className="cursor-pointer"
          onClick={() => onNodeClick?.(node)}
          onMouseEnter={() => setHoveredNodeId(node.id)}
          onMouseLeave={() => setHoveredNodeId(null)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNodeClick?.(node); }}
          style={{ outline: 'none' }}
        >
          {/* Selection glow */}
          {isSelected && (
            <rect
              x={x - 4}
              y={y - 4}
              width={NODE_WIDTH + 8}
              height={NODE_HEIGHT + 8}
              rx={14}
              ry={14}
              fill="none"
              stroke={color}
              strokeWidth={1}
              strokeOpacity={0.4}
              className="animate-pulse-soft"
            />
          )}
          {/* Node background */}
          <rect
            x={x}
            y={y}
            width={NODE_WIDTH}
            height={NODE_HEIGHT}
            rx={10}
            ry={10}
            fill={isSelected ? bg.replace('0.12', '0.25') : bg}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeOpacity={strokeOpacity}
            className="transition-all duration-200"
            style={isSelected ? { filter: `drop-shadow(0 0 8px ${color}40)` } : undefined}
          />
          {/* Severity indicator dot for alerts */}
          {node.type === 'alert' && (
            <circle
              cx={x + 10}
              cy={y + NODE_HEIGHT / 2}
              r={4}
              fill={color}
              className="animate-pulse-soft"
            />
          )}
          {/* Label */}
          <text
            x={x + NODE_WIDTH / 2}
            y={y + NODE_HEIGHT / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={isSelected ? '#FFFFFF' : '#E2E8F0'}
            fontSize={10}
            fontFamily="'JetBrains Mono', monospace"
            className="pointer-events-none select-none transition-colors duration-200"
          >
            {node.label.length > 20 ? node.label.slice(0, 19) + '…' : node.label}
          </text>
          {/* Type badge */}
          <text
            x={x + NODE_WIDTH / 2}
            y={y + NODE_HEIGHT + 14}
            textAnchor="middle"
            fill={color}
            fontSize={8}
            fontFamily="'JetBrains Mono', monospace"
            opacity={isHovered ? 1 : 0.7}
            className="pointer-events-none select-none transition-opacity duration-200"
          >
            {TYPE_LABELS[node.type] || node.type.toUpperCase()}
          </text>
        </g>
      );
    });
  }, [nodes, layout, selectedNodeId, hoveredNodeId, onNodeClick]);

  return (
    <div className={`bg-soc-card overflow-auto ${className}`}>
      {/* Legend */}
      <div className="flex items-center space-x-1.5 px-5 pt-4 pb-3 border-b border-soc-border/20">
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center space-x-1 text-[9px] text-soc-muted font-mono mr-4">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="capitalize">{type}</span>
          </div>
        ))}
        <div className="flex-1" />
        {nodes.length > 0 && (
          <span className="text-[8px] text-soc-muted/50 font-mono">{nodes.length} nodes · {edges.length} edges</span>
        )}
      </div>

      {nodes.length === 0 ? (
        <div className="flex items-center justify-center h-[250px]">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-soc-bg/60 border border-soc-border/30 flex items-center justify-center">
              <span className="text-lg text-soc-muted/40">○</span>
            </div>
            <p className="text-xs text-soc-muted font-medium">No investigation graph data available.</p>
            <p className="text-[10px] text-soc-muted/50 mt-1">Select an incident with correlated alerts to visualize.</p>
          </div>
        </div>
      ) : (
        <svg
          width={layout.width}
          height={layout.height}
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          className="w-full"
          style={{ minHeight: 250 }}
        >
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#1E2A45" />
            </marker>
            <marker id="arrowheadDash" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#1E2A45" fillOpacity={0.5} />
            </marker>
          </defs>

          {/* Edge paths */}
          {edgePaths.map((ep) => (
            <g key={ep.key}>
              <path
                d={ep.path}
                fill="none"
                stroke="#1E2A45"
                strokeWidth={1.5}
                strokeDasharray={ep.type === 'mapping' ? '4,3' : 'none'}
                markerEnd={ep.type === 'mapping' ? 'url(#arrowheadDash)' : 'url(#arrowhead)'}
                className="transition-all duration-200 hover:stroke-soc-accent hover:stroke-width-2"
              />
            </g>
          ))}

          {/* Nodes */}
          {renderedNodes}
        </svg>
      )}
    </div>
  );
};

export default InvestigationGraph;
