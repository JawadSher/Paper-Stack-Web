"use server";

import type { Board } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ActionResult, BoardFilters } from "@/src/types/action-types";
import { fail, ok } from "@/src/types/action-types";

export async function getBoards(
  filters: BoardFilters = {},
): Promise<ActionResult<Board[]>> {
  try {
    const boards = await prisma.board.findMany({
      where: {
        isActive: true,
        ...(filters.province && { province: filters.province }),
        ...(filters.search && {
          OR: [
            { name: { contains: filters.search, mode: "insensitive" } },
            { shortName: { contains: filters.search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });

    return ok(boards);
  } catch (e) {
    return fail(`Failed to fetch boards: ${e}`);
  }
}

export async function getBoardsByProvince(): Promise<
  ActionResult<Record<string, Board[]>>
> {
  try {
    const boards = await prisma.board.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });

    const grouped = boards.reduce<Record<string, Board[]>>((acc, board) => {
      const key = board.province;
      acc[key] ??= [];
      acc[key].push(board);
      return acc;
    }, {});

    return ok(grouped);
  } catch (e) {
    return fail(`Failed to group boards: ${e}`);
  }
}

export async function getBoardById(
  id: string,
): Promise<ActionResult<Board | null>> {
  try {
    const board = await prisma.board.findUnique({ where: { id } });
    return ok(board);
  } catch (e) {
    return fail(`Failed to fetch board: ${e}`);
  }
}
