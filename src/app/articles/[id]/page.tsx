import Boundary from "@/components/common/Boundary";
import ArticleDetail from "@/components/article/ArticleDetail";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ArticleDetailPage({ params }: any) {
  return (
    <Boundary>
      <ArticleDetail id={params.id} />
    </Boundary>
  );
}
