"use client";
import { Suspense, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { LoadingState, ErrorState } from "@/components/common/AsyncStates";

export default function Boundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary fallbackRender={() => <ErrorState />}>
      <Suspense fallback={<LoadingState />}>{children}</Suspense>
    </ErrorBoundary>
  );
}
