"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type NodeMouseHandler,
  ConnectionLineType,
  MarkerType,
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

  // Style nodes based on selection - highlight connected, dim unrelated
  const styledNodes = useMemo(() => {
    if (!selectedNodeId) return nodes;

    const connectedIds = new Set<string>([selectedNodeId]);
    edges.forEach((e) => {
      if (e.source === selectedNodeId) connectedIds.add(e.target);
      if (e.target === selectedNodeId) connectedIds.add(e.source);
    });

    return nodes.map((node) => ({
      ...node,
      style: connectedIds.has(node.id)
        ? { opacity: 1, transition: "opacity 0.3s ease, filter 0.3s ease" }
        : { opacity: 0.2, filter: "grayscale(80%)", transition: "opacity 0.3s ease, filter 0.3s ease" },
    }));
  }, [nodes, edges, selectedNodeId]);

  const styledEdges = useMemo(() => {
    const baseMarker = {
      type: MarkerType.ArrowClosed,
      width: 16,
      height: 16,
      color: "#999",
    };

    if (!selectedNodeId) {
      return edges.map((edge) => ({
        ...edge,
        markerEnd: baseMarker,
        style: { ...edge.style, stroke: "#999", strokeWidth: 1.5 },
      }));
    }

    return edges.map((edge) => {
      const isConnected =
        edge.source === selectedNodeId || edge.target === selectedNodeId;
      return {
        ...edge,
        markerEnd: {
          ...baseMarker,
          color: isConnected ? "#555" : "#ccc",
        },
        style: {
          ...edge.style,
          stroke: isConnected ? "#555" : "#ddd",
          strokeWidth: isConnected ? 2.5 : 1,
          opacity: isConnected ? 1 : 0.2,
          transition: "opacity 0.3s ease, stroke 0.3s ease",
        },
        animated: isConnected,
      };
    });
  }, [edges, selectedNodeId]);

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
        connectionLineType={ConnectionLineType.SmoothStep}
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
          style: { stroke: "#999", strokeWidth: 1.5 },
        }}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        className="bg-background"
      >
        <Background color="hsl(var(--border))" gap={24} size={1} />
        <Controls
          showInteractive={false}
          className="bg-card! border-border! rounded-lg! shadow-sm!"
        />
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
