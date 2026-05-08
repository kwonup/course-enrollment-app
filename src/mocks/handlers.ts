// MSW에서 가로챌 수강 신청 도메인 Mock API handler를 정의합니다.
import { http, HttpResponse } from "msw";
import {
  COURSE_CATEGORIES,
  type CourseCategory,
} from "@/features/enrollment/constants";
import type {
  CourseListResponse,
  EnrollmentRequest,
  EnrollmentResponse,
  ErrorResponse,
  GroupEnrollmentRequest,
  PersonalEnrollmentRequest,
} from "@/features/enrollment/types";
import { courses } from "@/mocks/data/courses";

const DUPLICATE_EMAIL = "already-enrolled@example.com";

function isCourseCategory(value: string): value is CourseCategory {
  return COURSE_CATEGORIES.some((category) => category === value);
}

function createErrorResponse(
  code: ErrorResponse["code"],
  message: string,
  details?: ErrorResponse["details"],
) {
  return HttpResponse.json<ErrorResponse>(
    {
      code,
      message,
      details,
    },
    {
      status: code === "INVALID_INPUT" ? 400 : 409,
    },
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasValidApplicant(
  value: unknown,
  details: Record<string, string>,
): value is EnrollmentRequest["applicant"] {
  if (!isRecord(value)) {
    details.applicant = "신청자 정보를 입력해주세요.";
    return false;
  }

  if (!isNonEmptyString(value.name)) {
    details["applicant.name"] = "이름을 입력해주세요.";
  }

  if (!isNonEmptyString(value.email)) {
    details["applicant.email"] = "이메일을 입력해주세요.";
  }

  if (!isNonEmptyString(value.phone)) {
    details["applicant.phone"] = "전화번호를 입력해주세요.";
  }

  if (
    value.motivation !== undefined &&
    typeof value.motivation !== "string"
  ) {
    details["applicant.motivation"] = "수강 동기는 문자열이어야 합니다.";
  }

  return (
    isNonEmptyString(value.name) &&
    isNonEmptyString(value.email) &&
    isNonEmptyString(value.phone) &&
    (value.motivation === undefined || typeof value.motivation === "string")
  );
}

function hasValidGroup(
  value: unknown,
  details: Record<string, string>,
): value is GroupEnrollmentRequest["group"] {
  if (!isRecord(value)) {
    details.group = "단체 신청 정보를 입력해주세요.";
    return false;
  }

  if (!isNonEmptyString(value.organizationName)) {
    details["group.organizationName"] = "단체명을 입력해주세요.";
  }

  if (typeof value.headCount !== "number") {
    details["group.headCount"] = "신청 인원수를 입력해주세요.";
  } else if (value.headCount < 2 || value.headCount > 10) {
    details["group.headCount"] = "신청 인원수는 2명에서 10명 사이여야 합니다.";
  }

  if (!isNonEmptyString(value.contactPerson)) {
    details["group.contactPerson"] = "담당자 연락처를 입력해주세요.";
  }

  if (!Array.isArray(value.participants)) {
    details["group.participants"] = "참가자 명단을 입력해주세요.";
  } else {
    value.participants.forEach((participant, index) => {
      if (!isRecord(participant)) {
        details[`group.participants.${index}`] = "참가자 정보를 입력해주세요.";
        return;
      }

      if (!isNonEmptyString(participant.name)) {
        details[`group.participants.${index}.name`] =
          "참가자 이름을 입력해주세요.";
      }

      if (!isNonEmptyString(participant.email)) {
        details[`group.participants.${index}.email`] =
          "참가자 이메일을 입력해주세요.";
      }
    });

    if (
      typeof value.headCount === "number" &&
      value.participants.length !== value.headCount
    ) {
      details["group.participants"] =
        "참가자 명단은 신청 인원수와 같아야 합니다.";
    }
  }

  return (
    isNonEmptyString(value.organizationName) &&
    typeof value.headCount === "number" &&
    value.headCount >= 2 &&
    value.headCount <= 10 &&
    Array.isArray(value.participants) &&
    value.participants.length === value.headCount &&
    value.participants.every(
      (participant) =>
        isRecord(participant) &&
        isNonEmptyString(participant.name) &&
        isNonEmptyString(participant.email),
    ) &&
    isNonEmptyString(value.contactPerson)
  );
}

function parseEnrollmentRequest(payload: unknown):
  | {
      request: EnrollmentRequest;
      details: null;
    }
  | {
      request: null;
      details: Record<string, string>;
    } {
  const details: Record<string, string> = {};

  if (!isRecord(payload)) {
    return {
      request: null,
      details: {
        request: "요청 본문이 올바르지 않습니다.",
      },
    };
  }

  if (!isNonEmptyString(payload.courseId)) {
    details.courseId = "강의를 선택해주세요.";
  }

  if (payload.type !== "personal" && payload.type !== "group") {
    details.type = "신청 유형을 선택해주세요.";
  }

  if (payload.agreedToTerms !== true) {
    details.agreedToTerms = "이용약관에 동의해주세요.";
  }

  const applicant = payload.applicant;
  const group = payload.group;
  const hasApplicant = hasValidApplicant(applicant, details);

  if (payload.type === "personal") {
    if (
      Object.keys(details).length > 0 ||
      !isNonEmptyString(payload.courseId) ||
      !hasApplicant ||
      payload.agreedToTerms !== true
    ) {
      return { request: null, details };
    }

    const request: PersonalEnrollmentRequest = {
      courseId: payload.courseId,
      type: "personal",
      applicant,
      agreedToTerms: payload.agreedToTerms,
    };

    return { request, details: null };
  }

  if (payload.type === "group") {
    const hasGroup = hasValidGroup(group, details);

    if (
      Object.keys(details).length > 0 ||
      !isNonEmptyString(payload.courseId) ||
      !hasApplicant ||
      !hasGroup ||
      payload.agreedToTerms !== true
    ) {
      return { request: null, details };
    }

    const request: GroupEnrollmentRequest = {
      courseId: payload.courseId,
      type: "group",
      applicant,
      group,
      agreedToTerms: payload.agreedToTerms,
    };

    return { request, details: null };
  }

  return { request: null, details };
}

export const handlers = [
  http.get("/api/courses", ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const filteredCourses =
      category === null
        ? courses
        : isCourseCategory(category)
          ? courses.filter((course) => course.category === category)
          : [];

    return HttpResponse.json<CourseListResponse>({
      courses: filteredCourses,
      categories: [...COURSE_CATEGORIES],
    });
  }),

  http.post("/api/enrollments", async ({ request }) => {
    const payload: unknown = await request.json().catch(() => null);
    const parsedRequest = parseEnrollmentRequest(payload);

    if (parsedRequest.request === null) {
      return createErrorResponse(
        "INVALID_INPUT",
        "입력값을 확인해주세요.",
        parsedRequest.details,
      );
    }

    const selectedCourse = courses.find(
      (course) => course.id === parsedRequest.request.courseId,
    );

    if (!selectedCourse) {
      return createErrorResponse("INVALID_INPUT", "존재하지 않는 강의입니다.", {
        courseId: "선택한 강의를 찾을 수 없습니다.",
      });
    }

    if (selectedCourse.currentEnrollment >= selectedCourse.maxCapacity) {
      return createErrorResponse(
        "COURSE_FULL",
        "선택한 강의의 정원이 마감되었습니다.",
        {
          courseId: "다른 강의를 선택해주세요.",
        },
      );
    }

    if (parsedRequest.request.applicant.email === DUPLICATE_EMAIL) {
      return createErrorResponse(
        "DUPLICATE_ENROLLMENT",
        "이미 신청된 강의입니다.",
        {
          "applicant.email": "이 이메일로 이미 신청된 강의입니다.",
        },
      );
    }

    const response: EnrollmentResponse = {
      enrollmentId: `enrollment-${Date.now()}`,
      status: "confirmed",
      enrolledAt: new Date().toISOString(),
    };

    return HttpResponse.json(response, { status: 201 });
  }),
];
