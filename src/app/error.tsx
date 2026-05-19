"use client";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div className="max-w-lg space-y-4">
        <h1 className="text-3xl font-semibold">Something went wrong</h1>
        {process.env.NODE_ENV === "development" ? <p className="text-sm text-muted-foreground">{error.message}</p> : null}
        <button type="button" className="rounded-lg bg-primary px-4 py-2 text-primary-foreground" onClick={reset}>Try again</button>
      </div>
    </main>
  );
}
