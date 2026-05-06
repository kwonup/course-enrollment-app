# AGENTS.md

## 1. Project Context

이 프로젝트는 프로덕트 엔지니어 프론트엔드 채용 과제인 `FE-A. 다단계 수강 신청 폼` 구현 프로젝트다.

목표는 온라인 교육 플랫폼에서 사용자가 강의를 선택하고, 신청 정보를 입력한 뒤, 최종 확인 후 수강 신청을 제출하는 3단계 폼을 구현하는 것이다.

핵심 평가 요소는 다음과 같다.

- 멀티스텝 폼 상태 관리
- 스텝 간 입력 데이터 유지
- 개인 신청 / 단체 신청 조건부 필드 처리
- 스텝별 유효성 검증
- 제출 성공 / 실패 UX
- Mock API 기반 서버 응답 처리
- 코드 구조와 설명 가능성

## 2. Tech Stack

반드시 아래 기술 스택을 기준으로 구현한다.

- Next.js App Router
- TypeScript
- React Hook Form
- Zod
- TanStack Query
- shadcn/ui
- MSW
- Tailwind CSS

## 3. Folder Structure

프로젝트 구조는 다음 기준을 따른다.

src/
├── app/
│ ├── layout.tsx
│ ├── page.tsx
│ └── providers.tsx
│
├── features/
│ └── enrollment/
│ ├── api/
│ ├── components/
│ ├── hooks/
│ ├── schemas/
│ ├── types/
│ ├── utils/
│ └── constants/
│
├── shared/
│ ├── components/
│ ├── lib/
│ └── types/
│
├── mocks/
│ ├── browser.ts
│ ├── handlers.ts
│ └── data/
│ └── courses.ts
│
└── styles/
└── globals.css

## 4. Implementation Rules

### 4.1 Form State

폼 상태는 React Hook Form을 기준으로 관리한다.
각 스텝별로 독립적인 useState를 남발하지 않는다.
전체 신청 데이터는 하나의 폼 흐름 안에서 유지한다.
이전 단계로 돌아가도 입력 데이터가 유지되어야 한다.

### 4.2 Validation

유효성 검증은 Zod schema로 분리한다.
다음 단계로 이동하기 전 현재 스텝의 필드만 검증한다.
최종 제출 시 전체 데이터를 다시 검증한다.
서버에서 내려온 필드별 에러는 React Hook Form의 field error로 반영한다.

### 4.3 Conditional Fields

신청 유형은 personal 또는 group으로 구분한다.
개인 신청과 단체 신청은 TypeScript discriminated union으로 타입을 분리한다.
단체 신청 선택 시에만 단체 관련 필드를 노출한다.
단체 신청에서 개인 신청으로 변경할 경우 단체 관련 데이터가 제출 payload에 남지 않도록 처리한다.
이미 입력된 단체 데이터가 있다면 초기화 전 확인 대화상자를 고려한다.

### 4.4 API

강의 목록 조회는 GET /api/courses?category={category} 기준으로 구현한다.
수강 신청 제출은 POST /api/enrollments 기준으로 구현한다.
API 함수는 features/enrollment/api에 둔다.
Mock API는 MSW로 구현한다.
서버 에러 코드는 사용자 친화적인 메시지로 변환한다.

처리해야 할 주요 에러 코드는 다음과 같다.

COURSE_FULL
DUPLICATE_ENROLLMENT
INVALID_INPUT

### 4.5 UI / UX

현재 진행 단계를 스텝 인디케이터로 표시한다.
강의 목록 로딩 상태를 표시한다.
강의 목록이 비어 있을 때 빈 상태 UI를 표시한다.
제출 중에는 버튼을 비활성화해 중복 제출을 방지한다.
제출 실패 시 입력 데이터는 유지되어야 한다.
유효성 검증 실패 시 필드별 에러 메시지를 보여준다.
가능하면 첫 번째 에러 필드로 포커스를 이동한다.
모바일 화면에서도 자연스럽게 사용할 수 있도록 반응형 레이아웃을 적용한다.

## 5. Code Style

TypeScript에서 any 사용을 피한다.
컴포넌트는 역할 기준으로 분리한다.
검증 로직은 UI 컴포넌트 내부에 직접 작성하지 않는다.
API 타입과 폼 타입을 명확히 구분한다.
반복되는 UI는 공통 컴포넌트로 분리한다.
파일명은 역할이 드러나도록 작성한다.

## 6. Documentation Rules

구현 중 중요한 결정은 docs/change-log.md에 기록한다.

특히 다음 내용은 반드시 기록한다.

폼 상태 관리 방식 선택 이유
유효성 검증 전략
개인 / 단체 신청 전환 시 데이터 처리 방식
Mock API 구성 방식
미구현 사항 또는 제약사항
AI를 활용한 부분과 직접 검증한 부분

## 7. Commit Rules

사용자가 직접 커밋한다.
Codex는 의미 있는 작업 단위가 끝났을 때 사용자에게 커밋하기 적절한 타이밍과 커밋 메시지를 알려준다.

커밋 메시지 예시:

- feat: 강의 선택 스텝 구현
- feat: 유효성 검증 추가
- fix: 단체 신청 전환 시 데이터 초기화
