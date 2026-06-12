import type { ManualPdf, OutlineItem } from "@/lib/api/support-api";

// const manualOutline: OutlineItem[] = [
//   {
//     id: "chapter-overview",
//     title: "1. システム概要",
//     page: 4,
//     children: [
//       {
//         id: "chapter-overview-introduction",
//         title: "1.1 はじめに",
//         page: 4
//       },
//       {
//         id: "chapter-overview-login",
//         title: "1.2 ログイン方法",
//         page: 5
//       }
//     ]
//   },
//   {
//     id: "chapter-map",
//     title: "2. 地図の使い方",
//     page: 8,
//     children: [
//       {
//         id: "chapter-map-basic",
//         title: "2.1 地図の基本操作",
//         page: 8
//       },
//       {
//         id: "chapter-map-layer",
//         title: "2.2 レイヤーの切り替え方法",
//         page: 10
//       },
//       {
//         id: "chapter-map-route",
//         title: "2.3 路線・区間を選択する",
//         page: 12
//       }
//     ]
//   },
//   {
//     id: "chapter-monitoring-point",
//     title: "3. 撮影ポイントの確認方法",
//     page: 16,
//     children: [
//       {
//         id: "chapter-monitoring-point-list",
//         title: "3.1 撮影ポイントを確認する",
//         page: 16
//       },
//       {
//         id: "chapter-monitoring-point-detail",
//         title: "3.2 監視地点の詳細を確認する",
//         page: 18
//       }
//     ]
//   },
//   {
//     id: "chapter-video",
//     title: "4. 動画の確認方法",
//     page: 22,
//     children: [
//       {
//         id: "chapter-video-play",
//         title: "4.1 走行動画を再生する",
//         page: 22
//       },
//       {
//         id: "chapter-video-damage",
//         title: "4.2 損傷箇所を動画で確認する",
//         page: 24
//       }
//     ]
//   },
//   {
//     id: "chapter-report",
//     title: "5. レポートの見方",
//     page: 28,
//     children: [
//       {
//         id: "chapter-report-inspection",
//         title: "5.1 点検レポートを確認する",
//         page: 28
//       }
//     ]
//   },
//   {
//     id: "chapter-faq",
//     title: "6. FAQ",
//     page: 32,
//     children: [
//       {
//         id: "chapter-faq-search",
//         title: "6.1 キーワードで検索する",
//         page: 32
//       }
//     ]
//   }
// ];

const manualOutline: OutlineItem[] = [
  { id: "0-表紙", title: "表紙", page: 1 },
  { id: "1-目次", title: "目次", page: 2 },
  {
    id: "2-1. システム概要",
    title: "1. システム概要",
    page: 4,
    children: [
      { id: "3-1.1 概要", title: "1.1 概要", page: 4 },
      { id: "4-1.2 操作手順", title: "1.2 操作手順", page: 4 },
      { id: "5-1.3 入力項目", title: "1.3 入力項目", page: 4 },
      { id: "6-1.4 確認ポイント", title: "1.4 確認ポイント", page: 4 },
    ],
  },
  {
    id: "7-2. ログインと初期設定",
    title: "2. ログインと初期設定",
    page: 5,
    children: [
      { id: "8-2.1 概要", title: "2.1 概要", page: 5 },
      { id: "9-2.2 操作手順", title: "2.2 操作手順", page: 5 },
      { id: "10-2.3 入力項目", title: "2.3 入力項目", page: 5 },
      { id: "11-2.4 確認ポイント", title: "2.4 確認ポイント", page: 5 },
    ],
  },
  {
    id: "12-3. ダッシュボードの確認",
    title: "3. ダッシュボードの確認",
    page: 6,
    children: [
      { id: "13-3.1 概要", title: "3.1 概要", page: 6 },
      { id: "14-3.2 操作手順", title: "3.2 操作手順", page: 6 },
      { id: "15-3.3 入力項目", title: "3.3 入力項目", page: 6 },
      { id: "16-3.4 確認ポイント", title: "3.4 確認ポイント", page: 6 },
    ],
  },
  {
    id: "17-4. 地図画面の操作",
    title: "4. 地図画面の操作",
    page: 7,
    children: [
      { id: "18-4.1 概要", title: "4.1 概要", page: 7 },
      { id: "19-4.2 操作手順", title: "4.2 操作手順", page: 7 },
      { id: "20-4.3 入力項目", title: "4.3 入力項目", page: 7 },
      { id: "21-4.4 確認ポイント", title: "4.4 確認ポイント", page: 7 },
    ],
  },
  {
    id: "22-5. 点検ポイント管理",
    title: "5. 点検ポイント管理",
    page: 8,
    children: [
      { id: "23-5.1 概要", title: "5.1 概要", page: 8 },
      { id: "24-5.2 操作手順", title: "5.2 操作手順", page: 8 },
      { id: "25-5.3 入力項目", title: "5.3 入力項目", page: 8 },
      { id: "26-5.4 確認ポイント", title: "5.4 確認ポイント", page: 8 },
    ],
  },
  {
    id: "27-6. 路線情報管理",
    title: "6. 路線情報管理",
    page: 9,
    children: [
      { id: "28-6.1 概要", title: "6.1 概要", page: 9 },
      { id: "29-6.2 操作手順", title: "6.2 操作手順", page: 9 },
      { id: "30-6.3 入力項目", title: "6.3 入力項目", page: 9 },
      { id: "31-6.4 確認ポイント", title: "6.4 確認ポイント", page: 9 },
    ],
  },
  {
    id: "32-7. 現場写真の登録",
    title: "7. 現場写真の登録",
    page: 10,
    children: [
      { id: "33-7.1 概要", title: "7.1 概要", page: 10 },
      { id: "34-7.2 操作手順", title: "7.2 操作手順", page: 10 },
      { id: "35-7.3 入力項目", title: "7.3 入力項目", page: 10 },
      { id: "36-7.4 確認ポイント", title: "7.4 確認ポイント", page: 10 },
    ],
  },
  {
    id: "37-8. 調査動画のアップロード",
    title: "8. 調査動画のアップロード",
    page: 11,
    children: [
      { id: "38-8.1 概要", title: "8.1 概要", page: 11 },
      { id: "39-8.2 操作手順", title: "8.2 操作手順", page: 11 },
      { id: "40-8.3 入力項目", title: "8.3 入力項目", page: 11 },
      { id: "41-8.4 確認ポイント", title: "8.4 確認ポイント", page: 11 },
    ],
  },
  {
    id: "42-9. AI損傷検出",
    title: "9. AI損傷検出",
    page: 12,
    children: [
      { id: "43-9.1 概要", title: "9.1 概要", page: 12 },
      { id: "44-9.2 操作手順", title: "9.2 操作手順", page: 12 },
      { id: "45-9.3 入力項目", title: "9.3 入力項目", page: 12 },
      { id: "46-9.4 確認ポイント", title: "9.4 確認ポイント", page: 12 },
    ],
  },
  {
    id: "47-10. ポットホール判定",
    title: "10. ポットホール判定",
    page: 13,
    children: [
      { id: "48-10.1 概要", title: "10.1 概要", page: 13 },
      { id: "49-10.2 操作手順", title: "10.2 操作手順", page: 13 },
      { id: "50-10.3 入力項目", title: "10.3 入力項目", page: 13 },
      { id: "51-10.4 確認ポイント", title: "10.4 確認ポイント", page: 13 },
    ],
  },
  {
    id: "52-11. ひび割れ判定",
    title: "11. ひび割れ判定",
    page: 14,
    children: [
      { id: "53-11.1 概要", title: "11.1 概要", page: 14 },
      { id: "54-11.2 操作手順", title: "11.2 操作手順", page: 14 },
      { id: "55-11.3 入力項目", title: "11.3 入力項目", page: 14 },
      { id: "56-11.4 確認ポイント", title: "11.4 確認ポイント", page: 14 },
    ],
  },
  {
    id: "57-12. 点検タスク作成",
    title: "12. 点検タスク作成",
    page: 15,
    children: [
      { id: "58-12.1 概要", title: "12.1 概要", page: 15 },
      { id: "59-12.2 操作手順", title: "12.2 操作手順", page: 15 },
      { id: "60-12.3 入力項目", title: "12.3 入力項目", page: 15 },
      { id: "61-12.4 確認ポイント", title: "12.4 確認ポイント", page: 15 },
    ],
  },
  {
    id: "62-13. 作業指示と現場対応",
    title: "13. 作業指示と現場対応",
    page: 16,
    children: [
      { id: "63-13.1 概要", title: "13.1 概要", page: 16 },
      { id: "64-13.2 操作手順", title: "13.2 操作手順", page: 16 },
      { id: "65-13.3 入力項目", title: "13.3 入力項目", page: 16 },
      { id: "66-13.4 確認ポイント", title: "13.4 確認ポイント", page: 16 },
    ],
  },
  {
    id: "67-14. 結果登録と承認",
    title: "14. 結果登録と承認",
    page: 17,
    children: [
      { id: "68-14.1 概要", title: "14.1 概要", page: 17 },
      { id: "69-14.2 操作手順", title: "14.2 操作手順", page: 17 },
      { id: "70-14.3 入力項目", title: "14.3 入力項目", page: 17 },
      { id: "71-14.4 確認ポイント", title: "14.4 確認ポイント", page: 17 },
    ],
  },
  {
    id: "72-15. 検索機能",
    title: "15. 検索機能",
    page: 18,
    children: [
      { id: "73-15.1 概要", title: "15.1 概要", page: 18 },
      { id: "74-15.2 操作手順", title: "15.2 操作手順", page: 18 },
      { id: "75-15.3 入力項目", title: "15.3 入力項目", page: 18 },
      { id: "76-15.4 確認ポイント", title: "15.4 確認ポイント", page: 18 },
    ],
  },
  {
    id: "77-16. フィルター機能",
    title: "16. フィルター機能",
    page: 19,
    children: [
      { id: "78-16.1 概要", title: "16.1 概要", page: 19 },
      { id: "79-16.2 操作手順", title: "16.2 操作手順", page: 19 },
      { id: "80-16.3 入力項目", title: "16.3 入力項目", page: 19 },
      { id: "81-16.4 確認ポイント", title: "16.4 確認ポイント", page: 19 },
    ],
  },
  {
    id: "82-17. 通知機能",
    title: "17. 通知機能",
    page: 20,
    children: [
      { id: "83-17.1 概要", title: "17.1 概要", page: 20 },
      { id: "84-17.2 操作手順", title: "17.2 操作手順", page: 20 },
      { id: "85-17.3 入力項目", title: "17.3 入力項目", page: 20 },
      { id: "86-17.4 確認ポイント", title: "17.4 確認ポイント", page: 20 },
    ],
  },
  {
    id: "87-18. レポート作成",
    title: "18. レポート作成",
    page: 21,
    children: [
      { id: "88-18.1 概要", title: "18.1 概要", page: 21 },
      { id: "89-18.2 操作手順", title: "18.2 操作手順", page: 21 },
      { id: "90-18.3 入力項目", title: "18.3 入力項目", page: 21 },
      { id: "91-18.4 確認ポイント", title: "18.4 確認ポイント", page: 21 },
    ],
  },
  {
    id: "92-19. PDF出力",
    title: "19. PDF出力",
    page: 22,
    children: [
      { id: "93-19.1 概要", title: "19.1 概要", page: 22 },
      { id: "94-19.2 操作手順", title: "19.2 操作手順", page: 22 },
      { id: "95-19.3 入力項目", title: "19.3 入力項目", page: 22 },
      { id: "96-19.4 確認ポイント", title: "19.4 確認ポイント", page: 22 },
    ],
  },
  {
    id: "97-20. CSV出力",
    title: "20. CSV出力",
    page: 23,
    children: [
      { id: "98-20.1 概要", title: "20.1 概要", page: 23 },
      { id: "99-20.2 操作手順", title: "20.2 操作手順", page: 23 },
      { id: "100-20.3 入力項目", title: "20.3 入力項目", page: 23 },
      { id: "101-20.4 確認ポイント", title: "20.4 確認ポイント", page: 23 },
    ],
  },
  {
    id: "102-21. ユーザー管理",
    title: "21. ユーザー管理",
    page: 24,
    children: [
      { id: "103-21.1 概要", title: "21.1 概要", page: 24 },
      { id: "104-21.2 操作手順", title: "21.2 操作手順", page: 24 },
      { id: "105-21.3 入力項目", title: "21.3 入力項目", page: 24 },
      { id: "106-21.4 確認ポイント", title: "21.4 確認ポイント", page: 24 },
    ],
  },
  {
    id: "107-22. 権限管理",
    title: "22. 権限管理",
    page: 25,
    children: [
      { id: "108-22.1 概要", title: "22.1 概要", page: 25 },
      { id: "109-22.2 操作手順", title: "22.2 操作手順", page: 25 },
      { id: "110-22.3 入力項目", title: "22.3 入力項目", page: 25 },
      { id: "111-22.4 確認ポイント", title: "22.4 確認ポイント", page: 25 },
    ],
  },
  {
    id: "112-23. マスタ設定",
    title: "23. マスタ設定",
    page: 26,
    children: [
      { id: "113-23.1 概要", title: "23.1 概要", page: 26 },
      { id: "114-23.2 操作手順", title: "23.2 操作手順", page: 26 },
      { id: "115-23.3 入力項目", title: "23.3 入力項目", page: 26 },
      { id: "116-23.4 確認ポイント", title: "23.4 確認ポイント", page: 26 },
    ],
  },
  {
    id: "117-24. API連携",
    title: "24. API連携",
    page: 27,
    children: [
      { id: "118-24.1 概要", title: "24.1 概要", page: 27 },
      { id: "119-24.2 操作手順", title: "24.2 操作手順", page: 27 },
      { id: "120-24.3 入力項目", title: "24.3 入力項目", page: 27 },
      { id: "121-24.4 確認ポイント", title: "24.4 確認ポイント", page: 27 },
    ],
  },
  {
    id: "122-25. 監査ログ",
    title: "25. 監査ログ",
    page: 28,
    children: [
      { id: "123-25.1 概要", title: "25.1 概要", page: 28 },
      { id: "124-25.2 操作手順", title: "25.2 操作手順", page: 28 },
      { id: "125-25.3 入力項目", title: "25.3 入力項目", page: 28 },
      { id: "126-25.4 確認ポイント", title: "25.4 確認ポイント", page: 28 },
    ],
  },
  {
    id: "127-26. バックアップと復元",
    title: "26. バックアップと復元",
    page: 29,
    children: [
      { id: "128-26.1 概要", title: "26.1 概要", page: 29 },
      { id: "129-26.2 操作手順", title: "26.2 操作手順", page: 29 },
      { id: "130-26.3 入力項目", title: "26.3 入力項目", page: 29 },
      { id: "131-26.4 確認ポイント", title: "26.4 確認ポイント", page: 29 },
    ],
  },
  {
    id: "132-27. FAQとトラブル対応",
    title: "27. FAQとトラブル対応",
    page: 30,
    children: [
      { id: "133-27.1 概要", title: "27.1 概要", page: 30 },
      { id: "134-27.2 操作手順", title: "27.2 操作手順", page: 30 },
      { id: "135-27.3 入力項目", title: "27.3 入力項目", page: 30 },
      { id: "136-27.4 確認ポイント", title: "27.4 確認ポイント", page: 30 },
    ],
  },
];

const manualPdf: ManualPdf = {
  pdfUrl: "/Road_Inspection_Manual_JP_Outline_30Pages.pdf",
  fileName: "Road_Inspection_Manual_JP_Outline_30Pages.pdf",
  updatedAt: "2026/06/11 14:30",
  size: "27414KB"
};

export function getManualOutlineData() {
  return manualOutline;
}

export function getManualPdfData() {
  return manualPdf;
}
