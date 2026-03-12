"use client";

import { useEffect, useRef, useCallback } from "react";
import type { Core } from "cytoscape";

type GraphMinimapProps = {
  cy: Core | null;
};

export function GraphMinimap({ cy }: GraphMinimapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const draw = useCallback(() => {
    if (!cy || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, width, height);

    if (cy.nodes().length === 0) return;

    // Get the bounding box of all elements
    const bb = cy.elements().boundingBox();
    if (bb.w === 0 || bb.h === 0) return;

    const padding = 16;
    const scale = Math.min(
      (width - padding * 2) / bb.w,
      (height - padding * 2) / bb.h
    );
    const offsetX = (width - bb.w * scale) / 2 - bb.x1 * scale;
    const offsetY = (height - bb.h * scale) / 2 - bb.y1 * scale;

    // Draw edges
    cy.edges().forEach((edge) => {
      const src = edge.source().position();
      const tgt = edge.target().position();
      ctx.strokeStyle = edge.hasClass("dimmed")
        ? "rgba(100, 116, 139, 0.08)"
        : "rgba(100, 116, 139, 0.35)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(src.x * scale + offsetX, src.y * scale + offsetY);
      ctx.lineTo(tgt.x * scale + offsetX, tgt.y * scale + offsetY);
      ctx.stroke();
    });

    // Draw nodes
    cy.nodes().forEach((node) => {
      const pos = node.position();
      const x = pos.x * scale + offsetX;
      const y = pos.y * scale + offsetY;
      const borderColor = node.data("borderColor") || "#3b82f6";
      const isDimmed = node.hasClass("dimmed");
      const isSelected = node.hasClass("selected");

      ctx.globalAlpha = isDimmed ? 0.12 : 0.9;
      ctx.fillStyle = borderColor;
      ctx.beginPath();
      ctx.arc(x, y, isSelected ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Glow for selected
      if (isSelected) {
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    });

    // Draw viewport rectangle
    const ext = cy.extent();
    const vx = ext.x1 * scale + offsetX;
    const vy = ext.y1 * scale + offsetY;
    const vw = ext.w * scale;
    const vh = ext.h * scale;

    ctx.strokeStyle = "rgba(129, 140, 248, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(vx, vy, vw, vh);
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(129, 140, 248, 0.04)";
    ctx.fillRect(vx, vy, vw, vh);
  }, [cy]);

  // Click on minimap to pan
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!cy || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (cy.nodes().length === 0) return;
      const bb = cy.elements().boundingBox();
      if (bb.w === 0 || bb.h === 0) return;

      const padding = 16;
      const scale = Math.min(
        (width - padding * 2) / bb.w,
        (height - padding * 2) / bb.h
      );
      const offsetX = (width - bb.w * scale) / 2 - bb.x1 * scale;
      const offsetY = (height - bb.h * scale) / 2 - bb.y1 * scale;

      // Convert click to graph coordinates
      const graphX = (clickX - offsetX) / scale;
      const graphY = (clickY - offsetY) / scale;

      cy.animate({
        center: { eles: cy.collection() },
        pan: {
          x: cy.width() / 2 - graphX * cy.zoom(),
          y: cy.height() / 2 - graphY * cy.zoom(),
        },
        duration: 200,
        easing: "ease-out",
      });
    },
    [cy]
  );

  useEffect(() => {
    if (!cy) return;

    const handler = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    };

    cy.on("render viewport", handler);
    // Initial draw after a short delay to ensure elements are positioned
    const timeout = setTimeout(handler, 100);

    return () => {
      cy.off("render viewport", handler);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timeout);
    };
  }, [cy, draw]);

  return (
    <div className="absolute bottom-4 right-4 z-10 hidden overflow-hidden rounded-xl border border-slate-700/40 bg-[#0a1020]/85 shadow-2xl shadow-black/40 backdrop-blur-md sm:block">
      <div className="flex items-center gap-1.5 border-b border-slate-700/30 px-2.5 py-1">
        <div className="h-1.5 w-1.5 rounded-full bg-indigo-400/60" />
        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
          Minimap
        </span>
      </div>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className="block cursor-crosshair"
        style={{ width: 200, height: 140 }}
      />
    </div>
  );
}
