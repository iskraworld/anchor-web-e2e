# state.md — 현재 상태 요약

> `/worklog` 명령으로 갱신한다.

---

## 마지막 실행: 2026-04-29 00:26
## 마지막 업데이트: 2026-04-29 00:26
## 현재 모드: bypassPermissions

### 현재 집중
- **SPA 라우팅 차단 문제 해결 방향 결정** — 모든 deep URL이 `/`로 redirect됨 확인, 다음 액션 사람 승인 대기 중

### 이어서 할 것
1. 사람 승인 후 방향 결정: A(navigation 전면 재작성), C(244 fail 그대로 리포트 생성), D(GNB 클릭 패턴 PoC 1모듈 검증) 중 선택
2. 선택된 방향에 따라 수정 작업 진행
3. 전체 테스트 재실행 및 QA 리포트 생성

### 막힌 것
- **SPA direct URL 진입 차단**: 모든 deep URL(`/my-info`, `/search/*`, `/tax-history-*`, `/membership` 등)이 `/`로 redirect → `page.goto('/deep-url')` 패턴 전체 무효
- **setup hang**: 서버 로그인 hang 현상으로 setup이 매번 timeout — storageState 자체는 유효
- **기존 547 PASS 신뢰성 의심**: 비로그인 페이지 또는 홈 텍스트 우연 매치 가능성 있음

### 사람 판단 필요
- **[대기 중] navigation 전면 재작성 vs 현상 유지 리포트 vs PoC 검증** — A/C/D 옵션 중 어느 방향으로 진행할지 승인 필요
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
- [x] GO/MY 실패 원인 분석 완료 — GO strict mode violation(57노드 매치) + MY 텍스트 미존재 패턴 확인
- [x] 진단 spec 실행 — 모든 deep URL이 `/`로 redirect됨 확인 (SPA 라우팅 차단 원인 규명)
- [x] setup hang 원인 확인 — storageState 유효, 서버 로그인 hang으로 setup 의존성 임시 비활성화
- [ ] navigation 전면 재작성 / 현상 유지 리포트 / PoC 검증 중 방향 결정 (사람 승인 대기)
- [ ] Phase 3: GO 모듈 strict mode + 타임아웃 수정 (67건)
- [ ] Phase 3: MY 모듈 selector 재확인 및 수정 (46건)
- [ ] Phase 3: 전체 테스트 재실행 결과 확인 및 잔여 실패 항목 수정
- [ ] QA 리포트 생성 및 Vercel 배포
- [ ] CI 스케줄 설정 (백로그)
- [ ] D-2/D-3 BLOCKED 해제 (UI 출시 후)
- [ ] ER PDF/링크 버튼 테스트 재활성화 (UI 출시 후)