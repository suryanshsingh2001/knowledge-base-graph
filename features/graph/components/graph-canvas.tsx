"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import cytoscape, { type Core, type EventObject } from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GraphMinimap } from "./graph-minimap";
import { coseBilkentLayoutOptions } from "../lib/graph-layout";
import { cyStylesheet } from "../lib/graph-stylesheet";
import { getNodeColor, buildNodeBackgroundImage } from "../lib/graph-node-colors";
import type { GraphNode, GraphEdge, GraphCanvasProps } from "../types/graph-types";

// Register cose-bilkent layout extension
if (typeof window !== "undefined") {
  cytoscape.use(coseBilkent);
}

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

      if (!cyNodeIds.has(node.id)) {
        const bg = buildNodeBackgroundImage(color.border, color.text, title, note);
        cy.add({
          group: "nodes",
          data: {
            id: node.id,
            title,
            label: "",
            note: note || "",
            bgColor: color.bg,
            borderColor: color.border,
            textColor: color.text,
            accentColor: color.accent,
            colorIndex: String(index),
            bgImage: bg.dataUri,
            nodeHeight: bg.height,
          },
          position: { x: node.position.x, y: node.position.y },
        });
      } else {
        const cyNode = cy.getElementById(node.id);
        if (
          cyNode.data("title") !== title ||
          cyNode.data("note") !== (note || "")
        ) {
          const bg = buildNodeBackgroundImage(color.border, color.text, title, note);
          cyNode.data({
            title,
            note: note || "",
            bgImage: bg.dataUri,
            nodeHeight: bg.height,
          });
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
