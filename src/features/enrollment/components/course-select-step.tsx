"use client";

// 강의 선택 단계의 placeholder 컴포넌트입니다. 실제 강의 목록 UI는 다음 단계에서 채웁니다.
export function CourseSelectStep() {
  return (
    <section className="rounded-md border border-dashed border-slate-300 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-950">강의 선택</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        강의 목록, 카테고리 필터, 신청 유형 선택 UI가 이 영역에 들어갑니다.
      </p>
    </section>
  );
}
