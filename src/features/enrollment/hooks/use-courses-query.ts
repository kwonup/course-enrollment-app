// 강의 목록 조회를 TanStack Query로 감싼 query hook입니다.
import { useQuery } from "@tanstack/react-query";
import { fetchCourses } from "@/features/enrollment/api";
import type { ApiRequestError } from "@/features/enrollment/api";
import type { CourseCategory } from "@/features/enrollment/constants";
import type { CourseListResponse } from "@/features/enrollment/types";

export const coursesQueryKeys = {
  all: ["courses"] as const,
  list: (category?: CourseCategory) =>
    [...coursesQueryKeys.all, { category: category ?? null }] as const,
};

interface UseCoursesQueryParams {
  category?: CourseCategory;
}

export function useCoursesQuery(params: UseCoursesQueryParams = {}) {
  return useQuery<CourseListResponse, ApiRequestError>({
    queryKey: coursesQueryKeys.list(params.category),
    queryFn: () => fetchCourses({ category: params.category }),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
}
