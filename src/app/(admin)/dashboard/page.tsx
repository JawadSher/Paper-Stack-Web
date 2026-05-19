import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { boards } from "@/constants/boards";
import { subjects } from "@/constants/subjects";

export default function DashboardPage() {
  const stats = [
    ["Total Papers", 0],
    ["Total Boards", boards.length],
    ["Total Subjects", subjects.length],
    ["Total Downloads", 0],
  ] as const;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{value}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
