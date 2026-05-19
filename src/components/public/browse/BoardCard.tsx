import Link from "next/link";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Board } from "@/types";

export type BoardCardProps = {
  board: Board;
  paperCount: number;
};

export function BoardCard({ board, paperCount }: BoardCardProps) {
  return (
    <Link
      href={`/browse/${board.id}`}
      className="group block rounded-lg border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-ps-coral/50"
      style={{ borderLeftColor: board.color, borderLeftWidth: 4 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-2xl font-semibold">{board.shortName}</p>
          <h2 className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {board.name}
          </h2>
        </div>
        <Badge className="border-transparent text-white" style={{ backgroundColor: board.color }}>
          {board.province}
        </Badge>
      </div>
      <div className="mt-6 flex items-center justify-between gap-3 text-sm">
        <span className="rounded-4xl px-3 py-1 font-medium" style={{ backgroundColor: board.color, color: 'white' }}>
          Classes 9-12
        </span>
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <FileText className="size-4" />
          {paperCount} papers
        </span>
      </div>
    </Link>
  );
}
