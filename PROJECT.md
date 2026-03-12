# Personal Knowledge Graph Viewer

Build a **frontend-only interactive knowledge graph** using **Next.js (App Router) and TypeScript**.

The application allows users to create notes (nodes), connect them with relationships (edges), and explore them visually in a graph interface.

This is similar to a **lightweight Obsidian-style knowledge graph**.

---

# Tech Stack

* **Next.js 16.1.6** (App Router, Turbopack)
* **React 19** + **TypeScript** (strict, no `any`)
* **Cytoscape.js** v3 — graph visualization
* **cytoscape-cose-bilkent** — force-directed auto-layout
* **TailwindCSS v4** — deep navy dark theme, oklch color tokens
* **shadcn/ui** — UI primitives
* **localStorage** for persistence

No backend is required.

---

# Architecture

Feature-based architecture — each feature contains its own components, hooks, types, and utilities. Use **kebab-case file naming**.

Example:

```
graph-canvas.tsx
node-sidebar.tsx
use-graph-store.ts
graph-storage.ts
```

---

# Project Structure

```
/app
  globals.css          # Tailwind v4 theme + dot-grid canvas background
  layout.tsx
  page.tsx             # Root page — wires everything together

/features
  /graph
    components/
      graph-canvas.tsx        # Cytoscape.js canvas, node styles, zoom controls
      graph-minimap.tsx       # Canvas-based minimap with click-to-pan
      graph-controls.tsx      # (legacy, controls now inline in graph-canvas)
    hooks/
      use-graph-store.ts      # All graph state, CRUD, localStorage persistence
    lib/
      graph-storage.ts        # localStorage read/write helpers
      graph-layout.ts         # cose-bilkent layout options
    types/
      graph-types.ts          # TypeScript types for GraphNode and GraphEdge
    data/
      seed-data.ts            # Default knowledge graph seed content

  /node
    components/
      node-sidebar.tsx        # View/edit/delete panel for selected node
      add-node-dialog.tsx     # Dialog to create a new node
      add-edge-dialog.tsx     # Dialog to create a connection

/components
  /shared
    app-header.tsx            # Top header with logo, stats, and create buttons
  /ui                         # shadcn/ui primitives

/types
  cytoscape-cose-bilkent.d.ts # Type declarations for the cose-bilkent plugin

/lib
  utils.ts                    # cn() helper
```

---

# Data Models

Define strong TypeScript types.

## Node

```ts
export type GraphNode = {
  id: string
  title: string
  note?: string
  position?: { x: number; y: number }
  color?: string
}
```

## Edge

```ts
export type GraphEdge = {
  id: string
  source: string
  target: string
  label: string
}
```

---

# Core Features

## Graph View

Render the graph using **Cytoscape.js** with the **cytoscape-cose-bilkent** layout plugin.

Requirements:

* Nodes display their **title and note** (full text, wrapped)
* Nodes are fixed at **200×80px** — size never changes on interaction
* Nodes are automatically assigned one of **8 distinct colors** from a predefined palette
* Edges display a **relationship label** at the midpoint
* Nodes must **not overlap on first load** — cose-bilkent handles this
* Use **cose-bilkent layout** for automatic force-directed positioning
* Nodes should be **draggable**
* Selected node: connected nodes/edges highlight; unrelated nodes/edges fade

---

# Node Interaction

Clicking a node should open the **Node Sidebar**.

The sidebar should allow:

* Editing **title**
* Editing **note content**

Changes should update the graph state immediately.

---

# CRUD Operations

Users should be able to perform the following operations.

### Create

Add a new node with:

* title
* optional note

Create a relationship between two nodes with a **label**.

---

### Update

Edit:

* node title
* node note

---

### Delete

Delete a node.

When a node is deleted:

* all connected edges must also be removed.

Users should also be able to **delete edges** individually.

---

# Persistence

Persist the graph state using **localStorage**.

Save:

* nodes
* edges
* node positions

Behavior:

1. On page load

   * If localStorage exists → restore saved graph
   * Otherwise → load seed data

2. Any graph update should automatically update localStorage.

---

# Seed Data

Use the following seed data when localStorage is empty.

## Nodes

```
id,title,note
1,React,A JavaScript library for building user interfaces using components.
2,Next.js,React framework with SSR routing and APIs.
3,TypeScript,Typed superset of JavaScript.
4,State Management,Patterns like Context Zustand Redux.
5,Component Design,Reusable UI component principles.
6,Performance,Optimization techniques.
7,Testing,Unit integration and e2e testing.
8,CSS & Styling,Tailwind CSS Modules styled-components.
```

## Edges

```
source,target,label
2,1,built on
1,3,pairs well with
1,4,uses
1,5,guides
2,6,improves
1,7,requires
1,8,styled with
4,6,impacts
5,6,impacts
```

---

# UI Requirements

Use **shadcn/ui** components where appropriate.

Examples:

* Button
* Dialog
* Input
* Textarea
* Card
* Separator

The UI should feel **clean and developer-focused**.

---

# UX Improvements

Implemented enhancements:

* ✅ **Dragging nodes** — freely drag anywhere on canvas
* ✅ **Persist node positions** — saved to localStorage on drag end
* ✅ **Highlight connected nodes** when a node is selected
* ✅ **Dim unrelated nodes** — fade to near-invisible
* ✅ **Canvas minimap** — bottom-right, canvas-based, click-to-pan, hidden on mobile
* ✅ **Zoom controls** — zoom in/out, fit, re-layout buttons on canvas (bottom-left)
* ✅ **Mobile responsive** — compact header, slide-up bottom sheet sidebar, hidden minimap
* ✅ **8-color node palette** — distinct colors for visual differentiation

---

# Code Quality Requirements

* Fully typed **TypeScript**
* No `any`
* Small focused components
* Proper React hooks usage
* Predictable state management
* Clean folder structure
* Follow **Cytoscape.js best practices**

---

# Final Result

The final application should allow users to:

* create notes
* connect notes with labeled relationships
* edit notes
* explore the graph visually

The graph state should persist across page refresh using **localStorage**.
