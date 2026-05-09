// 강의 목록 조회 API 함수를 제공합니다.
import type { CourseCategory } from "@/features/enrollment/constants";
import type { CourseListResponse } from "@/features/enrollment/types";
import { fetcher } from "@/features/enrollment/api/fetcher";

interface FetchCoursesParams {
  category?: CourseCategory;
}

export function fetchCourses(params: FetchCoursesParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.category) {
    searchParams.set("category", params.category);
  }

  const queryString = searchParams.toString();
  const path = queryString ? `/api/courses?${queryString}` : "/api/courses";

  return fetcher<CourseListResponse>(path);
}
