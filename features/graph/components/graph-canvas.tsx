"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import cytoscape, { type Core, type EventObject } from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GraphMinimap } from "./graph-minimap";
import { coseBilkentLayoutOptions } from "../lib/graph-layout";
import type { GraphNode, GraphEdge } from "../types/graph-types";

// Register cose-bilkent layout extension
if (typeof window !== "undefined") {
  cytoscape.use(coseBilkent);
}

// Palette of rich node colors
const NODE_COLORS = [
  { bg: "#1e293b", border: "#3b82f6", text: "#93c5fd", accent: "#3b82f6" }, // blue
  { bg: "#1a2332", border: "#8b5cf6", text: "#c4b5fd", accent: "#8b5cf6" }, // violet
  { bg: "#1c2421", border: "#10b981", text: "#6ee7b7", accent: "#10b981" }, // emerald
  { bg: "#2a1f1f", border: "#ef4444", text: "#fca5a5", accent: "#ef4444" }, // red
  { bg: "#2a2517", border: "#f59e0b", text: "#fcd34d", accent: "#f59e0b" }, // amber
  { bg: "#1f2937", border: "#06b6d4", text: "#67e8f9", accent: "#06b6d4" }, // cyan
  { bg: "#271d2d", border: "#ec4899", text: "#f9a8d4", accent: "#ec4899" }, // pink
  { bg: "#1e2a1e", border: "#84cc16", text: "#bef264", accent: "#84cc16" }, // lime
];

function getNodeColor(index: number) {
  return NODE_COLORS[index % NODE_COLORS.length];
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const cyStylesheet: cytoscape.StylesheetStyle[] = [
  {
    selector: "node",
    style: {
      shape: "round-rectangle",
      "background-color": "data(bgColor)",
      "border-width": 2,
      "border-color": "data(borderColor)",
      "border-opacity": 0.85,
      label: "data(label)",
      "text-wrap": "wrap",
      "text-max-width": "150px",
      "text-valign": "center",
      "text-halign": "center",
      "font-size": 12,
      "font-weight": "bold",
      "font-family": "Inter, system-ui, sans-serif",
      color: "#ffffff",
      "text-outline-color": "data(bgColor)",
      "text-outline-width": 1,
      "text-outline-opacity": 0.6,
      width: 200,
      height: 80,
      padding: "12px",
      "transition-property":
        "border-color, border-width, opacity, background-color, shadow-blur, shadow-color, shadow-opacity",
      "transition-duration": "0.3s",
      "shadow-blur": 16,
      "shadow-color": "data(borderColor)",
      "shadow-opacity": 0.25,
      "shadow-offset-x": 0,
      "shadow-offset-y": 3,
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
      "border-width": 3,
      "border-opacity": 1,
      "shadow-opacity": 0.55,
      "shadow-blur": 28,
    } as any,
  },
  {
    selector: "node.highlighted",
    style: {
      opacity: 1,
      "border-opacity": 0.8,
    } as any,
  },
  {
    selector: "node.dimmed",
    style: {
      opacity: 0.12,
      "shadow-opacity": 0,
    } as any,
  },
  {
    selector: "edge",
    style: {
      width: 1.5,
      "line-color": "#475569",
      "target-arrow-color": "#475569",
      "target-arrow-shape": "triangle",
      "arrow-scale": 0.7,
      "curve-style": "bezier",
      label: "data(label)",
      "font-size": 10,
      "font-family": "Inter, system-ui, sans-serif",
      color: "#94a3b8",
      "text-background-color": "#0f172a",
      "text-background-opacity": 0.85,
      "text-background-padding": "4px",
      "text-background-shape": "roundrectangle",
      "text-rotation": "autorotate",
      "line-style": "dashed",
      "line-dash-pattern": [6, 4],
      opacity: 0.55,
      "transition-property":
        "opacity, line-color, width, target-arrow-color",
      "transition-duration": "0.3s",
    } as any,
  },
  {
    selector: "edge.highlighted",
    style: {
      width: 2.5,
      "line-color": "#818cf8",
      "target-arrow-color": "#818cf8",
      opacity: 1,
      "font-weight": "bold",
      "font-size": 12,
      color: "#c7d2fe",
      "line-style": "solid",
    } as any,
  },
  {
    selector: "edge.dimmed",
    style: {
      opacity: 0.04,
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
}: GraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const initializedRef = useRef(false);
  const [cyReady, setCyReady] = useState<Core | null>(null);

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
    setCyReady(cy);

    return () => {
      cy.destroy();
      cyRef.current = null;
      setCyReady(null);
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
    nodes.forEach((node, index) => {
      const color = getNodeColor(node.data.color ? parseInt(node.data.color, 10) : index);
      const title = node.data.title;
      const note = node.data.note;
      const label = note ? `${title}\n${note}` : title;

      if (!cyNodeIds.has(node.id)) {
        cy.add({
          group: "nodes",
          data: {
            id: node.id,
            title,
            label,
            note: note || "",
            bgColor: color.bg,
            borderColor: color.border,
            textColor: color.text,
            accentColor: color.accent,
            colorIndex: String(index),
          },
          position: { x: node.position.x, y: node.position.y },
        });
      } else {
        const cyNode = cy.getElementById(node.id);
        if (
          cyNode.data("title") !== title ||
          cyNode.data("note") !== (note || "")
        ) {
          const updatedLabel = (note || "") ? `${title}\n${note || ""}` : title;
          cyNode.data({ title, note: note || "", label: updatedLabel });
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

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.animate({ zoom: { level: cy.zoom() * 1.3, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } }, duration: 200 });
  }, []);

  const handleZoomOut = useCallback(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.animate({ zoom: { level: cy.zoom() / 1.3, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } }, duration: 200 });
  }, []);

  const handleFitView = useCallback(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.animate({ fit: { eles: cy.elements(), padding: 50 }, duration: 300, easing: "ease-out" });
  }, []);

  return (
    <div className="relative h-full w-full">
      <div
        ref={containerRef}
        className="graph-canvas h-full w-full"
        style={{ minHeight: "400px" }}
      />

      {/* Bottom-left: zoom & layout controls */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 sm:bottom-5 sm:left-5">
        <div className="flex items-center gap-0.5 rounded-lg border border-slate-700/40 bg-[#0c1222]/90 p-0.5 shadow-lg shadow-black/30 backdrop-blur-md sm:p-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleZoomIn}
            className="h-8 w-8 text-slate-300 hover:bg-slate-700/50 hover:text-white"
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleZoomOut}
            className="h-8 w-8 text-slate-300 hover:bg-slate-700/50 hover:text-white"
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="mx-0.5 h-4 w-px bg-slate-700/50" />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleFitView}
            className="h-8 w-8 text-slate-300 hover:bg-slate-700/50 hover:text-white"
            title="Fit to view"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleResetLayout}
            className="h-8 w-8 text-slate-300 hover:bg-slate-700/50 hover:text-white"
            title="Re-layout"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bottom-right: minimap */}
      <GraphMinimap cy={cyReady} />
    </div>
  );

}
