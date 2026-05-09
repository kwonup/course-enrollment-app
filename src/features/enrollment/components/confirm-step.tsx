"use client";

// 확인 및 제출 단계의 placeholder 컴포넌트입니다. 실제 요약/제출 UI는 다음 단계에서 채웁니다.
export function ConfirmStep() {
  return (
    <section className="rounded-md border border-dashed border-slate-300 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-950">확인 및 제출</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        신청 내용 요약, 수정 링크, 약관 동의, 제출 버튼이 이 영역에 들어갑니다.
      </p>
    </section>
  );
}
