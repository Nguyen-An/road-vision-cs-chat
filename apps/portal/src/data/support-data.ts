import type { Category, Post, SupportMenuNode } from "@/lib/api/support-api";

const supportData = ({
  "categories": [
    {
      "id": 1,
      "title": "地図の使い方",
      "description": "地図画面の基本操作、地点確認、レイヤー切り替え方法を確認できます",
      "slug": "map-guide",
      "iconName": "Map",
      "order": 1
    },
    {
      "id": 2,
      "title": "損傷ポイントの確認方法",
      "description": "道路撮影ポイント、監視地点、走行データの確認手順を確認できます",
      "slug": "monitoring-point-guide",
      "iconName": "MapPin",
      "order": 2
    },
    {
      "id": 3,
      "title": "動画の確認方法",
      "description": "走行動画、撮影映像、損傷箇所の動画確認方法を確認できます",
      "slug": "video-guide",
      "iconName": "Video",
      "order": 3
    },
    {
      "id": 4,
      "title": "レポートの見方",
      "description": "点検結果、損傷集計、道路状態レポートの確認方法を確認できます",
      "slug": "report-guide",
      "iconName": "FileText",
      "order": 4
    },
    {
      "id": 5,
      "title": "FAQ よくある質問",
      "description": "よくある質問とトラブルシューティングを確認できます",
      "slug": "faq",
      "iconName": "Filter",
      "order": 5
    },
    {
      "id": 6,
      "title": "損傷・異常の管理",
      "description": "ポットホール、ひび割れ、段差などの道路損傷の確認・更新方法を確認できます",
      "slug": "damage-management-guide",
      "iconName": "AlertTriangle",
      "order": 6
    },
    {
      "id": 7,
      "title": "統計・ダッシュボード",
      "description": "道路状態の傾向、対応状況、エリア別統計を確認できます",
      "slug": "dashboard-guide",
      "iconName": "BarChart3",
      "order": 7
    },
    {
      "id": 8,
      "title": "ユーザー・権限管理",
      "description": "ユーザー追加、ロール設定、閲覧権限の管理方法を確認できます",
      "slug": "user-permission-guide",
      "iconName": "Users",
      "order": 8
    }
  ],
  "posts": [
    {
      "id": 1,
      "categoryId": 1,
      "title": "地図の基本操作",
      "description": "ズーム、パン、回転など地図画面の基本的な操作方法を説明します。マウス操作とタッチ操作の両方に対応しています。",
      "slug": "map-basic-operation",
      "type": "markdown",
      "content": "# 地図の基本操作\n\n地図画面では、道路の撮影位置、監視ポイント、損傷箇所などを確認できます。\n\n## マウス操作\n\n1. マウスホイールでズームイン・ズームアウトできます。\n2. ドラッグで地図を移動できます。\n3. 右クリックしながらドラッグすると地図を回転できます。\n\n## タッチ操作（スマートフォン・タブレット）\n\n1. 2本指でピンチイン・ピンチアウトすると拡大・縮小できます。\n2. 1本指でドラッグすると地図を移動できます。\n3. 2本指で回転すると地図の向きを変更できます。\n\n## キーボードショートカット\n\n- 矢印キーで地図を少しずつ移動できます。\n- + / - キーでズームを調整できます。",
      "tags": ["基本", "地図", "操作"],
      "readTime": "3分",
      "level": "basic",
      "updatedAt": "2026-05-20",
      "order": 1,
      "isFeatured": true,
      "relatedPostIds": [2, 3]
    },
    {
      "id": 2,
      "categoryId": 1,
      "title": "レイヤーの切り替え方法",
      "description": "衛星写真・道路地図・標高図など、複数のマップレイヤーを切り替える手順を解説します。",
      "slug": "switch-map-layer",
      "type": "markdown",
      "content": "# レイヤーの切り替え方法\n\n地図画面では、表示する情報をレイヤーごとに切り替えることができます。\n\n## 操作手順\n\n1. 地図右上の「レイヤー」ボタンをクリックします。\n2. 表示したいレイヤーを選択します。\n3. 不要なレイヤーはチェックを外します。\n\n## 主なレイヤー\n\n- 道路地図\n- 衛星写真\n- 撮影ポイント\n- 損傷ポイント\n- 路線・区間",
      "tags": ["レイヤー", "表示"],
      "readTime": "4分",
      "level": "basic",
      "updatedAt": "2026-05-20",
      "order": 2,
      "relatedPostIds": [1, 4]
    },
    {
      "id": 3,
      "categoryId": 1,
      "title": "路線・区間を選択する",
      "description": "地図上で点検対象の路線や区間を選択し、対象データを絞り込む方法です。",
      "slug": "select-route-section",
      "type": "markdown",
      "content": "# 路線・区間を選択する\n\n路線や区間を選択すると、対象範囲の撮影データや損傷情報だけを表示できます。\n\n## 操作手順\n\n1. 左メニューから「路線・区間」を開きます。\n2. 対象の路線を選択します。\n3. 必要に応じて開始地点・終了地点を指定します。\n4. 「適用」をクリックします。",
      "tags": ["選択", "絞り込み"],
      "readTime": "5分",
      "level": "intermediate",
      "updatedAt": "2026-05-21",
      "order": 3,
      "relatedPostIds": [1]
    },
    {
      "id": 4,
      "categoryId": 1,
      "title": "マップにメモを追加する",
      "description": "地図上の任意の地点にコメントやメモを付与して、チームと共有する機能の使い方です。",
      "slug": "add-map-memo",
      "type": "markdown",
      "content": "# マップにメモを追加する\n\n点検中に気づいた内容を、地図上の地点にメモとして登録できます。\n\n## 操作手順\n\n1. 地図上でメモを追加したい地点をクリックします。\n2. 「メモを追加」をクリックします。\n3. 内容を入力します。\n4. 必要に応じて画像を添付します。\n5. 「保存」をクリックします。",
      "tags": ["メモ", "共有"],
      "readTime": "3分",
      "level": "basic",
      "updatedAt": "2026-05-22",
      "order": 4,
      "relatedPostIds": [1]
    },
    {
      "id": 13,
      "categoryId": 1,
      "title": "現在地を表示する",
      "description": "現在地ボタンを使って、地図の中心を現在位置へ移動する方法です。",
      "slug": "show-current-location",
      "type": "markdown",
      "content": "# 現在地を表示する\n\n現在地を表示すると、点検中の位置をすぐに確認できます。\n\n## 操作手順\n\n1. 地図右下の現在地ボタンをクリックします。\n2. ブラウザの位置情報許可を確認します。\n3. 現在地が地図中央に表示されます。",
      "tags": ["現在地", "地図"],
      "readTime": "2分",
      "level": "basic",
      "updatedAt": "2026-05-29",
      "order": 5
    },
    {
      "id": 14,
      "categoryId": 1,
      "title": "地図の表示範囲を保存する",
      "description": "よく使うエリアの表示範囲を保存し、次回すぐに開くための手順です。",
      "slug": "save-map-viewport",
      "type": "markdown",
      "content": "# 地図の表示範囲を保存する\n\n表示範囲を保存すると、よく確認するエリアへすばやく戻れます。\n\n## 操作手順\n\n1. 保存したい範囲まで地図を移動します。\n2. 表示範囲メニューを開きます。\n3. 名前を入力して保存します。",
      "tags": ["表示範囲", "保存"],
      "readTime": "3分",
      "level": "basic",
      "updatedAt": "2026-05-29",
      "order": 6
    },
    {
      "id": 15,
      "categoryId": 1,
      "title": "保存した表示範囲を開く",
      "description": "保存済みの地図表示範囲を一覧から選択して開く方法です。",
      "slug": "open-saved-map-viewport",
      "type": "markdown",
      "content": "# 保存した表示範囲を開く\n\n保存済みの範囲は、一覧から選択して再表示できます。\n\n## 操作手順\n\n1. 表示範囲メニューを開きます。\n2. 保存済み一覧から対象を選びます。\n3. 地図が指定範囲へ移動します。",
      "tags": ["表示範囲", "一覧"],
      "readTime": "2分",
      "level": "basic",
      "updatedAt": "2026-05-29",
      "order": 7
    },
    {
      "id": 16,
      "categoryId": 1,
      "title": "地図上で地点を検索する",
      "description": "住所、施設名、地点名を入力して地図上の位置を検索する方法です。",
      "slug": "search-place-on-map",
      "type": "markdown",
      "content": "# 地図上で地点を検索する\n\n検索ボックスを使うと、住所や地点名から地図を移動できます。\n\n## 操作手順\n\n1. 検索ボックスにキーワードを入力します。\n2. 候補から地点を選択します。\n3. 地図が選択地点へ移動します。",
      "tags": ["検索", "地点"],
      "readTime": "3分",
      "level": "basic",
      "updatedAt": "2026-05-30",
      "order": 8
    },
    {
      "id": 17,
      "categoryId": 1,
      "title": "地図の縮尺を確認する",
      "description": "画面上の縮尺表示を確認し、距離感を把握するための説明です。",
      "slug": "check-map-scale",
      "type": "markdown",
      "content": "# 地図の縮尺を確認する\n\n縮尺表示を見ることで、地図上の距離感を把握できます。\n\n## 確認手順\n\n1. 地図左下の縮尺バーを確認します。\n2. ズーム操作に応じて縮尺が変わります。\n3. 必要に応じて距離計測機能を併用します。",
      "tags": ["縮尺", "距離"],
      "readTime": "2分",
      "level": "basic",
      "updatedAt": "2026-05-30",
      "order": 9
    },
    {
      "id": 18,
      "categoryId": 1,
      "title": "地図を全画面で表示する",
      "description": "作業スペースを広げるため、地図を全画面表示に切り替える方法です。",
      "slug": "open-map-fullscreen",
      "type": "markdown",
      "content": "# 地図を全画面で表示する\n\n全画面表示にすると、地図を広く確認できます。\n\n## 操作手順\n\n1. 地図右上の全画面ボタンをクリックします。\n2. 画面全体に地図が表示されます。\n3. Escキーまたはボタンで通常表示に戻ります。",
      "tags": ["全画面", "表示"],
      "readTime": "2分",
      "level": "basic",
      "updatedAt": "2026-05-30",
      "order": 10
    },
    {
      "id": 19,
      "categoryId": 1,
      "title": "地図の背景を変更する",
      "description": "道路地図、衛星写真、簡易地図など背景スタイルを切り替える手順です。",
      "slug": "change-map-basemap",
      "type": "markdown",
      "content": "# 地図の背景を変更する\n\n背景地図を切り替えると、目的に応じた見やすい表示にできます。\n\n## 操作手順\n\n1. 背景地図メニューを開きます。\n2. 表示したい背景を選択します。\n3. 地図の背景が切り替わります。",
      "tags": ["背景", "表示"],
      "readTime": "3分",
      "level": "basic",
      "updatedAt": "2026-05-31",
      "order": 11
    },
    {
      "id": 20,
      "categoryId": 1,
      "title": "地点の詳細情報を開く",
      "description": "地図上の地点をクリックして、名称や関連データなどの詳細を確認する方法です。",
      "slug": "open-point-detail",
      "type": "markdown",
      "content": "# 地点の詳細情報を開く\n\n地点詳細では、対象地点に紐づく情報を確認できます。\n\n## 操作手順\n\n1. 地図上の地点アイコンをクリックします。\n2. 詳細パネルが開きます。\n3. 関連する動画や損傷情報を確認します。",
      "tags": ["地点", "詳細"],
      "readTime": "4分",
      "level": "intermediate",
      "updatedAt": "2026-05-31",
      "order": 12
    },
    {
      "id": 21,
      "categoryId": 1,
      "title": "地図の凡例を確認する",
      "description": "アイコンや色の意味を凡例で確認し、表示内容を正しく理解する方法です。",
      "slug": "check-map-legend",
      "type": "markdown",
      "content": "# 地図の凡例を確認する\n\n凡例を見ると、地図上のアイコンや色の意味を理解できます。\n\n## 操作手順\n\n1. 凡例ボタンをクリックします。\n2. 表示中のレイヤーに対応する凡例を確認します。\n3. 不明な記号がある場合はヘルプを参照します。",
      "tags": ["凡例", "レイヤー"],
      "readTime": "2分",
      "level": "basic",
      "updatedAt": "2026-06-01",
      "order": 13
    },
    {
      "id": 22,
      "categoryId": 1,
      "title": "地図の表示設定を初期化する",
      "description": "ズーム、回転、レイヤーなどの表示設定を初期状態に戻す方法です。",
      "slug": "reset-map-display-settings",
      "type": "markdown",
      "content": "# 地図の表示設定を初期化する\n\n表示が分かりにくくなった場合は、設定を初期化できます。\n\n## 操作手順\n\n1. 設定メニューを開きます。\n2. 「表示設定を初期化」をクリックします。\n3. 確認ダイアログで実行します。",
      "tags": ["初期化", "設定"],
      "readTime": "3分",
      "level": "basic",
      "updatedAt": "2026-06-01",
      "order": 14
    },
    {
      "id": 5,
      "categoryId": 2,
      "title": "撮影ポイントを確認する",
      "description": "地図上で撮影ポイントの位置、撮影日時、関連動画を確認する方法です。",
      "slug": "check-monitoring-point",
      "type": "markdown",
      "content": "# 撮影ポイントを確認する\n\n撮影ポイントでは、道路を撮影した位置や日時、関連する動画を確認できます。\n\n## 確認できる情報\n\n- 撮影位置\n- 撮影日時\n- 対象路線\n- 関連動画\n- 検出された損傷情報",
      "tags": ["撮影ポイント", "位置情報", "動画"],
      "readTime": "4分",
      "level": "basic",
      "updatedAt": "2026-05-23",
      "order": 1
    },
    {
      "id": 6,
      "categoryId": 2,
      "title": "監視地点の詳細を確認する",
      "description": "監視地点ごとの点検履歴、損傷件数、最新状況を確認する方法です。",
      "slug": "check-monitoring-point-detail",
      "type": "markdown",
      "content": "## 表示項目\n\n- 地点名\n- 所在地\n- 最新点検日\n- 損傷件数\n- 対応ステータス",
      "tags": ["監視地点", "詳細"],
      "readTime": "5分",
      "level": "intermediate",
      "updatedAt": "2026-05-23",
      "order": 2
    },
    {
      "id": 7,
      "categoryId": 3,
      "title": "走行動画を再生する",
      "description": "撮影ポイントに紐づく走行動画を再生する方法を説明します。",
      "slug": "play-driving-video",
      "type": "markdown",
      "content": "## 操作手順\n\n1. 撮影ポイントを選択します。\n2. 「動画を見る」をクリックします。\n3. 動画プレイヤーで再生・停止・シーク操作を行います。",
      "tags": ["動画", "再生", "基本"],
      "readTime": "3分",
      "level": "basic",
      "updatedAt": "2026-05-24",
      "order": 1
    },
    {
      "id": 8,
      "categoryId": 3,
      "title": "損傷箇所を動画で確認する",
      "description": "ポットホールやひび割れなどの損傷箇所を動画上で確認する方法です。",
      "slug": "check-damage-in-video",
      "type": "markdown",
      "content": "## 確認手順\n\n1. 損傷ポイントを選択します。\n2. 「動画で確認」をクリックします。\n3. 動画上の該当位置を確認します。",
      "tags": ["動画", "損傷"],
      "readTime": "5分",
      "level": "intermediate",
      "updatedAt": "2026-05-25",
      "order": 2
    },
    {
      "id": 9,
      "categoryId": 4,
      "title": "点検レポートを確認する",
      "description": "道路点検結果のレポート内容と各項目の見方を説明します。",
      "slug": "view-inspection-report",
      "type": "markdown",
      "content": "## 主な項目\n\n- 点検日\n- 対象エリア\n- 対象路線\n- 検出された損傷件数\n- 対応状況",
      "tags": ["レポート", "点検"],
      "readTime": "4分",
      "level": "basic",
      "updatedAt": "2026-05-25",
      "order": 1
    },
    {
      "id": 10,
      "categoryId": 5,
      "title": "キーワードで検索する",
      "description": "地点名、路線名、損傷種別などのキーワードで検索する方法です。",
      "slug": "search-by-keyword",
      "type": "markdown",
      "content": "## 検索対象\n\n- 地点名\n- 路線名\n- エリア名\n- 損傷種別\n- レポート名",
      "tags": ["検索", "キーワード"],
      "readTime": "2分",
      "level": "basic",
      "updatedAt": "2026-05-26",
      "order": 1
    },
    {
      "id": 11,
      "categoryId": 6,
      "title": "道路損傷のステータスを更新する",
      "description": "検出された損傷の確認状況や対応状況を更新する方法です。",
      "slug": "update-damage-status",
      "type": "markdown",
      "content": "## ステータス例\n\n- 未確認\n- 確認済み\n- 対応中\n- 対応完了",
      "tags": ["損傷", "ステータス"],
      "readTime": "4分",
      "level": "intermediate",
      "updatedAt": "2026-05-27",
      "order": 1
    },
    {
      "id": 12,
      "categoryId": 7,
      "title": "ダッシュボードで道路状態を確認する",
      "description": "エリア別、路線別、損傷種別ごとの統計情報を確認する方法です。",
      "slug": "view-road-condition-dashboard",
      "type": "markdown",
      "content": "## 確認できる情報\n\n- エリア別損傷件数\n- 路線別損傷件数\n- 対応完了率\n- 月別推移",
      "tags": ["ダッシュボード", "統計"],
      "readTime": "5分",
      "level": "intermediate",
      "updatedAt": "2026-05-28",
      "order": 1
    }
  ],
  "menuTree": [
    {
      "id": "category-map-guide",
      "type": "category",
      "title": "地図の使い方",
      "categorySlug": "map-guide",
      "postCount": 14,
      "children": [
        { "id": "post-map-basic-operation", "type": "post", "title": "地図の基本操作を編集", "categorySlug": "map-guide", "postSlug": "map-basic-operation" },
        { "id": "post-switch-map-layer", "type": "post", "title": "レイヤーの切り替え方法", "categorySlug": "map-guide", "postSlug": "switch-map-layer" },
        { "id": "post-select-route-section", "type": "post", "title": "路線・区間を選択する", "categorySlug": "map-guide", "postSlug": "select-route-section" },
        { "id": "post-add-map-memo", "type": "post", "title": "マップにメモを追加する", "categorySlug": "map-guide", "postSlug": "add-map-memo" }
      ]
    },
    {
      "id": "category-monitoring-point-guide",
      "type": "category",
      "title": "損傷ポイントの確認方法",
      "categorySlug": "monitoring-point-guide",
      "postCount": 2,
      "children": [
        { "id": "post-check-monitoring-point", "type": "post", "title": "撮影ポイントを確認する", "categorySlug": "monitoring-point-guide", "postSlug": "check-monitoring-point" },
        { "id": "post-check-monitoring-point-detail", "type": "post", "title": "監視地点の詳細を確認する", "categorySlug": "monitoring-point-guide", "postSlug": "check-monitoring-point-detail" }
      ]
    },
    {
      "id": "category-video-guide",
      "type": "category",
      "title": "動画の確認方法",
      "categorySlug": "video-guide",
      "postCount": 2,
      "children": [
        { "id": "post-play-driving-video", "type": "post", "title": "走行動画を再生する", "categorySlug": "video-guide", "postSlug": "play-driving-video" },
        { "id": "post-check-damage-in-video", "type": "post", "title": "損傷箇所を動画で確認する", "categorySlug": "video-guide", "postSlug": "check-damage-in-video" }
      ]
    },
    {
      "id": "category-report-guide",
      "type": "category",
      "title": "レポートの見方",
      "categorySlug": "report-guide",
      "postCount": 1,
      "children": [
        { "id": "post-view-inspection-report", "type": "post", "title": "点検レポートを確認する", "categorySlug": "report-guide", "postSlug": "view-inspection-report" }
      ]
    },
    {
      "id": "category-faq",
      "type": "category",
      "title": "FAQ よくある質問",
      "categorySlug": "faq",
      "postCount": 1,
      "children": [
        { "id": "post-search-by-keyword", "type": "post", "title": "キーワードで検索する", "categorySlug": "faq", "postSlug": "search-by-keyword" }
      ]
    },
    {
      "id": "category-damage-management-guide",
      "type": "category",
      "title": "損傷・異常の管理",
      "categorySlug": "damage-management-guide",
      "postCount": 1,
      "children": [
        { "id": "post-update-damage-status", "type": "post", "title": "道路損傷のステータスを更新する", "categorySlug": "damage-management-guide", "postSlug": "update-damage-status" }
      ]
    },
    {
      "id": "category-dashboard-guide",
      "type": "category",
      "title": "統計・ダッシュボード",
      "categorySlug": "dashboard-guide",
      "postCount": 1,
      "children": [
        { "id": "post-view-road-condition-dashboard", "type": "post", "title": "ダッシュボードで道路状態を確認する", "categorySlug": "dashboard-guide", "postSlug": "view-road-condition-dashboard" }
      ]
    }
  ]
}) as {
  categories: Category[];
  posts: Post[];
  menuTree: SupportMenuNode[];
};

function sortByOrder<T extends { order: number }>(items: T[]) {
  return [...items].sort((a, b) => a.order - b.order);
}

function filterMenuTreeByKeyword(menuTree: SupportMenuNode[], keyword: string): SupportMenuNode[] {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (!normalizedKeyword) return menuTree;

  return menuTree.reduce<SupportMenuNode[]>((items, category) => {
    const categoryMatched = category.title.toLowerCase().includes(normalizedKeyword);
    const children = category.children?.filter((post) => post.title.toLowerCase().includes(normalizedKeyword)) ?? [];
    if (!categoryMatched && children.length === 0) return items;
    items.push({
      ...category,
      children: categoryMatched ? category.children : children
    });
    return items;
  }, []);
}

export function getSupportCategoriesData() {
  return sortByOrder(supportData.categories);
}

export function getSupportPostsData(filters: { categoryId?: number; slug?: string } = {}) {
  let posts = supportData.posts;
  if (filters.categoryId !== undefined) {
    posts = posts.filter((post) => post.categoryId === filters.categoryId);
  }
  if (filters.slug) {
    posts = posts.filter((post) => post.slug === filters.slug);
  }
  return sortByOrder(posts);
}

export function getSupportMenuTreeData(keyword = "") {
  return filterMenuTreeByKeyword(supportData.menuTree, keyword);
}
