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

// SVG text helpers

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Word-wraps text into lines of at most `maxChars` characters. */
function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      if (word.length > maxChars) {
        let rem = word;
        while (rem.length > maxChars) {
          lines.push(rem.slice(0, maxChars));
          rem = rem.slice(maxChars);
        }
        current = rem;
      } else {
        current = word;
      }
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

export type NodeBackgroundResult = { dataUri: string; height: number };

/**
 * Builds a base64 SVG data URI + computed height for a Cytoscape node.
 * Renders an accent header strip, a bold title, and an optional lighter note.
 * Node height grows dynamically to fit all wrapped text.
 */
export function buildNodeBackgroundImage(
  accentColor: string,
  textColor: string,
  title: string,
  note?: string
): NodeBackgroundResult {
  const TITLE_LINE_H = 16; // 12px font + 4px leading
  const NOTE_LINE_H = 14;  // 10px font + 4px leading
  const HEADER_H = 22;
  const GAP = 8;           // gap between header and first text line
  const NOTE_GAP = 4;      // gap between title block and note block
  const BOTTOM_PAD = 8;

  // ~24 chars/line for 12px title, ~28 chars/line for 10px note (180px usable width)
  const titleLines = wrapText(title, 24);
  const noteLines = note?.trim() ? wrapText(note, 28) : [];

  const height = Math.max(
    80,
    HEADER_H +
      GAP +
      titleLines.length * TITLE_LINE_H +
      (noteLines.length > 0 ? NOTE_GAP + noteLines.length * NOTE_LINE_H : 0) +
      BOTTOM_PAD
  );

  // Header strip: rounded-top via two overlapping rects
  const strip = [
    `<rect x='0' y='0' width='200' height='22' rx='8' ry='8' fill='${accentColor}' fill-opacity='0.22'/>`,
    `<rect x='0' y='14' width='200' height='8' fill='${accentColor}' fill-opacity='0.22'/>`,
  ].join("");

  // Title: bold 700, 12px, white
  const titleSvg = titleLines
    .map((line, i) => {
      const y = HEADER_H + GAP + 12 + i * TITLE_LINE_H;
      return [
        `<text x='100' y='${y}' text-anchor='middle'`,
        ` font-family='Inter,system-ui,sans-serif' font-size='12' font-weight='700'`,
        ` fill='#ffffff'>${escapeXml(line)}</text>`,
      ].join("");
    })
    .join("");

  // Note: regular 400, 10px, muted accent colour
  const noteSvg = noteLines
    .map((line, i) => {
      const y =
        HEADER_H + GAP + titleLines.length * TITLE_LINE_H + NOTE_GAP + 10 + i * NOTE_LINE_H;
      return [
        `<text x='100' y='${y}' text-anchor='middle'`,
        ` font-family='Inter,system-ui,sans-serif' font-size='10' font-weight='400'`,
        ` fill='${textColor}' fill-opacity='0.8'>${escapeXml(line)}</text>`,
      ].join("");
    })
    .join("");

  const svg = [
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='${height}'>`,
    strip,
    titleSvg,
    noteSvg,
    `</svg>`,
  ].join("");

  return {
    dataUri: `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`,
    height,
  };
}
