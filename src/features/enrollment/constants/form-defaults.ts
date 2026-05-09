// 멀티스텝 폼을 처음 열 때 사용할 React Hook Form 기본값을 정의합니다.
import type { EnrollmentFormInputValues } from "@/features/enrollment/schemas";

export const DEFAULT_ENROLLMENT_FORM_VALUES: EnrollmentFormInputValues = {
  currentStep: "course",
  courseId: "",
  type: "personal",
  applicant: {
    name: "",
    email: "",
    phone: "",
    motivation: "",
  },
  agreedToTerms: false,
};
