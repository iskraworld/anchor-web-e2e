# AMBIGUOUS_DOC 일괄 리뷰 리포트

생성: 2026-05-05T23:44:16.606Z
전체: **154건**

---

## 요약 — 카테고리 × 신뢰도

| 카테고리 | T1 (75%+) | T2 (60~70%) | T3 (≤55%) | T? | 합계 |
| --- | ---: | ---: | ---: | ---: | ---: |
| docs 기대 결과 비어있음 | 0 | 12 | 0 | 0 | **12** |
| docs 원문 인용 (표현 모호) | 7 | 30 | 0 | 50 | **87** |
| 환경/storage state 의존 | 0 | 5 | 0 | 0 | **5** |
| 사전 데이터/픽스처 필요 | 0 | 2 | 9 | 5 | **16** |
| UI 동작 명세 모호 | 2 | 1 | 0 | 0 | **3** |
| 기타 | 0 | 13 | 3 | 15 | **31** |
| **합계** | **9** | **63** | **12** | **70** | **154** |

## 모듈 분포

| 모듈 | 건수 |
| --- | ---: |
| TA | 26 |
| EI | 24 |
| GO | 22 |
| SP | 17 |
| EO | 15 |
| HOME-TA | 13 |
| HOME-TP | 13 |
| TF | 13 |
| AUTH | 6 |
| MY | 5 |

## 결정 옵션 (그룹별 일괄 적용)

각 그룹별로 다음 중 선택:
- **A) 강한 단언 보강** — AI 해석이 맞으면 spec에 강한 단언 추가, AMBIGUOUS_DOC 마크 제거
- **B) docs 명확화 요청** — anchor 팀에 docs 갱신 요청 (anchor v2 작성 시 반영 가능)
- **C) [B] BLOCKED 확정** — `test.skip` + reason="docs 부족" — 신서비스 v2에서 재검토
- **D) 케이스별** — 위 일괄 적용 부적합, 항목별 개별 결정

---

## 상세 (카테고리 × 신뢰도 정렬)

### [EMPTY/T2] docs 기대 결과 비어있음 — T2 (60~70%) — 해석 검토 필요 (12건)

**판단**: A / B / C / D

| TC ID | 모듈 | docs 기대 | AI 해석 | 신뢰도 | 위치 |
| --- | --- | --- | --- | ---: | --- |
| SP-0-04 | SP | (매핑 없음) | "화면 접근" 표현은 페이지 진입 + 핵심 요소 visible로 해석 | 60% | tests/qa/sp/sp.spec.ts:87 |
| SP-0-05 | SP | (매핑 없음) | "화면 접근"을 페이지 진입 + Team 멤버십 정보 visible로 해석 | 60% | tests/qa/sp/sp.spec.ts:99 |
| SP-0-06 | SP | (매핑 없음) | 구독 취소 상태이므로 종료/만료 안내 또는 화면 진입 visible로 해석 | 60% | tests/qa/sp/sp.spec.ts:110 |
| SP-0-10 | SP | (매핑 없음) | 구독 취소 상태이므로 종료 안내 또는 화면 핵심 영역 visible로 해석 | 60% | tests/qa/sp/sp.spec.ts:156 |
| SP-0-14 | SP | (매핑 없음) | 구독 취소 상태이므로 종료 안내 또는 화면 핵심 영역 visible로 해석 | 60% | tests/qa/sp/sp.spec.ts:195 |
| SP-0-15 | SP | (매핑 없음) | 세무법인 관리자 Team 구독 상태이므로 Team 멤버십 정보 visible로 해석 | 60% | tests/qa/sp/sp.spec.ts:206 |
| SP-0-16 | SP | (매핑 없음) | 구독 취소 상태이므로 종료/만료 안내 또는 화면 진입 visible로 해석 | 60% | tests/qa/sp/sp.spec.ts:217 |
| SP-0-17 | SP | (매핑 없음) | 팀 구성원 Team 구독 상태이므로 변경·해지 불가 안내 또는 Team 정보 visible로 해석 | 60% | tests/qa/sp/sp.spec.ts:228 |
| SP-0-18 | SP | (매핑 없음) | 구독 취소 상태이므로 종료/만료 안내 또는 화면 진입 visible로 해석 | 60% | tests/qa/sp/sp.spec.ts:239 |
| SP-0-21 | SP | (매핑 없음) | 구독 취소 상태이므로 종료/만료 안내 또는 화면 진입 visible로 해석 | 60% | tests/qa/sp/sp.spec.ts:292 |
| SP-0-22 | SP | (매핑 없음) | Team 구독 상태이므로 Team 멤버십 정보 visible로 해석 | 60% | tests/qa/sp/sp.spec.ts:303 |
| SP-0-24 | SP | (매핑 없음) | 구독 취소 상태이므로 종료/만료 안내 또는 화면 진입 visible로 해석 | 60% | tests/qa/sp/sp.spec.ts:324 |

### [QUOTE/T1] docs 원문 인용 (표현 모호) — T1 (75%+) — 해석 신뢰 가능 (7건)

**판단**: A / B / C / D

| TC ID | 모듈 | docs 기대 | AI 해석 | 신뢰도 | 위치 |
| --- | --- | --- | --- | ---: | --- |
| GO-1-02 | GO | 선택 메뉴 펼쳐짐 | listbox/menu role 또는 옵션 노출로 해석 | 75% | tests/qa/go/go.spec.ts:240 |
| GO-1-04 | GO | 해당 청/서의 국실 목록 표시 | listbox/option 노출로 해석 | 75% | tests/qa/go/go.spec.ts:279 |
| GO-1-06 | GO | 해당 국실의 과 목록 표시 | listbox/option 노출로 해석 | 75% | tests/qa/go/go.spec.ts:324 |
| GO-1-09 | GO | 직급 메뉴 펼쳐짐. 단독 선택 가능 | option/listbox 노출로 해석 | 75% | tests/qa/go/go.spec.ts:402 |
| GO-1-10 | GO | 직책 메뉴 펼쳐짐. 단독 선택 가능 | option/listbox 노출로 해석 | 75% | tests/qa/go/go.spec.ts:422 |
| GO-1-19 | GO | "법인전체 - 본인"으로 설정 | UI 텍스트 노출로 해석 | 75% | tests/qa/go/go.spec.ts:626 |
| GO-1-20 | GO | "법인전체 - 전체"로 설정 | UI 텍스트 노출로 해석 | 75% | tests/qa/go/go.spec.ts:657 |

### [QUOTE/T2] docs 원문 인용 (표현 모호) — T2 (60~70%) — 해석 검토 필요 (30건)

**판단**: A / B / C / D

| TC ID | 모듈 | docs 기대 | AI 해석 | 신뢰도 | 위치 |
| --- | --- | --- | --- | ---: | --- |
| EO-1-05 | EO | 선택한 청/서에 해당하는 국실 목록이 표시된다. 선택 후 하위 필터(소속 과)가 활성화된다. | 활성화 판정 메커니즘 모호. 신뢰도 70%. | 70% | tests/qa/eo/eo.spec.ts:294 |
| EO-1-06 | EO | 선택한 국실(또는 세무서)에 해당하는 과 목록이 표시된다. 선택 후 하위 필터(소속 팀)가 활성화된다. | 사전 조건(상위 필터 자동 선택) 흐름이 docs에 자세히 명시되지 않음. 신뢰도 60%. | 60% | tests/qa/eo/eo.spec.ts:338 |
| EO-1-07 | EO | 선택한 과에 해당하는 팀 목록이 표시된다. | 정확한 팀 옵션 텍스트 패턴 모호. 신뢰도 65%. | 65% | tests/qa/eo/eo.spec.ts:386 |
| GO-1-03 | GO | 소속(국실) 활성화 | 다음 필터(국실)가 enabled 또는 클릭 가능 상태로 해석 | 70% | tests/qa/go/go.spec.ts:260 |
| GO-1-05 | GO | 소속(과) 활성화 | 과 필터 enabled 상태로 해석 | 70% | tests/qa/go/go.spec.ts:303 |
| GO-1-07 | GO | 소속(팀) 활성화 | 팀 필터 enabled 상태로 해석 | 65% | tests/qa/go/go.spec.ts:347 |
| GO-1-08 | GO | 해당 과의 팀 목록 표시 | listbox/option 노출로 해석 | 70% | tests/qa/go/go.spec.ts:374 |
| GO-1-16 | GO | 공무원 내 인맥 관계 분석 결과 표시 | 그래프/리스트/관계 영역 노출로 해석 | 70% | tests/qa/go/go.spec.ts:552 |
| GO-1-18 | GO | 법인 소속 그룹/개별 인물 선택 가능. 공무원 출신만 드롭다운에 노출 | option 노출로 해석 | 70% | tests/qa/go/go.spec.ts:602 |
| GO-1-21 | GO | 전체보기 화면으로 전환 | URL 변경 또는 확장된 그래프 영역 노출로 해석 | 65% | tests/qa/go/go.spec.ts:688 |
| GO-1-37 | GO | 현직 공무원 정보 탐색 탭 활성 상태 | aria-selected/active class로 해석 | 70% | tests/qa/go/go.spec.ts:897 |
| GO-1-40 | GO | 화살표 노출 | 행 내부 svg/icon/arrow class 노출로 해석 | 65% | tests/qa/go/go.spec.ts:921 |
| GO-1-52 | GO | 필터 영역 숨김 | 검색 버튼/필터의 visible 상태가 false로 변경되는 것으로 해석 | 65% | tests/qa/go/go.spec.ts:986 |
| GO-1-53 | GO | 필터 영역 다시 표시 | 검색 버튼이 viewport 내 visible로 복귀하는 것으로 해석 | 70% | tests/qa/go/go.spec.ts:1014 |
| GO-2-14 | GO | 스크롤바 노출 | overflow scroll 영역의 scrollHeight > clientHeight로 해석 | 70% | tests/qa/go/go.spec.ts:1312 |
| TA-1-18 | TA | 10건씩 표시 | 가드 결합: 페이지 진입 → 탭 → 검색 → 카드 수 검증 + 가드. 신뢰도 60%. | 60% | tests/qa/ta/ta.spec.ts:447 |
| TA-1-20 | TA | 출신 배지가 표시된다 | 배지 selector가 명시되지 않음. 텍스트 키워드로 추정 . | 65% | tests/qa/ta/ta.spec.ts:487 |
| TA-1-21 | TA | 배지 형태로 표시된다 | 배지 selector가 명시되지 않음 . | 65% | tests/qa/ta/ta.spec.ts:506 |
| TA-2-11 | TA | 등록된 사진이 표시된다 | 사진 selector 명시 없음. img/avatar 추정 . | 70% | tests/qa/ta/ta.spec.ts:683 |
| TA-2-14 | TA | 총 경력 연수가 표시된다 | N년/N개월 패턴으로 추정 . | 70% | tests/qa/ta/ta.spec.ts:708 |
| TA-2-15 | TA | 조세심판원 출신 직책이 표시된다 | 텍스트 키워드 추정 . | 65% | tests/qa/ta/ta.spec.ts:716 |
| TA-2-16 | TA | 국가 공인 자격명이 표시된다 | 자격/자격증 키워드 추정 . | 65% | tests/qa/ta/ta.spec.ts:724 |
| TA-2-17 | TA | 기관명과 구분이 표시된다 | 교수/강사/강의 키워드 추정 . | 65% | tests/qa/ta/ta.spec.ts:732 |
| TA-2-19 | TA | 박사, 석사, 학사 순서로 표시 | 학력 영역 검출 + 박사가 학사보다 위에 위치한지 검증 . | 60% | tests/qa/ta/ta.spec.ts:759 |
| TA-2-20 | TA | 제목과 내용이 표시된다 | 자기소개 영역 selector 추정 . | 65% | tests/qa/ta/ta.spec.ts:783 |
| TA-2-21 | TA | 배지 형태로 표시 | 배지 selector 추정 . | 70% | tests/qa/ta/ta.spec.ts:791 |
| TA-2-22 | TA | 해당 전문 영역에 인증 뱃지 표시 | 인증/승인 키워드 추정 . | 60% | tests/qa/ta/ta.spec.ts:806 |
| TA-2-24 | TA | 공무원 태그가 표시된다 | 공무원 키워드로 추정 . | 70% | tests/qa/ta/ta.spec.ts:823 |
| TA-2-25 | TA | 등록된 실적 사례가 표시된다 | 실적/사례 키워드 추정 . | 65% | tests/qa/ta/ta.spec.ts:831 |
| TA-2-26 | TA | 등록된 대외 활동이 표시된다 | 대외 활동 키워드 추정 . | 65% | tests/qa/ta/ta.spec.ts:839 |

### [QUOTE/T?] docs 원문 인용 (표현 모호) — T? — 신뢰도 미표기 (50건)

**판단**: A / B / C / D

| TC ID | 모듈 | docs 기대 | AI 해석 | 신뢰도 | 위치 |
| --- | --- | --- | --- | ---: | --- |
| EI-0-02 | EI | 화면 표시. 프로필 노출/리포트 추출 제한 | docs "프로필 노출/리포트 추출 제한"이 토글 disabled인지 별도 안내인지 명시되지 않음. | - | tests/qa/ei/ei.spec.ts:88 |
| EI-1-07 | EI | 선택 영역이 화면에 반영 | 전문 영역 선택 UI(패널/완료 버튼) 식별 어려움. | - | tests/qa/ei/ei.spec.ts:234 |
| EI-1-20 | EI | 이탈 확인 팝업. 확인 시 변경사항 버림. 취소 시 유지 | beforeunload 이벤트 트리거 방법 모호. | - | tests/qa/ei/ei.spec.ts:330 |
| EI-1-36 | EI | 이탈 확인 팝업 표시 | beforeunload 이벤트 자동화 어려움. | - | tests/qa/ei/ei.spec.ts:430 |
| EI-5-11 | EI | 검증 상태 변경 알림 발송. 바로가기 링크 포함 | 알림 발송은 백엔드 이벤트 의존. | - | tests/qa/ei/ei.spec.ts:1016 |
| EI-5-12 | EI | 해당 이력 관리 화면으로 직접 이동 | 알림 데이터 사전 필요. | - | tests/qa/ei/ei.spec.ts:1029 |
| EI-5-13 | EI | 세무 이력 관리 작성 유도 알림 표시 | 최초 가입 직후 상태 재현 어려움(현 storageState는 기존 계정). | - | tests/qa/ei/ei.spec.ts:1041 |
| EO-1-03 | EO | 선택한 값이 표시된다. 하위 필터(소속 국실)가 활성화된다. | 활성화 판정이 enabled 속성인지 클릭 가능 상태인지 모호. | - | tests/qa/eo/eo.spec.ts:218 |
| EO-1-04 | EO | 세무서에는 국이 없으므로, 소속 국 없음을 선택하면 소속(과)가 활성화된다. | docs "세무서에는 국이 없으므로 국 없음 선택 시 과 활성화" — | - | tests/qa/eo/eo.spec.ts:253 |
| EO-1-14 | EO | 행 호버 시 화살표가 노출된다. | 화살표 셀렉터(svg/icon/text) 모호. | - | tests/qa/eo/eo.spec.ts:562 |
| EO-1-21 | EO | 관계 많은 순으로 정렬되어 표시된다. | 관계 수 컬럼의 정확한 위치/포맷이 모호. | - | tests/qa/eo/eo.spec.ts:629 |
| EO-1-22 | EO | 4급 이상 인맥 인원수와 직책별 인맥 인원수가 함께 표시된다. 모든 직책 인원수가 0인 경우는 노출되지 않는 | 컬럼 헤더 정확한 텍스트 모호. | - | tests/qa/eo/eo.spec.ts:659 |
| EO-1-23 | EO | 단일값으로 선택된 소속이 강조 표시된다. | 강조 메커니즘(굵은 글씨/색상/배지) 모호. | - | tests/qa/eo/eo.spec.ts:696 |
| EO-1-24 | EO | 호버 시 전체 텍스트가 노출된다. | tooltip / title attr / popover 중 어느 메커니즘인지 모호. | - | tests/qa/eo/eo.spec.ts:724 |
| EO-1-25 | EO | 다음 페이지의 검색 결과가 표시된다. 이전/다음 페이지 이동이 정상 동작한다. | 페이지 변화의 정확한 시그널 모호. | - | tests/qa/eo/eo.spec.ts:746 |
| EO-1-27 | EO | 사용자 이름과 안내 문구가 표시된다. | 정확한 영역 셀렉터/문구 패턴 모호. | - | tests/qa/eo/eo.spec.ts:806 |
| EO-2-18 | EO | 비공무원 출신 세무사는 대상과 공통 관계 판별이 불가하여 대상의 추천 인물만 표시된다. | '추천 인물' UI 셀렉터 및 | - | tests/qa/eo/eo.spec.ts:1342 |
| EO-2-19 | EO | 법인 소속 인물 또는 그룹을 선택하여 비교할 수 있다. 공무원 출신 세무사인 경우 본인을 기본 비교 대상으로 | 비교 대상 선택 UI(드롭다운/탭) 모호. | - | tests/qa/eo/eo.spec.ts:1364 |
| EO-2-20 | EO | 비공무원 출신이므로 법인 전체를 기본으로 설정한다. 법인 내 인물과 조회 대상 간 관계를 조회할 수 있다. | 기본 선택 표시 메커니즘(라벨/체크/하이라이트) 모호. | - | tests/qa/eo/eo.spec.ts:1385 |
| GO-1-17 | GO | 공무원 출신: 본인 기준 공통 관계 표시/비공무원 출신: 미표시 | docs "본인 기준 공통 관계 표시"가 어떤 UI 요소인지 모호. | - | tests/qa/go/go.spec.ts:578 |
| GO-1-22 | GO | 조건에 따라 결과 필터링 | docs "조건에 따라 결과 필터링"이 행 수 변화인지 결과 변화인지 모호. | - | tests/qa/go/go.spec.ts:716 |
| GO-1-34 | GO | 전체 텍스트 노출 | docs "전체 텍스트 노출" 메커니즘 모호 (tooltip / title attr / popover). | - | tests/qa/go/go.spec.ts:824 |
| HOME-TA-1-34 | HOME-TA | 최근 조회 프로필 전체보기 화면(3-4)으로 이동 | 전용 URL/testId가 진단에 없음. | - | tests/qa/home-ta/home-ta.spec.ts:341 |
| HOME-TA-2-07 | HOME-TA | 문의 채널로 연결 | 외부 새 창(카카오톡/이메일) vs 내부 페이지 라우트 모호. | - | tests/qa/home-ta/home-ta.spec.ts:646 |
| HOME-TA-2-06 | HOME-TA | 법인 멤버 관리 화면으로 이동 | 전용 URL 패턴이 진단에 없음. | - | tests/qa/home-ta/home-ta.spec.ts:703 |
| HOME-TA-3-32 | HOME-TA | 인증 화면으로 이동 | 인증 라우트(/cert /verify /auth/cert 등) 명시 없음. | - | tests/qa/home-ta/home-ta.spec.ts:977 |
| HOME-TA-4-01 | HOME-TA | 전체 목록 표시 | 전체보기 화면의 testId/URL 패턴이 진단에 없음. | - | tests/qa/home-ta/home-ta.spec.ts:1104 |
| HOME-TA-4-02 | HOME-TA | 현직 공무원 프로필 상세로 이동 | 전체보기 화면 + 카드 testId 미정. | - | tests/qa/home-ta/home-ta.spec.ts:1129 |
| HOME-TA-4-03 | HOME-TA | 전직 공무원 프로필 상세로 이동 | 전체보기 화면 + 카드 testId 미정. | - | tests/qa/home-ta/home-ta.spec.ts:1159 |
| HOME-TA-4-04 | HOME-TA | 세무사 프로필 상세로 이동 | 전체보기 화면 + 카드 testId 미정. | - | tests/qa/home-ta/home-ta.spec.ts:1182 |
| HOME-TA-4-05 | HOME-TA | 홈 화면으로 복귀 | 전체보기 진입점이 없을 수도 있어 뒤로가기가 noop이 될 가능성. | - | tests/qa/home-ta/home-ta.spec.ts:1205 |
| HOME-TA-4-11 | HOME-TA | 최근 조회 순서대로 정렬 | 정렬 기준 timestamp는 DOM에서 직접 확인 불가. | - | tests/qa/home-ta/home-ta.spec.ts:1245 |
| HOME-TA-4-12 | HOME-TA | 이름, 소속, 직급, 직책 | 개별 testId 미정. | - | tests/qa/home-ta/home-ta.spec.ts:1264 |
| HOME-TA-4-13 | HOME-TA | 이름, 은퇴 당시 소속, 직급, 직책 | 개별 testId 미정. | - | tests/qa/home-ta/home-ta.spec.ts:1287 |
| HOME-TA-4-14 | HOME-TA | 이름, 소속 법인, 소개 메세지 | 개별 testId 미정. | - | tests/qa/home-ta/home-ta.spec.ts:1309 |
| HOME-TP-4-11 | HOME-TP | 최근 조회 순서대로 정렬 | 정렬 기준 데이터(조회 timestamp) UI에 | - | tests/qa/home-tp/home-tp.spec.ts:1166 |
| HOME-TP-4-12 | HOME-TP | 이름, 소속, 직급, 직책 | 카드 내부 필드별 testId 미정의. | - | tests/qa/home-tp/home-tp.spec.ts:1195 |
| HOME-TP-4-13 | HOME-TP | 이름, 은퇴 당시 소속, 직급, 직책 | 카드 필드 testId 미정의. | - | tests/qa/home-tp/home-tp.spec.ts:1217 |
| MY-1-15 | MY | 전화번호가 저장되고 모달이 닫힌다 | 본인인증/SMS 단계가 있는지 모호. | - | tests/qa/my/my.spec.ts:537 |
| MY-1-33 | MY | 인라인 에러가 표시된다 | 인증번호 발송 후 잘못 입력하는 흐름. | - | tests/qa/my/my.spec.ts:750 |
| MY-1-36 | MY | 주소가 공란으로 저장된다 | 적용 후 결과 (저장 완료/모달 닫힘) 모호. | - | tests/qa/my/my.spec.ts:802 |
| MY-1-39 | MY | 현재 비밀번호와 일치하지않는다는 인라인 에러가 표시된다 | 변경 시도(저장 클릭) 후 서버 응답에서 에러. | - | tests/qa/my/my.spec.ts:858 |
| TA-0-07 | TA | 세무 대리인 프로필이 표시된다. | docs "프로필 상세로 이동 → 세무 대리인 프로필이 표시된다" | - | tests/qa/ta/ta.spec.ts:109 |
| TA-0-10 | TA | 세무 대리인 프로필이 표시된다. | docs "프로필 상세로 이동 → 세무 대리인 프로필이 표시된다" | - | tests/qa/ta/ta.spec.ts:141 |
| TA-1-09 | TA | 세무법인 결과로 전환. 필터 조건 유지 | 결과 전환을 어떻게 식별하는지 모호. | - | tests/qa/ta/ta.spec.ts:264 |
| TA-1-10 | TA | 세무사 결과로 전환. 필터 조건 유지 | 어떻게 결과 전환을 식별하는지 모호. | - | tests/qa/ta/ta.spec.ts:288 |
| TA-1-13 | TA | 웹사이트 링크가 표시된다 | docs "웹사이트 등록된 세무법인 카드 호버 → 웹사이트 링크 표시" | - | tests/qa/ta/ta.spec.ts:335 |
| TA-2-01 | TA | 상세 정보가 표시된다. 데이터 없는 항목은 없음 표시 | docs "상세 정보가 표시된다. 데이터 없는 항목은 없음 표시" | - | tests/qa/ta/ta.spec.ts:607 |
| TA-2-04 | TA | URL이 클립보드에 복사된다 | Playwright에서 clipboard 권한이 환경마다 달라 | - | tests/qa/ta/ta.spec.ts:631 |
| TA-2-27 | TA | 데이터 없는 항목은 없음 표시 | 어떤 항목이 비었는지 알 수 없으므로 | - | tests/qa/ta/ta.spec.ts:848 |

### [ENV/T2] 환경/storage state 의존 — T2 (60~70%) — 해석 검토 필요 (5건)

**판단**: A / B / C / D

| TC ID | 모듈 | docs 기대 | AI 해석 | 신뢰도 | 위치 |
| --- | --- | --- | --- | ---: | --- |
| TF-0-07 | TF | 진입 가능. Team 플랜 구독 유도 안내 표시 | firm-owner storage state가 미구독 상태인지 환경 의존. | 65% | tests/qa/tf/tf.spec.ts:39 |
| TF-0-08 | TF | 연동 관리만 제공. 그룹 관리 비활성. 재구독 안내 표시 | firm-owner storage state가 구독취소 상태인지 환경 의존. | 65% | tests/qa/tf/tf.spec.ts:63 |
| TF-1-14 | TF | Team 플랜 구독 유도 안내 + 구독 링크 표시 | firm-owner storage state가 미구독 상태인지 환경 의존. | 65% | tests/qa/tf/tf.spec.ts:475 |
| TF-1-15 | TF | 그룹 관리 비활성. 초대 영역 제거. + 전체 연동 해제 버튼 | firm-owner storage state가 구독취소 상태인지 환경 의존. | 65% | tests/qa/tf/tf.spec.ts:504 |
| TF-2-21 | TF | 빈 상태 안내 | 그룹이 1개 이상 존재하면 빈 상태 안내가 노출되지 않음. | 65% | tests/qa/tf/tf.spec.ts:948 |

### [PRECONDITION/T2] 사전 데이터/픽스처 필요 — T2 (60~70%) — 해석 검토 필요 (2건)

**판단**: A / B / C / D

| TC ID | 모듈 | docs 기대 | AI 해석 | 신뢰도 | 위치 |
| --- | --- | --- | --- | ---: | --- |
| HOME-TP-4-03 | HOME-TP | 전직 공무원 프로필 상세로 이동 | 시드 데이터 없으면 카드 0건 | 70% | tests/qa/home-tp/home-tp.spec.ts:1077 |
| HOME-TP-4-04 | HOME-TP | 세무사 프로필 상세로 이동 | 시드 데이터 없으면 카드 0건 | 70% | tests/qa/home-tp/home-tp.spec.ts:1109 |

### [PRECONDITION/T3] 사전 데이터/픽스처 필요 — T3 (≤55%) — 신뢰 낮음 (9건)

**판단**: A / B / C / D

| TC ID | 모듈 | docs 기대 | AI 해석 | 신뢰도 | 위치 |
| --- | --- | --- | --- | ---: | --- |
| EI-4-14 | EI | 검증 진행중 목록에 추가 | 출판계약서+ISBN 픽스처 + 모달 트리거 식별 필요. 페이지 노출/404 명확화로 대체 | 50% | tests/qa/ei/ei.spec.ts:864 |
| EI-4-15 | EI | 제출 건 철회 | 검증 진행중 항목 사전 데이터 필요. 페이지 노출/404 명확화로 대체 | 50% | tests/qa/ei/ei.spec.ts:874 |
| EI-4-16 | EI | 재업로드를 통해 재제출 가능 | 반려 항목 사전 데이터 필요. 페이지 노출/404 명확화로 대체 | 50% | tests/qa/ei/ei.spec.ts:884 |
| EI-4-17 | EI | 보완 자료 제출 가능 | 보완 요청 항목 사전 데이터 필요. 페이지 노출/404 명확화로 대체 | 50% | tests/qa/ei/ei.spec.ts:894 |
| EI-4-21 | EI | 각 탭에 정확한 건수 | 검증 상태 탭별 건수 검증은 사전 데이터 필요. 페이지 노출/404 명확화로 대체 | 50% | tests/qa/ei/ei.spec.ts:904 |
| EI-4-22 | EI | 등록일, 파일, 년도, 상세 직책, 상태. 철회 버튼 | 검증 진행중 목록 사전 데이터 필요. 페이지 노출/404 명확화로 대체 | 50% | tests/qa/ei/ei.spec.ts:914 |
| EI-4-23 | EI | 등록일, 파일, 강의 기간, 기관, 강의명/내용. 철회 버튼 | 검증 진행중 목록 사전 데이터 필요. 페이지 노출/404 명확화로 대체 | 50% | tests/qa/ei/ei.spec.ts:924 |
| EI-4-24 | EI | 반려/보완 사유 + D-day 표시 | 반려/보완 항목 사전 데이터 필요. 페이지 노출/404 명확화로 대체 | 50% | tests/qa/ei/ei.spec.ts:934 |
| EI-4-32 | EI | 파일 크기 에러 | 10MB 초과 픽스처 + 모달 트리거 식별 필요. 페이지 노출/404 명확화로 대체 | 40% | tests/qa/ei/ei.spec.ts:959 |

### [PRECONDITION/T?] 사전 데이터/픽스처 필요 — T? — 신뢰도 미표기 (5건)

**판단**: A / B / C / D

| TC ID | 모듈 | docs 기대 | AI 해석 | 신뢰도 | 위치 |
| --- | --- | --- | --- | ---: | --- |
| EI-1-34 | EI | 파일 크기 에러. 업로드 미진행 | 파일 input 트리거 흐름이 모달 종속이라 미디어 픽스처 + 트리거 위치 식별 필요. | - | tests/qa/ei/ei.spec.ts:406 |
| EI-1-35 | EI | 파일 형식 에러. 업로드 미진행 | DOCX 픽스처 트리거 위치 식별 어려움. | - | tests/qa/ei/ei.spec.ts:418 |
| EI-4-08 | EI | 검증 진행중 목록에 추가 | 모달 입력+제출 흐름은 픽스처+필드 식별 필요. | - | tests/qa/ei/ei.spec.ts:794 |
| HOME-TP-4-01 | HOME-TP | 전체 목록 표시 | 사전조건 "최근 조회 1건 이상" 미충족 시 | - | tests/qa/home-tp/home-tp.spec.ts:1007 |
| HOME-TP-4-02 | HOME-TP | 현직 공무원 프로필 상세로 이동 | 시드 데이터 없으면 카드 0건. | - | tests/qa/home-tp/home-tp.spec.ts:1043 |

### [UI/T1] UI 동작 명세 모호 — T1 (75%+) — 해석 신뢰 가능 (2건)

**판단**: A / B / C / D

| TC ID | 모듈 | docs 기대 | AI 해석 | 신뢰도 | 위치 |
| --- | --- | --- | --- | ---: | --- |
| AUTH-2-12 | AUTH | 세무사/세무법인 전용 플랜 구분 표시 | 탭 클릭이 새창/탭전환인지 staging 동작 의존. 새창 또는 동일창에서 플랜 텍스트 검증. | 75% | tests/qa/auth/auth.spec.ts:222 |
| TF-1-22 | TF | 해제 불가. 비활성화 또는 차단 | 소유자 행의 "연동 해제" 버튼이 disabled 인지 아예 렌더되지 않는지 명시 안됨. | 75% | tests/qa/tf/tf.spec.ts:565 |

### [UI/T2] UI 동작 명세 모호 — T2 (60~70%) — 해석 검토 필요 (1건)

**판단**: A / B / C / D

| TC ID | 모듈 | docs 기대 | AI 해석 | 신뢰도 | 위치 |
| --- | --- | --- | --- | ---: | --- |
| SP-1-23 | SP | ~~비활성화 상태이다~~ | docs는 deprecated(~~삭제~~)이지만 spec은 active. "결제 수단 추가 버튼 상태"를 버튼 visible/disabled  | 60% | tests/qa/sp/sp.spec.ts:912 |

### [OTHER/T2] 기타 — T2 (60~70%) — 해석 검토 필요 (13건)

**판단**: A / B / C / D

| TC ID | 모듈 | docs 기대 | AI 해석 | 신뢰도 | 위치 |
| --- | --- | --- | --- | ---: | --- |
| AUTH-2-02 | AUTH | 새 창에서 세무사/세무법인 전용 Basic, Pro, Team 플랜 비교 정보 표시 | docs는 "새 창" 표기지만 staging 동작은 동일 창 탭 전환일 수 있음. | 70% | tests/qa/auth/auth.spec.ts:170 |
| AUTH-4-12 | AUTH | 회원가입 유형 선택 화면(3-5)으로 이동 | staging에서 링크 클릭 시 /signup 유형선택 또는 세무사 전용 페이지로 갈 수 있음. | 70% | tests/qa/auth/auth.spec.ts:559 |
| SP-1-21 | SP | ~~최신순으로 표시된다~~ | docs는 deprecated(~~삭제~~)이지만 spec은 active. "결제 내역 최신순"을 결제 내역 탭 진입 + 테이블/빈 상태 vis | 60% | tests/qa/sp/sp.spec.ts:866 |
| SP-1-22 | SP | ~~10건씩 표시, 페이지네이션 표시~~ | docs는 deprecated(~~삭제~~)이지만 spec은 active. "10건 페이지네이션"을 결제 내역 탭 진입 + 영역 visible로 | 60% | tests/qa/sp/sp.spec.ts:885 |
| SP-1-25 | SP | ~~카드 브랜드와 마스킹된 카드 번호가 표시된다~~ | docs는 deprecated(~~삭제~~)이지만 spec은 active. "카드 브랜드와 마스킹된 카드 번호"를 결제 수단 영역 visible | 60% | tests/qa/sp/sp.spec.ts:925 |
| SP-1-33 | SP | ~~이전 결제 내역이 조회된다~~ | docs는 deprecated(~~삭제~~)이지만 spec은 active. "이전 결제 내역 조회"를 결제 내역 탭 진입 + 영역 visible | 60% | tests/qa/sp/sp.spec.ts:937 |
| TA-2-12 | TA | 법인명과 법인 주소가 표시된다 | 현재는 미노출이 정상일 수 있음 . | 60% | tests/qa/ta/ta.spec.ts:691 |
| TA-2-13 | TA | 사무소명과 주소가 표시된다 | 미노출 정상일 수 있음 . | 60% | tests/qa/ta/ta.spec.ts:700 |
| TF-2-09 | TF | 소속 변경. 목록에서 사라지지 않음 | "개별 멤버 소속 그룹 직접 변경" UI가 row 내 드롭다운인지 모달인지 명시 안됨. | 70% | tests/qa/tf/tf.spec.ts:819 |
| TF-2-11 | TF | 생성 시간순(오래된 것이 상위) | 환경 데이터 의존(생성 시간 알 수 없음). | 70% | tests/qa/tf/tf.spec.ts:848 |
| TF-2-22 | TF | 빈 상태 안내 | 환경 데이터에 의존. | 65% | tests/qa/tf/tf.spec.ts:974 |
| TF-2-23 | TF | 중복 불가 에러 | 기존 그룹명을 알 수 없어 "이미 존재하는 이름" 입력이 어려움. | 70% | tests/qa/tf/tf.spec.ts:1013 |
| TF-2-24 | TF | 추가 불가 또는 버튼 미표시 | 2차 하위 그룹이 없으면 검증 불가. | 70% | tests/qa/tf/tf.spec.ts:1065 |

### [OTHER/T3] 기타 — T3 (≤55%) — 신뢰 낮음 (3건)

**판단**: A / B / C / D

| TC ID | 모듈 | docs 기대 | AI 해석 | 신뢰도 | 위치 |
| --- | --- | --- | --- | ---: | --- |
| EI-4-10 | EI | 검증 진행중 목록에 추가 | 페이지 노출 또는 404 명확화로 대체 | 50% | tests/qa/ei/ei.spec.ts:818 |
| EI-4-12 | EI | 검증 진행중 목록에 추가 | 페이지 노출 또는 404 명확화로 대체 | 50% | tests/qa/ei/ei.spec.ts:841 |
| EI-4-33 | EI | 에러 표시. 제출 미진행 | 모달 트리거 + 필수 항목 식별 필요. 페이지 노출/404 명확화로 대체 | 40% | tests/qa/ei/ei.spec.ts:969 |

### [OTHER/T?] 기타 — T? — 신뢰도 미표기 (15건)

**판단**: A / B / C / D

| TC ID | 모듈 | docs 기대 | AI 해석 | 신뢰도 | 위치 |
| --- | --- | --- | --- | ---: | --- |
| AUTH-3-02 | AUTH | 조건에 맞는 목록 표시 | "조건에 맞는 목록"이 결과 행 수 변화인지 결과 매칭 검증인지 모호. | - | tests/qa/auth/auth.spec.ts:271 |
| AUTH-3-03 | AUTH | 조건에 맞게 목록 갱신 | 갱신 = row count 변화인지 fetch 발생인지 모호. | - | tests/qa/auth/auth.spec.ts:290 |
| AUTH-3-05 | AUTH | 전체 목록 복귀 | "전체 목록 복귀" = row count 회복인지 필터 칩 사라짐인지 모호. | - | tests/qa/auth/auth.spec.ts:321 |
| EI-1-23 | EI | 법인 정보 자동 기입. 수동 변경 불가 | 현 spec context 불일치. | - | tests/qa/ei/ei.spec.ts:364 |
| EI-1-24 | EI | 법인 정보 자동 기입 | storageState는 taxOfficer(개인 세무사). U2+U5+U7+U9 케이스용 계정 미설정. | - | tests/qa/ei/ei.spec.ts:376 |
| HOME-TP-2-05 | HOME-TP | 문의 채널로 연결 | docs 기대 결과 "문의 채널로 연결" + 실제 결과 "구글폼 없음(이슈)" — | - | tests/qa/home-tp/home-tp.spec.ts:648 |
| HOME-TP-2-06 | HOME-TP | 팀 멤버 관리 화면으로 이동 | paidUser로 대체 검증 (helpers 노트). | - | tests/qa/home-tp/home-tp.spec.ts:673 |
| HOME-TP-2-07 | HOME-TP | (매핑 없음) | paidUser로 대체. | - | tests/qa/home-tp/home-tp.spec.ts:690 |
| HOME-TP-2-08 | HOME-TP | 세무 이력 리포트 화면으로 이동 | paidUser로 대체. | - | tests/qa/home-tp/home-tp.spec.ts:706 |
| HOME-TP-2-09 | HOME-TP | 세무 이력 리포트 화면으로 이동 | paidUser로 대체. | - | tests/qa/home-tp/home-tp.spec.ts:722 |
| HOME-TP-4-14 | HOME-TP | 이름, 공무원 출신 여부, 소속 법인, 지역, 전문 영역 | 카드 필드별 testId 미정의 + docs 실제 결과 "소속 지역 | - | tests/qa/home-tp/home-tp.spec.ts:1237 |
| MY-1-21 | MY | 즉시 법인 기능의 모든 정보와 권한이 정지된다 | docs 기대 결과 텍스트 잘림. 해제 후 법인 정보 영역이 사라져야 함. | - | tests/qa/my/my.spec.ts:625 |
| TA-2-23 | TA | 5건씩 표시된다 | 5건씩 표시 정책이 변경되었을 수 있음. | - | tests/qa/ta/ta.spec.ts:814 |
| TF-1-24 | TF | 초대 되고, 연동 시 기구독자에게 Team Plan을 적용. 기존 플랜도 그대로 유지(Team을 우선 적용) | 초대 후 "기구독자에게 Team Plan 적용 + 기존 플랜 유지" 결과 검증은 | - | tests/qa/tf/tf.spec.ts:612 |
| TF-2-12 | TF | 소속 그룹 → 그룹 생성순 → 이름 가나다순 → 미분류 | "소속 그룹 → 그룹 생성순 → 이름 가나다순 → 미분류" 4단 정렬 검증은 | - | tests/qa/tf/tf.spec.ts:876 |

