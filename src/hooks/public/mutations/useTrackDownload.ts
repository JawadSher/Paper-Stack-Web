"use client";

import { useMutation } from "@tanstack/react-query";
import { trackPaperDownload } from "@/src/actions/public/analytics";

export function useTrackDownload() {
  return useMutation({
    mutationFn: ({
      paperId,
      platform,
    }: {
      paperId: string;
      platform: "web" | "mobile";
    }) => trackPaperDownload(paperId, platform),
    retry: 1,
  });
}
