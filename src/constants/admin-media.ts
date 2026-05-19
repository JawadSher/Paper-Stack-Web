import { adminPapers, formatFileSize } from "@/constants/admin-papers";
import { boards } from "@/constants/boards";
import { subjects } from "@/constants/subjects";

export type MediaFile = {
  id: string;
  name: string;
  type: "pdf" | "image";
  sizeBytes: number;
  url: string;
  uploadedAt: string;
  dimensions?: string;
  paperId?: string;
  boardId?: string;
  subjectId?: string;
  year?: number;
};

export const mediaFiles: MediaFile[] = [
  ...adminPapers.slice(0, 36).map((paper) => ({
    id: `file-${paper.id}`,
    name: paper.fileName,
    type: "pdf" as const,
    sizeBytes: paper.fileSizeBytes ?? 1_800_000,
    url: paper.pdfUrl,
    uploadedAt: paper.createdAt,
    paperId: paper.id,
    boardId: paper.boardId,
    subjectId: paper.subjectId,
    year: paper.year,
  })),
  {
    id: "image-app-icon",
    name: "paperstack-icon.png",
    type: "image",
    sizeBytes: 46_161,
    url: "/icon.png",
    uploadedAt: new Date().toISOString(),
    dimensions: "728 x 410",
  },
];

export function mediaMeta(file: MediaFile) {
  return {
    board: boards.find((board) => board.id === file.boardId),
    subject: subjects.find((subject) => subject.id === file.subjectId),
    size: formatFileSize(file.sizeBytes),
  };
}
