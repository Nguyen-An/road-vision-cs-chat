"use client";

import dynamic from "next/dynamic";
import { AlertCircle, BookOpen, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Download, Expand, FileText, Loader2, Plus, RotateCcw, Search, SquarePen, UploadCloud, X, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useTheme } from "@/app/theme-provider";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ManualPdf, OutlineItem } from "@/lib/api/support-api";

const PDFViewer = dynamic(() => import("@embedpdf/react-pdf-viewer").then((module) => module.PDFViewer), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-sm text-slate-500 dark:text-[#9ba8b7]">
      <span className="inline-flex items-center gap-2">
        <Loader2 className="animate-spin" size={18} />
        Loading PDF viewer...
      </span>
    </div>
  )
});

const maxUploadSizeBytes = 20 * 1024 * 1024;
const defaultManualPdf: Required<ManualPdf> = {
  pdfUrl: "/tai_lieu_quan_ly_duong_bo_co_muc_luc.pdf",
  fileName: "tai_lieu_quan_ly_duong_bo_co_muc_luc.pdf",
  updatedAt: "2026/06/11 14:30",
  size: "86.6KB"
};
const defaultManualTitle = "PDF Manual";
const defaultManualDescription = "User manual document";
const initialPdfFileInfo = {
  name: "tai_lieu_quan_ly_duong_bo_co_muc_luc.pdf",
  updatedAt: "2026/06/11 14:30",
  size: "86.6KB"
};
// const localPdfUrl = "/RV操作マニュアル（MDフォーマット）_260605.pdf";

type PdfOutlineItem = {
  id: string;
  title: string;
  page: number;
  level: number;
};

type PdfOutlineSourceItem = {
  title?: string;
  dest?: unknown;
  items?: PdfOutlineSourceItem[];
  level?: number;
};

type ManualViewerProps = {
  pdf?: ManualPdf;
  outline?: OutlineItem[];
  title?: string;
  description?: string;
  outlineTitle?: string;
  initialOutlineId?: string;
  initialPage?: number;
};

type PdfFileInfo = typeof initialPdfFileInfo;
type TocMode = "view" | "add" | "edit";
type TocDialogState =
  | {
      mode: "add";
      anchorId: string;
      position: "above" | "below";
      title: string;
      page: string;
    }
  | {
      mode: "edit";
      itemId: string;
      title: string;
      page: string;
    }
  | null;

function flattenOutline(items: PdfOutlineSourceItem[] | null | undefined, level = 0): PdfOutlineSourceItem[] {
  if (!items?.length) return [];
  return items.flatMap((item) => [Object.assign({}, item, { level }), ...flattenOutline(item.items, level + 1)]);
}

function flattenManualOutline(items: OutlineItem[] | undefined, level = 0): PdfOutlineItem[] {
  if (!items?.length) return [];
  return items.flatMap((item) => [
    {
      id: item.id,
      title: item.title,
      page: item.page,
      level
    },
    ...flattenManualOutline(item.children, level + 1)
  ]);
}

function normalizeOutlineTitle(title: string) {
  return title
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

async function resolveOutlinePage(pdf: any, destination: unknown) {
  if (!destination) return 1;
  const explicitDestination = typeof destination === "string" ? await pdf.getDestination(destination) : destination;
  const pageRef = Array.isArray(explicitDestination) ? explicitDestination[0] : undefined;
  if (!pageRef) return 1;
  const pageIndex = await pdf.getPageIndex(pageRef);
  return pageIndex + 1;
}

async function extractPrintedTocPageMap(pdf: any) {
  const pagesByTitle = new Map<string, number>();
  const sectionPages = new Map<string, number>();
  const tocPageLimit = Math.min(pdf.numPages, 4);

  for (let pageNumber = 1; pageNumber <= tocPageLimit; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const rows = new Map<number, { text: string; x: number }[]>();

    textContent.items.forEach((item: any) => {
      const text = String(item.str ?? "");
      if (!text.trim()) return;
      const y = Math.round(item.transform?.[5] ?? 0);
      const x = Math.round(item.transform?.[4] ?? 0);
      rows.set(y, [...(rows.get(y) ?? []), { text, x }]);
    });

    Array.from(rows.values()).forEach((row) => {
      const sortedRow = row.sort((a, b) => a.x - b.x);
      const pageItem = [...sortedRow].reverse().find((item) => item.x >= 480 && /^\d+$/.test(item.text.trim()));
      const tocPage = pageItem ? Number(pageItem.text.trim()) : undefined;
      if (!tocPage) return;

      const title = sortedRow
        .filter((item) => item.x < 460)
        .map((item) => item.text.trim())
        .filter((text) => text && text !== ".")
        .join(" ")
        .replace(/\s+/g, " ")
        .replace(/\s+([.)])/g, "$1")
        .trim();

      if (!/^\d+(?:\.\d+)*\.?\s+/.test(title)) return;
      pagesByTitle.set(normalizeOutlineTitle(title), tocPage);

      const sectionMatch = title.match(/^(\d+)\.\s+/);
      if (sectionMatch) {
        sectionPages.set(sectionMatch[1], tocPage);
      }
    });
  }

  return { pagesByTitle, sectionPages };
}

async function buildOutlineFromPdf(pdf: any): Promise<{ items: PdfOutlineItem[]; totalPages: number }> {
  const pdfOutline = await pdf.getOutline();
  const { pagesByTitle, sectionPages } = await extractPrintedTocPageMap(pdf);
  const flattenedItems = await Promise.all(
    flattenOutline(pdfOutline).map(async (item, index) => ({
      id: `${index}-${item.title}`,
      title: item.title || `Page ${index + 1}`,
      page: inferPageFromPrintedToc(item.title ?? "", pagesByTitle, sectionPages) ?? (await resolveOutlinePage(pdf, item.dest)),
      level: item.level ?? 0
    }))
  );

  return {
    items: flattenedItems.filter((item) => item.title.trim()),
    totalPages: pdf.numPages
  };
}

function expandTopLevelSections(items: PdfOutlineItem[]) {
  return items.reduce<Record<string, boolean>>((sections, item) => {
    if (item.level === 0) sections[item.id] = true;
    return sections;
  }, {});
}

function inferPageFromPrintedToc(title: string, pagesByTitle: Map<string, number>, sectionPages: Map<string, number>) {
  const exactPage = pagesByTitle.get(normalizeOutlineTitle(title));
  if (exactPage) return exactPage;

  const sectionMatch = title.match(/^(\d+)(?:\.|\s)/);
  return sectionMatch ? sectionPages.get(sectionMatch[1]) : undefined;
}

function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  return `${(bytes / 1024).toFixed(1)}KB`;
}

function formatUpdatedAt(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getFileNameFromUrl(pdfUrl: string) {
  const cleanUrl = pdfUrl.split("?")[0]?.split("#")[0] ?? pdfUrl;
  return decodeURIComponent(cleanUrl.split("/").filter(Boolean).at(-1) ?? "manual.pdf");
}

function getInitialFileInfo(pdf: ManualPdf): PdfFileInfo {
  return {
    name: pdf.fileName ?? getFileNameFromUrl(pdf.pdfUrl),
    updatedAt: pdf.updatedAt ?? "-",
    size: pdf.size ?? "-"
  };
}

export function ManualViewer({ pdf = defaultManualPdf, outline: manualOutline, title = defaultManualTitle, description = defaultManualDescription, outlineTitle = title, initialOutlineId, initialPage = 1 }: ManualViewerProps) {
  const { theme: appTheme } = useTheme();
  const [currentPdfUrl, setCurrentPdfUrl] = useState(pdf.pdfUrl);
  const [currentFileInfo, setCurrentFileInfo] = useState<PdfFileInfo>(() => getInitialFileInfo(pdf));
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [replaceConfirmOpen, setReplaceConfirmOpen] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [outlineReloadVersion, setOutlineReloadVersion] = useState(0);
  const [useEmbeddedOutline, setUseEmbeddedOutline] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [outline, setOutline] = useState<PdfOutlineItem[]>([]);
  const [activeOutlineId, setActiveOutlineId] = useState<string | undefined>(initialOutlineId);
  const [tocMode, setTocMode] = useState<TocMode>("view");
  const [tocDialog, setTocDialog] = useState<TocDialogState>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [outlineLoading, setOutlineLoading] = useState(true);
  const [activePage, setActivePage] = useState(initialPage);
  const [pageInput, setPageInput] = useState(String(initialPage));
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoomPercent, setZoomPercent] = useState(100);
  const [viewerVersion, setViewerVersion] = useState(0);
  const [viewerInitialPage, setViewerInitialPage] = useState(initialPage);
  const viewerPanelRef = useRef<HTMLDivElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const uploadOutlineRequestRef = useRef(0);
  const objectUrlRef = useRef<string | null>(null);
  const scrollCapabilityRef = useRef<any>(null);
  const searchCapabilityRef = useRef<any>(null);
  const zoomCapabilityRef = useRef<any>(null);
  const unsubscribePageChangeRef = useRef<(() => void) | null>(null);
  const unsubscribeLayoutReadyRef = useRef<(() => void) | null>(null);
  const unsubscribeZoomChangeRef = useRef<(() => void) | null>(null);
  const viewerSrc = viewerInitialPage > 1 ? `${currentPdfUrl}#page=${viewerInitialPage}` : currentPdfUrl;

  useEffect(() => {
    setCurrentPdfUrl(pdf.pdfUrl);
      setCurrentFileInfo(getInitialFileInfo(pdf));
      setUseEmbeddedOutline(false);
      setActivePage(initialPage);
    setPageInput(String(initialPage));
    setViewerInitialPage(initialPage);
    setActiveOutlineId(initialOutlineId);
    setViewerVersion((version) => version + 1);
  }, [pdf, initialOutlineId, initialPage]);

  useEffect(() => {
    let cancelled = false;

    async function loadOutline() {
      setOutlineLoading(true);

      const providedOutline = useEmbeddedOutline ? [] : flattenManualOutline(manualOutline);
      if (providedOutline.length > 0) {
        setOutline(providedOutline);
        setExpandedSections(expandTopLevelSections(providedOutline));
        setOutlineLoading(false);
        return;
      }

      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
        const pdf = await pdfjs.getDocument({ url: currentPdfUrl }).promise;
        const { items: nextOutline, totalPages: nextTotalPages } = await buildOutlineFromPdf(pdf);

        if (!cancelled) {
          setTotalPages(nextTotalPages);
          setOutline(nextOutline);
          setExpandedSections(expandTopLevelSections(nextOutline));
        }
      } catch {
        if (!cancelled) setOutline([]);
      } finally {
        if (!cancelled) setOutlineLoading(false);
      }
    }

    loadOutline();

    return () => {
      cancelled = true;
    };
  }, [currentPdfUrl, manualOutline, outlineReloadVersion, useEmbeddedOutline]);

  useEffect(() => {
    return () => {
      unsubscribePageChangeRef.current?.();
      unsubscribeLayoutReadyRef.current?.();
      unsubscribeZoomChangeRef.current?.();
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  useEffect(() => {
    setPageInput(String(activePage));
  }, [activePage]);

  const handleViewerReady = (registry: any) => {
    const scrollPlugin = registry.getPlugin("scroll") ?? registry.getCapabilityProvider("scroll");
    const scrollCapability = scrollPlugin?.provides?.();
    const zoomPlugin = registry.getPlugin("zoom") ?? registry.getCapabilityProvider("zoom");
    const zoomCapability = zoomPlugin?.provides?.();
    const searchPlugin = registry.getPlugin("search") ?? registry.getCapabilityProvider("search");
    const searchCapability = searchPlugin?.provides?.();
    scrollCapabilityRef.current = scrollCapability;
    zoomCapabilityRef.current = zoomCapability;
    searchCapabilityRef.current = searchCapability;
    unsubscribePageChangeRef.current?.();
    unsubscribeLayoutReadyRef.current?.();
    unsubscribeZoomChangeRef.current?.();
    unsubscribePageChangeRef.current = scrollCapability?.onPageChange?.((event: { pageNumber: number; totalPages?: number }) => {
      setActivePage(event.pageNumber);
      if (event.totalPages) setTotalPages(event.totalPages);
    });
    unsubscribeLayoutReadyRef.current = scrollCapability?.onLayoutReady?.((event: { pageNumber: number; totalPages: number }) => {
      setActivePage(event.pageNumber);
      setTotalPages(event.totalPages);
    });
    unsubscribeZoomChangeRef.current = zoomCapability?.onZoomChange?.((event: { newZoom: number }) => {
      setZoomPercent(Math.round(event.newZoom * 100));
    });
    const zoomState = zoomCapability?.getState?.();
    if (zoomState?.currentZoomLevel) setZoomPercent(Math.round(zoomState.currentZoomLevel * 100));
    const currentPage = scrollCapability?.getCurrentPage?.();
    const pages = scrollCapability?.getTotalPages?.();
    if (currentPage) setActivePage(currentPage);
    if (pages) setTotalPages(pages);
    window.setTimeout(() => {
      scrollCapability?.scrollToPage?.({ pageNumber: activePage });
    }, 0);
  };

  const goToPage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setActivePage(nextPage);
    const scrollCapability = scrollCapabilityRef.current;
    if (scrollCapability?.scrollToPage) {
      scrollCapability.scrollToPage({ pageNumber: nextPage });
      return;
    }
    setViewerInitialPage(nextPage);
    setViewerVersion((version) => version + 1);
  };

  const submitPageInput = () => {
    const page = Number(pageInput);
    if (!Number.isFinite(page)) {
      setPageInput(String(activePage));
      return;
    }
    goToPage(Math.trunc(page));
  };

  const submitSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;
    searchCapabilityRef.current?.startSearch?.();
    searchCapabilityRef.current?.searchAllPages?.(query);
  };

  const selectUploadFile = async (file?: File) => {
    setUploadError("");
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setSelectedFile(null);
      setUploadError("Chỉ hỗ trợ file .pdf.");
      return;
    }
    if (file.size > maxUploadSizeBytes) {
      setSelectedFile(null);
      setUploadError("Dung lượng file tối đa là 20MB.");
      return;
    }

    setSelectedFile(file);
    setOutlineLoading(true);
    setActiveOutlineId(undefined);

    const requestId = uploadOutlineRequestRef.current + 1;
    uploadOutlineRequestRef.current = requestId;

    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
      const buffer = await file.arrayBuffer();
      const uploadedPdf = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
      const { items: nextOutline, totalPages: nextTotalPages } = await buildOutlineFromPdf(uploadedPdf);

      if (uploadOutlineRequestRef.current !== requestId) return;

      setTotalPages(nextTotalPages);
      setOutline(nextOutline);
      setExpandedSections(expandTopLevelSections(nextOutline));
      setUploadError(nextOutline.length ? "" : "Không tìm thấy mục lục trong file PDF mới.");
    } catch {
      if (uploadOutlineRequestRef.current !== requestId) return;
      setOutline([]);
      setExpandedSections({});
      setUploadError("Không thể đọc mục lục từ file PDF này.");
    } finally {
      if (uploadOutlineRequestRef.current === requestId) {
        setOutlineLoading(false);
      }
    }
  };

  const cancelEditMode = () => {
    uploadOutlineRequestRef.current += 1;
    setIsEditMode(false);
    setSelectedFile(null);
    setReplaceConfirmOpen(false);
    setUploadError("");
    setIsDraggingFile(false);
    setOutlineReloadVersion((version) => version + 1);
  };

  const savePdfEdit = () => {
    if (!selectedFile) {
      toast.warning("Vui lòng chọn file PDF mới trước khi lưu.");
      return;
    }
    setReplaceConfirmOpen(true);
  };

  const confirmPdfReplace = () => {
    const file = selectedFile;
    if (!file) return;
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const nextUrl = URL.createObjectURL(file);
    objectUrlRef.current = nextUrl;
    setCurrentPdfUrl(nextUrl);
    setCurrentFileInfo({
      name: file.name,
      updatedAt: formatUpdatedAt(new Date()),
      size: formatFileSize(file.size)
    });
    setViewerInitialPage(1);
    setActivePage(1);
    setPageInput("1");
    setViewerVersion((version) => version + 1);
    setUseEmbeddedOutline(true);
    setReplaceConfirmOpen(false);
    cancelEditMode();
    toast.success("Cập nhật file PDF thành công.");
  };

  const outlineItems = outline.map((item, index) => ({
    ...item,
    hasChildren: item.level === 0 && (outline[index + 1]?.level ?? 0) > item.level
  }));

  const visibleOutlineItems = outlineItems.filter((item, index) => {
    if (item.level === 0) return true;
    const parentSection = outlineItems
      .slice(0, index)
      .reverse()
      .find((candidate) => candidate.level === 0);
    return parentSection ? expandedSections[parentSection.id] !== false : true;
  });

  const handleOutlineClick = (item: (typeof outlineItems)[number]) => {
    setActiveOutlineId(item.id);
    if (item.hasChildren) {
      setExpandedSections((current) => ({
        ...current,
        [item.id]: current[item.id] === false
      }));
    }
    goToPage(item.page);
  };

  const startPdfEditMode = () => {
    setTocMode("view");
    setTocDialog(null);
    setIsEditMode(true);
  };

  const openAddTocDialog = (item: PdfOutlineItem) => {
    if (isEditMode) return;
    setTocDialog({
      mode: "add",
      anchorId: item.id,
      position: "below",
      title: "",
      page: String(item.page)
    });
  };

  const openEditTocDialog = (item: PdfOutlineItem) => {
    if (isEditMode) return;
    setTocDialog({
      mode: "edit",
      itemId: item.id,
      title: item.title,
      page: String(item.page)
    });
  };

  const submitTocDialog = () => {
    if (!tocDialog) return;
    const title = tocDialog.title.trim();
    const page = Number(tocDialog.page);
    if (!title) {
      toast.warning("Vui lòng nhập tên danh mục.");
      return;
    }
    if (!Number.isFinite(page) || page < 1) {
      toast.warning("Vui lòng nhập số trang hợp lệ.");
      return;
    }

    if (tocDialog.mode === "edit") {
      setOutline((current) => current.map((item) => (item.id === tocDialog.itemId ? { ...item, title, page: Math.trunc(page) } : item)));
      setTocDialog(null);
      toast.success("Cập nhật mục lục thành công.");
      return;
    }

    setOutline((current) => {
      const anchorIndex = current.findIndex((item) => item.id === tocDialog.anchorId);
      if (anchorIndex < 0) return current;
      const anchor = current[anchorIndex];
      let insertIndex = anchorIndex;
      if (tocDialog.position === "below") {
        insertIndex = anchorIndex + 1;
        while (insertIndex < current.length && current[insertIndex].level > anchor.level) {
          insertIndex += 1;
        }
      }
      const nextItem: PdfOutlineItem = {
        id: `manual-${Date.now()}`,
        title,
        page: Math.trunc(page),
        level: anchor.level
      };
      return [...current.slice(0, insertIndex), nextItem, ...current.slice(insertIndex)];
    });
    setTocDialog(null);
    toast.success("Thêm mục lục thành công.");
  };

  const toggleFullscreen = () => {
    const fullscreenElement = document.fullscreenElement;
    if (fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    void viewerPanelRef.current?.requestFullscreen();
  };

  return (
    <>
      <div className="grid h-full min-h-0 grid-cols-[320px_minmax(0,1fr)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-[#243447] dark:bg-[#071624] max-[900px]:grid-cols-1">
      <aside className="min-h-0 border-r border-slate-200 bg-slate-50/80 dark:border-[#243447] dark:bg-[#0b1a29] max-[900px]:max-h-[32dvh] max-[900px]:border-b max-[900px]:border-r-0">
        <div className="flex h-full min-h-0 flex-col">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-[#243447]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="m-0 text-sm font-bold text-slate-700 dark:text-[#d8e2ed]">Mục lục (PDF)</p>
                <p className="mt-1 truncate text-xs text-slate-500 dark:text-[#738398]">{outlineTitle}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  className={`grid h-8 w-8 place-items-center rounded-lg border text-slate-600 transition hover:border-cyan-400 hover:text-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-40 dark:text-[#9ba8b7] dark:hover:text-cyan-300 ${
                    !isEditMode && tocMode === "add" ? "border-cyan-400 bg-cyan-50 text-cyan-700 dark:bg-[#102a41] dark:text-cyan-300" : "border-slate-200 dark:border-[#34465c]"
                  }`}
                  type="button"
                  title={isEditMode ? "Tắt khi chỉnh sửa PDF" : "Chỉnh sửa"}
                  aria-label="Chỉnh sửa mục lục"
                  disabled={isEditMode}
                  onClick={() => setTocMode((mode) => (mode === "add" ? "view" : "add"))}
                >
                  <Plus size={16} />
                </button>
                <button
                  className={`grid h-8 w-8 place-items-center rounded-lg border text-slate-600 transition hover:border-cyan-400 hover:text-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-40 dark:text-[#9ba8b7] dark:hover:text-cyan-300 ${
                    !isEditMode && tocMode === "edit" ? "border-cyan-400 bg-cyan-50 text-cyan-700 dark:bg-[#102a41] dark:text-cyan-300" : "border-slate-200 dark:border-[#34465c]"
                  }`}
                  type="button"
                  title={isEditMode ? "T\u1eaft khi ch\u1ec9nh s\u1eeda PDF" : "Ch\u1ec9nh s\u1eeda"}
                  aria-label="Ch\u1ec9nh s\u1eeda m\u1ee5c l\u1ee5c"
                  disabled={isEditMode}
                  onClick={() => setTocMode((mode) => (mode === "edit" ? "view" : "edit"))}
                >
                  <SquarePen size={16} />
                </button>
              </div>
            </div>
          </div>
          <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-3" aria-label="PDF table of contents">
            {outlineLoading ? (
              <div className="flex items-center gap-2 px-2 py-3 text-sm text-slate-500 dark:text-[#9ba8b7]">
                <Loader2 className="animate-spin" size={16} />
                Đang tải mục lục...
              </div>
            ) : outline.length ? (
              <ul className="grid list-none gap-1 p-0">
                {visibleOutlineItems.map((item) => (
                  <li key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-1">
                    <button
                      className={`grid min-h-9 w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition hover:bg-cyan-50 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:hover:bg-[#102a41] dark:hover:text-cyan-300 ${
                        item.id === activeOutlineId ? "bg-cyan-50 text-cyan-700 dark:bg-[#102a41] dark:text-cyan-300" : "text-slate-600 dark:text-[#b7c4d4]"
                      }`}
                      style={{ paddingLeft: 12 + item.level * 18 }}
                      type="button"
                      aria-expanded={item.hasChildren ? expandedSections[item.id] !== false : undefined}
                      onClick={() => handleOutlineClick(item)}
                    >
                      <span className="inline-flex min-w-0 items-center gap-2">
                        {item.hasChildren ? (
                          expandedSections[item.id] === false ? (
                            <ChevronRight className="shrink-0" size={15} />
                          ) : (
                            <ChevronDown className="shrink-0" size={15} />
                          )
                        ) : item.level === 0 ? (
                          <BookOpen className="shrink-0" size={15} />
                        ) : (
                          <FileText className="shrink-0" size={14} />
                        )}
                        <span className="truncate">{item.title}</span>
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-[#8ea0b5]">{item.page}</span>
                    </button>
                    {!isEditMode && tocMode === "add" ? (
                      <button
                        className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 text-slate-500 transition hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-[#34465c] dark:text-[#9ba8b7] dark:hover:bg-[#102a41] dark:hover:text-cyan-300"
                        type="button"
                        title="Chỉnh sửa mục lục"
                        aria-label={`Chỉnh sửa ${item.title}`}
                        onClick={() => openAddTocDialog(item)}
                      >
                        <Plus size={14} />
                      </button>
                    ) : null}
                    {!isEditMode && tocMode === "edit" ? (
                      <button
                        className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 text-slate-500 transition hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-[#34465c] dark:text-[#9ba8b7] dark:hover:bg-[#102a41] dark:hover:text-cyan-300"
                        type="button"
                        title="Ch?nh s?a m?c l?c"
                        aria-label={`Ch?nh s?a ${item.title}`}
                        onClick={() => openEditTocDialog(item)}
                      >
                        <SquarePen size={14} />
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-md border border-dashed border-slate-300 px-3 py-4 text-sm text-slate-500 dark:border-slate-600 dark:text-[#9ba8b7]">No outline found in this PDF.</div>
            )}
          </nav>
        </div>
      </aside>

      <section ref={viewerPanelRef} className="flex min-h-0 flex-col bg-slate-100 dark:bg-[#081827]">
        {!isEditMode ? (
        <header className="flex min-h-[58px] items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 dark:border-[#243447] dark:bg-[#0b1a29] max-sm:grid">
          <div className="flex min-w-0 flex-1 items-center gap-4 max-sm:grid">
            <div className="min-w-0">
              <h1 className="m-0 truncate text-lg font-bold text-slate-950 dark:text-[#f4f8ff]">{title}</h1>
              <p className="mt-1 truncate text-xs text-slate-500 dark:text-[#9ba8b7]">{description}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-cyan-400 hover:text-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-[#243447] dark:text-[#9ba8b7] dark:hover:text-cyan-300"
              href={currentPdfUrl}
              download={currentFileInfo.name}
              aria-label="Chỉnh sửa PDF"
              title="Chỉnh sửa PDF"
            >
              <Download size={17} />
            </a>
            <button
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-cyan-400 hover:text-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-[#243447] dark:text-[#9ba8b7] dark:hover:text-cyan-300"
              type="button"
              aria-label="Ch?nh s?a PDF"
              title="Ch?nh s?a PDF"
              onClick={startPdfEditMode}
            >
              <SquarePen size={17} />
            </button>
            <button
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-cyan-400 hover:text-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-[#243447] dark:text-[#9ba8b7] dark:hover:text-cyan-300"
              type="button"
              aria-label="Fullscreen"
              title="Fullscreen"
              onClick={toggleFullscreen}
            >
              <Expand size={17} />
            </button>
          </div>
        </header>
        ) : null}
        {isEditMode ? (
          <section className="border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-[#243447] dark:bg-[#0b1a29]" aria-label="PDF edit panel">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="m-0 text-sm font-bold text-slate-800 dark:text-[#f4f8ff]">Chỉnh sửa PDF</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-[#9ba8b7]">Chọn file PDF mới để cập nhật tài liệu hiện tại.</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-[#34465c] dark:bg-[#102033] dark:text-[#d8e2ed] dark:hover:bg-[#172a3f]"
                  type="button"
                  onClick={cancelEditMode}
                >
                  <X size={16} />
                  Hủy chỉnh sửa
                </button>
                <button
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-cyan-600 px-4 text-sm font-semibold text-white transition hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-cyan-500 dark:text-[#062235] dark:hover:bg-cyan-400"
                  type="button"
                  disabled={!selectedFile}
                  onClick={savePdfEdit}
                >
                  <CheckCircle2 size={16} />
                  Lưu
                </button>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(260px,0.7fr)]">
              <button
                className={`min-h-28 rounded-lg border border-dashed p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  isDraggingFile
                    ? "border-cyan-400 bg-cyan-50 dark:bg-[#102a41]"
                    : "border-slate-300 bg-white hover:border-cyan-400 hover:bg-cyan-50/50 dark:border-[#34465c] dark:bg-[#071624] dark:hover:bg-[#102a41]/60"
                }`}
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDraggingFile(true);
                }}
                onDragLeave={() => setIsDraggingFile(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDraggingFile(false);
                  selectUploadFile(event.dataTransfer.files.item(0) ?? undefined);
                }}
              >
                <input
                  ref={uploadInputRef}
                  className="hidden"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(event) => selectUploadFile(event.target.files?.item(0) ?? undefined)}
                />
                <div className="flex h-full items-center justify-center gap-4 max-sm:flex-col max-sm:text-center">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cyan-50 text-cyan-600 dark:bg-[#102a41] dark:text-cyan-300">
                    <UploadCloud size={22} />
                  </div>
                  <div>
                    <p className="m-0 text-sm font-bold text-slate-800 dark:text-[#f4f8ff]">Upload PDF mới</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-[#9ba8b7]">Kéo thả file PDF vào đây hoặc chọn file</p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-[#738398]">Chỉ hỗ trợ file .pdf, tối đa 20MB</p>
                    {selectedFile ? <p className="mt-3 truncate text-sm font-semibold text-cyan-700 dark:text-cyan-300">{selectedFile.name}</p> : null}
                    {uploadError ? (
                      <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-300">
                        <AlertCircle size={15} />
                        {uploadError}
                      </p>
                    ) : null}
                  </div>
                </div>
              </button>

              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-[#34465c] dark:bg-[#071624]">
                <p className="m-0 text-sm font-bold text-slate-800 dark:text-[#f4f8ff]">File PDF hiện tại</p>
                <div className="mt-4 flex items-start gap-3">
                  <FileText className="mt-0.5 shrink-0 text-cyan-600 dark:text-cyan-300" size={20} />
                  <div className="min-w-0">
                    <p className="m-0 truncate text-sm font-semibold text-slate-800 dark:text-[#f4f8ff]">{currentFileInfo.name}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-[#9ba8b7]">Cập nhật: {currentFileInfo.updatedAt}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-[#9ba8b7]">Dung lượng: {currentFileInfo.size}</p>
                  </div>
                </div>
                <a
                  className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:border-cyan-400 hover:text-cyan-600 dark:border-[#34465c] dark:text-[#d8e2ed] dark:hover:text-cyan-300"
                  href={currentPdfUrl}
                  download={currentFileInfo.name}
                >
                  <Download size={16} />
                  Download file cũ
                </a>
              </div>
            </div>
          </section>
        ) : null}
        <div className="flex min-h-14 flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-100 px-5 py-2 dark:border-[#34465c] dark:bg-[#1f2937]">
          <div className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white p-1 dark:border-[#34465c] dark:bg-[#102033]">
            <button
              className="grid h-8 w-8 place-items-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-40 dark:text-[#b7c4d4] dark:hover:bg-[#172a3f] dark:hover:text-cyan-300"
              type="button"
              aria-label="Previous page"
              title="Previous page"
              disabled={activePage <= 1}
              onClick={() => goToPage(activePage - 1)}
            >
              <ChevronLeft size={17} />
            </button>
            <form
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-[#d8e2ed]"
              onSubmit={(event) => {
                event.preventDefault();
                submitPageInput();
              }}
            >
              <input
                className="h-8 w-14 rounded-md border border-slate-300 bg-white px-2 text-center text-sm font-semibold text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 dark:border-[#2f4358] dark:bg-[#071624] dark:text-[#f4f8ff]"
                type="number"
                min={1}
                max={totalPages}
                value={pageInput}
                aria-label="Page number"
                onBlur={submitPageInput}
                onChange={(event) => setPageInput(event.target.value)}
              />
              <span className="text-slate-400 dark:text-[#738398]">/</span>
              <span className="min-w-6 text-center">{totalPages}</span>
            </form>
            <button
              className="grid h-8 w-8 place-items-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-40 dark:text-[#b7c4d4] dark:hover:bg-[#172a3f] dark:hover:text-cyan-300"
              type="button"
              aria-label="Next page"
              title="Next page"
              disabled={activePage >= totalPages}
              onClick={() => goToPage(activePage + 1)}
            >
              <ChevronRight size={17} />
            </button>
          </div>

          <div className="h-8 border-l border-slate-300 dark:border-[#34465c]" />

          <div className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white p-1 dark:border-[#34465c] dark:bg-[#102033]">
            <span className="min-w-16 px-2 text-center text-sm font-semibold text-slate-700 dark:text-[#d8e2ed]">{zoomPercent}%</span>
            <button
              className="grid h-8 w-8 place-items-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-cyan-700 dark:text-[#b7c4d4] dark:hover:bg-[#172a3f] dark:hover:text-cyan-300"
              type="button"
              aria-label="Zoom out"
              title="Zoom out"
              onClick={() => zoomCapabilityRef.current?.zoomOut?.()}
            >
              <ZoomOut size={17} />
            </button>
            <button
              className="grid h-8 w-8 place-items-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-cyan-700 dark:text-[#b7c4d4] dark:hover:bg-[#172a3f] dark:hover:text-cyan-300"
              type="button"
              aria-label="Zoom in"
              title="Zoom in"
              onClick={() => zoomCapabilityRef.current?.zoomIn?.()}
            >
              <ZoomIn size={17} />
            </button>
            <button
              className="grid h-8 w-8 place-items-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-cyan-700 dark:text-[#b7c4d4] dark:hover:bg-[#172a3f] dark:hover:text-cyan-300"
              type="button"
              aria-label="Reset zoom"
              title="Reset zoom"
              onClick={() => zoomCapabilityRef.current?.requestZoom?.(1)}
            >
              <RotateCcw size={16} />
            </button>
          </div>

          <div className="h-8 border-l border-slate-300 dark:border-[#34465c]" />

          <form
            className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1 dark:border-[#34465c] dark:bg-[#102033] max-sm:min-w-full"
            onSubmit={(event) => {
              event.preventDefault();
              submitSearch();
            }}
          >
            <Search className="shrink-0 text-slate-500 dark:text-[#9ba8b7]" size={17} />
            <input
              className="h-8 min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400 dark:text-[#f4f8ff] dark:placeholder:text-[#66788c]"
              type="search"
              value={searchQuery}
              placeholder="Search in document"
              aria-label="Search in document"
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </form>
        </div>
        <div className="min-h-0 flex-1">
          <PDFViewer
            key={`${viewerVersion}-${appTheme}`}
            config={{
              src: viewerSrc,
              theme: {
                preference: appTheme,
                light: {
                  background: {
                    app: "#eef3f8",
                    surface: "#f8fafc",
                    surfaceAlt: "#e8eef5",
                    elevated: "#ffffff",
                    input: "#ffffff"
                  },
                  foreground: {
                    primary: "#0f172a",
                    secondary: "#475569",
                    muted: "#64748b"
                  },
                  border: {
                    default: "#cbd5e1",
                    subtle: "#dbe4ee",
                    strong: "#94a3b8"
                  },
                  interactive: {
                    hover: "#e2e8f0",
                    active: "#dbeafe",
                    selected: "#e0f2fe",
                    focus: "#06b6d4",
                    focusRing: "rgba(6, 182, 212, 0.28)"
                  },
                  accent: {
                    primary: "#0891b2",
                    primaryHover: "#0e7490",
                    primaryActive: "#155e75",
                    primaryLight: "#cffafe",
                    primaryForeground: "#ffffff"
                  },
                  scrollbar: {
                    track: "#e8eef5",
                    thumb: "#94a3b8",
                    thumbHover: "#64748b"
                  }
                },
                dark: {
                  background: {
                    app: "#111827",
                    surface: "#1f2937",
                    surfaceAlt: "#243244",
                    elevated: "#0f1e2e",
                    input: "#102033"
                  },
                  border: {
                    default: "#34465c",
                    subtle: "#243447"
                  },
                  accent: {
                    primary: "#22d3ee",
                    primaryHover: "#67e8f9",
                    primaryActive: "#0891b2",
                    primaryLight: "#102a41",
                    primaryForeground: "#082f49"
                  }
                }
              },
              tabBar: "never",
              ui: {
                schema: {
                  id: "support-pdf-viewer",
                  version: "1.0.0",
                  toolbars: {
                    "main-toolbar": {
                      id: "main-toolbar",
                      position: { placement: "top", slot: "main", order: 0 },
                      permanent: true,
                      items: []
                    }
                  },
                  menus: {},
                  sidebars: {},
                  modals: {},
                  overlays: {},
                  selectionMenus: {}
                } as any
              },
              disabledCategories: [
                "annotation",
                "attachment",
                "capture",
                "document",
                "export",
                "form",
                "fullscreen",
                "history",
                "pan",
                "print",
                "redaction",
                "rotate",
                "selection",
                "stamp",
                "tools"
              ]
            }}
            style={{ height: "100%", width: "100%" }}
            onReady={handleViewerReady}
          />
        </div>
      </section>
    </div>
      <Dialog open={replaceConfirmOpen} onOpenChange={setReplaceConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận thay thế PDF</DialogTitle>
            <DialogDescription>Sau khi bạn lưu thay đổi, File PDF mới sẽ thay thế file PDF hiện tại.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-[#34465c] dark:bg-[#102033] dark:text-[#d8e2ed] dark:hover:bg-[#172a3f]"
              type="button"
              onClick={() => setReplaceConfirmOpen(false)}
            >
              Hủy
            </button>
            <button
              className="inline-flex h-9 items-center justify-center rounded-lg bg-cyan-600 px-4 text-sm font-semibold text-white transition hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:bg-cyan-500 dark:text-[#062235] dark:hover:bg-cyan-400"
              type="button"
              onClick={confirmPdfReplace}
            >
              Lưu thay đổi
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(tocDialog)} onOpenChange={(open) => !open && setTocDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tocDialog?.mode === "add" ? "Thêm một mục cùng cấp với mục lục hiện tại." : "Cập nhật tên danh mục và số trang trên giao diện hiện tại."}</DialogTitle>
            <DialogDescription>
              {tocDialog?.mode === "add" ? "Thêm một mục cùng cấp với mục lục hiện tại." : "Cập nhật tên danh mục và số trang trên giao diện hiện tại."}
            </DialogDescription>
          </DialogHeader>
          {tocDialog ? (
            <form
              className="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                submitTocDialog();
              }}
            >
              <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-[#d8e2ed]">
                <span>Tên danh mục</span>
                <input
                  className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/25 dark:border-[#34465c] dark:bg-[#102033] dark:text-[#f4f8ff]"
                  value={tocDialog.title}
                  onChange={(event) => setTocDialog((current) => (current ? { ...current, title: event.target.value } : current))}
                  required
                />
              </label>
              {tocDialog.mode === "add" ? (
                <fieldset className="grid gap-2 rounded-md border border-slate-200 p-3 text-sm text-slate-700 dark:border-[#34465c] dark:text-[#d8e2ed]">
                  <legend className="px-1 text-sm font-medium">Vị trí thêm</legend>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="toc-position"
                      checked={tocDialog.position === "above"}
                      onChange={() => setTocDialog((current) => (current?.mode === "add" ? { ...current, position: "above" } : current))}
                    />
                    Trên danh mục hiện tại
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="toc-position"
                      checked={tocDialog.position === "below"}
                      onChange={() => setTocDialog((current) => (current?.mode === "add" ? { ...current, position: "below" } : current))}
                    />
                    Dưới danh mục hiện tại
                  </label>
                </fieldset>
              ) : null}
              <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-[#d8e2ed]">
                <span>Số trang</span>
                <input
                  className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/25 dark:border-[#34465c] dark:bg-[#102033] dark:text-[#f4f8ff]"
                  type="number"
                  min={1}
                  value={tocDialog.page}
                  onChange={(event) => setTocDialog((current) => (current ? { ...current, page: event.target.value } : current))}
                  required
                />
              </label>
              <DialogFooter>
                <button
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-[#34465c] dark:bg-[#102033] dark:text-[#d8e2ed] dark:hover:bg-[#172a3f]"
                  type="button"
                  onClick={() => setTocDialog(null)}
                >
                  Hủy
                </button>
                <button
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-cyan-600 px-4 text-sm font-semibold text-white transition hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:bg-cyan-500 dark:text-[#062235] dark:hover:bg-cyan-400"
                  type="submit"
                >
                  {tocDialog.mode === "add" ? "Thêm mới" : "Lưu"}
                </button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
