"use client";

import { useEffect, useRef, useCallback } from "react";
import cytoscape, { type Core, type EventObject } from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";
import { GraphControls } from "./graph-controls";
import { coseBilkentLayoutOptions } from "../lib/graph-layout";
import type { GraphNode, GraphEdge } from "../types/graph-types";

// Register cose-bilkent layout extension
if (typeof window !== "undefined") {
  cytoscape.use(coseBilkent);
}

function makeNodeLabel(title: string, note?: string): string {
  return note ? `${title}\n${note}` : title;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const cyStylesheet: cytoscape.StylesheetStyle[] = [
  {
    selector: "node",
    style: {
      shape: "round-rectangle",
      "background-color": "#ffffff",
      "border-width": 1.5,
      "border-color": "#e5e7eb",
      label: "data(label)",
      "text-wrap": "wrap",
      "text-max-width": "160px",
      "text-valign": "center",
      "text-halign": "center",
      "font-size": 12,
      "font-family": "Inter, system-ui, sans-serif",
      color: "#374151",
      width: "label",
      height: "label",
      padding: "14px",
      "transition-property":
        "border-color, border-width, opacity, background-color",
      "transition-duration": "0.3s",
    } as any,
  },
  {
    selector: "node:active",
    style: {
      "overlay-opacity": 0,
    } as any,
  },
  {
    selector: "node.selected",
    style: {
      "border-color": "#3b82f6",
      "border-width": 2.5,
      "background-color": "#eff6ff",
    } as any,
  },
  {
    selector: "node.highlighted",
    style: {
      opacity: 1,
    } as any,
  },
  {
    selector: "node.dimmed",
    style: {
      opacity: 0.15,
    } as any,
  },
  {
    selector: "edge",
    style: {
      width: 1.5,
      "line-color": "#9ca3af",
      "target-arrow-color": "#9ca3af",
      "target-arrow-shape": "triangle",
      "arrow-scale": 0.8,
      "curve-style": "bezier",
      label: "data(label)",
      "font-size": 11,
      color: "#6b7280",
      "text-background-color": "#ffffff",
      "text-background-opacity": 0.9,
      "text-background-padding": "4px",
      "text-background-shape": "roundrectangle",
      "text-rotation": "autorotate",
      "line-style": "dashed",
      "line-dash-pattern": [6, 4],
      opacity: 0.8,
      "transition-property": "opacity, line-color, width, target-arrow-color",
      "transition-duration": "0.3s",
    } as any,
  },
  {
    selector: "edge.highlighted",
    style: {
      width: 2.5,
      "line-color": "#4b5563",
      "target-arrow-color": "#4b5563",
      opacity: 1,
      "font-weight": "bold",
      "font-size": 13,
      color: "#1f2937",
    } as any,
  },
  {
    selector: "edge.dimmed",
    style: {
      opacity: 0.06,
      "line-color": "#d1d5db",
      "target-arrow-color": "#d1d5db",
      label: "",
    } as any,
  },
];
/* eslint-enable @typescript-eslint/no-explicit-any */

type GraphCanvasProps = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  needsInitialLayout: boolean;
  onNodeClick: (id: string) => void;
  onPaneClick: () => void;
  onNodeDrag: (id: string, position: { x: number; y: number }) => void;
  onPositionsUpdate: (
    positions: Record<string, { x: number; y: number }>
  ) => void;
  onAddNode: () => void;
  onAddEdge: () => void;
};

export function GraphCanvas({
  nodes,
  edges,
  selectedNodeId,
  needsInitialLayout,
  onNodeClick,
  onPaneClick,
  onNodeDrag,
  onPositionsUpdate,
  onAddNode,
  onAddEdge,
}: GraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const initializedRef = useRef(false);

  // Use refs for callbacks to avoid re-registering event listeners
  const onNodeClickRef = useRef(onNodeClick);
  const onPaneClickRef = useRef(onPaneClick);
  const onNodeDragRef = useRef(onNodeDrag);
  const onPositionsUpdateRef = useRef(onPositionsUpdate);
  onNodeClickRef.current = onNodeClick;
  onPaneClickRef.current = onPaneClick;
  onNodeDragRef.current = onNodeDrag;
  onPositionsUpdateRef.current = onPositionsUpdate;

  // Persist all node positions from cytoscape to React state
  const persistAllPositions = useCallback(() => {
    const cy = cyRef.current;
    if (!cy) return;
    const positions: Record<string, { x: number; y: number }> = {};
    cy.nodes().forEach((node) => {
      const pos = node.position();
      positions[node.id()] = { x: pos.x, y: pos.y };
    });
    onPositionsUpdateRef.current(positions);
  }, []);

  // Initialize Cytoscape instance
  useEffect(() => {
    if (!containerRef.current || cyRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      style: cyStylesheet,
      layout: { name: "preset" },
      minZoom: 0.3,
      maxZoom: 3,
      wheelSensitivity: 0.3,
      boxSelectionEnabled: false,
      selectionType: "single",
    });

    // Node tap → select
    cy.on("tap", "node", (evt: EventObject) => {
      onNodeClickRef.current(evt.target.id());
    });

    // Background tap → deselect
    cy.on("tap", (evt: EventObject) => {
      if (evt.target === cy) {
        onPaneClickRef.current();
      }
    });

    // Node drag end → persist position
    cy.on("dragfree", "node", (evt: EventObject) => {
      const node = evt.target;
      const pos = node.position();
      onNodeDragRef.current(node.id(), { x: pos.x, y: pos.y });
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
      cyRef.current = null;
      initializedRef.current = false;
    };
  }, []);

  // Sync nodes and edges from React state → Cytoscape
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy || nodes.length === 0) return;

    // --- Sync nodes ---
    const reactNodeIds = new Set(nodes.map((n) => n.id));

    // Remove nodes no longer in state
    cy.nodes().forEach((n) => {
      if (!reactNodeIds.has(n.id())) {
        cy.remove(n);
      }
    });

    // Add or update nodes
    const cyNodeIds = new Set(cy.nodes().map((n) => n.id()));
    nodes.forEach((node) => {
      const label = makeNodeLabel(node.data.title, node.data.note);
      if (!cyNodeIds.has(node.id)) {
        cy.add({
          group: "nodes",
          data: {
            id: node.id,
            title: node.data.title,
            note: node.data.note || "",
            label,
          },
          position: { x: node.position.x, y: node.position.y },
        });
      } else {
        const cyNode = cy.getElementById(node.id);
        if (
          cyNode.data("title") !== node.data.title ||
          cyNode.data("note") !== (node.data.note || "")
        ) {
          cyNode.data("title", node.data.title);
          cyNode.data("note", node.data.note || "");
          cyNode.data("label", label);
        }
      }
    });

    // --- Sync edges ---
    const reactEdgeIds = new Set(edges.map((e) => e.id));

    // Remove edges no longer in state
    cy.edges().forEach((e) => {
      if (!reactEdgeIds.has(e.id())) {
        cy.remove(e);
      }
    });

    // Add new edges
    const cyEdgeIds = new Set(cy.edges().map((e) => e.id()));
    edges.forEach((edge) => {
      if (!cyEdgeIds.has(edge.id)) {
        cy.add({
          group: "edges",
          data: {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            label: edge.label,
          },
        });
      }
    });

    // Run layout on first sync
    if (!initializedRef.current) {
      initializedRef.current = true;
      if (needsInitialLayout) {
        const layout = cy.layout(coseBilkentLayoutOptions);
        layout.on("layoutstop", () => {
          persistAllPositions();
        });
        layout.run();
      } else {
        cy.fit(undefined, 40);
      }
    }
  }, [nodes, edges, needsInitialLayout, persistAllPositions]);

  // Update selection highlighting
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    // Clear all highlight classes
    cy.elements().removeClass("selected highlighted dimmed");

    if (!selectedNodeId) return;

    const selectedCyNode = cy.getElementById(selectedNodeId);
    if (selectedCyNode.empty()) return;

    // Find connected node IDs
    const connectedIds = new Set<string>([selectedNodeId]);
    const connectedEdgeIds = new Set<string>();

    cy.edges().forEach((edge) => {
      const src = edge.source().id();
      const tgt = edge.target().id();
      if (src === selectedNodeId || tgt === selectedNodeId) {
        connectedIds.add(src);
        connectedIds.add(tgt);
        connectedEdgeIds.add(edge.id());
      }
    });

    // Apply classes
    selectedCyNode.addClass("selected");

    cy.nodes().forEach((node) => {
      if (node.id() === selectedNodeId) return;
      node.addClass(connectedIds.has(node.id()) ? "highlighted" : "dimmed");
    });

    cy.edges().forEach((edge) => {
      edge.addClass(
        connectedEdgeIds.has(edge.id()) ? "highlighted" : "dimmed"
      );
    });
  }, [selectedNodeId, edges]);

  // Handle re-layout
  const handleResetLayout = useCallback(() => {
    const cy = cyRef.current;
    if (!cy) return;
    const layout = cy.layout(coseBilkentLayoutOptions);
    layout.on("layoutstop", () => {
      persistAllPositions();
    });
    layout.run();
  }, [persistAllPositions]);

  return (
    <div className="relative h-full w-full">
      <div
        ref={containerRef}
        className="h-full w-full bg-background"
        style={{ minHeight: "400px" }}
      />
      <GraphControls
        onAddNode={onAddNode}
        onAddEdge={onAddEdge}
        onResetLayout={handleResetLayout}
      />
    </div>
  );
}
