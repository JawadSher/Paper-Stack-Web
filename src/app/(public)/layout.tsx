"use client";
import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { ScrollProgress } from "@/components/public/ScrollProgress";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  async function dbCall() {
      await fetch("http://localhost:3000/api/health/", { method: "GET" });


  }
  
  dbCall();

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <PublicNavbar />
      <main id="main-content">{children}</main>
      <PublicFooter />
    </div>
  );
}
