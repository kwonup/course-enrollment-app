// 단체 신청 폼의 기본값 생성, 입력 여부 확인, 참가자 배열 길이 동기화를 담당합니다.
import type { GroupSchemaValues } from "@/features/enrollment/schemas";

export const DEFAULT_GROUP_HEAD_COUNT = 2;

export function createEmptyParticipant() {
  return {
    name: "",
    email: "",
  };
}

export function createDefaultGroupValues(
  headCount = DEFAULT_GROUP_HEAD_COUNT,
): GroupSchemaValues {
  return {
    organizationName: "",
    headCount,
    participants: Array.from({ length: headCount }, createEmptyParticipant),
    contactPerson: "",
  };
}

export function hasEnteredGroupData(group: unknown) {
  if (typeof group !== "object" || group === null || Array.isArray(group)) {
    return false;
  }

  const value = group as Partial<GroupSchemaValues>;

  return Boolean(
    value.organizationName?.trim() ||
      value.contactPerson?.trim() ||
      value.participants?.some(
        (participant) => participant.name.trim() || participant.email.trim(),
      ),
  );
}

export function normalizeParticipantCount(
  participants: GroupSchemaValues["participants"] | undefined,
  headCount: number,
) {
  const safeHeadCount = Number.isFinite(headCount)
    ? Math.min(Math.max(Math.trunc(headCount), 0), 10)
    : DEFAULT_GROUP_HEAD_COUNT;
  const currentParticipants = participants ?? [];

  if (currentParticipants.length === safeHeadCount) {
    return currentParticipants;
  }

  if (currentParticipants.length > safeHeadCount) {
    return currentParticipants.slice(0, safeHeadCount);
  }

  return [
    ...currentParticipants,
    ...Array.from(
      { length: safeHeadCount - currentParticipants.length },
      createEmptyParticipant,
    ),
  ];
}
