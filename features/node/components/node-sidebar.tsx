"use client";

import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import type { GraphNode, GraphEdge } from "../../graph/types/graph-types";

type NodeSidebarProps = {
  node: GraphNode;
  edges: GraphEdge[];
  allNodes: GraphNode[];
  onClose: () => void;
  onUpdate: (id: string, data: { title?: string; note?: string }) => void;
  onDelete: (id: string) => void;
  onDeleteEdge: (id: string) => void;
};

export function NodeSidebar({
  node,
  edges,
  allNodes,
  onClose,
  onUpdate,
  onDelete,
  onDeleteEdge,
}: NodeSidebarProps) {
  const connectedEdges = edges.filter(
    (e) => e.source === node.id || e.target === node.id
  );

  const getNodeTitle = (id: string) =>
    allNodes.find((n) => n.id === id)?.data.title ?? id;

  return (
    <div className="flex h-full w-80 flex-col border-l bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Node Details</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Title
          </label>
          <Input
            value={node.data.title}
            onChange={(e) => onUpdate(node.id, { title: e.target.value })}
            className="h-9"
          />
        </div>

        {/* Note */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Note
          </label>
          <Textarea
            value={node.data.note ?? ""}
            onChange={(e) => onUpdate(node.id, { note: e.target.value })}
            placeholder="Write a note..."
            className="min-h-30 resize-none"
          />
        </div>

        <Separator />

        {/* Connected Edges */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Connections ({connectedEdges.length})
          </label>
          {connectedEdges.length === 0 && (
            <p className="text-xs text-muted-foreground/60">
              No connections yet.
            </p>
          )}
          <div className="space-y-1.5">
            {connectedEdges.map((edge) => (
              <div
                key={edge.id}
                className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2"
              >
                <span className="text-xs text-foreground">
                  {edge.source === node.id
                    ? `→ ${getNodeTitle(edge.target)}`
                    : `← ${getNodeTitle(edge.source)}`}
                  <span className="ml-1.5 text-muted-foreground">
                    ({edge.label})
                  </span>
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
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
      <div className="border-t p-4">
        <Button
          variant="destructive"
          size="sm"
          className="w-full"
          onClick={() => onDelete(node.id)}
        >
          <Trash2 className="mr-1.5 h-4 w-4" />
          Delete Node
        </Button>
      </div>
    </div>
  );
}
