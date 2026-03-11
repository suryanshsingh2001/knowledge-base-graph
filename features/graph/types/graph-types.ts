import type { Node, Edge } from "@xyflow/react";

export type GraphNodeData = {
  id: string;
  title: string;
  note?: string;
};

export type GraphEdgeData = {
  id: string;
  source: string;
  target: string;
  label: string;
};

export type GraphNode = Node<{ title: string; note?: string }, "custom">;
export type GraphEdge = Edge<{ label: string }>;

export type GraphState = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type StoredGraphState = {
  nodeData: GraphNodeData[];
  edgeData: GraphEdgeData[];
  positions: Record<string, { x: number; y: number }>;
};
