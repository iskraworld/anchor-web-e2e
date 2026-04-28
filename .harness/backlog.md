# backlog.md — 나중에 할 것들

---

## 대기 중

## 2026-04-28: ER PDF·링크 버튼 테스트 재활성화

- **백로그 이유**: ER-1-05/1-06/2-05/2-06 — PDF 저장·링크 추출 버튼이 현재 UI에 미구현. 버튼 미노출로 테스트가 timeout됨 → `test.skip()`으로 임시 전환
- **할 것**: UI 출시 후 `tests/qa/er/er.spec.ts`에서 `test.skip(` → `test(` 로 되돌리고, 실제 버튼 셀렉터 확인 후 재실행
- **필요한 것**: Anchor 팀 ER 모듈 PDF/링크 공유 기능 릴리즈 확인
- **이전 검토**: 타임아웃 15초 대기 후도 버튼 미발견. `/tax-history-report/me` 페이지에 PDF/링크 관련 버튼 없음 확인
- **관련 파일**: `tests/qa/er/er.spec.ts` lines 70-86 (ER-1-05/1-06), 129-145 (ER-2-05/2-06)

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

NONE

> 세션 요약에서 "나중에", "백로그", "일단 스킵", "다음에", "우선순위 낮음" 등의 표현으로 **의도적으로 미뤄진** 항목은 없습니다.
>
> "다음으로 넘긴 것 — Phase 3 테스트 실행 결과 대기 중"은 현재 진행 중인 작업의 **자연스러운 중단점**이며, 백로그 결정이 아닙니다.

세션 요약에서 "나중에", "백로그", "일단 스킵", "다음에", "우선순위 낮음" 등으로 명시적으로 미뤄진 항목이 확인되지 않습니다.

NONE

<!-- 새 항목은 여기 위에 추가 -->

---

## 완료 / 취소
