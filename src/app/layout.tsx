// 앱 전체 HTML 구조와 전역 Provider, 글로벌 스타일을 연결하는 루트 레이아웃입니다.
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/app/providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Course Enrollment",
  description: "Multi-step course enrollment form",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
