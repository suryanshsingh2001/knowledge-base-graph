"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import type { GraphNode } from "../types/graph-types";

function GraphNodeComponent({ data, selected }: NodeProps<GraphNode>) {
  return (
    <div
      className={cn(
        "group relative rounded-xl border bg-card px-4 py-3 shadow-sm transition-all duration-200",
        "hover:shadow-md hover:border-primary/40",
        selected
          ? "border-primary shadow-md ring-2 ring-primary/20 node-selected-glow"
          : "border-border"
      )}
      style={{ minWidth: 160, maxWidth: 220 }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="h-2! w-2! rounded-full! border-2! border-primary! bg-background!"
      />
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold leading-tight text-foreground">
          {data.title}
        </span>
        {data.note && (
          <span className="text-xs text-muted-foreground line-clamp-2 leading-snug">
            {data.note}
          </span>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="h-2! w-2! rounded-full! border-2! border-primary! bg-background!"
      />
    </div>
  );
}

export default memo(GraphNodeComponent);
