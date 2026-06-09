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

export async function getSupportMenuTree() {
  return apiFetch<SupportMenuNode[]>("/menuTree");
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
