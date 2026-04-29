# worklog.md — 작업 기록

> 최신 세션이 위에 오도록 역순으로 작성한다.
> 이전 세션은 `.harness/archive/worklog-YYYY-MM-DD.md`에 보관.

---

워크로그 항목 추가 완료.


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