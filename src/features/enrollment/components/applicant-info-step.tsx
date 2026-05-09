"use client";

// 신청자 정보 단계의 placeholder 컴포넌트입니다. 실제 입력 필드는 다음 단계에서 채웁니다.
export function ApplicantInfoStep() {
  return (
    <section className="rounded-md border border-dashed border-slate-300 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-950">신청 정보</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        이름, 이메일, 전화번호, 단체 신청 조건부 필드가 이 영역에 들어갑니다.
      </p>
    </section>
  );
}
