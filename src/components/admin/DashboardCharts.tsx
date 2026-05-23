"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type DashboardChartsProps = {
  boardData: Array<{ board: string; boardName: string; papers: number }>;
  uploadData: Array<{ month: string; uploads: number }>;
};

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { boardName?: string; board?: string; papers?: number } }>;
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="max-w-72 rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-popover-foreground">{item.boardName ?? item.board}</p>
      <p className="mt-1 text-primary">{(item.papers ?? 0).toLocaleString()} papers</p>
    </div>
  );
}

export function DashboardCharts({
  boardData,
  uploadData,
}: DashboardChartsProps) {
  const boardChartHeight = Math.max(320, boardData.length * 36);

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-2">
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Papers by board</CardTitle>
        </CardHeader>
        <CardContent className="min-w-0">
          <div className="max-h-[420px] overflow-y-auto pr-2">
            <div style={{ height: boardChartHeight }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart
                  data={boardData}
                  layout="vertical"
                  margin={{ top: 4, right: 16, bottom: 4, left: 4 }}
                  barCategoryGap={8}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="board"
                    width={92}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  />
                  <Tooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltip />} />
                  <Bar dataKey="papers" fill="var(--primary)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Uploads over time</CardTitle>
        </CardHeader>
        <CardContent className="h-80 min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={uploadData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="uploads"
                stroke="oklch(0.64 0.116 174.2)"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
