"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  useNodesState,
  useEdgesState,
  type NodeChange,
  type EdgeChange,
  type Connection,
  addEdge,
} from "@xyflow/react";
import type {
  GraphNode,
  GraphEdge,
  GraphNodeData,
  GraphEdgeData,
} from "../types/graph-types";
import { seedNodes, seedEdges } from "../data/seed-data";
import { loadGraphState, saveGraphState } from "../lib/graph-storage";
import { getLayoutedElements } from "../lib/graph-layout";

function toFlowNodes(data: GraphNodeData[]): GraphNode[] {
  return data.map((n) => ({
    id: n.id,
    type: "custom",
    position: { x: 0, y: 0 },
    data: { title: n.title, note: n.note },
  }));
}

function toFlowEdges(data: GraphEdgeData[]): GraphEdge[] {
  return data.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    type: "default",
    animated: true,
    style: { stroke: "#555", strokeWidth: 2 },
    labelStyle: { fontSize: 12, fontWeight: 700, fill: "#444", letterSpacing: "0.01em" },
    labelBgStyle: { fill: "var(--background)", fillOpacity: 0.9, stroke: "#e0e0e0", strokeWidth: 1 },
    labelBgPadding: [8, 5] as [number, number],
    labelBgBorderRadius: 6,
  }));
}

export function useGraphStore() {
  const [nodes, setNodes, onNodesChange] = useNodesState<GraphNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<GraphEdge>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
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
          label: (e.label as string) ?? "",
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
    let flowNodes: GraphNode[];
    let flowEdges: GraphEdge[];
    let positions: Record<string, { x: number; y: number }> | undefined;

    if (stored) {
      flowNodes = toFlowNodes(stored.nodeData);
      flowEdges = toFlowEdges(stored.edgeData);
      positions = stored.positions;
    } else {
      flowNodes = toFlowNodes(seedNodes);
      flowEdges = toFlowEdges(seedEdges);
    }

    const layouted = getLayoutedElements(flowNodes, flowEdges, positions);
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
    setInitialized(true);
  }, [setNodes, setEdges]);

  // Auto-persist on changes
  useEffect(() => {
    if (!initialized) return;
    persist(nodes, edges);
  }, [nodes, edges, initialized, persist]);

  const handleNodesChange = useCallback(
    (changes: NodeChange<GraphNode>[]) => {
      onNodesChange(changes);
    },
    [onNodesChange]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange<GraphEdge>[]) => {
      onEdgesChange(changes);
    },
    [onEdgesChange]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: GraphEdge = {
        ...connection,
        id: `e-${connection.source}-${connection.target}`,
        label: "related to",
        animated: true,
        style: { stroke: "#555", strokeWidth: 2 },
        labelStyle: { fontSize: 12, fontWeight: 700, fill: "#444", letterSpacing: "0.01em" },
        labelBgStyle: { fill: "var(--background)", fillOpacity: 0.9, stroke: "#e0e0e0", strokeWidth: 1 },
        labelBgPadding: [8, 5] as [number, number],
        labelBgBorderRadius: 6,
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const addNode = useCallback(
    (title: string, note?: string) => {
      const id = crypto.randomUUID();
      const newNode: GraphNode = {
        id,
        type: "custom",
        position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
        data: { title, note },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  const updateNode = useCallback(
    (id: string, data: { title?: string; note?: string }) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id
            ? { ...n, data: { ...n.data, ...data } }
            : n
        )
      );
    },
    [setNodes]
  );

  const deleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      if (selectedNodeId === id) setSelectedNodeId(null);
    },
    [setNodes, setEdges, selectedNodeId]
  );

  const addEdgeManual = useCallback(
    (source: string, target: string, label: string) => {
      const id = `e-${source}-${target}-${Date.now()}`;
      const newEdge: GraphEdge = {
        id,
        source,
        target,
        label,
        animated: true,
        style: { stroke: "#555", strokeWidth: 2 },
        labelStyle: { fontSize: 12, fontWeight: 700, fill: "#444", letterSpacing: "0.01em" },
        labelBgStyle: { fill: "var(--background)", fillOpacity: 0.9, stroke: "#e0e0e0", strokeWidth: 1 },
        labelBgPadding: [8, 5] as [number, number],
        labelBgBorderRadius: 6,
      };
      setEdges((eds) => [...eds, newEdge]);
    },
    [setEdges]
  );

  const deleteEdge = useCallback(
    (id: string) => {
      setEdges((eds) => eds.filter((e) => e.id !== id));
    },
    [setEdges]
  );

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;

  return {
    nodes,
    edges,
    selectedNode,
    selectedNodeId,
    initialized,
    setNodes,
    setSelectedNodeId,
    onNodesChange: handleNodesChange,
    onEdgesChange: handleEdgesChange,
    onConnect,
    addNode,
    updateNode,
    deleteNode,
    addEdgeManual,
    deleteEdge,
  };
}
