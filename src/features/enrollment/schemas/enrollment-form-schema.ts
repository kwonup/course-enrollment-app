// 전체 수강 신청 폼을 개인/단체 신청 discriminated union으로 검증합니다.
import { z } from "zod";
import { ENROLLMENT_STEP_IDS } from "@/features/enrollment/constants";
import { applicantSchema } from "@/features/enrollment/schemas/applicant-schema";
import { enrollmentTypeSchema } from "@/features/enrollment/schemas/course-selection-schema";
import { groupSchema } from "@/features/enrollment/schemas/group-schema";

export const enrollmentStepSchema = z.enum(ENROLLMENT_STEP_IDS);

const baseEnrollmentFormSchema = z.object({
  currentStep: enrollmentStepSchema,
  courseId: z.string().trim().min(1, "강의를 선택해주세요."),
  applicant: applicantSchema,
  agreedToTerms: z
    .boolean()
    .refine((value) => value, "이용약관에 동의해주세요."),
});

export const personalEnrollmentFormSchema = baseEnrollmentFormSchema.extend({
  type: z.literal("personal"),
});

export const groupEnrollmentFormSchema = baseEnrollmentFormSchema.extend({
  type: z.literal("group"),
  group: groupSchema,
});

export const enrollmentFormSchema = z.discriminatedUnion("type", [
  personalEnrollmentFormSchema,
  groupEnrollmentFormSchema,
]);

export const enrollmentTypeOnlySchema = z.object({
  type: enrollmentTypeSchema,
});

export type EnrollmentStepSchemaValues = z.infer<typeof enrollmentStepSchema>;
export type PersonalEnrollmentFormSchemaValues = z.infer<
  typeof personalEnrollmentFormSchema
>;
export type GroupEnrollmentFormSchemaValues = z.infer<
  typeof groupEnrollmentFormSchema
>;
export type EnrollmentFormSchemaValues = z.infer<typeof enrollmentFormSchema>;
export type EnrollmentFormInputValues = z.input<typeof enrollmentFormSchema>;
