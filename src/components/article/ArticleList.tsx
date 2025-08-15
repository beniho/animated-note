"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { EmptyState } from "@/components/common/AsyncStates";

export default function ArticleList() {
  const { data } = useQuery({
    queryKey: ["articles", { status: "all" }],
    queryFn: () => api.listArticles({ status: "all" }),
  });
  const items = data?.items ?? [];
  if (items.length === 0) return <EmptyState message="記事がありません" />;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((a) => (
        <Link key={a.id} href={`/articles/${a.id}`}>
          <Card className="hover:bg-gray-50">
            <CardHeader>
              <CardTitle className="text-xl">{a.title}</CardTitle>
              <div className="text-sm text-gray-500">
                {new Date(a.createdAt).toLocaleString()}
              </div>
            </CardHeader>
            <CardContent>
              <div className="line-clamp-3 text-gray-600">{a.content}</div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
