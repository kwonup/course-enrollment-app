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

## 미구현 / 제약사항

- 실제 백엔드 API route는 구현하지 않았습니다. 과제 범위에서는 MSW 기반 mock API로 서버 응답을 재현합니다.
- 네트워크 실패를 강제로 발생시키는 별도 UI나 query parameter는 없습니다. 일반 fetch 실패와 비즈니스 에러 메시지 구분 로직은 구현되어 있습니다.
- 브라우저 뒤로가기 시 커스텀 확인 처리는 구현하지 않았습니다. 새로고침/닫기는 `beforeunload` 기본 확인창으로 처리합니다.
- 자동화된 테스트 스위트는 없습니다. 현재 검증은 `npm run build`와 수동 플로우 확인을 기준으로 합니다.
- 브라우저 확장 프로그램이 `<body>`에 속성을 주입하면 개발 중 hydration warning이 표시될 수 있습니다. 시크릿 모드 또는 확장 비활성화 상태에서 확인하면 코드 원인인지 구분할 수 있습니다.

## AI 활용 범위

Codex가 도운 부분:

- 프로젝트 구조 설계와 파일 생성
- 타입, Zod schema, API 함수, MSW handler 작성
- 멀티스텝 폼, 단체 신청 조건부 필드, 제출 흐름 구현
- localStorage 임시 저장과 이탈 방지 hook 구현
- README, change-log, feature-checklist 문서 정리

사용자가 직접 검토하고 결정한 부분:

- 단계별 작업 범위 지정
- UI/UX 수정 방향 결정
- 담당자 연락처 의미 정정
- 스텝 인디케이터와 버튼 배치 조정 요청
- 콘솔 hydration warning 원인 확인 요청

직접 검증한 부분:

- `npm run build`로 TypeScript와 Next.js production build 확인
- 단계별 기능 변경 후 주요 동작 흐름을 코드 기준으로 점검

## 문서

- [요구사항](docs/requirements.md)
- [변경 기록](docs/change-log.md)
- [기능 체크리스트](docs/feature-checklist.md)
