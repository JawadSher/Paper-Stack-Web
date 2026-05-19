import { notFound } from "next/navigation";
import { PaperViewerClient } from "@/components/public/viewer/PaperViewerClient";
import { boards } from "@/constants/boards";
import { mockPapers } from "@/constants/papers";
import { subjects } from "@/constants/subjects";

export type PaperViewerPageProps = {
  params: Promise<{ paperId: string }>;
};

export default async function PaperViewerPage({ params }: PaperViewerPageProps) {
  const { paperId } = await params;
  const paper = mockPapers.find((item) => item.id === paperId);
  if (!paper) notFound();

  const board = boards.find((item) => item.id === paper.boardId);
  const subject = subjects.find((item) => item.id === paper.subjectId);
  if (!board || !subject) notFound();

  const relatedPapers = mockPapers
    .filter((item) => item.id !== paper.id && item.boardId === board.id && item.subjectId === subject.id)
    .slice(0, 3);

  return (
    <PaperViewerClient
      paper={paper}
      board={board}
      subject={subject}
      relatedPapers={relatedPapers}
    />
  );
}
