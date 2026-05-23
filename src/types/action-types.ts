import type {
  Board,
  Paper,
  PaperStatus,
  Province,
  Session,
  Subject,
} from "@prisma/client";

export type BoardFilters = {
  province?: Province;
  isActive?: boolean;
  search?: string;
};

export type AdminBoardFilters = BoardFilters & {
  page?: number;
  pageSize?: number;
};

export type PaperFilters = {
  boardId?: string;
  subjectId?: string;
  classLevel?: number;
  year?: number;
  session?: Session;
  status?: PaperStatus;
};

export type AdminPaperFilters = PaperFilters & {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: "createdAt" | "year" | "viewCount" | "downloadCount";
  sortOrder?: "asc" | "desc";
};

export type SearchFilters = {
  boardId?: string;
  classLevel?: number;
  year?: number;
  session?: Session;
};

export type QuestionFilters = {
  subjectId?: string;
  boardId?: string;
  classLevel?: number;
  minFrequency?: 2 | 3 | 4 | 5;
  chapterId?: string;
};

export type DateRange = "7d" | "30d" | "90d" | "1y";

export type AuditFilters = {
  entityType?: string;
  adminUserId?: string;
  action?: "create" | "update" | "delete";
  page?: number;
  pageSize?: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export function ok<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

export function fail(error: string): ActionResult<never> {
  return { success: false, error };
}

export type PaperWithRelations = Paper & {
  board: Pick<Board, "id" | "name" | "shortName" | "province" | "classes" | "color">;
  subject: Pick<Subject, "id" | "name" | "icon">;
};

export type DashboardStats = {
  totalPapers: number;
  totalBoards: number;
  totalSubjects: number;
  totalQuestions: number;
  livepapers: number;
  draftPapers: number;
  newPapersThisMonth: number;
  totalViews: number;
  totalDownloads: number;
  topSubject: string | null;
  storageUsedBytes: number;
};

export type ChartDataPoint = {
  date: string;
  views: number;
  downloads: number;
};

export type BoardChartData = {
  boardName: string;
  boardShortName: string;
  paperCount: number;
};
