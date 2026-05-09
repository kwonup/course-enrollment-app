// 수강 신청 제출을 TanStack Query로 감싼 mutation hook입니다.
import { useMutation } from "@tanstack/react-query";
import { submitEnrollment } from "@/features/enrollment/api";
import type { ApiError } from "@/features/enrollment/api";
import type {
  EnrollmentRequest,
  EnrollmentResponse,
} from "@/features/enrollment/types";

export function useEnrollmentMutation() {
  return useMutation<EnrollmentResponse, ApiError, EnrollmentRequest>({
    mutationFn: submitEnrollment,
  });
}
