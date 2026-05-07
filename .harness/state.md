# state.md — 현재 상태 요약

> `/worklog` 명령으로 갱신한다.

---

## 마지막 실행: 2026-05-07 08:44
## 마지막 업데이트: 2026-05-07 08:44
## 현재 모드: bypassPermissions

### 현재 집중
- **v4 prompt white-box 검증 실험 설계** — anchor 자체 데이터로 변수 격리 검증. Tier 1 (TF 모듈 QA 재생성)부터 시작. 사전 확인 2개 답변 대기 중.

### 이어서 할 것
1. 사용자 답변 대기: (a) 기획명세서/정책서/Figma 전달 가능 여부 + 형태 (b) 현재 v1 docs가 원본 입력 기반인지
2. 답변 확정 시 — TF 모듈 Tier 1 시작 (QA docs 재생성 + AMBIGUOUS_DOC 비교만)
3. Tier 1 통과 시 — Tier 2 (spec 재생성 + e2e 비교)

### 막힌 것
- **자료 접근성 미확인**: anchor 기획명세서/정책서/Figma를 Claude가 받을 수 있는 형태인지 미확인 — 사용자 답변 필요
- **HOME staging BLOCKED 11건**: 소속 드롭다운 검색 API 500 — staging 회복 시 재테스트
- **HOME-TA GNB flakiness**: 풀테스트에서 가끔 fail, 단독 실행은 정상

### 사람 판단 필요
- (1) 기획명세서/정책서/Figma 전달 가능 여부 + 어떤 형태로 (Notion / PDF / Figma export)
- (2) 현재 anchor v1 docs/qa/*.md는 anchor 팀 원본 입력 기반인지 vs v1 prompt 출력인지
- Tier 1 검증 결과에 따라 anchor v2 진입 readiness 결정
- D-2/D-3 BLOCKED 해제 (Anchor 팀 UI 출시 후)
- ER PDF/링크 버튼 테스트 재활성화 (UI 출시 후)

### 백로그 요약
- 대기 중: 4개
- 최근 추가: 2026-05-06 — AMBIGUOUS_DOC 154건 근본 해결 (프롬프트 v4)

### 진행 상황
- [x] Phase 0~3 e2e-v2 가이드 완성
- [x] 11개 모듈 spec 전면 재구축 (818 TC → 최종 872 TC)
- [x] 244 fail → 0 unintentional fail
- [x] QA 리포트 디자인 재작성 + Vercel 배포
- [x] qa-report.config.mjs로 다중 프로젝트 재사용 설계
- [x] [B] BLOCKED 카테고리 신설
- [x] verify-coverage.mjs --audit — fake-pass + AMBIGUOUS_DOC + VERIFY 정합성 + navigation shortcut
- [x] tests/qa/_shared/helpers.ts — 공통 헬퍼 강제화
- [x] phase 2.0 PoC + phase 3.0 진단 spec
- [x] AMBIGUOUS_DOC 자동 분류 흐름 — Full QA 무인 원칙
- [x] 9개 모듈 일괄 보강 257건 — audit Fake PASS 274 → 0건
- [x] HOME-TA/HOME-TP selectOption 타임아웃 가드 보강 ✅ 2026-04-29
- [x] automation-patterns.md §10 selectOption 타임아웃 패턴 ✅ 2026-04-29
- [x] qa-doc-generation-prompt.md 신설 ✅ 2026-04-29
- [x] phase2-code-generation.md §VERIFY 컨벤션 + 10 표준 키워드 ✅ 2026-04-30
- [x] verify-coverage.mjs --audit VERIFY 정합성 룰 ✅ 2026-04-30
- [x] 11모듈 53건 VERIFY 적용 ✅ 2026-04-30
- [x] scripts/sample-verify.mjs 신설 — 위험 점수 기반 스마트 샘플링 ✅ 2026-04-30
- [x] 검증자 1차 (5건 SP): 5/5 Y ✅ 2026-04-30
- [x] 검증자 2차 (15건 8모듈): 4Y / 9N / 2NA → framework v2 신설 ✅ 2026-05-02
- [x] automation-patterns §11 (action chain) + §12 (사용자 동작) ✅ 2026-05-02
- [x] qa-doc-generation-prompt §[7][8][9] 보강 ✅ 2026-05-02
- [x] verify-coverage.mjs navigation shortcut 휴리스틱 ✅ 2026-05-02
- [x] 9건 N 코드 fix + 2건 NA test.skip([B]) ✅ 2026-05-02
- [x] 검증자 3차 (15건): 12Y / 3N / 0NA → framework v3 신설 ✅ 2026-05-05
- [x] MY-1-12 5단계 fix + EI-0-06 외 5건 openGnb() fix ✅ 2026-05-05
- [x] automation-patterns §13 (닫힌 메뉴 활성화) ✅ 2026-05-05
- [x] 풀테스트 797 PASS / 0 FAIL 유지 (3 사이클 일관) ✅ 2026-05-05
- [x] sample-verify.mjs `--exclude-from` / `--exclude-ids` 옵션 ✅ 2026-05-05
- [x] Cycle 4 샘플 생성 (Cycle 2/3 14 ID 제외, 0% 중복) ✅ 2026-05-05
- [x] 검증자 4차 (15건): 14Y / 1N / 0NA = N율 6.7% ✅ 2026-05-06
- [x] TF-1-07 fix — 임의 키워드 → 실 멤버 이름 5단계 검증 ✅ 2026-05-06
- [x] 풀테스트 797 PASS / 0 FAIL 유지 (4 사이클 일관) ✅ 2026-05-06
- [x] 검증 사이클 종료 — framework v3.1 정착 선언 ✅ 2026-05-06
- [x] qa-doc-generation-prompt.md → v4 보강 (5가지 정량 룰 [10]~[14] 차단) ✅ 2026-05-06
- [x] qa-doc-generation-prompt.md 상단 버전 표시 + 이력 표 추가 ✅ 2026-05-07
- [x] v4 white-box 검증 실험 설계 — 3 Tier 점진 + TF 모듈 추천 ✅ 2026-05-07
- [ ] (사전 확인) 기획명세서/정책서/Figma 전달 가능 형태 + v1 docs 원본 여부
- [ ] Tier 1: TF 모듈 QA docs v4 재생성 + AMBIGUOUS_DOC 비교 (목표 13 → ≤4)
- [ ] Tier 2: TF 모듈 spec 재생성 + e2e 비교 (PASS / fake-pass / audit)
- [ ] Tier 3: 11모듈 전체 v4 적용 + anchor v2 진입 readiness
- [ ] 신서비스(anchor v2 등) 적용 시작 — framework v3.1 + prompt v4 활용
- [ ] HOME staging BLOCKED 11건 재테스트 (staging 회복 후)
- [ ] D-2/D-3 BLOCKED 해제 (UI 출시 후)
- [ ] ER PDF/링크 버튼 테스트 재활성화 (UI 출시 후)
