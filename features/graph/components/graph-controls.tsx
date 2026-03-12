"use client";

import { Plus, Link } from "lucide-react";
import { Button } from "@/components/ui/button";

type GraphControlsProps = {
  onAddNode: () => void;
  onAddEdge: () => void;
};

export function GraphControls({
  onAddNode,
  onAddEdge,
}: GraphControlsProps) {
  return (
    <div className="absolute bottom-5 left-5 z-10 flex gap-2">
      <Button
        size="sm"
        onClick={onAddNode}
        className="rounded-lg bg-indigo-600 px-3.5 text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500"
      >
        <Plus className="mr-1.5 h-4 w-4" />
        Node
      </Button>
      <Button
        size="sm"
        onClick={onAddEdge}
        className="rounded-lg bg-slate-700/80 px-3.5 text-slate-200 shadow-lg shadow-black/20 backdrop-blur-sm hover:bg-slate-600/80"
      >
        <Link className="mr-1.5 h-4 w-4" />
        Edge
      </Button>
    </div>
  );
}
