"use client";

import Link from "next/link";
import {
  Activity,
  BookOpen,
  Building2,
  ChevronRight,
  Clock3,
  Download,
  Edit,
  Eye,
  FileText,
  HardDrive,
  Plus,
  Sparkles,
  Trash2,
  TrendingUp,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { useGetChartData } from "@/hooks/admin/queries/useGetChartData";
import { useGetAdminPapers } from "@/hooks/admin/queries/useGetAdminPapers";
import { useGetDashboardStats } from "@/hooks/admin/queries/useGetDashboardStats";
import { cn } from "@/lib/utils";
import type { PaperWithRelations } from "@/src/types/action-types";

const statCards = [
  {
    label: "Total papers",
    valueKey: "totalPapers",
    icon: FileText,
    color: "text-primary bg-primary/12",
    description: "Published PDFs in the library",
  },
  {
    label: "Total boards",
    valueKey: "totalBoards",
    icon: Building2,
    color: "text-ps-teal bg-ps-teal/12",
    description: "Education boards covered",
  },
  {
    label: "Total subjects",
    valueKey: "totalSubjects",
    icon: BookOpen,
    color: "text-ps-purple bg-ps-purple/12",
    description: "Class subject combinations",
  },
  {
    label: "New papers this month",
    valueKey: "newPapersThisMonth",
    icon: Download,
    color:
      "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-400/15",
    description: "Recently added content",
  },
];

const columns: DataTableColumn<PaperWithRelations>[] = [
  {
    key: "subject",
    header: "Subject",
    cell: (paper) => paper.subject.name,
  },
  {
    key: "board",
    header: "Board",
    cell: (paper) => paper.board.shortName,
  },
  {
    key: "class",
    header: "Class",
    cell: (paper) => paper.classLevel,
  },
  {
    key: "year",
    header: "Year",
    cell: (paper) => paper.year,
  },
  {
    key: "session",
    header: "Session",
    cell: (paper) => (
      <Badge variant="secondary" className="capitalize">
        {paper.session}
      </Badge>
    ),
  },
  {
    key: "uploaded",
    header: "Uploaded",
    cell: (paper) => paper.createdAt.toLocaleDateString(),
  },
  {
    key: "actions",
    header: "Actions",
    className: "text-right",
    cell: (paper) => (
      <div className="flex justify-end gap-1">
        <Button type="button" size="icon-sm" variant="ghost" aria-label={`View ${paper.title}`}>
          <Eye className="size-4" />
        </Button>
        <Button type="button" size="icon-sm" variant="ghost" aria-label={`Edit ${paper.title}`}>
          <Edit className="size-4" />
        </Button>
        <Button type="button" size="icon-sm" variant="ghost" aria-label={`Delete ${paper.title}`}>
          <Trash2 className="size-4" />
        </Button>
      </div>
    ),
  },
];

const quickActions = [
  {
    label: "Upload new paper",
    description: "Add a fresh PDF to the library",
    href: "/papers",
    icon: Upload,
  },
  {
    label: "Add board",
    description: "Create or update a board profile",
    href: "/boards",
    icon: Building2,
  },
  {
    label: "Add subject",
    description: "Manage class subject coverage",
    href: "/subjects",
    icon: Plus,
  },
  {
    label: "View media",
    description: "Browse uploaded files and assets",
    href: "/media",
    icon: HardDrive,
  },
];

function formatBytes(bytes: number) {
  if (!bytes) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** index;

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: chartData, isLoading: chartLoading } = useGetChartData("30d");
  const { data: recentPapers } = useGetAdminPapers({
    page: 1,
    pageSize: 16,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const totalPapers = stats?.totalPapers ?? 0;
  const newPapers = stats?.newPapersThisMonth ?? 0;
  const totalViews = stats?.totalViews ?? 0;
  const storageUsed = stats?.storageUsedBytes ?? 0;
  const recentCount = recentPapers?.data.length ?? 0;
  const storageProgress = Math.min(
    100,
    Math.round((storageUsed / (1024 * 1024 * 1024)) * 100),
  );

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-ps-teal to-ps-purple" />
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <Badge
              variant="secondary"
              className="mb-4 gap-1.5 rounded-md border border-border bg-secondary/70"
            >
              <Sparkles className="size-3.5 text-primary" />
              Admin overview
            </Badge>
            <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 text-muted-foreground">
              Monitor PaperStack content, coverage, uploads, and storage from a
              focused control room.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
            <Link
              href="/boards"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "justify-start",
              )}
            >
              <Building2 className="size-4" />
              Manage boards
            </Link>
            <Link
              href="/papers"
              className={cn(buttonVariants(), "justify-start")}
            >
              <Upload className="size-4" />
              Upload paper
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const value = stats?.[stat.valueKey as keyof typeof stats] ?? 0;

          return (
            <Card
              key={stat.label}
              className="border border-transparent shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
            >
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-sm text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
                <div className={`grid size-10 place-items-center rounded-lg ${stat.color}`}>
                  <Icon className="size-5" />
                </div>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <p className="text-3xl font-semibold">
                    {typeof value === "number" ? value.toLocaleString() : value}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex-row items-start justify-between gap-4">
            <CardTitle className="text-sm text-muted-foreground">
              Monthly momentum
            </CardTitle>
            <div className="grid size-9 place-items-center rounded-lg bg-ps-teal/12 text-ps-teal">
              <TrendingUp className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-3xl font-semibold">
                {newPapers.toLocaleString()}
              </p>
            )}
            <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <Activity className="size-4 text-ps-teal" />
              {totalPapers ? Math.round((newPapers / totalPapers) * 100) : 0}%
              of the current library
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex-row items-start justify-between gap-4">
            <CardTitle className="text-sm text-muted-foreground">
              Most viewed subject
            </CardTitle>
            <div className="grid size-9 place-items-center rounded-lg bg-primary/12 text-primary">
              <Eye className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-3xl font-semibold">
                {stats?.topSubject ?? "None"}
              </p>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              {totalViews.toLocaleString()} total views
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex-row items-start justify-between gap-4">
            <CardTitle className="text-sm text-muted-foreground">
              Storage used
            </CardTitle>
            <div className="grid size-9 place-items-center rounded-lg bg-ps-purple/12 text-ps-purple">
              <HardDrive className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-3xl font-semibold">
                {formatBytes(storageUsed)}
              </p>
            )}
            <Progress value={storageProgress} className="mt-4" />
            <p className="mt-2 text-sm text-muted-foreground">
              Supabase storage usage
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Content analytics</h2>
            <p className="text-sm text-muted-foreground">
              Board coverage and activity trends for the last 30 days.
            </p>
          </div>
          <Badge variant="outline" className="w-fit gap-1.5">
            <Clock3 className="size-3.5" />
            30 day window
          </Badge>
        </div>
        {chartLoading ? (
          <SkeletonCard variant="stat" />
        ) : (
          <DashboardCharts
            boardData={(chartData?.boardData ?? []).map((item) => ({
              board: item.boardName,
              papers: item.paperCount,
            }))}
            uploadData={(chartData?.viewsData ?? []).map((item) => ({
              month: item.date,
              uploads: item.views,
            }))}
          />
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Recent papers</h2>
            <p className="text-sm text-muted-foreground">
              Latest {recentCount.toLocaleString()} uploads and changes from
              the content team.
            </p>
          </div>
          <Link
            href="/papers"
            className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
          >
            View all
            <ChevronRight className="size-4" />
          </Link>
        </div>
        <DataTable
          data={recentPapers?.data ?? []}
          columns={columns}
          getRowKey={(paper) => paper.id}
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Quick actions</h2>
          <p className="text-sm text-muted-foreground">
            Jump into the workflows admins use most often.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.label}
                href={action.href}
                className="group rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/[0.035] hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <h3 className="mt-5 font-semibold">{action.label}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
