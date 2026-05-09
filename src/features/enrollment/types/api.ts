// 서버와 주고받는 데이터 타입 정의
// API 요청/응답 payload의 계약을 정의하며, 폼 내부 상태 타입과 분리합니다.
import type { CourseCategory } from "@/features/enrollment/constants";

export interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  price: number;
  maxCapacity: number;
  currentEnrollment: number;
  startDate: string;
  endDate: string;
  instructor: string;
}

export interface CourseListResponse {
  courses: Course[];
  categories: CourseCategory[];
}

export type EnrollmentType = "personal" | "group";
export type EnrollmentErrorCode =
  | "COURSE_FULL"
  | "DUPLICATE_ENROLLMENT"
  | "INVALID_INPUT";

//신청자 공통 정보
export interface EnrollmentApplicant {
  name: string;
  email: string;
  phone: string;
  motivation?: string;
}

//단체 신청 참가자 한 명의 타입
export interface GroupParticipant {
  name: string;
  email: string;
}

//단체 신청에서만 필요한 정보
export interface EnrollmentGroup {
  organizationName: string;
  headCount: number;
  participants: GroupParticipant[];
  contactPerson: string;
}

//개인 신청 API 요청 타입
export interface PersonalEnrollmentRequest {
  courseId: string;
  type: "personal";
  applicant: EnrollmentApplicant;
  agreedToTerms: boolean;
}

//단체 신청 API 요청 타입
export interface GroupEnrollmentRequest {
  courseId: string;
  type: "group";
  applicant: EnrollmentApplicant;
  group: EnrollmentGroup;
  agreedToTerms: boolean;
}

export type EnrollmentRequest =
  | PersonalEnrollmentRequest
  | GroupEnrollmentRequest;

//신청 성공 응답
export interface EnrollmentResponse {
  enrollmentId: string;
  status: "confirmed" | "pending";
  enrolledAt: string;
}

//서버 에러 응답
export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, string>;
}
