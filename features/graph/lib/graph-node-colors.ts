export type NodeColorPalette = {
  bg: string;
  border: string;
  text: string;
  accent: string;
};

export const NODE_COLORS: NodeColorPalette[] = [
  { bg: "#1e293b", border: "#3b82f6", text: "#93c5fd", accent: "#3b82f6" }, // blue
  { bg: "#1a2332", border: "#8b5cf6", text: "#c4b5fd", accent: "#8b5cf6" }, // violet
  { bg: "#1c2421", border: "#10b981", text: "#6ee7b7", accent: "#10b981" }, // emerald
  { bg: "#2a1f1f", border: "#ef4444", text: "#fca5a5", accent: "#ef4444" }, // red
  { bg: "#2a2517", border: "#f59e0b", text: "#fcd34d", accent: "#f59e0b" }, // amber
  { bg: "#1f2937", border: "#06b6d4", text: "#67e8f9", accent: "#06b6d4" }, // cyan
  { bg: "#271d2d", border: "#ec4899", text: "#f9a8d4", accent: "#ec4899" }, // pink
  { bg: "#1e2a1e", border: "#84cc16", text: "#bef264", accent: "#84cc16" }, // lime
];

export function getNodeColor(index: number): NodeColorPalette {
  return NODE_COLORS[index % NODE_COLORS.length];
}
