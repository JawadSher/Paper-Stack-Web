"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="grid min-h-screen place-items-center px-6 text-center">
          <div className="max-w-lg space-y-4">
            <h1>Something went wrong</h1>
            {process.env.NODE_ENV === "development" ? <p>{error.message}</p> : null}
            <button type="button" onClick={reset}>Try again</button>
          </div>
        </main>
      </body>
    </html>
  );
}
