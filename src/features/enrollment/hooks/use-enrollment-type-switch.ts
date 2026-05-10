"use client";

// 개인/단체 신청 전환 시 단체 기본값 설정과 초기화 확인 UX를 처리합니다.
import { useFormContext } from "react-hook-form";
import type { EnrollmentFormInputValues } from "@/features/enrollment/schemas";
import type { EnrollmentType } from "@/features/enrollment/types";
import {
  createDefaultGroupValues,
  hasEnteredGroupData,
} from "@/features/enrollment/utils/group-form";

export function useEnrollmentTypeSwitch() {
  const { clearErrors, getValues, setValue, unregister, watch } =
    useFormContext<EnrollmentFormInputValues>();
  const selectedType = watch("type");

  const switchEnrollmentType = (nextType: EnrollmentType) => {
    if (selectedType === nextType) {
      return;
    }

    if (nextType === "group") {
      setValue("type", "group", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("group", createDefaultGroupValues(), {
        shouldDirty: true,
        shouldTouch: false,
        shouldValidate: false,
      });
      clearErrors(["type", "group"]);
      return;
    }

    const groupValues = getValues("group");
    const shouldResetGroup =
      selectedType !== "group" ||
      !hasEnteredGroupData(groupValues) ||
      window.confirm(
        "개인 신청으로 변경하면 입력한 단체 정보가 초기화됩니다. 변경할까요?",
      );

    if (!shouldResetGroup) {
      return;
    }

    unregister("group");
    setValue("type", "personal", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    clearErrors(["type", "group"]);
  };

  return {
    selectedType,
    switchEnrollmentType,
  };
}
