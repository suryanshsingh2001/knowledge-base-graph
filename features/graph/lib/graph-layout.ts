import Dagre from "@dagrejs/dagre";
import type { GraphNode, GraphEdge } from "../types/graph-types";

export function getLayoutedElements(
  nodes: GraphNode[],
  edges: GraphEdge[],
  positions?: Record<string, { x: number; y: number }>
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  // If positions are provided for all nodes, use them
  if (positions && nodes.every((n) => positions[n.id])) {
    return {
      nodes: nodes.map((node) => ({
        ...node,
        position: positions[node.id],
      })),
      edges,
    };
  }

  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 120, ranksep: 140 });

  nodes.forEach((node) => {
    g.setNode(node.id, { width: 200, height: 100 });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  Dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const pos = g.node(node.id);
    // Use stored position if available, otherwise use dagre layout
    const position = positions?.[node.id] ?? {
      x: pos.x - 100,
      y: pos.y - 50,
    };
    return { ...node, position };
  });

  return { nodes: layoutedNodes, edges };
}
