import { boards } from "@/constants/boards";
import { subjects } from "@/constants/subjects";
import type { ClassLevel, Paper } from "@/types";

const years = [2024, 2023, 2022, 2021, 2020, 2019];
const sessions: Array<NonNullable<Paper["session"]>> = [
  "annual",
  "supplementary",
];

export const mockPapers: Paper[] = boards.flatMap((board) =>
  ([9, 10, 11, 12] as ClassLevel[]).flatMap((classLevel) =>
    subjects
      .filter((subject) => subject.classLevel === classLevel)
      .slice(0, 8)
      .flatMap((subject) =>
        years.map((year, index) => {
          const session = sessions[index % sessions.length];

          return {
            id: `${board.id}-${classLevel}-${subject.id}-${year}-${session}`,
            title: `${subject.name} ${year} ${session === "annual" ? "Annual" : "Supplementary"} Paper`,
            boardId: board.id,
            subjectId: subject.id,
            classLevel,
            year,
            session,
            pdfUrl: "/sample-paper.pdf",
            thumbnailUrl: undefined,
            fileSizeBytes: 1_800_000 + index * 120_000,
            createdAt: `${year}-08-01T00:00:00.000Z`,
            updatedAt: `${year}-08-01T00:00:00.000Z`,
          } satisfies Paper;
        }),
      ),
  ),
);

export function getPaperContext(paper: Paper) {
  return {
    paper,
    board: boards.find((board) => board.id === paper.boardId),
    subject: subjects.find((subject) => subject.id === paper.subjectId),
  };
}
