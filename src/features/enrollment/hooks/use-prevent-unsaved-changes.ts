"use client";

// 입력 중인 폼이 있을 때 브라우저 새로고침/닫기 기본 확인창을 활성화합니다.
import { useEffect } from "react";

interface UsePreventUnsavedChangesParams {
  enabled: boolean;
}

export function usePreventUnsavedChanges({
  enabled,
}: UsePreventUnsavedChangesParams) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled]);
}
