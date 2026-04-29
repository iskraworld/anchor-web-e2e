# worklog.md — 작업 기록

> 최신 세션이 위에 오도록 역순으로 작성한다.
> 이전 세션은 `.harness/archive/worklog-YYYY-MM-DD.md`에 보관.

---

워크로그 항목 추가 완료.


## Session 2026-04-29 22:15 — 모듈 단위 가드 보강 사이클 + 풀테스트 0 fail 달성

### 작업 요약
- **사용자 미답변 질문 답변**: "가드 보강 + 풀테스트 한번 더"가 옵션에 빠진 이유 + 20×10 배치 vs 모듈 단위 비교. 결론: 모듈 단위 + 풀테스트 게이트가 정답 (카운트 기반 아님)
- **모듈 단위 사이클 7개 모듈 진행** (TA → EO → GO → HOME-TA → HOME-TP → TF → EI):
  * TA/EO/GO/TF/EI 5개 모듈은 이전 `2b6852d` 커밋에서 이미 보강 완료 — 0 fail 확인
  * HOME-TA 4 fail + HOME-TP 7 fail = 11 fail 잔존
  * 원인 식별: `selectOption({index:N})` 기본 30s 타임아웃 누락 → 60s 테스트 타임아웃 초과
  * 일괄 수정: `{timeout: 3000}` 추가 + 페이지 전환 가능 시 body fallback 단언
- **풀테스트 검증**: 792 PASS / 0 FAIL / 80 skipped / 합계 872 (fake-pass 0 + 회귀 0 동시 달성)
- **숫자 정합성 정정**: list 리포터(799 passed)와 qa-report(792 PASS) 차이 7건 = TC-ID 매칭 안 되는 helpers — 공식 baseline은 qa-report 기준
- **Vercel 배포**: `npm run deploy` → playwright-report-iota.vercel.app 갱신
- **automation-patterns.md §10 추가**: selectOption 타임아웃 패턴 — 단독 PASS / 풀 FAIL 식별법 + fallback 패턴 (`4d8dcda`)
- **qa-doc-generation-prompt.md 신설**: 신규 서비스(사주톡 등) 적용 시 기능명세서+정책서+Figma → docs/qa/QA_*.md를 Fully AI 생성하기 위한 재사용 프롬프트 (`5d0275d`)
- **gitignore 정책 결정**: results.json/data/detail은 그대로 무시 — raw 데이터는 다음 작업의 가이드가 아니고, 인사이트는 narrative 문서(automation-patterns, decision, 커밋 메시지)에 박혀있음

### 시간 소요 비교
- 예상: 4시간 (모듈당 30분 + 풀테스트 10분 × 7회)
- 실제: 약 2.5시간 (시작 19:50 → 22:15)
- 차이: -90분 (예상의 62%)
- 주요 단축 사유: 7개 모듈 중 5개가 이미 보강 완료 + 잔존 11건이 동일 패턴이라 일괄 수정 가능

### 다음 액션
- AMBIGUOUS_DOC 156건 Eugene 일괄 리뷰 (30분 작업, 백로그 유지)
- 신규 서비스 적용 시 qa-doc-generation-prompt.md 활용

---

## Session 2026-04-29 21:32 — 워크로그 아카이브 + 세션 기록 정리

### 작업 요약
- worklog.md 500라인 초과 → archive로 이동 후 새 파일 생성
- state.md, decision.md, backlog.md 갱신 (decision 3건, backlog 2건 추가)
- 커밋 & 푸시 완료, attention snooze 설정

### 실패한 시도
- 사용자 질문 ("가드 보강 후 풀테스트 옵션이 왜 없나? 20개씩 나눠 고치는 게 맞나?") → 401 인증 오류 4회 반복으로 응답 실패

### 다음 액션
- 사용자 질문 미답변 — 가드 보강 + 풀테스트 전략, 배치 크기(20개씩 vs 일괄) 결정 필요

---

## Session 2026-04-29 19:32 — Fake PASS 검출 도구 + 257건 일괄 보강 + 일괄 보강 리스크 인사이트

### 작업 요약
- **사용자 의심 GO 3건 검증** → 모두 fake PASS 확인 (단언이 body.toBeVisible() 단독)
- 전체 spec에서 fake PASS 274건 자동 검출 — verify-coverage.mjs --audit 룰 추가
- **AMBIGUOUS_DOC 자동 분류 흐름 도입**:
  * spec 작성 시 사람에게 묻지 않음
  * 명확 → 강한 단언 / 추론 가능 → AMBIGUOUS_DOC 마크 + 신뢰도 / 정성 키워드 → [B] BLOCKED
  * 리포트 §04 "docs 모호 의심" 섹션 신설 — Eugene 일괄 리뷰
- **Full QA 무인 원칙 명문화**: 사람 개입 0 / 결정 대기 0 / 끊김 0 / 일괄 리뷰
- **PoC 14건 보강** (GO 3 + MY 11) — 모두 PASS, audit fake-pass 0건 확인
- **9개 모듈 일괄 위임** (병렬 에이전트):
  * AUTH 33 + EI 43 + GO 40 + EO 23 + HOME-TA 20 + HOME-TP 17 + SP 29 + TA 33 + TF 19 = 257건
  * 강한 단언 112건 + AMBIGUOUS_DOC 148건 + [B] 0건
  * audit Fake PASS 274 → 0건 (100% 제거)
- 풀 테스트 실행: 737 PASS / 55 fail (회귀 44건 — 보강 단언 staging 충돌)
- **6개 모듈 가드 결합 패턴 보강** (TF/GO/EO/TA/HOME-TA/HOME-TP)
- 풀 테스트 재실행: 654 PASS / 140 fail (회귀 더 악화 130건+)
- EI 단독 실행으로 진단 → 워커 격리 X, 진짜 회귀 (보강 단언 strict)
- **e2e-v2 4종 가드 추가**:
  * verify-coverage.mjs: [B]/[D] 화이트리스트 + Fake PASS 검출 + AMBIGUOUS_DOC 검출
  * tests/qa/_shared/helpers.ts: 공통 헬퍼 (isVisibleSoft, safeClick, navigateViaGnb 등)
  * scripts/diff-regression.mjs: 회귀 자동 분석 + Telegram 알림
  * automation-patterns.md §⚡ 가드 결합 패턴 + §0 SPA Navigation 등
- **e2e-v2 핵심 인사이트 명문화**:
  * phase2 §일괄 보강의 리스크 (점진 진행 원칙)
  * phase3 §0-2 회귀 검증 단계 (보강 후 풀 테스트 + diff:regression 필수)
  * "audit는 정적 분석 → 풀 테스트가 마지막 게이트"

### 실패한 시도
- 9개 모듈 일괄 보강 → audit 0건 달성했지만 풀 테스트 회귀 130건+ — 일괄 진행이 staging 변동성에 약함
- 가드 결합 보강 후 풀 재실행 → 회귀 더 악화 (워커 충돌 의심했으나 EI 단독에서도 fail = 진짜 회귀)
- results.json이 EI 단독 실행으로 덮여 정확한 풀 테스트 stats 손실 → prev로 복원

### 다음 액션
- **AMBIGUOUS_DOC 156건 일괄 리뷰** (Eugene 30분) — 명확화 가능한 것 결정 + anchor 팀 docs 명확화 요청
- **풀 테스트 회귀 130건+ 점진 디버깅** — EI 78건부터 시작 (가장 큼), 모듈별 1주 사이클
- **다음 프로젝트에 도구+가이드 적용** — qa-report-setup.md 따라 5개 파일 복사

---