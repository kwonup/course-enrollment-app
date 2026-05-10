// 서버 INVALID_INPUT details를 React Hook Form field error로 반영하기 위한 유틸입니다.
import type { FieldPath, UseFormSetError } from "react-hook-form";
import { isApiError } from "@/features/enrollment/api";
import type { EnrollmentFormInputValues } from "@/features/enrollment/schemas";

const FIELD_PATHS = [
  "courseId",
  "type",
  "applicant.name",
  "applicant.email",
  "applicant.phone",
  "applicant.motivation",
  "agreedToTerms",
  "group.organizationName",
  "group.headCount",
  "group.participants",
  "group.contactPerson",
] as const satisfies readonly FieldPath<EnrollmentFormInputValues>[];

function isKnownFieldPath(
  path: string,
): path is FieldPath<EnrollmentFormInputValues> {
  if (
    /^group\.participants\.\d+\.(name|email)$/.test(path)
  ) {
    return true;
  }

  return FIELD_PATHS.some((fieldPath) => fieldPath === path);
}

export function applyInvalidInputFieldErrors(
  error: unknown,
  setError: UseFormSetError<EnrollmentFormInputValues>,
) {
  if (!isApiError(error) || error.code !== "INVALID_INPUT" || !error.details) {
    return false;
  }

  Object.entries(error.details).forEach(([path, message]) => {
    if (!isKnownFieldPath(path)) {
      return;
    }

    setError(path, {
      type: "server",
      message,
    });
  });

  return true;
}
