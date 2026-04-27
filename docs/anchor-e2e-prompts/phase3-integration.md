# Phase 3: 통합 (30분)

## 목표

팀 시나리오 + 자율 탐색 시나리오를 통합해서 최종 test-plan 만들기.

## Claude Code 프롬프트

```
두 시나리오 파일을 통합해서 specs/test-plan.md 만들어줘.

입력:
- specs/scenarios-from-team.md (TM-A ~ TM-G, 7개)
- specs/scenarios-from-exploration.md (FN-* + VR-*, N개)

작업:
1. 중복 제거
   - 자율 탐색이 팀 시나리오와 겹치는 영역은 팀 시나리오 우선
   - 팀 시나리오 ID 유지 (TM-*)

2. 우선순위 재조정
   - P0 (매일 모니터링, 5-10개):
     * TM-A ~ TM-G (팀 핵심 시나리오 7개)
     * FN-AUTH-001 (5개 계정 로그인)
     * FN-NAV-001 (모든 페이지 200 OK + 콘솔 에러)
   - P1 (주 1회, 20-40개):
     * 권한별 핵심 기능 (FN-PERM)
     * 검색 기능 (FN-SEARCH)
     * 폼 validation (FN-FORM)
     * Empty/Error states (FN-STATE)
     * Domain 특화 (FN-DOMAIN)
   - P2 (수동 트리거 또는 주 1회 풀, 나머지):
     * 자율 탐색 발견한 모든 시나리오
   - VR (Visual Regression, 별도 카테고리):
     * 매일 또는 주 1회 비교

3. 추적 가능성
   각 시나리오에 메타 정보:
   - ID
   - 출처 (Team / Exploration)
   - 우선순위 (P0/P1/P2/VR)
   - 사용자 유형
   - 데이터 의존성
   - 자동화 가능 여부 (자동/수동/skip)

4. specs/test-plan.md 구조:
---
# Anchor E2E Test Plan

last_updated: {YYYY-MM-DD}
total_scenarios: {N}

## 통계
- P0: {N}개 (매일)
- P1: {N}개 (주 1회)
- P2: {N}개 (수동/주 1회 풀)
- VR: {N}개 (매일 visual)

## 자동화 범위 외 (사람 QA 필요)
- UX 평가 (직관성, 카피 적절성)
- 도메인 깊은 검증 (인맥 추천 알고리즘 정확성)
- 새 기능 출시 시 첫 회 수동 검증

## P0 시나리오
### TM-A: 특정 공무원에 대한 공통 인맥 탐색
...

### FN-AUTH-001: 5개 계정 로그인
...

## P1 시나리오
...

## P2 시나리오
...

## Visual Regression
...
---

5. specs/data-dependencies.md 업데이트
   - 팀 시나리오 데이터 의존
   - 자율 탐색에서 발견한 추가 의존성

6. specs/data-validation.md 작성 (다음 단계 준비)
   - 각 P0 시나리오의 데이터가 staging에 실제 있는지 검증 필요 항목 목록
   - 다음 단계에서 AI가 사이트 들어가서 확인할 것

7. README.md 업데이트
   - 프로젝트 소개
   - 사용법 (npm run test:critical, npm run test:full 등)
   - 시나리오 추가 방법
```

## 검증 후 데이터 검증 단계

Phase 3-2: 데이터 검증

```
specs/test-plan.md의 P0 시나리오들이 staging 데이터로 실행 가능한지 검증해줘.

각 P0 시나리오마다:
1. 해당 사용자 계정으로 로그인
2. 시나리오에 명시된 데이터(인물, 회사, 지역 등)가 실제 staging에 있는지 확인
3. 결과를 specs/data-validation.md에 기록:

| 시나리오 ID | 데이터 | 상태 | 메모 |
|-----------|-------|------|-----|
| TM-A | 김정희 (서울청 재산팀) | ✅ 있음 | 공통 인맥 3명 (시나리오 명시 2명과 다름) |
| TM-A | 김진범 팀장 | ✅ 있음 | |
| TM-B | 김경국 (동대문 조사팀) | ⚠️ 다름 | 김경국이 다른 부서에 있음 |
| ... | | | |

상태 분류:
- ✅ 있음: 시나리오 그대로 실행 가능
- ⚠️ 다름: 데이터 있지만 시나리오 expected와 차이
- ❌ 없음: 시나리오 실행 불가

⚠️ 다름인 경우:
- 시나리오의 expected를 유연하게 수정
  ('2명' → 'N명 이상' 등)
- specs/test-plan.md 해당 시나리오 업데이트

❌ 없음인 경우:
- specs/test-plan.md에 'BLOCKED' 표시
- anchor 팀에 데이터 추가 요청 메모

read-only만, 데이터 생성·수정 X.
```

## 검증

Phase 3 완료 후:
- `specs/test-plan.md` 통합 시나리오 목록
- `specs/data-validation.md` 데이터 검증 결과
- BLOCKED 시나리오 명시
- P0/P1/P2/VR 분류 완료

## 다음 단계

Phase 4: `phase4-code-generation.md`
