import { z } from "zod";
import type { Article, ArticleInput } from "@/types/article";

const baseUrl = "";

export const articleInputSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  animationConfig: z.any().nullable().optional(),
  coverImageUrl: z.string().url().nullable().optional(),
  status: z.enum(["draft", "published", "private"]).optional(),
  tags: z.array(z.string()).optional(),
});
export type ArticleInputSchema = z.infer<typeof articleInputSchema>;

export async function fetchJSON<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  listArticles: (params?: {
    q?: string;
    tag?: string;
    sort?: string;
    status?: "draft" | "published" | "private" | "all";
    cursor?: string;
  }) =>
    fetchJSON<{ items: Article[]; nextCursor?: string }>(
      `${baseUrl}/api/articles${
        params
          ? `?${new URLSearchParams(
              params as Record<string, string>
            ).toString()}`
          : ""
      }`
    ),
  getArticle: (id: string) =>
    fetchJSON<Article>(`${baseUrl}/api/articles/${id}`),
  createArticle: (data: ArticleInput) =>
    fetchJSON<Article>(`${baseUrl}/api/articles`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateArticle: (id: string, data: ArticleInput) =>
    fetchJSON<Article>(`${baseUrl}/api/articles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteArticle: (id: string) =>
    fetchJSON<{ success: true }>(`${baseUrl}/api/articles/${id}`, {
      method: "DELETE",
    }),
};
