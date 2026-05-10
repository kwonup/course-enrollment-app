"use client";

// 수강 신청 멀티스텝 폼의 루트 컴포넌트로, RHF 상태와 스텝 이동을 관리합니다.
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, type FieldPath, useForm } from "react-hook-form";
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
import { useEnrollmentMutation } from "@/features/enrollment/hooks";
import {
  applyInvalidInputFieldErrors,
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

export function EnrollmentForm() {
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");
  const [submittedValues, setSubmittedValues] =
    useState<EnrollmentFormSchemaValues | null>(null);
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

  const setCurrentStep = (stepId: EnrollmentStepId) => {
    form.setValue("currentStep", stepId, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  };

  const goToStep = async (stepId: EnrollmentStepId) => {
    const currentStepIndex = getStepIndex(currentStep);
    const targetStepIndex = getStepIndex(stepId);

    if (targetStepIndex <= currentStepIndex) {
      setCurrentStep(stepId);
      return;
    }

    if (targetStepIndex > currentStepIndex + 1) {
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
          return;
        }

        if (isApiError(error) && error.code === "DUPLICATE_ENROLLMENT") {
          form.setError("applicant.email", {
            type: "server",
            message,
          });
          setCurrentStep("applicant");
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
        }
      },
    });
  });

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
          onStepClick={(stepId) => void goToStep(stepId)}
        />

        {currentStep === "course" && <CourseSelectStep />}
        {currentStep === "applicant" && <ApplicantInfoStep />}
        {currentStep === "confirm" && (
          <ConfirmStep
            isSubmitting={enrollmentMutation.isPending}
            onGoToStep={setCurrentStep}
            onSubmit={() => void handleConfirmSubmit()}
            submitErrorMessage={submitErrorMessage}
          />
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={goToPreviousStep}
            disabled={isFirstStep}
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            이전
          </button>

          {!isLastStep && (
            <button
              type="button"
              onClick={goToNextStep}
              className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              다음
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
