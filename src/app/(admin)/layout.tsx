import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const navItems = [
  ["Dashboard", "/dashboard"],
  ["Papers", "/papers"],
  ["Boards", "/boards"],
  ["Subjects", "/subjects"],
  ["Classes", "/classes"],
  ["Questions", "/questions"],
  ["Media", "/media"],
  ["Settings", "/settings"],
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  // Clerk sign-in proves identity; this metadata role gates admin authority.
  if (user?.publicMetadata.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-card px-5 py-6 md:block">
        <Link href="/dashboard" className="text-lg font-semibold">
          Paper Stack Admin
        </Link>
        <nav className="mt-8 grid gap-1">
          {navItems.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="md:pl-64">
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <p className="font-medium">Admin Portal</p>
          <UserButton />
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
