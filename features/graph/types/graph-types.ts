export type GraphNodeData = {
  id: string;
  title: string;
  note?: string;
  color?: string;
};

export type GraphEdgeData = {
  id: string;
  source: string;
  target: string;
  label: string;
};

export type GraphNode = {
  id: string;
  position: { x: number; y: number };
  data: { title: string; note?: string; color?: string };
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
};

export type GraphState = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type StoredGraphState = {
  nodeData: GraphNodeData[];
  edgeData: GraphEdgeData[];
  positions: Record<string, { x: number; y: number }>;
};
