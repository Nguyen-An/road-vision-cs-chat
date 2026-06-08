export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");

export function extractToc(markdown: string): TocItem[] {
  return markdown
    .split("\n")
    .map((line) => {
      const match = /^(##|###)\s+(.+)$/.exec(line.trim());
      if (!match) return null;
      const text = match[2];
      return { id: slugify(text), text, level: match[1] === "##" ? 2 : 3 } satisfies TocItem;
    })
    .filter((item): item is TocItem => Boolean(item));
}

export function renderMarkdown(markdown: string) {
  const lines = markdown.trim().split("\n");
  const html: string[] = [];
  let listMode: "ol" | "ul" | null = null;

  const closeList = () => {
    if (listMode) {
      html.push(`</${listMode}>`);
      listMode = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (!line) {
      closeList();
      continue;
    }

    if (line.startsWith("### ")) {
      closeList();
      const text = line.slice(4);
      html.push(`<h3 id="${slugify(text)}">${escapeHtml(text)}</h3>`);
      continue;
    }

    if (line.startsWith("## ")) {
      closeList();
      const text = line.slice(3);
      html.push(`<h2 id="${slugify(text)}">${escapeHtml(text)}</h2>`);
      continue;
    }

    if (line.startsWith("# ")) {
      closeList();
      continue;
    }

    const ordered = /^\d+\.\s+(.+)$/.exec(line);
    if (ordered) {
      if (listMode !== "ol") {
        closeList();
        listMode = "ol";
        html.push("<ol>");
      }
      html.push(`<li>${escapeHtml(ordered[1])}</li>`);
      continue;
    }

    if (line.startsWith("- ")) {
      if (listMode !== "ul") {
        closeList();
        listMode = "ul";
        html.push("<ul>");
      }
      html.push(`<li>${escapeHtml(line.slice(2))}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${escapeHtml(line)}</p>`);
  }

  closeList();
  return html.join("");
}
