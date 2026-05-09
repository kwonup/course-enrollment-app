// 수강 신청 멀티스텝 폼을 렌더링하는 홈 페이지입니다.
import { EnrollmentForm } from "@/features/enrollment/components";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <EnrollmentForm />
    </main>
  );
}
