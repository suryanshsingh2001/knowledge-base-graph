"use client";

import { Share2 } from "lucide-react";

export function AppHeader() {
  return (
    <header className="flex h-14 items-center border-b bg-card px-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Share2 className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold leading-none tracking-tight text-foreground">
            Knowledge Graph
          </h1>
          <p className="text-[11px] text-muted-foreground">
            Personal knowledge explorer
          </p>
        </div>
      </div>
    </header>
  );
}
