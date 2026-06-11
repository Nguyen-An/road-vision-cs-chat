export interface OutlineItem {
  id: string;
  title: string;
  page: number;
  children?: OutlineItem[];
}

export interface ManualPdf {
  pdfUrl: string;
  fileName?: string;
  updatedAt?: string;
  size?: string;
}

const supportApiBasePath = "/api/support";

async function getSupportData() {
  return import("@/data/support-data");
}

async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${supportApiBasePath}${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Support API request failed: ${response.status} ${path}`);
  }
  return (await response.json()) as T;
}

export async function getManualOutline() {
  if (typeof window === "undefined") {
    const { getManualOutlineData } = await getSupportData();
    return getManualOutlineData();
  }

  return apiFetch<OutlineItem[]>("/manual/outline");
}

export async function getManualPdf() {
  if (typeof window === "undefined") {
    const { getManualPdfData } = await getSupportData();
    return getManualPdfData();
  }

  return apiFetch<ManualPdf>("/manual/pdf");
}
