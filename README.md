# Knowledge Graph

A frontend-only interactive knowledge graph — like a lightweight personal Obsidian. Create notes, connect them with labeled relationships, and explore them visually in a live graph.

Built with **Next.js 16**, **Cytoscape.js**, **TypeScript**, **TailwindCSS v4**, and **shadcn/ui**.

---

## Features

- **Interactive graph canvas** — pan, zoom, and drag nodes freely
- **cose-bilkent auto-layout** — nodes are automatically arranged with no overlaps on first load
- **Click to inspect** — select a node to open a details sidebar; connected nodes highlight, unrelated ones fade
- **Full CRUD** — create/edit/delete nodes and labeled edges
- **8-color node palette** — nodes are automatically assigned distinct colors for visual differentiation
- **Canvas minimap** — bottom-right corner overview with click-to-pan; hidden on mobile
- **Zoom controls** — zoom in/out, fit-to-view, and re-layout buttons on the canvas
- **Persistent layout** — node positions are saved to `localStorage` along with the entire graph state
- **Mobile responsive** — compact header on mobile, slide-up bottom sheet sidebar, hidden minimap
- **Seed data** — ships with a pre-built React/Next.js tech knowledge graph so you have something to explore immediately

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16.1.6](https://nextjs.org) (App Router) |
| Language | TypeScript (strict, no `any`) |
| Graph | [Cytoscape.js](https://js.cytoscape.org) v3 |
| Layout | [cytoscape-cose-bilkent](https://github.com/cytoscape/cytoscape.js-cose-bilkent) |
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
│   ├── globals.css          # Tailwind v4 theme + dot-grid canvas background
│   ├── layout.tsx
│   └── page.tsx             # Root page — wires everything together
│
├── features/
│   ├── graph/               # Graph visualization feature
│   │   ├── components/
│   │   │   ├── graph-canvas.tsx    # Cytoscape.js canvas, styles, and controls
│   │   │   ├── graph-controls.tsx  # (legacy file, controls now inline)
│   │   │   └── graph-minimap.tsx   # Canvas-based minimap with click-to-pan
│   │   ├── hooks/
│   │   │   └── use-graph-store.ts  # All graph state, CRUD, persistence
│   │   ├── lib/
│   │   │   ├── graph-layout.ts     # cose-bilkent layout options
│   │   │   └── graph-storage.ts    # localStorage read/write
│   │   ├── types/
│   │   │   └── graph-types.ts      # TypeScript types for nodes/edges
│   │   ├── data/
│   │   │   └── seed-data.ts        # Default knowledge graph content
│   │   └── index.ts                # Barrel export
│   │
│   └── node/                # Node interaction feature
│       ├── components/
│       │   ├── node-sidebar.tsx    # View/edit/delete panel for selected node
│       │   ├── add-node-dialog.tsx # Dialog to create a new node
│       │   └── add-edge-dialog.tsx # Dialog to create a connection
│       └── index.tsx               # Barrel export
│
├── components/
│   ├── shared/
│   │   └── app-header.tsx   # Top navigation bar with create buttons
│   └── ui/                  # shadcn/ui primitives
│
├── types/
│   └── cytoscape-cose-bilkent.d.ts  # Type declarations for cose-bilkent plugin
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
import { coseBilkentLayoutOptions } from "@/features/graph/lib";
import { GraphCanvas } from "@/features/graph/components";
```

---

## How It Works

### State Management

All graph state lives in `useGraphStore` (`features/graph/hooks/use-graph-store.ts`). It uses plain React `useState` and exposes clean CRUD actions.

On mount:
1. Reads from `localStorage`
2. If found — restores nodes, edges, and saved drag positions
3. If empty — loads seed data and runs the cose-bilkent layout

Every state change auto-saves to `localStorage` (debounced 300ms).

### Layout

cose-bilkent (`features/graph/lib/graph-layout.ts`) calculates a force-directed layout with `idealEdgeLength: 150`, `nodeRepulsion: 6500`, and `gravity: 0.25`. Saved positions always take priority — the **Re-layout** button forces a full recalculation with animation.

### Node Styling

Nodes are 200×80px with fixed dimensions (no resize on interaction). Each node is assigned one of 8 colors from a predefined palette. Node labels display the title and full note text using Cytoscape's `text-wrap: "wrap"` with `text-max-width: "150px"`.

### Edge Rendering

Edges use Cytoscape's `bezier` curve style with mid-point labels. When a node is selected:

- **Connected edges** → highlighted with bright color
- **Connected nodes** → highlighted border
- **Unrelated nodes/edges** → faded to near-invisible

---

## Keyboard & Interaction Tips
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
import { coseBilkentLayoutOptions } from "@/features/graph/lib";
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
| Add node | "Add Node" button in the top header |
| Add edge | "Add Edge" button in the top header → pick source, target, label |
| Drag node | Click and drag any node |
| Re-layout | "Re-layout" button (bottom-left of canvas) — resets positions via cose-bilkent |
| Zoom in/out | Zoom buttons (bottom-left of canvas) or scroll |
| Fit to view | "Fit" button (bottom-left of canvas) |
| Pan | Drag the canvas background |
| Minimap | Bottom-right corner — click to pan to a location (desktop only) |

---

## Customisation

### Changing Seed Data

Edit `features/graph/data/seed-data.ts`. Clear `localStorage` in your browser (DevTools → Application → Storage) so the new seed data is picked up on next load.

### Changing the Theme

Edit CSS variables in `app/globals.css`. The project uses [oklch](https://oklch.com) colours matching the deep navy dark theme. The dot-grid canvas background is also defined here under `.graph-canvas`.

### Changing Node Colors

Edit the `NODE_COLORS` array at the top of `features/graph/components/graph-canvas.tsx`. Each entry defines `bg` (fill), `border`, and `text` colors for a node.

---

## Scripts

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint
```
