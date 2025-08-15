import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { articleInputSchema } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const listQuery = z.object({
  q: z.string().optional(),
  tag: z.string().optional(),
  sort: z.enum(["new", "popular"]).optional(),
  status: z.enum(["draft", "published", "private", "all"]).optional(),
  cursor: z.string().optional(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = listQuery.safeParse(
    Object.fromEntries(searchParams.entries())
  );
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  const { q, tag, sort, cursor, status } = parsed.data;

  const take = 10;
  let where: Prisma.ArticleWhereInput = {};
  const statusFilter = status ?? "published";
  if (statusFilter !== "all") {
    where.status = statusFilter as Prisma.EnumArticleStatusFilter | undefined;
  }
  if (q) {
    where = {
      ...where,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
      ],
    };
  }
  if (tag) {
    where = {
      ...where,
      tags: { some: { tag: { name: tag } } },
    };
  }

  const items = await prisma.article.findMany({
    where,
    take: take + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: sort === "popular" ? { likeCount: "desc" } : { createdAt: "desc" },
    include: { user: true, tags: { include: { tag: true } } },
  });

  const nextCursor = items.length > take ? items[take].id : undefined;
  const trimmed = items.slice(0, take).map((a) => ({
    ...a,
    animationConfig: a.animationConfig as unknown,
    user: a.user
      ? {
          id: a.user.id,
          username: a.user.username,
          displayName: a.user.displayName,
          avatarUrl: a.user.avatarUrl,
        }
      : undefined,
    tags: a.tags.map((t) => ({
      id: t.tag.id,
      name: t.tag.name,
      color: t.tag.color,
    })),
  }));
  return NextResponse.json({ items: trimmed, nextCursor });
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = articleInputSchema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const {
    title,
    content,
    animationConfig,
    coverImageUrl,
    status = "draft",
    tags,
  } = parsed.data;

  // 認証必須化: 未ログインは 401
  const session = await getServerSession(authOptions);
  const sessionUserId = (session as unknown as { userId?: string })?.userId;
  const sessionEmail = session?.user?.email || null;
  let userId: string | null = sessionUserId || null;
  if (!userId && sessionEmail) {
    const user = await prisma.user.findUnique({
      where: { email: sessionEmail },
      select: { id: true },
    });
    userId = user?.id || null;
  }
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const created = await prisma.article.create({
    data: {
      title,
      content,
      animationConfig: animationConfig as unknown as object,
      coverImageUrl: coverImageUrl || null,
      status: status as "draft" | "published" | "private",
      userId,
      // NOTE: 認証統合後は auth() から userId を取得して使用
    },
  });

  if (tags?.length) {
    const tagRows = await Promise.all(
      tags.map(async (name) =>
        prisma.tag.upsert({ where: { name }, create: { name }, update: {} })
      )
    );
    await prisma.articleTag.createMany({
      data: tagRows.map((t) => ({ articleId: created.id, tagId: t.id })),
      skipDuplicates: true,
    });
  }

  const result = await prisma.article.findUnique({
    where: { id: created.id },
    include: { user: true, tags: { include: { tag: true } } },
  });

  if (!result)
    return NextResponse.json(
      { error: "Not found after create" },
      { status: 500 }
    );

  return NextResponse.json({
    ...result,
    animationConfig: result.animationConfig as unknown,
    user: result.user
      ? {
          id: result.user.id,
          username: result.user.username,
          displayName: result.user.displayName,
          avatarUrl: result.user.avatarUrl,
        }
      : undefined,
    tags: result.tags.map((t) => ({
      id: t.tag.id,
      name: t.tag.name,
      color: t.tag.color,
    })),
  });
}
