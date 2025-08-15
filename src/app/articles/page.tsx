import ArticleList from "@/components/article/ArticleList";
import Boundary from "@/components/common/Boundary";

export const dynamic = "force-dynamic";

export default function ArticlesPage() {
  return (
    <main className="container mx-auto max-w-5xl p-4">
      <h1 className="mb-4 text-3xl font-bold">記事一覧</h1>
      <Boundary>
        <ArticleList />
      </Boundary>
    </main>
  );
}
