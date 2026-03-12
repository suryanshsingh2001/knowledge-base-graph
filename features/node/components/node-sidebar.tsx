"use client";

import { X, Trash2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import type { GraphNode, GraphEdge } from "../../graph/types/graph-types";

type NodeSidebarProps = {
  node: GraphNode | null;
  edges: GraphEdge[];
  allNodes: GraphNode[];
  onClose: () => void;
  onUpdate: (id: string, data: { title?: string; note?: string }) => void;
  onDelete: (id: string) => void;
  onDeleteEdge: (id: string) => void;
  isMobile?: boolean;
};

export function NodeSidebar({
  node,
  edges,
  allNodes,
  onClose,
  onUpdate,
  onDelete,
  onDeleteEdge,
  isMobile = false,
}: NodeSidebarProps) {
  if (!node) {
    if (isMobile) return null;
    return (
      <div className="flex h-full w-80 flex-col border-l border-white/[0.06] bg-[#0c1222]">
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04]">
            <Link2 className="h-5 w-5 text-slate-500" />
          </div>
          <p className="text-center text-sm text-slate-400">
            Click a node to view details
          </p>
          <p className="text-center text-[11px] text-slate-500">
            Select any node on the graph to edit its title, note, and connections.
          </p>
        </div>
      </div>
    );
  }

  const connectedEdges = edges.filter(
    (e) => e.source === node.id || e.target === node.id
  );

  const getNodeTitle = (id: string) =>
    allNodes.find((n) => n.id === id)?.data.title ?? id;

  return (
    <div className={isMobile ? "flex flex-col bg-[#0c1222]" : "flex h-full w-80 flex-col border-l border-white/[0.06] bg-[#0c1222]"}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 sm:px-5 sm:py-4">
        <div>
          <h3 className="text-sm font-bold text-white">Node Details</h3>
          <p className="mt-0.5 text-[11px] text-slate-400">
            Edit properties and connections
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7 text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 sm:gap-5 sm:p-5">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Title
          </label>
          <Input
            value={node.data.title}
            onChange={(e) => onUpdate(node.id, { title: e.target.value })}
            className="h-10 border-white/10 bg-white/5 text-sm font-semibold text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/40"
          />
        </div>

        {/* Note */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Note
          </label>
          <Textarea
            value={node.data.note ?? ""}
            onChange={(e) => onUpdate(node.id, { note: e.target.value })}
            placeholder="Write a note..."
            className="min-h-28 resize-none border-white/10 bg-white/5 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:ring-indigo-500/40"
          />
        </div>

        <Separator className="bg-white/[0.06]" />

        {/* Connected Edges */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Link2 className="h-3.5 w-3.5 text-slate-400" />
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Connections ({connectedEdges.length})
            </label>
          </div>
          {connectedEdges.length === 0 && (
            <p className="rounded-lg border border-dashed border-white/10 py-4 text-center text-xs text-slate-500">
              No connections yet
            </p>
          )}
          <div className="space-y-1.5">
            {connectedEdges.map((edge) => (
              <div
                key={edge.id}
                className="group flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 transition-colors hover:bg-white/[0.06]"
              >
                <span className="text-xs text-slate-200">
                  {edge.source === node.id
                    ? `\u2192 ${getNodeTitle(edge.target)}`
                    : `\u2190 ${getNodeTitle(edge.source)}`}
                  <span className="ml-1.5 text-indigo-400/80">
                    {edge.label}
                  </span>
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-slate-500 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                  onClick={() => onDeleteEdge(edge.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.06] p-3 sm:p-4">
        <Button
          variant="destructive"
          size="sm"
          className="w-full bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
          onClick={() => onDelete(node.id)}
        >
          <Trash2 className="mr-1.5 h-4 w-4" />
          Delete Node
        </Button>
      </div>
    </div>
  );
}
