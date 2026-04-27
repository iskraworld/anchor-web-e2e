# anchor-e2e 셋업 가이드 (옵션 B)

> AI 자율 탐색 + 팀 시나리오 결합으로 anchor 서비스 E2E 자동화

## 진행 순서

각 Phase 파일을 순서대로 따라가세요.

| Phase | 파일 | 시간 | 목표 |
|-------|------|------|------|
| 0 | `phase0-setup.md` | 10분 | 프로젝트·환경 셋업 |
| 1 | `phase1-team-scenarios.md` | 30분 | 팀 시나리오 7개 → Gherkin |
| 2 | `phase2-exploration.md` | 2시간 | AI 자율 탐색 (옵션 B 범위) |
| 3 | `phase3-integration.md` | 30분 | 시나리오 통합 + 데이터 검증 |
| 4 | `phase4-code-generation.md` | 1시간 | Playwright TS 코드 생성 |
| 5 | `phase5-first-run.md` | 1시간 | 첫 실행 + 디버깅 |
| 6 | `phase6-monitoring.md` | 30분 | 매일 모니터링 자동화 |

**총 예상 시간**: 5-6시간 (한 번에 다 안 해도 OK)

## 추천 분할

**Day 1 (3-4시간)**:
- Phase 0~3
- 시나리오 + 데이터 검증까지

**Day 2 (2-3시간)**:
- Phase 4~6
- 코드 + 첫 실행 + 자동화

## 핵심 원칙

### 옵션 B 범위
- ✅ 모든 페이지 200 OK + 콘솔 에러
- ✅ 헤더·사이드바 모든 링크
- ✅ 권한별 접근 차이
- ✅ 폼 validation
- ✅ 검색·필터
- ✅ Visual regression
- ❌ 모든 인터랙션 조합 (옵션 C)
- ❌ Edge cases (옵션 C)
- ❌ UX·도메인 깊은 검증 (사람 QA)

### 자동화 vs 사람 QA
- **자동화**: 기능 회귀(regression) 방지
- **사람 QA**: UX·도메인 정확성 검증

### 안전 규칙
- read-only만 (시나리오 C 프로필 등록 제외, dry-run 검토 필요)
- 결제·구독 액션 발견 시 멈춤
- 운영 환경은 안정화 후 추가

## 시작 전 체크리스트

- [ ] anchor staging 접근 가능 확인
- [ ] 5개 테스트 계정 로그인 가능 확인
- [ ] anchor-web-e2e-info.md 파일 보유
- [ ] Claude Code + Playwright MCP 설치됨
- [ ] (옵션 A 선택 시) Telegram bot 셋업 가능

## 진행 중 막히면

각 Phase 파일에 트러블슈팅 섹션 있어요. 그래도 막히면:
- Phase 2 탐색 시간 초과: "지금까지 결과 저장" 지시 후 다음 세션
- Phase 5 테스트 실패: 트러블슈팅 섹션의 디버깅 프롬프트
- 데이터 변경: anchor 팀에 데이터 보존 요청

## 완성 후

매일 오전 9시 자동:
- 통과 → 조용함
- 실패 → Telegram 알림

Eugene이 anchor를 안 써도 매일 자동 모니터링 가능.
