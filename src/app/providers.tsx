"use client";

// 클라이언트 전역 Provider를 모아 앱 전체에 TanStack Query와 MSW 초기화를 제공합니다.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { startMockWorker } from "@/mocks/start-msw";

const shouldWaitForMockWorker =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_API_MOCKING !== "disabled";

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  const [isMockWorkerReady, setIsMockWorkerReady] = useState(
    !shouldWaitForMockWorker,
  );
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            retry: 1,
          },
        },
      }),
  );

  useEffect(() => {
    let isMounted = true;

    void startMockWorker().finally(() => {
      if (isMounted) {
        setIsMockWorkerReady(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {isMockWorkerReady ? (
        children
      ) : (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-sm text-slate-600">
          <span
            className="size-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-950"
            aria-hidden="true"
          />
          <span>Mock API를 준비하고 있습니다.</span>
        </div>
      )}
    </QueryClientProvider>
  );
}
