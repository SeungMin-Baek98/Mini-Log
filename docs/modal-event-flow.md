# 모달 이벤트 흐름 정리

`onebite-log` 프로젝트에서 모달이 어떤 상태와 이벤트로 열리고 닫히는지 공부용으로 정리한 문서입니다.

기준일: 2026-03-26

## 1. 한 줄 요약

이 프로젝트의 모달은 대부분 "버튼 `onClick`으로 전역 상태를 열고, Radix Dialog가 `pointerdown outside`, `Escape`, `Close` 버튼을 감지해서 `onOpenChange(false)`를 보내며, 최종 close 여부는 우리 코드가 결정하는 구조"입니다.

## 2. 구조 요약

모달 동작은 아래 계층으로 나눠서 보면 이해가 쉽습니다.

1. 열기 상태 소유
   - Zustand store
2. 실제 렌더링
   - `Dialog open={isOpen}`
3. 전역 포털 마운트
   - `ModalProvider`
4. 바깥 클릭, 포커스, `Escape` 감지
   - Radix `DismissableLayer`, `FocusScope`

핵심 파일:

- `src/provider/ModalProvider.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/alert-dialog.tsx`
- `src/store/postEditorModal.ts`
- `src/store/profileEditorModal.ts`
- `src/store/showOriginImagesModal.ts`
- `src/store/weeklyRecapModal.ts`
- `src/store/alertModal.ts`

## 3. 전역 모달이 렌더되는 위치

전역 모달은 각 페이지에서 직접 렌더링하지 않고 `ModalProvider`가 한 번에 포털로 올립니다.

```tsx
createPortal(
	<>
		<PostEditorModal />
		<AlertModal />
		<ProfileEditorModal />
		<ShowOriginImagesModal />
		<WeeklyRecapModal />
	</>,
	document.getElementById('modal-root')!
);
```

이 구조 덕분에 모달은 페이지 위치와 관계없이 항상 같은 루트에서 뜹니다.

## 4. 열릴 때 타임라인

이 프로젝트는 `DialogTrigger`를 실제로 쓰지 않고, 대부분 버튼 `onClick`으로 store를 직접 엽니다.

예시: 게시글 작성 모달

```text
pointerdown
-> pointerup
-> click
-> React onClick
-> openCreatePostModal()
-> zustand store isOpen = true
-> <Dialog open={true}> 재렌더
-> Portal / Overlay / Content mount
-> FocusScope / DismissableLayer 활성화
-> textarea focus
```

관련 파일:

- `src/features/post/components/CreatePostButton.tsx`
- `src/store/postEditorModal.ts`
- `src/components/modal/PostEditorModal.tsx`

정리 포인트:

- 열기 기준 이벤트는 `pointerdown`이 아니라 `click`
- `Dialog`는 열기 상태를 직접 만들지 않고, 이미 열린 상태를 받아 렌더링

## 5. 닫힐 때 타임라인

### 5-1. 바깥 영역 클릭

일반 `Dialog` 계열은 overlay `onClick`으로 닫히는 게 아니라, Radix가 문서 레벨 `pointerdown`을 보고 outside interaction인지 판정합니다.

여기서 `outside dismiss`는 "외부 이벤트가 실행되었다"는 뜻이라기보다, "모달 content 바깥에서 시작된 상호작용을 닫힘 후보로 취급한다"는 뜻에 가깝습니다.

즉, 아래처럼 이해하면 됩니다.

- 바깥에서 `pointerdown`이 시작되었다
- 또는 바깥으로 `focus`가 이동하려고 했다
- 그래서 Radix가 "이건 outside interaction 이다"라고 판정했다
- 그 상호작용을 dismiss 신호로 연결할지 검토한다

중요한 점:

- outside interaction 이 감지되었다고 항상 닫히는 것은 아닙니다
- `preventDefault()`로 막으면 dismiss로 이어지지 않을 수 있습니다
- `PostEditorModal`처럼 닫기 요청을 받아도 실제 close 여부를 다시 판단할 수도 있습니다

```text
document pointerdown
-> content 내부에서 시작된 이벤트인지 capture 단계에서 확인
-> outside 로 판정되면 onPointerDownOutside
-> onInteractOutside
-> onDismiss
-> onOpenChange(false)
-> 우리 모달의 close 로직 실행
```

핵심 개념:

- 내부 클릭이면 `onPointerDownCapture`가 먼저 실행되어 "inside"로 표시
- 바깥 클릭이면 그 표시가 없어서 outside dismiss로 이어짐

### 5-2. X 버튼 클릭

```text
button click
-> DialogPrimitive.Close
-> onOpenChange(false)
-> 우리 모달의 close 로직 실행
```

X 버튼은 outside 판정을 거치지 않고 바로 close 신호를 보냅니다.

### 5-3. Escape 키

```text
keydown(Escape)
-> DismissableLayer 감지
-> onDismiss
-> onOpenChange(false)
-> 우리 모달의 close 로직 실행
```

## 6. `pointerdown`, `focus`, `blur`, `capture`의 역할

### `pointerdown`

- 마우스나 터치가 눌리는 순간의 low-level 이벤트
- 일반 `Dialog`의 outside close 판단은 사실상 `click`보다 `pointerdown` 기준에 가깝습니다

`mousedown`과 비교하면 차이는 더 분명합니다.

- `mousedown`: 마우스 입력만 다룸
- `pointerdown`: 마우스, 터치, 펜 입력을 하나의 모델로 다룸

즉, `pointerdown`을 쓰는 이유는 단순히 "더 광범위해서"에서 끝나지 않습니다.

- 여러 입력 장치를 하나의 이벤트 체계로 처리할 수 있다
- `pointerType` 같은 정보를 함께 다룰 수 있다
- 모바일 터치와 데스크톱 마우스를 따로 분기하는 비용이 줄어든다
- `click`보다 이른 시점에 의도를 잡을 수 있다

한 줄로 보면:

```text
`pointerdown`은 `mousedown`의 상위 호환 느낌이라기보다,
마우스/터치/펜을 통합해서 다루는 더 현대적인 입력 이벤트 모델에 가깝다.
```

### `click`

- `pointerdown`과 `pointerup` 뒤에 성립하는 high-level 이벤트
- 이 프로젝트에서 모달 "열기"는 대부분 이 `click`에 걸려 있습니다

### `capture`

- 이벤트가 부모에서 자식으로 내려가는 단계
- Radix는 `onPointerDownCapture`, `onFocusCapture`, `onBlurCapture`로 "이 이벤트가 모달 내부에서 시작됐는가"를 먼저 기록합니다

### `focus` / `blur`

- 이 프로젝트의 일반 모달은 `blur`로 닫히지 않습니다
- `focus` 계열 이벤트는 밖으로 포커스가 빠질 때 감지에 쓰이지만, modal `Dialog`에서는 보통 `preventDefault()`로 막아서 focus trap을 유지합니다

한 줄로 보면:

- `pointerdown`: outside dismiss 판정용
- `click`: 열기 버튼 실행용
- `capture`: inside / outside 판정 보조
- `focus` / `blur`: 포커스 가두기와 outside 감지 보조

## 7. 이 프로젝트의 모달별 차이

### `PostEditorModal`

- `onOpenChange={handleCloseModal}`
- 닫기 신호가 와도 바로 닫지 않을 수 있음
- 작성 중 내용이나 이미지가 있으면 `AlertModal`을 먼저 띄움

공부 포인트:

- `onOpenChange(false)`는 "닫아도 되냐"를 묻는 진입점처럼 쓰일 수 있음

### `ProfileEditorModal`

- `onOpenChange={close}`
- outside click, `Escape`, X 버튼이 모두 바로 close로 이어짐

### `ShowOriginImagesModal`

- `onOpenChange`에서 `open === false`일 때만 close
- 가장 기본적인 controlled dialog 패턴에 가까움

### `WeeklyRecapModal`

- 닫힐 때 `close()`와 함께 `reset()`도 같이 실행
- 단순 open/close 외에 부가 상태 정리가 필요한 예시

### `AlertModal`

- 일반 `Dialog`가 아니라 `AlertDialog`
- outside `pointerdown`과 outside interact를 막아 둠
- 확인/취소 버튼을 눌러야 닫히는 구조에 가깝다

공부 포인트:

- `Dialog`와 `AlertDialog`는 outside dismiss 정책이 다르다

## 8. `PostEditorModal` 실제 흐름 예시

### 초안이 없는 상태에서 바깥 클릭

```text
outside pointerdown
-> Radix outside dismiss 판정
-> onOpenChange(false)
-> handleCloseModal()
-> content === '' && images.length === 0
-> postEditorModal.actions.close()
-> 모달 닫힘
```

### 초안이 있는 상태에서 바깥 클릭

```text
outside pointerdown
-> Radix outside dismiss 판정
-> onOpenChange(false)
-> handleCloseModal()
-> content !== '' 또는 images.length > 0
-> openAlertModal(...)
-> 원래 모달은 유지
-> 경고 모달이 추가로 열림
```

여기서 중요한 점은, 닫힘 신호가 왔다고 해서 항상 닫히는 것은 아니라는 점입니다.

## 9. controlled dialog 관점에서 정리

이 프로젝트의 일반 모달은 대부분 controlled dialog 입니다.

의미:

- `Dialog`가 자기 내부에서 `open` 상태를 최종 보관하지 않음
- 외부 store나 부모 state가 진짜 source of truth
- Radix는 닫힘 요청을 `onOpenChange(false)`로 알리는 역할
- 실제 상태 변경은 우리 코드가 수행

암기용 문장:

```text
Radix는 close 요청을 보낸다.
실제 close는 우리 상태 관리 코드가 결정한다.
```

## 10. 공부할 때 추천하는 정리 순서

1. 상태를 누가 들고 있는지 먼저 본다
2. 열기 이벤트가 `click`인지 `pointerdown`인지 구분한다
3. `DialogTrigger` 사용 여부를 확인한다
4. `onOpenChange`에 어떤 함수가 연결되어 있는지 본다
5. 그 함수가 즉시 close하는지, 확인 모달을 띄우는지 본다
6. `AlertDialog`인지 일반 `Dialog`인지 구분한다

## 11. 스스로 확인해볼 질문과 답변

아래 질문에 답할 수 있으면 이 프로젝트의 모달 구조를 꽤 잘 이해한 상태입니다.

### 11-1. 왜 이 프로젝트는 `DialogTrigger` 대신 store 기반 open 방식을 쓸까?

이 프로젝트의 모달은 대부분 `ModalProvider`에서 전역 포털로 한 번에 마운트됩니다. 즉, 모달 컴포넌트가 실제 버튼 옆에 붙어 있는 구조가 아니라 앱 루트 쪽에 떠 있습니다.

그래서 버튼과 모달을 `DialogTrigger`로 직접 연결하는 방식보다, 버튼 `onClick`이 store를 열고 모달은 그 store 상태를 구독하는 방식이 더 자연스럽습니다.

이 방식의 장점:

- 어느 화면에서든 같은 모달을 쉽게 열 수 있다
- 모달 open 시 payload를 함께 넘기기 쉽다
- 예를 들어 `EDIT` 모드, 게시글 id, 이미지 목록, 회고 데이터 같은 값을 같이 실어 보낼 수 있다
- 알림 클릭, 이미지 클릭, 버튼 클릭처럼 트리거 위치가 달라도 같은 모달을 재사용하기 쉽다

한 줄 요약:

```text
이 프로젝트는 "트리거와 모달이 붙어 있는 구조"보다
"전역 모달을 상태로 제어하는 구조"에 더 잘 맞는다.
```

### 11-2. 왜 outside dismiss는 `click`보다 `pointerdown` 기준으로 설계됐을까?

`pointerdown`은 사용자가 "여기를 누르겠다"는 의도가 가장 먼저 드러나는 순간입니다. `click`은 그보다 늦게 발생합니다.

Radix가 `pointerdown` 기준을 쓰는 이유는 다음과 같습니다.

- dismiss를 더 빠르게 시작할 수 있다
- 마우스와 터치 입력을 더 일관되게 처리할 수 있다
- 포커스 이동이나 다른 클릭 핸들러가 뒤늦게 실행되기 전에 outside 여부를 먼저 판정할 수 있다
- 사용자가 바깥을 누른 시점을 기준으로 명확하게 dismiss 의도를 잡을 수 있다

즉, `click`까지 기다리면 이미 다른 상호작용이 일부 진행된 뒤일 수 있어서, 모달처럼 민감한 UI는 `pointerdown` 기준이 더 안정적입니다.

한 줄 요약:

```text
outside dismiss는 "사용자가 눌렀다"는 순간을 빨리 잡는 것이 중요해서
`click`보다 `pointerdown`이 더 적합하다.
```

### 11-3. 왜 `focus` / `blur`는 닫기 이벤트라기보다 focus trap 보조에 가까울까?

모달의 기본 목적 중 하나는 "현재 대화 맥락에 사용자를 머물게 하는 것"입니다. 접근성 관점에서도 모달이 열려 있으면 포커스가 모달 안에 머무르는 것이 중요합니다.

그래서 `focus` / `blur`는 보통 이렇게 쓰입니다.

- 포커스가 모달 밖으로 빠져나가려는지 감지한다
- 빠져나가려 하면 닫기보다 먼저 막거나 되돌린다
- 탭 이동, 자동 포커스, 스크린리더 이동 같은 상황에서도 포커스를 안전하게 관리한다

즉, `focus outside`는 "지금 닫아야 하나?"보다 "포커스가 밖으로 새지 않게 유지해야 하나?"에 더 가깝습니다.

특히 modal `Dialog`는 바깥 포커스를 그냥 허용하면 사용자가 화면상으로는 모달 안에 있는데, 실제 키보드 포커스는 뒤쪽 화면으로 빠지는 문제가 생길 수 있습니다.

한 줄 요약:

```text
`focus` / `blur`는 닫기 트리거라기보다
"모달 안에 포커스를 가두기 위한 감시 장치"에 가깝다.
```

### 11-4. 왜 `PostEditorModal`은 `onOpenChange(false)`가 와도 항상 닫히지 않을까?

이 프로젝트의 `PostEditorModal`은 controlled dialog 입니다. 즉, `onOpenChange(false)`는 "닫아 달라"는 요청일 뿐이고, 실제로 닫을지는 우리 코드가 결정합니다.

`PostEditorModal`은 작성 중인 초안을 보호해야 하므로, 닫기 요청이 오면 바로 store를 false로 바꾸지 않고 먼저 `handleCloseModal()`을 실행합니다.

이 함수는 다음을 확인합니다.

- 내용이 비어 있는가
- 첨부 이미지가 없는가

둘 다 비어 있으면 바로 닫고, 아니면 `AlertModal`을 열어서 정말 나갈지 다시 묻습니다.

즉, 이 모달은 "닫힘 요청"과 "실제 닫힘" 사이에 보호 로직이 한 번 더 끼어 있습니다.

한 줄 요약:

```text
`onOpenChange(false)`는 close 확정이 아니라 close 요청이고,
`PostEditorModal`은 초안 보호를 위해 그 요청을 가로채서 판단한다.
```

### 11-5. 왜 `AlertDialog`는 일반 `Dialog`보다 더 강하게 닫힘을 제한할까?

`AlertDialog`는 보통 삭제, 이탈, 확인 같은 중요한 결정을 다루는 용도입니다. 이런 경우 바깥 클릭 한 번으로 실수로 닫히면 사용자 경험과 안정성이 모두 나빠질 수 있습니다.

그래서 `AlertDialog`는 일반 `Dialog`보다 더 보수적으로 동작합니다.

- outside `pointerdown` dismiss를 막는다
- outside interact를 막는다
- 사용자가 명시적으로 확인 또는 취소를 누르도록 유도한다
- 실수 클릭보다 의도된 선택을 우선시한다

이 프로젝트의 `AlertModal`도 같은 이유로, 작성 중 이탈 경고처럼 사용자의 결정을 명확하게 받아야 하는 상황에 쓰이고 있습니다.

한 줄 요약:

```text
`AlertDialog`는 "가볍게 닫아도 되는 창"이 아니라
"명시적인 결정을 받아야 하는 창"이기 때문에 닫힘을 더 엄격하게 제한한다.
```

## 12. 빠른 복습용 문장

- 열기: 버튼 `click` -> store open
- 렌더: `Dialog open={isOpen}`
- outside 감지: document `pointerdown` + capture 기반 inside 판정
- 닫기 요청: `onDismiss` -> `onOpenChange(false)`
- 실제 닫기: 우리 close 함수가 결정
- 예외: `AlertDialog`는 outside dismiss 차단
