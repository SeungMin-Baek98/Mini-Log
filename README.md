# Mini Log

`onebite-log` 저장소에서 관리하는 SNS형 라이프로그 서비스 `Mini Log`입니다. 단순 피드 앱에 머무르지 않고, 프로필 아카이브, 실시간 알림, AI 주간 회고까지 하나의 흐름으로 연결하는 데 집중했습니다.

## 프로젝트 소개

- 개발 기간: 2025.12 ~ 진행 중
- 배포 주소: [https://mini-log-v1.vercel.app/](https://mini-log-v1.vercel.app/)
- 핵심 키워드: `React 19`, `TypeScript`, `React Query`, `Supabase`, `Zustand`, `Tailwind CSS v4`

## 최근 반영한 기능

- 홈, 게시글 상세, 프로필 페이지를 공개 라우트로 전환하고 인증 필요 액션만 토스트로 안내하도록 접근 흐름 개선
- 게시글 조회 캐시를 viewer 기준으로 분리해 비로그인/로그인 상태 전환 시 좋아요 상태가 섞이지 않도록 개선
- `WeeklyInsightCard`를 토큰 기반 스타일과 다크 테마 대응으로 정리
- AI 주간 회고 생성 카드, 회고 모달, 회고 보관함 추가
- 실시간 알림 반영과 개별 읽음/모두 읽음 처리 추가
- 프로필 페이지 `전체 / 날짜별` 아카이브 탭과 `최신순 / 오래된순` 정렬 추가
- 스크롤 위치에 따라 일반 작성 버튼을 플로팅 버튼으로 전환하는 작성 UX 개선
- 게시 이미지 원본 보기 모달, sticky 헤더 blur, 개인정보처리방침 페이지 추가

## 현재 제공 기능

### 인증과 계정

- 이메일/비밀번호 회원가입, 로그인
- GitHub, Google, Kakao OAuth 로그인
- 비밀번호 재설정 메일 요청 및 비밀번호 변경
- 인증 페이지는 `GuestOnlyLayout`, 비밀번호 재설정은 `MemberOnlyLayout`으로 분리
- 홈, 게시글 상세, 프로필 페이지는 비로그인 상태에서도 접근 가능
- 글쓰기, 좋아요, 댓글, AI 주간 회고 생성, 프로필 수정 등 인증 필요 액션은 로그인 페이지 강제 이동 대신 토스트로 안내

### 피드와 게시글

- 무한 스크롤 피드
- 비로그인 사용자도 피드, 게시글 상세, 프로필 탐색 가능
- 게시글 작성, 수정, 삭제
- 다중 이미지 업로드와 업로드 전 미리보기
- 게시글 상세 페이지, 이미지 캐러셀, 원본 이미지 모달
- 스크롤 기반 플로팅 작성 버튼

### 소셜 상호작용

- 좋아요 토글과 Optimistic Update
- 댓글 작성, 수정, 삭제
- 대댓글 작성 및 스레드형 댓글 표시
- 게시글/댓글 활동 수 표시
- 비로그인 상태에서 좋아요, 댓글, 답글 시도 시 토스트로 인증 필요 여부 안내

### 프로필과 아카이브

- 프로필 이미지, 닉네임, 소개 수정
- 총 게시글 수, 이미지 포함 게시글 수, 마지막 기록 시점 표시
- 주간 단위 캘린더 탐색과 날짜별 게시글 필터링
- 프로필 아카이브 `전체 / 날짜별` 탭
- 작성 글 정렬과 페이지네이션 기반 보관함 탐색

### 알림과 AI 회고

- Supabase Realtime 기반 실시간 알림 수신
- 읽지 않은 알림 뱃지, 개별 읽음, 모두 읽음
- 댓글, 답글, 좋아요, 주간 회고 도착 알림 처리
- Supabase Edge Function 기반 AI 주간 회고 생성
- AI 주간 회고 생성 카드는 디자인 토큰 기반 스타일과 다크 테마를 함께 지원
- 회고 알림 클릭 시 단계형 회고 모달 표시
- 프로필에서 주간 회고 이력 보관함 열람

### 운영과 품질

- 라이트/다크 테마 전환
- Skeleton, Loader, Fallback, Toast 기반 상태 피드백
- Storybook 기반 UI 확인
- Vitest 단위 테스트
- GitHub Actions CI (`lint`, `build`, `test`)

## 기술 포인트

### 1. 공개 접근을 고려한 viewer-aware 캐시 전략

피드 조회 시 게시글 목록만 가져오는 것이 아니라 각 게시글을 개별 쿼리 키에도 저장합니다. 이때 비로그인 사용자와 로그인 사용자의 좋아요 상태가 섞이지 않도록 viewer 기준으로 쿼리 키를 분리했습니다. 덕분에 공개 라우트에서도 상세 페이지를 즉시 렌더링하면서, 로그인 전환 이후에도 올바른 사용자 상태를 유지할 수 있습니다.

### 2. 좋아요 Optimistic Update

좋아요는 `onMutate`에서 먼저 캐시를 갱신해 즉각적인 반응을 제공하고, 실패 시 이전 캐시로 롤백합니다. 네트워크 지연이 UI 반응성에 직접 드러나지 않도록 설계했습니다.

### 3. 피드/아카이브에 맞춘 이중 목록 전략

메인 피드는 무한 스크롤, 프로필 아카이브는 페이지네이션으로 분리했습니다. 같은 `PostFeed` 컴포넌트를 재사용하면서도 탐색 목적에 맞는 UX를 제공하도록 `mode` 단위로 분기했습니다.

### 4. 공개 탐색 + 기능 단위 인증 가드

서비스 진입 시점에는 비로그인 사용자를 막지 않고, 실제로 인증이 필요한 액션에서만 안내합니다. 홈, 게시글, 프로필을 먼저 경험하게 하면서도 쓰기, 좋아요, 댓글, 회고 생성 같은 보호된 기능은 공통 인증 가드 훅으로 일관되게 제어합니다.

### 5. 알림과 회고 흐름 연결

주간 회고 생성 후 알림 리스트에 반영되고, 알림 클릭 시 최신 회고 데이터를 다시 조회해 모달로 보여줍니다. 단순 생성 기능이 아니라 회고 확인까지 하나의 사용자 흐름으로 연결했습니다.

## 기술 스택

| 분류 | 기술 |
| --- | --- |
| Framework | React 19, React Router 7 |
| Language | TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| UI | Radix UI, shadcn/ui, Motion |
| Server State | TanStack Query |
| Client State | Zustand |
| Backend | Supabase Auth, Database, Storage, Realtime, Edge Functions |
| Test | Vitest, Playwright MCP, Storybook |
| CI | GitHub Actions |

## 프로젝트 구조

```text
src/
  components/      공통 UI, 레이아웃, 모달, 스켈레톤
  features/        도메인별 기능(auth, post, comment, profile, insight ...)
  pages/           라우트 단위 페이지
  provider/        세션/모달 등 전역 Provider
  store/           Zustand 전역 상태
  lib/             상수, 유틸, 에러 처리
  utils/           Supabase 클라이언트
```

## 문서 맵

- [현재 기능 정리](docs/current-features.md)
- [프로젝트 구조와 데이터 흐름](docs/project-structure.md)
- [Playwright QA 리포트 (2026-03-20)](docs/playwright-qa-report.md)
- [Playwright 테스트 리포트 (2026-01-28 스냅샷)](playwright-test-report.md)
- [E2E 테스트 리포트 (2026-01-28 스냅샷)](e2e-test-report.md)
- [렌더링 전략 정리 노트](rendering-strategies.md)

## 실행 방법

### 환경 변수

프로젝트 루트에 `.env` 파일을 만들고 아래 값을 설정합니다.

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 개발 서버

```bash
npm install
npm run dev
```

### 주요 스크립트

```bash
npm run lint
npm run test
npm run build
npm run preview
npm run storybook
npm run build-storybook
npm run type-gen
```
