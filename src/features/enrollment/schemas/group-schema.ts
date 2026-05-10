// 단체 신청 정보와 참가자 명단, 참가자 이메일 중복 여부를 검증합니다.
import { z } from "zod";
import { KOREAN_PHONE_NUMBER_REGEX } from "@/features/enrollment/schemas/applicant-schema";

export const groupParticipantSchema = z.object({
  name: z.string().trim().min(1, "참가자 이름을 입력해주세요."),
  email: z
    .string()
    .trim()
    .email("올바른 참가자 이메일 형식으로 입력해주세요."),
});

export const groupParticipantsSchema = z
  .array(groupParticipantSchema)
  .superRefine((participants, context) => {
    const emailMap = new Map<string, number>();

    participants.forEach((participant, index) => {
      const normalizedEmail = participant.email.trim().toLowerCase();
      const firstIndex = emailMap.get(normalizedEmail);

      if (firstIndex !== undefined) {
        context.addIssue({
          code: "custom",
          message: "참가자 이메일은 중복될 수 없습니다.",
          path: [index, "email"],
        });
        context.addIssue({
          code: "custom",
          message: "참가자 이메일은 중복될 수 없습니다.",
          path: [firstIndex, "email"],
        });
        return;
      }

      emailMap.set(normalizedEmail, index);
    });
  });

export const groupSchema = z
  .object({
    organizationName: z.string().trim().min(1, "단체명을 입력해주세요."),
    headCount: z.coerce
      .number()
      .int("신청 인원수는 정수로 입력해주세요.")
      .min(2, "신청 인원수는 최소 2명이어야 합니다.")
      .max(10, "신청 인원수는 최대 10명까지 가능합니다."),
    participants: groupParticipantsSchema,
    contactPerson: z
      .string()
      .trim()
      .regex(KOREAN_PHONE_NUMBER_REGEX, "올바른 담당자 전화번호를 입력해주세요."),
  })
  .superRefine((group, context) => {
    if (group.participants.length !== group.headCount) {
      context.addIssue({
        code: "custom",
        message: "참가자 명단은 신청 인원수와 같아야 합니다.",
        path: ["participants"],
      });
    }
  });

export type GroupParticipantSchemaValues = z.infer<
  typeof groupParticipantSchema
>;
export type GroupSchemaValues = z.infer<typeof groupSchema>;
