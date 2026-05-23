import { mockPapers } from "@/constants/papers";
import type { Board, Paper, Subject } from "@/types";

export type PaperStatus = "live" | "draft" | "processing";

export type AdminPaper = Paper & {
  status: PaperStatus;
  fileName: string;
  board?: Board;
  subject?: Subject;
};

const statuses: PaperStatus[] = ["live", "draft", "processing"];

export const adminPapers: AdminPaper[] = mockPapers.map((paper, index) => ({
  ...paper,
  status: statuses[index % statuses.length],
  fileName: `${paper.id}.pdf`,
}));

export function formatFileSize(bytes?: number | bigint | string | null) {
  if (bytes === null || bytes === undefined || bytes === "") return "Unknown";

  const value = Number(bytes);
  if (!Number.isFinite(value) || value < 0) return "Unknown";
  if (value === 0) return "0 bytes";
  if (value < 1024) return `${value.toLocaleString()} bytes`;

  const units = ["KB", "MB", "GB", "TB"];
  let size = value / 1024;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  const precision = size >= 10 ? 1 : 2;
  return `${size.toFixed(precision)} ${units[unitIndex]}`;
}

export function formatRelativeDate(date: string) {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "1 month ago";
  if (diffMonths < 12) return `${diffMonths} months ago`;

  const diffYears = Math.floor(diffMonths / 12);
  return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
}
