# test-plan.md — Anchor E2E 테스트 계획 (시나리오 A–G)

> 기준 문서: `docs/anchor-web-e2e-info.md`, `docs/app.context.md`
> staging 데이터 검증일: 2026-04-27
> 대상: http://13.125.186.195:3000

---

## 우선순위 정의

| 등급 | 주기 | 기준 |
|---|---|---|
| **P0** | 매일 (CI) | 로그인 + 핵심 검색/추천 — 서비스 생존 지표 |
| **P1** | 주 1회 | 각 사용자 유형 핵심 기능 흐름 |
| **P2** | 전수 QA | 데이터 변경 포함 전체 시나리오 |

**안전 원칙**
- P0, P1: read-only 검증만 (데이터 변경 없음)
- P2 데이터 변경: staging 전용, 운영 절대 금지
- 결제·구독 변경: dry-run (제출 버튼 클릭 금지)

---

## 확인된 Staging 데이터 (2026-04-27 기준)

| 인물 | 유형 | ID / UUID | 소속 | 확인 여부 |
|---|---|---|---|---|
| 김경국 | 현직 공무원 | `3313` | 동대문세무서 조사과 조사팀 6급 조사관 | ✅ |
| 김정희 | 현직 공무원 | `5707` | 서울청 성실납세지원국 소득재산세과 재산팀 6급 조사관 | ✅ |
| 김상원 | 현직 공무원 | `4328` | 용산세무서 4급 세무서장 | ✅ |
| 박성호 | 세무사 | `5032cae5-cb6f-4997-80c8-210f9d02edca` | 가온세무법인 광주 서구 | ✅ |
| 박시준 | 세무사 | `bf57b29e-edb4-4bf2-a361-12cbb5fd0da4` | 가온세무법인 광주 서구 | ✅ |
| 한지희 | 세무사 | UUID 미확인 | 가온세무법인 소속 (프로필 미노출 상태) | ⚠️ |
| 김진범 | 현직 공무원 | ID 미확인 | 서울청 소득재산세과 재산팀장 (상사) | ⚠️ 그래프에서만 확인 가능 |
| 최승일 | 현직 공무원 | ID 미확인 | 서울청 소득재산세과 과장 (상사의 상사) | ⚠️ 그래프에서만 확인 가능 |

---

## 시나리오 A — 전관 세무사의 특정 공무원 공통 인맥 탐색

> 계정: `bagseongho@gaon.com` | **P1** | Read-only

```gherkin
Feature: 시나리오 A — 현직 공무원 공통 인맥 탐색 (전관 세무사)

  Background:
    Given 전관 세무사 박성호(bagseongho@gaon.com)가 로그인되어 있다
    And 홈 탭에 "현직 공무원 정보 탐색", "전직 공무원 찾기", "세무사 찾기" 탭 3개가 노출된다

  Scenario: A-1 김정희 조사관 검색 및 결과 확인
    Given 홈의 "현직 공무원 정보 탐색" 탭이 선택되어 있다
    When 공무원명 입력란에 "김정희"를 입력하고 검색 버튼을 클릭한다
    Then URL이 "/search/active-officials?name=김정희"로 변경된다
    And 검색 결과에 "서울지방국세청 성실납세지원국 소득재산세과 재산" 소속 "김정희" 조사관이 포함된다
    And 해당 행을 클릭하면 "/search/active-officials/5707"로 이동한다

  Scenario: A-2 김정희 프로필 및 공통 관계망 UI 확인
    Given "/search/active-officials/5707"에 접근한다
    When 페이지가 로딩된다
    Then 페이지 제목에 "김정희"가 포함된다
    And "공통 관계망 찾기" 섹션이 노출된다
    And "관계망 찾기" 버튼이 존재한다

  Scenario: A-3 관계망 찾기 실행 및 그래프 렌더링
    Given "/search/active-officials/5707" 프로필 페이지에 있다
    When "관계망 찾기" 버튼을 클릭한다
    Then 공통 관계망 그래프 또는 결과 섹션이 렌더링된다
    And 오류 없이 결과가 노출된다
    # 데이터 의존: 공통 인맥 수가 동적이므로 "N개 이상" 기준으로 검증
    # 시나리오 설명: 2명의 공통 인맥 확인 예상, 단 staging 데이터 변동 가능
```

---

## 시나리오 B — 일반 세무사의 회사 전체 기준 공통 인맥 탐색

> 계정: `taxhan@theanchor.best` | **P1** | Read-only

```gherkin
Feature: 시나리오 B — 현직 공무원 공통 인맥 탐색 (일반 세무사)

  Background:
    Given 일반 세무사 한지희(taxhan@theanchor.best)가 로그인되어 있다
    And 홈 탭에 "현직 공무원 정보 탐색", "전직 공무원 찾기", "세무사 찾기" 탭 3개가 노출된다

  Scenario: B-1 김경국 조사관 검색 및 확인
    Given 홈의 "현직 공무원 정보 탐색" 탭이 선택되어 있다
    When 공무원명 입력란에 "김경국"을 입력하고 검색 버튼을 클릭한다
    Then URL이 "/search/active-officials?name=김경국"으로 변경된다
    And 검색 결과 카운트가 "1"이다
    And "동대문세무서" 소속 "김경국" 조사관이 결과에 존재한다

  Scenario: B-2 김경국 프로필 페이지 접근
    Given "/search/active-officials/3313"에 접근한다
    When 페이지가 로딩된다
    Then 페이지 제목에 "김경국"이 포함된다
    And "공통 관계망 찾기" 섹션이 노출된다
    And "관계망 찾기" 버튼이 존재한다

  Scenario: B-3 회사 전체 기준 관계망 찾기
    Given "/search/active-officials/3313" 프로필 페이지에 있다
    When "관계망 찾기" 버튼을 클릭한다
    Then 공통 관계망 그래프 또는 결과 섹션이 렌더링된다
    And 오류 없이 결과가 노출된다
    # 데이터 의존: 일반 세무사는 본인 기준 공통 관계가 없어 회사 전체 기준으로 조회
    # staging에서 "김수희 현직 공무원"이 양쪽과 관계 선이 진한 인물로 나타나야 함
```

---

## 시나리오 C — 세무사 프로필 등록 후 납세자 노출 확인

> 계정: `taxhan@theanchor.best` | **P2** | ⚠️ 데이터 변경 포함 (staging 전용)

```gherkin
Feature: 시나리오 C — 세무사 프로필 노출 확인 및 이력 등록

  Scenario: C-1 가온세무법인 세무사 검색 — 한지희 미노출 확인
    Given 비로그인 또는 로그인 상태로 홈에 접근한다
    When "세무사 찾기" 탭을 클릭한다
    And 세무법인명 입력란에 "가온세무법인"을 입력하고 검색한다
    Then URL이 "/search/tax-experts?firmName=가온세무법인"으로 변경된다
    And 검색 결과에 박성호, 박시준 등 가온세무법인 세무사들이 노출된다
    And 검색 결과에 "한지희" 이름이 포함된 항목은 없다
    # staging 확인: 한지희는 프로필 미등록(토글 OFF) 상태여야 함 (2026-04-27 확인)

  Scenario: C-2 한지희 세무 이력 관리 접근 확인
    Given taxhan@theanchor.best으로 로그인한다
    When GNB 프로필 메뉴 → "세무 이력 관리"를 클릭한다
    Then "/tax-history-management/basic-info"로 이동한다
    And 세무 이력 관리 페이지가 오류 없이 로딩된다
    And 프로필 노출 토글이 OFF 상태임을 확인한다
    # ⚠️ 실제 토글 변경은 staging에서만 허용, 변경 후 C-1을 재실행해 노출 확인

  Scenario: C-3 프로필 노출 ON 후 검색 결과 반영 확인 (staging only)
    Given taxhan@theanchor.best으로 로그인 후 "/tax-history-management/basic-info"에 접근한다
    When 프로필 노출 토글을 ON으로 변경하고 저장한다
    Then 토글 상태가 ON으로 변경된다
    When 세무사 찾기에서 "가온세무법인"을 검색한다
    Then 검색 결과에 "한지희" 항목이 포함된다
    # ⚠️ 테스트 후 반드시 토글 OFF로 복원할 것
```

---

## 시나리오 D — 세무법인 역량 리포트 확인

> 계정: `official@gaon.com` | **P1** | Read-only

```gherkin
Feature: 시나리오 D — 세무법인 소유자의 역량 리포트 조회

  Background:
    Given 세무법인 소유자 김가온(official@gaon.com)이 로그인되어 있다
    And GNB 프로필 메뉴에 "세무 이력 리포트" 항목이 존재한다

  Scenario: D-1 세무 이력 리포트 페이지 로딩
    When GNB 프로필 메뉴 → "세무 이력 리포트"를 클릭한다
    Then "/tax-history-report/me"로 이동한다
    And 페이지가 오류 없이 로딩된다 (500/404 아님)

  Scenario: D-2 법인 역량 수치 섹션 확인
    Given "/tax-history-report/me"에 접근한다
    When 페이지가 로딩된다
    Then 법인 전체 역량 수치를 나타내는 섹션이 노출된다
    And 구성원 그룹 분류(1그룹/2그룹) 관련 정보가 렌더링된다
    # 데이터 의존: 가온세무법인 구성원 그룹 분류 데이터가 staging에 존재해야 함
```

---

## 시나리오 E — 법인 리포트 기반 포지셔닝 전략 변경

> 계정: `official@gaon.com` | **P1** | Read-only

```gherkin
Feature: 시나리오 E — 세무법인 특장점 확인 및 포지셔닝 전략

  Background:
    Given 세무법인 소유자 김가온(official@gaon.com)이 로그인되어 있다

  Scenario: E-1 법인 특장점 데이터 확인
    Given "/tax-history-report/me"에 접근한다
    When 페이지가 로딩된다
    Then 전문 영역별 실적 건수 또는 관련 세무사 수 정보가 렌더링된다
    And "상속·증여·승계" 관련 항목이 포함된다
    # 데이터 의존: 가온세무법인의 상속·증여·승계 실적 데이터가 존재해야 함

  Scenario: E-2 포지셔닝 전략 관련 UI 존재 확인
    Given "/tax-history-report/me"에 접근한다
    When 페이지가 로딩된다
    Then 법인의 전문 영역 분포를 나타내는 시각화 요소가 존재한다
    And 오류 없이 렌더링된다
```

---

## 시나리오 F — 납세자 유료 구독자의 세무사 추천 조회

> 계정: `ceo.kim@theanchor.best` | **P0** | Read-only

```gherkin
Feature: 시나리오 F — 세무조사 통지서 기반 세무사 추천 (납세자 유료)

  Background:
    Given 납세자 유료 구독자 김대표(ceo.kim@theanchor.best)가 로그인되어 있다
    And 홈 탭에 "현직 공무원 정보 탐색", "세무사 찾기" 탭 2개만 노출된다
    And "전직 공무원 찾기" 탭은 노출되지 않는다

  Scenario: F-1 김경국 조사관 검색
    Given 홈의 "현직 공무원 정보 탐색" 탭이 선택되어 있다
    When 공무원명 입력란에 "김경국"을 입력하고 검색 버튼을 클릭한다
    Then URL이 "/search/active-officials?name=김경국"으로 변경된다
    And "동대문세무서" 소속 "김경국" 조사관이 결과에 존재한다

  Scenario: F-2 김경국 프로필 — 추천 세무사 섹션 확인
    Given "/search/active-officials/3313"에 접근한다
    When 페이지가 로딩된다
    Then 페이지 제목에 "김경국"이 포함된다
    And "추천 세무사" 섹션이 노출된다
    And 추천 세무사 목록에 1명 이상이 포함된다
    # staging 확인 (2026-04-27): "추천 세무사 1: 박성호 세무사" 실제 존재 확인
    # 알고리즘 결과는 변동 가능하므로 "박성호" 고정 검증 대신 "1명 이상" 기준 사용

  Scenario: F-3 추천 세무사 프로필 확인
    Given "/search/active-officials/3313" 페이지에서 추천 세무사가 노출된다
    When 추천 세무사 항목에서 박성호 세무사 링크를 클릭한다
    Then 세무사 프로필 페이지("/search/tax-experts/{uuid}")로 이동한다
    And 박성호 세무사의 프로필 정보가 렌더링된다
    And 소속 "가온세무법인"이 표시된다
    # staging 확인: 박성호 UUID = 5032cae5-cb6f-4997-80c8-210f9d02edca
```

---

## 시나리오 G — 무료 구독자의 지역/전문 이력 기반 세무사 검색

> 계정: `choi@theanchor.best` | **P1** | Read-only

```gherkin
Feature: 시나리오 G — 지역 기반 세무사 검색 (납세자 무료)

  Background:
    Given 납세자 무료 구독자 최아무개(choi@theanchor.best)가 로그인되어 있다
    And 홈 탭에 "현직 공무원 정보 탐색", "세무사 찾기" 탭 2개만 노출된다
    And GNB 헤더에 "멤버십 안내" 버튼이 노출된다

  Scenario: G-1 광주 지역 세무사 검색
    Given 홈의 "세무사 찾기" 탭이 선택되어 있다
    When 소속 사무소 지역에서 "광주"를 선택한다
    And 검색 버튼을 클릭한다
    Then 세무사 검색 결과 페이지로 이동한다
    And 광주 지역 세무사 목록이 1명 이상 렌더링된다
    And 박성호 세무사(가온세무법인, 광주 서구)가 결과에 포함된다

  Scenario: G-2 전문 영역 필터 적용
    Given 세무사 검색 결과 페이지에 있다
    When 필터에서 "상속·증여·승계" 전문 영역을 선택한다
    Then 상속·증여·승계 전문 이력이 있는 세무사만 결과에 표시된다
    And 결과가 1명 이상이다

  Scenario: G-3 세무사 프로필 상세 확인
    Given 세무사 검색 결과에서 박성호 세무사가 노출된다
    When 박성호 세무사 항목을 클릭한다
    Then "/search/tax-experts/5032cae5-cb6f-4997-80c8-210f9d02edca"로 이동한다
    And 박성호 세무사의 프로필 정보가 렌더링된다
    And 전문 영역 태그에 "상속·증여·승계"가 포함된다
```

---

## 시나리오 인덱스

| 시나리오 | 등급 | 계정 | 데이터 변경 | 핵심 검증 포인트 |
|---|---|---|---|---|
| A-1~3 | P1 | bagseongho | ✗ | 김정희(5707) 검색·프로필·관계망 |
| B-1~3 | P1 | taxhan | ✗ | 김경국(3313) 검색·프로필·관계망 |
| C-1 | P2 | 비로그인 | ✗ | 한지희 미노출 확인 |
| C-2 | P2 | taxhan | ✗ | 세무 이력 관리 접근·토글 상태 |
| C-3 | P2 | taxhan | ✅ staging만 | 토글 ON 후 검색 노출 |
| D-1~2 | P1 | official | ✗ | 법인 역량 리포트 로딩·그룹 분류 |
| E-1~2 | P1 | official | ✗ | 전문 영역별 실적·시각화 |
| F-1 | P0 | ceo.kim | ✗ | 김경국(3313) 검색 |
| F-2 | P0 | ceo.kim | ✗ | 추천 세무사 섹션 존재 |
| F-3 | P0 | ceo.kim | ✗ | 박성호 프로필 접근 |
| G-1 | P1 | choi | ✗ | 광주 지역 세무사 검색 |
| G-2 | P1 | choi | ✗ | 전문 영역 필터 동작 |
| G-3 | P1 | choi | ✗ | 세무사 프로필 상세 |

---

## 알려진 이슈 및 테스트 작성 주의사항

| 이슈 | 영향 시나리오 | 대응 |
|---|---|---|
| 세무 이력 관리 진입 시 가이드 모달 자동 노출 | C-2 | `[data-testid="tax-history-modal-close-btn"]` 클릭 선행 |
| DEV 패널이 GNB 클릭 방해 가능 | 전체 | `page.evaluate()` 로 JS 클릭 또는 `force: true` 옵션 사용 |
| 검색 버튼 React controlled input | A-1, B-1, F-1 | `nativeInputValueSetter` 방식으로 입력 후 `input` 이벤트 dispatch |
| 검색 결과는 별도 URL로 이동 | A-1, B-1 | URL: `/search/active-officials?name=X` 패턴 확인 |
| 추천 세무사 알고리즘 결과 변동 가능 | F-2 | "박성호" 고정값 대신 "추천 세무사 1명 이상" 으로 유연하게 검증 |
| 한지희 UUID 미확인 | C-3 | 프로필 노출 후 이름으로 검색하여 UUID 동적 확인 |
