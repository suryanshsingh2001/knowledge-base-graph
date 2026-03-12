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
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading graph...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
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
            onAddNode={() => setAddNodeOpen(true)}
            onAddEdge={() => setAddEdgeOpen(true)}
          />
        </div>

        {selectedNode && (
          <NodeSidebar
            node={selectedNode}
            edges={edges}
            allNodes={nodes}
            onClose={() => setSelectedNodeId(null)}
            onUpdate={updateNode}
            onDelete={deleteNode}
            onDeleteEdge={deleteEdge}
          />
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
