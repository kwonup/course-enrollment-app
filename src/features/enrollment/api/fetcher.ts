// fetch 호출 공통 옵션, JSON 직렬화, 실패 응답 파싱을 담당하는 공통 fetcher입니다.
import { parseApiError } from "@/features/enrollment/api/errors";

interface FetcherOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export async function fetcher<TResponse>(
  path: string,
  options: FetcherOptions = {},
) {
  const { body, headers, ...restOptions } = options;
  const hasBody = body !== undefined;

  const response = await fetch(path, {
    ...restOptions,
    headers: {
      Accept: "application/json",
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: hasBody ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}
