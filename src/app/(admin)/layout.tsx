import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";

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

  return <AdminShell>{children}</AdminShell>;
}
