"use client";

// 수강 신청 성공 후 신청 번호, 상태, 일시와 신청 요약을 보여줍니다.
import { COURSE_CATEGORY_LABELS } from "@/features/enrollment/constants";
import type { EnrollmentFormSchemaValues } from "@/features/enrollment/schemas";
import type { Course, EnrollmentResponse } from "@/features/enrollment/types";
import { useCoursesQuery } from "@/features/enrollment/hooks";

interface EnrollmentSuccessProps {
  enrollment: EnrollmentResponse;
  submittedValues: EnrollmentFormSchemaValues;
}

function formatStatus(status: EnrollmentResponse["status"]) {
  return status === "confirmed" ? "신청 확정" : "신청 대기";
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function CourseSummary({ course }: { course?: Course }) {
  if (!course) {
    return <p className="text-sm text-slate-600">선택한 강의 정보 없음</p>;
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
        <dt className="text-slate-500">기간</dt>
        <dd className="mt-1 font-medium text-slate-950">
          {course.startDate} ~ {course.endDate}
        </dd>
      </div>
    </dl>
  );
}

export function EnrollmentSuccess({
  enrollment,
  submittedValues,
}: EnrollmentSuccessProps) {
  const coursesQuery = useCoursesQuery();
  const selectedCourse = coursesQuery.data?.courses.find(
    (course) => course.id === submittedValues.courseId,
  );

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-6 py-10">
      <section className="rounded-md border border-emerald-200 bg-emerald-50 p-6">
        <p className="text-sm font-medium text-emerald-700">신청 완료</p>
        <h1 className="mt-2 text-2xl font-semibold text-emerald-950">
          수강 신청이 접수되었습니다.
        </h1>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-950">신청 결과</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-slate-500">신청 번호</dt>
            <dd className="mt-1 font-medium text-slate-950">
              {enrollment.enrollmentId}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">신청 상태</dt>
            <dd className="mt-1 font-medium text-slate-950">
              {formatStatus(enrollment.status)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">신청 일시</dt>
            <dd className="mt-1 font-medium text-slate-950">
              {formatDateTime(enrollment.enrolledAt)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-950">강의 요약</h2>
        <div className="mt-4">
          <CourseSummary course={selectedCourse} />
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-950">신청자 요약</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">신청 유형</dt>
            <dd className="mt-1 font-medium text-slate-950">
              {submittedValues.type === "group" ? "단체 신청" : "개인 신청"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">이름</dt>
            <dd className="mt-1 font-medium text-slate-950">
              {submittedValues.applicant.name}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">이메일</dt>
            <dd className="mt-1 font-medium text-slate-950">
              {submittedValues.applicant.email}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">전화번호</dt>
            <dd className="mt-1 font-medium text-slate-950">
              {submittedValues.applicant.phone}
            </dd>
          </div>
        </dl>
      </section>

      {submittedValues.type === "group" && (
        <section className="rounded-md border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-slate-950">
            단체 신청 요약
          </h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">단체명</dt>
              <dd className="mt-1 font-medium text-slate-950">
                {submittedValues.group.organizationName}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">신청 인원수</dt>
              <dd className="mt-1 font-medium text-slate-950">
                {submittedValues.group.headCount}명
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-slate-500">담당자 연락처</dt>
              <dd className="mt-1 font-medium text-slate-950">
                {submittedValues.group.contactPerson}
              </dd>
            </div>
          </dl>

          <div className="mt-5">
            <h3 className="text-sm font-medium text-slate-800">
              참가자 명단
            </h3>
            <div className="mt-3 grid gap-2">
              {submittedValues.group.participants.map((participant, index) => (
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
        </section>
      )}
    </main>
  );
}
