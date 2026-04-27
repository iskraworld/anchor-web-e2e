# worklog.md — 작업 기록

> 최신 세션이 위에 오도록 역순으로 작성한다.

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
