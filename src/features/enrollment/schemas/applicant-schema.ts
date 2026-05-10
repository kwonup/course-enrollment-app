// 수강생 공통 입력값의 이름, 이메일, 전화번호, 수강 동기를 검증합니다.
import { z } from "zod";

export const KOREAN_PHONE_NUMBER_REGEX =
  /^(01[016789]-?\d{3,4}-?\d{4}|0\d{1,2}-?\d{3,4}-?\d{4})$/;

export const applicantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "이름은 2자 이상 입력해주세요.")
    .max(20, "이름은 20자 이하로 입력해주세요."),
  email: z.string().trim().email("올바른 이메일 형식으로 입력해주세요."),
  phone: z
    .string()
    .trim()
    .regex(KOREAN_PHONE_NUMBER_REGEX, "올바른 전화번호 형식으로 입력해주세요."),
  motivation: z.string().max(300, "수강 동기는 300자 이하로 입력해주세요."),
});

export type ApplicantSchemaValues = z.infer<typeof applicantSchema>;
