# Feature Checklist

## 0. 초기 세팅

- [x] Next.js App Router 프로젝트 생성
- [x] TypeScript 설정
- [x] Tailwind CSS 설정
- [ ] shadcn/ui 설정
- [ ] React Hook Form 설치
- [x] Zod 설치
- [ ] `@hookform/resolvers` 설치
- [x] TanStack Query 설치
- [x] MSW 설치
- [x] 기본 폴더 구조 생성

## 1. 프로젝트 구조

- [x] `src/app/layout.tsx` 생성
- [x] `src/app/page.tsx` 생성
- [x] `src/app/providers.tsx` 생성
- [x] `src/features/enrollment/api` 생성
- [x] `src/features/enrollment/components` 생성
- [x] `src/features/enrollment/hooks` 생성
- [x] `src/features/enrollment/schemas` 생성
- [x] `src/features/enrollment/types` 생성
- [x] `src/features/enrollment/utils` 생성
- [x] `src/features/enrollment/constants` 생성
- [x] `src/shared/components` 생성
- [x] `src/shared/lib` 생성
- [x] `src/shared/types` 생성
- [x] `src/mocks` 생성

## 2. 타입 설계

- [x] `Course` 타입 정의
- [x] `CourseListResponse` 타입 정의
- [x] `PersonalEnrollmentRequest` 타입 정의
- [x] `GroupEnrollmentRequest` 타입 정의
- [x] `EnrollmentResponse` 타입 정의
- [x] `ErrorResponse` 타입 정의
- [x] 개인 / 단체 신청 discriminated union 타입 정의
- [x] 폼 입력 타입과 API 요청 타입 분리

## 3. Mock API

- [x] MSW browser worker 설정
- [x] 강의 mock data 작성
- [x] `GET /api/courses` 핸들러 구현
- [x] 카테고리 필터링 처리
- [x] `POST /api/enrollments` 핸들러 구현
- [x] 신청 성공 응답 구현
- [x] `COURSE_FULL` 에러 케이스 구현
- [x] `DUPLICATE_ENROLLMENT` 에러 케이스 구현
- [x] `INVALID_INPUT` 에러 케이스 구현
- [ ] 네트워크 실패 케이스 구현

## 4. API 함수

- [x] 강의 목록 조회 함수 작성
- [x] 수강 신청 제출 함수 작성
- [x] 공통 fetcher 작성
- [x] API 에러 파싱 유틸 작성
- [ ] 서버 에러 메시지 변환 유틸 작성

## 5. TanStack Query

- [x] QueryClient 설정
- [x] Provider 연결
- [x] `useCoursesQuery` 작성
- [x] `useEnrollmentMutation` 작성
- [ ] 강의 목록 로딩 상태 처리
- [ ] 강의 목록 에러 상태 처리
- [ ] 신청 제출 pending 상태 처리
- [ ] 신청 제출 success 상태 처리
- [ ] 신청 제출 error 상태 처리

## 6. Zod Schema

- [x] 강의 선택 스텝 schema 작성
- [x] 수강생 정보 schema 작성
- [x] 개인 신청 schema 작성
- [x] 단체 신청 schema 작성
- [x] 약관 동의 schema 작성
- [x] 참가자 명단 schema 작성
- [x] 전화번호 검증 정규식 작성
- [x] 참가자 이메일 중복 검증 작성
- [x] 수강 동기 300자 제한 검증 작성

## 7. 멀티스텝 폼

- [ ] 현재 스텝 상태 관리
- [ ] 다음 단계 이동 함수 작성
- [ ] 이전 단계 이동 함수 작성
- [ ] 특정 스텝으로 이동하는 함수 작성
- [ ] 다음 단계 이동 전 현재 스텝 검증
- [ ] 이전 단계 이동 시 입력 데이터 유지
- [ ] 최종 제출 시 전체 데이터 검증

## 8. 1단계: 강의 선택

- [ ] 강의 목록 UI 구현
- [ ] 카테고리 필터 UI 구현
- [ ] 강의 카드 컴포넌트 구현
- [ ] 강의 선택 기능 구현
- [ ] 선택한 강의 정보 표시
- [ ] 신청 유형 선택 UI 구현
- [ ] 개인 신청 선택 기능 구현
- [ ] 단체 신청 선택 기능 구현
- [ ] 정원 마감 강의 처리
- [ ] 마감 임박 배지 표시
- [ ] 강의 목록 빈 상태 UI 구현
- [ ] 강의 목록 로딩 UI 구현

## 9. 2단계: 수강생 정보 입력

- [ ] 이름 필드 구현
- [ ] 이메일 필드 구현
- [ ] 전화번호 필드 구현
- [ ] 수강 동기 필드 구현
- [ ] 필드별 에러 메시지 표시
- [ ] blur 시 개별 검증
- [ ] 다음 단계 이동 시 현재 스텝 검증

## 10. 단체 신청 조건부 필드

- [ ] 단체명 필드 구현
- [ ] 신청 인원수 필드 구현
- [ ] 참가자 명단 필드 구현
- [ ] 신청 인원수 변경 시 참가자 필드 개수 동기화
- [ ] 참가자 이름 입력 구현
- [ ] 참가자 이메일 입력 구현
- [ ] 담당자 연락처 필드 구현
- [ ] 참가자 이메일 중복 검증
- [ ] 단체 신청에서 개인 신청 전환 시 데이터 초기화 처리
- [ ] 데이터 초기화 전 확인 대화상자 구현

## 11. 3단계: 확인 및 제출

- [ ] 선택한 강의 요약 표시
- [ ] 신청 유형 표시
- [ ] 신청자 정보 요약 표시
- [ ] 단체 신청 정보 요약 표시
- [ ] 수강 동기 표시
- [ ] 각 섹션별 수정 링크 구현
- [ ] 수정 링크 클릭 시 해당 스텝으로 이동
- [ ] 이용약관 동의 체크박스 구현
- [ ] 약관 미동의 시 제출 방지
- [ ] 제출 버튼 구현
- [ ] 제출 중 버튼 비활성화
- [ ] 중복 제출 방지

## 12. 제출 결과 처리

- [ ] 신청 성공 화면 구현
- [ ] 신청 번호 표시
- [ ] 신청 상태 표시
- [ ] 신청 일시 표시
- [ ] 신청 요약 정보 표시
- [ ] 제출 실패 에러 메시지 표시
- [ ] 제출 실패 후 입력 데이터 유지
- [ ] 재시도 기능 구현
- [ ] `COURSE_FULL` 사용자 메시지 처리
- [ ] `DUPLICATE_ENROLLMENT` 사용자 메시지 처리
- [ ] `INVALID_INPUT` 필드별 에러 반영

## 13. UX 개선

- [ ] 스텝 인디케이터 구현
- [ ] 현재 스텝 강조 표시
- [ ] 완료된 스텝 표시
- [ ] 에러 발생 시 필드 시각적 강조
- [ ] 에러 발생 시 첫 번째 에러 필드로 포커스 이동
- [ ] 모바일 반응형 레이아웃 구현
- [ ] 접근성 고려한 label 연결
- [ ] 버튼 disabled 상태 명확히 표시
- [ ] 빈 상태 안내 문구 작성
- [ ] 로딩 skeleton 또는 spinner 구현

## 14. 선택 구현

- [ ] localStorage 임시 저장
- [ ] 새로고침 후 입력 데이터 복구
- [ ] 복구 여부 확인 UI
- [ ] 브라우저 이탈 방지
- [ ] 뒤로가기 시 확인 처리

## 15. 문서화

- [ ] README.md 작성
- [ ] 프로젝트 개요 작성
- [ ] 기술 스택 작성
- [ ] 실행 방법 작성
- [ ] 프로젝트 구조 설명 작성
- [ ] 요구사항 해석 및 가정 작성
- [ ] 설계 결정과 이유 작성
- [ ] 미구현 / 제약사항 작성
- [ ] AI 활용 범위 작성
- [ ] Mock API 실행 방법 작성

## 16. 최종 점검

- [ ] 로컬 실행 확인
- [ ] 새로고침 시 오류 없는지 확인
- [ ] 개인 신청 전체 플로우 확인
- [ ] 단체 신청 전체 플로우 확인
- [ ] 제출 성공 케이스 확인
- [ ] 제출 실패 케이스 확인
- [ ] 정원 초과 케이스 확인
- [ ] 중복 신청 케이스 확인
- [ ] 입력값 오류 케이스 확인
- [ ] 모바일 화면 확인
- [ ] 콘솔 에러 확인
- [ ] 불필요한 코드 제거
- [ ] 의미 단위 커밋 확인
