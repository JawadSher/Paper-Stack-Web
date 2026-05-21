"use server";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  ActionResult,
  PaginatedResponse,
  PaperFilters,
  PaperWithRelations,
  SearchFilters,
} from "@/src/types/action-types";
import { fail, ok } from "@/src/types/action-types";

const paperRelationSelect = {
  board: {
    select: {
      id: true,
      name: true,
      shortName: true,
      province: true,
      color: true,
    },
  },
  subject: {
    select: {
      id: true,
      name: true,
      icon: true,
    },
  },
} satisfies Prisma.PaperInclude;

function buildPaperWhere(filters: PaperFilters = {}): Prisma.PaperWhereInput {
  return {
    status: "LIVE",
    ...(filters.boardId && { boardId: filters.boardId }),
    ...(filters.subjectId && { subjectId: filters.subjectId }),
    ...(filters.classLevel && { classLevel: filters.classLevel }),
    ...(filters.year && { year: filters.year }),
    ...(filters.session && { session: filters.session }),
  };
}

function toPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedResponse<T> {
  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getPapers(
  filters: PaperFilters = {},
  page = 1,
  pageSize = 20,
): Promise<ActionResult<PaginatedResponse<PaperWithRelations>>> {
  try {
    const where = buildPaperWhere(filters);
    const skip = (page - 1) * pageSize;

    const [papers, total] = await Promise.all([
      prisma.paper.findMany({
        where,
        include: paperRelationSelect,
        orderBy: [{ year: "desc" }, { session: "asc" }],
        skip,
        take: pageSize,
      }),
      prisma.paper.count({ where }),
    ]);

    return ok(toPaginatedResponse(papers, total, page, pageSize));
  } catch (e) {
    return fail(`Failed to fetch papers: ${e}`);
  }
}

export async function getPapersBySubject(
  boardId: string,
  subjectId: string,
  classLevel: number,
  yearFilter?: number,
  sessionFilter?: PaperFilters["session"],
): Promise<ActionResult<PaperWithRelations[]>> {
  try {
    const papers = await prisma.paper.findMany({
      where: buildPaperWhere({
        boardId,
        subjectId,
        classLevel,
        year: yearFilter,
        session: sessionFilter,
      }),
      include: paperRelationSelect,
      orderBy: [{ year: "desc" }, { session: "asc" }],
    });

    return ok(papers);
  } catch (e) {
    return fail(`Failed to fetch papers by subject: ${e}`);
  }
}

export async function getPaperById(
  id: string,
): Promise<ActionResult<PaperWithRelations | null>> {
  try {
    const paper = await prisma.paper.findUnique({
      where: { id },
      include: { board: true, subject: true },
    });

    if (paper) {
      prisma.paper
        .update({
          where: { id },
          data: { viewCount: { increment: 1 } },
        })
        .catch((error) => {
          console.error("Failed to increment paper view count", error);
        });
    }

    return ok(paper);
  } catch (e) {
    return fail(`Failed to fetch paper: ${e}`);
  }
}

export async function searchPapers(
  query: string,
  filters: SearchFilters = {},
  page = 1,
  pageSize = 20,
): Promise<ActionResult<PaginatedResponse<PaperWithRelations>>> {
  try {
    const where: Prisma.PaperWhereInput = {
      status: "LIVE",
      ...(filters.boardId && { boardId: filters.boardId }),
      ...(filters.classLevel && { classLevel: filters.classLevel }),
      ...(filters.year && { year: filters.year }),
      ...(filters.session && { session: filters.session }),
      ...(query.trim() && {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { subject: { name: { contains: query, mode: "insensitive" } } },
          { board: { shortName: { contains: query, mode: "insensitive" } } },
        ],
      }),
    };
    const skip = (page - 1) * pageSize;

    const [papers, total] = await Promise.all([
      prisma.paper.findMany({
        where,
        include: paperRelationSelect,
        orderBy: [{ year: "desc" }, { session: "asc" }],
        skip,
        take: pageSize,
      }),
      prisma.paper.count({ where }),
    ]);

    return ok(toPaginatedResponse(papers, total, page, pageSize));
  } catch (e) {
    return fail(`Failed to search papers: ${e}`);
  }
}
