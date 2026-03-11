# Knowledge Graph

A frontend-only interactive knowledge graph — like a lightweight personal Obsidian. Create notes, connect them with labeled relationships, and explore them visually in a live graph.

Built with **Next.js 16**, **React Flow**, **TypeScript**, **TailwindCSS v4**, and **shadcn/ui**.

---

## Features

- **Interactive graph canvas** — pan, zoom, and drag nodes freely
- **Dagre auto-layout** — nodes are automatically arranged with no overlaps on first load
- **Click to inspect** — select a node to open a details sidebar; connected nodes highlight, unrelated ones fade
- **Full CRUD** — create/edit/delete nodes and labeled edges
- **Animated edges** — slow dotted flow on connections; edges draw in when created
- **Node entrance animations** — spring-scale effect when nodes appear
- **Persistent layout** — node positions are saved to `localStorage` along with the entire graph state
- **Seed data** — ships with a pre-built React/Next.js tech knowledge graph so you have something to explore immediately

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript (strict, no `any`) |
| Graph | [@xyflow/react](https://reactflow.dev) v12 |
| Layout | [@dagrejs/dagre](https://github.com/dagrejs/dagre) |
| Styling | [TailwindCSS v4](https://tailwindcss.com) |
| Components | [shadcn/ui](https://ui.shadcn.com) |
| Persistence | `localStorage` (no backend) |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm / yarn / pnpm

### Installation

```bash
git clone https://github.com/suryanshsingh2001/knowledge-base-graph.git
cd knowledge-base-graph
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
knowledge-base-graph/
├── app/
│   ├── globals.css          # Tailwind v4 theme + custom animations
│   ├── layout.tsx
│   └── page.tsx             # Root page — wires everything together
│
├── features/
│   ├── graph/               # Graph visualization feature
│   │   ├── components/
│   │   │   ├── graph-canvas.tsx    # ReactFlow canvas with edge/node styling
│   │   │   ├── graph-controls.tsx  # Add node/edge + re-layout buttons
│   │   │   └── graph-node.tsx      # Custom node renderer
│   │   ├── hooks/
│   │   │   └── use-graph-store.ts  # All graph state, CRUD, persistence
│   │   ├── lib/
│   │   │   ├── graph-layout.ts     # Dagre layout utility
│   │   │   └── graph-storage.ts    # localStorage read/write
│   │   ├── types/
│   │   │   └── graph-types.ts      # TypeScript types for nodes/edges
│   │   ├── data/
│   │   │   └── seed-data.ts        # Default knowledge graph content
│   │   └── index.ts                # Barrel export
│   │
│   └── node/                # Node interaction feature
│       ├── components/
│       │   ├── node-sidebar.tsx    # Edit/delete panel for selected node
│       │   ├── add-node-dialog.tsx # Dialog to create a new node
│       │   └── add-edge-dialog.tsx # Dialog to create a connection
│       └── index.tsx               # Barrel export
│
├── components/
│   ├── shared/
│   │   └── app-header.tsx   # Top navigation bar
│   └── ui/                  # shadcn/ui primitives
│
└── lib/
    └── utils.ts             # cn() helper
```

Each feature is **self-contained** — its own components, hooks, types, and utilities. Barrel `index.ts` files at every layer let you import cleanly:

```ts
// Import from feature root
import { useGraphStore } from "@/features/graph";
import { NodeSidebar } from "@/features/node";

// Or from a specific layer
import { getLayoutedElements } from "@/features/graph/lib";
import { GraphCanvas } from "@/features/graph/components";
```

---

## How It Works

### State Management

All graph state lives in `useGraphStore` (`features/graph/hooks/use-graph-store.ts`). It wraps React Flow's `useNodesState` / `useEdgesState` and exposes clean CRUD actions.

On mount:
1. Reads from `localStorage`
2. If found — restores nodes, edges, and saved drag positions
3. If empty — loads seed data and runs Dagre layout

Every state change auto-saves to `localStorage` (debounced 300ms).

### Layout

Dagre (`features/graph/lib/graph-layout.ts`) calculates a `TB` (top-to-bottom) tree layout. Node heights account for whether a note is present. Saved positions always take priority over Dagre — the **Re-layout** button forces a full recalculation.

### Edge Rendering

Edges use React Flow's `smoothstep` type with animated `stroke-dasharray` CSS. When a node is selected:

- **Connected edges** → highlighted, label shown, animated dots
- **Unrelated edges** → faded to near-invisible, labels hidden

---

## Keyboard & Interaction Tips

| Action | How |
|---|---|
| Select node | Click the node |
| Deselect | Click the canvas background |
| Edit node | Click node → edit in the right sidebar |
| Delete node | Select node → "Delete Node" in sidebar |
| Delete edge | Select node → click × next to the connection |
| Add node | "Add Node" button (bottom left) |
| Add edge | "Add Edge" button → pick source, target, label |
| Drag node | Click and drag any node |
| Re-layout | "Re-layout" button — resets positions via Dagre |
| Zoom/pan | Scroll to zoom, drag canvas to pan |
| Mini-map | Bottom-right corner — pannable and zoomable |

---

## Customisation

### Changing Seed Data

Edit `features/graph/data/seed-data.ts`. Clear `localStorage` in your browser (DevTools → Application → Storage) so the new seed data is picked up on next load.

### Changing the Theme

Edit CSS variables in `app/globals.css`. The project uses [oklch](https://oklch.com) colours matching shadcn/ui's neutral palette. Both light and dark tokens are defined.

### Adding New Node Types

1. Add a new type to `features/graph/types/graph-types.ts`
2. Create a new renderer in `features/graph/components/`
3. Register it in the `nodeTypes` map inside `graph-canvas.tsx`

---

## Scripts

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint
```
