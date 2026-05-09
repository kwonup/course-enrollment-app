// 수강 신청 제출 API 함수를 제공합니다.
import type {
  EnrollmentRequest,
  EnrollmentResponse,
} from "@/features/enrollment/types";
import { fetcher } from "@/features/enrollment/api/fetcher";

export function submitEnrollment(payload: EnrollmentRequest) {
  return fetcher<EnrollmentResponse>("/api/enrollments", {
    method: "POST",
    body: payload,
  });
}
