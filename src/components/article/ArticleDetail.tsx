"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import AnimatedText from "@/components/animation/AnimatedText";

export default function ArticleDetail({ id }: { id: string }) {
  const { data: article } = useQuery({
    queryKey: ["article", id],
    queryFn: () => api.getArticle(id),
  });

  if (!article) return null;

  const config = article.animationConfig || {
    globalConfig: { autoPlay: true, playSpeed: 1, previewMode: false },
    animations: [],
  };

  return (
    <main className="container mx-auto max-w-3xl p-4">
      <h1 className="mb-3 text-4xl font-bold">
        <AnimatedText text={article.title} config={config} />
      </h1>
      <article className="prose max-w-none">
        <p>
          <AnimatedText text={article.content} config={config} />
        </p>
      </article>
    </main>
  );
}
