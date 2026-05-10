"use client";

// 현재 멀티스텝 위치를 보여주고, 미래 단계 클릭 시 루트 폼의 검증 로직을 거치게 합니다.
import { ENROLLMENT_STEPS } from "@/features/enrollment/constants";
import type { EnrollmentStepId } from "@/features/enrollment/constants";

interface StepIndicatorProps {
  currentStep: EnrollmentStepId;
  furthestStepIndex: number;
  onStepClick: (stepId: EnrollmentStepId) => void;
}

export function StepIndicator({
  currentStep,
  furthestStepIndex,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <ol className="grid gap-3 sm:grid-cols-3" aria-label="수강 신청 단계">
      {ENROLLMENT_STEPS.map((step, index) => {
        const isCurrent = step.id === currentStep;
        const isCompleted = !isCurrent && index < furthestStepIndex;

        return (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => onStepClick(step.id)}
              className={[
                "flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20",
                isCurrent
                  ? "border-slate-950 bg-slate-950 text-white"
                  : isCompleted
                    ? "border-slate-300 bg-white text-slate-800 hover:border-slate-500"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-400",
              ].join(" ")}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={isCurrent ? `${step.title}, 현재 단계` : step.title}
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
                {isCompleted ? "✓" : index + 1}
              </span>
              <span className="min-w-0">
                <span className="block font-medium">{step.title}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
