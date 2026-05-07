# worklog.md — 작업 기록

> 최신 세션이 위에 오도록 역순으로 작성한다.
> 이전 세션은 `.harness/archive/worklog-YYYY-MM-DD.md`에 보관.

---

## Session 2026-05-07 21:48 — AWS 작업 가이드 점진 보강 + 월요일로 일정 변경 + v2 분리

### 작업 요약
- AWS 작업 가이드 점진 보강 (사람 작업 → 봇 자동화 확대):
  - 점심 모니터링: 👤 사람 → 🤝 (Claude CLI 점검 + 사람 결과 5초 확인)
  - ALB 삭제: 👤 사람 → 🤝 (Claude 자동 + 실행 직전 1-line confirm)
  - RDS 다운사이징: 🤝 → 🤖 (full auto + 자동 abort 룰: health 회복 >3분 또는 5xx 지속 60초)
  - gw01 위치 재배치: 오후 §7-1 → §0 (권한 부여 직후 같은 콘솔 세션, 사람 작업 한 덩어리)
  - 일요일 모니터링: 사용자 한마디 트리거 → 🤖 자율 cron (`schedule` 스킬, 매 30분 + Telegram 알림)
- 일정 변경: 토요일(5/9) → 월요일(5/11) — 전 직원 출근일에 실행, 이슈 발생 시 즉시 대응
- 파일 rename: `work-guide-2026-05-09-v2.md` → `work-guide-2026-05-11.md`
- 봇 자율 블록 단일 연속 ~30~60분 압축 (점심 break 제거)
- v1 점검: 15개 우려사항 식별 (Critical 5 / Important 5 / Minor 5)
- v2 파일 신규 생성 (`work-guide-2026-05-11-v2.md`): v1 점검 결과 일괄 반영
  - placeholder 실제 값: 8 인스턴스 ID + AMI `ami-05ebb6c36f80a9353` + SG/Subnet/TG ARN
  - IAM 정리: ReadOnlyForOps Sid 제거 (기존 ReadOnlyAccess 관리형으로 충당), `PassRole` + `RegisterTargets`만 추가
  - ElastiCache → RDS 사이 5~10분 buffer 추가 (캐시 미스 + 작아진 DB 동시 spike 방지)
  - was01 stable 60초 룰 + healthy timeout 자동 일시중지
  - 운영 결정 명시: 09:00 KST 시작 / 단독 (Eugene) / 사용자 공지 없음 / 5~10분 buffer
  - 시간 견적 보정: 30~60분 → 60~90분
  - 봇→사람 핸드오프 Telegram 알림 (smoke test 시작 트리거)
- AWS CLI 직접 조회로 8 인스턴스 매핑 + Subnet/SG/AMI/TG ARN 확정
- claude-cost-readonly IAM 콘솔 확인: ReadOnlyAccess 관리형 정책 attached → 모든 Describe/Get/List 자동 충당

### 다음 액션
1. (사용자) 5/11 (월) 09:00 — IAM 인라인 정책 부여 + gw01 right-sizing → Claude에 알림 → 봇 자율 작업 ~60~90분
2. (사용자) 5/12 (화) — Claude 자율 cron 모니터링 트리거 ("화요일 모니터링 cron 걸어줘")
3. (사용자) 개발팀 공지 (`dev-team-notice-2026-05-09.md`) — 날짜 5/11로 갱신 필요 + 전달

---
