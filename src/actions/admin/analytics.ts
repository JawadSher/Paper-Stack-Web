"use server";

import { prisma } from "@/lib/prisma";
import type {
  ActionResult,
  BoardChartData,
  ChartDataPoint,
  DashboardStats,
  DateRange,
} from "@/src/types/action-types";
import { fail, ok } from "@/src/types/action-types";
import { actionError, requireAdmin } from "./_helpers";

const rangeDays: Record<DateRange, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "1y": 365,
};

export async function getDashboardStats(): Promise<
  ActionResult<DashboardStats>
> {
  try {
    await requireAdmin();
    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalPapers,
      totalBoards,
      totalSubjects,
      totalQuestions,
      livePapers,
      draftPapers,
      newPapersThisMonth,
      viewSum,
      downloadSum,
      topSubjectResult,
    ] = await Promise.all([
      prisma.paper.count(),
      prisma.board.count(),
      prisma.subject.count(),
      prisma.commonQuestion.count(),
      prisma.paper.count({ where: { status: "LIVE" } }),
      prisma.paper.count({ where: { status: "DRAFT" } }),
      prisma.paper.count({ where: { publishedAt: { gte: firstDayThisMonth } } }),
      prisma.paperAnalytic.aggregate({
        _sum: { count: true },
        where: { eventType: "view" },
      }),
      prisma.paperAnalytic.aggregate({
        _sum: { count: true },
        where: { eventType: "download" },
      }),
      prisma.paperAnalytic.groupBy({
        by: ["subjectId"],
        _sum: { count: true },
        orderBy: { _sum: { count: "desc" } },
        take: 1,
        where: { eventType: "view", subjectId: { not: null } },
      }),
    ]);

    let topSubject: string | null = null;
    if (topSubjectResult[0]?.subjectId) {
      const subject = await prisma.subject.findUnique({
        where: { id: topSubjectResult[0].subjectId },
        select: { name: true },
      });
      topSubject = subject?.name ?? null;
    }

    return ok({
      totalPapers,
      totalBoards,
      totalSubjects,
      totalQuestions,
      livepapers: livePapers,
      draftPapers,
      newPapersThisMonth,
      totalViews: viewSum._sum.count ?? 0,
      totalDownloads: downloadSum._sum.count ?? 0,
      topSubject,
      storageUsedBytes: 0,
    });
  } catch (e) {
    return fail(await actionError(e));
  }
}

export async function getChartData(range: DateRange): Promise<
  ActionResult<{ viewsData: ChartDataPoint[]; boardData: BoardChartData[] }>
> {
  try {
    await requireAdmin();
    const rangeStart = new Date();
    rangeStart.setDate(rangeStart.getDate() - rangeDays[range]);
    rangeStart.setHours(0, 0, 0, 0);

    const [analyticsRows, paperCounts] = await Promise.all([
      prisma.paperAnalytic.groupBy({
        by: ["eventDate", "eventType"],
        _sum: { count: true },
        where: { eventDate: { gte: rangeStart } },
        orderBy: { eventDate: "asc" },
      }),
      prisma.paper.groupBy({
        by: ["boardId"],
        _count: { id: true },
      }),
    ]);

    const chartMap = new Map<string, ChartDataPoint>();
    for (const row of analyticsRows) {
      const date = row.eventDate.toISOString().slice(0, 10);
      const point =
        chartMap.get(date) ?? { date, views: 0, downloads: 0 };
      if (row.eventType === "view") {
        point.views = row._sum.count ?? 0;
      } else {
        point.downloads = row._sum.count ?? 0;
      }
      chartMap.set(date, point);
    }

    const boards = await prisma.board.findMany({
      where: { id: { in: paperCounts.map((row) => row.boardId) } },
      select: { id: true, name: true, shortName: true },
    });
    const boardsById = new Map(boards.map((board) => [board.id, board]));
    const boardData = paperCounts
      .map((row) => {
        const board = boardsById.get(row.boardId);

        return {
          boardName: board?.name ?? "Unknown",
          boardShortName: board?.shortName ?? "Unknown",
          paperCount: row._count.id,
        };
      })
      .sort((a, b) => b.paperCount - a.paperCount);

    return ok({
      viewsData: Array.from(chartMap.values()),
      boardData,
    });
  } catch (e) {
    return fail(await actionError(e));
  }
}
