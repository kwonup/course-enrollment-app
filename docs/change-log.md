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
