import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export type SkeletonCardProps = {
  variant?: "paper" | "board" | "stat";
};

export function SkeletonCard({ variant = "paper" }: SkeletonCardProps) {
  if (variant === "stat") {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20" />
        </CardContent>
      </Card>
    );
  }

  if (variant === "board") {
    return (
      <Card>
        <CardContent className="space-y-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-3">
        <Skeleton className="size-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-4xl" />
          <Skeleton className="h-5 w-14 rounded-4xl" />
          <Skeleton className="h-5 w-20 rounded-4xl" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-8 w-40" />
      </CardContent>
    </Card>
  );
}
