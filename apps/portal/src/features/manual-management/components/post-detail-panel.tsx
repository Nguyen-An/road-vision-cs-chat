"use client";

import dynamic from "next/dynamic";
import { BookOpen, ChevronDown, ChevronLeft, ChevronRight, Download, Expand, FileText, Loader2, RotateCcw, Search, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/app/theme-provider";
import type { Category, Post } from "@/lib/api/support-api";
import { loadingClass } from "@/features/manual-management/components/manual-management-styles";

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

const localPdfUrl = "/tai_lieu_quan_ly_duong_bo_co_muc_luc.pdf";
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

type PostDetailPanelProps = {
  category: Category;
  isError: boolean;
  isLoading: boolean;
  post?: Post;
};

function flattenOutline(items: PdfOutlineSourceItem[] | null | undefined, level = 0): PdfOutlineSourceItem[] {
  if (!items?.length) return [];
  return items.flatMap((item) => [Object.assign({}, item, { level }), ...flattenOutline(item.items, level + 1)]);
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

function inferPageFromPrintedToc(title: string, pagesByTitle: Map<string, number>, sectionPages: Map<string, number>) {
  const exactPage = pagesByTitle.get(normalizeOutlineTitle(title));
  if (exactPage) return exactPage;

  const sectionMatch = title.match(/^(\d+)(?:\.|\s)/);
  return sectionMatch ? sectionPages.get(sectionMatch[1]) : undefined;
}

export function PostDetailPanel({ category, isError, isLoading, post }: PostDetailPanelProps) {
  const { theme: appTheme } = useTheme();
  const [outline, setOutline] = useState<PdfOutlineItem[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [outlineLoading, setOutlineLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoomPercent, setZoomPercent] = useState(100);
  const [viewerVersion, setViewerVersion] = useState(0);
  const [viewerInitialPage, setViewerInitialPage] = useState(1);
  const viewerPanelRef = useRef<HTMLDivElement>(null);
  const scrollCapabilityRef = useRef<any>(null);
  const searchCapabilityRef = useRef<any>(null);
  const zoomCapabilityRef = useRef<any>(null);
  const unsubscribePageChangeRef = useRef<(() => void) | null>(null);
  const unsubscribeLayoutReadyRef = useRef<(() => void) | null>(null);
  const unsubscribeZoomChangeRef = useRef<(() => void) | null>(null);
  const viewerSrc = viewerInitialPage > 1 ? `${localPdfUrl}#page=${viewerInitialPage}` : localPdfUrl;

  useEffect(() => {
    let cancelled = false;

    async function loadOutline() {
      setOutlineLoading(true);
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
        const pdf = await pdfjs.getDocument({ url: localPdfUrl }).promise;
        if (!cancelled) setTotalPages(pdf.numPages);
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

        if (!cancelled) {
          const nextOutline = flattenedItems.filter((item) => item.title.trim());
          setOutline(nextOutline);
          setExpandedSections((current) => {
            const next = { ...current };
            nextOutline.forEach((item) => {
              if (item.level === 0 && next[item.id] === undefined) {
                next[item.id] = true;
              }
            });
            return next;
          });
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
  }, []);

  useEffect(() => {
    return () => {
      unsubscribePageChangeRef.current?.();
      unsubscribeLayoutReadyRef.current?.();
      unsubscribeZoomChangeRef.current?.();
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
    if (item.hasChildren) {
      setExpandedSections((current) => ({
        ...current,
        [item.id]: current[item.id] === false
      }));
    }
    goToPage(item.page);
  };

  const toggleFullscreen = () => {
    const fullscreenElement = document.fullscreenElement;
    if (fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    void viewerPanelRef.current?.requestFullscreen();
  };

  if (isLoading) return <div className={loadingClass}>Loading post detail...</div>;
  if (isError || !post) return <div className={loadingClass}>Unable to load post detail.</div>;

  return (
    <div className="grid h-full min-h-0 grid-cols-[320px_minmax(0,1fr)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-[#243447] dark:bg-[#071624] max-[900px]:grid-cols-1">
      <aside className="min-h-0 border-r border-slate-200 bg-slate-50/80 dark:border-[#243447] dark:bg-[#0b1a29] max-[900px]:max-h-[32dvh] max-[900px]:border-b max-[900px]:border-r-0">
        <div className="flex h-full min-h-0 flex-col">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-[#243447]">
            <p className="m-0 text-sm font-bold text-slate-700 dark:text-[#d8e2ed]">Mục lục (PDF)</p>
            <p className="mt-1 truncate text-xs text-slate-500 dark:text-[#738398]">{category.title}</p>
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
                  <li key={item.id}>
                    <button
                      className={`grid min-h-9 w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition hover:bg-cyan-50 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:hover:bg-[#102a41] dark:hover:text-cyan-300 ${
                        item.page === activePage ? "bg-cyan-50 text-cyan-700 dark:bg-[#102a41] dark:text-cyan-300" : "text-slate-600 dark:text-[#b7c4d4]"
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
        <header className="flex min-h-[58px] items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 dark:border-[#243447] dark:bg-[#0b1a29] max-sm:grid">
          <div className="flex min-w-0 flex-1 items-center gap-4 max-sm:grid">
            <div className="min-w-0">
              <h1 className="m-0 truncate text-lg font-bold text-slate-950 dark:text-[#f4f8ff]">{post.title} (PDF)</h1>
              <p className="mt-1 truncate text-xs text-slate-500 dark:text-[#9ba8b7]">{post.description}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-cyan-400 hover:text-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-[#243447] dark:text-[#9ba8b7] dark:hover:text-cyan-300"
              href={localPdfUrl}
              download
              aria-label="Download PDF"
              title="Download PDF"
            >
              <Download size={17} />
            </a>
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
  );
}
