"use client";

import { useState } from "react";
import { AppHeader } from "@/components/shared/app-header";
import { GraphCanvas } from "@/features/graph/components/graph-canvas";
import { useGraphStore } from "@/features/graph/hooks/use-graph-store";
import { NodeSidebar } from "@/features/node/components/node-sidebar";
import { AddNodeDialog } from "@/features/node/components/add-node-dialog";
import { AddEdgeDialog } from "@/features/node/components/add-edge-dialog";

export default function KnowledgeGraphPage() {
  const {
    nodes,
    edges,
    selectedNode,
    selectedNodeId,
    initialized,
    needsInitialLayout,
    setSelectedNodeId,
    updateNodePosition,
    updateAllPositions,
    addNode,
    updateNode,
    deleteNode,
    addEdgeManual,
    deleteEdge,
  } = useGraphStore();

  const [addNodeOpen, setAddNodeOpen] = useState(false);
  const [addEdgeOpen, setAddEdgeOpen] = useState(false);

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#080e1e]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <div className="text-sm text-slate-400">Loading graph...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#080e1e]">
      <AppHeader
        nodeCount={nodes.length}
        edgeCount={edges.length}
        onAddNode={() => setAddNodeOpen(true)}
        onAddEdge={() => setAddEdgeOpen(true)}
      />
      <div className="relative flex flex-1 overflow-hidden">
        <div className="flex-1">
          <GraphCanvas
            nodes={nodes}
            edges={edges}
            selectedNodeId={selectedNodeId}
            needsInitialLayout={needsInitialLayout}
            onNodeClick={setSelectedNodeId}
            onPaneClick={() => setSelectedNodeId(null)}
            onNodeDrag={updateNodePosition}
            onPositionsUpdate={updateAllPositions}
          />
        </div>

        {/* Desktop sidebar: always visible */}
        <div className="hidden md:block">
          <NodeSidebar
            node={selectedNode}
            edges={edges}
            allNodes={nodes}
            onClose={() => setSelectedNodeId(null)}
            onUpdate={updateNode}
            onDelete={deleteNode}
            onDeleteEdge={deleteEdge}
          />
        </div>

        {/* Mobile sidebar: slide-up overlay when node selected */}
        {selectedNode && (
          <div className="absolute inset-x-0 bottom-0 z-30 md:hidden">
            <div
              className="absolute inset-0 -top-full bg-black/40"
              onClick={() => setSelectedNodeId(null)}
            />
            <div className="relative max-h-[70vh] overflow-y-auto rounded-t-2xl border-t border-white/[0.08] bg-[#0c1222] shadow-2xl shadow-black/50">
              <div className="sticky top-0 z-10 flex items-center justify-center py-2">
                <div className="h-1 w-10 rounded-full bg-slate-600" />
              </div>
              <NodeSidebar
                node={selectedNode}
                edges={edges}
                allNodes={nodes}
                onClose={() => setSelectedNodeId(null)}
                onUpdate={updateNode}
                onDelete={deleteNode}
                onDeleteEdge={deleteEdge}
                isMobile
              />
            </div>
          </div>
        )}
      </div>

      <AddNodeDialog
        open={addNodeOpen}
        onOpenChange={setAddNodeOpen}
        onAdd={addNode}
      />
      <AddEdgeDialog
        open={addEdgeOpen}
        onOpenChange={setAddEdgeOpen}
        nodes={nodes}
        onAdd={addEdgeManual}
      />
    </div>
  );
}
