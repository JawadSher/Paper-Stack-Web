"use server";

import type { AnalyticEvent, Platform } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/src/types/action-types";
import { fail, ok } from "@/src/types/action-types";

function todayDateOnly() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

async function trackPaperEvent(
  paperId: string,
  platform: Platform,
  eventType: AnalyticEvent,
): Promise<ActionResult<void>> {
  try {
    const paper = await prisma.paper.findUnique({
      where: { id: paperId },
      select: {
        id: true,
        boardId: true,
        subjectId: true,
        classLevel: true,
        year: true,
      },
    });

    if (!paper) {
      return fail("Failed to track paper event: paper not found");
    }

    const eventDate = todayDateOnly();
    const counterField =
      eventType === "view" ? "viewCount" : "downloadCount";

    await Promise.all([
      prisma.paperAnalytic.upsert({
        where: {
          paperId_eventType_platform_eventDate: {
            paperId,
            eventType,
            platform,
            eventDate,
          },
        },
        update: { count: { increment: 1 } },
        create: {
          paperId,
          eventType,
          platform,
          boardId: paper.boardId,
          subjectId: paper.subjectId,
          classLevel: paper.classLevel,
          year: paper.year,
          eventDate,
          count: 1,
        },
      }),
      prisma.paper.update({
        where: { id: paperId },
        data: { [counterField]: { increment: 1 } },
      }),
    ]);

    return ok(undefined);
  } catch (e) {
    return fail(`Failed to track paper event: ${e}`);
  }
}

export async function trackPaperView(
  paperId: string,
  platform: "web" | "mobile",
): Promise<ActionResult<void>> {
  return trackPaperEvent(paperId, platform, "view");
}

export async function trackPaperDownload(
  paperId: string,
  platform: "web" | "mobile",
): Promise<ActionResult<void>> {
  return trackPaperEvent(paperId, platform, "download");
}
