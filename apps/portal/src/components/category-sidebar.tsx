"use client";

import { BookOpen, ChevronDown, FileText, Plus, SquarePen } from "lucide-react";
import { supportMenuTree } from "@/lib/data-cs";

type CategorySidebarProps = {
  activeCategorySlug: string;
  activePostSlug?: string;
  count: number;
  expandedCategorySlugs: string[];
  onToggleCategory: (categorySlug: string) => void;
  onSelectCategory: (categorySlug: string) => void;
  onSelectPost: (categorySlug: string, postSlug: string) => void;
};

export function CategorySidebar({
  activeCategorySlug,
  activePostSlug,
  count,
  expandedCategorySlugs,
  onToggleCategory,
  onSelectCategory,
  onSelectPost
}: CategorySidebarProps) {
  return (
    <aside className="sidebar">
      <div className="menu-panel">
        <div className="menu-panel-head">
          <p className="sidebar-label">目次（カテゴリ）</p>
          <div className="menu-actions">
            <button type="button" aria-label="新しいカテゴリを追加">
              <Plus size={18} />
            </button>
            <button type="button" aria-label="選択中の項目を編集">
              <SquarePen size={17} />
            </button>
          </div>
        </div>

        <nav aria-label="目次（カテゴリ）">
          <ul className="menu-tree">
            {supportMenuTree.map((category) => {
              if (!category.categorySlug) return null;
              const expanded = expandedCategorySlugs.includes(category.categorySlug);
              const activeCategory = category.categorySlug === activeCategorySlug && !activePostSlug;

              return (
                <li className="menu-tree-item depth-0" key={category.id}>
                  <div className={`menu-tree-row ${activeCategory ? "active" : ""}`}>
                    <button
                      className={`menu-tree-toggle ${expanded ? "expanded" : ""}`}
                      type="button"
                      aria-label={`${category.title}を開閉`}
                      aria-expanded={expanded}
                      onClick={() => onToggleCategory(category.categorySlug as string)}
                    >
                      <ChevronDown size={15} />
                    </button>
                    <button
                      className="menu-tree-link"
                      type="button"
                      onClick={() => {
                        onSelectCategory(category.categorySlug as string);
                        if (!expanded) onToggleCategory(category.categorySlug as string);
                      }}
                    >
                      <BookOpen size={17} />
                      <span>{category.title}</span>
                    </button>
                    <button className="menu-tree-edit" type="button" aria-label={`${category.title}を編集`}>
                      <SquarePen size={14} />
                    </button>
                  </div>

                  {expanded ? (
                    <ul className="menu-tree-children">
                      {category.children?.map((post) => {
                        if (!post.categorySlug || !post.postSlug) return null;
                        const activePost = post.categorySlug === activeCategorySlug && post.postSlug === activePostSlug;
                        return (
                          <li className="menu-tree-item depth-1" key={post.id}>
                            <div className={`menu-tree-row ${activePost ? "active" : ""}`}>
                              <span className="menu-tree-toggle" aria-hidden="true" />
                              <button className="menu-tree-link" type="button" onClick={() => onSelectPost(post.categorySlug as string, post.postSlug as string)}>
                                <FileText size={16} />
                                <span>{post.title}</span>
                              </button>
                              <button className="menu-tree-edit" type="button" aria-label={`${post.title}を編集`}>
                                <SquarePen size={14} />
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </nav>

        <button className="add-category-button" type="button">
          <Plus size={17} />
          <span>新しいカテゴリを追加</span>
        </button>
      </div>

      <div className="count-box">
        <span>記事数</span>
        <strong>
          {count}
          <small> 件</small>
        </strong>
      </div>
    </aside>
  );
}
