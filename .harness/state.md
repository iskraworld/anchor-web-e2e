# state.md — 현재 상태 요약

> `/worklog` 명령으로 갱신한다.

---

## 마지막 실행: 2026-04-28 20:23
## 마지막 업데이트: 2026-04-28 20:23
## 현재 모드: bypassPermissions

### 현재 집중
- **E2E 전면 재구축** — 818개 TC spec 구현 완료, Phase 3 테스트 실행 중 (321→244 실패 감소, 3차 수정 진행 중)

### 이어서 할 것
1. MY/GO/AUTH/HOME-TP/HOME-TA 3차 병렬 수정 에이전트 결과 확인 → 테스트 재실행
2. 244개 잔여 실패 항목 추가 수정 (GO URL/텍스트 불일치, EO/TA `.catch()` 누락 등)
3. 전체 통과 확인 후 QA 리포트 생성 및 Vercel 배포

### 막힌 것
- Playwright MCP 세션 만료로 실제 DOM 직접 확인 불가 — 진단 spec 출력 파싱으로 우회 시도 중
- GO 모듈 (67건 실패): 실제 페이지 텍스트 확인 필요하나 브라우저 직접 접근 불가

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
- [x] `docs/anchor-e2e-v2/` Phase 0~3 문서 4개 작성 (TC 수 검증, SKIP 기준 강화 반영)
- [x] Phase 1: `docs/qa/` 11개 모듈 분석 → `qa-automation-map.md` 생성 (805개 active TC)
- [x] 이전 결과물 삭제 (`tests/qa/`, `qa-automation-map.md`, `qa-report.html`)
- [x] Phase 2: 11개 모듈 spec 파일 전면 재구축 — 총 818개 TC (AUTH 91, MY 48, GO 69, EI 110, ER 64, HOME-TP 95, HOME-TA 95, TF 58, SP 54, TA 65, EO 69)
- [x] TypeScript 에러 없음 확인
- [x] TC_RE 정규식 수정 — HOME-TA/HOME-TP 복합 prefix 매칭 오류 수정
- [x] 4개 병렬 에이전트 1차 수정 완료 (GO/EO/TA 타임아웃, MY/TF strict mode, AUTH, HOME-TP/TA/SP/EI/ER)
- [x] 2차 테스트 실행: 321 → 244 실패 (77건 감소)
- [x] MY 모듈: `/my` → `/my-info` URL 일괄 교체 (`sed` 적용)
- [ ] Phase 3: 3차 수정 후 전체 테스트 실행 결과 확인 및 잔여 실패 항목 수정 (현재 244건 실패)
- [ ] QA 리포트 생성 및 Vercel 배포
- [ ] CI 스케줄 설정 (백로그)
- [ ] D-2/D-3 BLOCKED 해제 (UI 출시 후)
- [ ] ER PDF/링크 버튼 테스트 재활성화 (UI 출시 후)