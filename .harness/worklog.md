# worklog.md — 작업 기록

> 최신 세션이 위에 오도록 역순으로 작성한다.
> 이전 세션은 `.harness/archive/worklog-YYYY-MM-DD.md`에 보관.

---

## Session 2026-05-25 15:59 — Savings Plan 재분석 및 클라이언트 옵션 제시

### 작업 요약
- Savings Plan 구조 재분석
- 클라이언트용 옵션 B 제시
- 선택 사유를 decision.md에 기록
- state.md를 "Savings Plan 응답 대기" 상태로 갱신 후 git 커밋/푸시

### 다음 액션
- **클라이언트 응답 대기**: Y 선택 시 SP 카트 추가 → Checkout 진행
- **IAM 인라인 정책 + GitLab Maintainer 일괄 revoke** (클라이언트 응답과 무관하게 병렬 처리 가능)
- **Neo4j page cache 튜닝** (운영팀 협의 필요, 후순위)


## Session 2026-05-25 14:24 — Savings Plan 재분석 + 클라이언트 제시 (응답 대기)

### 작업 요약

#### 1. SP 구매 분석기 재실행 (13일 lookback)
- AWS Console → Billing → Savings Plans → Purchase Analyzer
- 옵션: Compute SP / 1년 / No upfront / 14 days lookback (실데이터 13일)
- **결과**:
  - 권장 약정: **$0.373/시간** (월 $272)
  - 예상 절감: **$107.06/월** (연 ~$1,285)
  - 절감률: **27%**
- 5/11 1차 예상 ($0.60~0.70/시간) 대비 실제 더 낮음 — 다운사이즈 효과가 추정 이상

#### 2. 차트 패턴 분석
- 평시 베이스라인 $0.37/hr 안정 (= 권장 약정과 거의 동일)
- **5/16~5/18 스파이크** $0.50/hr → Neo4j 배치 작업 추정 (이전 발견한 CPU 51.2% 스폿과 같은 시점)
- 13일 lookback 짧지만 배치 패턴은 포함됨
- 의미: 권장값 = baseline floor → over-commit 위험 거의 0

#### 3. 옵션 비교 (내부 분석)
- 옵션 A (Custom $0.30/hr): -$80~90/월, 보수, over-commit 위험 거의 0 (초기 권장)
- **옵션 B (권장 $0.373/hr): -$107/월, 최대 절감, baseline 만 커버**
- 옵션 C (32/93일 lookback 재분석): 권장값 오히려 ↑ (다운사이즈 이전 데이터 포함), 추가 가치 낮음

#### 4. Eugene 결정 + 클라이언트 메시지 발송
- 처음에는 옵션 A (보수) 추천했으나, Eugene 이 **옵션 B (권장 그대로)** 로 클라이언트 제시 결정
- 근거 (메시지에 명시): "2주간 우리가 시간당 이것보다 적게쓰는 일이 없었다" — 권장값이 baseline floor 임을 인지하고 over-commit 위험 매우 낮다고 판단
- 클라이언트 메시지 핵심:
  - SP 개념 설명 (시간당 약정, 1년 락인, 중도 환불 불가)
  - 다운사이즈 2주 측정 데이터 기반 권장 도출
  - 권장 약정 $0.373/시간, -$107/월 (-$1,285/년)
  - 결정 위임 (Y 진행 / N 그냥 두기)

#### 5. eugene-followups 갱신
- SP 항목: "재분석 권장일 5/25" → "클라이언트 confirm 대기 중" 상태로 변경
- 13일 lookback 결과 + 차트 패턴 + 옵션 A/B/C 비교 + 클라이언트 메시지 전문 보존
- 권장 옵션 A 가 아닌 옵션 B 가 채택된 사유 기록 (baseline floor 해석)

### 다음 액션
1. (클라이언트 응답 후) Y 진행 시: AWS Console → SP 카트 추가 → Checkout
2. (클라이언트 응답 후) IAM 인라인 정책 + GitLab Maintainer 일괄 revoke (SP 결정과 별개로 처리 가능)
3. (별건 후순위) Neo4j page cache 튜닝 — 운영팀 협의

---

## Session 2026-05-20 15:59 — worklog 아카이빙 및 state/decision 업데이트

### 작업 요약
- worklog.md (547라인) → `archive/worklog-2026-05-19.md`로 이동, 신규 worklog 시작
- state.md에서 베타 다운사이즈 단계 종료 명시
- decision.md에 2건 추가 기록:
  - Neo4j 드롭 결정 (미적용, r6i.large 유지)
  - IAM 정책 + GitLab Maintainer 일괄 회수 (5/25 예정)

### 다음 액션
- **5/25경**: Savings Plan 재분석 및 약정 검토
- **5/25경**: IAM 인라인 정책 정리 및 GitLab Maintainer revoke
- **별건**: Neo4j page cache 튜닝 (운영팀 협의 필요)


(다음 세션부터 기록. 직전 세션 = 2026-05-19 20:29 Neo4j 다운사이즈 드롭 — `archive/worklog-2026-05-19.md` 참조)
