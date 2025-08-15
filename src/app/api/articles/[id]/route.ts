import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { articleInputSchema } from "@/lib/api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(_req: Request, ctx: any) {
  const { params } = ctx as { params: { id: string } };
  const a = await prisma.article.findUnique({
    where: { id: params.id },
    include: { user: true, tags: { include: { tag: true } } },
  });
  if (!a) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
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
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: Request, ctx: any) {
  const { params } = ctx as { params: { id: string } };
  const json = await req.json().catch(() => null);
  const parsed = articleInputSchema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { title, content, animationConfig, coverImageUrl, status, tags } =
    parsed.data;

  const updated = await prisma.article.update({
    where: { id: params.id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(content !== undefined ? { content } : {}),
      ...(animationConfig !== undefined
        ? { animationConfig: animationConfig as unknown as object }
        : {}),
      ...(coverImageUrl !== undefined ? { coverImageUrl } : {}),
      ...(status !== undefined
        ? { status: status as "draft" | "published" | "private" }
        : {}),
    },
  });

  if (tags) {
    // 再紐付け
    await prisma.articleTag.deleteMany({ where: { articleId: params.id } });
    const tagRows = await Promise.all(
      tags.map(async (name) =>
        prisma.tag.upsert({ where: { name }, create: { name }, update: {} })
      )
    );
    await prisma.articleTag.createMany({
      data: tagRows.map((t) => ({ articleId: params.id, tagId: t.id })),
    });
  }

  const result = await prisma.article.findUnique({
    where: { id: updated.id },
    include: { user: true, tags: { include: { tag: true } } },
  });
  if (!result)
    return NextResponse.json(
      { error: "Not found after update" },
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(_req: Request, ctx: any) {
  const { params } = ctx as { params: { id: string } };
  await prisma.article.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
