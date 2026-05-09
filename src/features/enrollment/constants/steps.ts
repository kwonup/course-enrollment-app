// 수강 신청 멀티스텝 흐름에서 사용할 단계 목록과 단계 ID 타입을 정의합니다.
export const ENROLLMENT_STEP_IDS = ["course", "applicant", "confirm"] as const;

export const ENROLLMENT_STEPS = [
  {
    id: ENROLLMENT_STEP_IDS[0],
    title: "강의 선택",
  },
  {
    id: ENROLLMENT_STEP_IDS[1],
    title: "신청 정보",
  },
  {
    id: ENROLLMENT_STEP_IDS[2],
    title: "확인 및 제출",
  },
] as const;

export type EnrollmentStepId = (typeof ENROLLMENT_STEP_IDS)[number];
