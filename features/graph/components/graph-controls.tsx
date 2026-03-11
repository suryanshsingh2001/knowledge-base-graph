"use client";

import { Plus, Link, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type GraphControlsProps = {
  onAddNode: () => void;
  onAddEdge: () => void;
  onResetLayout: () => void;
};

export function GraphControls({
  onAddNode,
  onAddEdge,
  onResetLayout,
}: GraphControlsProps) {
  return (
    <div className="absolute bottom-4 left-4 z-10 flex gap-2">
      <Button
        size="sm"
        variant="secondary"
        onClick={onAddNode}
        className="shadow-sm"
      >
        <Plus className="mr-1.5 h-4 w-4" />
        Add Node
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={onAddEdge}
        className="shadow-sm"
      >
        <Link className="mr-1.5 h-4 w-4" />
        Add Edge
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={onResetLayout}
        className="shadow-sm"
      >
        <RotateCcw className="mr-1.5 h-4 w-4" />
        Re-layout
      </Button>
    </div>
  );
}
