// 수강 신청 멀티스텝 흐름에서 사용할 단계 목록과 단계 ID 타입을 정의합니다.
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
