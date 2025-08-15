import ArticleEditor from "@/components/article/ArticleEditor";

export default function NewArticlePage() {
  return (
    <main className="container mx-auto max-w-5xl p-4">
      <h1 className="mb-4 text-3xl font-bold">新規記事</h1>
      <ArticleEditor />
    </main>
  );
}
