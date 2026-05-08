// React Hook Form에서 관리할 수강 신청 입력 상태 타입을 정의합니다.
import type { EnrollmentStepId } from "@/features/enrollment/constants";
import type { CourseCategory } from "@/features/enrollment/constants";

export interface CourseSelectionFormValues {
  courseId: string;
  category?: CourseCategory;
}

export interface ApplicantFormValues {
  name: string;
  email: string;
  phone: string;
  motivation: string;
}

export interface GroupParticipantFormValues {
  name: string;
  email: string;
}

export interface GroupFormValues {
  organizationName: string;
  headCount: number;
  participants: GroupParticipantFormValues[];
  contactPerson: string;
}

export interface BaseEnrollmentFormValues {
  currentStep: EnrollmentStepId;
  courseId: string;
  applicant: ApplicantFormValues;
  agreedToTerms: boolean;
}

export interface PersonalEnrollmentFormValues
  extends BaseEnrollmentFormValues {
  type: "personal";
}

export interface GroupEnrollmentFormValues extends BaseEnrollmentFormValues {
  type: "group";
  group: GroupFormValues;
}

export type EnrollmentFormValues =
  | PersonalEnrollmentFormValues
  | GroupEnrollmentFormValues;
