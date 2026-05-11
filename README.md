# Course Enrollment App

온라인 교육 플랫폼의 `FE-A. 다단계 수강 신청 폼` 과제 구현 프로젝트입니다.

사용자는 강의를 선택하고, 개인 또는 단체 신청 정보를 입력한 뒤, 최종 확인 화면에서 수강 신청을 제출할 수 있습니다. 실제 백엔드는 없으며 개발 환경에서는 MSW(Mock Service Worker)로 강의 조회와 신청 제출 API를 재현합니다.

## 기술 스택

- Next.js App Router
- TypeScript
- React Hook Form
- Zod
- TanStack Query
- MSW
- Tailwind CSS

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 다음 주소로 접속합니다.

```txt
http://127.0.0.1:3000
```

정적 타입 검사와 production build 확인은 다음 명령으로 실행합니다.

```bash
npm run build
```

주의: 현재 API는 MSW 기반 mock으로만 구성되어 있습니다. `npm run dev`에서는 MSW가 자동으로 시작되지만, `npm run start`로 실행하는 production 서버에는 실제 API route가 없으므로 신청 플로우 검증은 개발 서버에서 진행해야 합니다.

## 주요 기능

- 3단계 수강 신청 폼
- 강의 목록 조회 및 카테고리 필터
- 강의 선택, 정원 마감 처리, 마감 임박 표시
- 개인 신청 / 단체 신청 분기
- 단체 신청 시 참가자 명단 자동 생성
- 단체 신청에서 개인 신청 전환 시 데이터 초기화 확인
- Zod 기반 스텝별 검증과 최종 제출 검증
- 서버 에러 코드별 사용자 메시지 처리
- `INVALID_INPUT` 서버 에러의 필드별 반영
- 신청 성공 화면
- localStorage 임시 저장 및 복구
- 입력 중 새로고침/닫기 방지

## 프로젝트 구조

```txt
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── features/
│   └── enrollment/
│       ├── api/
│       ├── components/
│       ├── constants/
│       ├── hooks/
│       ├── schemas/
│       ├── types/
│       └── utils/
├── mocks/
│   ├── browser.ts
│   ├── data/
│   ├── handlers.ts
│   └── start-msw.ts
├── shared/
└── styles/
```

- `src/app`: App Router 진입점, 전역 Provider, 홈 페이지
- `src/features/enrollment`: 수강 신청 도메인 기능
- `api`: fetcher, 강의 조회, 신청 제출 API 함수
- `components`: 멀티스텝 폼과 각 단계 UI
- `constants`: 카테고리, 스텝, 기본 폼 값
- `hooks`: TanStack Query, 신청 유형 전환, 임시 저장, 이탈 방지 hook
- `schemas`: Zod schema와 schema 기반 타입
- `types`: API 요청/응답 타입과 폼 보조 타입
- `utils`: payload 변환, 서버 에러 매핑, localStorage draft, 포맷터
- `src/mocks`: MSW worker와 API handler, mock 강의 데이터
- `docs`: 요구사항, 변경 기록, 체크리스트

## 요구사항 해석 및 가정

- 폼 상태는 React Hook Form 하나로 관리하고, 각 스텝 컴포넌트는 같은 form context를 공유합니다.
- 스텝 이동 시 현재 스텝의 필드만 검증하고, 최종 제출 시 전체 schema를 다시 검증합니다.
- 신청 유형은 `personal`과 `group` discriminated union으로 분리했습니다.
- 단체 신청의 담당자 연락처는 이름이 아니라 전화번호 단일 필드로 해석했습니다.
- 수강 동기는 선택 입력이지만 최대 300자 제한을 둡니다.
- 임시 저장 데이터는 서버 응답이 아니라 브라우저 draft로 취급합니다.
- 실제 백엔드가 없으므로 API 성공/실패는 MSW handler에서 재현합니다.

## 설계 결정

### React Hook Form 중심 폼 상태

멀티스텝 폼에서 입력값 보존, 필드별 에러, 서버 에러 반영이 모두 필요하므로 React Hook Form을 기준으로 전체 데이터를 관리했습니다. `currentStep`도 form 값에 포함해 새로고침 복구 시 현재 단계까지 함께 복원할 수 있게 했습니다.

### Zod schema 분리

강의 선택, 신청자 정보, 단체 정보, 약관 동의를 별도 schema로 나누고 전체 `enrollmentFormSchema`에서 조합했습니다. 개인/단체 신청은 `type` 필드를 기준으로 discriminated union 검증을 사용합니다.

### API 타입과 폼 타입 분리

폼 입력값은 UI 상태 보존을 위해 `currentStep`, 빈 문자열, 조건부 `group` 값을 포함할 수 있습니다. 반면 API 요청 payload는 서버에 필요한 값만 포함해야 하므로 `toEnrollmentRequest`에서 제출 직전에 변환합니다.

### 강의 카테고리 필터

MSW handler는 `GET /api/courses?category={category}`를 지원하지만, 실제 1단계 UI에서는 최초 전체 강의 목록을 한 번 조회한 뒤 클라이언트에서 카테고리를 필터링합니다. 강의 데이터가 정적 mock 데이터이고, 장시간 대기 후 카테고리 전환 시 service worker 상태에 따라 mock 요청이 실제 서버로 빠질 수 있었기 때문에 UI 안정성을 우선한 결정입니다.

### 단체 신청 전환 처리

단체 신청에서 개인 신청으로 바꿀 때 단체 데이터가 payload에 남지 않도록 `group` 값을 제거합니다. 이미 입력한 단체 데이터가 있으면 `window.confirm`으로 초기화 여부를 확인합니다.

### 임시 저장

localStorage key는 `course-enrollment:form-draft:v1`로 고정하고, 저장 값에는 `kind`, `version`, `savedAt`, `values`, `furthestStepIndex`를 포함했습니다. 복구 여부를 사용자가 선택하기 전에는 자동 저장을 시작하지 않아 기존 draft를 기본값으로 덮어쓰지 않도록 했습니다.

### 이탈 방지

`formState.isDirty`가 true이고 신청 완료 상태가 아닐 때만 `beforeunload`를 등록합니다. 브라우저 정책상 커스텀 문구는 보장되지 않으므로 기본 확인창만 사용합니다.

## Mock API

개발 서버에서 `NEXT_PUBLIC_API_MOCKING`이 `disabled`가 아니면 MSW가 자동 시작됩니다.

### 강의 목록 조회

```txt
GET /api/courses
GET /api/courses?category=development
GET /api/courses?category=design
GET /api/courses?category=marketing
GET /api/courses?category=business
```

응답은 `CourseListResponse` 형식입니다. 알 수 없는 category를 전달하면 빈 목록을 반환합니다.

### 수강 신청 제출

```txt
POST /api/enrollments
```

재현 가능한 응답:

- 신청 성공: 정원이 남아 있고 중복 이메일이 아닌 유효한 payload
- `COURSE_FULL`: 정원이 마감된 강의 선택
- `DUPLICATE_ENROLLMENT`: 신청자 이메일이 `already-enrolled@example.com`
- `INVALID_INPUT`: 필수값 누락, 잘못된 신청 유형, 약관 미동의, 단체 필드 오류 등

MSW를 끄고 실행하려면 다음처럼 실행합니다.

```bash
NEXT_PUBLIC_API_MOCKING=disabled npm run dev
```

이 경우 실제 API가 없으므로 강의 조회와 제출은 실패합니다.

## 검증 현황

- `npm run build` 성공
- `http://127.0.0.1:3000` 응답 `200 OK`
- TypeScript 소스 코드에서 불필요한 `any` 사용 없음
- `TODO`, `FIXME`, `console.log`, `debugger` 없음
- 사용하지 않기로 한 UI 라이브러리 관련 패키지, 설정 파일, 문서 문구 없음
- 최근 커밋이 기능/수정/문서 단위로 분리되어 있음

## 미구현 / 제약사항

- 실제 백엔드 API route는 구현하지 않았습니다. 과제 범위에서는 MSW 기반 mock API로 서버 응답을 재현합니다.
- 네트워크 실패를 강제로 발생시키는 별도 UI나 query parameter는 없습니다. 일반 fetch 실패와 비즈니스 에러 메시지 구분 로직은 구현되어 있습니다.
- 브라우저 뒤로가기 시 커스텀 확인 처리는 구현하지 않았습니다. 새로고침/닫기는 `beforeunload` 기본 확인창으로 처리합니다.
- 자동화된 테스트 스위트는 없습니다. 현재 검증은 `npm run build`와 수동 플로우 확인을 기준으로 합니다.
- 브라우저 확장 프로그램이 `<body>`에 속성을 주입하면 개발 중 hydration warning이 표시될 수 있습니다. 시크릿 모드 또는 확장 비활성화 상태에서 확인하면 코드 원인인지 구분할 수 있습니다.

## AI 활용 범위

본 프로젝트 에서는 OpenAI Codex를 보조 개발 도구로 활용했습니다.
요구사항을 작은 작업 단위로 나누고 각 단계의 구현 범위, 제약사항, 검증 기준을 명확히 문서화한 뒤 그 기준에 맞춰 개발을 진행하는 방식으로 활용했습니다.

1. 요구사항 분해 및 작업 단위 관리

- 수강 신청 폼을 초기 세팅, 타입 설계, Mock API, API 함수, Zod schema, 멀티스텝 폼, 강의 선택, 신청자 정보 입력, 단체 신청 조건부 필드, 확인 및 제출, 임시 저장, 이탈 방지, 문서화 단계로 나눴습니다.
- 각 단계마다 “이번 단계에서 구현할 것”과 “아직 구현하지 않을 것”을 명확히 지정해 Codex가 과도하게 기능을 확장하지 않도록 했습니다.

2. 문서 기반 하네스 엔지니어링

- `AGENTS.md`에 프로젝트 목표, 기술 스택, 폴더 구조, 구현 규칙, 문서화 규칙, 커밋 규칙을 작성해 Codex가 일관된 기준으로 작업하도록 했습니다.
- `docs/requirements.md`에는 과제 요구사항과 API 스펙, 검증 전략, 조건부 필드 처리 방식을 정리했습니다.
- `docs/feature-checklist.md`에는 구현 항목을 체크리스트로 관리해 완료 여부를 추적했습니다.
- `docs/change-log.md`에는 주요 설계 결정, 변경 이유, 영향 범위, 검증 내용을 기록했습니다.
- 이 문서들을 기준으로 Codex가 코드를 작성하고, 변경 후 문서도 함께 갱신하도록 운영했습니다.

3. 검증 및 리뷰 보조

- Codex를 통해 `npm run build`, 정적 검색, 체크리스트 점검을 반복적으로 수행했습니다.
- `any` 사용 여부, 불필요한 debug 코드, 미사용 라이브러리 언급, 문서와 실제 구현의 불일치 여부를 점검했습니다.
- 기능 구현 후에는 변경 파일, 검증 방법, 추천 커밋 메시지를 정리해 작업 단위를 구분했습니다.

4. 직접 판단 및 검토한 부분

- 각 단계별 구현 범위와 우선순위는 직접 지정했습니다.
- UI/UX 수정 방향, 미구현 항목 명시는 직접 판단했습니다.
- Codex가 제안한 구현 방식은 코드와 동작 흐름을 확인한 뒤 필요한 부분만 반영했습니다.

## 문서

- [요구사항](docs/requirements.md)
- [변경 기록](docs/change-log.md)
- [기능 체크리스트](docs/feature-checklist.md)
