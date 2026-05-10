"use client";

// 현재 멀티스텝 위치를 보여주고, 미래 단계 클릭 시 루트 폼의 검증 로직을 거치게 합니다.
import { ENROLLMENT_STEPS } from "@/features/enrollment/constants";
import type { EnrollmentStepId } from "@/features/enrollment/constants";

interface StepIndicatorProps {
  currentStep: EnrollmentStepId;
  onStepClick: (stepId: EnrollmentStepId) => void;
}

export function StepIndicator({
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  const currentIndex = ENROLLMENT_STEPS.findIndex(
    (step) => step.id === currentStep,
  );

  return (
    <ol className="grid gap-3 sm:grid-cols-3" aria-label="수강 신청 단계">
      {ENROLLMENT_STEPS.map((step, index) => {
        const isCurrent = step.id === currentStep;
        const isCompleted = index < currentIndex;

        return (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => onStepClick(step.id)}
              className={[
                "flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left text-sm transition",
                isCurrent
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400",
              ].join(" ")}
              aria-current={isCurrent ? "step" : undefined}
            >
              <span
                className={[
                  "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                  isCurrent
                    ? "border-white text-white"
                    : isCompleted
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-300 text-slate-500",
                ].join(" ")}
              >
                {index + 1}
              </span>
              <span className="font-medium">{step.title}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
