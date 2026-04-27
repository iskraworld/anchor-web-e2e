# app.context.md — Anchor 앱 구조

> 생성일: 2026-04-27 | 탐색 계정: 5개

---

## 비로그인 페이지 트리

| URL | 페이지명 | 비고 |
|---|---|---|
| `/` | 홈 | 검색 탭 2개 (현직 공무원 탐색, 세무사 찾기), TOP10 섹션 2개 |
| `/login` | 로그인 | 이메일/비밀번호 폼 |
| `/signup/individual` | 일반 개인 회원가입 | 약관 동의 + 계정 정보 입력 폼 |
| `/signup/tax-professional` | 세무사 및 세무법인 가입 안내 | 정적 안내 페이지 |
| `/find-email` | 이메일 찾기 | - |
| `/find-password` | 비밀번호 찾기 | - |
| `/privacy` | 개인정보처리방침 | 404 (미구현) |
| `/terms` | 이용약관 | 404 (미구현) |

### 홈 (비로그인) 구조
- 헤더: 멤버십 안내 버튼, 로그인 버튼, 회원가입 버튼
- 검색 탭: "현직 공무원 정보 탐색", "세무사 찾기" (탭 2개)
  - 현직 공무원 탭: 공무원명 검색 입력
  - 세무사 찾기 탭: 세무법인명, 세무사명, 소속 사무소 지역 선택
- 하단 섹션: 지역별 TOP10 세무법인, 전문영역별 TOP10 세무법인
- Footer: 개인정보처리방침, 이용약관, 문의하기(forms.gle)

---

## 계정별 접근 가능 페이지

### 전관 세무사 (bagseongho@gaon.com)
**프로필**: 박성호 / 가온세무법인 소속 / 세무사 번호 123192

**홈 탭 구조**: 탭 3개
- 현직 공무원 정보 탐색
- 전직 공무원 찾기
- 세무사 찾기

**GNB 프로필 메뉴**:
- 세무 이력 관리 (`gnb-tax-history-btn`) → `/tax-history-management/basic-info`
- 세무 이력 리포트 (`gnb-tax-report-btn`) → `/tax-history-report/me`
- 내 정보 (`gnb-myinfo-btn`) → `/my-info`
- 구독 관리 Team (`gnb-subscription-btn`) → `/subscription`
- 구독 멤버십 안내
- 문의하기
- 로그아웃 (`gnb-logout-btn`)

**접근 가능 페이지**:
| URL | 페이지명 |
|---|---|
| `/tax-history-management/basic-info` | 세무 이력 관리 - 기본 정보 |
| `/tax-history-management/work-history` | 세무 이력 관리 - 근무 이력 |
| `/tax-history-management/performance` | 세무 이력 관리 - 실적 사례 |
| `/tax-history-management/activities` | 세무 이력 관리 - 대외 전문 활동 |
| `/tax-history-report/me` | 세무 이력 리포트 |
| `/my-info` | 내 정보 (세무사 정보 + 소속 법인 정보 + 계정 정보) |
| `/subscription` | 구독 관리 |
| `/search/active-officials/{id}` | 현직 공무원 프로필 |
| `/search/retired-officials/{id}` | 전직 공무원 프로필 |
| `/search/tax-experts/{uuid}` | 세무사 프로필 |
| `/search/recent-profiles` | 최근 조회한 프로필 (500 오류) |

---

### 일반 세무사 (taxhan@theanchor.best)
**프로필**: 한지희 / 가온세무법인 소속 / 세무사 번호 432353

**홈 탭 구조**: 탭 3개 (전관 세무사와 동일)
- 현직 공무원 정보 탐색
- 전직 공무원 찾기
- 세무사 찾기

**GNB 프로필 메뉴**: 전관 세무사와 동일
- 세무 이력 관리, 세무 이력 리포트, 내 정보, 구독 관리 Team, 구독 멤버십 안내, 문의하기, 로그아웃

**접근 가능 페이지**: 전관 세무사와 동일 URL 패턴

**내 정보 섹션**: 세무사 정보 + 소속 법인 정보 + 계정 정보 (전관 세무사와 동일)

---

### 세무법인 소유자 (official@gaon.com)
**프로필**: 김가온 / 가온세무법인 소유자 (비세무사)

**홈 탭 구조**: 탭 3개 (세무사와 동일)
- 현직 공무원 정보 탐색
- 전직 공무원 찾기
- 세무사 찾기

**GNB 프로필 메뉴**: 세무사와 다름 (세무 이력 관리 없음, 법인 멤버 관리 추가)
- 세무 이력 리포트 (`gnb-tax-report-btn`) → `/tax-history-report/me`
- 법인 멤버 관리 (`gnb-corp-member-btn`) → `/corporate-member-management/links`
- 내 정보 (`gnb-myinfo-btn`) → `/my-info`
- 구독 관리 Team (`gnb-subscription-btn`) → `/subscription`
- 구독 멤버십 안내
- 문의하기
- 로그아웃 (`gnb-logout-btn`)

**접근 가능 페이지**:
| URL | 페이지명 |
|---|---|
| `/corporate-member-management/links` | 법인 멤버 관리 - 연동 관리 |
| `/corporate-member-management/groups` | 법인 멤버 관리 - 그룹 관리 |
| `/tax-history-report/me` | 세무 이력 리포트 |
| `/my-info` | 내 정보 (소속 법인 정보 + 계정 정보, 세무사 정보 없음) |
| `/subscription` | 구독 관리 |

---

### 납세자 유료 구독 (ceo.kim@theanchor.best)
**프로필**: 김대표 / 팀: 김대표's Team (팀 소유자)

**홈 탭 구조**: 탭 2개 (전직 공무원 찾기 탭 없음)
- 현직 공무원 정보 탐색
- 세무사 찾기

**GNB 프로필 메뉴**: 세무사 관련 항목 없음
- 팀 멤버 관리 → `/corporate-member-management/links`
- 내 정보 (`gnb-myinfo-btn`) → `/my-info`
- 구독 관리 Team (`gnb-subscription-btn`) → `/subscription`
- 구독 멤버십 안내
- 문의하기
- 로그아웃 (`gnb-logout-btn`)

**접근 가능 페이지**:
| URL | 페이지명 |
|---|---|
| `/corporate-member-management/links` | 팀 멤버 관리 - 연동 관리 |
| `/corporate-member-management/groups` | 팀 멤버 관리 - 그룹 관리 |
| `/my-info` | 내 정보 (소속 팀 정보 + 계정 정보) |
| `/subscription` | 구독 관리 (유료 구독 플랜 + 결제 내역 탭) |

**내 정보 섹션**: 소속 팀 정보 (`myinfo-team-label`) + 계정 정보

---

### 납세자 무료 구독 (choi@theanchor.best)
**프로필**: 최아무개

**홈 탭 구조**: 탭 2개 (납세자 유료와 동일)
- 현직 공무원 정보 탐색
- 세무사 찾기

**GNB**: 헤더에 "멤버십 안내" 버튼(`gnb-membership-btn`) 추가 노출

**GNB 프로필 메뉴**: 팀 멤버 관리 없음, 구독 유도 문구 포함
- 내 정보 (`gnb-myinfo-btn`) → `/my-info`
- 구독 관리 (버튼 부제: "앵커를 구독하고 더 많은 인물을 찾아보세요") → `/subscription`
- 구독 멤버십 안내
- 문의하기
- 로그아웃 (`gnb-logout-btn`)

**접근 가능 페이지**:
| URL | 페이지명 |
|---|---|
| `/my-info` | 내 정보 (계정 정보만, 팀/법인 정보 없음) |
| `/subscription` | 구독 관리 (빈 상태: "구독중인 유료 멤버십이 없습니다") |

**내 정보 섹션**: 계정 정보만 (`myinfo-email-label`, `myinfo-password-label`, `myinfo-name-label`, `myinfo-phone-label`)

---

## 전체 페이지 트리 (URL 기준)

| URL 패턴 | 페이지명 | 접근 가능 역할 | 정적/동적 |
|---|---|---|---|
| `/` | 홈 | 전체 | 동적 |
| `/login` | 로그인 | 비로그인 | 정적 |
| `/signup/individual` | 일반 개인 회원가입 | 비로그인 | 정적 |
| `/signup/tax-professional` | 세무사/세무법인 가입 안내 | 비로그인 | 정적 |
| `/find-email` | 이메일 찾기 | 비로그인 | 정적 |
| `/find-password` | 비밀번호 찾기 | 비로그인 | 정적 |
| `/tax-history-management/basic-info` | 세무 이력 관리 - 기본 정보 | 세무사 | 동적 |
| `/tax-history-management/work-history` | 세무 이력 관리 - 근무 이력 | 세무사 | 동적 |
| `/tax-history-management/performance` | 세무 이력 관리 - 실적 사례 | 세무사 | 동적 |
| `/tax-history-management/activities` | 세무 이력 관리 - 대외 전문 활동 | 세무사 | 동적 |
| `/tax-history-report/me` | 세무 이력 리포트 | 세무사, 세무법인 소유자 | 동적 |
| `/corporate-member-management/links` | 법인/팀 멤버 관리 - 연동 관리 | 세무법인 소유자, 납세자 유료 | 동적 |
| `/corporate-member-management/groups` | 법인/팀 멤버 관리 - 그룹 관리 | 세무법인 소유자, 납세자 유료 | 동적 |
| `/my-info` | 내 정보 | 전체 (로그인) | 동적 |
| `/subscription` | 구독 관리 | 전체 (로그인) | 동적 |
| `/search/active-officials/{id}` | 현직 공무원 프로필 | 세무사, 세무법인 소유자 | 동적 |
| `/search/retired-officials/{id}` | 전직 공무원 프로필 | 세무사, 세무법인 소유자 | 동적 |
| `/search/tax-experts/{uuid}` | 세무사 상세 프로필 | 전체 (로그인) | 동적 |
| `/search/recent-profiles` | 최근 조회한 프로필 | 세무사 (500 오류 확인됨) | 동적 |
| `/privacy` | 개인정보처리방침 | 전체 | 404 미구현 |
| `/terms` | 이용약관 | 전체 | 404 미구현 |

---

## 역할별 GNB 차이 요약

| 메뉴 항목 | 전관 세무사 | 일반 세무사 | 세무법인 소유자 | 납세자 유료 | 납세자 무료 |
|---|---|---|---|---|---|
| 멤버십 안내 (헤더) | - | - | - | - | O (`gnb-membership-btn`) |
| 세무 이력 관리 | O | O | - | - | - |
| 세무 이력 리포트 | O | O | O | - | - |
| 법인 멤버 관리 | - | - | O | - | - |
| 팀 멤버 관리 | - | - | - | O | - |
| 내 정보 | O | O | O | O | O |
| 구독 관리 | O (Team) | O (Team) | O (Team) | O (Team) | O (유도 문구) |
| 구독 멤버십 안내 | O | O | O | O | O |
| 문의하기 | O | O | O | O | O |

---

## 홈 탭 구조 역할별 차이

| 탭 | 전관 세무사 | 일반 세무사 | 세무법인 소유자 | 납세자 유료 | 납세자 무료 | 비로그인 |
|---|---|---|---|---|---|---|
| 현직 공무원 정보 탐색 | O | O | O | O | O | O |
| 전직 공무원 찾기 | O | O | O | - | - | - |
| 세무사 찾기 | O | O | O | O | O | O |

---

## 내 정보 섹션 역할별 차이

| 섹션 | 전관 세무사 | 일반 세무사 | 세무법인 소유자 | 납세자 유료 | 납세자 무료 |
|---|---|---|---|---|---|
| 세무사 정보 (`myinfo-tax-license-label`) | O | O | - | - | - |
| 소속 법인 정보 (`myinfo-firm-label`) | O | O | O | - | - |
| 소속 팀 정보 (`myinfo-team-label`) | - | - | - | O | - |
| 계정 정보 | O | O | O | O | O |

---

## 주요 selector 후보

| 페이지 | selector | 용도 |
|---|---|---|
| `/login` | `[data-testid="auth-email-input"]` | 이메일 입력 |
| `/login` | `[data-testid="auth-password-input"]` | 비밀번호 입력 |
| `/login` | `[data-testid="auth-login-btn"]` | 로그인 버튼 |
| `/login` | `[data-testid="auth-find-email-link"]` | 이메일 찾기 링크 |
| `/login` | `[data-testid="auth-find-password-link"]` | 비밀번호 찾기 링크 |
| `/login` | `[data-testid="auth-individual-signup-link"]` | 일반 회원가입 링크 |
| `/login` | `[data-testid="auth-tax-expert-signup-link"]` | 세무사 가입 안내 링크 |
| `/signup/individual` | `[data-testid="auth-email-input"]` | 이메일 입력 |
| `/signup/individual` | `[data-testid="auth-password-input"]` | 비밀번호 입력 |
| `/signup/individual` | `[data-testid="auth-password-confirm-input"]` | 비밀번호 확인 입력 |
| `/signup/individual` | `[data-testid="auth-phone-input"]` | 휴대폰 번호 입력 |
| `/signup/individual` | `[data-testid="auth-signup-btn"]` | 가입하기 버튼 |
| `/signup/individual` | `[data-testid="auth-terms-all-checkbox"]` | 전체 약관 동의 |
| 홈 (공통) | `[data-testid="gnb-profile-btn"]` | GNB 프로필 메뉴 열기 |
| 홈 (공통) | `[data-testid="gnb-logout-btn"]` | 로그아웃 |
| 홈 (공통) | `[data-testid="gnb-myinfo-btn"]` | 내 정보 이동 |
| 홈 (공통) | `[data-testid="gnb-subscription-btn"]` | 구독 관리 이동 |
| 홈 (세무사) | `[data-testid="gnb-tax-history-btn"]` | 세무 이력 관리 이동 |
| 홈 (세무사) | `[data-testid="gnb-tax-report-btn"]` | 세무 이력 리포트 이동 |
| 홈 (세무법인) | `[data-testid="gnb-corp-member-btn"]` | 법인 멤버 관리 이동 |
| 홈 (납세자 무료) | `[data-testid="gnb-membership-btn"]` | 멤버십 안내 (GNB 노출) |
| 홈 (로그인) | `[data-testid="home-search-greeting"]` | 인사말 h1 |
| 홈 | `[data-testid="home-active-official-tab"]` | 현직 공무원 탭 |
| 홈 | `[data-testid="home-retired-official-tab"]` | 전직 공무원 탭 (세무사/법인만) |
| 홈 | `[data-testid="home-tax-expert-tab"]` | 세무사 찾기 탭 |
| 홈 | `[data-testid="search-name-input"]` | 공무원명 검색 입력 |
| 홈 | `[data-testid="search-firm-name-input"]` | 세무법인명 검색 입력 |
| 홈 | `[data-testid="search-expert-name-input"]` | 세무사명 검색 입력 |
| 홈 | `[data-testid="search-region-select"]` | 소속 사무소 지역 선택 |
| 홈 | `[data-testid="search-submit-btn"]` | 검색 버튼 |
| 홈 | `[data-testid="search-reset-btn"]` | 검색 초기화 버튼 |
| 홈 | `[data-testid="home-ranking-section"]` | TOP10 섹션 헤딩 (h2) |
| `/tax-history-management/*` | `[data-testid="tax-history-guide-modal"]` | 가이드 모달 (진입 시 노출) |
| `/tax-history-management/*` | `[data-testid="tax-history-modal-close-btn"]` | 가이드 모달 닫기 |
| `/tax-history-management/*` | `[data-testid="tax-history-profile-toggle"]` | 프로필 노출 토글 |
| `/tax-history-management/*` | `[data-testid="tax-history-preview-btn"]` | 미리보기 버튼 |
| `/tax-history-management/*` | `[data-testid="tax-history-basic-tab"]` | 기본 정보 탭 |
| `/tax-history-management/*` | `[data-testid="tax-history-work-tab"]` | 근무 이력 탭 |
| `/tax-history-management/*` | `[data-testid="tax-history-achievement-tab"]` | 실적 사례 탭 |
| `/tax-history-management/*` | `[data-testid="tax-history-activity-tab"]` | 대외 전문 활동 탭 |
| `/search/retired-officials/{id}` | `[data-testid="search-retired-official-tab"]` | 전직 공무원 탭 버튼 |
| `/search/retired-officials/{id}` | `[data-testid="profile-mutual-section"]` | 연관 관계 섹션 |
| `/search/retired-officials/{id}` | `[data-testid="profile-sort-select"]` | 관계 정렬 선택 |
| `/search/retired-officials/{id}` | `[data-testid="profile-common-network-section"]` | 공통 관계망 섹션 |
| `/search/retired-officials/{id}` | `[data-testid="profile-network-btn"]` | 관계망 찾기 버튼 |
| `/search/active-officials/{id}` | `[data-testid="mutual-firm-member-filter"]` | 공통 인맥 필터 (소속 구성원) |
| `/my-info` | `[data-testid="myinfo-tax-license-label"]` | 세무사 번호 표시 |
| `/my-info` | `[data-testid="myinfo-firm-label"]` | 소속 법인 정보 |
| `/my-info` | `[data-testid="myinfo-team-label"]` | 소속 팀 정보 (납세자) |
| `/my-info` | `[data-testid="myinfo-email-label"]` | 로그인 이메일 |
| `/my-info` | `[data-testid="myinfo-password-label"]` | 비밀번호 변경 |
| `/my-info` | `[data-testid="myinfo-name-label"]` | 이름 |
| `/my-info` | `[data-testid="myinfo-phone-label"]` | 휴대폰 번호 |
| `/my-info` | `[data-testid="myinfo-withdraw-btn"]` | 회원탈퇴 버튼 |
| `/subscription` | `[data-testid="subscription-current-tab"]` | 유료 구독 플랜 탭 |
| `/subscription` | `[data-testid="subscription-payment-tab"]` | 결제 내역 탭 (납세자 유료만 확인) |
| `/subscription` | `[data-testid="subscription-empty-state"]` | 빈 상태 메시지 |
| `/subscription` | `[data-testid="subscription-guide-link"]` | 멤버십 안내 링크 |

---

## 주의사항

- **DEV 패널** (우하단 빨간 버튼): 클릭 금지. 페이지 진입 시 열려 있을 수 있어 프로필 메뉴 클릭 방해 가능 → JS evaluate로 `[data-testid="gnb-profile-btn"]` 직접 클릭 필요
- **가이드 모달**: `/tax-history-management/*` 진입 시 `[data-testid="tax-history-guide-modal"]` 자동 노출 → `[data-testid="tax-history-modal-close-btn"]` 클릭으로 닫기
- **검색 결과**: 홈에서 검색 버튼 클릭 시 URL 변경 없이 같은 페이지에 결과 인라인 렌더링
- **`/search/recent-profiles`**: 서버 500 오류 (탐색 시점 기준)
- **데이터 생성·삭제·결제 버튼**: 클릭 금지
