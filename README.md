# Anchor Web E2E

앵커(Anchor) 웹 서비스 E2E 자동화 테스트 프로젝트.

- **테스트 프레임워크**: Playwright (TypeScript)
- **대상**: http://13.125.186.195:3000/
- **시나리오 수**: P0 28개 / P1 24개 / P2 15개 / VR 10개

---

## 빠른 시작

```bash
# 의존성 설치
npm install
npx playwright install chromium

# 인증 세션 초기화 (최초 1회 or 세션 만료 시)
npm run test:setup

# P0 핵심 테스트 실행
npm run test:critical

# 전체 테스트 (P0+P1+P2)
npm run test:full
```

`.env.local` 파일이 필요하다. `.env.local.example` 참고.

---

## 실행 명령

| 명령 | 대상 | 주기 |
|---|---|---|
| `npm run test:critical` | P0 (핵심 기능) | 매일 CI |
| `npm run test:p1` | P1 (회귀 방지) | 주 1회 |
| `npm run test:p2` | P2 (전수 검증) | 수동 또는 특이사항 시 |
| `npm run test:visual` | VR (스크린샷 비교) | 주 1회 또는 대형 UI 변경 전후 |
| `npm run test:full` | P0+P1+P2 전체 | CI 수동 실행 |
| `npm run visual:update` | VR 베이스라인 갱신 | 디자인 변경 후 |
| `npm run report` | Playwright HTML 리포트 열기 | 실패 분석 시 |

---

## 디렉토리 구조

```
ahchor-web-e2e/
├── tests/
│   ├── auth.setup.ts              # 5개 계정 storageState 초기화
│   ├── critical/                  # P0 — 매일 CI
│   │   ├── auth-login.spec.ts
│   │   └── team-scenarios/        # TM-A ~ TM-G
│   ├── p1/                        # P1 — 주 1회
│   │   ├── navigation.spec.ts
│   │   ├── permissions.spec.ts
│   │   ├── search.spec.ts
│   │   ├── forms.spec.ts
│   │   └── team-scenarios/
│   ├── p2/                        # P2 — 수동 트리거
│   │   ├── auth.spec.ts
│   │   ├── domain.spec.ts
│   │   ├── forms.spec.ts
│   │   ├── permissions.spec.ts
│   │   ├── search.spec.ts
│   │   ├── states.spec.ts
│   │   └── team-scenarios/
│   └── visual/
│       ├── visual.spec.ts         # VR-001~010
│       └── visual.spec.ts-snapshots/  # 베이스라인 PNG
├── shared/
│   ├── helpers/                   # authFiles, loginAs, fillReactInput
│   └── pages/                     # Page Object (SearchPage, TaxReportPage 등)
├── specs/
│   ├── test-plan.md               # 전체 시나리오 목록 (P0/P1/P2/VR)
│   ├── data-validation.md         # staging 데이터 검증 결과
│   └── data-dependencies.md       # staging 데이터 보존 요청
├── docs/
│   ├── anchor-web-e2e-info.md     # 시나리오 원문
│   ├── ci-templates/              # GitHub Actions 워크플로 초안
│   └── anchor-e2e-prompts/        # 단계별 AI 프롬프트 가이드
├── .github/workflows/
│   └── playwright.yml             # CI (수동 실행 — workflow_dispatch)
├── playwright.config.ts
└── .env.local                     # 계정/URL 환경변수 (git 제외)
```

---

## 테스트 계정

| 역할 | 이메일 | `.env.local` 변수 |
|---|---|---|
| 전관 세무사 | bagseongho@gaon.com | `ANCHOR_EMAIL_TAX_OFFICIAL` |
| 일반 세무사 | taxhan@theanchor.best | `ANCHOR_EMAIL_TAX_GENERAL` |
| 세무법인 소유자 | official@gaon.com | `ANCHOR_EMAIL_FIRM_OWNER` |
| 납세자 유료 | ceo.kim@theanchor.best | `ANCHOR_EMAIL_TAXPAYER_PAID` |
| 납세자 무료 | choi@theanchor.best | `ANCHOR_EMAIL_TAXPAYER_FREE` |

공통 비밀번호: `ANCHOR_PASSWORD`

---

## 시나리오 추가 방법

1. **시나리오 정의** — `specs/test-plan.md`에 ID, 설명, 우선순위 추가
2. **테스트 파일 작성** — 우선순위에 맞는 폴더에 `.spec.ts` 생성
   - P0: `tests/critical/`
   - P1: `tests/p1/`
   - P2: `tests/p2/`
3. **계정 사용** — `shared/helpers/authFiles.ts`의 `AUTH_FILES` 참조
4. **Page Object** — 반복 셀렉터는 `shared/pages/`에 추출
5. **데이터 의존성** — `specs/data-dependencies.md`에 staging 데이터 보존 요청 추가

```typescript
// 예시: P1 권한 테스트
import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../shared/helpers/authFiles';

test.describe('as freeUser', () => {
  test.use({ storageState: AUTH_FILES.freeUser });

  test('FN-PERM-XXX: 설명', async ({ page }) => {
    await page.goto('/some-page');
    await expect(page.getByText('노출되어야 할 텍스트')).toBeVisible();
  });
});
```

---

## VR 베이스라인 갱신

UI 디자인 변경 후 베이스라인을 업데이트한다.

```bash
npm run visual:update
```

이후 `git diff`로 변경된 스냅샷을 확인하고 커밋한다.

---

## CI

- **실행 방식**: GitHub Actions 수동 실행 (`workflow_dispatch`)
- **대상**: P0 전체 (`tests/critical/`)
- **자동 실행 비활성화**: push/PR 트리거 비활성 (비용·속도 이유)
- **활성화 방법**: `.harness/backlog.md` 참고

---

## BLOCKED 시나리오

| ID | 이유 | 해제 조건 |
|---|---|---|
| TM-D-2, TM-D-3 | 법인 리포트 1그룹/2그룹 UI 미출시 | Anchor 팀 해당 기능 릴리즈 후 |

관련 파일: `tests/critical/team-scenarios/D-firm-capability.spec.ts`
