# 프로젝트 구조와 데이터 흐름

현재 `onebite-log` 코드베이스를 빠르게 이해하기 위한 구조 문서입니다.

기준일: 2026-03-18

## 1. 디렉터리 역할

```text
src/
  components/
    layout/        헤더, 푸터, 라우트 공통 레이아웃
    modal/         전역 포털로 관리되는 모달들
    skeleton/      로딩 스켈레톤 UI
    ui/            공통 베이스 UI 컴포넌트
  features/
    auth/          로그인, 회원가입, 비밀번호 재설정
    calendar/      프로필 날짜 탐색 캘린더
    comment/       댓글, 답글, 댓글 API
    image/         이미지 업로드/삭제
    insight/       AI 주간 회고 조회/생성
    notification/  알림 조회, 읽음 처리
    post/          피드, 게시글, 좋아요
    profile/       프로필 조회/수정, 통계
  pages/           라우트 엔트리 페이지
  provider/        세션/모달 전역 Provider
  store/           Zustand 전역 상태
  lib/             상수, 포맷터, 유틸
  utils/           Supabase 인스턴스
```

## 2. 라우팅 구조

최상위 라우터는 `src/RootRoute.tsx`에서 관리합니다.

- `GlobalLayout`
  - 공통 헤더/푸터와 메인 레이아웃 담당
- `GuestOnlyLayout`
  - `/sign-in`, `/sign-up`, `/forget-password`
- `MemberOnlyLayout`
  - `/`, `/post/:postId`, `/profile/:userId`, `/reset-password`

이 구조 덕분에 인증 상태에 따른 분기 로직을 페이지마다 중복 작성하지 않습니다.

## 3. 상태 관리 분리 기준

### React Query

서버에서 조회하거나 서버 변경과 함께 움직이는 데이터는 React Query가 담당합니다.

- 게시글, 댓글, 프로필, 알림, 회고 기록
- 캐시 키는 `src/lib/constants.ts`의 `QUERY_KEYS`에서 통일
- 게시글 목록 조회 시 개별 게시글 캐시도 함께 채움

### Zustand

앱 전역에서 짧게 공유되는 UI 상태는 Zustand가 담당합니다.

- 세션 상태
- 작성 모달, 프로필 수정 모달, 알림용 회고 모달
- 프로필 선택 날짜
- 테마

## 4. 주요 데이터 흐름

### 피드 -> 상세 페이지

1. `PostFeed`가 목록 쿼리를 호출합니다.
2. 목록 응답을 받을 때 각 게시글을 `QUERY_KEYS.post.byId(post.id)`에도 저장합니다.
3. `PostItem`은 같은 개별 캐시 키를 사용합니다.
4. 상세 페이지에서는 이미 캐시가 있으면 즉시 렌더링하고, 필요한 경우만 서버 요청을 수행합니다.

핵심 파일:

- `src/features/post/hooks/queries/useInfinitePosts.ts`
- `src/features/post/hooks/queries/usePagedPosts.ts`
- `src/features/post/hooks/queries/usePostByIdData.ts`

### 알림 실시간 반영

1. 헤더의 `NotificationButton`이 사용자별 Realtime 채널을 구독합니다.
2. 새 알림이 들어오면 알림 목록 캐시와 unread count 캐시를 직접 갱신합니다.
3. 사용자가 알림을 클릭하면 읽음 처리 후 게시글 상세 또는 주간 회고 모달로 이동합니다.

핵심 파일:

- `src/components/layout/header/NotificationButton.tsx`
- `src/features/notification/api/notification.ts`

### 주간 회고 생성 -> 확인

1. 메인 페이지의 `WeeklyInsightCard`에서 회고 생성을 요청합니다.
2. 요청은 Supabase Edge Function `weekly-insight`를 호출합니다.
3. 회고가 준비되면 알림에 `weekly_recap_ready` 타입으로 표시됩니다.
4. 알림 클릭 시 최신 회고를 조회한 뒤 `WeeklyRecapModal`을 엽니다.
5. 프로필에서는 회고 이력을 `WeeklyRecapArchiveModal`로 모아 볼 수 있습니다.

핵심 파일:

- `src/features/insight/components/WeeklyInsightCard.tsx`
- `src/features/insight/api/insight.ts`
- `src/components/modal/WeeklyRecapModal.tsx`
- `src/features/profile/components/WeeklyRecapArchiveModal.tsx`

## 5. 모달 구조

전역 모달은 `ModalProvider`에서 포털로 한 번에 마운트합니다.

- 게시글 작성/수정
- 경고 확인
- 프로필 수정
- 원본 이미지 보기
- 주간 회고

이 방식은 페이지 어디서든 동일한 모달 상태를 재사용하기 좋고, z-index 충돌도 줄여줍니다.

## 6. 품질 관리 흐름

- `npm run lint`: ESLint 검사
- `npm run test`: Vitest 실행
- `npm run build`: 타입 체크 후 Vite 빌드
- `.github/workflows/ci.yml`: `lint` -> `build` -> `test`

## 7. 문서 연결

- 기능 범위는 [docs/current-features.md](current-features.md)
- 제품 소개와 실행 방법은 [README.md](../README.md)
