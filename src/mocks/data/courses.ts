// 강의 목록 조회 Mock API에서 사용할 테스트용 강의 데이터입니다.
import type { Course } from "@/features/enrollment/types";

export const courses: Course[] = [
  {
    id: "course-development-nextjs",
    title: "Next.js 실전 App Router",
    description:
      "App Router 기반 라우팅, 서버 컴포넌트, 데이터 패칭 흐름을 실무 과제 형태로 학습합니다.",
    category: "development",
    price: 180000,
    maxCapacity: 30,
    currentEnrollment: 18,
    startDate: "2026-06-01",
    endDate: "2026-06-28",
    instructor: "김하준",
  },
  {
    id: "course-development-typescript",
    title: "TypeScript 타입 설계 입문",
    description:
      "프론트엔드 애플리케이션에서 재사용 가능한 타입 모델과 안전한 API 계약을 설계합니다.",
    category: "development",
    price: 150000,
    maxCapacity: 25,
    currentEnrollment: 25,
    startDate: "2026-06-10",
    endDate: "2026-07-08",
    instructor: "박서연",
  },
  {
    id: "course-design-product-ui",
    title: "프로덕트 UI 디자인 시스템",
    description:
      "컴포넌트 구조, 토큰, 상태 표현을 중심으로 제품 UI의 일관성을 설계합니다.",
    category: "design",
    price: 160000,
    maxCapacity: 20,
    currentEnrollment: 9,
    startDate: "2026-06-03",
    endDate: "2026-06-24",
    instructor: "이도윤",
  },
  {
    id: "course-design-research",
    title: "사용자 리서치와 문제 정의",
    description:
      "정성 리서치 결과를 제품 요구사항과 화면 설계 기준으로 연결하는 방법을 다룹니다.",
    category: "design",
    price: 140000,
    maxCapacity: 18,
    currentEnrollment: 3,
    startDate: "2026-07-01",
    endDate: "2026-07-22",
    instructor: "정민아",
  },
  {
    id: "course-marketing-growth",
    title: "그로스 마케팅 핵심 지표",
    description:
      "퍼널, 리텐션, 전환율을 기준으로 캠페인 성과를 해석하고 개선안을 도출합니다.",
    category: "marketing",
    price: 130000,
    maxCapacity: 35,
    currentEnrollment: 21,
    startDate: "2026-06-15",
    endDate: "2026-07-13",
    instructor: "최유진",
  },
  {
    id: "course-marketing-content",
    title: "콘텐츠 마케팅 전략",
    description:
      "브랜드 메시지, 채널별 콘텐츠 운영, 성과 분석을 하나의 실행 계획으로 구성합니다.",
    category: "marketing",
    price: 120000,
    maxCapacity: 28,
    currentEnrollment: 0,
    startDate: "2026-07-06",
    endDate: "2026-07-27",
    instructor: "한지우",
  },
  {
    id: "course-business-product-strategy",
    title: "프로덕트 전략과 우선순위",
    description:
      "시장, 고객, 비즈니스 목표를 바탕으로 제품 로드맵과 기능 우선순위를 설계합니다.",
    category: "business",
    price: 170000,
    maxCapacity: 24,
    currentEnrollment: 14,
    startDate: "2026-06-08",
    endDate: "2026-07-06",
    instructor: "윤태호",
  },
  {
    id: "course-business-data-decision",
    title: "데이터 기반 의사결정",
    description:
      "운영 데이터와 실험 결과를 읽고 제품 개선 판단으로 연결하는 실무 사고법을 학습합니다.",
    category: "business",
    price: 155000,
    maxCapacity: 22,
    currentEnrollment: 20,
    startDate: "2026-07-09",
    endDate: "2026-08-06",
    instructor: "서지민",
  },
];
