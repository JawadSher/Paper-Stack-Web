import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { AppProviders } from "@/components/shared/app-providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paper Stack",
  description: "Past papers, boards, subjects, and admin tools for Paper Stack.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen antialiased`}>
        <ClerkProvider signInUrl="/sign-in">
          <AppProviders>
            {children}
            <Toaster richColors />
          </AppProviders>
        </ClerkProvider>
      </body>
    </html>
  );
}
