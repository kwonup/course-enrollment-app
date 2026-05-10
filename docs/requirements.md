# Requirements

## 1. 프로젝트 개요

이 프로젝트는 온라인 교육 플랫폼의 수강 신청 흐름을 구현하는 프론트엔드 과제다.

사용자는 다음 흐름으로 수강 신청을 진행한다.

1. 강의 선택
2. 수강생 정보 입력
3. 최종 확인 및 제출

각 단계에서 입력한 정보는 이전 단계로 돌아가도 유지되어야 한다.

## 2. 구현 목표

이 프로젝트의 구현 목표는 단순한 입력 폼 제작이 아니라, 실제 서비스에서 사용할 수 있는 수준의 신청 흐름을 설계하는 것이다.

중점적으로 고려할 부분은 다음과 같다.

- 스텝 간 데이터 흐름
- 조건부 필드 처리
- 유효성 검증 시점
- 제출 실패 시 복구 가능성
- 서버 에러 처리
- 사용자가 현재 상태를 이해할 수 있는 UX

## 3. 기능 요구사항

## 3.1 1단계: 강의 선택

### 필수 기능

- 강의 목록을 조회한다.
- 카테고리별로 강의를 필터링할 수 있다.
- 사용자는 하나의 강의를 선택할 수 있다.
- 선택한 강의의 상세 정보를 표시한다.
- 신청 유형을 선택할 수 있다.

### 표시해야 할 강의 정보

- 강의 제목
- 설명
- 카테고리
- 가격
- 최대 정원
- 현재 신청 인원
- 시작일
- 종료일
- 강사명

### 신청 유형

- 개인 신청
- 단체 신청

## 3.2 2단계: 수강생 정보 입력

### 공통 필드

| 필드      | 필수 여부 | 검증 조건          |
| --------- | --------- | ------------------ |
| 이름      | 필수      | 2~20자             |
| 이메일    | 필수      | 이메일 형식        |
| 전화번호  | 필수      | 한국 전화번호 형식 |
| 수강 동기 | 선택      | 최대 300자         |

### 단체 신청 추가 필드

| 필드          | 필수 여부 | 검증 조건            |
| ------------- | --------- | -------------------- |
| 단체명        | 필수      | 빈 값 불가           |
| 신청 인원수   | 필수      | 2~10명               |
| 참가자 명단   | 필수      | 신청 인원수만큼 입력 |
| 담당자 연락처 | 필수      | 한국 전화번호 형식   |

### 참가자 명단

참가자 명단은 신청 인원수만큼 입력받는다.

각 참가자는 다음 값을 가진다.

- 이름
- 이메일

참가자 이메일 중복 여부도 검증 대상으로 고려한다.

## 3.3 3단계: 확인 및 제출

### 필수 기능

- 1단계와 2단계에서 입력한 전체 내용을 요약해서 보여준다.
- 각 섹션에는 수정 링크를 제공한다.
- 수정 링크 클릭 시 해당 스텝으로 이동한다.
- 이용약관 동의 체크박스를 제공한다.
- 이용약관 동의 후 제출할 수 있다.

### 제출 성공 시

신청 완료 화면을 보여준다.

표시할 정보:

- 신청 번호
- 신청 상태
- 신청 일시
- 선택한 강의 요약
- 신청자 정보 요약

### 제출 실패 시

입력 데이터는 유지되어야 한다.

사용자는 에러 메시지를 확인한 뒤 다시 제출할 수 있어야 한다.

## 4. API 요구사항

### 4.1 강의 목록 조회

```ts
GET /api/courses?category={category}
Course
interface Course {
  id: string;
  title: string;
  description: string;
  category: "development" | "design" | "marketing" | "business";
  price: number;
  maxCapacity: number;
  currentEnrollment: number;
  startDate: string;
  endDate: string;
  instructor: string;
}
CourseListResponse
interface CourseListResponse {
  courses: Course[];
  categories: string[];
}
```

### 4.2 수강 신청 제출

POST /api/enrollments

개인 신청 요청

```ts
interface PersonalEnrollmentRequest {
  courseId: string;
  type: "personal";
  applicant: {
    name: string;
    email: string;
    phone: string;
    motivation?: string;
  };
  agreedToTerms: boolean;
}
```

단체 신청 요청

```ts
interface GroupEnrollmentRequest {
  courseId: string;
  type: "group";
  applicant: {
    name: string;
    email: string;
    phone: string;
    motivation?: string;
  };
  group: {
    organizationName: string;
    headCount: number;
    participants: Array<{
      name: string;
      email: string;
    }>;
    contactPerson: string;
  };
  agreedToTerms: boolean;
}
```

신청 응답

```ts
interface EnrollmentResponse {
  enrollmentId: string;
  status: "confirmed" | "pending";
  enrolledAt: string;
}
```

### 4.3 에러 응답

```ts
interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, string>;
}
```

주요 에러 코드
| code | 의미 | 처리 방식 |
| -------------------- | --------- | ----------- |
| COURSE_FULL | 정원 초과 | 강의 재선택 안내 |
| DUPLICATE_ENROLLMENT | 이미 신청된 강의 | 중복 신청 불가 안내 |
| INVALID_INPUT | 입력값 오류 | 필드별 에러 표시 |

## 5. 상태 관리 전략

### 5.1 클라이언트 폼 상태

폼 상태는 React Hook Form으로 관리한다.

이유:

입력값 추적이 쉽다.
필드별 에러 관리가 편하다.
Zod와 연동하기 좋다.
멀티스텝 폼에서도 전체 데이터를 하나의 흐름으로 유지할 수 있다.

### 5.2 서버 상태

서버 상태는 TanStack Query로 관리한다.

사용 기준:

기능 사용 도구
강의 목록 조회 useQuery
수강 신청 제출 useMutation
5.3 Mock API

Mock API는 MSW로 구현한다.

MSW에서 재현할 상황:

강의 목록 조회 성공
강의 목록 빈 상태
신청 제출 성공
정원 초과
중복 신청
입력값 오류

네트워크 실패는 실제 fetch 실패와 비즈니스 에러 메시지를 구분하는 클라이언트 로직으로 대응하되, 별도 mock trigger는 현재 구현하지 않는다.

## 6. 유효성 검증 전략

유효성 검증은 Zod로 구현한다.

검증 시점은 다음과 같다.

필드 blur 시 개별 검증
다음 단계 이동 시 현재 스텝 검증
최종 제출 시 전체 검증
서버 응답 에러 발생 시 필드별 에러 반영

## 7. 조건부 필드 처리 방침

개인 신청과 단체 신청은 서로 다른 데이터 구조를 가진다.

따라서 신청 유형을 기준으로 타입을 분리한다.

```ts
type EnrollmentFormValues =
  | PersonalEnrollmentFormValues
  | GroupEnrollmentFormValues;
```

단체 신청에서 개인 신청으로 변경할 경우 단체 관련 데이터가 제출 payload에 포함되지 않도록 한다.

처리 방식:

단체 필드에 입력값이 없으면 바로 전환한다.
단체 필드에 입력값이 있으면 확인 대화상자를 띄운다.
사용자가 확인하면 단체 데이터를 초기화한다.
사용자가 취소하면 기존 신청 유형을 유지한다.

## 8. 정원 처리 UX

강의 정원 상태는 다음 기준으로 표시한다.
| 상태 | 기준 | UX |
| ----- | -------------------------------- | ------------------- |
| 신청 가능 | currentEnrollment < maxCapacity | 선택 가능 |
| 마감 임박 | 남은 인원 1~3명 | 마감 임박 배지 표시 |
| 마감 | currentEnrollment >= maxCapacity | 선택 비활성화 또는 제출 실패 처리 |

## 9. 선택 구현 범위

우선순위는 다음과 같다.

- 반응형 레이아웃
- 임시 저장
- 이탈 방지

## 9.1 반응형 레이아웃

모바일에서는 스텝별 세로 스크롤 중심의 레이아웃을 제공한다.

## 9.2 임시 저장

localStorage를 사용해 입력 중인 데이터를 저장한다.

새로고침 후 복구할 수 있도록 한다.

## 9.3 이탈 방지

입력 중인 데이터가 있을 경우 브라우저 닫기 또는 뒤로가기 시 확인 대화상자를 표시한다.

## 10. 미구현 가능 항목

시간이 부족할 경우 다음 항목은 README에 명시하고 제외할 수 있다.

복잡한 애니메이션
실제 결제 연동
실제 인증 / 인가
실제 백엔드 연동
일부 테스트 코드
