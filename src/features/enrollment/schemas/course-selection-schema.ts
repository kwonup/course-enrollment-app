// 강의 선택 단계에서 필요한 강의 ID와 신청 유형을 검증합니다.
import { z } from "zod";

export const enrollmentTypeSchema = z.enum(["personal", "group"], {
  error: "신청 유형을 선택해주세요.",
});

export const courseSelectionStepSchema = z.object({
  courseId: z.string().trim().min(1, "강의를 선택해주세요."),
  type: enrollmentTypeSchema,
});

export type CourseSelectionStepValues = z.infer<
  typeof courseSelectionStepSchema
>;
export type EnrollmentTypeValues = z.infer<typeof enrollmentTypeSchema>;
