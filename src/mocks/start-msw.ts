"use client";

// Next.js 클라이언트 개발 환경에서만 MSW worker를 지연 초기화합니다.
let workerStartPromise: Promise<void> | undefined;

export function startMockWorker() {
  const shouldStart =
    typeof window !== "undefined" &&
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_API_MOCKING !== "disabled";

  if (!shouldStart) {
    return Promise.resolve();
  }

  workerStartPromise ??= import("@/mocks/browser").then(async ({ worker }) => {
    await worker.start({
      onUnhandledRequest: "bypass",
    });
  });

  return workerStartPromise;
}
