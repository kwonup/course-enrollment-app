"use client";

// 수강 신청 멀티스텝 폼의 루트 컴포넌트로, RHF 상태와 스텝 이동을 관리합니다.
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  FormProvider,
  type FieldErrors,
  type FieldPath,
  useForm,
} from "react-hook-form";
import {
  getEnrollmentErrorMessage,
  isApiError,
} from "@/features/enrollment/api";
import {
  DEFAULT_ENROLLMENT_FORM_VALUES,
  ENROLLMENT_STEPS,
  type EnrollmentStepId,
} from "@/features/enrollment/constants";
import { enrollmentFormSchema } from "@/features/enrollment/schemas";
import type {
  EnrollmentFormInputValues,
  EnrollmentFormSchemaValues,
} from "@/features/enrollment/schemas";
import type { EnrollmentType } from "@/features/enrollment/types";
import { ApplicantInfoStep } from "@/features/enrollment/components/applicant-info-step";
import { ConfirmStep } from "@/features/enrollment/components/confirm-step";
import { CourseSelectStep } from "@/features/enrollment/components/course-select-step";
import { EnrollmentSuccess } from "@/features/enrollment/components/enrollment-success";
import { StepIndicator } from "@/features/enrollment/components/step-indicator";
import {
  useEnrollmentDraft,
  useEnrollmentMutation,
} from "@/features/enrollment/hooks";
import {
  applyInvalidInputFieldErrors,
  formatDateTime,
  toEnrollmentRequest,
} from "@/features/enrollment/utils";

const applicantStepFields: FieldPath<EnrollmentFormInputValues>[] = [
  "applicant.name",
  "applicant.email",
  "applicant.phone",
  "applicant.motivation",
];

function getStepValidationFields(
  stepId: EnrollmentStepId,
  enrollmentType: EnrollmentType,
): FieldPath<EnrollmentFormInputValues>[] {
  if (stepId === "course") {
    return ["courseId", "type"];
  }

  if (stepId === "applicant") {
    return enrollmentType === "group"
      ? [...applicantStepFields, "group"]
      : applicantStepFields;
  }

  return ["agreedToTerms"];
}

function getStepIndex(stepId: EnrollmentStepId) {
  return ENROLLMENT_STEPS.findIndex((step) => step.id === stepId);
}

function getNextStepId(currentStep: EnrollmentStepId) {
  const nextStep = ENROLLMENT_STEPS[getStepIndex(currentStep) + 1];

  return nextStep?.id;
}

function getPreviousStepId(currentStep: EnrollmentStepId) {
  const previousStep = ENROLLMENT_STEPS[getStepIndex(currentStep) - 1];

  return previousStep?.id;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function collectErrorFieldPaths(value: unknown, prefix = ""): string[] {
  if (!isRecord(value) && !Array.isArray(value)) {
    return [];
  }

  if (isRecord(value) && typeof value.message === "string" && prefix) {
    return [prefix];
  }

  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : Object.entries(value).filter(
        ([key]) => !["message", "ref", "type", "types"].includes(key),
      );

  return entries.flatMap(([key, child]) =>
    collectErrorFieldPaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

function normalizeFocusableFieldPath(path: string) {
  if (path === "group.participants") {
    return "group.participants.0.name";
  }

  return path;
}

function getStepIdByFieldPath(path: string): EnrollmentStepId {
  if (path === "courseId" || path === "type") {
    return "course";
  }

  if (path === "agreedToTerms") {
    return "confirm";
  }

  return "applicant";
}

export function EnrollmentForm() {
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");
  const [submittedValues, setSubmittedValues] =
    useState<EnrollmentFormSchemaValues | null>(null);
  const [furthestStepIndex, setFurthestStepIndex] = useState(0);
  const enrollmentMutation = useEnrollmentMutation();
  const form = useForm<
    EnrollmentFormInputValues,
    unknown,
    EnrollmentFormSchemaValues
  >({
    resolver: zodResolver(enrollmentFormSchema),
    mode: "onBlur",
    defaultValues: DEFAULT_ENROLLMENT_FORM_VALUES,
  });

  const currentStep = form.watch("currentStep");
  const selectedType = form.watch("type");
  const {
    clearDraft,
    discardDraft,
    recoverableDraft,
    restoreDraft,
  } = useEnrollmentDraft({
    form,
    furthestStepIndex,
    setFurthestStepIndex,
  });

  const focusField = (fieldPath: FieldPath<EnrollmentFormInputValues>) => {
    window.setTimeout(() => {
      form.setFocus(fieldPath);
    }, 0);
  };

  const focusFirstError = (
    errors: FieldErrors<EnrollmentFormInputValues>,
  ) => {
    const firstPath = collectErrorFieldPaths(errors)[0];

    if (!firstPath) {
      return;
    }

    const focusablePath = normalizeFocusableFieldPath(firstPath);
    const fieldPath = focusablePath as FieldPath<EnrollmentFormInputValues>;

    setCurrentStep(getStepIdByFieldPath(focusablePath));
    focusField(fieldPath);
  };

  const setCurrentStep = (stepId: EnrollmentStepId) => {
    const nextStepIndex = getStepIndex(stepId);

    form.setValue("currentStep", stepId, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
    setFurthestStepIndex((currentIndex) =>
      Math.max(currentIndex, nextStepIndex),
    );
  };

  const goToStep = async (stepId: EnrollmentStepId) => {
    const currentStepIndex = getStepIndex(currentStep);
    const targetStepIndex = getStepIndex(stepId);

    if (targetStepIndex <= currentStepIndex) {
      setCurrentStep(stepId);
      return;
    }

    const isVisitedStep = targetStepIndex <= furthestStepIndex;

    if (!isVisitedStep && targetStepIndex > currentStepIndex + 1) {
      return;
    }

    const isCurrentStepValid = await form.trigger(
      getStepValidationFields(currentStep, selectedType),
      {
        shouldFocus: true,
      },
    );

    if (isCurrentStepValid) {
      setCurrentStep(stepId);
    }
  };

  const goToNextStep = async () => {
    const isCurrentStepValid = await form.trigger(
      getStepValidationFields(currentStep, selectedType),
      {
        shouldFocus: true,
      },
    );

    if (!isCurrentStepValid) {
      return;
    }

    const nextStepId = getNextStepId(currentStep);

    if (nextStepId) {
      setCurrentStep(nextStepId);
    }
  };

  const goToPreviousStep = () => {
    const previousStepId = getPreviousStepId(currentStep);

    if (previousStepId) {
      setCurrentStep(previousStepId);
    }
  };

  const handleConfirmSubmit = form.handleSubmit((values) => {
    setSubmitErrorMessage("");
    const payload = toEnrollmentRequest(values);

    enrollmentMutation.mutate(payload, {
      onSuccess: () => {
        clearDraft();
        setSubmittedValues(values);
      },
      onError: (error) => {
        const message = getEnrollmentErrorMessage(error);
        setSubmitErrorMessage(message);

        if (isApiError(error) && error.code === "COURSE_FULL") {
          form.setError("courseId", {
            type: "server",
            message,
          });
          setCurrentStep("course");
          focusField("courseId");
          return;
        }

        if (isApiError(error) && error.code === "DUPLICATE_ENROLLMENT") {
          form.setError("applicant.email", {
            type: "server",
            message,
          });
          setCurrentStep("applicant");
          focusField("applicant.email");
          return;
        }

        const hasFieldErrors = applyInvalidInputFieldErrors(
          error,
          form.setError,
        );

        if (hasFieldErrors && isApiError(error)) {
          const firstField = Object.keys(error.details ?? {})[0];

          if (firstField?.startsWith("course") || firstField === "type") {
            setCurrentStep("course");
          } else if (firstField?.startsWith("applicant") || firstField?.startsWith("group")) {
            setCurrentStep("applicant");
          }

          if (firstField) {
            focusField(
              normalizeFocusableFieldPath(
                firstField,
              ) as FieldPath<EnrollmentFormInputValues>,
            );
          }
        }
      },
    });
  }, focusFirstError);

  const isFirstStep = getStepIndex(currentStep) === 0;
  const isLastStep = getStepIndex(currentStep) === ENROLLMENT_STEPS.length - 1;

  if (enrollmentMutation.data && submittedValues) {
    return (
      <EnrollmentSuccess
        enrollment={enrollmentMutation.data}
        submittedValues={submittedValues}
      />
    );
  }

  return (
    <FormProvider {...form}>
      <form
        className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div>
          <p className="text-sm font-medium text-slate-500">FE-A</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">
            다단계 수강 신청 폼
          </h1>
        </div>

        <StepIndicator
          currentStep={currentStep}
          furthestStepIndex={furthestStepIndex}
          onStepClick={(stepId) => void goToStep(stepId)}
        />

        {recoverableDraft && (
          <section className="rounded-md border border-amber-200 bg-amber-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-amber-950">
                  임시 저장된 신청서가 있습니다.
                </h2>
                <p className="mt-1 text-sm leading-6 text-amber-800">
                  {formatDateTime(recoverableDraft.savedAt)}에 저장된 입력
                  내용을 복구할 수 있습니다.
                </p>
              </div>
              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={discardDraft}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-amber-300 bg-white px-4 text-sm font-medium text-amber-900 transition hover:bg-amber-100"
                >
                  새로 작성
                </button>
                <button
                  type="button"
                  onClick={restoreDraft}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-amber-900 px-4 text-sm font-medium text-white transition hover:bg-amber-950"
                >
                  복구하기
                </button>
              </div>
            </div>
          </section>
        )}

        {currentStep === "course" && <CourseSelectStep />}
        {currentStep === "applicant" && <ApplicantInfoStep />}
        {currentStep === "confirm" && (
          <ConfirmStep
            isSubmitting={enrollmentMutation.isPending}
            onGoToStep={setCurrentStep}
            onPrevious={goToPreviousStep}
            onSubmit={() => void handleConfirmSubmit()}
            submitErrorMessage={submitErrorMessage}
          />
        )}

        {!isLastStep && (
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={goToPreviousStep}
              disabled={isFirstStep}
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              이전
            </button>

            <button
              type="button"
              onClick={goToNextStep}
              className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              다음
            </button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
