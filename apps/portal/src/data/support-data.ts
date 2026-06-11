import type { ManualPdf, OutlineItem } from "@/lib/api/support-api";

const manualOutline: OutlineItem[] = [
  {
    id: "chapter-overview",
    title: "1. システム概要",
    page: 4,
    children: [
      {
        id: "chapter-overview-introduction",
        title: "1.1 はじめに",
        page: 4
      },
      {
        id: "chapter-overview-login",
        title: "1.2 ログイン方法",
        page: 5
      }
    ]
  },
  {
    id: "chapter-map",
    title: "2. 地図の使い方",
    page: 8,
    children: [
      {
        id: "chapter-map-basic",
        title: "2.1 地図の基本操作",
        page: 8
      },
      {
        id: "chapter-map-layer",
        title: "2.2 レイヤーの切り替え方法",
        page: 10
      },
      {
        id: "chapter-map-route",
        title: "2.3 路線・区間を選択する",
        page: 12
      }
    ]
  },
  {
    id: "chapter-monitoring-point",
    title: "3. 撮影ポイントの確認方法",
    page: 16,
    children: [
      {
        id: "chapter-monitoring-point-list",
        title: "3.1 撮影ポイントを確認する",
        page: 16
      },
      {
        id: "chapter-monitoring-point-detail",
        title: "3.2 監視地点の詳細を確認する",
        page: 18
      }
    ]
  },
  {
    id: "chapter-video",
    title: "4. 動画の確認方法",
    page: 22,
    children: [
      {
        id: "chapter-video-play",
        title: "4.1 走行動画を再生する",
        page: 22
      },
      {
        id: "chapter-video-damage",
        title: "4.2 損傷箇所を動画で確認する",
        page: 24
      }
    ]
  },
  {
    id: "chapter-report",
    title: "5. レポートの見方",
    page: 28,
    children: [
      {
        id: "chapter-report-inspection",
        title: "5.1 点検レポートを確認する",
        page: 28
      }
    ]
  },
  {
    id: "chapter-faq",
    title: "6. FAQ",
    page: 32,
    children: [
      {
        id: "chapter-faq-search",
        title: "6.1 キーワードで検索する",
        page: 32
      }
    ]
  }
];

const manualPdf: ManualPdf = {
  pdfUrl: "/tai_lieu_quan_ly_duong_bo_co_muc_luc.pdf",
  fileName: "tai_lieu_quan_ly_duong_bo_co_muc_luc.pdf",
  updatedAt: "2026/06/11 14:30",
  size: "86.6KB"
};

export function getManualOutlineData() {
  return manualOutline;
}

export function getManualPdfData() {
  return manualPdf;
}
