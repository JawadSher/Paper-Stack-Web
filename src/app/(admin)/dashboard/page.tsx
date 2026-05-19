import Link from "next/link";
import {
  BookOpen,
  Building2,
  ChevronRight,
  Download,
  Edit,
  Eye,
  FileText,
  HardDrive,
  Plus,
  Trash2,
  TrendingUp,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { boards } from "@/constants/boards";
import { mockPapers } from "@/constants/papers";
import { subjects } from "@/constants/subjects";
import type { Paper } from "@/types";

const statCards = [
  {
    label: "Total papers",
    value: "1,247",
    icon: FileText,
    color: "text-ps-coral bg-ps-coral/12",
  },
  {
    label: "Total boards",
    value: "26",
    icon: Building2,
    color: "text-ps-teal bg-ps-teal/12",
  },
  {
    label: "Total subjects",
    value: "44",
    icon: BookOpen,
    color: "text-ps-purple bg-ps-purple/12",
  },
  {
    label: "Downloads this month",
    value: "18,430",
    icon: Download,
    color: "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-400/15",
  },
];

const boardChartData = boards.slice(0, 8).map((board, index) => ({
  board: board.shortName.replace("BISE ", ""),
  papers: 168 - index * 11,
}));

const uploadChartData = [
  { month: "Aug", uploads: 82 },
  { month: "Sep", uploads: 94 },
  { month: "Oct", uploads: 116 },
  { month: "Nov", uploads: 131 },
  { month: "Dec", uploads: 154 },
  { month: "Jan", uploads: 178 },
];

const recentPapers = mockPapers.slice(0, 16);

const columns: DataTableColumn<Paper>[] = [
  {
    key: "subject",
    header: "Subject",
    cell: (paper) =>
      subjects.find((subject) => subject.id === paper.subjectId)?.name ?? "Unknown",
  },
  {
    key: "board",
    header: "Board",
    cell: (paper) =>
      boards.find((board) => board.id === paper.boardId)?.shortName ?? "Unknown",
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
    cell: (paper) => new Date(paper.createdAt).toLocaleDateString(),
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

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Monitor PaperStack content, uploads, and student activity.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label}>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className={`grid size-10 place-items-center rounded-lg ${stat.color}`}>
                  <Icon className="size-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              New papers this month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">186</p>
            <p className="mt-2 flex items-center gap-1 text-sm text-ps-teal">
              <TrendingUp className="size-4" />
              12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Most viewed subject
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">Physics</p>
            <p className="mt-2 text-sm text-muted-foreground">4,920 views</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Storage used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">68%</p>
            <Progress value={68} className="mt-4" />
            <p className="mt-2 text-sm text-muted-foreground">34.2 GB of 50 GB</p>
          </CardContent>
        </Card>
      </section>

      <DashboardCharts boardData={boardChartData} uploadData={uploadChartData} />

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Recent papers</h2>
            <p className="text-sm text-muted-foreground">
              Latest uploads and changes from the content team.
            </p>
          </div>
          <Button type="button" variant="outline">View all</Button>
        </div>
        <DataTable data={recentPapers} columns={columns} getRowKey={(paper) => paper.id} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Quick actions</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.label}
                href={action.href}
                className="group rounded-lg border bg-card p-5 transition-colors hover:border-ps-coral/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid size-11 place-items-center rounded-lg bg-secondary text-ps-coral">
                    <Icon className="size-5" />
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
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
