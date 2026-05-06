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

### 변경 이유

- 과제 요구 기술 스택 중 Next.js App Router, TypeScript, Tailwind CSS를 먼저 고정해 이후 폼, 검증, 서버 상태, Mock API를 단계적으로 연결하기 위함이다.
- React Hook Form, Zod, TanStack Query, MSW, shadcn/ui는 다음 작업 단위에서 별도로 도입하기로 했으므로 이번 변경에는 포함하지 않았다.

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

- 의존성 설치 후 `npm run build`로 Next.js production build를 확인할 예정이다.
- `npm run dev`로 로컬 개발 서버 실행을 확인할 예정이다.

### 남은 과제

- React Hook Form, Zod, TanStack Query, MSW, shadcn/ui 연결
- 수강 신청 도메인 타입, 스키마, API, Mock API 구현
