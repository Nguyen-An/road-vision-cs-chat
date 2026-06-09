import {
  AlertTriangle,
  BarChart3,
  FileText,
  Filter,
  Map,
  MapPin,
  Users,
  Video,
  type LucideIcon
} from "lucide-react";

export type PostType = "markdown" | "html" | "pdf" | "video";
export type PostLevel = "basic" | "intermediate" | "advanced";

export interface Category {
  id: number;
  title: string;
  description: string;
  slug: string;
  icon: LucideIcon;
  order: number;
  postCount?: number;
}

export interface Post {
  id: number;
  categoryId: number;
  title: string;
  description: string;
  slug: string;
  type: PostType;
  content: string;
  tags: string[];
  readTime: string;
  level: PostLevel;
  updatedAt: string;
  order: number;
  isFeatured?: boolean;
  relatedPostIds?: number[];
}

export type SupportMenuNodeType = "category" | "post";

export interface SupportMenuNode {
  id: string;
  type: SupportMenuNodeType;
  title: string;
  categorySlug?: string;
  postSlug?: string;
  children?: SupportMenuNode[];
}

export const categoryList: Category[] = [
  { id: 1, title: "地図の使い方", description: "地図画面の基本操作、地点確認、レイヤー切り替え方法を確認できます", slug: "map-guide", icon: Map, order: 1 },
  { id: 2, title: "損傷ポイントの確認方法", description: "道路撮影ポイント、監視地点、走行データの確認手順を確認できます", slug: "monitoring-point-guide", icon: MapPin, order: 2 },
  { id: 3, title: "動画の確認方法", description: "走行動画、撮影映像、損傷箇所の動画確認方法を確認できます", slug: "video-guide", icon: Video, order: 3 },
  { id: 4, title: "レポートの見方", description: "点検結果、損傷集計、道路状態レポートの確認方法を確認できます", slug: "report-guide", icon: FileText, order: 4 },
  { id: 5, title: "FAQ よくある質問", description: "よくある質問とトラブルシューティングを確認できます", slug: "faq", icon: Filter, order: 5 },
  { id: 6, title: "損傷・異常の管理", description: "ポットホール、ひび割れ、段差などの道路損傷の確認・更新方法を確認できます", slug: "damage-management-guide", icon: AlertTriangle, order: 6 },
  { id: 7, title: "統計・ダッシュボード", description: "道路状態の傾向、対応状況、エリア別統計を確認できます", slug: "dashboard-guide", icon: BarChart3, order: 7 },
  { id: 8, title: "ユーザー・権限管理", description: "ユーザー追加、ロール設定、閲覧権限の管理方法を確認できます", slug: "user-permission-guide", icon: Users, order: 8 }
];

export const postList: Post[] = [
  {
    id: 1,
    categoryId: 1,
    title: "地図の基本操作",
    description: "ズーム、パン、回転など地図画面の基本的な操作方法を説明します。マウス操作とタッチ操作の両方に対応しています。",
    slug: "map-basic-operation",
    type: "markdown",
    content: `
# 地図の基本操作

地図画面では、道路の撮影位置、監視ポイント、損傷箇所などを確認できます。

## マウス操作

1. マウスホイールでズームイン・ズームアウトできます。
2. ドラッグで地図を移動できます。
3. 右クリックしながらドラッグすると地図を回転できます。

## タッチ操作（スマートフォン・タブレット）

1. 2本指でピンチイン・ピンチアウトすると拡大・縮小できます。
2. 1本指でドラッグすると地図を移動できます。
3. 2本指で回転すると地図の向きを変更できます。

## キーボードショートカット

- 矢印キーで地図を少しずつ移動できます。
- + / - キーでズームを調整できます。
`,
    tags: ["基本", "地図", "操作"],
    readTime: "3分",
    level: "basic",
    updatedAt: "2026-05-20",
    order: 1,
    isFeatured: true,
    relatedPostIds: [2, 3]
  },
  {
    id: 2,
    categoryId: 1,
    title: "レイヤーの切り替え方法",
    description: "衛星写真・道路地図・標高図など、複数のマップレイヤーを切り替える手順を解説します。",
    slug: "switch-map-layer",
    type: "markdown",
    content: `
# レイヤーの切り替え方法

地図画面では、表示する情報をレイヤーごとに切り替えることができます。

## 操作手順

1. 地図右上の「レイヤー」ボタンをクリックします。
2. 表示したいレイヤーを選択します。
3. 不要なレイヤーはチェックを外します。

## 主なレイヤー

- 道路地図
- 衛星写真
- 撮影ポイント
- 損傷ポイント
- 路線・区間
`,
    tags: ["レイヤー", "表示"],
    readTime: "4分",
    level: "basic",
    updatedAt: "2026-05-20",
    order: 2,
    relatedPostIds: [1, 4]
  },
  {
    id: 3,
    categoryId: 1,
    title: "路線・区間を選択する",
    description: "地図上で点検対象の路線や区間を選択し、対象データを絞り込む方法です。",
    slug: "select-route-section",
    type: "markdown",
    content: `
# 路線・区間を選択する

路線や区間を選択すると、対象範囲の撮影データや損傷情報だけを表示できます。

## 操作手順

1. 左メニューから「路線・区間」を開きます。
2. 対象の路線を選択します。
3. 必要に応じて開始地点・終了地点を指定します。
4. 「適用」をクリックします。
`,
    tags: ["選択", "絞り込み"],
    readTime: "5分",
    level: "intermediate",
    updatedAt: "2026-05-21",
    order: 3,
    relatedPostIds: [1]
  },
  {
    id: 4,
    categoryId: 1,
    title: "マップにメモを追加する",
    description: "地図上の任意の地点にコメントやメモを付与して、チームと共有する機能の使い方です。",
    slug: "add-map-memo",
    type: "markdown",
    content: `
# マップにメモを追加する

点検中に気づいた内容を、地図上の地点にメモとして登録できます。

## 操作手順

1. 地図上でメモを追加したい地点をクリックします。
2. 「メモを追加」をクリックします。
3. 内容を入力します。
4. 必要に応じて画像を添付します。
5. 「保存」をクリックします。
`,
    tags: ["メモ", "共有"],
    readTime: "3分",
    level: "basic",
    updatedAt: "2026-05-22",
    order: 4,
    relatedPostIds: [1]
  },
  {
    id: 5,
    categoryId: 2,
    title: "撮影ポイントを確認する",
    description: "地図上で撮影ポイントの位置、撮影日時、関連動画を確認する方法です。",
    slug: "check-monitoring-point",
    type: "markdown",
    content: `
# 撮影ポイントを確認する

撮影ポイントでは、道路を撮影した位置や日時、関連する動画を確認できます。

## 確認できる情報

- 撮影位置
- 撮影日時
- 対象路線
- 関連動画
- 検出された損傷情報
`,
    tags: ["撮影ポイント", "位置情報", "動画"],
    readTime: "4分",
    level: "basic",
    updatedAt: "2026-05-23",
    order: 1
  },
  {
    id: 6,
    categoryId: 2,
    title: "監視地点の詳細を確認する",
    description: "監視地点ごとの点検履歴、損傷件数、最新状況を確認する方法です。",
    slug: "check-monitoring-point-detail",
    type: "markdown",
    content: "## 表示項目\n\n- 地点名\n- 所在地\n- 最新点検日\n- 損傷件数\n- 対応ステータス",
    tags: ["監視地点", "詳細"],
    readTime: "5分",
    level: "intermediate",
    updatedAt: "2026-05-23",
    order: 2
  },
  {
    id: 7,
    categoryId: 3,
    title: "走行動画を再生する",
    description: "撮影ポイントに紐づく走行動画を再生する方法を説明します。",
    slug: "play-driving-video",
    type: "markdown",
    content: "## 操作手順\n\n1. 撮影ポイントを選択します。\n2. 「動画を見る」をクリックします。\n3. 動画プレイヤーで再生・停止・シーク操作を行います。",
    tags: ["動画", "再生", "基本"],
    readTime: "3分",
    level: "basic",
    updatedAt: "2026-05-24",
    order: 1
  },
  {
    id: 8,
    categoryId: 3,
    title: "損傷箇所を動画で確認する",
    description: "ポットホールやひび割れなどの損傷箇所を動画上で確認する方法です。",
    slug: "check-damage-in-video",
    type: "markdown",
    content: "## 確認手順\n\n1. 損傷ポイントを選択します。\n2. 「動画で確認」をクリックします。\n3. 動画上の該当位置を確認します。",
    tags: ["動画", "損傷"],
    readTime: "5分",
    level: "intermediate",
    updatedAt: "2026-05-25",
    order: 2
  },
  {
    id: 9,
    categoryId: 4,
    title: "点検レポートを確認する",
    description: "道路点検結果のレポート内容と各項目の見方を説明します。",
    slug: "view-inspection-report",
    type: "markdown",
    content: "## 主な項目\n\n- 点検日\n- 対象エリア\n- 対象路線\n- 検出された損傷件数\n- 対応状況",
    tags: ["レポート", "点検"],
    readTime: "4分",
    level: "basic",
    updatedAt: "2026-05-25",
    order: 1
  },
  {
    id: 10,
    categoryId: 5,
    title: "キーワードで検索する",
    description: "地点名、路線名、損傷種別などのキーワードで検索する方法です。",
    slug: "search-by-keyword",
    type: "markdown",
    content: "## 検索対象\n\n- 地点名\n- 路線名\n- エリア名\n- 損傷種別\n- レポート名",
    tags: ["検索", "キーワード"],
    readTime: "2分",
    level: "basic",
    updatedAt: "2026-05-26",
    order: 1
  },
  {
    id: 11,
    categoryId: 6,
    title: "道路損傷のステータスを更新する",
    description: "検出された損傷の確認状況や対応状況を更新する方法です。",
    slug: "update-damage-status",
    type: "markdown",
    content: "## ステータス例\n\n- 未確認\n- 確認済み\n- 対応中\n- 対応完了",
    tags: ["損傷", "ステータス"],
    readTime: "4分",
    level: "intermediate",
    updatedAt: "2026-05-27",
    order: 1
  },
  {
    id: 12,
    categoryId: 7,
    title: "ダッシュボードで道路状態を確認する",
    description: "エリア別、路線別、損傷種別ごとの統計情報を確認する方法です。",
    slug: "view-road-condition-dashboard",
    type: "markdown",
    content: "## 確認できる情報\n\n- エリア別損傷件数\n- 路線別損傷件数\n- 対応完了率\n- 月別推移",
    tags: ["ダッシュボード", "統計"],
    readTime: "5分",
    level: "intermediate",
    updatedAt: "2026-05-28",
    order: 1
  }
];

export const supportMenuTree: SupportMenuNode[] = [
  {
    id: "category-map-guide",
    type: "category",
    title: "地図の使い方",
    categorySlug: "map-guide",
    children: [
      { id: "post-map-basic-operation", type: "post", title: "地図の基本操作を編集", categorySlug: "map-guide", postSlug: "map-basic-operation" },
      { id: "post-switch-map-layer", type: "post", title: "レイヤーの切り替え方法", categorySlug: "map-guide", postSlug: "switch-map-layer" },
      { id: "post-select-route-section", type: "post", title: "路線・区間を選択する", categorySlug: "map-guide", postSlug: "select-route-section" },
      { id: "post-add-map-memo", type: "post", title: "マップにメモを追加する", categorySlug: "map-guide", postSlug: "add-map-memo" }
    ]
  },
  {
    id: "category-monitoring-point-guide",
    type: "category",
    title: "損傷ポイントの確認方法",
    categorySlug: "monitoring-point-guide",
    children: [
      { id: "post-check-monitoring-point", type: "post", title: "撮影ポイントを確認する", categorySlug: "monitoring-point-guide", postSlug: "check-monitoring-point" },
      { id: "post-check-monitoring-point-detail", type: "post", title: "監視地点の詳細を確認する", categorySlug: "monitoring-point-guide", postSlug: "check-monitoring-point-detail" }
    ]
  },
  {
    id: "category-video-guide",
    type: "category",
    title: "動画の確認方法",
    categorySlug: "video-guide",
    children: [
      { id: "post-play-driving-video", type: "post", title: "走行動画を再生する", categorySlug: "video-guide", postSlug: "play-driving-video" },
      { id: "post-check-damage-in-video", type: "post", title: "損傷箇所を動画で確認する", categorySlug: "video-guide", postSlug: "check-damage-in-video" }
    ]
  },
  {
    id: "category-report-guide",
    type: "category",
    title: "レポートの見方",
    categorySlug: "report-guide",
    children: [
      { id: "post-view-inspection-report", type: "post", title: "点検レポートを確認する", categorySlug: "report-guide", postSlug: "view-inspection-report" }
    ]
  },
  {
    id: "category-faq",
    type: "category",
    title: "FAQ よくある質問",
    categorySlug: "faq",
    children: [
      { id: "post-search-by-keyword", type: "post", title: "キーワードで検索する", categorySlug: "faq", postSlug: "search-by-keyword" }
    ]
  },
  {
    id: "category-damage-management-guide",
    type: "category",
    title: "損傷・異常の管理",
    categorySlug: "damage-management-guide",
    children: [
      { id: "post-update-damage-status", type: "post", title: "道路損傷のステータスを更新する", categorySlug: "damage-management-guide", postSlug: "update-damage-status" }
    ]
  },
  {
    id: "category-dashboard-guide",
    type: "category",
    title: "統計・ダッシュボード",
    categorySlug: "dashboard-guide",
    children: [
      { id: "post-view-road-condition-dashboard", type: "post", title: "ダッシュボードで道路状態を確認する", categorySlug: "dashboard-guide", postSlug: "view-road-condition-dashboard" }
    ]
  }
];

export function getCategoryBySlug(slug: string) {
  return categoryList.find((category) => category.slug === slug);
}

export function getPostsByCategory(categoryId: number) {
  return postList.filter((post) => post.categoryId === categoryId).sort((a, b) => a.order - b.order);
}

export function getPostBySlug(categoryId: number, postSlug: string) {
  return getPostsByCategory(categoryId).find((post) => post.slug === postSlug);
}
