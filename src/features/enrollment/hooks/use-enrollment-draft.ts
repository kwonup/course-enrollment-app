"use client";

// RHF 폼 값을 debounce로 임시 저장하고, 새로고침 후 복구 여부를 제어합니다.
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { UseFormReturn } from "react-hook-form";
import type {
  EnrollmentFormInputValues,
  EnrollmentFormSchemaValues,
} from "@/features/enrollment/schemas";
import {
  clearEnrollmentDraft,
  readEnrollmentDraft,
  saveEnrollmentDraft,
  type EnrollmentDraft,
} from "@/features/enrollment/utils/enrollment-draft-storage";

const DRAFT_SAVE_DEBOUNCE_MS = 600;

interface UseEnrollmentDraftParams {
  form: UseFormReturn<
    EnrollmentFormInputValues,
    unknown,
    EnrollmentFormSchemaValues
  >;
  furthestStepIndex: number;
  setFurthestStepIndex: Dispatch<SetStateAction<number>>;
}

export function useEnrollmentDraft({
  form,
  furthestStepIndex,
  setFurthestStepIndex,
}: UseEnrollmentDraftParams) {
  const [recoverableDraft, setRecoverableDraft] =
    useState<EnrollmentDraft | null>(null);
  const [canSaveDraft, setCanSaveDraft] = useState(false);
  const debounceTimerIdRef = useRef<number | null>(null);
  const furthestStepIndexRef = useRef(furthestStepIndex);

  const clearPendingSave = useCallback(() => {
    if (debounceTimerIdRef.current === null) {
      return;
    }

    window.clearTimeout(debounceTimerIdRef.current);
    debounceTimerIdRef.current = null;
  }, []);

  useEffect(() => {
    furthestStepIndexRef.current = furthestStepIndex;
  }, [furthestStepIndex]);

  useEffect(() => {
    const draft = readEnrollmentDraft();

    if (draft) {
      setRecoverableDraft(draft);
      return;
    }

    setCanSaveDraft(true);
  }, []);

  useEffect(() => {
    if (!canSaveDraft) {
      return;
    }

    const subscription = form.watch(() => {
      clearPendingSave();
      debounceTimerIdRef.current = window.setTimeout(() => {
        saveEnrollmentDraft(form.getValues(), furthestStepIndexRef.current);
      }, DRAFT_SAVE_DEBOUNCE_MS);
    });

    return () => {
      subscription.unsubscribe();
      clearPendingSave();
    };
  }, [canSaveDraft, clearPendingSave, form]);

  const restoreDraft = useCallback(() => {
    if (!recoverableDraft) {
      return;
    }

    clearPendingSave();
    form.reset(recoverableDraft.values);
    setFurthestStepIndex(recoverableDraft.furthestStepIndex);
    setRecoverableDraft(null);
    setCanSaveDraft(true);
  }, [clearPendingSave, form, recoverableDraft, setFurthestStepIndex]);

  const discardDraft = useCallback(() => {
    clearPendingSave();
    clearEnrollmentDraft();
    setRecoverableDraft(null);
    setCanSaveDraft(true);
  }, [clearPendingSave]);

  const clearDraft = useCallback(() => {
    clearPendingSave();
    clearEnrollmentDraft();
    setRecoverableDraft(null);
  }, [clearPendingSave]);

  return {
    recoverableDraft,
    restoreDraft,
    discardDraft,
    clearDraft,
  };
}
