# decision.md — 의사결정 기록

> 대안 비교와 선택 이유가 있는 경우만 기록한다.
> 이전 기록은 `.harness/archive/decision-YYYY-MM-DD.md`에 보관.

---

## 2026-05-08: Tier 1 검증 방법 변경 — anchor-web-e2e 재실행 → fresh consumer simulation

- **선택**: 별도 워크스페이스에서 anchor 백엔드/프론트 fresh clone + e2e-framework-init + A-2/C-1 docs/checklist/e2e 처음부터 생성
- **대안 검토**:
  - A) anchor-web-e2e에서 새 TF QA 결과만 분석: 빠름. 단 doc 생성 prompt v4 효과만 측정 가능, framework consumer 워크플로 검증 불가
  - B) **fresh consumer journey simulation**: 4단계(framework 설치 / docs / checklist / e2e) 모두 검증 가능. 시간 더 걸림
- **선택 이유**:
  - 진짜 검증 목적은 "신서비스(anchor v2 등)가 framework 받았을 때 잘 되나?"
  - anchor-web-e2e는 이미 모든 artifact가 갖춰져있어 fresh consumer 시뮬레이션 안 됨
  - 시간 비용 < 검증 신뢰도 (신서비스 도입 readiness 직접 측정)
  - anchor-web-e2e는 source/baseline (797 PASS) 그대로 보존 — 오염 X
- **영향 범위**:
  - 별도 워크스페이스 생성 (예: `~/Downloads/coding/anchor-v2-test/`)
  - 새 Claude 세션에서 진행 (현 anchor-web-e2e 세션은 5/11 작업 트리거용으로 유지)
  - state.md "이어서 할 것" 변경: Tier 1 검증 방법 명시
- **되돌리는 방법**: 새 워크스페이스 삭제 + 원래 계획(A안)으로 복귀

---

## 2026-05-08: 정식 오픈 시 복구 체크리스트 = GitLab Issue (Source of truth)

- **선택**: GitLab terraform repo issue #1로 8개 항목 통합 추적 + tfvars 코멘트 보조 인덱스 + v4 문서 표
- **대안 검토**:
  - A) tfvars 코멘트만: 박정환 5/6 패턴. 단 grep 필요, 통합 뷰 없음
  - B) 별도 .md 파일 (예: project_prod_rightsizing_pending.md): 박정환 commit이 언급한 파일 — 실제로는 안 만듦
  - C) Notion 페이지: 통합 뷰 좋음. 단 코드 repo와 분리 → 누구도 안 봄
  - D) **GitLab Issue**: 코드 repo 내장, 박정환+Eugene 모두 보임, label/assignee/checkbox 추적 가능
- **선택 이유**: 코드와 같은 repo + 체크박스 native UI + 정식 오픈 시 reopen 자연스러움 + 외부 의존성 X. 보조 인덱스(tfvars 코멘트) 유지하면 누가 어디서 봐도 누락 안 됨
- **영향 범위**:
  - GitLab Issue [#1](https://gitlab.center.theanchor.best/tax/terraform/-/issues/1)
  - `docs/anchor-aws/gitlab-issue-prod-restore-checklist.md` (issue paste 가이드)
  - `docs/anchor-aws/work-guide-2026-05-11-v4.md` (체크리스트 표 + issue 링크)
  - `environments/prod/terraform.tfvars` (5/11 변경 코멘트에 "정식 오픈 시 복구" 포함)
- **되돌리는 방법**: Issue close 또는 삭제, 5/11 변경 git revert

---

## 2026-05-08: D-2/D-3 skip placeholder 제거 (smoke test baseline 단순화)

- **선택**: `test.skip('D-2', ...)` `test.skip('D-3', ...)` 빈 placeholder 2개 spec에서 제거 → 파일 상단에 보류 사유 주석만 유지
- **대안 검토**:
  - A) 현재 유지 (`test.skip` placeholder): 추적 신호 강함. 단 baseline에 "skipped == 2" 추가 → 미세하게 복잡
  - B) **완전 삭제**: 28 passed / 0 skipped / 0 failed 깔끔. state.md 백로그가 추적 담당
  - C) 별도 디렉토리 (tests/blocked/): 이동 비용. 활성화 시 복귀 필요
- **선택 이유**: state.md 백로그에 "D-2/D-3 BLOCKED 해제 (UI 출시 후)" 이미 기록 → 추적 손실 0. baseline이 단순할수록 auto abort 룰도 명확. UI 출시 시 spec 새로 작성하면 됨
- **영향 범위**: `tests/critical/team-scenarios/D-firm-capability.spec.ts`, v4 §11 baseline (`skipped == 0`)
- **되돌리는 방법**: UI 출시 시 D-2/D-3 spec 작성 + commit

---

## 2026-05-08: 작업 방식 CLI → Terraform IaC 전환 (v3) + Level 2 자동화 (write PAT)

- **선택**: v2(CLI) deprecated → v3(Terraform 기반) + Level 2 자동화 (Claude가 commit/push/apply, 사람은 confirm 게이트 3개 + 최종 merge 결정만)
- **대안 검토**:
  - A) v2(CLI) 유지: 직접 변경. 단 다음 `terraform apply` 때 drift 원복 — **명백히 잘못된 접근**
  - B) v3 + Level 1 (read-only PAT): Eugene이 commit/push/apply 모두 실행 (~7회 타이핑 + 3회 confirm). 안전하지만 인지 부하 큼
  - C) v3 + Level 2 (write PAT): Claude가 git 작업 + apply, Eugene 4회 결정만. 인지 부하 ↓ 권한 약간 ↑
- **선택 이유**:
  - 블래스트 반경 동일 — apply 주체가 Eugene이든 Claude든 AWS 영향 동일
  - AWS 권한은 안 늘어남 (Claude는 이미 anchor profile 사용 중)
  - 새 자격증명은 GitLab write PAT 1개 — git 작업만 가능, AWS 직접 영향 X
  - PAT 만료일 짧게 잡으면 자동 회수
  - 이전 패턴(CLI v2)에서 "롤백 가능 → AI 자동" 일관성 유지
  - Smoke test도 Playwright로 자동 (이 프로젝트의 본업)
- **영향 범위**:
  - `docs/anchor-aws/work-guide-2026-05-11.md`, `work-guide-2026-05-11-v2.md` → deprecated 경고 추가
  - `work-guide-2026-05-11-v3.md` 신규 작성 (Terraform 기반)
  - v4 = v3 + Level 2 자동화 (다음 세션 작성 예정)
  - `~/Downloads/coding/anchor-terraform` 로컬 클론
  - ~/.zshenv `ANCHOR_GITLAB_TOKEN` (write 포함 PAT)
- **되돌리는 방법**: PAT revoke 5초 → Claude 다시 read-only로 격하. v3는 deprecated 경고만 추가하면 v2 사용 가능 (단 drift 위험)

---

## 2026-05-08: ASG/Launch Template Phase 1에서 deferred (Phase 1.5로 분리)

- **선택**: ASG는 5/11 Phase 1에서 제외 → 별도 PR로 후속 작업
- **대안 검토**:
  - A) Phase 1에 포함 (terraform 새 모듈 추가): TF 코드 큰 변경, 신규 모듈 작성 + main.tf 와이어링 + 변수 정의 → 위험 ↑ 시간 ↑
  - B) Phase 1.5로 분리 (별도 PR): 다운사이징과 무관한 신규 기능. 베타 단계 사용자 폭증 가능성 낮음
- **선택 이유**: ASG는 사용자 폭증 대비용으로 다운사이징(비용 절감)과 목적이 다름. Phase 1 risk 최소화 + 시간 분리
- **영향 범위**: v3 §8 ASG 섹션 → deferred 표기. 후속 작업으로 신규 모듈(modules/asg) + main.tf 추가 필요
- **되돌리는 방법**: 5/11 작업 후 별도 PR로 ASG 모듈 추가하면 됨

---

## 2026-05-07: AWS 일괄 작업일 토요일 → 월요일 변경 + 봇 자율 단일 연속 블록

- **선택**: 2026-05-11 (월) 09:00 KST 시작, 봇 자율 블록 ~60~90분 단일 연속 실행 (점심 break 제거)
- **대안 검토**:
  - A) 토요일(5/9) 유지: 트래픽 0 + 사용자 영향 최소. 단 이슈 발생 시 사람 대응 인력 부족
  - B) 월요일(5/11) 09:00: 트래픽 발생 가능 + gw01 5분 다운타임 영향 가능. 단 전 팀 자리에서 즉시 대응 가능
  - C) 월요일 18:00 (퇴근 후): 트래픽 적음. 단 이슈 시 대응 인력 적음
- **선택 이유**: 베타 단계라 사용자 영향 미미 + 이슈 발생 시 대응 가능성이 트래픽 회피보다 가치 큼. 사용자 공지 없이 진행
- **영향 범위**: `docs/anchor-aws/work-guide-2026-05-11.md`, `work-guide-2026-05-11-v2.md`. Phase 2 일정 5/14 → 5/18, Phase 3 5/21 → 5/25
- **되돌리는 방법**: 일정 재조정 — IAM 권한 부여만 멈추면 작업 미실행. 가이드 문서는 git 이력으로 토요일 안 복원 가능

---

## 2026-05-07: 작업 가이드 v1 점검 후 v2 분리 (원본 보존)

- **선택**: `work-guide-2026-05-11.md` (v1) 보존 + `work-guide-2026-05-11-v2.md` 신규 생성 (점검 결과 반영)
- **대안 검토**:
  - A) v1 in-place 수정: 깔끔. 단 v1 점검 전후 비교 불가
  - B) v2 분리: 점검 결과(15개 우려사항 식별) 명시적으로 비교 가능. 단 두 파일 관리
- **선택 이유**: 사용자 요청 — "원 문서는 남기고 v2로". 점검 결과의 보강 내역을 명시적으로 비교 가능한 가치
- **영향 범위**: `docs/anchor-aws/work-guide-2026-05-11.md` (v1 원본), `work-guide-2026-05-11-v2.md` (v2 보강안)
- **되돌리는 방법**: v1을 그대로 사용하면 됨. v2는 단순 추가 파일이라 무시 가능

---

## 2026-05-07: 봇 자율 작업의 자동 abort 룰 도입 (RDS / was01·02 timeout)

- **선택**: 임계 초과 시 Claude 자동 롤백 + Telegram 알림 (사람 즉시 개입 불필요)
  - RDS: health 회복 > 3분 또는 5xx ≥1 지속 60초 → 자동 롤백
  - was01/02: healthy 300초 timeout + stable 60초 미달성 → 자동 일시중지 + 알림
- **대안 검토**:
  - A) 사람 모니터링 (v0): 사람이 콘솔 보면서 판단. 정확도 ↑ 단 30~90분 자리 묶임
  - B) 자동 abort 룰: 명확한 임계로 즉시 롤백. 단 정성 신호(사용자 채널 보고) 못 잡음
  - C) 하이브리드: 자동 룰 + 사람 정성 백업 (단독 Eugene 자리 지킴)
- **선택 이유**: 정량 임계는 봇이 사람보다 빠르고 정확. 정성 신호는 어차피 사용자 채널을 통해 사람한테 들어옴 → 사람의 정성 판단만 남기고 정량은 봇으로
- **영향 범위**: 작업 가이드 §6 RDS, §7 was01/02 섹션
- **되돌리는 방법**: 임계 룰 비활성화 + 사람 모니터링 패턴 복원

---
