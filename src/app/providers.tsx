"use client";

// 클라이언트 전역 Provider를 모아 앱 전체에 TanStack Query와 MSW 초기화를 제공합니다.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { startMockWorker } from "@/mocks/start-msw";

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
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
    void startMockWorker();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
