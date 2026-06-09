"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories, getPostBySlug, getPosts, getPostsByCategory, getSupportMenuTree } from "@/lib/support-api";

export const supportQueryKeys = {
  categories: ["support", "categories"] as const,
  posts: ["support", "posts"] as const,
  postsByCategory: (categoryId: number) => ["support", "posts", "category", categoryId] as const,
  postDetail: (categoryId: number, postSlug: string) => ["support", "posts", "detail", categoryId, postSlug] as const,
  menuTree: ["support", "menuTree"] as const
};

export function useCategoriesQuery() {
  return useQuery({
    queryKey: supportQueryKeys.categories,
    queryFn: getCategories
  });
}

export function usePostsQuery() {
  return useQuery({
    queryKey: supportQueryKeys.posts,
    queryFn: getPosts
  });
}

export function usePostsByCategoryQuery(categoryId?: number) {
  return useQuery({
    queryKey: categoryId ? supportQueryKeys.postsByCategory(categoryId) : ["support", "posts", "category", "none"],
    queryFn: () => getPostsByCategory(categoryId as number),
    enabled: Boolean(categoryId)
  });
}

export function usePostDetailQuery(categoryId?: number, postSlug?: string) {
  return useQuery({
    queryKey: categoryId && postSlug ? supportQueryKeys.postDetail(categoryId, postSlug) : ["support", "posts", "detail", "none"],
    queryFn: () => getPostBySlug(categoryId as number, postSlug as string),
    enabled: Boolean(categoryId && postSlug)
  });
}

export function useMenuTreeQuery() {
  return useQuery({
    queryKey: supportQueryKeys.menuTree,
    queryFn: getSupportMenuTree
  });
}
