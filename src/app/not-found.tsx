import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PaperStackLogo } from "@/components/shared/PaperStackLogo";

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <div className="grid justify-items-center gap-5">
        <PaperStackLogo showText size="lg" />
        <h1 className="text-4xl font-semibold">404 - Page not found</h1>
        <p className="max-w-md text-muted-foreground">The page you are looking for does not exist or has moved.</p>
        <Link href="/" className={buttonVariants()}>Back home</Link>
      </div>
    </main>
  );
}
