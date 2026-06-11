"use client";

import dynamic from "next/dynamic";
import { BookOpen, ChevronDown, ChevronRight, Download, Expand, FileText, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [outline, setOutline] = useState<PdfOutlineItem[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [outlineLoading, setOutlineLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [viewerVersion, setViewerVersion] = useState(0);
  const [viewerInitialPage, setViewerInitialPage] = useState(1);
  const viewerPanelRef = useRef<HTMLDivElement>(null);
  const scrollCapabilityRef = useRef<any>(null);
  const unsubscribePageChangeRef = useRef<(() => void) | null>(null);
  const viewerSrc = viewerInitialPage > 1 ? `${localPdfUrl}#page=${viewerInitialPage}` : localPdfUrl;

  useEffect(() => {
    let cancelled = false;

    async function loadOutline() {
      setOutlineLoading(true);
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
        const pdf = await pdfjs.getDocument({ url: localPdfUrl }).promise;
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
    };
  }, []);

  const handleViewerReady = (registry: any) => {
    const scrollPlugin = registry.getPlugin("scroll") ?? registry.getCapabilityProvider("scroll");
    const scrollCapability = scrollPlugin?.provides?.();
    scrollCapabilityRef.current = scrollCapability;
    unsubscribePageChangeRef.current?.();
    unsubscribePageChangeRef.current = scrollCapability?.onPageChange?.((event: { pageNumber: number }) => {
      setActivePage(event.pageNumber);
    });
    window.setTimeout(() => {
      scrollCapability?.scrollToPage?.({ pageNumber: activePage });
    }, 0);
  };

  const goToPage = (page: number) => {
    const nextPage = Math.max(page, 1);
    setActivePage(nextPage);
    const scrollCapability = scrollCapabilityRef.current;
    if (scrollCapability?.scrollToPage) {
      scrollCapability.scrollToPage({ pageNumber: nextPage });
      return;
    }
    setViewerInitialPage(nextPage);
    setViewerVersion((version) => version + 1);
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

      <section ref={viewerPanelRef} className="flex min-h-0 flex-col bg-[#edf3f8] dark:bg-[#081827]">
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
        <div className="min-h-0 flex-1">
          <PDFViewer
            key={viewerVersion}
            config={{
              src: viewerSrc,
              theme: {
                preference: "dark"
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
                      items: [
                        {
                          type: "group",
                          id: "left-group",
                          alignment: "start",
                          gap: 2,
                          items: [
                            { type: "custom", id: "page-controls-inline", componentId: "page-controls", categories: ["page"] },
                            { type: "divider", id: "page-zoom-divider", orientation: "vertical" },
                            { type: "custom", id: "zoom-toolbar", componentId: "zoom-toolbar", categories: ["zoom"] },
                            { type: "divider", id: "zoom-tools-divider", orientation: "vertical" },
                            { type: "command-button", id: "search-button", commandId: "panel:toggle-search", variant: "icon", categories: ["panel", "panel-search"] }
                          ]
                        },
                        { type: "spacer", id: "spacer-1", flex: true }
                      ]
                    }
                  },
                  menus: {},
                  sidebars: {},
                  modals: {},
                  overlays: {
                    "page-controls": {
                      id: "page-controls",
                      position: { anchor: "bottom-center", offset: { bottom: "1.5rem" } },
                      content: { type: "component", componentId: "page-controls" },
                      defaultEnabled: false
                    }
                  },
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
