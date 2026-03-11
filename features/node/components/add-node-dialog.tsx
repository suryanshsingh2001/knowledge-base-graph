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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Node</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. GraphQL"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Note (optional)</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a description..."
              className="min-h-20 resize-none"
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
            <Button type="submit" disabled={!title.trim()}>
              Add Node
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
