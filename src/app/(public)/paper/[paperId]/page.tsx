"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { PaperViewerClient } from "@/components/public/viewer/PaperViewerClient";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { useTrackView } from "@/hooks/public/mutations/useTrackView";
import { useGetPaperById } from "@/hooks/public/queries/useGetPaperById";
import type { Board, ClassLevel, Paper, Subject } from "@/types";

export default function PaperViewerPage() {
  const params = useParams<{ paperId: string }>();
  const paperId = params.paperId;
  const { data, isLoading } = useGetPaperById(paperId);
  const trackView = useTrackView();

  useEffect(() => {
    if (!paperId) return;
    trackView.mutate({ paperId, platform: "web" });
    // Track once on mount for this paper id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paperId]);

  if (isLoading) return <SkeletonCard />;
  if (!data) return <p className="p-6 text-sm text-muted-foreground">Paper not found.</p>;

  const board: Board = {
    id: data.board.id,
    name: data.board.name,
    shortName: data.board.shortName,
    description: "",
    province:
      data.board.province === "Gilgit_Baltistan"
        ? "Gilgit-Baltistan"
        : data.board.province,
    classes: data.board.classes as ClassLevel[],
    color: data.board.color,
  };
  const subject: Subject = {
    id: data.subject.id,
    name: data.subject.name,
    classLevel: data.classLevel as ClassLevel,
  };
  const paper: Paper = {
    id: data.id,
    title: data.title,
    boardId: data.boardId,
    subjectId: data.subjectId,
    classLevel: data.classLevel as ClassLevel,
    year: data.year,
    session: data.session,
    pdfUrl: data.pdfUrl ?? "#",
    fileSizeBytes: data.fileSizeBytes ? Number(data.fileSizeBytes) : undefined,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };

  return (
    <PaperViewerClient
      paper={paper}
      board={board}
      subject={subject}
      relatedPapers={[]}
    />
  );
}
