"use client";

// 확인 및 제출 단계에서 입력한 신청 내용을 요약하고 약관 동의를 검증합니다.
import { useFormContext } from "react-hook-form";
import {
  COURSE_CATEGORY_LABELS,
  type EnrollmentStepId,
} from "@/features/enrollment/constants";
import type { EnrollmentFormInputValues } from "@/features/enrollment/schemas";
import type { Course } from "@/features/enrollment/types";
import { useCoursesQuery } from "@/features/enrollment/hooks";
import {
  formatCurrency,
  formatDateRange,
} from "@/features/enrollment/utils";

interface ConfirmStepProps {
  isSubmitting: boolean;
  onGoToStep: (stepId: EnrollmentStepId) => void;
  onPrevious: () => void;
  onSubmit: () => void;
  submitErrorMessage: string;
}

function SummarySection({
  children,
  editStep,
  onGoToStep,
  title,
}: {
  children: React.ReactNode;
  editStep: EnrollmentStepId;
  onGoToStep: (stepId: EnrollmentStepId) => void;
  title: string;
}) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-semibold text-slate-950">{title}</h3>
        <button
          type="button"
          onClick={() => onGoToStep(editStep)}
          className="inline-flex h-8 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          수정
        </button>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function CourseSummary({ course }: { course?: Course }) {
  if (!course) {
    return <p className="text-sm text-slate-600">선택한 강의가 없습니다.</p>;
  }

  return (
    <dl className="grid gap-3 text-sm sm:grid-cols-2">
      <div>
        <dt className="text-slate-500">강의명</dt>
        <dd className="mt-1 font-medium text-slate-950">{course.title}</dd>
      </div>
      <div>
        <dt className="text-slate-500">카테고리</dt>
        <dd className="mt-1 font-medium text-slate-950">
          {COURSE_CATEGORY_LABELS[course.category]}
        </dd>
      </div>
      <div>
        <dt className="text-slate-500">강사</dt>
        <dd className="mt-1 font-medium text-slate-950">{course.instructor}</dd>
      </div>
      <div>
        <dt className="text-slate-500">수강료</dt>
        <dd className="mt-1 font-medium text-slate-950">
          {formatCurrency(course.price)}
        </dd>
      </div>
      <div className="sm:col-span-2">
        <dt className="text-slate-500">기간</dt>
        <dd className="mt-1 font-medium text-slate-950">
          {formatDateRange(course.startDate, course.endDate)}
        </dd>
      </div>
    </dl>
  );
}

export function ConfirmStep({
  isSubmitting,
  onGoToStep,
  onPrevious,
  onSubmit,
  submitErrorMessage,
}: ConfirmStepProps) {
  const {
    formState: { errors },
    register,
    watch,
  } = useFormContext<EnrollmentFormInputValues>();
  const values = watch();
  const coursesQuery = useCoursesQuery();
  const selectedCourse = coursesQuery.data?.courses.find(
    (course) => course.id === values.courseId,
  );
  const isGroupEnrollment = values.type === "group";

  return (
    <section className="flex flex-col gap-5">
      <div className="rounded-md border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">확인 및 제출</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          입력한 내용을 확인한 뒤 이용약관에 동의해주세요.
        </p>
      </div>

      <SummarySection
        title="선택한 강의"
        editStep="course"
        onGoToStep={onGoToStep}
      >
        <CourseSummary course={selectedCourse} />
      </SummarySection>

      <SummarySection
        title="신청 유형"
        editStep="course"
        onGoToStep={onGoToStep}
      >
        <p className="text-sm font-medium text-slate-950">
          {isGroupEnrollment ? "단체 신청" : "개인 신청"}
        </p>
      </SummarySection>

      <SummarySection
        title="신청자 정보"
        editStep="applicant"
        onGoToStep={onGoToStep}
      >
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">이름</dt>
            <dd className="mt-1 font-medium text-slate-950">
              {values.applicant.name}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">이메일</dt>
            <dd className="mt-1 font-medium text-slate-950">
              {values.applicant.email}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">전화번호</dt>
            <dd className="mt-1 font-medium text-slate-950">
              {values.applicant.phone}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-slate-500">수강 동기</dt>
            <dd className="mt-1 whitespace-pre-wrap text-slate-950">
              {values.applicant.motivation.trim() || "입력하지 않음"}
            </dd>
          </div>
        </dl>
      </SummarySection>

      {isGroupEnrollment && values.group && (
        <SummarySection
          title="단체 신청 정보"
          editStep="applicant"
          onGoToStep={onGoToStep}
        >
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">단체명</dt>
              <dd className="mt-1 font-medium text-slate-950">
                {values.group.organizationName}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">신청 인원수</dt>
              <dd className="mt-1 font-medium text-slate-950">
                {String(values.group.headCount)}명
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-slate-500">담당자 연락처</dt>
              <dd className="mt-1 font-medium text-slate-950">
                {values.group.contactPerson}
              </dd>
            </div>
          </dl>

          <div className="mt-5">
            <h4 className="text-sm font-medium text-slate-800">
              참가자 명단
            </h4>
            <div className="mt-3 grid gap-2">
              {values.group.participants.map((participant, index) => (
                <div
                  key={`${participant.email}-${index}`}
                  className="grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm sm:grid-cols-[80px_1fr_1fr]"
                >
                  <span className="font-medium text-slate-700">
                    참가자 {index + 1}
                  </span>
                  <span className="text-slate-950">{participant.name}</span>
                  <span className="text-slate-600">{participant.email}</span>
                </div>
              ))}
            </div>
          </div>
        </SummarySection>
      )}

      <section className="rounded-md border border-slate-200 bg-white p-5">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 size-4 rounded border-slate-300"
            aria-invalid={errors.agreedToTerms ? "true" : "false"}
            aria-describedby={
              errors.agreedToTerms ? "agreed-to-terms-error" : undefined
            }
            {...register("agreedToTerms")}
          />
          <span className="text-sm leading-6 text-slate-700">
            수강 신청 정보가 정확하며, 이용약관과 개인정보 처리방침에
            동의합니다.
          </span>
        </label>
        <p id="agreed-to-terms-error" className="mt-2 min-h-5 text-sm text-red-600">
          {errors.agreedToTerms?.message ?? ""}
        </p>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          이전
        </button>

        <div className="flex flex-col gap-3 sm:ml-auto sm:flex-row sm:items-center">
          {submitErrorMessage && (
            <p className="text-sm font-medium text-red-600">
              {submitErrorMessage}
            </p>
          )}
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-md bg-slate-950 px-5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "제출 중" : "수강 신청 제출"}
          </button>
        </div>
      </div>
    </section>
  );
}
