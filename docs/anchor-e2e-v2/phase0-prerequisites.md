# Phase 0 — 사전 조건 확인

> 목표: 기존 Playwright 인프라를 그대로 재사용하고, QA 문서와 테스트 계정이 준비됐는지 확인한다.
> 예상 소요: 10분

---

## 체크리스트

### 1. QA 문서 확인

```bash
ls docs/qa/
```

아래 11개 파일이 모두 있어야 한다:

| 파일 패턴 | 모듈 |
|---|---|
| QA_AUTH_* | 로그인/회원가입 |
| QA_HOME-TA_* | 홈GNB알림_세무사 |
| QA_HOME-TP_* | 홈GNB알림_납세자 |
| QA_EI_* | 전문이력관리 |
| QA_ER_* | 전문이력리포트 |
| QA_GO_* | 현직공무원탐색 |
| QA_EO_* | 전직공무원찾기 |
| QA_TA_* | 세무대리인찾기 |
| QA_TF_* | 법인&팀연동관리 |
| QA_SP_* | 구독관리 |
| QA_MY_* | 내정보 |

---

### 2. 테스트 계정 확인

`.env.local`에 아래 5개 변수가 모두 있어야 한다:

| 변수명 | 역할 | 이메일 |
|---|---|---|
| `ANCHOR_EMAIL_TAX_OFFICIAL` | 전관 세무사 (공무원 출신) | bagseongho@gaon.com |
| `ANCHOR_EMAIL_TAX_GENERAL` | 일반 세무사 (비공무원 출신) | taxhan@theanchor.best |
| `ANCHOR_EMAIL_FIRM_OWNER` | 세무법인 소유자 | official@gaon.com |
| `ANCHOR_EMAIL_TAXPAYER_PAID` | 납세자 (유료 구독) | ceo.kim@theanchor.best |
| `ANCHOR_EMAIL_TAXPAYER_FREE` | 납세자 (무료 구독) | choi@theanchor.best |
| `ANCHOR_PASSWORD` | 공통 비밀번호 | — |

---

### 3. Playwright 설정 확인

`playwright.config.ts`에 아래가 설정되어 있어야 한다:

- `baseURL`: `.env.local`에서 로드
- `timeout`: 60000 이상 (스테이징 서버 응답 느림)
- `storageState` 기반 인증 셋업 (`tests/.auth/` 디렉토리)
- JSON reporter: `playwright-report/results.json` 출력

---

### 4. 인증 스토리지 상태 갱신

⚠️ **JWT 만료 주기 ~12시간** — Phase 2/3 작업 중에도 12시간 초과 시 재실행 필요. 만료된 storageState로 spec을 돌리면 모든 보호 경로가 `/login`으로 redirect되어 대량 timeout 발생.

```bash
# storageState mtime 체크 (12시간 초과 시 재실행)
find tests/.auth -name "*.json" -mmin +720 | head -1 && \
  npx playwright test tests/auth.setup.ts --project=setup

# 또는 강제 재생성
npx playwright test tests/auth.setup.ts --project=setup
```

5개 계정 로그인 상태가 `tests/.auth/*.json`에 저장되면 완료.

> 💡 작업 시작 전·재개 시 항상 `ls -la tests/.auth/`로 mtime 확인. 빨간 신호: `*.json`이 12시간 이상 오래됨 → 즉시 재실행.

---

### 5. 출력 디렉토리 확인

```bash
mkdir -p playwright-report/qa-report
```

---

## 완료 기준

- [ ] QA 문서 11개 존재 확인
- [ ] `.env.local` 계정 6개 변수 확인
- [ ] `playwright.config.ts` timeout 60s 이상
- [ ] `tests/.auth/*.json` 5개 파일 갱신 완료

모든 항목 체크 → Phase 1로 이동.
