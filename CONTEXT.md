# CONTEXT.md — 프로젝트 맥락

> Claude Code 세션 시작 시 자동으로 로드된다. 핵심 정보만 유지하고 나머지는 `.harness/`에 기록한다.

## 프로젝트 개요

**앵커(Anchor)** 웹 서비스의 E2E 자동화 테스트 프로젝트.
앵커는 세무사-납세자 간 인맥 기반 매칭 플랫폼으로, 세무사의 공무원 인맥 그래프 탐색과 납세자의 세무사 검색/추천 기능을 제공한다.

## 기술 스택

- **테스트 프레임워크**: Playwright `^1.59.1` (TypeScript)
- **언어**: TypeScript (`@types/node ^25.6.0`)
- **브라우저**: Chromium, Firefox, WebKit (기본 설정)
- **브라우저 자동화 보조**: Playwright MCP (글로벌 설치)
- **Playwright 스킬**: `.claude/skills/playwright-skill/` (battle-tested 패턴 모음)

## 테스트 대상

- **사이트**: http://13.125.186.195:3000/
- **환경변수**: `.env.local` (git 제외)

### 테스트 계정 (비밀번호 공통: `ANCHOR_PASSWORD`)

| 변수명 | 역할 | 이메일 |
|---|---|---|
| `ANCHOR_EMAIL_TAX_OFFICIAL` | 전관 세무사 (공무원 출신) | bagseongho@gaon.com |
| `ANCHOR_EMAIL_TAX_GENERAL` | 일반 세무사 (비공무원 출신) | taxhan@theanchor.best |
| `ANCHOR_EMAIL_FIRM_OWNER` | 세무법인 소유자 | official@gaon.com |
| `ANCHOR_EMAIL_TAXPAYER_PAID` | 납세자 (유료 구독) | ceo.kim@theanchor.best |
| `ANCHOR_EMAIL_TAXPAYER_FREE` | 납세자 (무료 구독) | choi@theanchor.best |

## 테스트 시나리오

### 세무사/세무법인 시나리오
- **시나리오 A** — 전관 세무사의 특정 공무원 공통 인맥 탐색 (`bagseongho@gaon.com`)
- **시나리오 B** — 일반 세무사의 회사 전체 기준 공통 인맥 탐색 (`taxhan@theanchor.best`)
- **시나리오 C** — 세무사 프로필 등록 후 납세자 검색 노출 확인 (`taxhan@theanchor.best`)

### 세무법인 시나리오
- **시나리오 D** — 신규 세무사 온보딩 후 법인 역량 리포트 확인 (`official@gaon.com`)
- **시나리오 E** — 법인 리포트 기반 포지셔닝 전략 변경 (`official@gaon.com`)

### 납세자 시나리오
- **시나리오 F** — 유료 구독자: 세무조사 통지서 기반 세무사 추천 조회 (`ceo.kim@theanchor.best`)
- **시나리오 G** — 무료 구독자: 지역/전문 이력 기반 세무사 검색 (`choi@theanchor.best`)

전체 시나리오 상세: `docs/anchor-web-e2e-info.md`

## 현재 상태

- 하네스 초기화 완료
- Playwright 초기화 완료 (`package.json`, `playwright.config.ts` 존재)
- 테스트 코드 없음 — 시나리오 A-G 구현 필요

## 핵심 구조

```
ahchor-web-e2e/
├── tests/                       # 테스트 파일 위치 (playwright.config.ts 기준)
├── docs/
│   └── anchor-web-e2e-info.md   # 테스트 시나리오 상세 문서
├── playwright.config.ts         # Playwright 설정 (baseURL 미설정 — .env.local 연동 필요)
├── package.json                 # @playwright/test ^1.59.1
├── .env.local                   # 테스트 계정/URL (git 제외)
├── .claude/
│   ├── settings.json
│   └── skills/playwright-skill/ # Playwright 패턴 가이드
├── .harness/                    # AI 에이전트 운영 파일
└── CLAUDE.md
```

## 중요 결정사항

- 테스트 계정은 `.env.local`에 역할별 변수명으로 관리 (`ANCHOR_EMAIL_<역할>`)
- 비밀번호 공통이므로 `ANCHOR_PASSWORD` 단일 변수 사용
- TypeScript로 진행
