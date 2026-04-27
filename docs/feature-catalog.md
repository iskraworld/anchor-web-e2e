# docs/feature-catalog.md — Anchor 기능 카탈로그

> Phase 2 AI 자율 탐색 결과  
> 탐색일: 2026-04-28  
> 탐색 방법: Playwright MCP, 5개 계정 + 비로그인

---

## 1. 페이지 트리

| URL 패턴 | 페이지 제목 | 접근 가능 계정 |
|---|---|---|
| `/` | Anchor (홈) | 전체 |
| `/login` | 로그인 - Anchor | 전체 |
| `/signup/tax-professional` | 세무사/세무법인 가입 안내 | 비로그인 |
| `/privacy` | 개인정보처리방침 | 전체 |
| `/terms` | 이용약관 | 전체 |
| `/search/active-officials?name={name}` | 현직 공무원 검색 결과 | 세무사·납세자유료 |
| `/search/active-officials/{id}` | 현직 공무원 프로필 | 세무사·납세자유료 |
| `/search/retired-officials?name={name}` | 전직 공무원 검색 결과 | 세무사 |
| `/search/retired-officials/{id}` | 전직 공무원 프로필 | 세무사 |
| `/search/tax-experts?firmName={name}` | 세무사 찾기 결과 | 전체 |
| `/search/tax-experts?officeRegion={code}` | 세무사 찾기 결과 (지역) | 전체 |
| `/search/tax-experts/{uuid}` | 세무사 상세 프로필 | 전체 |
| `/tax-history-management/basic-info` | 세무이력관리 | 세무사 |
| `/tax-history-report/me` | 세무 이력 리포트 | 세무사·세무법인소유자 |
| `/tax-history-report/me?tab=corporate` | 세무 이력 리포트 (법인) | 세무법인 소속 세무사 |

---

## 2. 권한 매트릭스

| 기능 / 탭 | 비로그인 | 납세자(무료) | 납세자(유료) | 세무사 | 세무법인소유자 |
|---|---|---|---|---|---|
| 현직 공무원 탐색 탭 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 전직 공무원 찾기 탭 | ❌ | ❌ | ❌ | ✅ | ✅ |
| 세무사 찾기 탭 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 현직 공무원 프로필 상세 | ❌(blur?) | ❌ | ✅ | ✅ | ✅ |
| 관계망 찾기 (개인 기준) | ❌ | ❌ | ❌ | ✅(공무원출신) | ✅(공무원출신) |
| 관계망 찾기 (법인 전체) | ❌ | ❌ | ❌ | ✅ | ✅ |
| 세무사 프로필 추천 섹션 | ❌ | ❌ | ✅ | ❌ | ❌ |
| 세무이력관리 | ❌ | ❌ | ❌ | ✅ | ✅ |
| 세무이력 리포트 (개인) | ❌ | ❌ | ❌ | ✅ | ✅ |
| 세무이력 리포트 (법인) | ❌ | ❌ | ❌ | ✅(법인소속) | ✅ |
| 멤버십 안내 버튼 (GNB) | ✅ | ✅(gnb-membership-btn) | ❌ | ❌ | ❌ |
| 로그인/회원가입 버튼 | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 3. GNB (전역 내비게이션) 구조

### 비로그인
- 멤버십 안내, 로그인, 회원가입 버튼

### 납세자 무료 (choi@theanchor.best)
- `gnb-membership-btn`: 멤버십 안내
- `gnb-profile-btn`: 프로필 메뉴
- 홈 탭: 현직 공무원 정보 탐색, 세무사 찾기 (2개)

### 납세자 유료 (ceo.kim@theanchor.best)
- `gnb-profile-btn`: 프로필 메뉴
- 홈 탭: 현직 공무원 정보 탐색, 세무사 찾기 (2개)
- 멤버십 안내 버튼 없음

### 세무사 (bagseongho, taxhan)
- `gnb-profile-btn`: 프로필 메뉴
- 홈 탭: 현직 공무원 정보 탐색, **전직 공무원 찾기**, 세무사 찾기 (3개)
- 프로필 드롭다운: 세무 이력 관리(`gnb-tax-history-btn`), 세무 이력 리포트(`gnb-tax-report-btn`), 내 정보(`gnb-myinfo-btn`), 구독 관리(`gnb-subscription-btn`), 로그아웃(`gnb-logout-btn`)

### 세무법인 소유자 (official@gaon.com)
- 동일 구조 (세무사와 동일)

---

## 4. 페이지별 인터랙션 목록

### 4-1. 홈 (`/`)

**홈 검색 폼 (현직 공무원 탐색 탭)**
- `home-active-official-tab`: 탭 전환
- 소속(청/서), 소속(국실), 소속(과), 소속(팀), 직급, 직책: dropdown 필터
- 이름 입력: text input (data-testid 없음, placeholder "이름")
- `search-submit-btn`: 검색 (조건 없으면 disabled)
- `search-reset-btn`: 초기화

**홈 검색 폼 (세무사 찾기 탭)**
- `home-tax-expert-tab`: 탭 전환
- `search-firm-name-input`: 세무법인명 (React controlled)
- `search-expert-name-input`: 세무사명 (React controlled)
- 소속 사무소 지역 combobox (`[role="combobox"]`, 17개 지역)
- 소속 사무소 지역 상세 combobox (지역 선택 후 활성화)
- `search-submit-btn`: 검색

**홈 콘텐츠**
- 지역별 TOP10 세무법인 (서울 기본, 지역 변경 가능)
- 전문영역별 TOP10 세무법인 (세무조사 대응, 조세불복, 상속/증여·승계 탭)
- 최근 조회한 프로필 (로그인 시)

### 4-2. 현직 공무원 프로필 (`/search/active-officials/{id}`)

**프로필 섹션**
- 이름, 직급, 소속, 임용, 출생연도·출생지, 학력, 전화, 팩스
- 근무 이력 목록
- 조직도 보기 버튼

**공통 관계망 섹션**
- `mutual-section`: 전체 관계망 영역
- `mutual-section-title`: "공통 관계망 찾기" 제목
- `mutual-firm-member-filter`: 법인 구성원 필터 버튼 (전관 세무사=개인, 일반 세무사="전체 전체")
- 관계망 찾기 버튼: 결과 렌더링 트리거
- 결과 탭: 직접 관계 N, 공통 관계 N, 추천 인물 N
- 결과 서브탭: 공통 관계 N, 검색 결과 공무원 N
- `rf__wrapper`: React Flow 그래프 컨테이너
- `rf__node-left-{id}`: 세무사 노드
- `rf__node-center-{id}`: 중간(공통) 노드
- `rf__node-right-{id}`: 공무원 노드
- `mutual-relation-item`: 관계 상세 카드 (페이지네이션, 5개씩)
- 공무원 내 관계 섹션: 인사권자·동료 목록 (페이지 2에 인사권자 위치)
- 세무사와 공통 관계 전체 N, 공무원 내 공통 관계 전체 N 버튼
- 필터: 공무원 전체, 직급 전체, 직책 전체, 관계 전체

**납세자 유료 뷰 (추가 섹션)**
- 추천 세무사 섹션 (`/search/active-officials/{id}` 하단)
- 추천 세무사 목록 (박성호 등)

### 4-3. 세무사 찾기 (`/search/tax-experts`)

**검색 결과 필터 (사이드패널)**
- 전문 영역: 전체 / 세무조사 대응 / 조세불복 / 상속·증여·승계
- 세무 경력: 전체 / 만 5년 이상 / 만 10년 이상 / 만 15년 이상
- 출신 이력 / 주요 전문 자격: 전체 / 세무 공무원 / 조세심판원 / 유수 대학 / 석·박사
- 필터 적용: URL 변경 없음 (클라이언트 사이드)
- 결과 카운트: 세무사 N, 세무법인 N
- 페이지네이션: 10개씩

**세무사 카드**
- 이름, 출신(세무 공무원 출신), 소속 법인, 주소, 전문 영역 태그, 학교, 이메일, 전화

**URL 파라미터**
- `firmName`: 세무법인명 검색
- `officeRegion`: 지역 코드 (광주=REGION_29)
- `expertName`: 세무사명 검색

### 4-4. 세무사 상세 프로필 (`/search/tax-experts/{uuid}`)

- 전문 영역 배지(인증된 실적 기반)
- 근무 이력
- 실적 사례 (연도, 상세 분야, 산업 분야)
- 대외 전문 활동 (강의 이력)
- 이름, 특징 태그 (전직공무원 등), 경력, 소속 기관, 이메일, 전화, 학력
- 문의 버튼: **별도 버튼 없음** — footer "문의하기" 링크만 (https://forms.gle/placeholder)

### 4-5. 세무이력관리 (`/tax-history-management/basic-info`)

- 프로필 노출 토글 (`[role="switch"]`, testid 없음)
- 미리보기 버튼
- 탭: 기본 정보, 근무 이력, 실적 사례, 대외 전문 활동
- 가이드 모달: `data-testid="tax-history-guide-modal"`, 닫기 `data-testid="tax-history-modal-close-btn"`
- 하위: 석사/박사 학력사항, 초중고 동문 찾기 학력사항 섹션

### 4-6. 세무이력 리포트 (`/tax-history-report/me`)

**탭**
- 개인 프로필 리포트 (세무사)
- 법인 프로필 리포트 (`?tab=corporate`)

**법인 리포트 내용**
- 기본 정보 (설립연도, 주소, 대표 세무사)
- 소속 세무사 요약 (총 인원, 석박사, 경력, 공무원 출신 등)
- 전문 영역별 실적 (세무조사, 상속·증여, 조세불복, 세무검증)
- 산업 분야 TOP5
- 대외 전문 활동
- 필터: 전체, 멤버 전체 버튼
- **1그룹/2그룹 분류 없음** ← 시나리오 D-2/D-3 BLOCKED

---

## 5. 주요 data-testid 목록

| testid | 태그 | 설명 |
|---|---|---|
| `gnb-profile-btn` | button | GNB 프로필 메뉴 트리거 |
| `gnb-membership-btn` | button | 멤버십 안내 (무료 납세자, 비로그인) |
| `gnb-tax-history-btn` | button | 세무 이력 관리 메뉴 |
| `gnb-tax-report-btn` | button | 세무 이력 리포트 메뉴 |
| `gnb-myinfo-btn` | button | 내 정보 메뉴 |
| `gnb-subscription-btn` | button | 구독 관리 메뉴 |
| `gnb-logout-btn` | button | 로그아웃 |
| `home-active-official-tab` | button | 현직 공무원 정보 탐색 탭 |
| `home-retired-official-tab` | button | 전직 공무원 찾기 탭 |
| `home-tax-expert-tab` | button | 세무사 찾기 탭 |
| `search-submit-btn` | button | 검색 버튼 |
| `search-reset-btn` | button | 초기화 버튼 |
| `search-firm-name-input` | input | 세무법인명 입력 (React controlled) |
| `search-expert-name-input` | input | 세무사명 입력 (React controlled) |
| `auth-email-input` | input | 로그인 이메일 |
| `auth-password-input` | input | 로그인 비밀번호 |
| `mutual-section` | div | 공통 관계망 전체 섹션 |
| `mutual-section-title` | div | "공통 관계망 찾기" 제목 |
| `mutual-firm-member-filter` | button | 법인 구성원 필터 |
| `rf__wrapper` | div | React Flow 그래프 컨테이너 |
| `rf__node-left-{id}` | div | 세무사 노드 |
| `rf__node-center-{id}` | div | 공통 관계 노드 |
| `rf__node-right-{id}` | div | 공무원 노드 |
| `mutual-relation-item` | div | 관계 상세 카드 |
| `tax-history-guide-modal` | div | 세무이력관리 가이드 모달 |
| `tax-history-modal-close-btn` | button | 모달 닫기 |

---

## 6. 탐색 중 발견 못한 영역

- **전직 공무원 탐색** (`/search/retired-officials`): taxhan 계정에서 탐색하지 않음
- **내 정보** (`gnb-myinfo-btn` 클릭 후 페이지): 미탐색
- **구독 관리** (`gnb-subscription-btn`): 미탐색
- **조직도 보기**: 클릭하지 않음 (별도 모달/페이지 예상)
- **세무이력관리 하위 탭** (근무 이력, 실적 사례, 대외 전문 활동): 기본 정보만 탐색
- **비로그인 현직 공무원 검색**: blur 처리 여부 미확인
- **무료 납세자의 현직 공무원 프로필**: 접근 제한 여부 미확인
- **알림 기능** (`button "알림"`): 내용 미탐색

---

## 7. 실측 데이터 (2026-04-28 기준)

| 인물 | 유형 | ID/UUID | 소속 | 비고 |
|---|---|---|---|---|
| 김경국 | 현직 공무원 | `3313` | 동대문세무서 조사과 조사팀 6급 조사관 | ✅ |
| 김정희 | 현직 공무원 | `5707` | 서울청 성실납세지원국 소득재산세과 재산 6급 조사관 | ✅ |
| 김진범 | 현직 공무원 | `6045` | 서울청 성실납세지원국 소득재산세과 재산 5급 팀장 | ✅ A-4 인사권자 |
| 최승일 | 현직 공무원 | `16528` | 서울청 성실납세지원국 소득재산세과 4급 과장 | ✅ A-4 인사권자 |
| 김수희 | 현직 공무원 | `4722` | (가온세무법인·김경국 양쪽 관계) | ✅ B-4 핵심 인물 |
| 박성호 | 세무사 | `5032cae5-cb6f-4997-80c8-210f9d02edca` | 금융분석원 소속 | ✅ |
| 박시준 | 세무사 | `bf57b29e-edb4-4bf2-a361-12cbb5fd0da4` | 가온세무법인 | ✅ |
| 한지희 | 세무사 | `2149aa48-d0af-4437-b978-f02644c9baad` | 가온세무법인 | ⚠️ 토글 현재 ON |
