# Mini Log

Supabase 기반 SNS형 미니 블로그입니다. Supabase Auth, Database, Storage, RPC를 활용해 인증과 데이터 저장, 이미지 업로드, like/comment count 갱신을 처리했습니다.

## 프로젝트 소개

- 개발 기간: 2025.12 ~ 2026.03
- 프로젝트 유형: 개인 프로젝트
- 배포 주소: [https://mini-log-v1.vercel.app/](https://mini-log-v1.vercel.app/)
- 기술 스택: `React`, `TypeScript`, `Supabase(Auth/DB/Storage/RPC)`, `TanStack Query`, `GitHub Actions`

## 주요 구현 및 개선

### Supabase RPC 기반 count 원자적 처리

Optimistic Update 방식에서 like/comment count 불일치가 발생할 수 있는 문제를 Supabase RPC 기반 원자적 처리로 전환했습니다. 10회 동시 요청 테스트 기준 count 불일치 0건을 달성했습니다.

### Code Splitting

`React.lazy`와 `Suspense`를 페이지 및 모달 컴포넌트에 적용했습니다. 초기 JS Bundle 용량을 925.83kB에서 576.61kB로 줄여 약 37.8% 감소시켰습니다.

### 이미지 업로드 최적화

Canvas API를 활용해 업로드 전 이미지를 WebP로 변환하고 최대 크기를 제한했습니다. 2.6MB PNG 이미지를 44.6KB WebP로 축소했고, Slow 4G 기준 다운로드 시간을 약 15.3초에서 약 1초로 개선했습니다.

### API waterfall 개선

profile API 로딩이 전체 렌더링을 막아 post API 요청이 뒤로 밀리던 구조를 개선했습니다. profile -> post 순차 흐름을 병렬 요청에 가깝게 바꿔 약 2.2초의 요청 지연을 제거했고, post API 응답 완료 시점을 5.8s에서 4.8s로 단축했습니다.

### 카드형 UI 추상화

반복되던 카드형 UI를 `Surface`, `FeatureSurface` 컴포넌트로 추상화했습니다. 프로필, 피드, 상세 등 10개 화면의 스타일 관리 지점을 1곳으로 통합했습니다.

### GitHub Actions CI

GitHub Actions로 `lint`, `build`, `test` 검증 파이프라인을 구성했습니다. 수동 검증 3단계를 자동화해 배포 전 검증 시간을 약 5분에서 약 3분으로 줄였습니다.

## 성능 최적화 기록

Rollup Visualizer, Lighthouse, Chrome DevTools Network 패널을 활용해 번들 크기, 이미지 전송량, API 요청 순서를 분석하고 병목 유형별 최적화 전략을 적용했습니다.

| 개선 항목       | 측정/문제 상황                                    | 개선 결과                                       |
| --------------- | ------------------------------------------------- | ----------------------------------------------- |
| JS Bundle       | 초기 JS Bundle 925.83kB                           | 576.61kB로 감소, 약 37.8% 축소                 |
| 이미지 전송량   | 2.6MB PNG 업로드 및 다운로드 비용                 | 44.6KB WebP로 축소, Slow 4G 기준 약 1초로 개선 |
| API waterfall   | profile -> post 순차 흐름으로 약 2.2초 지연 발생 | 주요 요청 병렬화, post API 완료 5.8s -> 4.8s   |
| count 동시성    | 동시 요청 시 like/comment count 불일치 가능       | Supabase RPC 전환, 10회 동시 요청 불일치 0건   |

관련 개선 과정은 Velog 시리즈로 정리했습니다.

- [프론트엔드 성능 최적화-1: React.lazy와 Suspense로 초기 JS 번들 줄이기](https://velog.io/@jah02190/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EC%84%B1%EB%8A%A5-%EC%B5%9C%EC%A0%81%ED%99%94-1-React.lazy%EC%99%80-Suspense%EB%A1%9C-%EC%B4%88%EA%B8%B0-JS-%EB%B2%88%EB%93%A4-%EC%A4%84%EC%9D%B4%EA%B8%B0)
- [프론트엔드 성능 최적화-2: Canvas API로 이미지 업로드 최적화하기](https://velog.io/@jah02190/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EC%84%B1%EB%8A%A5-%EC%B5%9C%EC%A0%81%ED%99%94-2-Canvas-API%EB%A1%9C-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%97%85%EB%A1%9C%EB%93%9C-%EC%B5%9C%EC%A0%81%ED%99%94%ED%95%98%EA%B8%B0)
- [프론트엔드 성능 최적화-3: API waterfall 현상 해결하기](https://velog.io/@jah02190/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EC%84%B1%EB%8A%A5-%EC%B5%9C%EC%A0%81%ED%99%94-3-API-waterfall-%ED%98%84%EC%83%81-%ED%95%B4%EA%B2%B0%ED%95%98%EA%B8%B0)

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
npm run type-gen
```
