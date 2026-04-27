# Phase 0: 셋업 (10분)

## 프로젝트 생성

```bash
mkdir ~/projects/anchor-e2e
cd ~/projects/anchor-e2e

# Playwright 초기화
npm init playwright@latest
# 모든 기본값, TypeScript yes

# Git 초기화
git init

# Playwright MCP 추가
claude mcp add playwright npx @playwright/mcp@latest

# (선택) Playwright Skill
npx skills add testdino-hq/playwright-skill
```

## 환경 변수 셋업

```bash
# .env.example 생성
cat > .env.example << 'EOF'
ANCHOR_BASE_URL=http://13.125.186.195:3000
ANCHOR_TEST_PASSWORD=qwer1234!@#$

# 5개 테스트 계정
ANCHOR_TAX_OFFICER_EMAIL=bagseongho@gaon.com
ANCHOR_NON_OFFICER_EMAIL=taxhan@theanchor.best
ANCHOR_FIRM_OWNER_EMAIL=official@gaon.com
ANCHOR_PAID_USER_EMAIL=ceo.kim@theanchor.best
ANCHOR_FREE_USER_EMAIL=choi@theanchor.best
EOF

# .env.local 복사 (실제 사용)
cp .env.example .env.local

# .gitignore 추가
cat >> .gitignore << 'EOF'
.env
.env.local
.auth/
playwright-report/
test-results/
docs/exploration-cache/
EOF
```

## 디렉토리 구조 미리 만들기

```bash
mkdir -p docs specs tests/critical tests/scenarios tests/full tests/visual shared/pages shared/fixtures
```

## anchor-web-e2e-info.md 복사

팀이 준 시나리오 문서를 프로젝트에 보관:

```bash
mkdir -p docs/source
# anchor-web-e2e-info.md를 docs/source/에 복사
cp ~/Downloads/anchor-web-e2e-info.md docs/source/
```

## 첫 커밋

```bash
git add .
git commit -m "Initial: anchor-e2e setup"

# Private GitHub repo 생성 (gh CLI 있으면)
gh repo create anchor-e2e --private --source=. --push
```

## 다음 단계

Phase 1부터 순서대로 진행:
- `phase1-team-scenarios.md`
- `phase2-exploration.md`
- `phase3-integration.md`
- `phase4-code-generation.md`
- `phase5-first-run.md`

각 파일에 Claude Code에 붙여넣을 프롬프트가 있습니다.
