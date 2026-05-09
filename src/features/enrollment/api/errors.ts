// API 실패 응답을 안전하게 파싱하고, 호출부에서 구분 가능한 에러 객체로 변환합니다.
import type {
  EnrollmentErrorCode,
  ErrorResponse,
} from "@/features/enrollment/types";

const KNOWN_ENROLLMENT_ERROR_CODES: EnrollmentErrorCode[] = [
  "COURSE_FULL",
  "DUPLICATE_ENROLLMENT",
  "INVALID_INPUT",
];

const DEFAULT_ERROR_RESPONSE: ErrorResponse = {
  code: "UNKNOWN_ERROR",
  message: "요청을 처리하는 중 문제가 발생했습니다.",
};

export class ApiError extends Error {
  status: number;
  response: ErrorResponse;

  constructor(status: number, response: ErrorResponse) {
    super(response.message);
    this.name = "ApiError";
    this.status = status;
    this.response = response;
  }

  get code() {
    return this.response.code;
  }

  get details() {
    return this.response.details;
  }
}

export function isKnownEnrollmentErrorCode(
  code: string,
): code is EnrollmentErrorCode {
  return KNOWN_ENROLLMENT_ERROR_CODES.some((knownCode) => knownCode === code);
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseErrorResponse(value: unknown): ErrorResponse {
  if (!isRecord(value)) {
    return DEFAULT_ERROR_RESPONSE;
  }

  return {
    code: typeof value.code === "string" ? value.code : "UNKNOWN_ERROR",
    message:
      typeof value.message === "string"
        ? value.message
        : DEFAULT_ERROR_RESPONSE.message,
    details: isRecord(value.details)
      ? Object.fromEntries(
          Object.entries(value.details).filter(
            (entry): entry is [string, string] => typeof entry[1] === "string",
          ),
        )
      : undefined,
  };
}

export async function parseApiError(response: Response) {
  const payload: unknown = await response.json().catch(() => null);

  return new ApiError(response.status, parseErrorResponse(payload));
}
