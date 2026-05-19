import { boards } from "@/constants/boards";
import type { AdminBoard } from "@/components/admin/boards/types";

export const adminBoards: AdminBoard[] = boards.map((board, index) => ({
  ...board,
  websiteUrl: `https://${board.id}.edu.pk`,
  status: index % 7 === 0 ? "inactive" : "active",
}));
