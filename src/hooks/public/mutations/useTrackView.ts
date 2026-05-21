"use client";

import { useMutation } from "@tanstack/react-query";
import { trackPaperView } from "@/src/actions/public/analytics";

export function useTrackView() {
  return useMutation({
    mutationFn: ({
      paperId,
      platform,
    }: {
      paperId: string;
      platform: "web" | "mobile";
    }) => trackPaperView(paperId, platform),
    retry: 1,
  });
}
