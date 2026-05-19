import { Progress } from "@/components/ui/progress";

export function StorageUsageBar() {
  return (
    <div className="min-w-64 rounded-lg border bg-card p-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Used 2.4 GB of 10 GB</span>
        <span className="text-muted-foreground">24%</span>
      </div>
      <Progress value={24} className="mt-3" />
    </div>
  );
}
