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

const supportApiBasePath = "/api/support";

async function getSupportData() {
  return import("@/data/support-data");
}

async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${supportApiBasePath}${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Support API request failed: ${response.status} ${path}`);
  }
  return (await response.json()) as T;
}

export async function getCategories() {
  if (typeof window === "undefined") {
    const { getSupportCategoriesData } = await getSupportData();
    return getSupportCategoriesData();
  }

  const categories = await apiFetch<Category[]>("/categories");
  return categories.sort((a, b) => a.order - b.order);
}

export async function getPosts() {
  if (typeof window === "undefined") {
    const { getSupportPostsData } = await getSupportData();
    return getSupportPostsData();
  }

  const posts = await apiFetch<Post[]>("/posts");
  return posts.sort((a, b) => a.order - b.order);
}

export async function getSupportMenuTree(keyword = "") {
  if (typeof window === "undefined") {
    const { getSupportMenuTreeData } = await getSupportData();
    return getSupportMenuTreeData(keyword);
  }

  const params = new URLSearchParams();
  if (keyword.trim()) params.set("q", keyword.trim());
  return apiFetch<SupportMenuNode[]>(`/menu-tree${params.toString() ? `?${params.toString()}` : ""}`);
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug);
}

export async function getPostsByCategory(categoryId: number) {
  if (typeof window === "undefined") {
    const { getSupportPostsData } = await getSupportData();
    return getSupportPostsData({ categoryId });
  }

  const params = new URLSearchParams({ categoryId: String(categoryId) });
  const posts = await apiFetch<Post[]>(`/posts?${params.toString()}`);
  return posts.sort((a, b) => a.order - b.order);
}

export async function getPostBySlug(categoryId: number, postSlug: string) {
  if (typeof window === "undefined") {
    const { getSupportPostsData } = await getSupportData();
    return getSupportPostsData({ categoryId, slug: postSlug })[0];
  }

  const params = new URLSearchParams({ categoryId: String(categoryId), slug: postSlug });
  const posts = await apiFetch<Post[]>(`/posts?${params.toString()}`);
  return posts[0];
}
