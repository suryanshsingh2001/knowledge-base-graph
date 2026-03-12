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
      <DialogContent className="border-white/[0.08] bg-[#0f1729] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Add Connection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">From</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/40"
            >
              <option value="" className="bg-[#0f1729]">Select a node...</option>
              {nodes.map((n) => (
                <option key={n.id} value={n.id} className="bg-[#0f1729]">
                  {n.data.title}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">To</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/40"
            >
              <option value="" className="bg-[#0f1729]">Select a node...</option>
              {nodes
                .filter((n) => n.id !== source)
                .map((n) => (
                  <option key={n.id} value={n.id} className="bg-[#0f1729]">
                    {n.data.title}
                  </option>
                ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Relationship Label</label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. depends on"
              className="border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/40"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-slate-400 hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!source || !target || !label.trim() || source === target}
              className="bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40"
            >
              Add Edge
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
