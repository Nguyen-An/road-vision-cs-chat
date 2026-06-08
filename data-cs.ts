import {
  Map,
  MapPin,
  Filter,
  AlertTriangle,
  BarChart3,
  Users,
  Video,
  FileText,
  Route,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-vue-next';

export type PostType = 'markdown' | 'html' | 'pdf' | 'video';

export type PostLevel = 'basic' | 'intermediate' | 'advanced';

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

export const categoryList: Category[] = [
  {
    id: 1,
    title: '地図の使い方',
    description: '地図画面の基本操作、地点確認、レイヤー切り替え方法を確認できます',
    slug: 'map-guide',
    icon: Map,
    order: 1,
  },
  {
    id: 2,
    title: '撮影ポイントの確認方法',
    description: '道路撮影ポイント、監視地点、走行データの確認手順を確認できます',
    slug: 'monitoring-point-guide',
    icon: MapPin,
    order: 2,
  },
  {
    id: 3,
    title: '動画の確認方法',
    description: '走行動画、撮影映像、損傷箇所の動画確認方法を確認できます',
    slug: 'video-guide',
    icon: Video,
    order: 3,
  },
  {
    id: 4,
    title: 'レポートの見方',
    description: '点検結果、損傷集計、道路状態レポートの確認方法を確認できます',
    slug: 'report-guide',
    icon: FileText,
    order: 4,
  },
  {
    id: 5,
    title: '絞り込み・検索',
    description: '期間、エリア、路線、損傷種別などでデータを絞り込む方法を確認できます',
    slug: 'filter-search-guide',
    icon: Filter,
    order: 5,
  },
  {
    id: 6,
    title: '損傷・異常の管理',
    description: 'ポットホール、ひび割れ、段差などの道路損傷の確認・更新方法を確認できます',
    slug: 'damage-management-guide',
    icon: AlertTriangle,
    order: 6,
  },
  {
    id: 7,
    title: '統計・ダッシュボード',
    description: '道路状態の傾向、対応状況、エリア別統計を確認できます',
    slug: 'dashboard-guide',
    icon: BarChart3,
    order: 7,
  },
  {
    id: 8,
    title: 'ユーザー・権限管理',
    description: 'ユーザー追加、ロール設定、閲覧権限の管理方法を確認できます',
    slug: 'user-permission-guide',
    icon: Users,
    order: 8,
  },
];

export const postList: Post[] = [
  {
    id: 1,
    categoryId: 1,
    title: '地図の基本操作',
    description: 'ズーム、パン、回転など地図画面の基本的な操作方法を説明します。',
    slug: 'map-basic-operation',
    type: 'markdown',
    content: `
# 地図の基本操作

地図画面では、道路の撮影位置、監視ポイント、損傷箇所などを確認できます。

## マウス操作

1. マウスホイールでズームイン・ズームアウトできます。
2. ドラッグで地図を移動できます。
3. 右クリックしながらドラッグすると地図を回転できます。

## タッチ操作

1. 2本指でピンチイン・ピンチアウトすると拡大・縮小できます。
2. 1本指でドラッグすると地図を移動できます。
3. 2本指で回転すると地図の向きを変更できます。
`,
    tags: ['基本', '地図', '操作'],
    readTime: '3分',
    level: 'basic',
    updatedAt: '2026-05-20',
    order: 1,
    isFeatured: true,
    relatedPostIds: [2, 3],
  },
  {
    id: 2,
    categoryId: 1,
    title: 'レイヤーの切り替え方法',
    description: '衛星写真、道路地図、損傷レイヤーなどを切り替える手順を説明します。',
    slug: 'switch-map-layer',
    type: 'markdown',
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
    tags: ['地図', 'レイヤー', '表示'],
    readTime: '4分',
    level: 'basic',
    updatedAt: '2026-05-20',
    order: 2,
    relatedPostIds: [1, 4],
  },
  {
    id: 3,
    categoryId: 1,
    title: '路線・区間を選択する',
    description: '地図上で点検対象の路線や区間を選択し、対象データを絞り込む方法です。',
    slug: 'select-route-section',
    type: 'markdown',
    content: `
# 路線・区間を選択する

路線や区間を選択すると、対象範囲の撮影データや損傷情報だけを表示できます。

## 操作手順

1. 左メニューから「路線・区間」を開きます。
2. 対象の路線を選択します。
3. 必要に応じて開始地点・終了地点を指定します。
4. 「適用」をクリックします。
`,
    tags: ['路線', '区間', '絞り込み'],
    readTime: '5分',
    level: 'intermediate',
    updatedAt: '2026-05-21',
    order: 3,
    relatedPostIds: [1, 10],
  },
  {
    id: 4,
    categoryId: 1,
    title: 'マップにメモを追加する',
    description: '地図上の任意の地点にコメントやメモを付与する方法を説明します。',
    slug: 'add-map-memo',
    type: 'markdown',
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
    tags: ['メモ', '共有', '地図'],
    readTime: '3分',
    level: 'basic',
    updatedAt: '2026-05-22',
    order: 4,
    relatedPostIds: [1],
  },

  {
    id: 5,
    categoryId: 2,
    title: '撮影ポイントを確認する',
    description: '地図上で撮影ポイントの位置、撮影日時、関連動画を確認する方法です。',
    slug: 'check-monitoring-point',
    type: 'markdown',
    content: `
# 撮影ポイントを確認する

撮影ポイントでは、道路を撮影した位置や日時、関連する動画を確認できます。

## 確認できる情報

- 撮影位置
- 撮影日時
- 対象路線
- 関連動画
- 検出された損傷情報

## 操作手順

1. 地図上の撮影ポイントアイコンをクリックします。
2. 表示されたポップアップで詳細情報を確認します。
3. 必要に応じて「動画を見る」をクリックします。
`,
    tags: ['撮影ポイント', '位置情報', '動画'],
    readTime: '4分',
    level: 'basic',
    updatedAt: '2026-05-23',
    order: 1,
    isFeatured: true,
    relatedPostIds: [8, 9],
  },
  {
    id: 6,
    categoryId: 2,
    title: '監視地点の詳細を確認する',
    description: '監視地点ごとの点検履歴、損傷件数、最新状況を確認する方法です。',
    slug: 'check-monitoring-point-detail',
    type: 'markdown',
    content: `
# 監視地点の詳細を確認する

監視地点詳細画面では、地点ごとの点検履歴や損傷状況を確認できます。

## 表示項目

- 地点名
- 所在地
- 最新点検日
- 損傷件数
- 対応ステータス
- 関連レポート
`,
    tags: ['監視地点', '詳細', '点検履歴'],
    readTime: '5分',
    level: 'intermediate',
    updatedAt: '2026-05-23',
    order: 2,
    relatedPostIds: [5, 14],
  },
  {
    id: 7,
    categoryId: 2,
    title: 'GPS位置がずれている場合の確認方法',
    description: '撮影位置と実際の道路位置がずれて見える場合の確認ポイントです。',
    slug: 'gps-position-troubleshooting',
    type: 'markdown',
    content: `
# GPS位置がずれている場合の確認方法

GPS位置は、通信環境や撮影端末の状態により実際の位置とずれる場合があります。

## 確認ポイント

- 撮影日時が正しいか
- 対象路線が正しいか
- 動画の進行方向と地図上の位置が一致しているか
- 近くに高架道路やトンネルがないか
`,
    tags: ['GPS', '位置ずれ', 'トラブルシュート'],
    readTime: '4分',
    level: 'intermediate',
    updatedAt: '2026-05-24',
    order: 3,
    relatedPostIds: [5],
  },

  {
    id: 8,
    categoryId: 3,
    title: '走行動画を再生する',
    description: '撮影ポイントに紐づく走行動画を再生する方法を説明します。',
    slug: 'play-driving-video',
    type: 'markdown',
    content: `
# 走行動画を再生する

走行動画では、道路状況を時系列で確認できます。

## 操作手順

1. 撮影ポイントを選択します。
2. 「動画を見る」をクリックします。
3. 動画プレイヤーで再生・停止・シーク操作を行います。
`,
    tags: ['動画', '再生', '基本'],
    readTime: '3分',
    level: 'basic',
    updatedAt: '2026-05-24',
    order: 1,
    isFeatured: true,
    relatedPostIds: [5, 9],
  },
  {
    id: 9,
    categoryId: 3,
    title: '損傷箇所を動画で確認する',
    description: 'ポットホールやひび割れなどの損傷箇所を動画上で確認する方法です。',
    slug: 'check-damage-in-video',
    type: 'markdown',
    content: `
# 損傷箇所を動画で確認する

動画画面では、AIが検出した損傷箇所を映像と合わせて確認できます。

## 確認手順

1. 損傷ポイントを選択します。
2. 「動画で確認」をクリックします。
3. 動画上の該当位置を確認します。
4. 必要に応じて判定結果を更新します。
`,
    tags: ['動画', '損傷', 'ポットホール'],
    readTime: '5分',
    level: 'intermediate',
    updatedAt: '2026-05-25',
    order: 2,
    relatedPostIds: [8, 13],
  },

  {
    id: 10,
    categoryId: 4,
    title: '点検レポートを確認する',
    description: '道路点検結果のレポート内容と各項目の見方を説明します。',
    slug: 'view-inspection-report',
    type: 'markdown',
    content: `
# 点検レポートを確認する

点検レポートでは、対象エリアや路線ごとの道路状態を確認できます。

## 主な項目

- 点検日
- 対象エリア
- 対象路線
- 検出された損傷件数
- 対応状況
- コメント
`,
    tags: ['レポート', '点検', '集計'],
    readTime: '4分',
    level: 'basic',
    updatedAt: '2026-05-25',
    order: 1,
    isFeatured: true,
    relatedPostIds: [14, 15],
  },
  {
    id: 11,
    categoryId: 4,
    title: 'レポートをPDFで出力する',
    description: '点検レポートをPDF形式でダウンロードする方法です。',
    slug: 'export-report-pdf',
    type: 'pdf',
    content: '/manuals/export-report-pdf.pdf',
    tags: ['PDF', '出力', 'ダウンロード'],
    readTime: '3分',
    level: 'basic',
    updatedAt: '2026-05-26',
    order: 2,
    relatedPostIds: [10],
  },

  {
    id: 12,
    categoryId: 5,
    title: 'キーワードで検索する',
    description: '地点名、路線名、損傷種別などのキーワードで検索する方法です。',
    slug: 'search-by-keyword',
    type: 'markdown',
    content: `
# キーワードで検索する

検索欄にキーワードを入力すると、関連するデータを絞り込めます。

## 検索対象

- 地点名
- 路線名
- エリア名
- 損傷種別
- レポート名
`,
    tags: ['検索', 'キーワード', '絞り込み'],
    readTime: '2分',
    level: 'basic',
    updatedAt: '2026-05-26',
    order: 1,
    relatedPostIds: [3, 13],
  },
  {
    id: 13,
    categoryId: 5,
    title: '損傷種別で絞り込む',
    description: 'ポットホール、ひび割れ、段差などの損傷種別でデータを絞り込む方法です。',
    slug: 'filter-by-damage-type',
    type: 'markdown',
    content: `
# 損傷種別で絞り込む

損傷種別を指定すると、対象の損傷データだけを表示できます。

## 主な損傷種別

- ポットホール
- ひび割れ
- 段差
- わだち掘れ
- 区画線のかすれ
- 標識の破損
`,
    tags: ['損傷', '絞り込み', 'ポットホール'],
    readTime: '3分',
    level: 'basic',
    updatedAt: '2026-05-27',
    order: 2,
    relatedPostIds: [9, 14],
  },

  {
    id: 14,
    categoryId: 6,
    title: '道路損傷のステータスを更新する',
    description: '検出された損傷の確認状況や対応状況を更新する方法です。',
    slug: 'update-damage-status',
    type: 'markdown',
    content: `
# 道路損傷のステータスを更新する

損傷データには、確認状況や対応状況を設定できます。

## ステータス例

- 未確認
- 確認済み
- 対応中
- 対応完了
- 対象外

## 操作手順

1. 損傷ポイントを選択します。
2. 詳細画面を開きます。
3. ステータスを変更します。
4. 「保存」をクリックします。
`,
    tags: ['損傷', 'ステータス', '対応状況'],
    readTime: '4分',
    level: 'intermediate',
    updatedAt: '2026-05-27',
    order: 1,
    isFeatured: true,
    relatedPostIds: [9, 13],
  },
  {
    id: 15,
    categoryId: 7,
    title: 'ダッシュボードで道路状態を確認する',
    description: 'エリア別、路線別、損傷種別ごとの統計情報を確認する方法です。',
    slug: 'view-road-condition-dashboard',
    type: 'markdown',
    content: `
# ダッシュボードで道路状態を確認する

ダッシュボードでは、道路状態をグラフや集計表で確認できます。

## 確認できる情報

- エリア別損傷件数
- 路線別損傷件数
- 損傷種別ごとの割合
- 対応完了率
- 月別推移
`,
    tags: ['ダッシュボード', '統計', 'グラフ'],
    readTime: '5分',
    level: 'intermediate',
    updatedAt: '2026-05-28',
    order: 1,
    relatedPostIds: [10, 14],
  },
  {
    id: 16,
    categoryId: 8,
    title: 'ユーザー権限を設定する',
    description: '管理者、オペレーター、閲覧者などの権限を設定する方法です。',
    slug: 'set-user-permission',
    type: 'markdown',
    content: `
# ユーザー権限を設定する

ユーザーごとに操作できる機能を制御できます。

## 主なロール

- 管理者
- オペレーター
- 閲覧者

## 操作手順

1. 管理画面を開きます。
2. 対象ユーザーを選択します。
3. ロールを設定します。
4. 「保存」をクリックします。
`,
    tags: ['ユーザー', '権限', '管理'],
    readTime: '3分',
    level: 'advanced',
    updatedAt: '2026-05-28',
    order: 1,
    relatedPostIds: [],
  },
];