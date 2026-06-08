import Link from "next/link";
import { ChevronLeft, ChevronRight, Grid2X2, List } from "lucide-react";

type TopbarProps = {
  categoryTitle?: string;
  categoryHref?: string;
  postTitle?: string;
};

export function Topbar({ categoryTitle, categoryHref = "/support/categories", postTitle }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <ChevronLeft size={16} />
          <Link href="/support">トップ</Link>
          {categoryTitle ? (
            <>
              <ChevronRight size={14} />
              <Link href={categoryHref}>{categoryTitle}</Link>
            </>
          ) : null}
          {postTitle ? (
            <>
              <ChevronRight size={14} />
              <strong>{postTitle}</strong>
            </>
          ) : null}
        </nav>
        {!postTitle ? (
          <div className="view-toggle" aria-hidden="true">
            <button className="active" type="button">
              <Grid2X2 size={16} />
            </button>
            <button type="button">
              <List size={16} />
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
