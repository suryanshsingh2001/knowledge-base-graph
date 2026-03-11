"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  MiniMap,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import GraphNodeComponent from "./graph-node";
import { GraphControls } from "./graph-controls";
import type { GraphNode, GraphEdge } from "../types/graph-types";
import type {
  NodeChange,
  EdgeChange,
  Connection,
} from "@xyflow/react";

type GraphCanvasProps = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  onNodesChange: (changes: NodeChange<GraphNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<GraphEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeClick: (id: string) => void;
  onPaneClick: () => void;
  onAddNode: () => void;
  onAddEdge: () => void;
  onResetLayout: () => void;
};

export function GraphCanvas({
  nodes,
  edges,
  selectedNodeId,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  onAddNode,
  onAddEdge,
  onResetLayout,
}: GraphCanvasProps) {
  const nodeTypes = useMemo(() => ({ custom: GraphNodeComponent }), []);

  const handleNodeClick: NodeMouseHandler<GraphNode> = useCallback(
    (_event, node) => {
      onNodeClick(node.id);
    },
    [onNodeClick]
  );

  // Style nodes based on selection - dim unrelated, highlight connected
  const styledNodes = useMemo(() => {
    if (!selectedNodeId) return nodes;

    const connectedIds = new Set<string>([selectedNodeId]);
    edges.forEach((e) => {
      if (e.source === selectedNodeId) connectedIds.add(e.target);
      if (e.target === selectedNodeId) connectedIds.add(e.source);
    });

    return nodes.map((node) => {
      const isSelected = node.id === selectedNodeId;
      const isConnected = connectedIds.has(node.id);
      return {
        ...node,
        style: isConnected
          ? { opacity: 1, transition: "opacity 0.2s, filter 0.2s" }
          : { opacity: 0.2, filter: "grayscale(0.5)", transition: "opacity 0.2s, filter 0.2s" },
        className: isSelected ? "ring-2 ring-primary rounded-xl" : isConnected ? "ring-1 ring-primary/50 rounded-xl" : "",
      };
    });
  }, [nodes, edges, selectedNodeId]);

  const styledEdges = useMemo(() => {
    if (!selectedNodeId) return edges;

    return edges.map((edge) => {
      const isConnected =
        edge.source === selectedNodeId || edge.target === selectedNodeId;
      return {
        ...edge,
        style: {
          ...edge.style,
          stroke: isConnected ? "var(--primary)" : "var(--foreground)",
          strokeWidth: isConnected ? 2.5 : 1.5,
          opacity: isConnected ? 1 : 0.12,
          transition: "opacity 0.2s, stroke-width 0.2s",
        },
      };
    });
  }, [edges, selectedNodeId]);

  const defaultEdgeOptions = useMemo(
    () => ({
      type: "smoothstep",
      style: { stroke: "var(--foreground)", strokeWidth: 2 },
      animated: true,
    }),
    []
  );

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={styledNodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        className="bg-background"
      >
        <Background color="hsl(var(--border))" gap={20} size={1} />
        <MiniMap
          className="bg-card! border-border! rounded-lg! shadow-sm!"
          nodeColor="hsl(var(--primary))"
          maskColor="hsl(var(--muted) / 0.7)"
          pannable
          zoomable
        />
      </ReactFlow>
      <GraphControls
        onAddNode={onAddNode}
        onAddEdge={onAddEdge}
        onResetLayout={onResetLayout}
      />
    </div>
  );
}
