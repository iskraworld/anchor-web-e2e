# worklog.md — 작업 기록

> 최신 세션이 위에 오도록 역순으로 작성한다.

---

## Session 2026-04-28 09:00 — Phase 6 완료: P1 구현 + C-1 단언 수정

### 작업 요약
- CI 워크플로 초안 작성 (`docs/ci-templates/daily-monitor.yml`, `weekly-full.yml`)
- P1 시나리오 29개 구현 (`tests/p1/navigation`, `permissions`, `search`, `forms`, `B-network-detail`)
- C-1 원인 조사: 한지희 toggle은 이미 OFF였고, 시나리오 원문 재검토 결과 테스트 단언이 잘못된 것으로 판명
  - 시나리오 의도: "자기 카드는 보이지만 프로필이 빈약한 상태 확인"
  - 수정 전: `not.toContainText('한지희')` (한지희 완전 미노출)
  - 수정 후: `getByText('한지희').toBeVisible()` + `not.toContainText('taxhan@theanchor.best')` (카드 보임, 이메일 미노출)
- 최종: P0 28 passed / 2 skipped, P1 29 passed

### 주요 판단
- FN-PERM-004: freeUser 세무이력관리 접근 시 URL 리다이렉트 없이 인라인 403 노출 → 단언 수정
- C-1 단언: 시나리오 원문 "자기만 빈약한 것 확인"에 맞게 존재 확인 + 연락처 미노출 확인으로 변경

### 다음 액션
- CI 활성화: `.github/workflows/`에 템플릿 복사 + GitHub Actions 환경 변수 등록 (수동)
- D-2/D-3: Anchor 팀 UI 출시 후 BLOCKED 해제

---

## Session 2026-04-28 08:00 — Phase 6 진입: CI 연동 및 P1 시나리오 확장 계획 수립

### 작업 요약
- Phase 0~5 완료 상태 확인 (27 passed)
- Phase 6 (모니터링·유지보수) 진입 확정
- 다음 작업 항목 식별 및 우선순위 정리

### 다음 액션
- GitHub Actions CI 연동 구성
- 한지희 토글 OFF 조건으로 C-1 시나리오 재실행 및 검증
- D-2/D-3 UI 출시 후 BLOCKED 시나리오 해제 및 활성화
- P1 시나리오 24개 추가 구현


## Session 2026-04-28 (Phase 2-5 완료) — P0 E2E 테스트 전체 구현 및 통과

### 작업 요약
- Phase 2: Playwright MCP 탐색 기반 `specs/scenarios-from-exploration.md` 작성 (60 시나리오)
- Phase 3: `specs/test-plan.md` (P0~P2 분류), `specs/data-validation.md` 작성
- Phase 4: 5개 계정 인증 셋업 + 시나리오 A-G 테스트 코드 + shared Page Objects 7개
- Phase 5: 첫 실행 후 9개 실패 진단 및 전부 수정 → 27 passed / 3 skipped / 0 failed

### 주요 디버깅 내용
- 홈 검색 폼: 소속(청/서) 선택 전 전체 비활성화 → 직접 URL 탐색으로 대체
- `data-testid=mutual-section` 없음 → heading `/공통 관계망 찾기/` 로 대체
- 세무이력 리포트 `<main>/<article>` 없음 → 콘텐츠 텍스트 기반 assertion으로 대체
- strict mode 위반 (중복 텍스트) → `.first()` 추가
- `test.skip(true, reason)` describe 스코프 사용 → `test.skip(name, fn)` 형식으로 변경

### 다음 액션
- (선택) Phase 6: CI/GitHub Actions 연동
- C-1: Anchor 팀 한지희 토글 OFF 원복 후 실행

## Session 2026-04-28 06:00 — 전관 세무사 계정 로그인 및 UI 구조 파악

### 작업 요약
- 로그인 폼 testid 확인 후 전관 세무사 계정으로 로그인 성공
- GNB(상단 네비게이션) 탭 구성 확인 → 현직·전직·세무사 3개 탭 존재
- 프로필 드롭다운 클릭 및 내용 확인 진행

### 다음 액션
- 프로필 드롭다운 내용 확인 완료 후 기록
- 세무사 탭 기준 주요 페이지 구조 및 기능 파악 계속 진행


## Session 2026-04-28 00:09 — Phase 0~2 환경 셋업 및 앱 탐색 시작

### 작업 요약
- 이전 세션 worklog/state/decision 파일 커밋·푸시로 마무리
- `app.context.md`, `data-dependencies.md`, `test-plan.md` 및 연관 ts 파일 6개 삭제 후 커밋·푸시 (리셋)
- Phase 0 점검: `tests/critical` 등 디렉터리, `shared/`, `docs/source/` 미생성, `.gitignore` 누락 항목 확인 및 보고
- Phase 0 누락 항목 셋업 — 디렉터리 생성, `anchor-web-e2e-info.md` 복사, `.gitignore` 보완
- Phase 1~5 프롬프트 파일 전체 읽기 후 `data-dependencies.md` 생성
- Phase 2: Playwright MCP로 비로그인 홈 → 로그인 페이지 탐색 시작

### 다음 액션
- Phase 2: 5개 계정 탐색 계속
- Phase 3~5 순차 진행


## Session 2026-04-27 22:08 — P0 시나리오 F 테스트 구현 완료 (4/4 통과)

### 작업 요약
- **`playwright.config.ts` 업데이트**
  - `.env.local` 자동 로드: dotenv 패키지 없이 Node `fs`로 직접 파싱
  - `baseURL: process.env.ANCHOR_BASE_URL` 설정
  - `screenshot: 'only-on-failure'` 추가, chromium only (속도 최적화)
- **`tests/helpers/auth.ts` 생성**
  - `loginAs(page, email, password)`: 로그인 헬퍼 (`data-testid` selector 기반)
  - `fillReactInput(page, testId, value)`: React controlled input 우회 (nativeInputValueSetter + input 이벤트)
- **`tests/scenario-f.spec.ts` 생성** — 4개 테스트 전체 통과 (8.7초)
  - F-1: 납세자 로그인 → 홈 검색 → "김경국" 검색 → URL 변경 + 결과 검증
  - F-2: `/search/active-officials/3313` → "추천 세무사" 섹션 + "추천 세무사 N:" 패턴 검증
  - F-3: 추천 목록에서 박성호 클릭 → UUID URL + 박성호 heading + "전직공무원" 태그 검증
  - F-Background: 납세자 GNB에 "전직 공무원 찾기" 탭 미노출 검증

### 실패한 시도
- F-3에서 `page.getByText('가온세무법인')` → 프로필 페이지에 법인명 텍스트 미노출 (사이드바에 "금융분석원" 표시됨) → UUID URL 검증으로 대체
- F-3에서 `page.getByText('세무조사 대응')` → strict mode violation (4개 요소 매칭) → `getByRole('heading', { name: '박성호' })` + `getByText('전직공무원')`으로 변경

### 다음 액션
- P1 시나리오 A (전관 세무사 공통 인맥 탐색) 테스트 코드 구현
- P1 시나리오 B (일반 세무사 공통 인맥 탐색) 테스트 코드 구현
- P1 시나리오 D·E (세무법인 역량 리포트) 테스트 코드 구현

---

## Session 2026-04-27 21:58 — staging 자율 탐색 + 테스트 플랜 A-G 작성 완료

### 작업 요약
- **staging 자율 탐색** (`docs/app.context.md` 생성, 300줄)
  - Playwright MCP로 5개 계정 전체 탐색 (전관세무사·일반세무사·세무법인소유자·납세자유료·무료)
  - 전체 URL 패턴 17개 발견, 역할별 GNB 차이·탭 구조·selector 후보 정리
- **staging 데이터 직접 검증** (Playwright MCP로 실계정 로그인)
  - 김경국 (동대문세무서 조사과 6급 조사관) → ID **3313** 확인
  - 김정희 (서울청 성실납세지원국 소득재산세과 재산팀) → ID **5707** 확인
  - 납세자 뷰 `/search/active-officials/3313` → "추천 세무사 1: 박성호" 실제 노출 확인
  - 가온세무법인 세무사 찾기 검색 → 한지희 미노출 (프로필 미등록 상태) 확인
  - 박성호 세무사 UUID: `5032cae5-cb6f-4997-80c8-210f9d02edca`
- **`specs/test-plan.md`** 작성 (Gherkin 형식, 시나리오 A-G, 우선순위 P0/P1/P2)
  - P0: 시나리오 F (납세자 추천 검색 3개 시나리오)
  - P1: A·B·D·E·G (각 사용자 유형 핵심 기능)
  - P2: C (데이터 변경 포함, staging 전용)
- **`specs/data-dependencies.md`** 작성 (Anchor 팀 전달용 데이터 보존 요청서)
  - 삭제 금지 4건, 상태 유지 2건, 확인 요청 3건

### settings.json 변경사항
- `Read(./.env.*)` deny 규칙 제거 → `.env.local` 읽기 허용 (사용자 직접 변경)
- `mcp__playwright__browser_fill_form`, `mcp__playwright__browser_run_code` allow 목록 추가 (세션 중 권한 승인)

### 실패한 시도
- JS로 `document.cookie` 삭제 시도 → httpOnly 쿠키라 실패 → `page.context().clearCookies()` (browser_run_code)로 해결
- `data-testid="gnb-logout-btn"` 직접 클릭 → DEV 패널이 뷰포트 밖에 렌더링돼 실패 → setTimeout 클릭 우회로 해결
- React controlled input에 직접 `.value =` 할당 → 검색 버튼 disabled 유지 → `nativeInputValueSetter` + `input` 이벤트 dispatch로 해결

### 다음 액션
- `playwright.config.ts` baseURL + `.env.local` 연동 설정
- P0 시나리오 F 테스트 코드 먼저 구현 (시나리오 F-1, F-2, F-3)
- Anchor 팀에 `specs/data-dependencies.md` 공유 (staging 데이터 보존 요청)

---

## Session 2026-04-27 20:12 — 프로젝트 셋업 완료 (Playwright, playwright-skill, CONTEXT.md)

### 작업 요약
- `.env.local` 역할별 변수명 구조 설계 (`ANCHOR_EMAIL_<역할>` + `ANCHOR_PASSWORD`) — 사용자가 직접 적용
- `npx skills add testdino-hq/playwright-skill` 실행 → `.agents/skills/` 설치 확인 후 `.claude/skills/`에 수동 복사
- `context-init` 실행 → `CONTEXT.md` 초안 작성 (테스트 대상, 5개 계정, 시나리오 A-G, Playwright 구조)
- `playwright.config.ts`, `package.json` 존재 확인 → Playwright 이미 초기화됨 확인
- `.gitignore` Playwright/TypeScript 항목 추가 (`node_modules/`, `/test-results/` 등, `*.tsbuildinfo`)
- GitHub 리포 신규 생성 (`iskraworld/anchor-web-e2e`) 및 커밋/푸시 2회

### 다음 액션
- `playwright.config.ts`에 `baseURL` 및 `.env.local` 연동 설정
- 시나리오 A-G 테스트 코드 작성 시작

---

## Session 2026-04-27 20:00 — ahchor-web-e2e 프로젝트 AI 에이전트 하네스 초기화

### 작업 요약
- `harness-iskra` 템플릿 repo에서 `CLAUDE.md`, `settings.json` fetch 후 프로젝트에 신규 생성
- `CONTEXT.md`, `.harness/{state,worklog,backlog,decision}.md` 빈 템플릿 생성
- `.harness/archive`, `.harness/candidates/checked` 디렉토리 생성
- `.gitignore` 신규 생성
- `harness-doctor` 로 훅·글로벌 커맨드·API 키·Telegram·런치에이전트 등 시스템 상태 점검 실행

### 실패한 시도
- `worklog.md` 템플릿 repo에 없어 생성 스킵
