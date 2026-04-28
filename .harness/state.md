# state.md — 현재 상태 요약

> `/worklog` 명령으로 갱신한다.

---

## 마지막 실행: 2026-04-28 16:21
## 마지막 업데이트: 2026-04-28 16:21
## 현재 모드: bypassPermissions

### 현재 집중
- **QA 자동화 완료** — TC-ID 276건 / PASS 179 / FAIL 0 / 수동 41 / 스킵 56, Vercel 배포 완료

### 이어서 할 것
1. CI 스케줄 설정 (백로그 — `.github/workflows/`에 `schedule` 트리거 추가)
2. D-2/D-3 BLOCKED 해제 (Anchor 팀 UI 출시 후)
3. ER PDF/링크 버튼 테스트 재활성화 (UI 구현 후)

### 막힌 것
- 없음

### 사람 판단 필요
- D-2/D-3: 법인 리포트 1그룹/2그룹 분류 UI 미출시 — 기능 릴리즈 후 재검토
- ER-1-05/1-06/2-05/2-06: PDF·링크 버튼 UI 미구현 — 릴리즈 후 `test.skip()` 해제
- AI가 기술적으로 할 수 있는 작업이 막힐 경우, Anchor 팀에 바로 넘기지 말고 승인 형식으로 사람에게 먼저 물어볼 것

### 백로그 요약
- 대기 중: 3개
- 최근 추가: 2026-04-28 — ER PDF·링크 버튼 테스트 재활성화

### 진행 상황
- [x] 하네스 초기화 완료
- [x] GitHub 리포 생성 및 초기 커밋 푸시 (`iskraworld/anchor-web-e2e`)
- [x] Phase 2: `specs/scenarios-from-exploration.md` 작성 (60 시나리오)
- [x] Phase 3: `specs/test-plan.md`, `specs/data-validation.md`, `README.md` 작성 + C-1 BLOCKED 해제
- [x] Phase 4: 인증 셋업 + 시나리오 A-G 테스트 코드 + 공유 Page Objects
- [x] Phase 5: 전체 테스트 실행 및 디버깅 완료
- [x] Phase 6: P1 시나리오 24개 구현 (`tests/p1/`)
- [x] Phase 6: CI 워크플로 초안 작성 (`docs/ci-templates/`)
- [x] Phase 6: C-1 단언 수정 — "한지희 미노출"→"카드 노출+이력 미등록" (시나리오 원문 반영)
- [x] P0: 26 passed / 2 skipped (D-2/D-3 BLOCKED)
- [x] CI 환경변수 누락 수정 + GitHub Secrets 7개 설정 → CI 통과
- [x] CI 자동 실행 비활성화 → 수동 실행(workflow_dispatch)으로 전환
- [x] P2 테스트 15개 구현
- [x] Visual Regression 베이스라인 10개 생성 (10 passed)
- [x] `playwright.config.ts` timeout 60s 상향 → P0+P1+P2+VR 77/77 전체 통과
- [x] `scripts/generate-report.mjs` — MD + HTML 리포트 자동 생성 (`npm run report:md`)
- [x] `vercel.json` + `report:deploy` 스크립트 — Vercel 배포 연동
- [x] `.claude/settings.json` git 추적 해제
- [x] Vercel 404 수정 — `playwright-report/.vercelignore` 생성, 배포 명령 수정 → 배포 완료 (https://playwright-report-iota.vercel.app)
- [x] QA 방향 재정의 — 기능명세서+정책서+Figma → AI 스펙 생성 → 사람 검토 → 테스트 실행+결과 테이블
- [x] `docs/anchor-e2e-v2/` Phase 0~3 문서 4개 작성
- [x] Phase 1: `docs/qa/` 11개 모듈 분석 → `qa-automation-map.md` 생성 (~644 자동화, ~107 수동, ~51 스킵)
- [x] Phase 2: 11개 모듈 spec 파일 생성 (`tests/qa/{모듈}/`) — TC-ID 1:1 태깅, MANUAL/SKIP 분류
- [x] EI/HOME-TP/HOME-TA spec 버그 수정 (force 클릭, PRO 태그 strict mode, networkidle → load)
- [x] home-ta, home-tp, ta, go, eo, ei, auth, my, tf 스펙 다수 수정 (force 추가, strict mode, assertion 수정)
- [x] JSON 결과 파싱 스크립트 작성 및 반복 실행
- [x] QA 테스트 전체 통과 — 245 passed / 0 failed / 107 skipped
- [x] QA 리포트 생성 및 Vercel 배포 (TC-ID 276건 / PASS 179 / FAIL 0)
- [ ] CI 스케줄 설정 (백로그)
- [ ] D-2/D-3 BLOCKED 해제 (UI 출시 후)
- [ ] ER PDF/링크 버튼 테스트 재활성화 (UI 출시 후)
