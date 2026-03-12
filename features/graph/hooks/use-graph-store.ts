"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type {
  GraphNode,
  GraphEdge,
  GraphNodeData,
  GraphEdgeData,
} from "../types/graph-types";
import { seedNodes, seedEdges } from "../data/seed-data";
import { loadGraphState, saveGraphState } from "../lib/graph-storage";

function toGraphNodes(
  data: GraphNodeData[],
  positions?: Record<string, { x: number; y: number }>
): GraphNode[] {
  return data.map((n, i) => ({
    id: n.id,
    position: positions?.[n.id] ?? {
      x: 100 + (i % 4) * 200,
      y: 100 + Math.floor(i / 4) * 200,
    },
    data: { title: n.title, note: n.note, color: n.color },
  }));
}

function toGraphEdges(data: GraphEdgeData[]): GraphEdge[] {
  return data.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
  }));
}

export function useGraphStore() {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const needsInitialLayoutRef = useRef(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist to localStorage (debounced)
  const persist = useCallback(
    (currentNodes: GraphNode[], currentEdges: GraphEdge[]) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        const nodeData: GraphNodeData[] = currentNodes.map((n) => ({
          id: n.id,
          title: n.data.title,
          note: n.data.note,
        }));
        const edgeData: GraphEdgeData[] = currentEdges.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label,
        }));
        const positions: Record<string, { x: number; y: number }> = {};
        currentNodes.forEach((n) => {
          positions[n.id] = n.position;
        });
        saveGraphState({ nodeData, edgeData, positions });
      }, 300);
    },
    []
  );

  // Initialize from localStorage or seed data
  useEffect(() => {
    const stored = loadGraphState();
    let graphNodes: GraphNode[];
    let graphEdges: GraphEdge[];

    if (stored) {
      graphNodes = toGraphNodes(stored.nodeData, stored.positions);
      graphEdges = toGraphEdges(stored.edgeData);
      needsInitialLayoutRef.current = false;
    } else {
      graphNodes = toGraphNodes(seedNodes);
      graphEdges = toGraphEdges(seedEdges);
      needsInitialLayoutRef.current = true;
    }

    setNodes(graphNodes);
    setEdges(graphEdges);
    setInitialized(true);
  }, []);

  // Auto-persist on changes
  useEffect(() => {
    if (!initialized) return;
    persist(nodes, edges);
  }, [nodes, edges, initialized, persist]);

  const addNode = useCallback((title: string, note?: string) => {
    const id = crypto.randomUUID();
    const newNode: GraphNode = {
      id,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: { title, note },
    };
    setNodes((nds) => [...nds, newNode]);
  }, []);

  const updateNode = useCallback(
    (id: string, data: { title?: string; note?: string }) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, ...data } } : n
        )
      );
    },
    []
  );

  const updateNodePosition = useCallback(
    (id: string, position: { x: number; y: number }) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, position } : n))
      );
    },
    []
  );

  const updateAllPositions = useCallback(
    (positions: Record<string, { x: number; y: number }>) => {
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          position: positions[n.id] ?? n.position,
        }))
      );
    },
    []
  );

  const deleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setSelectedNodeId((prev) => (prev === id ? null : prev));
  }, []);

  const addEdgeManual = useCallback(
    (source: string, target: string, label: string) => {
      const id = `e-${source}-${target}-${Date.now()}`;
      setEdges((eds) => [...eds, { id, source, target, label }]);
    },
    []
  );

  const deleteEdge = useCallback((id: string) => {
    setEdges((eds) => eds.filter((e) => e.id !== id));
  }, []);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;

  return {
    nodes,
    edges,
    selectedNode,
    selectedNodeId,
    initialized,
    needsInitialLayout: needsInitialLayoutRef.current,
    setSelectedNodeId,
    updateNodePosition,
    updateAllPositions,
    addNode,
    updateNode,
    deleteNode,
    addEdgeManual,
    deleteEdge,
  };
}
