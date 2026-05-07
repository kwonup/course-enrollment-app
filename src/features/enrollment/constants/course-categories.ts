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
