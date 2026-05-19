import { mockPapers } from "@/constants/papers";
import type { Paper } from "@/types";

export type PaperStatus = "live" | "draft" | "processing";

export type AdminPaper = Paper & {
  status: PaperStatus;
  fileName: string;
};

const statuses: PaperStatus[] = ["live", "draft", "processing"];

export const adminPapers: AdminPaper[] = mockPapers.map((paper, index) => ({
  ...paper,
  status: statuses[index % statuses.length],
  fileName: `${paper.id}.pdf`,
}));

export function formatFileSize(bytes?: number) {
  if (!bytes) return "Unknown";

  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
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
