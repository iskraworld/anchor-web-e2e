# Phase 6: 매일 모니터링 자동화 (30분)

## 목표

P0 테스트를 매일 자동 실행하고 실패 시 알림.

## 옵션 선택

**옵션 A: GitHub Actions** (권장)
- 무료 (private repo도 월 2,000분 무료)
- 클라우드에서 실행
- 단점: staging이 IP 제한 있으면 GitHub Actions IP 화이트리스트 필요

**옵션 B: 로컬 Mac cron**
- 가장 단순
- Eugene Mac이 항상 켜져있어야 함
- staging이 회사 VPN 안에 있으면 이쪽이 더 적합

**옵션 C: Self-hosted runner**
- VPN 안 + 자동 실행 둘 다 가능
- 셋업 가장 복잡

`13.125.186.195` (AWS 퍼블릭 IP)면 **옵션 A** 추천.

---

## 옵션 A: GitHub Actions

### Claude Code 프롬프트

```
.github/workflows/daily-monitor.yml 만들어줘.

요구사항:
1. 매일 오전 9시 KST (UTC+9) 자동 실행
2. P0 테스트만 실행 (tests/critical/)
3. 5개 계정 storage state는 매번 새로 생성 (auth.setup.ts)
4. 결과:
   - 통과 시: 조용함 (알림 X)
   - 실패 시: Telegram 또는 Slack 알림
5. 실행 결과 artifact 보관 (7일):
   - playwright-report/
   - test-results/

GitHub Secrets 사용:
- ANCHOR_BASE_URL
- ANCHOR_TEST_PASSWORD
- ANCHOR_TAX_OFFICER_EMAIL ~ ANCHOR_FREE_USER_EMAIL
- TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

Telegram 알림 메시지:
- 실패한 테스트 이름
- 실패 메시지 첫 줄
- HTML 리포트 링크 (artifact)
- 워크플로우 실행 링크

수동 실행도 가능하게 workflow_dispatch 추가.

추가 워크플로우:
- weekly-full.yml: 매주 일요일 오전 P1+P2 풀 테스트
- visual-baseline.yml: 수동 트리거로 visual baseline 갱신
```

### Telegram Bot 셋업 (5분)

```
1. Telegram에서 @BotFather에 /newbot
2. 봇 이름 정하기 (예: anchor-e2e-bot)
3. Token 받음 → GitHub Secrets에 TELEGRAM_BOT_TOKEN 추가
4. 본인이 만든 봇과 대화 시작 (/start)
5. https://api.telegram.org/bot<TOKEN>/getUpdates 접속
6. chat.id 확인 → GitHub Secrets에 TELEGRAM_CHAT_ID 추가
```

### GitHub Secrets 추가

repo Settings → Secrets and variables → Actions:

```
ANCHOR_BASE_URL                  http://13.125.186.195:3000
ANCHOR_TEST_PASSWORD             qwer1234!@#$
ANCHOR_TAX_OFFICER_EMAIL         bagseongho@gaon.com
ANCHOR_NON_OFFICER_EMAIL         taxhan@theanchor.best
ANCHOR_FIRM_OWNER_EMAIL          official@gaon.com
ANCHOR_PAID_USER_EMAIL           ceo.kim@theanchor.best
ANCHOR_FREE_USER_EMAIL           choi@theanchor.best
TELEGRAM_BOT_TOKEN               (from BotFather)
TELEGRAM_CHAT_ID                 (from getUpdates)
```

### 첫 실행 검증

```bash
# 수동 트리거
gh workflow run daily-monitor.yml

# 진행 상황 확인
gh run list --workflow=daily-monitor.yml --limit 5

# 로그 보기
gh run view --log
```

성공하면 다음날 오전 9시 자동 실행 시작.

---

## 옵션 B: 로컬 Mac cron

### 셋업 (5분)

```bash
# 실행 스크립트
cat > ~/projects/anchor-e2e/run-daily.sh << 'EOF'
#!/bin/bash
cd ~/projects/anchor-e2e

# 환경변수 로드
set -a
source .env.local
set +a

# 테스트 실행
LOG_FILE="logs/$(date +%Y%m%d-%H%M).log"
mkdir -p logs

if npx playwright test tests/critical/ > "$LOG_FILE" 2>&1; then
  echo "✅ Pass: $(date)"
else
  # Telegram 알림
  MESSAGE="🚨 anchor E2E 실패 $(date +%Y-%m-%d)\n\n$(tail -20 $LOG_FILE)"
  curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d "chat_id=${TELEGRAM_CHAT_ID}" \
    -d "text=${MESSAGE}"
fi
EOF

chmod +x ~/projects/anchor-e2e/run-daily.sh

# crontab 등록
crontab -e
# 추가:
# 0 9 * * * /Users/eugene/projects/anchor-e2e/run-daily.sh

# Mac이 sleep 모드여도 실행되게 (선택)
# 시스템 환경설정 → 배터리 → 절전 옵션
```

---

## 검증

다음 며칠 동안 매일 9시에:
- 통과 시: GitHub Actions 또는 로컬 로그에 ✅ 표시
- 실패 시: Telegram 알림 받음

처음 1주일 false positive 자주 나옴 (정상). 그때마다:
- 진짜 버그면 anchor 팀에 알림
- false positive면 테스트 보강 (waitFor, 데이터 검증 유연하게)

## 막힌 작업 처리 원칙

AI가 기술적으로 직접 수행할 수 있는 작업(계정 로그인, 토글 조작 등)이라면
"Anchor 팀에 요청"하기 전에 먼저 아래 형식으로 사람에게 제안한다.
사람이 승인하면 AI가 직접 진행, 팀에 요청하기로 결정하면 그때 요청한다.

```
AI 직접 하게 하고 싶다면 승인해주시면 바로 진행합니다.

작업: [구체적 행동]
이유: [왜 필요한지]
영향 범위: [어떤 파일/서비스/시스템에 영향]
되돌리는 방법: [롤백 절차]
예상 리스크: 낮음 / 중간 / 높음
```

---

## 안정화 후

매일 모니터링이 false positive 거의 없으면:
- 운영 환경도 추가 (별도 워크플로우)
- 알림 채널 확대 (Slack 등)
- 통과율 대시보드 (선택)

## 다음 단계 (선택)

- Phase 7: Visual regression 활성화
- Phase 8: 운영 환경으로 확장
- Phase 9: 다른 프로젝트 (iskra-portal 등) 확장

---

전체 셋업 완료. 이제 매일 anchor를 자동 모니터링합니다.
