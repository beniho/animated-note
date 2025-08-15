import { cn } from "@/lib/utils";

export function LoadingState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center py-8 text-sm text-gray-600",
        className
      )}
    >
      読み込み中...
    </div>
  );
}

export function ErrorState({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700",
        className
      )}
    >
      {message || "エラーが発生しました"}
    </div>
  );
}

export function EmptyState({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center py-8 text-sm text-gray-500",
        className
      )}
    >
      {message || "データがありません"}
    </div>
  );
}
