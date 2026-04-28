# anchor-e2e-v2 — QA 문서 기반 E2E 자동화 프로세스

## 이 프로세스가 필요한 상황

`docs/qa/` 디렉토리에 **기능명세서·정책서·Figma 기반으로 생성된 QA 문서**가 이미 존재할 때 사용한다.

QA 문서가 없는 경우 → `docs/anchor-e2e-prompts/` (v1, 탐색 기반 프로세스) 사용.

---

## v1과의 차이

| | v1 (anchor-e2e-prompts) | v2 (anchor-e2e-v2) |
|---|---|---|
| 입력 | 없음 → 탐색으로 시나리오 발견 | QA 문서 (docs/qa/*.md) |
| 명세 작성 | AI가 작성 | 이미 존재 |
| 테스트 ID | 없음 | TC-ID 1:1 매핑 |
| 결과 형식 | pass/fail 숫자 | TC-ID별 결과 테이블 |
| 목적 | 회귀 모니터링 | 사람이 확인하는 QA 증적 |

---

## 산출물 구조

```
tests/qa/
├── auth/           AUTH — 로그인/회원가입
├── ta/             TA   — 세무대리인찾기
├── eo/             EO   — 전직공무원찾기
├── tf/             TF   — 법인&팀연동관리
├── sp/             SP   — 구독관리
├── ei/             EI   — 전문이력관리
├── er/             ER   — 전문이력리포트
├── go/             GO   — 현직공무원탐색
├── home-ta/        HOME-TA — 홈GNB알림_세무사
├── home-tp/        HOME-TP — 홈GNB알림_납세자
└── my/             MY   — 내정보

docs/anchor-e2e-v2/
├── qa-automation-map.md   (Phase 1 산출물 — TC-ID별 자동화 분류표)
└── manual-verification.md (Phase 3 산출물 — 수동 검증 필요 항목 사유)

playwright-report/
└── qa-report/
    ├── index.html          (TC-ID 매핑 결과 테이블)
    └── detail/             (Playwright 상세 리포트)
```

---

## Phase 순서

| Phase | 파일 | 소요 예상 |
|---|---|---|
| 0 | phase0-prerequisites.md | 10분 |
| 1 | phase1-qa-analysis.md | 30분 |
| 2 | phase2-code-generation.md | 3~4시간 |
| 3 | phase3-run-and-report.md | 1시간 |

---

## 전체 QA 규모

| 모듈 | TC 수 | 대상 앱 |
|---|---|---|
| AUTH | 102 | 공통 |
| HOME-TA | 97 | 세무사 |
| HOME-TP | 90 | 납세자 |
| EI | 119 | 세무사 |
| ER | 70 | 세무사/납세자 |
| GO | 69 | 공통 |
| EO | 69 | 공통 |
| TA | 65 | 납세자 |
| TF | 62 | 세무법인 |
| SP | 57 | 공통 |
| MY | 40 | 공통 |
| **합계** | **840** | |

삭제된 TC(~~취소선~~) 제외 시 약 810개 유효.
