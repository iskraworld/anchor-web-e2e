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

<!-- 새 항목은 여기 위에 추가 -->

---

## 완료 / 취소
