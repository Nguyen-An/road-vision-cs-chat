import { History, MessageSquare, NotebookText, Ticket, type LucideIcon } from "lucide-react";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ChatPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tenantId = String(params.tenantId ?? "demo_tenant");
  const sessionId = String(params.sessionId ?? "session_preview");
  const locale = String(params.locale ?? "ja");
  const sections: Array<{ icon: LucideIcon; title: string; description: string }> = [
    { icon: MessageSquare, title: "Chat realtime UI", description: "オペレーターとの会話エリア" },
    { icon: NotebookText, title: "FAQ / Knowledge Base", description: "セルフサービス記事と検索" },
    { icon: Ticket, title: "Ticket form", description: "問い合わせチケット作成" },
    { icon: History, title: "Conversation history", description: "過去の対応履歴" }
  ];

  return (
    <main className="app-shell">
      <section className="category-list-page">
        <span className="article-label">Support Portal</span>
        <h1>Customer Support</h1>
        <p className="article-description">tenantId: {tenantId} / sessionId: {sessionId} / locale: {locale}</p>
        <div className="category-page-card">
          {sections.map(({ icon: Icon, title, description }) => (
            <div className="widget-action-card" key={title}>
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
