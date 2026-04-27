# scenarios-from-exploration.md — AI 자율 탐색 기반 QA 시나리오

> Phase 2 탐색 결과 기반  
> 탐색일: 2026-04-28  
> 원본: `docs/feature-catalog.md`

---

## 발견 못한 영역 (탐색 한계)

- 전직 공무원 탐색 (`/search/retired-officials`) — taxhan 계정으로 미탐색
- 내 정보 (`gnb-myinfo-btn`) — 미탐색
- 구독 관리 (`gnb-subscription-btn`) — 미탐색
- 조직도 보기 (별도 모달/페이지) — 클릭 미시도
- 세무이력관리 하위 탭 (근무이력, 실적사례, 대외전문활동) — basic-info만 탐색
- 비로그인 현직 공무원 검색 — blur 처리 여부 미확인
- 무료 납세자 현직 공무원 프로필 접근 — 제한 여부 미확인
- 알림 기능 — 내용 미탐색
- 결제·구독 액션 — 안전 규칙으로 진입 안 함

---

## A. Authentication (FN-AUTH)

### FN-AUTH-001: 전관 세무사 로그인 성공
- **계정**: bagseongho@gaon.com
- **전제**: 로그인 페이지 (`/login`)
- **검증**:
  - `auth-email-input`에 이메일 입력 가능
  - `auth-password-input`에 비밀번호 입력 가능
  - 로그인 버튼 클릭 후 `/` 또는 홈으로 이동
  - GNB에 `gnb-profile-btn` 노출됨
  - 홈 탭: 현직/전직/세무사 3개 탭

### FN-AUTH-002: 일반 세무사 로그인 성공
- **계정**: taxhan@theanchor.best
- **검증**:
  - 로그인 성공 후 홈 이동
  - GNB에 `gnb-profile-btn` 노출됨
  - 홈 탭: 현직/전직/세무사 3개 탭

### FN-AUTH-003: 세무법인 소유자 로그인 성공
- **계정**: official@gaon.com
- **검증**:
  - 로그인 성공 후 홈 이동
  - GNB에 `gnb-profile-btn` 노출됨
  - 홈 탭: 현직/전직/세무사 3개 탭

### FN-AUTH-004: 납세자 유료 로그인 성공
- **계정**: ceo.kim@theanchor.best
- **검증**:
  - 로그인 성공 후 홈 이동
  - GNB에 `gnb-profile-btn` 노출됨
  - 홈 탭: 현직/세무사 2개 탭만 (전직 없음)
  - `gnb-membership-btn` 없음

### FN-AUTH-005: 납세자 무료 로그인 성공
- **계정**: choi@theanchor.best
- **검증**:
  - 로그인 성공 후 홈 이동
  - GNB에 `gnb-membership-btn` 노출됨
  - 홈 탭: 현직/세무사 2개 탭만 (전직 없음)

### FN-AUTH-006: 로그아웃 후 로그인 페이지 리다이렉트
- **계정**: 임의 (bagseongho 사용)
- **전제**: 로그인 상태
- **검증**:
  - `gnb-profile-btn` 클릭 → `gnb-logout-btn` 노출
  - `gnb-logout-btn` 클릭 → `/login` 리다이렉트
  - `gnb-profile-btn` 없음 (로그아웃 완료)

### FN-AUTH-007: 잘못된 비밀번호 로그인 실패
- **전제**: 로그인 페이지
- **검증**:
  - 유효한 이메일 + 틀린 비밀번호 입력
  - 로그인 버튼 클릭 후 에러 메시지 노출
  - 홈으로 이동하지 않음

---

## B. Navigation (FN-NAV)

### FN-NAV-001: 홈 페이지 200 OK (비로그인)
- **검증**: `/` 접근 시 페이지 타이틀 "Anchor" 포함, 콘솔 에러 0개

### FN-NAV-002: 로그인 페이지 200 OK
- **검증**: `/login` 접근 시 `auth-email-input` 존재, 콘솔 에러 0개

### FN-NAV-003: 현직 공무원 프로필 페이지 200 OK
- **계정**: bagseongho (세무사 권한)
- **검증**: `/search/active-officials/3313` 콘솔 에러 0개

### FN-NAV-004: 세무사 프로필 페이지 200 OK
- **검증**: `/search/tax-experts/5032cae5-cb6f-4997-80c8-210f9d02edca` 200 OK, 콘솔 에러 0개

### FN-NAV-005: 세무이력관리 페이지 200 OK
- **계정**: taxhan (세무사 권한)
- **검증**: `/tax-history-management/basic-info` 200 OK, 콘솔 에러 0개

### FN-NAV-006: 세무이력 리포트 페이지 200 OK
- **계정**: official (세무법인 소유자)
- **검증**: `/tax-history-report/me` 200 OK, 콘솔 에러 0개

### FN-NAV-007: GNB 세무이력관리 링크 작동
- **계정**: bagseongho
- **검증**: `gnb-profile-btn` → `gnb-tax-history-btn` 클릭 → `/tax-history-management/basic-info` 이동

### FN-NAV-008: GNB 세무이력 리포트 링크 작동
- **계정**: bagseongho
- **검증**: `gnb-profile-btn` → `gnb-tax-report-btn` 클릭 → `/tax-history-report/me` 이동

### FN-NAV-009: 홈 현직 공무원 탭 전환
- **검증**: `home-active-official-tab` 클릭 → 검색 폼 전환, 이름 placeholder 존재

### FN-NAV-010: 홈 세무사 찾기 탭 전환
- **검증**: `home-tax-expert-tab` 클릭 → `search-firm-name-input`, `search-expert-name-input` 노출

### FN-NAV-011: 개인정보처리방침 페이지 200 OK
- **검증**: `/privacy` 200 OK, 콘솔 에러 0개

### FN-NAV-012: 이용약관 페이지 200 OK
- **검증**: `/terms` 200 OK, 콘솔 에러 0개

---

## C. Search (FN-SEARCH)

### FN-SEARCH-001: 공무원명 검색 — 결과 1건 이상
- **계정**: bagseongho
- **검증**:
  - 홈 현직 공무원 탭에서 이름 "김경국" 입력
  - `search-submit-btn` 클릭
  - URL `/search/active-officials?name=김경국` 포함
  - 결과 1건 이상

### FN-SEARCH-002: 공무원명 검색 — 빈 결과
- **계정**: bagseongho
- **검증**:
  - 이름 "존재하지않는공무원xyz123" 입력
  - 검색 결과 0건 또는 "결과 없음" 메시지 노출

### FN-SEARCH-003: 공무원 검색 초기화 버튼
- **계정**: bagseongho
- **검증**:
  - 검색 조건 입력 후 `search-reset-btn` 클릭
  - 입력 필드 초기화됨

### FN-SEARCH-004: 세무사 법인명 검색 — 결과 1건 이상
- **검증**:
  - `home-tax-expert-tab` → `search-firm-name-input`에 "가온세무법인" 입력 (React 이벤트 방식)
  - `search-submit-btn` 클릭
  - URL `/search/tax-experts?firmName=가온세무법인` 포함
  - 결과 1건 이상

### FN-SEARCH-005: 세무사 지역 검색 — 광주
- **검증**:
  - `home-tax-expert-tab` → 소속 사무소 지역 combobox에서 "광주" 선택
  - `search-submit-btn` 클릭
  - URL `/search/tax-experts?officeRegion=REGION_29` 포함
  - 결과 1건 이상

### FN-SEARCH-006: 세무사 검색 필터 — 전문 영역
- **검증**:
  - 세무사 검색 결과 페이지에서 "상속·증여·승계" 필터 클릭
  - 결과 카운트 변경 또는 필터 태그 적용 확인
  - URL 변경 없음 (클라이언트 사이드 필터)

### FN-SEARCH-007: 세무사 검색 페이지네이션
- **검증**:
  - 세무사 검색 결과가 11건 이상인 경우 페이지네이션 노출
  - 다음 페이지 버튼 클릭 시 결과 변경

---

## D. Forms (FN-FORM)

### FN-FORM-001: 홈 현직 공무원 검색 폼 — 빈 입력 시 버튼 비활성화
- **검증**:
  - 홈 현직 공무원 탭에서 아무 입력 없이 `search-submit-btn` 확인
  - 버튼 disabled 상태 또는 클릭 불가

### FN-FORM-002: 로그인 폼 — 빈 이메일 입력
- **검증**:
  - `auth-email-input` 비움, `auth-password-input` 입력
  - 로그인 시도 → 에러 메시지 또는 폼 validation 노출

### FN-FORM-003: 로그인 폼 — 잘못된 이메일 형식
- **검증**:
  - `auth-email-input`에 "notanemail" 입력
  - 에러 메시지 또는 HTML5 validation 노출

### FN-FORM-004: 세무이력관리 가이드 모달 닫기
- **계정**: taxhan
- **검증**:
  - `/tax-history-management/basic-info` 접근 시 `tax-history-guide-modal` 노출
  - `tax-history-modal-close-btn` 클릭 → 모달 닫힘
  - 페이지 인터랙션 가능 상태

### FN-FORM-005: 세무이력관리 프로필 노출 토글 존재 확인
- **계정**: taxhan
- **검증**:
  - 가이드 모달 닫은 후 `[role="switch"]` 토글 요소 존재
  - 현재 상태(ON/OFF) 확인 가능

---

## E. Permissions (FN-PERM)

### FN-PERM-001: 전직 공무원 탭 — 납세자 미노출
- **계정**: choi@theanchor.best (납세자 무료)
- **검증**:
  - 홈 탭에 `home-retired-official-tab` 없음

### FN-PERM-002: 전직 공무원 탭 — 납세자 유료 미노출
- **계정**: ceo.kim@theanchor.best (납세자 유료)
- **검증**:
  - 홈 탭에 `home-retired-official-tab` 없음

### FN-PERM-003: 전직 공무원 탭 — 세무사에게 노출
- **계정**: bagseongho (세무사)
- **검증**:
  - 홈 탭에 `home-retired-official-tab` 노출됨

### FN-PERM-004: 세무이력관리 — 납세자 접근 불가
- **계정**: choi@theanchor.best
- **검증**:
  - GNB 프로필 드롭다운에 `gnb-tax-history-btn` 없음
  - 직접 URL `/tax-history-management/basic-info` 접근 시 리다이렉트 또는 접근 거부

### FN-PERM-005: 추천 세무사 섹션 — 납세자 유료만 노출
- **계정**: ceo.kim@theanchor.best
- **검증**:
  - `/search/active-officials/3313` 접근 시 "추천 세무사" 섹션 노출

### FN-PERM-006: 추천 세무사 섹션 — 세무사 미노출
- **계정**: bagseongho
- **검증**:
  - `/search/active-officials/3313` 접근 시 "추천 세무사" 섹션 없음 (공통 관계망 섹션만 노출)

### FN-PERM-007: 멤버십 안내 버튼 — 무료 납세자에게만 노출
- **계정**: choi@theanchor.best
- **검증**: GNB에 `gnb-membership-btn` 노출됨

### FN-PERM-008: 멤버십 안내 버튼 — 유료 납세자 미노출
- **계정**: ceo.kim@theanchor.best
- **검증**: GNB에 `gnb-membership-btn` 없음

---

## F. Empty/Error States (FN-STATE)

### FN-STATE-001: 공무원 검색 결과 없음 처리
- **검증**:
  - 존재하지 않는 공무원명으로 검색
  - 결과 0건 UI 또는 안내 메시지 노출
  - 콘솔 에러 없음

### FN-STATE-002: 404 페이지 처리
- **검증**:
  - 존재하지 않는 URL (예: `/nonexistent-page-xyz`) 접근
  - 404 또는 Not Found 관련 UI 노출 (에러 없는 graceful 처리)

### FN-STATE-003: 비로그인 상태에서 보호 페이지 접근
- **검증**:
  - 비로그인 상태로 `/tax-history-management/basic-info` 직접 접근
  - `/login`으로 리다이렉트

### FN-STATE-004: 현직 공무원 프로필 — 비로그인 접근
- **검증**:
  - 비로그인 상태로 `/search/active-officials/3313` 직접 접근
  - 로그인 페이지 리다이렉트 또는 콘텐츠 blur 처리

---

## G. Visual Regression (VR)

> 베이스라인 저장 위치: `tests/visual/baselines/`

### VR-001: 홈 페이지 — 비로그인
- URL: `/`
- 스크린샷: `home-logged-out.png`

### VR-002: 홈 페이지 — 세무사 (전관)
- 계정: bagseongho
- 스크린샷: `home-tax-official.png`

### VR-003: 홈 페이지 — 납세자 무료
- 계정: choi
- 스크린샷: `home-taxpayer-free.png`

### VR-004: 현직 공무원 검색 결과
- 계정: bagseongho, 검색어 "김경국"
- 스크린샷: `search-official-result.png`

### VR-005: 현직 공무원 프로필 — 세무사 뷰
- 계정: bagseongho, URL `/search/active-officials/3313`
- 스크린샷: `official-profile-tax.png`

### VR-006: 현직 공무원 프로필 — 납세자 유료 뷰
- 계정: ceo.kim, URL `/search/active-officials/3313`
- 스크린샷: `official-profile-taxpayer.png`

### VR-007: 세무사 검색 결과 — 가온세무법인
- 스크린샷: `search-tax-expert-gaon.png`

### VR-008: 세무사 프로필 상세 — 박성호
- URL `/search/tax-experts/5032cae5-cb6f-4997-80c8-210f9d02edca`
- 스크린샷: `tax-expert-profile-baksungho.png`

### VR-009: 세무이력관리 페이지
- 계정: taxhan
- 스크린샷: `tax-history-management.png`

### VR-010: 세무이력 리포트 — 법인 탭
- 계정: official
- 스크린샷: `tax-history-report-corporate.png`

---

## H. Domain-Specific (FN-DOMAIN)

### FN-DOMAIN-001: 공통 관계망 그래프 — React Flow 렌더링
- **계정**: bagseongho
- **URL**: `/search/active-officials/5707`
- **검증**:
  - "관계망 찾기" 버튼 클릭
  - `rf__wrapper` 요소 노출됨
  - `rf__node-left-*`, `rf__node-right-*` 노드 1개 이상

### FN-DOMAIN-002: 공통 관계망 그래프 — 노드 클릭
- **계정**: bagseongho
- **검증**:
  - `rf__node-*` 클릭 시 `mutual-relation-item` 상세 노출

### FN-DOMAIN-003: 법인 전체 기준 관계망 필터
- **계정**: taxhan
- **URL**: `/search/active-officials/3313`
- **검증**:
  - `mutual-firm-member-filter` 버튼 클릭 가능
  - 클릭 후 관계망 결과 범위 변경 (전체/개인 전환)

### FN-DOMAIN-004: 추천 세무사 알고리즘 결과 — 목록 카드 렌더링
- **계정**: ceo.kim
- **URL**: `/search/active-officials/3313`
- **검증**:
  - "추천 세무사" 섹션 내 세무사 카드 1개 이상
  - 각 카드에 이름, 소속 정보 포함

### FN-DOMAIN-005: 세무사 검색 전문 영역 배지
- **URL**: `/search/tax-experts/5032cae5-cb6f-4997-80c8-210f9d02edca`
- **검증**:
  - 전문 영역 배지(태그) 1개 이상 노출
  - "상속·증여·승계" 포함

### FN-DOMAIN-006: 법인 리포트 — 전문 영역 차트 렌더링
- **계정**: official
- **URL**: `/tax-history-report/me`
- **검증**:
  - 전문 영역별 실적 섹션 노출
  - 차트 또는 수치 요소 렌더링 확인

### FN-DOMAIN-007: 세무이력 리포트 법인 탭 전환
- **계정**: official
- **검증**:
  - `/tax-history-report/me` → 법인 탭 클릭 → `?tab=corporate` URL
  - 법인 기본 정보(설립연도, 대표 세무사 등) 섹션 노출

---

## 시나리오 우선순위 요약

| 카테고리 | ID 범위 | P0 수량 | 메모 |
|---|---|---|---|
| FN-AUTH | 001~007 | 7 | 전 계정 로그인·로그아웃 |
| FN-NAV | 001~012 | 12 | 주요 페이지 200 OK |
| FN-SEARCH | 001~007 | 7 | 검색·필터·페이지네이션 |
| FN-FORM | 001~005 | 5 | 폼 validation + 모달 |
| FN-PERM | 001~008 | 8 | 권한별 접근 매트릭스 |
| FN-STATE | 001~004 | 4 | 빈 결과·404·비로그인 |
| VR | 001~010 | 10 | 베이스라인 스크린샷 |
| FN-DOMAIN | 001~007 | 7 | Anchor 도메인 특화 |
| **합계** | | **60** | |
