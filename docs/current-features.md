# 현재 기능 정리

`Mini Log`의 현재 제품 기능을 기준으로 정리한 문서입니다. 예전 구현 메모 대신, 지금 실제 서비스에서 제공하는 흐름을 빠르게 파악할 수 있도록 구성했습니다.

기준일: 2026-03-18

## 1. 인증과 접근 제어

- 이메일/비밀번호 기반 회원가입과 로그인을 지원합니다.
- GitHub, Google, Kakao OAuth 로그인을 지원합니다.
- 비밀번호 재설정 메일 발송과 새 비밀번호 설정 흐름이 구현되어 있습니다.
- 비로그인 사용자는 인증 페이지로, 로그인 사용자는 메인 서비스로 유도되도록 라우트 가드가 분리되어 있습니다.

관련 영역:

- `src/pages/SignIn.tsx`
- `src/pages/Signup.tsx`
- `src/pages/ForgetPassword.tsx`
- `src/pages/ResetPassword.tsx`
- `src/components/layout/GuestOnlyLayout.tsx`
- `src/components/layout/MemberOnlyLayout.tsx`

## 2. 피드와 게시글

- 메인 페이지는 무한 스크롤 기반 피드로 동작합니다.
- 게시글 작성은 모달에서 처리되며, 텍스트와 이미지를 함께 등록할 수 있습니다.
- 이미지 업로드 전 미리보기를 제공하고, 업로드 후에는 캐러셀로 탐색할 수 있습니다.
- 게시글 상세 페이지에서 전체 내용, 댓글, 좋아요 상태를 확인할 수 있습니다.
- 게시 이미지 클릭 시 원본 이미지 전용 모달을 열어 더 크게 볼 수 있습니다.
- 메인 상단 작성 버튼은 스크롤 위치에 따라 플로팅 버튼 형태로 전환됩니다.

관련 영역:

- `src/pages/Index.tsx`
- `src/pages/PostDetail.tsx`
- `src/features/post/components/PostFeed.tsx`
- `src/features/post/components/PostItem.tsx`
- `src/components/modal/PostEditorModal.tsx`
- `src/components/modal/ShowOriginImagesModal.tsx`
- `src/features/post/components/CreatePostButton.tsx`

## 3. 댓글과 좋아요

- 게시글 좋아요는 Optimistic Update로 즉시 반응합니다.
- 댓글 작성, 수정, 삭제를 지원합니다.
- 댓글에 답글을 달 수 있고, 스레드형으로 펼쳐서 확인할 수 있습니다.
- 댓글 수와 좋아요 수가 게시글 카드와 상세 페이지에 함께 반영됩니다.

관련 영역:

- `src/features/post/hooks/mutations/useTogglePostLike.ts`
- `src/features/comment/components/CommentEditor.tsx`
- `src/features/comment/components/CommentList.tsx`
- `src/features/comment/components/CommentItem.tsx`
- `src/features/comment/api/comment.ts`

## 4. 프로필과 기록 탐색

- 프로필 페이지에서 아바타, 닉네임, 소개를 수정할 수 있습니다.
- 총 게시글 수, 이미지 포함 게시글 수, 마지막 기록 시점을 미니 통계 카드로 보여줍니다.
- 프로필 탐색은 `전체`와 `날짜별` 두 가지 모드를 제공합니다.
- `전체` 탭에서는 작성 글을 최신순/오래된순으로 정렬하고 페이지네이션으로 탐색합니다.
- `날짜별` 탭에서는 주간 캘린더를 넘기며 선택 날짜의 게시글만 확인할 수 있습니다.
- 캘린더에는 날짜별 게시글 활동량이 점 색상으로 표시됩니다.

관련 영역:

- `src/pages/ProfileDetail.tsx`
- `src/features/profile/components/ProfileInfo.tsx`
- `src/components/modal/ProfileEditorModal.tsx`
- `src/features/calendar/components/Calendar.tsx`
- `src/features/post/hooks/queries/usePagedPosts.ts`
- `src/features/post/hooks/queries/usePostCountByDate.ts`

## 5. 실시간 알림

- 읽지 않은 알림 개수를 헤더 배지로 표시합니다.
- 최근 알림 최대 20개를 Popover에서 확인할 수 있습니다.
- 개별 읽음 처리와 모두 읽음 처리를 지원합니다.
- 댓글, 답글, 좋아요, 주간 회고 도착 알림을 구분해서 노출합니다.
- Supabase Realtime 구독으로 새 알림이 도착하면 즉시 리스트와 배지가 갱신됩니다.

관련 영역:

- `src/components/layout/header/NotificationButton.tsx`
- `src/features/notification/api/notification.ts`
- `src/features/notification/hooks/queries/useNotificationsData.ts`

## 6. AI 주간 회고

- 메인 페이지에서 주간 회고 생성 카드를 통해 회고 생성을 요청할 수 있습니다.
- 가입 직후 1주 이내 사용자나 최근 1주 내 회고를 이미 받은 사용자는 카드가 숨겨집니다.
- 회고는 Supabase Edge Function을 통해 생성됩니다.
- 회고가 준비되면 알림에서 확인할 수 있고, 모달에서 단계별 메시지로 탐색할 수 있습니다.
- 프로필에서는 지금까지 생성된 주간 회고 이력을 표와 페이지네이션으로 확인할 수 있습니다.

관련 영역:

- `src/features/insight/components/WeeklyInsightCard.tsx`
- `src/components/modal/WeeklyRecapModal.tsx`
- `src/features/profile/components/WeeklyRecapArchiveModal.tsx`
- `src/features/insight/api/insight.ts`

## 7. 공통 UX와 운영 요소

- sticky 헤더와 blur 처리로 스크롤 중에도 상단 탐색 가독성을 유지합니다.
- 라이트/다크 테마 전환을 제공합니다.
- 로딩, 스켈레톤, 에러, 토스트 피드백을 공통 컴포넌트로 관리합니다.
- 개인정보처리방침 페이지를 별도 라우트로 제공합니다.
- Storybook, Vitest, GitHub Actions CI를 통해 UI 확인과 품질 검증 흐름을 갖추고 있습니다.

관련 영역:

- `src/components/layout/header/Header.tsx`
- `src/components/layout/header/ThemeButton.tsx`
- `src/pages/PrivacyPolicy.tsx`
- `.github/workflows/ci.yml`

## 8. 문서 사용 가이드

- 서비스 소개와 실행 방법은 루트 [README.md](../README.md)에서 확인합니다.
- 현재 기능 범위는 이 문서를 기준으로 봅니다.
- 구조와 데이터 흐름은 [docs/project-structure.md](project-structure.md)에서 확인합니다.
- 루트의 테스트 리포트 문서는 특정 시점의 기록이므로, 현재 기능 목록의 기준 문서로 사용하지 않습니다.
