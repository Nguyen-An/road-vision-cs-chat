"use client";

import { BookOpen, ChevronLeft, FileQuestion, Headphones, Map, MapPin, MessageSquare, Video, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCategoriesQuery } from "@/lib/support-queries";
import { getCategoryIcon } from "@/lib/support-api";

type Screen = "home" | "categories";

type SupportWidgetProps = {
  embedded?: boolean;
};

export function SupportWidget({ embedded = false }: SupportWidgetProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [screen, setScreen] = useState<Screen>("home");
  const { data: categories = [] } = useCategoriesQuery();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) panelRef.current?.focus();
  }, [isOpen, screen]);

  const visibleCategories = categories.slice(0, 5);
  const closeWidget = () => {
    if (embedded) {
      window.parent.postMessage({ type: "support_widget_close" }, "*");
    }
    setIsOpen(false);
  };

  return (
    <div className={`widget-demo ${embedded ? "embedded" : ""}`}>
      {isOpen ? (
        <section className="support-widget-panel" ref={panelRef} tabIndex={-1} aria-label="カスタマーサポート">
          <header className="support-widget-header">
            {screen === "home" ? (
              <h1>カスタマーサポート</h1>
            ) : (
              <button className="widget-back" type="button" onClick={() => setScreen("home")}>
                <ChevronLeft size={18} />
                <span>使い方を調べる</span>
              </button>
            )}
            <button className="widget-close" type="button" aria-label="閉じる" onClick={closeWidget}>
              <X size={22} />
            </button>
          </header>

          {screen === "home" ? (
            <div className="support-widget-body">
              <p className="widget-intro">こんにちは。どのようなご用件でしょうか？ 以下のオプションからお選びください。</p>
              <button className="widget-action-card" type="button" onClick={() => setScreen("categories")}>
                <BookOpen size={30} />
                <span>
                  <strong>使い方を調べる</strong>
                  <small>よくある質問やマニュアルを確認する</small>
                </span>
              </button>
              <button className="widget-action-card" type="button">
                <Headphones size={32} />
                <span>
                  <strong>担当者につなぐ</strong>
                  <small>オペレーターと直接チャットで相談する</small>
                </span>
              </button>
            </div>
          ) : (
            <div className="support-widget-body category-cards">
              {visibleCategories.map((category) => {
                const Fallback = category.slug === "map-guide" ? Map : category.slug === "monitoring-point-guide" ? MapPin : category.slug === "video-guide" ? Video : category.slug === "faq" ? MessageSquare : FileQuestion;
                const CardIcon = getCategoryIcon(category) ?? Fallback;
                const href = `/support/categories/${category.slug}`;
                return (
                  <Link className="widget-action-card" key={category.id} href={href} target={embedded ? "_top" : undefined}>
                    <CardIcon size={32} />
                    <span>
                      <strong>{category.title}</strong>
                      <small>{category.description}</small>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      ) : null}

      {!embedded ? (
        <button className="support-fab" type="button" aria-label={isOpen ? "閉じる" : "開く"} onClick={() => setIsOpen((value) => !value)}>
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      ) : null}
    </div>
  );
}
