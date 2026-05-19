import Link from "next/link";
import { BookOpen, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { boards } from "@/constants/boards";
import { subjects } from "@/constants/subjects";

export default function LandingPage() {
  return (
    <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
      <header className="flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-foreground">
          Paper Stack
        </Link>
        <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
          Admin
        </Link>
      </header>

      <div className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Pakistan board papers
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-foreground md:text-7xl">
              Paper Stack
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Browse board papers by class, subject, year, and session from one
              fast web workspace.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/browse" className={buttonVariants({ size: "lg" })}>
              <BookOpen className="size-5" />
              Browse Papers
            </Link>
            <Link
              href="/search"
              className={buttonVariants({ size: "lg", variant: "secondary" })}
            >
              <Search className="size-5" />
              Search
            </Link>
          </div>
        </div>

        <Card className="border-border bg-card">
          <CardContent className="grid gap-6 p-6">
            <div>
              <p className="text-sm text-muted-foreground">Boards</p>
              <p className="text-4xl font-semibold">{boards.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subjects</p>
              <p className="text-4xl font-semibold">{subjects.length}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {boards.slice(0, 4).map((board) => (
                <div
                  key={board.id}
                  className="rounded-lg border border-border bg-secondary p-3"
                >
                  <p className="font-medium">{board.shortName}</p>
                  <p className="text-sm text-muted-foreground">
                    {board.province}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
