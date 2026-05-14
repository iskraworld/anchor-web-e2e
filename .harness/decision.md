# decision.md — 의사결정 기록

> 대안 비교와 선택 이유가 있는 경우만 기록한다.
> 이전 기록은 `.harness/archive/decision-YYYY-MM-DD.md`에 보관.

---

## 2026-05-14: EIP 할당 영구 드롭

- **선택**: EIP 할당 제거 및 인벤토리에서 삭제
- **대안 검토**: 
  - EIP 유지 후 재평가: 추가 비용 지속, 인벤토리 복잡도 증가
  - 단기 비활성화: 드롭과 동일한 비용 절감 없음
- **선택 이유**: 현재 워크로드에 고정 IP 필요 없음, 비용($.05/시간) 대비 운영 오버헤드 부담
- **영향 범위**: AWS 인프라(EIP 설정 제거), 비용 추적 문서, 인벤토리 분석 프로세스
- **되돌리는 방법**: AWS 콘솔에서 새 EIP 할당 후 인스턴스에 재연결 (필요 시)


## 2026-05-14: dev-tax-pub01 EIP 할당 드롭 — 사용처 없음

- **선택**: eugene-followups "dev-tax-pub01 EIP 할당" 항목을 **영구 드롭** (재검토 보류 아님)
- **대안 검토**:
  - A) 신규 EIP 할당 + dev-tax-pub01 attach — 안정 IP 확보
  - B) 기존 unattached EIP 재사용 — (조사 결과 unattached 가 없음, 7개 모두 ALB/NAT 사용 중이었음)
  - C) **할당 안 함** (선택)
- **선택 이유**:
  - dev-tax-pub01 IP 직접 접속 사용처 없음 — 운영/개발 모두 도메인 또는 내부망 경로로 접근
  - 2024년 AWS 가격 변경으로 auto-assigned IPv4 도 EIP 와 동일하게 $3.6/월 과금 → 비용 무차이
  - 안정성 이득(IP 변경 빈도 0) 의 실효가 사용처 없으니 무의미
  - EIP 부여 시 신규 IP 로 바뀌어 `.env.local` / CONTEXT.md / 개발팀 공지 부담만 발생
- **영향 범위**: 변경 없음. 향후 dev-tax-pub01 재기동 시 public IP 가 또 바뀔 수 있음 — 그때 또 한 번 갱신
- **되돌리는 방법**: 향후 외부 IP allowlist / 모니터링 등 IP 고정 요구사항 발생 시 재검토. Console 에서 EIP allocate + associate 1분 작업

---

## 2026-05-12: WAS heap 설정 표준화 드롭 — 필요성 없음

- **선택**: eugene-followups 의 "WAS heap 표준화" 항목을 작업하지 않고 **드롭**
- **대안 검토**:
  - A) 백엔드 repo Dockerfile/배포 스크립트에 코멘트 추가 (문서) — 30분, 0 위험
  - B) `-Xmx` 하드코딩 제거 → `-XX:MaxRAMPercentage=50.0` 자동화 — 1~2시간, smoke test 검증 필요
  - C) **드롭** (선택)
- **선택 이유**:
  - 5/11 회귀의 진짜 원인은 **dev-tax-pub01 Neo4j 메모리** 였고 WAS heap 아니었음 (회고 오해석)
  - 현재 prod WAS `-Xms1G -Xmx1G` (t3.small 2GB) / dev WAS `-Xms1G -Xmx2G` 모두 잘 작동 중
  - 향후 WAS 인스턴스 사이즈 변경 시의 위험은 이미 만든 [[다운사이즈 사전 체크리스트]] §1 (메모리 차원 P95/P99/swap) + §2 (컨테이너 호스트 docker stats) 가 검출함
  - 안 읽을 문서 추가는 노이즈
- **영향 범위**: 백엔드 repo 의 Dockerfile/배포 스크립트/runbook 변경 없음
- **되돌리는 방법**: 향후 WAS 메모리 관련 장애 발생 시 재검토. 다운사이즈 사전 체크리스트 적용으로 막아지는 한 불필요

---

## 2026-05-12: IAM 권한 회수 타이밍 — 5/20 일괄 (Neo4j 작업 종료 후)

- **선택**: claude-cost-readonly 인라인 정책 + GitLab Maintainer 권한을 **5/20 경 일괄 revoke** (Neo4j 5/18 작업 + 1~2일 안정성 확인 후)
- **대안 검토**:
  - A) 5/12 작업 종료 후 즉시 revoke + 5/18 Neo4j 작업 시 재부여 — 0일 elevated, IAM Console 작업 2회
  - B) **5/20 일괄 revoke** (선택) — 8일 elevated, IAM Console 작업 1회
  - C) 베타→정식 전환까지 유지 — 수주 elevated, 작업 1회 (너무 길다)
- **선택 이유**:
  - 기존 정책 (`anchor-rightsize-2026-05-11`) 의 EC2 modify 권한이 5/18 Neo4j 다운사이즈에 그대로 재활용됨 → 추가 부여 불필요
  - claude-cost-readonly 자격증명은 Eugene 로컬 `~/.aws/credentials` 외 노출 없고 자동화/CI 사용 없음 → 8일 elevated 실제 위험 매우 낮음
  - Eugene 의 IAM Console 작업 부담 최소화
- **추가 조치 (5/12 19시 트림)**:
  - 5/12 작업 직후 정책을 Neo4j 5/18 최소 권한으로 트림 (ALB delete / ElastiCache modify / SG / CloudWatch 제거)
  - EC2 modify 를 Neo4j 인스턴스 ARN(`i-003db424b45f31fea`) 단일 리소스로 제한
  - blast radius: anchor 계정 전체 → Neo4j 1대 + Terraform state 로 축소
- **영향 범위**: IAM Console (`claude-cost-readonly` 인라인 정책), GitLab Maintainer (Eugene), ANCHOR_GITLAB_TOKEN (자동 만료 2026-06-07)
- **되돌리는 방법**: 권한 부족 발생 시 IAM Console 에서 같은 JSON 재부여 (eugene-followups 에 JSON 보존되어 있음)

---

## 2026-05-12: 5/12 야간 묶음 작업 — 1시간 간격 규칙 절충 (smoke test 매 단계 검증)

- **선택**: ElastiCache micro + ALB 삭제를 **단일 terraform apply 묶음**으로 진행, 단 변경마다 smoke test 검증
- **대안 검토**:
  - A) 다운사이즈 체크리스트 §4 원칙대로 변경 1개씩 + 1시간 간격 — 안전, 시간 ~2시간
  - B) **묶음 apply + 매 단계 smoke** (선택) — 빠름, 시간 ~30분, 회귀 시 역순 롤백
- **선택 이유**:
  - ALB 삭제는 unused HTTP UI 라우팅 제거 (서비스 데이터 경로 무관) → "다운사이즈" 카테고리 아님, 회귀 가능성 매우 낮음
  - ElastiCache micro 는 사전 체크 7/7 통과 + 5/11 1차 시도에서 회귀 무관 데이터로 입증됨
  - 두 변경의 영향 경로가 독립적 → 회귀 시 어느 쪽이 원인인지 격리 가능
  - 베타 단계 야간 작업 시간 단축 우선
- **결과 검증**:
  - Baseline (small + ALB): 19.1초 / 28 PASS
  - Redis modifying 중 (small 유지): 19.3초 / 28 PASS
  - Redis micro 완료 후: 19.4초 / 28 PASS
  - ALB 삭제 후 최종: 19.6초 / 28 PASS
  - 모든 단계 0 회귀
- **영향 범위**: 프로덕션 AWS — ElastiCache 1개 modify + ALB 5 리소스 destroy
- **되돌리는 방법**: 회귀 발생 시 (1) ALB 가 원인이면 tfvars 4줄 복원 + 재생성 ~3분 / (2) ElastiCache 가 원인이면 micro→small 복원 — 사전 정의된 롤백 트리거 발동 안 함

---

## 2026-05-11: dev-tax-pub01 r5.large 롤백 — OOM 발견 후 메모리 우선 인스턴스 선택

- **선택**: dev-tax-pub01 을 `t3.medium` → **`r5.large`** (16GB RAM / 2 vCPU / ~$93/월)
- **대안 검토**:
  - **A. `c6i.2xlarge` 원복** (16GB / 8 vCPU / ~$278/월) — 가장 보수적, 절감 효과 0
  - **B. `r5.large`** (16GB / 2 vCPU / ~$93/월) — 메모리 동일, vCPU 절반, 비용 1/3
  - **C. `t3.xlarge`** (16GB / 4 vCPU / ~$130/월) — 중간선
  - **D. `t3.large`** (8GB / 2 vCPU / ~$73/월) — 메모리 절반, OOM 마진 작음
- **선택 이유**:
  - SSM dmesg 로그상 OOM Killer 가 Neo4j JVM(UID 7474) 사살 → `anchor-neo4j` RestartCount 1121회
  - dev-tax-pub01 = all-in-one 개발 스택 (frontend + WAS + MySQL + Redis + Neo4j) 합산 ~4GB 초과
  - 메모리만 회복하면 충분 — vCPU 는 dev 환경 트래픽 작음, 8 vCPU 불필요
  - r5 패밀리 = 메모리 최적화 (vCPU 당 RAM 8GB), 동일 가격대 t3.xlarge 보다 메모리 효율 좋음
  - 비용 -$185/월 절감 (c6i.2xlarge $278 → r5.large $93)
- **영향 범위**:
  - AWS: dev-tax-pub01 인스턴스 (i-06d86c8ca634e43be)
  - public IP 변경: `43.203.247.213` → `3.38.210.124`
  - `.env.local` ANCHOR_BASE_URL Eugene 수동 갱신
  - terraform 미관리 (TF 외부) — IaC 추적 없음
- **되돌리는 방법**:
  - stop → modify-instance-attribute (원래 c6i.2xlarge 또는 다른 타입) → start → .env.local IP 갱신
  - 추후 dev-tax-pub01 IaC 화 시 tfvars 에 등재 권고

## 2026-05-11: §9 alb-neo4j01 삭제 보류 — 비가역성 우선 (백로그 등재)

- **선택**: 5/11 작업에서 ALB 삭제 **보류**, 백로그 등재 (-$16/월 절감 포기)
- **대안 검토**:
  - **A. 가이드대로 삭제** (terraform apply 4 destroy) — $16/월 절감, 재생성 비가역적 ~3분
  - **B. 보류 + 백로그** (이번 결정) — 절감 0, 미사용 자원 그대로 유지
  - **C. -target 으로 다른 변경만 진행** (가이드 우회) — 동일 effect, 명시성 떨어짐
- **선택 이유**:
  - Eugene 판단: "비용 크지 않으면 비가역적이니 백로그에 두고 나중에 삭제"
  - 절감액 작음 ($16/월) vs 재생성 비용·시간 트레이드오프
  - 30일 RequestCount = 0 확인되긴 했지만 향후 Neo4j HTTP UI 외부 접근 영구 불필요 확신 부족
  - 정식 오픈 결정 시점에 함께 재검토 가능
- **영향 범위**:
  - terraform.tfvars (load_balancers/lb_listeners/target_groups) — 변경 안 함
  - AWS 자원 (alb-neo4j01, neo4j-http-tg, neo4j-https 리스너) — 유지
- **되돌리는 방법**: backlog.md `2026-05-11: alb-neo4j01 미사용 ALB 삭제` 항목 → 가이드 §9 그대로 진행

## 2026-05-11: §4/§6 ElastiCache·RDS modify 호출 — AWS CLI 직접 우회

- **선택**: terraform apply 결과가 "modify 완료" 라고 보고하지만 실제 AWS 변경 없을 때 → **AWS CLI 로 `modify-replication-group --apply-immediately` / `modify-db-instance --apply-immediately` 직접 호출**로 우회
- **대안 검토**:
  - **A. terraform 모듈 패치** (apply_immediately=true, 또는 force_destroy 옵션 추가) — 정도, but 모듈 변경은 다른 환경 영향
  - **B. AWS CLI 직접 호출** (이번 결정) — 한 번만 우회, 모듈 손대지 않음
  - **C. terraform `taint` 후 재apply** — overkill, replace 가 됨
- **선택 이유**:
  - terraform-provider-aws 의 modify 호출 idempotent 처리 이슈 (state 만 보고 diff 없다고 판단해 호출 안 함)
  - 5/11 작업 시급성 + 모듈 변경 위험 회피
  - AWS CLI 호출 후에도 terraform state 가 동기화됨 (다음 plan 이 no-changes)
- **영향 범위**:
  - 작업 흐름: §4 (ElastiCache micro), §6 (RDS micro), Fix D-1 (ElastiCache small) 3차례 적용
  - 코드 변경 없음
- **되돌리는 방법**: 향후 같은 패턴 발견 시 동일 우회 적용. 영구 해결은 modules/rds·modules/elasticache 에 `apply_immediately = var.apply_immediately`(default true) 추가하는 별도 PR.

## 2026-05-10: §2 dev-tax-pub01 IP 변경 대응 — 옵션 B (.env.local 자동 갱신) 선택

- **선택**: 옵션 B — §2 본문에 stop+start 후 새 public IP 를 읽어 `.env.local` 의 `ANCHOR_BASE_URL` 을 sed 로 자동 치환. 추가 confirm 게이트 없음 (Eugene 4회 결정 구조 유지)
- **대안 검토**:
  - **옵션 A (EIP 할당+associate)**: 현재 IP 를 EIP 로 승격하여 stop/start 후에도 동일 IP 유지. 비용 월 ~$3.6 (associate 안 된 상태), attach 시 무료. 한 번 설정 후 영구 효과
  - **옵션 B (.env.local 자동 갱신)**: 매 작업마다 새 IP 로 갱신. 비용 0. 향후 dev-tax-pub01 재기동마다 동일 작업 필요
  - **옵션 C (둘 다 confirm 게이트로 선택)**: 처음 작성 시도. Eugene 결정 4회 → 5회로 늘어남
- **선택 이유**:
  - 글로벌 CLAUDE.md "묻지 말고 진행" 원칙 — IP 변경은 가역적이고 코드/명령으로 검증 가능 → 옵션 묻지 않고 자동 적용
  - 비용 0 (옵션 B) — 베타 단계 비용 최적화 목적과 일치
  - Eugene 4회 결정 구조 (header line 3 약속) 보존
  - 옵션 A 는 별도 권고 (장기 개선 PR) 로 §2 본문 끝에 명시 — 향후 Eugene 이 선택 가능
- **영향 범위**:
  - `docs/anchor-aws/work-guide-2026-05-11-v4.md` §2 본문 — stop/modify/start 후 NEW_IP 읽어 sed 치환 + curl 헬스체크 추가
  - `/Users/eugene/Downloads/coding/anchor-web-e2e/.env.local` — 5/11 작업 중 자동 갱신됨
- **되돌리는 방법**:
  - 옵션 A 로 전환: dev-tax-pub01 에 EIP 할당+associate 별도 PR 작성, §2 의 sed 단계 제거. (백로그 권고로 등록됨)
  - 자동 갱신 자체 제거: §2 의 sed 단계 삭제 후 매 작업마다 .env.local 수동 편집으로 회귀

## 2026-05-08: 파일 구조 분리 원칙 (활성/안정/리포트/archive)

- **선택**: 4가지 카테고리로 명시적 분리 — `.harness/`는 활성 상태만, `docs/source/`는 안정 참조, `docs/reports/`는 timestamped 자동 생성물, `*/archive/`는 deprecated/완료 보존
- **대안 검토**:
  - A) **현재 유지** (모두 root에 평면 배치): 단순. 단 16+ 파일이 root에 쌓이면서 중복/deprecated 분간 어려움
  - B) **카테고리별 분리** (선택): `.harness` 4개 활성 파일만 / `docs/source/` 안정 / `docs/reports/` 자동 생성 / `*/archive/` 옛 버전. 발견성 ↑, 정합성 ↑
  - C) **타임스탬프 기반 분리만**: 옛 것 다 archive로. 단 안정 vs 자동 생성 구별 안 됨 → 동급 취급
- **선택 이유**:
  - `.harness/`는 워치/하네스 시스템이 매 세션 갱신 — 다른 형식 파일 섞이면 노이즈
  - timestamped 리포트(verify-samples-2026-04-30 같은)는 안정 문서와 다른 생명주기 → 격리
  - deprecated 파일(work-guide v1~v3)은 history 보존하되 root에서 안 보이게
  - 신규 진입자 (anchor v2 적용 시) 어디서 무엇을 봐야 하는지 명확
- **영향 범위**:
  - `.harness/fix-progress.md` → `archive/`
  - `docs/anchor-web-e2e-info.md` → 삭제 (중복)
  - `docs/feature-catalog.md` → `source/`
  - `docs/reports/` 신설 + 5개 리포트 이동
  - `docs/anchor-aws/archive/` 신설 + 10개 deprecated 이동
- **되돌리는 방법**: git revert (커밋 fe5797d) — 모두 git rename으로 history 보존됨

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
