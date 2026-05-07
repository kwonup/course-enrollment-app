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
