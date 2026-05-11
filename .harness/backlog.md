# backlog.md — 나중에 할 것들

---

## 대기 중

## 2026-05-11: alb-neo4j01 미사용 ALB 삭제 (보류 → 백로그)

- **백로그 이유**: 5/11 작업 중 §9 단계에서 비가역성 우려로 보류 결정. 절감액 작음(~$16/월 ALB hourly) 대비 재생성 비용·시간(~3분) 트레이드오프
- **할 것**: tfvars 의 3 블록에서 `alb-neo4j01` 관련 라인 4개 제거 후 apply. 정확한 위치:
  - `load_balancers` (line 274~278): `alb-neo4j01` 1줄
  - `lb_listeners` (line 281~287): `neo4j-http` + `neo4j-https` 2줄
  - `target_groups` (line 290~295): `neo4j-http-tg` 1줄
- **필요한 것**: 향후 Neo4j HTTP UI 외부 접근 영구 불필요 확인 / 박정환 실장 사전 확인
- **이전 검토**: 30일 RequestCount = 0 검증 완료 (2026-05-10). NLB `nlb-neo4j01` (Bolt 7687) 은 별개로 유지되어 Neo4j-WAS 연결성 무관. Neo4j 인스턴스 `i-003db424b45f31fea` 도 유지
- **관련 파일**: `/Users/eugene/Downloads/coding/iskra-anchor/anchor-terraform/environments/prod/terraform.tfvars` (라인 274-295)
- **참고**: 가이드 `docs/anchor-aws/work-guide-2026-05-11-v4.md` §9 — diff 형태로 정확한 제거 라인 명시되어 있음

## 2026-04-28: ER PDF·링크 버튼 테스트 재활성화

- **백로그 이유**: ER-1-05/1-06/2-05/2-06 — PDF 저장·링크 추출 버튼이 현재 UI에 미구현. 버튼 미노출로 테스트가 timeout됨 → `test.skip()`으로 임시 전환
- **할 것**: UI 출시 후 `tests/qa/er/er.spec.ts`에서 `test.skip(` → `test(` 로 되돌리고, 실제 버튼 셀렉터 확인 후 재실행
- **필요한 것**: Anchor 팀 ER 모듈 PDF/링크 공유 기능 릴리즈 확인
- **이전 검토**: 타임아웃 15초 대기 후도 버튼 미발견. `/tax-history-report/me` 페이지에 PDF/링크 관련 버튼 없음 확인
- **관련 파일**: `tests/qa/er/er.spec.ts` lines 70-86 (ER-1-05/1-06), 129-145 (ER-2-05/2-06)

## 2026-04-28: D-2/D-3 BLOCKED 해제

- **백로그 이유**: Anchor 팀의 1그룹/2그룹 분류 UI 미출시로 spec 작성 불가. 5/8에 `test.skip` placeholder 제거 → smoke test baseline 단순화 (28 passed / 0 skipped). UI 출시 시 spec 신규 작성 필요
- **할 것**: UI 출시 확인 → `tests/critical/team-scenarios/D-firm-capability.spec.ts`에 D-2 (1그룹/2그룹 분류 수치 확인) + D-3 (그룹별 역량 상세 비교) spec 신규 작성 → CI 포함
- **필요한 것**: Anchor 팀 UI 출시 알림, 셀렉터·URL 정보
- **이전 검토**: 5/8 placeholder 제거 결정 (decision.md 기록), state.md backlog로 추적

## 2026-04-28: CI 스케줄 자동 실행 정책 결정

- **백로그 이유**: 매 push CI 실행이 과도해 일단 수동(`workflow_dispatch`)으로 전환. 적절한 빈도 정책 합의 필요
- **할 것**: GitHub Actions workflow에 `schedule` 트리거 추가 (예: 매일 오전 9시 P0 자동 + 실패 시 Telegram 알림 / PR merge 시에만 실행 등 정책 확정 후 적용)
- **필요한 것**: 팀 내 CI 실행 빈도 정책 합의, cron 표현식 결정
- **이전 검토**: `workflow_dispatch` 동작 확인됨. `on: push` 제거 완료. 워크플로 초안 `docs/ci-templates/daily-monitor.yml`, `weekly-full.yml` 작성됨
- **참고**: `docs/anchor-e2e-prompts/phase6-monitoring.md`

## 2026-04-29: HOME 모듈 staging BLOCKED 11건 재테스트

- **백로그 이유**: HOME staging 환경이 회복되지 않아 진행 불가 (D-2/D-3, ER 외 별개 11건)
- **할 것**: staging 환경 정상화 확인 후 HOME 모듈 BLOCKED 11건 재실행 → PASS 확인 또는 추가 fix
- **필요한 것**: HOME staging 환경 정상화
- **이전 검토**: 워크로그·state.md에 11건 식별 완료. BLOCKED 분류 적용됨

## 2026-05-08: v4 §11 추가 Smoke test 시나리오 보강

- **백로그 이유**: 기획자/FE 팀에 추가 시나리오 (결제·알림·기타 회귀) 문의 → 답변 대기 중
- **할 것**: 답변 받으면 `docs/anchor-aws/work-guide-2026-05-11-v4.md` §11에 추가 시나리오 명시 + Playwright spec 작성 (필요 시)
- **필요한 것**: 기획자/FE 팀 답변 (어떤 edge case 다룰지, 회귀 감지 특화 시나리오 있는지)
- **이전 검토**: 5/8 사전 검증 — 28 passed / 0 skipped / 0 failed / 17.1초. ALB Response avg < 300ms 기준 확인됨. 현재 28개 critical로 다운사이즈 영향 큰 RDS/캐시/was/Neo4j 모두 커버

## 2026-05-08: ANCHOR_GITLAB_TOKEN 만료/revoke

- **백로그 이유**: write PAT 노출 최소화 — 5/11 작업 + Tier 1 fresh consumer 검증 종료 후 즉시 revoke 또는 자동 만료(2026-06-07) 활용
- **할 것**: 정식 오픈 관련 모든 작업 완료 후 GitLab → User Settings → Access Tokens → revoke 클릭. 또는 만료일까지 방치
- **필요한 것**: 5/11 AWS 작업 + Tier 1 검증 종료
- **이전 검토**: 토큰 발급 시 read+write 스코프, 만료 2026-06-07 (한 달)

<!-- 새 항목은 여기 위에 추가 -->

---

## 완료 / 취소
