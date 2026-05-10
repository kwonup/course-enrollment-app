// 수강 신청 폼의 임시 저장 데이터를 서버 응답과 분리된 localStorage draft로 관리합니다.
import {
  DEFAULT_ENROLLMENT_FORM_VALUES,
  ENROLLMENT_STEP_IDS,
  type EnrollmentStepId,
} from "@/features/enrollment/constants";
import type { EnrollmentFormInputValues } from "@/features/enrollment/schemas";
import type { GroupSchemaValues } from "@/features/enrollment/schemas";
import { createDefaultGroupValues } from "@/features/enrollment/utils/group-form";

const ENROLLMENT_DRAFT_STORAGE_KEY = "course-enrollment:form-draft:v1";
const ENROLLMENT_DRAFT_KIND = "enrollment-form-draft";
const ENROLLMENT_DRAFT_VERSION = 1;

export interface EnrollmentDraft {
  kind: typeof ENROLLMENT_DRAFT_KIND;
  version: typeof ENROLLMENT_DRAFT_VERSION;
  savedAt: string;
  values: EnrollmentFormInputValues;
  furthestStepIndex: number;
}

function isBrowser() {
  return typeof window !== "undefined";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function readBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function readNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function readIsoDate(value: unknown) {
  if (typeof value !== "string" || Number.isNaN(new Date(value).getTime())) {
    return new Date().toISOString();
  }

  return value;
}

function isEnrollmentStepId(value: unknown): value is EnrollmentStepId {
  return (
    typeof value === "string" &&
    ENROLLMENT_STEP_IDS.includes(value as EnrollmentStepId)
  );
}

function normalizeApplicant(value: unknown) {
  const fallback = DEFAULT_ENROLLMENT_FORM_VALUES.applicant;

  if (!isRecord(value)) {
    return fallback;
  }

  return {
    name: readString(value.name, fallback.name),
    email: readString(value.email, fallback.email),
    phone: readString(value.phone, fallback.phone),
    motivation: readString(value.motivation, fallback.motivation),
  };
}

function normalizeParticipants(value: unknown, fallback: GroupSchemaValues) {
  if (!Array.isArray(value)) {
    return fallback.participants;
  }

  const participants = value
    .filter(isRecord)
    .map((participant) => ({
      name: readString(participant.name),
      email: readString(participant.email),
    }));

  return participants.length > 0 ? participants : fallback.participants;
}

function normalizeGroup(value: unknown): GroupSchemaValues {
  const fallback = createDefaultGroupValues();

  if (!isRecord(value)) {
    return fallback;
  }

  return {
    organizationName: readString(
      value.organizationName,
      fallback.organizationName,
    ),
    headCount: readNumber(value.headCount, fallback.headCount),
    participants: normalizeParticipants(value.participants, fallback),
    contactPerson: readString(value.contactPerson, fallback.contactPerson),
  };
}

function normalizeDraftValues(value: unknown): EnrollmentFormInputValues | null {
  if (!isRecord(value)) {
    return null;
  }

  const type = value.type === "group" ? "group" : "personal";
  const baseValues = {
    currentStep: isEnrollmentStepId(value.currentStep)
      ? value.currentStep
      : DEFAULT_ENROLLMENT_FORM_VALUES.currentStep,
    courseId: readString(value.courseId, DEFAULT_ENROLLMENT_FORM_VALUES.courseId),
    applicant: normalizeApplicant(value.applicant),
    agreedToTerms: readBoolean(
      value.agreedToTerms,
      DEFAULT_ENROLLMENT_FORM_VALUES.agreedToTerms,
    ),
  };

  if (type === "group") {
    return {
      ...baseValues,
      type,
      group: normalizeGroup(value.group),
    };
  }

  return {
    ...baseValues,
    type,
  };
}

function parseEnrollmentDraft(value: unknown): EnrollmentDraft | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    value.kind !== ENROLLMENT_DRAFT_KIND ||
    value.version !== ENROLLMENT_DRAFT_VERSION
  ) {
    return null;
  }

  const values = normalizeDraftValues(value.values);

  if (!values) {
    return null;
  }

  const currentStepIndex = Math.max(
    0,
    ENROLLMENT_STEP_IDS.indexOf(values.currentStep),
  );
  const savedFurthestStepIndex = Math.min(
    readNumber(value.furthestStepIndex, currentStepIndex),
    ENROLLMENT_STEP_IDS.length - 1,
  );

  return {
    kind: ENROLLMENT_DRAFT_KIND,
    version: ENROLLMENT_DRAFT_VERSION,
    savedAt: readIsoDate(value.savedAt),
    values,
    furthestStepIndex: Math.max(currentStepIndex, savedFurthestStepIndex),
  };
}

export function readEnrollmentDraft() {
  if (!isBrowser()) {
    return null;
  }

  const storedValue = window.localStorage.getItem(ENROLLMENT_DRAFT_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);
    const draft = parseEnrollmentDraft(parsedValue);

    if (!draft) {
      window.localStorage.removeItem(ENROLLMENT_DRAFT_STORAGE_KEY);
    }

    return draft;
  } catch {
    window.localStorage.removeItem(ENROLLMENT_DRAFT_STORAGE_KEY);
    return null;
  }
}

export function saveEnrollmentDraft(
  values: EnrollmentFormInputValues,
  furthestStepIndex: number,
) {
  if (!isBrowser()) {
    return;
  }

  const draft: EnrollmentDraft = {
    kind: ENROLLMENT_DRAFT_KIND,
    version: ENROLLMENT_DRAFT_VERSION,
    savedAt: new Date().toISOString(),
    values,
    furthestStepIndex,
  };

  window.localStorage.setItem(
    ENROLLMENT_DRAFT_STORAGE_KEY,
    JSON.stringify(draft),
  );
}

export function clearEnrollmentDraft() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(ENROLLMENT_DRAFT_STORAGE_KEY);
}
