import { boardsByProvince } from "@/constants/boards";

export default function BrowsePage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Browse Papers</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {Object.entries(boardsByProvince).map(([province, boards]) => (
          <div key={province} className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold">{province}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {boards.length} boards available
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
