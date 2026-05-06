import type { Metadata } from "next";
import type { ReactNode } from "react";
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
      <body>{children}</body>
    </html>
  );
}
