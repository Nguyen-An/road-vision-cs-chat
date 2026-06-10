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
export type CategoryIconName = "Map" | "MapPin" | "Video" | "FileText" | "Filter" | "AlertTriangle" | "BarChart3" | "Users";
export type SupportMenuNodeType = "category" | "post";

export interface Category {
  id: number;
  title: string;
  description: string;
  slug: string;
  iconName: CategoryIconName;
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

export interface SupportMenuNode {
  id: string;
  type: SupportMenuNodeType;
  title: string;
  postCount?: number;
  categorySlug?: string;
  postSlug?: string;
  children?: SupportMenuNode[];
}

export const categoryIconMap: Record<CategoryIconName, LucideIcon> = {
  AlertTriangle,
  BarChart3,
  FileText,
  Filter,
  Map,
  MapPin,
  Users,
  Video
};

export function getCategoryIcon(category: Category) {
  return categoryIconMap[category.iconName] ?? FileText;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_SUPPORT_API_BASE_URL ?? "http://localhost:8000";

async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Support API request failed: ${response.status} ${path}`);
  }
  return (await response.json()) as T;
}

export async function getCategories() {
  const categories = await apiFetch<Category[]>("/categories");
  return categories.sort((a, b) => a.order - b.order);
}

export async function getPosts() {
  const posts = await apiFetch<Post[]>("/posts");
  return posts.sort((a, b) => a.order - b.order);
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

export async function getSupportMenuTree(keyword = "") {
  const params = new URLSearchParams();
  if (keyword.trim()) params.set("q", keyword.trim());
  let menuTree = await apiFetch<SupportMenuNode[]>(`/menuTree${params.toString() ? `?${params.toString()}` : ""}`);
  if (keyword.trim() && menuTree.length === 0) {
    menuTree = await apiFetch<SupportMenuNode[]>("/menuTree");
  }
  return filterMenuTreeByKeyword(menuTree, keyword);
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug);
}

export async function getPostsByCategory(categoryId: number) {
  const params = new URLSearchParams({ categoryId: String(categoryId) });
  const posts = await apiFetch<Post[]>(`/posts?${params.toString()}`);
  return posts.sort((a, b) => a.order - b.order);
}

export async function getPostBySlug(categoryId: number, postSlug: string) {
  const params = new URLSearchParams({ categoryId: String(categoryId), slug: postSlug });
  const posts = await apiFetch<Post[]>(`/posts?${params.toString()}`);
  return posts[0];
}
