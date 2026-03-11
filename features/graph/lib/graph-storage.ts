import type {
  GraphNodeData,
  GraphEdgeData,
  StoredGraphState,
} from "../types/graph-types";

const STORAGE_KEY = "knowledge-graph-state";

export function saveGraphState(state: StoredGraphState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadGraphState(): StoredGraphState | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredGraphState;
  } catch {
    return null;
  }
}

export function clearGraphState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function toStoredState(
  nodes: GraphNodeData[],
  edges: GraphEdgeData[],
  positions: Record<string, { x: number; y: number }>
): StoredGraphState {
  return { nodeData: nodes, edgeData: edges, positions };
}
