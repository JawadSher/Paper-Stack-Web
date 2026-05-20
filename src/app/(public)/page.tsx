import type { Metadata } from "next";
import { AppDownloadSection } from "@/components/public/AppDownloadSection";
import { BoardsPreview } from "@/components/public/BoardsPreview";
import { CommonQuestionsTeaser } from "@/components/public/CommonQuestionsTeaser";
import { FeaturesSection } from "@/components/public/FeaturesSection";
import { HeroSection } from "@/components/public/HeroSection";
import { HowItWorksSection } from "@/components/public/HowItWorksSection";
import { StatsStrip } from "@/components/public/StatsStrip";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://paper-stack-web.vercel.app",
  ),
  title: "PaperStack | Every Past Paper. One Place.",
  description:
    "Access 5 years of past papers from all Pakistan boards. Browse free and download offline in the PaperStack app.",
  openGraph: {
    title: "PaperStack | Every Past Paper. One Place.",
    description:
      "Access 5 years of past papers from all Pakistan boards. Browse free and download offline in the PaperStack app.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PaperStack past papers for Pakistani students",
      },
    ],
  },
};

export default function LandingPage() {

  return (
    <>
      <HeroSection />
      <StatsStrip />
      <FeaturesSection />
      <BoardsPreview />
      <CommonQuestionsTeaser />
      <HowItWorksSection />
      <AppDownloadSection />
    </>
  );
}
