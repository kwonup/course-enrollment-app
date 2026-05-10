"use client";

// 강의 선택 단계에서 강의 조회, 카테고리 필터, 신청 유형 선택을 처리합니다.
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  COURSE_CATEGORIES,
  COURSE_CATEGORY_LABELS,
  type CourseCategory,
} from "@/features/enrollment/constants";
import type { EnrollmentFormInputValues } from "@/features/enrollment/schemas";
import type { Course, EnrollmentType } from "@/features/enrollment/types";
import { isApiError } from "@/features/enrollment/api";
import {
  useCoursesQuery,
  useEnrollmentTypeSwitch,
} from "@/features/enrollment/hooks";
import { CourseCard } from "@/features/enrollment/components/course-card";

const enrollmentTypeOptions: Array<{
  value: EnrollmentType;
  label: string;
  description: string;
}> = [
  {
    value: "personal",
    label: "개인 신청",
    description: "본인 1명의 수강 신청 정보를 입력합니다.",
  },
  {
    value: "group",
    label: "단체 신청",
    description: "2명 이상 단체 참가자 정보를 함께 입력합니다.",
  },
];

function getRemainingCapacity(course: Course) {
  return Math.max(course.maxCapacity - course.currentEnrollment, 0);
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(price);
}

export function CourseSelectStep() {
  const [selectedCategory, setSelectedCategory] = useState<
    CourseCategory | undefined
  >();
  const {
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useFormContext<EnrollmentFormInputValues>();
  const selectedCourseId = watch("courseId");
  const { selectedType, switchEnrollmentType } = useEnrollmentTypeSwitch();

  const coursesQuery = useCoursesQuery({ category: selectedCategory });
  const allCoursesQuery = useCoursesQuery();
  const selectedCourse = allCoursesQuery.data?.courses.find(
    (course) => course.id === selectedCourseId,
  );

  const handleSelectCourse = (course: Course) => {
    if (getRemainingCapacity(course) === 0) {
      return;
    }

    setValue("courseId", course.id, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    clearErrors("courseId");
  };

  const handleSelectType = (type: EnrollmentType) => {
    switchEnrollmentType(type);
  };

  const courseErrorMessage =
    typeof errors.courseId?.message === "string" ? errors.courseId.message : "";
  const typeErrorMessage =
    typeof errors.type?.message === "string" ? errors.type.message : "";
  const courses = coursesQuery.data?.courses ?? [];

  return (
    <section className="flex flex-col gap-6">
      <div className="rounded-md border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">강의 선택</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              수강할 강의를 선택하고 신청 유형을 정해주세요.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2" aria-label="강의 카테고리">
          <button
            type="button"
            onClick={() => setSelectedCategory(undefined)}
            className={[
              "h-9 rounded-md border px-3 text-sm font-medium transition",
              selectedCategory === undefined
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
            ].join(" ")}
          >
            전체
          </button>
          {COURSE_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={[
                "h-9 rounded-md border px-3 text-sm font-medium transition",
                selectedCategory === category
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
              ].join(" ")}
            >
              {COURSE_CATEGORY_LABELS[category]}
            </button>
          ))}
        </div>
      </div>

      {coursesQuery.isLoading && (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-md border border-slate-200 bg-white"
            />
          ))}
        </div>
      )}

      {coursesQuery.isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-5">
          <h3 className="text-sm font-semibold text-red-900">
            강의 목록을 불러오지 못했습니다.
          </h3>
          <p className="mt-2 text-sm text-red-700">
            {isApiError(coursesQuery.error)
              ? coursesQuery.error.message
              : "잠시 후 다시 시도해주세요."}
          </p>
          <button
            type="button"
            onClick={() => void coursesQuery.refetch()}
            className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-red-700 px-3 text-sm font-medium text-white hover:bg-red-800"
          >
            다시 불러오기
          </button>
        </div>
      )}

      {!coursesQuery.isLoading && !coursesQuery.isError && courses.length === 0 && (
        <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center">
          <h3 className="text-base font-semibold text-slate-950">
            표시할 강의가 없습니다.
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            다른 카테고리를 선택해 강의를 확인해주세요.
          </p>
        </div>
      )}

      {!coursesQuery.isLoading && !coursesQuery.isError && courses.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isSelected={course.id === selectedCourseId}
              onSelect={handleSelectCourse}
            />
          ))}
        </div>
      )}

      {courseErrorMessage && (
        <p className="text-sm font-medium text-red-600">{courseErrorMessage}</p>
      )}

      <div className="rounded-md border border-slate-200 bg-white p-5">
        <h3 className="text-base font-semibold text-slate-950">
          선택한 강의 정보
        </h3>
        {selectedCourse ? (
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">강의명</dt>
              <dd className="mt-1 font-medium text-slate-950">
                {selectedCourse.title}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">수강료</dt>
              <dd className="mt-1 font-medium text-slate-950">
                {formatPrice(selectedCourse.price)}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">강사</dt>
              <dd className="mt-1 font-medium text-slate-950">
                {selectedCourse.instructor}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">잔여 정원</dt>
              <dd className="mt-1 font-medium text-slate-950">
                {getRemainingCapacity(selectedCourse)}명
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-3 text-sm text-slate-600">
            아직 선택한 강의가 없습니다.
          </p>
        )}
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-5">
        <h3 className="text-base font-semibold text-slate-950">신청 유형</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {enrollmentTypeOptions.map((option) => {
            const isSelected = selectedType === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelectType(option.value)}
                className={[
                  "rounded-md border p-4 text-left transition",
                  isSelected
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
                ].join(" ")}
              >
                <span className="block text-sm font-semibold">
                  {option.label}
                </span>
                <span
                  className={[
                    "mt-1 block text-sm leading-6",
                    isSelected ? "text-slate-200" : "text-slate-500",
                  ].join(" ")}
                >
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
        {typeErrorMessage && (
          <p className="mt-3 text-sm font-medium text-red-600">
            {typeErrorMessage}
          </p>
        )}
      </div>
    </section>
  );
}
