import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Lora, Poppins, Roboto_Mono } from "next/font/google";
import { AppProviders } from "@/components/shared/app-providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
const fontSans = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const fontSerif = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

const fontMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Paper Stack",
  description:
    "Past papers, boards, subjects, and admin tools for Paper Stack.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="PaperStack" />
      </head>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} min-h-screen antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        >
          Skip to content
        </a>
        <ClerkProvider
          signInUrl="/sign-in"
          signInFallbackRedirectUrl="/dashboard"
        >
          <AppProviders>
            {children}
            <Toaster richColors />
          </AppProviders>
        </ClerkProvider>
      </body>
    </html>
  );
}
