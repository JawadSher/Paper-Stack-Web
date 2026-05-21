import type {
  AdminBoardFilters,
  AdminPaperFilters,
  AuditFilters,
  BoardFilters,
  DateRange,
  PaperFilters,
  QuestionFilters,
  SearchFilters,
} from "@/src/types/action-types";

export const queryKeys = {
  boards: {
    all: () => ["boards"] as const,
    lists: () => ["boards", "list"] as const,
    list: (filters: BoardFilters) => ["boards", "list", filters] as const,
    byProvince: () => ["boards", "by-province"] as const,
    detail: (id: string) => ["boards", "detail", id] as const,
    admin: (filters: AdminBoardFilters) => ["boards", "admin", filters] as const,
  },
  subjects: {
    all: () => ["subjects"] as const,
    list: () => ["subjects", "list"] as const,
    byBoardClass: (boardId: string, classLevel: number) =>
      ["subjects", "board-class", boardId, classLevel] as const,
    detail: (id: string) => ["subjects", "detail", id] as const,
  },
  papers: {
    all: () => ["papers"] as const,
    list: (filters: PaperFilters & { page?: number; pageSize?: number }) =>
      ["papers", "list", filters] as const,
    bySubject: (boardId: string, subjectId: string, classLevel: number) =>
      ["papers", "by-subject", boardId, subjectId, classLevel] as const,
    detail: (id: string) => ["papers", "detail", id] as const,
    search: (query: string, filters: SearchFilters) =>
      ["papers", "search", query, filters] as const,
    admin: (filters: AdminPaperFilters) => ["papers", "admin", filters] as const,
  },
  questions: {
    all: () => ["questions"] as const,
    list: (filters: QuestionFilters) => ["questions", "list", filters] as const,
    byChapter: (subjectId: string, boardId: string) =>
      ["questions", "by-chapter", subjectId, boardId] as const,
    detail: (id: string) => ["questions", "detail", id] as const,
  },
  analytics: {
    dashboard: () => ["analytics", "dashboard"] as const,
    charts: (range: DateRange) => ["analytics", "charts", range] as const,
  },
  settings: {
    all: () => ["settings"] as const,
    featureFlags: () => ["settings", "feature-flags"] as const,
  },
  media: {
    files: (prefix?: string) => ["media", "files", prefix] as const,
  },
  audit: {
    list: (filters: AuditFilters) => ["audit", "list", filters] as const,
  },
} as const;
