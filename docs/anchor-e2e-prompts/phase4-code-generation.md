# Phase 4: 코드 생성 (1시간)

## 목표

specs/test-plan.md 시나리오를 Playwright TypeScript 코드로 변환.

## Claude Code 프롬프트

P0부터 시작 (가장 중요한 것부터):

```
specs/test-plan.md의 P0 시나리오를 Playwright TS 코드로 변환해줘.

작업:
1. 디렉토리 구조
   tests/
   ├── critical/        ← P0 (매일 모니터링)
   │   ├── auth.spec.ts
   │   ├── navigation.spec.ts
   │   └── team-scenarios/   ← TM-A ~ TM-G
   │       ├── A-tax-officer-network.spec.ts
   │       ├── B-non-officer-network.spec.ts
   │       ├── C-profile-registration.spec.ts
   │       ├── D-firm-capability.spec.ts
   │       ├── E-positioning-strategy.spec.ts
   │       ├── F-paid-tax-investigation.spec.ts
   │       └── G-free-inheritance.spec.ts
   ├── scenarios/       ← P1 (주 1회)
   ├── full/           ← P2 (수동/주 1회 풀)
   └── visual/         ← VR (visual regression)
   
   shared/
   ├── pages/          ← Page Object Model
   │   ├── LoginPage.ts
   │   ├── DashboardPage.ts
   │   └── ...
   ├── fixtures/       ← Playwright fixtures
   │   ├── auth.ts     ← 5개 계정 storage state
   │   └── ...
   └── helpers/

2. 인증 셋업 (auth.setup.ts)
   - 5개 계정 각각 로그인해서 storage state 저장
   - tests/.auth/{account-type}.json
   - .gitignore에 .auth/ 포함됨 (이미)
   
   playwright.config.ts에 projects 정의:
   - taxOfficer (storageState: tests/.auth/tax-officer.json)
   - nonOfficer
   - firmOwner
   - paidUser
   - freeUser
   
   각 spec 파일에서 use.storageState로 해당 계정 사용

3. Page Object Model
   - 자주 쓰는 페이지마다 클래스
   - shared/pages/에 저장
   - selector 변경 시 한 곳만 수정

4. 코드 작성 원칙
   - selector 우선순위: data-testid > role/label > text > CSS
     (실제 사이트에 data-testid 없으면 다음 단계로)
   - waitFor 적극 사용 (timeout 5-30초)
   - 실패 시 자동 스크린샷 + 콘솔 로그 캡처
   - assertion은 specs/data-validation.md 기반 유연하게
   - 환경변수 사용 (process.env.ANCHOR_BASE_URL 등)

5. playwright.config.ts 설정
   - baseURL: process.env.ANCHOR_BASE_URL
   - timeout: 30000
   - retries: process.env.CI ? 2 : 0
   - reporter: ['html', 'list']
   - screenshot: 'only-on-failure'
   - trace: 'retain-on-failure'
   - video: 'retain-on-failure'

6. 시나리오 작성 시 주의
   - 각 시나리오 = 별도 test() 블록
   - test.describe()로 그룹핑
   - test.skip()로 BLOCKED 시나리오 표시 (주석에 이유)
   - test.fail() 또는 test.fixme()는 사용 X (실제 실패 봐야 하니)

7. 코드 작성 중 selector 검증
   - 코드 작성하면서 실제 staging 사이트에 들어가서 selector 확인
   - 추측으로 코드 쓰지 말고 실제 페이지 보고 selector 추출
   - data-testid 없으면 role+name 조합 우선

작업 후 첫 실행 가능한 상태로:
- npm run test:critical 명령 추가 (package.json scripts)
- README.md에 실행 방법 추가

P0만 먼저 작성. P1, P2는 P0 검증 후 다음 단계에서.

작업 시작 전 specs/test-plan.md, specs/data-validation.md 읽고 시작.
```

## 검증

Phase 4 P0 완료 후:
- tests/critical/ 디렉토리에 spec 파일들
- shared/pages/ Page Object Model
- shared/fixtures/auth.ts 5개 계정 fixture
- playwright.config.ts 설정 완료
- package.json에 test:critical 스크립트

## P1, P2 작업은 첫 실행 후

Phase 5에서 P0 첫 실행 + 디버깅이 끝나면 P1, P2 추가:

```
P0 테스트가 안정적으로 작동 확인했어.
이제 specs/test-plan.md의 P1 시나리오를 코드로 변환해줘.
tests/scenarios/에 저장.

원칙은 P0와 동일. 단:
- P1은 더 많으니 카테고리별 파일로 묶음
  tests/scenarios/search.spec.ts (FN-SEARCH-*)
  tests/scenarios/forms.spec.ts (FN-FORM-*)
  tests/scenarios/permissions.spec.ts (FN-PERM-*)
  ...
- npm run test:scenarios 스크립트 추가
```

P2도 동일하게:

```
P1 안정화 후, P2 시나리오를 tests/full/에 작성해줘.
npm run test:full 스크립트 추가.
실행 시간이 길 수 있으니 parallel 옵션 적극 사용.
```

## 다음 단계

Phase 5: `phase5-first-run.md`
