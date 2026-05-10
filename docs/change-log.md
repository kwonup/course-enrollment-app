# Change Log

이 문서는 프로젝트 구현 과정에서 발생한 주요 변경 사항, 설계 결정, 수정 이유를 기록한다.

단순 작업 기록이 아니라, 면접에서 설명할 수 있는 판단 근거를 남기는 용도로 사용한다.

## 작성 규칙

각 변경 사항은 아래 형식으로 기록한다.

```md
## YYYY-MM-DD

### 변경 사항

- 변경한 내용

### 변경 이유

- 왜 변경했는지

### 영향 범위

- 어떤 파일이나 기능에 영향을 주는지

### 검증 내용

- 어떻게 확인했는지

### 남은 과제

- 아직 처리하지 못한 내용
```

## 2026-05-06

### 변경 사항

- Next.js App Router, TypeScript, Tailwind CSS 기반 최소 프로젝트 구조를 추가했다.
- `src/app`, `src/features/enrollment`, `src/shared`, `src/mocks`, `src/styles` 기준의 기본 디렉토리를 생성했다.
- 기능 구현 전 단계로, 홈 화면에는 초기 실행 확인용 안내 화면만 배치했다.
- 앱 전역 Provider 구조를 `src/app/providers.tsx`로 분리하고 TanStack Query `QueryClientProvider`를 연결했다.
- MSW 핸들러와 브라우저 worker를 나중에 확장할 수 있도록 `src/mocks/browser.ts`, `src/mocks/handlers.ts`, `src/mocks/data/courses.ts`를 추가했다.

### 변경 이유

- 과제 요구 기술 스택 중 Next.js App Router, TypeScript, Tailwind CSS를 먼저 고정해 이후 폼, 검증, 서버 상태, Mock API를 단계적으로 연결하기 위함이다.
- 서버 상태 관리는 이후 강의 목록 조회와 신청 제출에서 TanStack Query를 사용할 예정이므로 앱 전역 Provider를 먼저 연결했다.
- Mock API는 아직 실제 endpoint를 구현하지 않고, 다음 단계에서 handler를 추가할 수 있는 파일 구조만 준비했다.

### 영향 범위

- `package.json`
- `next.config.ts`
- `postcss.config.mjs`
- `tsconfig.json`
- `src/app/*`
- `src/styles/globals.css`
- `src/features/enrollment/*`
- `src/shared/*`
- `src/mocks/*`

### 검증 내용

- 의존성 설치 후 `npm run build`로 Next.js production build를 확인했다.
- `npm run dev`로 로컬 개발 서버 실행 후 `http://127.0.0.1:3000` 응답을 확인할 예정이다.

### 남은 과제

- React Hook Form, Zod 연결
- 수강 신청 도메인 타입, 스키마, API, Mock API 구현

## 2026-05-07

### 변경 사항

- 수강 신청 도메인의 API 요청/응답 타입을 `src/features/enrollment/types/api.ts`에 정의했다.
- 폼 입력 타입을 `src/features/enrollment/types/form.ts`에 별도로 정의했다.
- 강의 카테고리와 수강 신청 스텝 상수를 `src/features/enrollment/constants`에 추가했다.
- `src/mocks/data/courses.ts`에 카테고리별 Mock 강의 데이터를 작성했다.
- 완료된 타입 설계와 Mock 데이터 작성 항목을 `docs/feature-checklist.md`에 반영했다.

### 변경 이유

- API payload와 React Hook Form에서 사용할 입력 상태는 생명주기와 표현 방식이 다르므로 타입을 분리했다.
- 개인 신청과 단체 신청은 `type` 필드를 기준으로 discriminated union을 구성해 이후 제출 payload 생성 시 불필요한 단체 정보가 남지 않도록 설계했다.
- 카테고리와 스텝은 UI, API, 검증 로직에서 반복 사용될 가능성이 높아 상수로 분리했다.
- Mock 강의 데이터는 이후 MSW handler와 강의 목록 조회 기능을 구현할 때 재사용할 수 있도록 `Course` 타입 기준으로 작성했다.

### 영향 범위

- `src/features/enrollment/types/*`
- `src/features/enrollment/constants/*`
- `src/mocks/data/courses.ts`
- `docs/feature-checklist.md`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.
- Playwright screenshot으로 MSW 준비 후 1단계 강의 선택 화면이 렌더링되는 것을 확인했다.

### 남은 과제

- Zod schema 작성
- API 함수와 MSW handler 구현
- React Hook Form 기반 멀티스텝 폼 구현

## 2026-05-08

### 변경 사항

- MSW browser worker가 Next.js 클라이언트 개발 환경에서 시작되도록 `src/mocks/start-msw.ts`를 추가하고 `src/app/providers.tsx`에 연결했다.
- `GET /api/courses` handler를 구현해 강의 목록 조회와 카테고리 필터링을 지원했다.
- `POST /api/enrollments` handler를 구현해 신청 성공, `COURSE_FULL`, `DUPLICATE_ENROLLMENT`, `INVALID_INPUT` 응답을 재현할 수 있게 했다.
- 브라우저 Service Worker 실행을 위해 `public/mockServiceWorker.js`를 생성했다.
- 완료된 Mock API 항목을 `docs/feature-checklist.md`에 반영했다.

### 변경 이유

- 실제 백엔드 없이도 강의 조회, 신청 제출, 서버 에러 UX를 이후 단계에서 검증할 수 있도록 Mock API를 먼저 구성했다.
- 에러 응답은 `ErrorResponse` 타입의 `code`, `message`, `details` 구조를 유지해 React Hook Form의 field error 매핑을 준비했다.
- MSW는 브라우저 Service Worker 기반이므로 Next.js의 클라이언트 Provider에서 개발 환경에만 시작하도록 분리했다.

### 영향 범위

- `src/mocks/browser.ts`
- `src/mocks/handlers.ts`
- `src/mocks/start-msw.ts`
- `src/app/providers.tsx`
- `public/mockServiceWorker.js`
- `package.json`
- `package-lock.json`
- `docs/feature-checklist.md`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.

### 남은 과제

- API 함수 작성
- TanStack Query hooks 작성
- Zod schema 작성
- React Hook Form 기반 UI 구현

## 2026-05-08

### 변경 사항

- 공통 `fetcher`를 추가해 JSON 요청/응답 처리와 실패 응답 파싱을 한 곳으로 모았다.
- `fetchCourses`, `submitEnrollment` API 함수를 `src/features/enrollment/api`에 추가했다.
- `ApiError`, `parseApiError`, `isApiError`, `isKnownEnrollmentErrorCode`를 추가해 `ErrorResponse` 기반 서버 에러를 안전하게 다룰 수 있게 했다.
- `useCoursesQuery`, `useEnrollmentMutation` hook을 `src/features/enrollment/hooks`에 추가했다.
- API 함수와 TanStack Query hook 완료 항목을 `docs/feature-checklist.md`에 반영했다.

### 변경 이유

- UI 컴포넌트가 직접 `fetch`를 호출하지 않도록 API 계층을 분리해 이후 화면 구현 시 서버 통신 책임을 명확히 하기 위함이다.
- `COURSE_FULL`, `DUPLICATE_ENROLLMENT`, `INVALID_INPUT`은 `ApiError.response.code`와 `isKnownEnrollmentErrorCode`로 구분할 수 있게 했다.
- TanStack Query hook은 서버 상태 조회/변경의 진입점으로 두어 로딩, 성공, 실패 상태를 이후 UI에서 일관되게 사용할 수 있게 했다.

### 영향 범위

- `src/features/enrollment/api/*`
- `src/features/enrollment/hooks/*`
- `src/features/enrollment/types/api.ts`
- `docs/feature-checklist.md`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.

### 남은 과제

- 서버 에러 메시지 변환 유틸 작성
- Zod schema 작성
- React Hook Form 기반 UI 구현

## 2026-05-09

### 변경 사항

- React Hook Form과 연결할 Zod schema를 `src/features/enrollment/schemas`에 단계별로 추가했다.
- 강의 선택, 신청자 정보, 단체 정보, 참가자 명단, 약관 동의, 전체 enrollment form schema를 분리했다.
- 전체 form schema는 `type` 필드를 기준으로 개인 신청과 단체 신청을 discriminated union으로 검증하도록 구성했다.
- 전화번호, 이메일 형식, 신청 인원수 2~10명, 참가자 이메일 중복, 수강 동기 300자 제한 검증을 추가했다.
- schema 기반 타입을 `z.infer`로 추론해 export했다.
- Zod 설치와 schema 작성 완료 항목을 `docs/feature-checklist.md`에 반영했다.

### 변경 이유

- 스텝별 이동 전 현재 단계 필드만 검증하고, 최종 제출 시 전체 데이터를 다시 검증할 수 있도록 schema를 역할별로 분리했다.
- 개인 신청과 단체 신청은 제출 payload 구조가 다르므로 discriminated union으로 검증해 단체 신청 필드가 필요한 경우와 필요하지 않은 경우를 명확히 나눴다.
- 폼 타입은 schema에서 `z.infer`로 추론할 수 있게 해 검증 규칙과 타입 정의가 어긋날 가능성을 줄였다.

### 영향 범위

- `src/features/enrollment/schemas/*`
- `src/features/enrollment/constants/steps.ts`
- `package.json`
- `package-lock.json`
- `docs/feature-checklist.md`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.

### 남은 과제

- `@hookform/resolvers` 설치와 React Hook Form 연결
- 스텝별 검증 실행 로직 구현
- 서버 에러를 React Hook Form field error로 반영하는 로직 구현

## 2026-05-09

### 변경 사항

- `EnrollmentForm` 루트 컴포넌트를 추가하고 React Hook Form `FormProvider`를 연결했다.
- 현재 스텝 값을 폼 상태의 `currentStep`으로 관리하고, 다음/이전/특정 스텝 이동 함수를 추가했다.
- 다음 단계 이동 시 현재 스텝에 해당하는 필드만 `trigger`로 검증할 수 있는 구조를 추가했다.
- `StepIndicator`, `CourseSelectStep`, `ApplicantInfoStep`, `ConfirmStep` placeholder 컴포넌트를 추가했다.
- 홈 페이지에서 `EnrollmentForm`을 렌더링하도록 변경했다.
- React Hook Form과 `@hookform/resolvers` 설치 및 멀티스텝 폼 뼈대 완료 항목을 `docs/feature-checklist.md`에 반영했다.

### 변경 이유

- 실제 입력 필드를 구현하기 전에 폼 상태의 단일 출처를 React Hook Form으로 고정해 이후 스텝 간 데이터 유지와 검증 흐름을 안정적으로 붙이기 위함이다.
- 스텝 컴포넌트를 placeholder로 먼저 분리해 이후 강의 선택, 신청자 정보, 확인/제출 UI를 독립적으로 확장할 수 있게 했다.
- 스텝 이동 함수와 검증 필드 매핑을 루트 컴포넌트에 두어 다음 단계에서 필드가 추가되어도 이동 흐름을 크게 바꾸지 않도록 했다.

### 영향 범위

- `src/features/enrollment/components/*`
- `src/features/enrollment/constants/form-defaults.ts`
- `src/features/enrollment/constants/index.ts`
- `src/app/page.tsx`
- `package.json`
- `package-lock.json`
- `docs/feature-checklist.md`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.

### 남은 과제

- 실제 강의 선택 UI 구현
- 신청자 입력 필드 구현
- 최종 확인 및 제출 UI 구현
- 서버 에러를 React Hook Form field error로 반영하는 로직 구현

## 2026-05-09

### 변경 사항

- 1단계 `CourseSelectStep`에 강의 목록 조회, 카테고리 필터, 강의 카드, 강의 선택 기능을 구현했다.
- 정원 마감 강의는 선택할 수 없도록 처리하고, 잔여 정원이 3명 이하인 강의에는 마감 임박 배지를 표시했다.
- 선택한 강의 요약과 개인/단체 신청 유형 선택 UI를 추가했다.
- 강의 목록 로딩, 빈 상태, 에러 상태 UI를 추가했다.
- MSW worker가 준비되기 전에 강의 목록 query가 먼저 실행되지 않도록 `Providers`에서 mock worker 준비 상태를 기다리게 했다.
- 1단계 강의 선택 관련 완료 항목을 `docs/feature-checklist.md`에 반영했다.

### 변경 이유

- 강의 선택값과 신청 유형은 React Hook Form 상태에 저장해 다음 단계로 이동하거나 이전 단계로 돌아와도 값이 유지되도록 했다.
- 정원 마감 강의는 선택 자체를 막아 이후 제출 시 `COURSE_FULL` 가능성을 줄이고, 사용자에게 선택 불가 사유를 즉시 보여주도록 했다.
- 강의 목록은 MSW 기반 API를 통해 조회하므로 로딩/에러/빈 상태를 함께 구현해 실제 서버 상태 UI를 검증할 수 있게 했다.

### 영향 범위

- `src/features/enrollment/components/course-select-step.tsx`
- `src/features/enrollment/components/course-card.tsx`
- `src/features/enrollment/components/index.ts`
- `src/app/providers.tsx`
- `docs/feature-checklist.md`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.
- Playwright screenshot으로 MSW 준비 후 1단계 강의 선택 화면이 렌더링되는 것을 확인했다.

### 남은 과제

- 2단계 신청자 정보 입력 UI 구현
- 단체 신청 조건부 필드 구현
- 최종 확인 및 제출 UI 구현

## 2026-05-10

### 변경 사항

- 2단계 `ApplicantInfoStep`에 이름, 이메일, 전화번호, 수강 동기 공통 입력 필드를 구현했다.
- 각 필드를 React Hook Form `register`로 연결하고 Zod schema 기반 에러 메시지를 필드 아래에 표시하도록 했다.
- `mode: "onBlur"` 설정을 활용해 blur 시 개별 필드 검증이 실행되도록 구성했다.
- 다음 단계 이동 시 검증 대상을 `applicant` 전체 객체에서 `applicant.name`, `applicant.email`, `applicant.phone`, `applicant.motivation` 개별 필드로 좁혔다.
- 2단계 공통 필드 완료 항목을 `docs/feature-checklist.md`에 반영했다.

### 변경 이유

- 단체 신청 추가 필드는 다음 단계에서 구현할 예정이므로 이번 단계에서는 개인/단체 신청 모두에 필요한 공통 신청자 정보만 구현했다.
- 입력값은 React Hook Form의 단일 폼 상태 안에 저장되므로 이전 단계로 돌아갔다가 다시 2단계로 와도 값이 유지된다.
- 필드별 에러와 `aria-invalid`, `aria-describedby`를 함께 연결해 사용자가 어떤 값을 수정해야 하는지 바로 알 수 있게 했다.

### 영향 범위

- `src/features/enrollment/components/applicant-info-step.tsx`
- `src/features/enrollment/components/enrollment-form.tsx`
- `docs/feature-checklist.md`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.

### 남은 과제

- 단체 신청 조건부 필드 구현
- 최종 확인 및 제출 UI 구현
- 서버 에러를 React Hook Form field error로 반영하는 로직 구현

## 2026-05-10

### 변경 사항

- 신청 유형이 `group`일 때만 표시되는 단체 신청 조건부 필드를 구현했다.
- 단체명, 신청 인원수, 담당자 연락처, 참가자 이름/이메일 필드를 추가했다.
- 신청 인원수 변경 시 참가자 배열 길이를 자동으로 동기화하는 유틸을 추가했다.
- 단체 신청으로 전환하면 기본 단체 데이터를 생성하고, 개인 신청으로 전환하면 `group` 필드를 `unregister`로 제거하도록 했다.
- 이미 입력된 단체 데이터가 있을 때 개인 신청으로 전환하면 확인 대화상자를 표시하도록 했다.
- 신청 유형 전환 로직을 `useEnrollmentTypeSwitch` hook으로 분리하고, 단체 폼 유틸을 `src/features/enrollment/utils/group-form.ts`로 분리했다.
- 단체 신청일 때 다음 단계 이동 검증 대상에 `group` 필드를 포함하도록 멀티스텝 이동 로직을 보강했다.
- 단체 신청 조건부 필드 완료 항목을 `docs/feature-checklist.md`에 반영했다.

### 변경 이유

- 단체 신청 데이터는 개인 신청 payload에 남으면 안 되므로 개인 전환 시 RHF 상태에서 `group` 자체를 제거하도록 했다.
- 사용자가 입력한 단체 데이터를 실수로 잃지 않도록 입력된 값이 있는 경우에만 전환 확인을 거치게 했다.
- 참가자 배열 길이 동기화와 전환 로직은 여러 컴포넌트에서 재사용될 수 있어 컴포넌트 내부에 몰아넣지 않고 hook/util로 분리했다.

### 영향 범위

- `src/features/enrollment/components/applicant-info-step.tsx`
- `src/features/enrollment/components/course-select-step.tsx`
- `src/features/enrollment/components/enrollment-form.tsx`
- `src/features/enrollment/hooks/use-enrollment-type-switch.ts`
- `src/features/enrollment/hooks/index.ts`
- `src/features/enrollment/utils/group-form.ts`
- `docs/feature-checklist.md`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.

### 남은 과제

- 최종 확인 및 제출 UI 구현
- 제출 payload 변환 함수 구현
- 서버 에러를 React Hook Form field error로 반영하는 로직 구현

## 2026-05-10

### 변경 사항

- `docs/feature-checklist.md`의 최종 점검 항목 중 실제 확인한 로컬 실행, 불필요 코드 제거, 의미 단위 커밋 확인을 체크했다.
- README에 강의 카테고리 필터를 클라이언트 필터링으로 처리한 설계 이유를 추가했다.
- README에 현재 직접 확인한 검증 현황과 제출 전 브라우저에서 마지막으로 확인할 항목을 구분해 추가했다.

### 변경 이유

- 체크리스트가 실제 검증 상태를 반영하도록 하고, 아직 수동 브라우저 확인이 필요한 항목을 과장 없이 남기기 위함이다.
- 카테고리 필터 변경의 배경을 README에 남겨 평가자가 MSW handler와 UI 동작 방식의 차이를 이해할 수 있게 했다.

### 영향 범위

- `README.md`
- `docs/feature-checklist.md`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.
- `curl -I http://127.0.0.1:3000`으로 로컬 서버 응답 `200 OK`를 확인했다.
- 정적 검색으로 불필요한 debug 코드와 사용하지 않는 UI 라이브러리 흔적이 없는지 확인했다.

### 남은 과제

- README에 적은 제출 전 브라우저 수동 확인 항목 점검

## 2026-05-10

### 변경 사항

- 1단계 강의 카테고리 필터를 서버 재조회 방식에서 클라이언트 필터링 방식으로 변경했다.
- `CourseSelectStep`에서 전체 강의 목록을 한 번만 조회하고, 선택한 카테고리에 따라 이미 받은 배열을 필터링하도록 했다.
- 선택한 강의 요약도 별도 전체 목록 query가 아니라 동일한 강의 목록 query 결과를 재사용하도록 정리했다.

### 변경 이유

- 마케팅/비즈니스 등 카테고리 버튼 클릭 시 새로운 `/api/courses?category=...` 요청이 발생하면, 장시간 방치 후 MSW service worker 상태에 따라 mock 요청이 실제 Next 서버로 빠질 수 있었다.
- 현재 강의 데이터는 정적 mock 데이터이므로 카테고리 전환마다 서버 요청을 보낼 필요가 없다.
- MSW handler의 category 필터 기능은 Mock API 명세 검증용으로 유지하되, UI는 최초 전체 조회 결과를 사용해 안정성을 높였다.

### 영향 범위

- `src/features/enrollment/components/course-select-step.tsx`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.

### 남은 과제

- 개발 서버에서 장시간 대기 후 마케팅/비즈니스 카테고리 전환 시 에러가 재발하지 않는지 수동 점검

## 2026-05-10

### 변경 사항

- 강의 목록 query의 `staleTime`을 `Infinity`로 설정해 한 번 불러온 mock 강의 데이터를 자동 stale 처리하지 않도록 했다.
- 강의 목록 query의 `refetchOnMount`, `refetchOnReconnect`, `refetchOnWindowFocus`를 비활성화했다.

### 변경 이유

- 강의 목록은 현재 MSW 기반 정적 mock 데이터이므로 사용자가 1단계에 오래 머무르는 동안 자동 재조회할 필요가 없다.
- 오래 방치한 뒤 브라우저 포커스/재연결로 자동 refetch가 발생할 때, 개발 환경의 service worker 상태에 따라 `/api/courses` 요청이 실제 Next 서버로 빠지면 mock endpoint가 없어 오류 화면이 표시될 수 있었다.
- 새로고침하면 MSW가 다시 초기화되어 정상 표시되던 증상과 맞는 문제이므로, 불필요한 자동 refetch를 막아 1단계 화면 안정성을 높였다.

### 영향 범위

- `src/features/enrollment/hooks/use-courses-query.ts`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.

### 남은 과제

- 개발 서버에서 장시간 대기 후 강의 목록이 자동 에러 상태로 전환되지 않는지 수동 점검

## 2026-05-10

### 변경 사항

- 평가자가 로컬에서 실행하고 구현 범위를 파악할 수 있도록 `README.md`를 새로 작성했다.
- README에 프로젝트 개요, 기술 스택, 실행 방법, 프로젝트 구조, 요구사항 해석, 설계 결정, Mock API 사용 방법을 정리했다.
- README에 실제 미구현/제약사항과 AI 활용 범위를 과장 없이 구분해 기록했다.
- `docs/requirements.md`의 담당자 연락처 검증 조건을 현재 구현과 맞게 한국 전화번호 형식으로 정리했다.
- `docs/requirements.md`의 네트워크 실패 mock 항목은 별도 trigger 미구현 상태임을 명시했다.
- 문서화 완료 항목을 `docs/feature-checklist.md`에 반영했다.

### 변경 이유

- 과제 평가자가 별도 설명 없이 설치, 실행, Mock API 동작 방식, 구현 범위와 제약사항을 확인할 수 있게 하기 위함이다.
- 요구사항 문서와 실제 구현이 어긋나 보이는 항목을 정리해 면접 설명 시 혼선을 줄이기 위함이다.
- AI가 작성 지원한 영역과 사용자가 직접 판단한 영역을 분리해 작업 과정을 투명하게 남겼다.

### 영향 범위

- `README.md`
- `docs/requirements.md`
- `docs/feature-checklist.md`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.

### 남은 과제

- 최종 수동 플로우 점검
- README 내용과 실제 실행 화면 간 불일치 여부 확인

## 2026-05-10

### 변경 사항

- React Hook Form의 `formState.isDirty`를 기준으로 입력 중인 폼이 있는지 감지하도록 했다.
- 브라우저 새로고침/닫기 시 기본 확인 대화상자가 표시되도록 `beforeunload` hook을 추가했다.
- 신청 완료 후 성공 화면으로 전환되면 이탈 방지 hook이 비활성화되도록 조건을 구성했다.
- 아무 입력도 하지 않은 초기 상태나 복구 안내만 표시된 상태에서는 불필요한 경고가 뜨지 않도록 했다.
- 브라우저 이탈 방지 완료 항목을 `docs/feature-checklist.md`에 반영했다.

### 변경 이유

- 작성 중인 신청 정보가 새로고침이나 탭 닫기로 사라지는 것을 한 번 더 방지하기 위함이다.
- 브라우저의 `beforeunload` 정책상 커스텀 문구를 보장할 수 없으므로, 기본 확인창을 띄우는 최소 구현으로 처리했다.
- 완료 화면에서는 더 이상 작성 중인 폼이 아니므로 경고를 띄우지 않는 것이 자연스럽다.

### 영향 범위

- `src/features/enrollment/components/enrollment-form.tsx`
- `src/features/enrollment/hooks/use-prevent-unsaved-changes.ts`
- `src/features/enrollment/hooks/index.ts`
- `docs/feature-checklist.md`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.

### 남은 과제

- 뒤로가기 시 확인 처리
- 실제 브라우저에서 새로고침/닫기 확인창 수동 점검

## 2026-05-10

### 변경 사항

- 수강 신청 폼 입력값을 `localStorage`에 draft 전용 key로 임시 저장하도록 구현했다.
- 폼 값 변경 감지는 React Hook Form의 `watch`를 사용하고, 600ms debounce를 적용해 입력마다 즉시 저장하지 않도록 했다.
- 새로고침 후 저장된 draft가 있으면 복구 여부를 묻는 안내 UI를 표시하도록 했다.
- `복구하기` 선택 시 저장된 폼 값과 도달했던 스텝 정보를 복원하고, `새로 작성` 선택 시 저장된 draft를 삭제하도록 했다.
- 신청 성공 시 서버 응답과 별개로 브라우저에 남아 있는 임시 저장 데이터를 삭제하도록 했다.
- 임시 저장 관련 완료 항목을 `docs/feature-checklist.md`에 반영했다.

### 변경 이유

- 새로고침이나 브라우저 종료 후에도 사용자가 입력하던 내용을 이어서 작성할 수 있게 하기 위함이다.
- 서버 제출 결과와 브라우저 임시 저장 데이터가 섞이지 않도록 `kind`, `version`, `savedAt`, `values`를 가진 draft 전용 저장 포맷을 사용했다.
- 복구 여부를 사용자가 직접 선택하기 전까지는 자동 저장을 시작하지 않아, 기존 draft가 기본 폼 값으로 덮어써지는 상황을 방지했다.

### 영향 범위

- `src/features/enrollment/components/enrollment-form.tsx`
- `src/features/enrollment/hooks/use-enrollment-draft.ts`
- `src/features/enrollment/hooks/index.ts`
- `src/features/enrollment/utils/enrollment-draft-storage.ts`
- `src/features/enrollment/utils/index.ts`
- `docs/feature-checklist.md`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.

### 남은 과제

- 실제 브라우저에서 새로고침 후 복구 선택, 새로 작성 선택, 제출 성공 후 storage 삭제 흐름 수동 점검

## 2026-05-10

### 변경 사항

- 스텝 인디케이터에서 `현재`, `완료`, `다음`, `잠김` 상태 텍스트를 제거했다.
- 스텝 인디케이터의 시각적 잠김 처리와 disabled 처리를 제거하고, 이동 가능 여부 판단은 기존 루트 폼 검증 로직에 맡기도록 정리했다.
- 확인 및 제출 단계의 `수정` 버튼을 테두리와 배경이 있는 버튼 형태로 변경했다.
- 확인 및 제출 단계의 `수강 신청 제출` 버튼이 데스크톱 레이아웃에서 우측 끝에 배치되도록 조정했다.
- 확인 및 제출 단계의 `이전` 버튼을 공통 하단 내비게이션에서 단계 내부 액션 영역으로 옮겨 제출 버튼과 같은 높이에 배치했다.
- 전역 CSS에 활성 버튼 hover 시 손가락 커서가 표시되도록 기본 cursor 규칙을 추가했다.

### 변경 이유

- 인디케이터의 상태 텍스트와 잠김 표현이 현재 흐름에서는 과하게 느껴져, 단계 제목과 숫자/체크 표시만 남겨 더 간결하게 보이도록 했다.
- 다음 단계 이동 제한은 UI disabled가 아니라 `EnrollmentForm`의 단계 이동 검증이 담당하므로, 표시 방식 변경과 검증 로직을 분리했다.
- 확인 화면의 수정 액션은 중요한 편집 동선이므로 링크처럼 보이기보다 명확한 버튼으로 인식되게 했다.
- 확인 단계에서는 이전/제출이 한 묶음의 하단 액션이므로, 공통 내비게이션과 분리하지 않고 같은 영역에서 좌우 정렬되도록 했다.

### 영향 범위

- `src/features/enrollment/components/step-indicator.tsx`
- `src/features/enrollment/components/confirm-step.tsx`
- `src/features/enrollment/components/enrollment-form.tsx`
- `src/styles/globals.css`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.

### 남은 과제

- 실제 브라우저에서 모바일/데스크톱 간격과 클릭 동선 최종 점검

## 2026-05-10

### 변경 사항

- 최종 제출 흐름을 완료해 `useEnrollmentMutation`, payload 변환, 성공 화면, 실패 에러 처리를 연결했다.
- 제출 실패 시 폼 데이터를 유지하고, 재시도 가능한 상태로 남도록 했다.
- 비즈니스 에러와 네트워크 에러 메시지를 구분하고, `INVALID_INPUT` details를 필드 에러로 반영했다.

### 변경 이유

- 수강 신청 플로우가 실제 Mock API 제출 성공/실패 응답까지 처리할 수 있어야 하므로 제출 흐름을 완성했다.

### 영향 범위

- `src/features/enrollment/components/enrollment-form.tsx`
- `src/features/enrollment/components/confirm-step.tsx`
- `src/features/enrollment/components/enrollment-success.tsx`
- `src/features/enrollment/api/*`
- `src/features/enrollment/hooks/*`
- `src/features/enrollment/utils/*`
- `docs/feature-checklist.md`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.

### 남은 과제

- 첫 번째 에러 필드 포커스 이동 보강
- README 작성

## 2026-05-10

### 변경 사항

- 스텝 인디케이터에 현재/완료/다음/잠김 상태 라벨을 추가하고, 아직 이동할 수 없는 미래 스텝은 비활성 상태로 표시했다.
- 최종 제출 검증 실패와 서버 필드 에러 발생 시 첫 번째 에러 필드가 있는 스텝으로 이동한 뒤 해당 필드에 포커스하도록 보강했다.
- 강의 카드, 확인 화면, 완료 화면의 날짜/가격 표시를 공통 포맷터로 통일했다.
- 강의 목록 로딩 skeleton을 실제 카드 구조와 비슷하게 정리하고, Mock API 준비 화면에 spinner를 추가했다.
- 빈 상태 안내 문구와 제출 에러/버튼 배치를 모바일에서 읽기 쉽게 조정했다.
- UX 개선 및 제출 상태 처리 완료 항목을 `docs/feature-checklist.md`에 반영했다.

### 변경 이유

- 사용자가 어느 단계에 있고 어떤 단계로 이동할 수 있는지 명확하게 보여주고, 검증 실패 시 수정해야 할 필드로 바로 이동할 수 있게 하기 위함이다.
- 날짜/가격 포맷을 컴포넌트마다 따로 구현하면 표시 방식이 달라질 수 있어 공통 유틸로 통일했다.
- 로딩/빈 상태/disabled 상태는 과한 장식보다 현재 상태와 다음 행동을 명확히 전달하도록 정리했다.

### 영향 범위

- `src/features/enrollment/components/enrollment-form.tsx`
- `src/features/enrollment/components/step-indicator.tsx`
- `src/features/enrollment/components/course-select-step.tsx`
- `src/features/enrollment/components/course-card.tsx`
- `src/features/enrollment/components/confirm-step.tsx`
- `src/features/enrollment/components/enrollment-success.tsx`
- `src/features/enrollment/utils/formatters.ts`
- `src/features/enrollment/utils/index.ts`
- `src/app/providers.tsx`
- `docs/feature-checklist.md`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.

### 남은 과제

- README 작성
- 최종 수동 플로우 점검

## 2026-05-10

### 변경 사항

- 스텝 인디케이터 이동 정책에 `furthestStepIndex`를 추가해 사용자가 도달했던 가장 먼 스텝을 기억하도록 했다.
- 확인 단계에서 수정 버튼으로 이전 단계에 돌아간 뒤, 현재 스텝 검증을 통과하면 이미 방문했던 확인 단계로 다시 이동할 수 있게 했다.
- 아직 방문하지 않은 미래 스텝으로 여러 단계를 건너뛰는 이동은 계속 차단하도록 유지했다.

### 변경 이유

- 기존 수정은 검증 우회를 막기 위해 여러 단계 건너뛰기를 차단했지만, 이미 확인 단계까지 도달한 사용자가 수정 후 다시 확인 화면으로 돌아가는 정상 흐름까지 막는 UX 문제가 있었다.
- 방문 이력을 기준으로 이동 가능 범위를 나누면 검증 우회는 막으면서도 수정 후 복귀 흐름을 자연스럽게 유지할 수 있다.

### 영향 범위

- `src/features/enrollment/components/enrollment-form.tsx`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.

### 남은 과제

- 첫 번째 에러 필드 포커스 이동 보강
- README 작성

## 2026-05-10

### 변경 사항

- 단체 신청의 `담당자 연락처` 필드를 담당자 전화번호 입력 전용으로 수정했다.
- `groupSchema.contactPerson`에 한국 전화번호 형식 검증을 추가했다.
- MSW `POST /api/enrollments` handler의 단체 신청 검증도 담당자 전화번호 형식을 확인하도록 맞췄다.

### 변경 이유

- 담당자 연락처가 이름 또는 연락처처럼 해석되지 않도록 입력 의도를 전화번호로 명확히 하고, 클라이언트/Mock API 검증 기준을 일치시키기 위함이다.

### 영향 범위

- `src/features/enrollment/components/applicant-info-step.tsx`
- `src/features/enrollment/schemas/group-schema.ts`
- `src/mocks/handlers.ts`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.

### 남은 과제

- 첫 번째 에러 필드 포커스 이동 보강
- README 작성

## 2026-05-10

### 변경 사항

- `useEnrollmentMutation`을 최종 제출 흐름에 연결했다.
- 최종 제출 시 `handleSubmit`으로 전체 Zod schema 검증을 실행하고, 검증된 form 값을 API payload로 변환하도록 했다.
- 개인 신청과 단체 신청 payload 변환 유틸을 `src/features/enrollment/utils/enrollment-payload.ts`에 추가했다.
- 제출 성공 화면을 구현해 신청 번호, 신청 상태, 신청 일시, 강의 요약, 신청자 요약, 단체 신청 요약을 표시하도록 했다.
- 제출 중에는 제출 버튼을 비활성화해 중복 제출을 방지했다.
- 실패 시 폼 데이터를 초기화하지 않고 에러 메시지를 표시해 재시도할 수 있게 했다.
- `COURSE_FULL`, `DUPLICATE_ENROLLMENT`, `INVALID_INPUT`, 네트워크 에러 메시지를 구분해 사용자 친화적인 한국어 메시지로 변환했다.
- `INVALID_INPUT`의 `details`를 가능한 경우 React Hook Form field error로 반영하는 유틸을 추가했다.
- 제출 관련 완료 항목을 `docs/feature-checklist.md`에 반영했다.

### 변경 이유

- UI 컴포넌트가 API payload 구조를 직접 알지 않도록 form 값에서 API 요청으로 변환하는 책임을 유틸로 분리했다.
- 서버 비즈니스 에러와 네트워크 에러를 구분해야 사용자가 강의 재선택, 정보 수정, 재시도 중 무엇을 해야 하는지 이해할 수 있다.
- `INVALID_INPUT`은 필드별 에러로 반영해야 사용자가 수정할 위치를 바로 찾을 수 있으므로 서버 `details`를 RHF `setError`에 연결했다.

### 영향 범위

- `src/features/enrollment/components/enrollment-form.tsx`
- `src/features/enrollment/components/confirm-step.tsx`
- `src/features/enrollment/components/enrollment-success.tsx`
- `src/features/enrollment/api/errors.ts`
- `src/features/enrollment/api/fetcher.ts`
- `src/features/enrollment/hooks/use-enrollment-mutation.ts`
- `src/features/enrollment/utils/enrollment-payload.ts`
- `src/features/enrollment/utils/server-errors.ts`
- `src/features/enrollment/utils/index.ts`
- `docs/feature-checklist.md`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.

### 남은 과제

- 첫 번째 에러 필드 포커스 이동 보강
- README 작성

## 2026-05-10

### 변경 사항

- 스텝 인디케이터 클릭 시 검증 없이 다음 단계로 이동하던 흐름을 수정했다.
- 이전/현재 스텝 이동은 허용하고, 바로 다음 스텝 이동은 현재 스텝 검증을 통과한 경우에만 허용하도록 변경했다.
- 한 번에 여러 미래 스텝으로 건너뛰는 클릭은 막았다.
- 확인 화면의 수정 버튼은 기존 입력 데이터 유지를 위해 검증 없이 해당 스텝으로 돌아갈 수 있도록 별도 이동 함수를 사용하게 했다.

### 변경 이유

- 스텝 인디케이터가 `다음` 버튼의 검증 흐름을 우회해 `courseId`, 신청자 정보, 약관 동의 검증 실패 상태에서도 다음 단계로 이동할 수 있던 문제를 막기 위함이다.

### 영향 범위

- `src/features/enrollment/components/enrollment-form.tsx`
- `src/features/enrollment/components/step-indicator.tsx`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.

### 남은 과제

- 실제 제출 mutation 연결
- 제출 payload 변환 함수 구현
- 제출 성공/실패 UX 구현

## 2026-05-10

### 변경 사항

- 3단계 `ConfirmStep`에 선택한 강의, 신청 유형, 신청자 정보, 수강 동기 요약을 추가했다.
- 단체 신청인 경우 단체 정보와 참가자 명단 요약을 표시하도록 구현했다.
- 각 요약 섹션에 수정 버튼을 추가하고, 클릭 시 해당 스텝으로 이동하도록 연결했다.
- 이용약관 동의 체크박스와 필드 에러 메시지를 추가했다.
- 제출 버튼 UI를 추가하고, 실제 mutation 없이 `handleSubmit`으로 전체 Zod schema 검증만 실행하도록 연결했다.
- 확인 단계에서는 하단 `다음` 버튼을 숨겨 제출 버튼과 동작이 겹치지 않도록 했다.
- 3단계 확인 및 제출 관련 완료 항목을 `docs/feature-checklist.md`에 반영했다.

### 변경 이유

- 최종 제출 전 사용자가 입력한 정보를 섹션 단위로 검토하고 필요한 스텝으로 바로 돌아가 수정할 수 있게 하기 위함이다.
- 수정 링크는 기존 RHF 폼 상태를 유지한 채 `currentStep`만 변경하므로 입력 데이터가 사라지지 않는다.
- 약관 동의는 전체 form schema의 일부로 검증해 최종 제출 전에 반드시 통과해야 하는 조건으로 유지했다.

### 영향 범위

- `src/features/enrollment/components/confirm-step.tsx`
- `src/features/enrollment/components/enrollment-form.tsx`
- `docs/feature-checklist.md`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.

### 남은 과제

- 실제 제출 mutation 연결
- 제출 payload 변환 함수 구현
- 제출 성공/실패 UX 구현
- 서버 에러를 React Hook Form field error로 반영하는 로직 구현

## 2026-05-10

### 변경 사항

- 단체 신청 참가자 이름/이메일 필드 하단의 에러 메시지 영역을 항상 렌더링하도록 수정했다.
- 참가자 명단 전체 에러 메시지 영역에도 기본 높이를 부여했다.

### 변경 이유

- 참가자 명단 입력 중 검증 메시지가 나타날 때 입력 카드 높이가 갑자기 변하지 않도록 레이아웃 공간을 미리 확보하기 위함이다.

### 영향 범위

- `src/features/enrollment/components/applicant-info-step.tsx`

### 검증 내용

- `npm run build`로 TypeScript 타입 검사와 Next.js production build를 확인했다.

### 남은 과제

- 최종 확인 및 제출 UI 구현
- 제출 payload 변환 함수 구현
- 서버 에러를 React Hook Form field error로 반영하는 로직 구현
