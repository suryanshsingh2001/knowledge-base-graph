"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import type { GraphNode } from "../types/graph-types";

function GraphNodeComponent({ data, selected }: NodeProps<GraphNode>) {
  return (
    <div
      className={cn(
        "graph-node-enter group relative rounded-xl border bg-card px-4 py-3 shadow-sm transition-all duration-200",
        "hover:shadow-md hover:border-primary/40",
        selected
          ? "border-primary shadow-lg ring-2 ring-primary/25 scale-[1.02]"
          : "border-border"
      )}
      style={{ minWidth: 150, maxWidth: 220 }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ top: -4 }}
        className="h-2.5! w-2.5! rounded-full! border-2! border-primary/60! bg-background! transition-colors! hover:border-primary! hover:bg-primary/10!"
      />
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold leading-tight text-foreground">
          {data.title}
        </span>
        {data.note && (
          <span className="text-[11px] text-muted-foreground line-clamp-2 leading-snug">
            {data.note}
          </span>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ bottom: -4 }}
        className="h-2.5! w-2.5! rounded-full! border-2! border-primary/60! bg-background! transition-colors! hover:border-primary! hover:bg-primary/10!"
      />
    </div>
  );
}

export default memo(GraphNodeComponent);
