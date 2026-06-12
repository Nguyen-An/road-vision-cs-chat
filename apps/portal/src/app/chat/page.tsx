import { History, MessageSquare, NotebookText, Ticket, type LucideIcon } from "lucide-react";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const actionCardClass =
  "grid min-h-16 grid-cols-[42px_minmax(0,1fr)] items-center gap-3.5 rounded-[10px] border border-transparent bg-slate-100 px-[18px] py-3.5 text-left text-slate-950 transition hover:-translate-y-px hover:border-cyan-400/70 hover:bg-cyan-50 hover:shadow-lg hover:shadow-slate-950/10 dark:bg-[#1d2a3b] dark:text-[#f4f8ff] dark:hover:bg-[#122a40] dark:hover:shadow-black/20 [&_svg]:text-cyan-500 dark:[&_svg]:text-[#00d9ff] [&_strong]:mb-1 [&_strong]:block [&_strong]:text-[15px] [&_small]:text-xs [&_small]:leading-[1.45] [&_small]:text-slate-500 dark:[&_small]:text-[#9ba8b7]";

export default async function ChatPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tenantId = String(params.tenantId ?? "demo_tenant");
  const sessionId = String(params.sessionId ?? "session_preview");
  const locale = String(params.locale ?? "ja");
  const sections: Array<{ icon: LucideIcon; title: string; description: string }> = [
    { icon: MessageSquare, title: "リアルタイムチャット", description: "オペレーターとの会話エリア" },
    { icon: NotebookText, title: "FAQ・ナレッジベース", description: "セルフサービス記事と検索" },
    { icon: Ticket, title: "問い合わせチケット", description: "問い合わせチケット作成" },
    { icon: History, title: "会話履歴", description: "過去の対応履歴" }
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-[#071624] dark:text-[#f4f8ff]">
      <section className="mx-auto w-[min(560px,calc(100vw-32px))] py-[72px]">
        <span className="inline-flex rounded-full border border-cyan-400/60 bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-700 dark:bg-[#063047] dark:text-[#00d9ff]">サポートポータル</span>
        <h1 className="mb-4 mt-[18px] text-3xl font-bold">カスタマーサポート</h1>
        <p className="leading-[1.8] text-slate-600 dark:text-[#9ba8b7]">
          tenantId: {tenantId} / sessionId: {sessionId} / locale: {locale}
        </p>
        <div className="mt-[22px] grid gap-3">
          {sections.map(({ icon: Icon, title, description }) => (
            <div className={actionCardClass} key={title}>
              <Icon size={32} />
              <span>
                <strong>{title}</strong>
                <small>{description}</small>
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
