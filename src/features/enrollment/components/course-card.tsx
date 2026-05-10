"use client";

// 강의 목록에서 하나의 강의를 표시하고 선택 상태, 정원 마감, 마감 임박 상태를 보여줍니다.
import { COURSE_CATEGORY_LABELS } from "@/features/enrollment/constants";
import type { Course } from "@/features/enrollment/types";
import { formatCurrency, formatDateRange } from "@/features/enrollment/utils";

interface CourseCardProps {
  course: Course;
  isSelected: boolean;
  onSelect: (course: Course) => void;
}

function getRemainingCapacity(course: Course) {
  return Math.max(course.maxCapacity - course.currentEnrollment, 0);
}

export function CourseCard({ course, isSelected, onSelect }: CourseCardProps) {
  const remainingCapacity = getRemainingCapacity(course);
  const isFull = remainingCapacity === 0;
  const isAlmostFull = !isFull && remainingCapacity <= 3;

  return (
    <article
      className={[
        "flex h-full flex-col rounded-md border bg-white p-5 transition",
        isSelected
          ? "border-slate-950 ring-2 ring-slate-950/10"
          : "border-slate-200",
        isFull ? "opacity-70" : "hover:border-slate-400",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {COURSE_CATEGORY_LABELS[course.category]}
        </span>
        {isFull && (
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
            정원 마감
          </span>
        )}
        {isAlmostFull && (
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
            마감 임박
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-950">
            {course.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
            {course.description}
          </p>
        </div>

        <dl className="grid gap-2 text-sm text-slate-600">
          <div className="flex justify-between gap-4">
            <dt>강사</dt>
            <dd className="font-medium text-slate-800">{course.instructor}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>기간</dt>
            <dd className="text-right font-medium text-slate-800">
              {formatDateRange(course.startDate, course.endDate)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>수강료</dt>
            <dd className="font-medium text-slate-800">
              {formatCurrency(course.price)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>신청 현황</dt>
            <dd className="font-medium text-slate-800">
              {course.currentEnrollment}/{course.maxCapacity}명
            </dd>
          </div>
        </dl>
      </div>

      <button
        type="button"
        onClick={() => onSelect(course)}
        disabled={isFull}
        className={[
          "mt-5 inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition",
          isSelected
            ? "bg-slate-950 text-white"
            : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
          isFull ? "cursor-not-allowed bg-slate-100 text-slate-400" : "",
        ].join(" ")}
      >
        {isFull ? "선택 불가" : isSelected ? "선택됨" : "선택"}
      </button>
    </article>
  );
}
