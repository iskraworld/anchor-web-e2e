# state.md — 현재 상태 요약

> `/worklog` 명령으로 갱신한다.

---

## 마지막 실행: 2026-05-11 13:20
## 마지막 업데이트: 2026-05-11 13:20
## 현재 모드: bypassPermissions

### 현재 집중
- **5/11 AWS 다운사이즈 완료** — -$343/월 절감 / 28 smoke pass / main merge / dev-tax-pub01 OOM 회귀 r5.large 롤백으로 해소

### 이어서 할 것
1. (Eugene 5/12 화) 간이 메트릭 확인 — §13 cron 셋업 보류 결정, 화요일 한 번 직접 확인
2. (~1주 후, 5/18 경) Neo4j 다운사이즈 검토 — 메모리 데이터 분석 + sizing 권고 후 진행
3. (~2주 후, 5/25 경) Savings Plan 약정 검토

### 막힌 것
- 없음

### 사람 판단 필요
- 5/12 화요일 간이 모니터링 (메트릭 한 번 확인)
- (1주 후) Neo4j 다운사이즈 결정
- (2주 후) Savings Plan 약정 결정
- (정식 오픈 시) GitLab Issue #1 복구 체크리스트 8개 + 인프라 1 (alb-neo4j01)
- (선택) dev-tax-pub01 에 EIP 할당 별도 PR — 매 재기동 .env.local 갱신 부담 제거 (현재 IP `3.38.210.124`)
- (오늘~6/7) ANCHOR_GITLAB_TOKEN revoke 또는 자동 만료
- (오늘~) `claude-cost-readonly` 의 인라인 정책 (`anchor-rightsize-2026-05-11` + `anchor-ssm-diagnostic-2026-05-11` + SG 액션) 회수 — 1주 한정 임시 정책
- Tier 1 검증 시작 시점 (별도 워크스페이스)
- D-2/D-3 BLOCKED 해제 (Anchor 팀 UI 출시 후)
- ER PDF/링크 버튼 테스트 재활성화 (UI 출시 후)

### 백로그 요약
- 대기 중: 7개
- 최근 추가: 2026-05-11 — alb-neo4j01 미사용 ALB 삭제 (비가역성 우려 보류)

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
- [x] AWS 비용 최적화 분석 v1~v3 (CPU 평균 → burst → CPU credits + IOPS) ✅ 2026-05-07
- [x] CloudWatch Agent 8개 인스턴스 설치 (Hybrid 권한 분담) ✅ 2026-05-07
- [x] 의사결정 보고서 v1~v5 (capacity 17–20k 정정 + 일정 간소화) ✅ 2026-05-07
- [x] e2e-framework 별도 repo 생성 (~/Downloads/coding/e2e-framework/) ✅ 2026-05-07
- [x] 토요일 작업 가이드 v1 (사람만) ✅ 2026-05-07
- [x] 작업 가이드 v2 (사람/Claude 분담 + 권한 부여 패턴) ✅ 2026-05-07
- [x] 개발팀 공지 dev-team-notice (변경 내역 + 측정 근거 + FAQ) ✅ 2026-05-07
- [x] Tier 1 시퀀스 정리 — anchor source 유지 + third-party validation 트랙 분리 ✅ 2026-05-07
- [x] AWS 작업일 토요일 → 월요일 변경 + 봇 자율 단일 연속 블록 ✅ 2026-05-07
- [x] 월요일 작업 가이드 v1 → v2 점검 보강 ✅ 2026-05-07
- [x] 일요일 모니터링 → 화요일 자율 cron ✅ 2026-05-07
- [x] RDS / was01·02 자동 abort 룰 도입 ✅ 2026-05-07
- [x] AWS CLI 직접 조회로 8 인스턴스 / AMI / SG / Subnet / TG ARN 매핑 ✅ 2026-05-07
- [x] Terraform IaC 발견 → v2(CLI) deprecated ✅ 2026-05-08
- [x] GitLab terraform repo 클론 + 분석 ✅ 2026-05-08
- [x] 박정환 5/6 commit `b32b590` 패턴 답습 ✅ 2026-05-08
- [x] v3 작성 (Terraform 기반) ✅ 2026-05-08
- [x] Level 2 자동화 결정 (write PAT 추가) ✅ 2026-05-08
- [x] ~/.zshenv 토큰 정리 + write PAT 등록 + 검증 ✅ 2026-05-08
- [x] v4 작성 (Terraform + Level 2 자동화, Eugene 4회 결정) ✅ 2026-05-08
- [x] 정식 오픈 시 복구 체크리스트 — 8개 항목 식별 + GitLab Issue #1 생성 ✅ 2026-05-08
- [x] Smoke test 사전 검증 (28 passed / 0 failed / 17.1초) ✅ 2026-05-08
- [x] D-2/D-3 skip placeholder 제거 — baseline 단순화 ✅ 2026-05-08
- [x] v4 §11 Smoke test baseline + auto abort 룰 명시 ✅ 2026-05-08
- [x] worklog.md, state.md, decision.md 업데이트 ✅ 2026-05-08
- [x] Tier 1 검증 방법 변경 — fresh consumer simulation 방향 결정 ✅ 2026-05-08
- [x] v4 3-iteration 리뷰 (AWS read-only + 모범 사례) — 21건 오류 수정, Critical 4건 사전 차단 ✅ 2026-05-10
- [x] 5/11 AWS 다운사이즈 실행: §0~§10 적용 + §12 main merge (28/28 smoke pass) ✅ 2026-05-11
- [x] dev-tax-pub01 OOM 회귀 진단 + r5.large 롤백 (Neo4j RestartCount 1121 → 0) ✅ 2026-05-11
- [x] 인프라 prerequisite 해결 (terraform 설치, secrets.tfvars, IAM 인라인 정책, GitLab Maintainer + PAT api scope) ✅ 2026-05-11
- [x] alb-neo4j01 삭제 보류 → 백로그 등재 ✅ 2026-05-11
- [ ] (5/12) 화요일 간이 메트릭 확인
- [ ] (5/18 경) Neo4j 다운사이즈 결정
- [ ] (5/25 경) Savings Plan 약정 결정
- [ ] (정식 오픈 시) GitLab Issue #1 복구 체크리스트 9개 항목
- [ ] (정리) 인라인 정책 + Maintainer 권한 + PAT 회수
