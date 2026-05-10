// RHF/Zod form 값을 서버 제출 API payload로 변환합니다.
import type { EnrollmentFormSchemaValues } from "@/features/enrollment/schemas";
import type {
  EnrollmentApplicant,
  EnrollmentRequest,
} from "@/features/enrollment/types";

function toApplicantPayload(
  applicant: EnrollmentFormSchemaValues["applicant"],
): EnrollmentApplicant {
  const motivation = applicant.motivation.trim();

  return {
    name: applicant.name.trim(),
    email: applicant.email.trim(),
    phone: applicant.phone.trim(),
    ...(motivation ? { motivation } : {}),
  };
}

export function toEnrollmentRequest(
  values: EnrollmentFormSchemaValues,
): EnrollmentRequest {
  const applicant = toApplicantPayload(values.applicant);

  if (values.type === "personal") {
    return {
      courseId: values.courseId,
      type: "personal",
      applicant,
      agreedToTerms: values.agreedToTerms,
    };
  }

  return {
    courseId: values.courseId,
    type: "group",
    applicant,
    group: {
      organizationName: values.group.organizationName.trim(),
      headCount: values.group.headCount,
      participants: values.group.participants.map((participant) => ({
        name: participant.name.trim(),
        email: participant.email.trim(),
      })),
      contactPerson: values.group.contactPerson.trim(),
    },
    agreedToTerms: values.agreedToTerms,
  };
}
