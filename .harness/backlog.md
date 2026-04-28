# backlog.md — 나중에 할 것들

---

## 대기 중

## CI 연동 (스케줄 기반)
- 현재: 수동 실행만 (`workflow_dispatch`)
- 목표: 매일 오전 9시 P0 자동 실행 + 실패 시 Telegram 알림
- 워크플로 초안: `docs/ci-templates/daily-monitor.yml`, `weekly-full.yml`
- 활성화: `.github/workflows/`에 복사 후 GitHub Actions 환경 변수 등록
- 참고: `docs/anchor-e2e-prompts/phase6-monitoring.md`

## D-2/D-3 BLOCKED 해제
- TM-D-2: 1그룹/2그룹 역량 분류 수치 확인
- TM-D-3: 그룹별 역량 상세 비교
- 이유: Anchor 팀 법인 리포트 1그룹/2그룹 분류 UI 미출시
- 조건: 해당 UI 릴리즈 후 `tests/critical/team-scenarios/D-firm-capability.spec.ts` BLOCKED 테스트 활성화

## 2026-04-28: CI 스케줄 자동 실행 설정

- **백로그 이유**: 매 push마다 CI가 돌아 불필요한 실행이 발생해 일단 수동 실행으로 전환. 적절한 스케줄 정책 결정이 필요해 보류
- **할 것**: GitHub Actions workflow에 `schedule` 트리거 추가 (예: 매일 특정 시각 or PR merge 시에만 실행 등 정책 확정 후 적용)
- **필요한 것**: 팀 내 CI 실행 빈도 정책 합의, cron 표현식 결정
- **이전 검토**: 수동 실행(`workflow_dispatch`)으로는 이미 동작 확인됨. `on: push` 트리거는 제거 완료

---

## 2026-04-28: D-2/D-3 테스트 언블락

- **백로그 이유**: Anchor 팀의 UI 출시가 선행되어야 테스트 작성 및 실행 가능. 현재 대상 UI 미출시 상태
- **할 것**: Anchor 팀 UI 출시 확인 후 D-2/D-3 시나리오 테스트 구현 및 CI에 포함
- **필요한 것**: Anchor 팀 UI 배포 완료 알림, 해당 UI의 URL·셀렉터 정보
- **이전 검토**: 백로그 이동 결정만 완료. 테스트 설계·구현은 아직 미착수. D-2/D-3가 어떤 시나리오인지는 phase6-monitoring.md에 기록되어 있음

<!-- 새 항목은 여기 위에 추가 -->

---

## 완료 / 취소
