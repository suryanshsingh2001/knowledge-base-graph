# Personal Knowledge Graph Viewer

Build a **frontend-only interactive knowledge graph** using **Next.js (App Router) and TypeScript**.

The application allows users to create notes (nodes), connect them with relationships (edges), and explore them visually in a graph interface.

This is similar to a **lightweight Obsidian-style knowledge graph**.

---

# Tech Stack

Use the following stack:

* **Next.js (App Router)**
* **TypeScript**
* **React Flow** (graph visualization)
* **TailwindCSS**
* **shadcn/ui**
* **localStorage** for persistence

No backend is required.

---

# Architecture

Use a **feature-based architecture**.

Each feature should contain its own:

* components
* hooks
* types
* utilities

Use **kebab-case file naming**.

Example:

```
graph-canvas.tsx
node-sidebar.tsx
use-graph-store.ts
graph-storage.ts
```

---

# Suggested Project Structure

```
/app
  page.tsx

/features
  /graph
    components
      graph-canvas.tsx
      graph-node.tsx
      graph-controls.tsx
    hooks
      use-graph-store.ts
      use-graph-layout.ts
    lib
      graph-storage.ts
      graph-layout.ts
    types
      graph-types.ts
    data
      seed-data.ts

  /node
    components
      node-sidebar.tsx
      add-node-dialog.tsx
      edit-node-form.tsx

/shared
  components
    app-header.tsx
  lib
    utils.ts
```

---

# Data Models

Define strong TypeScript types.

## Node

```ts
export type GraphNodeData = {
  id: string
  title: string
  note?: string
}
```

## Edge

```ts
export type GraphEdgeData = {
  id: string
  source: string
  target: string
  label: string
}
```

---

# Core Features

## Graph View

Render the graph using **React Flow**.

Requirements:

* Nodes display their **title**
* Edges display a **relationship label**
* Nodes must **not overlap on first load**
* Use **dagre layout** for automatic positioning
* Nodes should be **draggable**

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

Implement the following enhancements:

* Allow **dragging nodes**
* Persist node positions
* Highlight connected nodes when a node is selected
* Dim unrelated nodes

Optional improvements:

* Edge animation
* Node entry animation
* React Flow mini-map
* Zoom controls

---

# Code Quality Requirements

* Fully typed **TypeScript**
* No `any`
* Small focused components
* Proper React hooks usage
* Predictable state management
* Clean folder structure
* Follow **React Flow best practices**

---

# Final Result

The final application should allow users to:

* create notes
* connect notes with labeled relationships
* edit notes
* explore the graph visually

The graph state should persist across page refresh using **localStorage**.
