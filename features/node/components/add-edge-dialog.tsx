"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GraphNode } from "../../graph/types/graph-types";

type AddEdgeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodes: GraphNode[];
  onAdd: (source: string, target: string, label: string) => void;
};

export function AddEdgeDialog({
  open,
  onOpenChange,
  nodes,
  onAdd,
}: AddEdgeDialogProps) {
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [label, setLabel] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !target || !label.trim() || source === target) return;
    onAdd(source, target, label.trim());
    setSource("");
    setTarget("");
    setLabel("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Connection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">From</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Select a node...</option>
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.data.title}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">To</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Select a node...</option>
              {nodes
                .filter((n) => n.id !== source)
                .map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.data.title}
                  </option>
                ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Relationship Label</label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. depends on"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!source || !target || !label.trim() || source === target}
            >
              Add Edge
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
