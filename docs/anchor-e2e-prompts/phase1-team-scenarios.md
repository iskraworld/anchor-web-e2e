# Phase 1: 팀 시나리오 변환 (30분)

## 목표

`docs/source/anchor-web-e2e-info.md`의 시나리오 A~G를 Gherkin 형식으로 변환.

## Claude Code 프롬프트

다음 내용을 그대로 Claude Code에 붙여넣기:

```
docs/source/anchor-web-e2e-info.md의 시나리오 A~G를 Gherkin (Given-When-Then) 형식으로 변환해줘.

작업:
1. 7개 시나리오 각각을 Gherkin으로 변환
2. specs/scenarios-from-team.md에 저장

각 시나리오 구조:
---
ID: TM-A (TM-A ~ TM-G)
이름: {원본 시나리오 이름}
사용자 유형: {계정 정보}
출처: 팀 정의
우선순위: P0 (모두 매일 모니터링)
데이터 의존: {필요한 staging 데이터 목록}

Background:
  Given anchor staging이 정상 작동 중
  And 사용자가 {계정}으로 로그인됨

Scenario: {원본 데모 흐름의 한 단계}
  When {액션}
  Then {기대 결과}

Scenario: {다음 단계}
  ...
---

원칙:
- 데이터 의존이 깊은 시나리오 (A, B, F)는 검증을 유연하게:
  - "공통 인맥 2명" → "공통 인맥 N명 이상 표시" (N >= 1)
  - "박성호 추천" → "추천 세무사 목록 비어있지 않음"
- UI 라벨 (버튼명, 메뉴명)은 정확 매치
- 데모 흐름의 각 번호 = 하나의 Scenario
- 사용자 진입 동기는 Feature 설명에 포함

데이터 의존 명시:
시나리오별로 staging에 있어야 할 데이터:
- TM-A: 공무원 김정희, 김진범, 최승일 / 박성훈 세무사 / 고영호 전관
- TM-B: 공무원 김경국 / 김수희 / 박성호
- TM-C: 가온세무법인 데이터 / 한지희 프로필
- TM-D: 가온세무법인 1그룹/2그룹 인원 데이터
- TM-E: 법인 실적·전문 분야 데이터
- TM-F: 공무원 김경국 / 박성호 세무사
- TM-G: 광주 지역 세무사 데이터

이 데이터 목록을 specs/data-dependencies.md에도 저장 (anchor 팀에 보존 요청용).

⚠️ 안전 규칙:
- 시나리오 C는 데이터 생성 (프로필 등록) 포함
  → staging만, dry-run 모드 검토 필요
  → 매일 자동 실행 시 매번 등록되지 않게 idempotent하게
- 다른 시나리오는 read-only

작업 시작 전 docs/source/anchor-web-e2e-info.md 먼저 읽고 시작해줘.
```

## 검증

Claude가 만든 후 확인:
- specs/scenarios-from-team.md 파일 존재
- 7개 시나리오 (TM-A ~ TM-G)
- 각 시나리오에 사용자 유형, 데이터 의존성 명시
- specs/data-dependencies.md 파일 존재

## 다음 단계

Phase 2로 진행: `phase2-exploration.md`
