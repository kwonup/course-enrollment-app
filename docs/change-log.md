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

- React Hook Form, Zod, shadcn/ui 연결
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
