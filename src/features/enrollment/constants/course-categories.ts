// 강의 카테고리의 허용 값과 화면 표시용 라벨을 정의합니다.
export const COURSE_CATEGORIES = [
  "development",
  "design",
  "marketing",
  "business",
] as const;

export type CourseCategory = (typeof COURSE_CATEGORIES)[number];

export const COURSE_CATEGORY_LABELS: Record<CourseCategory, string> = {
  development: "개발",
  design: "디자인",
  marketing: "마케팅",
  business: "비즈니스",
};
