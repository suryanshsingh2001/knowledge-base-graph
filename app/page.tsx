"use client";

import { useState, useCallback } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { AppHeader } from "@/shared/components/app-header";
import { GraphCanvas } from "@/features/graph/components/graph-canvas";
import { useGraphStore } from "@/features/graph/hooks/use-graph-store";
import { getLayoutedElements } from "@/features/graph/lib/graph-layout";
import { NodeSidebar } from "@/features/node/components/node-sidebar";
import { AddNodeDialog } from "@/features/node/components/add-node-dialog";
import { AddEdgeDialog } from "@/features/node/components/add-edge-dialog";

function KnowledgeGraph() {
  const {
    nodes,
    edges,
    selectedNode,
    selectedNodeId,
    initialized,
    setNodes,
    setSelectedNodeId,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNode,
    deleteNode,
    addEdgeManual,
    deleteEdge,
  } = useGraphStore();

  const [addNodeOpen, setAddNodeOpen] = useState(false);
  const [addEdgeOpen, setAddEdgeOpen] = useState(false);

  const handleResetLayout = useCallback(() => {
    // Pass no positions to force fresh dagre layout
    const layouted = getLayoutedElements(nodes, edges);
    setNodes(layouted.nodes);
  }, [nodes, edges, setNodes]);

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
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={setSelectedNodeId}
            onPaneClick={() => setSelectedNodeId(null)}
            onAddNode={() => setAddNodeOpen(true)}
            onAddEdge={() => setAddEdgeOpen(true)}
            onResetLayout={handleResetLayout}
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

export default function KnowledgeGraphPage() {
  return (
    <ReactFlowProvider>
      <KnowledgeGraph />
    </ReactFlowProvider>
  );
}
