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
import { Textarea } from "@/components/ui/textarea";

type AddNodeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (title: string, note?: string) => void;
};

export function AddNodeDialog({ open, onOpenChange, onAdd }: AddNodeDialogProps) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), note.trim() || undefined);
    setTitle("");
    setNote("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/[0.08] bg-[#0f1729] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Node</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. GraphQL"
              autoFocus
              className="border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/40"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Note (optional)</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a description..."
              className="min-h-20 resize-none border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/40"
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
              disabled={!title.trim()}
              className="bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40"
            >
              Add Node
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
