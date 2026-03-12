/* eslint-disable @typescript-eslint/no-explicit-any */
import cytoscape from "cytoscape";

export const cyStylesheet: cytoscape.StylesheetStyle[] = [
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
      "transition-property": "opacity, line-color, width, target-arrow-color",
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
