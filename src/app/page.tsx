// 아직 기능 UI를 붙이기 전, 프로젝트 실행 확인을 위한 기본 홈 화면입니다.
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
        <p className="text-sm font-medium text-slate-500">FE-A</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
          다단계 수강 신청 폼
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Next.js App Router, TypeScript, Tailwind CSS 기반 초기 구조가
          준비되었습니다.
        </p>
      </section>
    </main>
  );
}
