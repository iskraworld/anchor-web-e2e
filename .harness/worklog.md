# worklog.md — 작업 기록

> 최신 세션이 위에 오도록 역순으로 작성한다.

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
