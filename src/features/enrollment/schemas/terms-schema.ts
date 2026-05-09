// 최종 제출 단계에서 이용약관 동의 여부를 검증합니다.
import { z } from "zod";

export const termsAgreementSchema = z.object({
  agreedToTerms: z
    .boolean()
    .refine((value) => value, "이용약관에 동의해주세요."),
});

export type TermsAgreementSchemaValues = z.infer<
  typeof termsAgreementSchema
>;
