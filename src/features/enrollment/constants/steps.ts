export const ENROLLMENT_STEPS = [
  {
    id: "course",
    title: "강의 선택",
  },
  {
    id: "applicant",
    title: "신청 정보",
  },
  {
    id: "confirm",
    title: "확인 및 제출",
  },
] as const;

export type EnrollmentStepId = (typeof ENROLLMENT_STEPS)[number]["id"];
