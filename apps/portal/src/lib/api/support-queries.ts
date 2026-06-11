"use client";

import { useQuery } from "@tanstack/react-query";
import { getManualOutline, getManualPdf } from "@/lib/api/support-api";

export const supportQueryKeys = {
  manualOutline: ["support", "manual", "outline"] as const,
  manualPdf: ["support", "manual", "pdf"] as const
};

export function useManualOutlineQuery() {
  return useQuery({
    queryKey: supportQueryKeys.manualOutline,
    queryFn: getManualOutline
  });
}

export function useManualPdfQuery() {
  return useQuery({
    queryKey: supportQueryKeys.manualPdf,
    queryFn: getManualPdf
  });
}
