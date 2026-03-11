import type { GraphNodeData, GraphEdgeData } from "../types/graph-types";

export const seedNodes: GraphNodeData[] = [
  {
    id: "1",
    title: "React",
    note: "A JavaScript library for building user interfaces using components.",
  },
  {
    id: "2",
    title: "Next.js",
    note: "React framework with SSR routing and APIs.",
  },
  {
    id: "3",
    title: "TypeScript",
    note: "Typed superset of JavaScript.",
  },
  {
    id: "4",
    title: "State Management",
    note: "Patterns like Context Zustand Redux.",
  },
  {
    id: "5",
    title: "Component Design",
    note: "Reusable UI component principles.",
  },
  {
    id: "6",
    title: "Performance",
    note: "Optimization techniques.",
  },
  {
    id: "7",
    title: "Testing",
    note: "Unit integration and e2e testing.",
  },
  {
    id: "8",
    title: "CSS & Styling",
    note: "Tailwind CSS Modules styled-components.",
  },
];

export const seedEdges: GraphEdgeData[] = [
  { id: "e-2-1", source: "2", target: "1", label: "built on" },
  { id: "e-1-3", source: "1", target: "3", label: "pairs well with" },
  { id: "e-1-4", source: "1", target: "4", label: "uses" },
  { id: "e-1-5", source: "1", target: "5", label: "guides" },
  { id: "e-2-6", source: "2", target: "6", label: "improves" },
  { id: "e-1-7", source: "1", target: "7", label: "requires" },
  { id: "e-1-8", source: "1", target: "8", label: "styled with" },
  { id: "e-4-6", source: "4", target: "6", label: "impacts" },
  { id: "e-5-6", source: "5", target: "6", label: "impacts" },
];
