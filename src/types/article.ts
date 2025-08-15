import type { AnimationConfig } from "./animation";

export interface UserPublic {
  id: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
}

export type ArticleStatus = "draft" | "published" | "private";

export interface Article {
  id: string;
  userId: string;
  title: string;
  content: string;
  animationConfig: AnimationConfig | null;
  coverImageUrl: string | null;
  status: ArticleStatus;
  publishedAt: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  user?: UserPublic;
  tags?: { id: string; name: string; color: string | null }[];
}

export interface ArticleInput {
  title: string;
  content: string;
  animationConfig?: AnimationConfig | null;
  coverImageUrl?: string | null;
  status?: ArticleStatus;
  tags?: string[];
}
