"use client";

import { Share2, Circle, Plus, Link } from "lucide-react";
import { Button } from "@/components/ui/button";

type AppHeaderProps = {
  nodeCount?: number;
  edgeCount?: number;
  onAddNode?: () => void;
  onAddEdge?: () => void;
};

export function AppHeader({ nodeCount = 0, edgeCount = 0, onAddNode, onAddEdge }: AppHeaderProps) {
  return (
    <header className="flex h-12 items-center justify-between border-b border-white/[0.06] bg-[#0c1222] px-3 sm:h-14 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 sm:h-9 sm:w-9 sm:rounded-xl">
          <Share2 className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
        </div>
        <div>
          <h1 className="text-xs font-bold leading-none tracking-tight text-white sm:text-sm">
            Knowledge Graph
          </h1>
          <div className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-400 sm:mt-1 sm:gap-3 sm:text-[11px]">
            <span className="flex items-center gap-1">
              <Circle className="h-1.5 w-1.5 fill-emerald-400 text-emerald-400" />
              {nodeCount} <span className="hidden sm:inline">nodes</span>
            </span>
            <span className="flex items-center gap-1">
              <Circle className="h-1.5 w-1.5 fill-blue-400 text-blue-400" />
              {edgeCount} <span className="hidden sm:inline">edges</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <Button
          size="sm"
          onClick={onAddNode}
          className="h-8 rounded-lg bg-indigo-600 px-2.5 text-xs text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 sm:px-3.5 sm:text-sm"
        >
          <Plus className="h-4 w-4 sm:mr-1.5" />
          <span className="hidden sm:inline">Add Node</span>
        </Button>
        <Button
          size="sm"
          onClick={onAddEdge}
          className="h-8 rounded-lg bg-slate-700/80 px-2.5 text-xs text-slate-200 shadow-lg shadow-black/20 backdrop-blur-sm hover:bg-slate-600/80 sm:px-3.5 sm:text-sm"
        >
          <Link className="h-4 w-4 sm:mr-1.5" />
          <span className="hidden sm:inline">Add Edge</span>
        </Button>
      </div>
    </header>
  );
}
