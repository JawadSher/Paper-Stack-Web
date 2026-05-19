import type { Board } from "@/types";

export type BoardStatus = "active" | "inactive";

export type AdminBoard = Board & {
  websiteUrl?: string;
  status: BoardStatus;
};
