"use client";

// 수강 신청 멀티스텝 폼의 루트 컴포넌트로, RHF 상태와 스텝 이동을 관리합니다.
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, type FieldPath, useForm } from "react-hook-form";
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
import { ApplicantInfoStep } from "@/features/enrollment/components/applicant-info-step";
import { ConfirmStep } from "@/features/enrollment/components/confirm-step";
import { CourseSelectStep } from "@/features/enrollment/components/course-select-step";
import { StepIndicator } from "@/features/enrollment/components/step-indicator";

const stepValidationFields: Record<
  EnrollmentStepId,
  FieldPath<EnrollmentFormInputValues>[]
> = {
  course: ["courseId", "type"],
  applicant: ["applicant"],
  confirm: ["agreedToTerms"],
};

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

  const goToStep = (stepId: EnrollmentStepId) => {
    form.setValue("currentStep", stepId, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  };

  const goToNextStep = async () => {
    const isCurrentStepValid = await form.trigger(
      stepValidationFields[currentStep],
      {
        shouldFocus: true,
      },
    );

    if (!isCurrentStepValid) {
      return;
    }

    const nextStepId = getNextStepId(currentStep);

    if (nextStepId) {
      goToStep(nextStepId);
    }
  };

  const goToPreviousStep = () => {
    const previousStepId = getPreviousStepId(currentStep);

    if (previousStepId) {
      goToStep(previousStepId);
    }
  };

  const isFirstStep = getStepIndex(currentStep) === 0;
  const isLastStep = getStepIndex(currentStep) === ENROLLMENT_STEPS.length - 1;

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

        <StepIndicator currentStep={currentStep} onStepClick={goToStep} />

        {currentStep === "course" && <CourseSelectStep />}
        {currentStep === "applicant" && <ApplicantInfoStep />}
        {currentStep === "confirm" && <ConfirmStep />}

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
            disabled={isLastStep}
            className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            다음
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
