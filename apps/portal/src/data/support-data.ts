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
  {
    id: "chapter-system-overview",
    title: "1. システム概要",
    page: 3,
    children: [
      { id: "1-1", title: "1.1 システム概要", page: 3 },
      { id: "1-2", title: "1.2 利用目的", page: 3 },
      { id: "1-3", title: "1.3 主な機能", page: 4 },
      { id: "1-4", title: "1.4 利用対象者", page: 4 }
    ]
  },
  {
    id: "chapter-login",
    title: "2. ログインと認証",
    page: 5,
    children: [
      { id: "2-1", title: "2.1 ログイン方法", page: 5 },
      { id: "2-2", title: "2.2 パスワード管理", page: 5 },
      { id: "2-3", title: "2.3 二段階認証", page: 6 },
      { id: "2-4", title: "2.4 ログアウト", page: 6 }
    ]
  },
  {
    id: "chapter-dashboard",
    title: "3. ダッシュボード",
    page: 7,
    children: [
      { id: "3-1", title: "3.1 ダッシュボード概要", page: 7 },
      { id: "3-2", title: "3.2 KPIの確認", page: 7 },
      { id: "3-3", title: "3.3 アラート一覧", page: 8 },
      { id: "3-4", title: "3.4 ウィジェット設定", page: 8 }
    ]
  },
  {
    id: "chapter-map",
    title: "4. 地図画面",
    page: 9,
    children: [
      { id: "4-1", title: "4.1 地図の基本操作", page: 9 },
      { id: "4-2", title: "4.2 レイヤー管理", page: 9 },
      { id: "4-3", title: "4.3 路線検索", page: 10 },
      { id: "4-4", title: "4.4 エリア表示", page: 10 }
    ]
  },
  {
    id: "chapter-monitoring-point",
    title: "5. 点検ポイント管理",
    page: 11,
    children: [
      { id: "5-1", title: "5.1 ポイント一覧", page: 11 },
      { id: "5-2", title: "5.2 ポイント登録", page: 11 },
      { id: "5-3", title: "5.3 ポイント編集", page: 12 },
      { id: "5-4", title: "5.4 ポイント削除", page: 12 }
    ]
  },
  {
    id: "chapter-route",
    title: "6. 路線管理",
    page: 13,
    children: [
      { id: "6-1", title: "6.1 路線一覧", page: 13 },
      { id: "6-2", title: "6.2 路線登録", page: 13 },
      { id: "6-3", title: "6.3 路線編集", page: 14 },
      { id: "6-4", title: "6.4 路線検索", page: 14 }
    ]
  },
  {
    id: "chapter-video",
    title: "7. 動画アップロード",
    page: 15,
    children: [
      { id: "7-1", title: "7.1 動画登録", page: 15 },
      { id: "7-2", title: "7.2 アップロード履歴", page: 15 },
      { id: "7-3", title: "7.3 動画再生", page: 16 },
      { id: "7-4", title: "7.4 公開設定", page: 16 }
    ]
  },
  {
    id: "chapter-image",
    title: "8. 画像管理",
    page: 17,
    children: [
      { id: "8-1", title: "8.1 画像登録", page: 17 },
      { id: "8-2", title: "8.2 画像閲覧", page: 17 },
      { id: "8-3", title: "8.3 画像分類", page: 18 },
      { id: "8-4", title: "8.4 画像検索", page: 18 }
    ]
  },
  {
    id: "chapter-ai",
    title: "9. AI損傷検出",
    page: 19,
    children: [
      { id: "9-1", title: "9.1 AI解析概要", page: 19 },
      { id: "9-2", title: "9.2 検出結果確認", page: 19 },
      { id: "9-3", title: "9.3 精度評価", page: 20 },
      { id: "9-4", title: "9.4 手動補正", page: 20 }
    ]
  },
  {
    id: "chapter-pothole",
    title: "10. ポットホール管理",
    page: 21,
    children: [
      { id: "10-1", title: "10.1 ポットホール一覧", page: 21 },
      { id: "10-2", title: "10.2 優先度管理", page: 21 },
      { id: "10-3", title: "10.3 修復状況", page: 22 },
      { id: "10-4", title: "10.4 統計分析", page: 22 }
    ]
  },
  {
    id: "chapter-crack",
    title: "11. ひび割れ管理",
    page: 23,
    children: [
      { id: "11-1", title: "11.1 ひび割れ一覧", page: 23 },
      { id: "11-2", title: "11.2 損傷レベル", page: 23 },
      { id: "11-3", title: "11.3 補修管理", page: 24 },
      { id: "11-4", title: "11.4 履歴管理", page: 24 }
    ]
  },
  {
    id: "chapter-task",
    title: "12. 点検タスク作成",
    page: 25,
    children: [
      { id: "12-1", title: "12.1 タスク作成", page: 25 },
      { id: "12-2", title: "12.2 担当者割当", page: 25 },
      { id: "12-3", title: "12.3 締切設定", page: 26 },
      { id: "12-4", title: "12.4 通知設定", page: 26 }
    ]
  },
  {
    id: "chapter-result",
    title: "13. 作業結果登録",
    page: 27,
    children: [
      { id: "13-1", title: "13.1 作業報告", page: 27 },
      { id: "13-2", title: "13.2 写真登録", page: 27 },
      { id: "13-3", title: "13.3 状態更新", page: 28 },
      { id: "13-4", title: "13.4 承認依頼", page: 28 }
    ]
  },
  {
    id: "chapter-report",
    title: "14. レポート機能",
    page: 29,
    children: [
      { id: "14-1", title: "14.1 レポート一覧", page: 29 },
      { id: "14-2", title: "14.2 集計機能", page: 29 },
      { id: "14-3", title: "14.3 グラフ表示", page: 30 },
      { id: "14-4", title: "14.4 カスタムレポート", page: 30 }
    ]
  },
  {
    id: "chapter-pdf",
    title: "15. PDF出力",
    page: 31,
    children: [
      { id: "15-1", title: "15.1 PDF作成", page: 31 },
      { id: "15-2", title: "15.2 テンプレート", page: 31 },
      { id: "15-3", title: "15.3 印刷設定", page: 32 },
      { id: "15-4", title: "15.4 出力履歴", page: 32 }
    ]
  },
  {
    id: "chapter-csv",
    title: "16. CSV出力",
    page: 33,
    children: [
      { id: "16-1", title: "16.1 CSV作成", page: 33 },
      { id: "16-2", title: "16.2 項目選択", page: 33 },
      { id: "16-3", title: "16.3 エクスポート", page: 34 },
      { id: "16-4", title: "16.4 インポート", page: 34 }
    ]
  },
  {
    id: "chapter-search",
    title: "17. 検索機能",
    page: 35,
    children: [
      { id: "17-1", title: "17.1 キーワード検索", page: 35 },
      { id: "17-2", title: "17.2 高度検索", page: 35 },
      { id: "17-3", title: "17.3 保存検索", page: 36 },
      { id: "17-4", title: "17.4 検索履歴", page: 36 }
    ]
  },
  {
    id: "chapter-filter",
    title: "18. フィルター機能",
    page: 37,
    children: [
      { id: "18-1", title: "18.1 状態フィルター", page: 37 },
      { id: "18-2", title: "18.2 日付フィルター", page: 37 },
      { id: "18-3", title: "18.3 エリアフィルター", page: 38 },
      { id: "18-4", title: "18.4 保存フィルター", page: 38 }
    ]
  },
  {
    id: "chapter-notification",
    title: "19. 通知機能",
    page: 39,
    children: [
      { id: "19-1", title: "19.1 通知一覧", page: 39 },
      { id: "19-2", title: "19.2 メール通知", page: 39 },
      { id: "19-3", title: "19.3 プッシュ通知", page: 40 },
      { id: "19-4", title: "19.4 通知設定", page: 40 }
    ]
  },
  {
    id: "chapter-approval",
    title: "20. 承認ワークフロー",
    page: 41,
    children: [
      { id: "20-1", title: "20.1 承認依頼", page: 41 },
      { id: "20-2", title: "20.2 承認処理", page: 41 },
      { id: "20-3", title: "20.3 差戻し", page: 42 },
      { id: "20-4", title: "20.4 承認履歴", page: 42 }
    ]
  },
  {
    id: "chapter-user",
    title: "21. ユーザー管理",
    page: 43,
    children: [
      { id: "21-1", title: "21.1 ユーザー一覧", page: 43 },
      { id: "21-2", title: "21.2 ユーザー作成", page: 43 },
      { id: "21-3", title: "21.3 ユーザー編集", page: 44 },
      { id: "21-4", title: "21.4 アカウント停止", page: 44 }
    ]
  },
  {
    id: "chapter-role",
    title: "22. 権限管理",
    page: 45,
    children: [
      { id: "22-1", title: "22.1 ロール一覧", page: 45 },
      { id: "22-2", title: "22.2 権限設定", page: 45 },
      { id: "22-3", title: "22.3 ロール作成", page: 46 },
      { id: "22-4", title: "22.4 ロール削除", page: 46 }
    ]
  },
  {
    id: "chapter-master",
    title: "23. マスタ設定",
    page: 47,
    children: [
      { id: "23-1", title: "23.1 エリア管理", page: 47 },
      { id: "23-2", title: "23.2 損傷種別", page: 47 },
      { id: "23-3", title: "23.3 優先度設定", page: 48 },
      { id: "23-4", title: "23.4 ステータス管理", page: 48 }
    ]
  },
  {
    id: "chapter-api",
    title: "24. API利用ガイド",
    page: 49,
    children: [
      { id: "24-1", title: "24.1 認証API", page: 49 },
      { id: "24-2", title: "24.2 点検API", page: 49 },
      { id: "24-3", title: "24.3 レポートAPI", page: 50 },
      { id: "24-4", title: "24.4 エラーハンドリング", page: 50 }
    ]
  },
  {
    id: "chapter-audit",
    title: "25. システム監査ログ",
    page: 51,
    children: [
      { id: "25-1", title: "25.1 ログ閲覧", page: 51 },
      { id: "25-2", title: "25.2 フィルター", page: 51 },
      { id: "25-3", title: "25.3 出力", page: 52 },
      { id: "25-4", title: "25.4 保管期間", page: 52 }
    ]
  },
  {
    id: "chapter-backup",
    title: "26. データバックアップ",
    page: 53,
    children: [
      { id: "26-1", title: "26.1 自動バックアップ", page: 53 },
      { id: "26-2", title: "26.2 手動バックアップ", page: 53 },
      { id: "26-3", title: "26.3 復元", page: 54 },
      { id: "26-4", title: "26.4 保管ポリシー", page: 54 }
    ]
  },
  {
    id: "chapter-security",
    title: "27. セキュリティ設定",
    page: 55,
    children: [
      { id: "27-1", title: "27.1 パスワードポリシー", page: 55 },
      { id: "27-2", title: "27.2 IP制限", page: 55 },
      { id: "27-3", title: "27.3 アクセスログ", page: 56 },
      { id: "27-4", title: "27.4 セキュリティ監査", page: 56 }
    ]
  },
  {
    id: "chapter-faq",
    title: "28. FAQ",
    page: 57,
    children: [
      { id: "28-1", title: "28.1 よくある質問", page: 57 },
      { id: "28-2", title: "28.2 アカウント関連", page: 57 },
      { id: "28-3", title: "28.3 データ関連", page: 58 },
      { id: "28-4", title: "28.4 システム関連", page: 58 }
    ]
  },
  {
    id: "chapter-troubleshooting",
    title: "29. トラブルシューティング",
    page: 59,
    children: [
      { id: "29-1", title: "29.1 ログインできない", page: 59 },
      { id: "29-2", title: "29.2 データが表示されない", page: 59 },
      { id: "29-3", title: "29.3 PDF出力エラー", page: 60 },
      { id: "29-4", title: "29.4 サポート連絡先", page: 60 }
    ]
  },
  {
    id: "chapter-test-scenario",
    title: "30. テストシナリオ",
    page: 61,
    children: [
      { id: "30-1", title: "30.1 PDF表示テスト", page: 61 },
      { id: "30-2", title: "30.2 Outline読込テスト", page: 61 },
      { id: "30-3", title: "30.3 ページ遷移テスト", page: 62 },
      { id: "30-4", title: "30.4 ダウンロードテスト", page: 62 }
    ]
  }
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
