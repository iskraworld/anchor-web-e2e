# decision.md — 의사결정 기록

> 대안 비교와 선택 이유가 있는 경우만 기록한다.

---

## 2026-04-29: DOCS_TOTAL 산정 — 활성 TC만 vs 활성+삭제 모두

- **선택**: 활성+삭제 모두 합산 (전체 docs 기준 872건)
- **대안 검토**:
  - 활성 TC만 카운트 (803건) → TA 116%, EO 106% 등 spec이 docs를 초과하는 비정상 수치 발생
  - 하드코딩 (구 872) → docs 변경 시 수동 갱신 필요, 최신화 누락 위험
  - 활성+삭제 동적 파싱 (872건) → spec의 [D] 태그와 1:1 매칭, 항상 100% 캡
- **선택 이유**: 삭제된 TC도 [D] 태그로 spec에 보존하면 docs 전체와 자연스럽게 1:1 매핑됨. 음수 미구현·100% 초과 모두 사라짐.
- **영향 범위**: `scripts/generate-qa-report.mjs` `buildDocsCounts`
- **되돌리는 방법**: 활성만 원하면 `DELETED_ROW_RE2` 매칭 시 continue 추가

---

## 2026-04-29: 누락 TC 분류 기준 — 미구현 vs [D]/[M]

- **선택**: docs strikethrough된 TC는 모두 [D] 또는 [M]으로 spec에 추가하고 "미구현" 0건 달성
- **대안 검토**:
  - 미구현으로 표시 (구 58건) → 분모/분자 일관성 깨짐, "왜 미구현?" 분류 불가
  - 일부만 [D] 추가하고 나머지는 미구현 유지 → 부분 해결, 합계 안 맞음
  - 28[D] + 28[M] 모두 추가 → spec과 docs가 정확히 1:1, 합계 872 일치
- **선택 이유**: docs는 source of truth이고 strikethrough = "QA 범위 외". 추적 가능한 형태로 spec에 보존하는 것이 향후 요구사항 복구 시에도 유리.
- **영향 범위**: 9개 spec 파일에 56개 test.skip 추가
- **되돌리는 방법**: spec 끝부분 "누락 TC 보강" describe 블록 삭제

---

세션 요약을 분석했습니다. 이 세션은 E2E 테스트 실패 원인 분석 및 selector 교정 작업으로, 대안 비교 후 의사결정을 내린 내용이 명확히 포함되어 있지 않습니다. (분석 및 수정 계획 수립 단계에서 세션이 종료된 것으로 보입니다.)

NONE


## 2026-04-27: .env.local 로드 방식 — dotenv vs Node fs 직접 파싱

- **선택**: Node `fs` 직접 파싱 (의존성 추가 없음)
- **대안 검토**:
  - `dotenv` npm 패키지 → `npm install -D dotenv` 필요, 프로젝트에 없음
  - `process.loadEnvFile()` (Node 20.12+) → Node 버전 보장 필요
  - Node fs 직접 파싱 → 의존성 0, 주석/빈 줄 처리 가능, CI env 우선 처리 가능
- **선택 이유**: devDependency 추가 없이 동일 기능 달성. 단순 key=value 파싱이라 직접 구현이 충분함.
- **영향 범위**: `playwright.config.ts`
- **되돌리는 방법**: dotenv로 전환 시 `npm install -D dotenv` 후 import 방식으로 교체

## 2026-04-27: P0 테스트 브라우저 범위 — chromium only vs 전체 브라우저

- **선택**: chromium only (기본값)
- **대안 검토**:
  - 전체 브라우저 (chromium + firefox + webkit) → 호환성 넓지만 3배 느림
  - chromium only → P0 일간 CI에서 속도 우선, 크로스 브라우저는 주간 P1에서 확장 가능
- **선택 이유**: P0은 "서비스 생존 지표" 기준이므로 빠른 피드백이 우선. 크로스 브라우저 검증은 P1 실행 시 projects에 추가하면 됨.
- **영향 범위**: `playwright.config.ts` projects 배열
- **되돌리는 방법**: `playwright.config.ts`에 firefox/webkit project 블록 추가

---

## 2026-04-27: staging 데이터 검증 방법 — 직접 탐색 vs 문서 의존

- **선택**: Playwright MCP로 staging 직접 접속해 인물 ID·추천 결과 실측
- **대안 검토**:
  - 문서(anchor-web-e2e-info.md)만 참고해 테스트 작성 → 실제 ID 미확인으로 테스트 깨질 위험 큼
  - Anchor 팀에 ID 요청 → 응답 대기 시간 발생, 개발 차단
- **선택 이유**: ID(김경국=3313, 김정희=5707)와 추천 세무사 섹션 존재 여부는 테스트의 핵심 사전 조건이므로 직접 검증이 필수. 탐색 시간 투자 대비 테스트 신뢰도 대폭 상승.
- **영향 범위**: `specs/test-plan.md`, `specs/data-dependencies.md`
- **되돌리는 방법**: data-dependencies.md의 ID를 업데이트하면 되돌릴 수 있음

## 2026-04-27: 시나리오 C 우선순위 — P1 vs P2

- **선택**: P2 (전수 QA)
- **대안 검토**:
  - P1으로 주 1회 실행 → 데이터 변경(토글 ON/OFF) 포함이라 CI 자동화 위험
  - P2 → 수동 QA 시점에만 실행, 실행 후 복원 절차 명시
- **선택 이유**: C-3은 staging 데이터를 변경(프로필 노출 토글 ON)하고 원복이 필요. 자동화 CI에 포함하면 다른 테스트에 사이드 이펙트 발생 가능성 있음.
- **영향 범위**: `specs/test-plan.md` C 시나리오
- **되돌리는 방법**: C-3을 P1으로 격상하려면 setUp/tearDown에서 토글 상태를 저장·복원하는 fixture 추가 필요
