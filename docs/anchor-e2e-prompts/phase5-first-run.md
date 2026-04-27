# Phase 5: 첫 실행 + 디버깅 (1시간)

## 첫 실행

```bash
# Auth setup 한 번 실행 (5개 계정 storage state 생성)
npx playwright test auth.setup.ts

# 잘 됐는지 확인
ls tests/.auth/
# 5개 .json 파일 보여야 함

# Critical 테스트 첫 실행 (headed로 눈으로 보면서)
npx playwright test tests/critical/ --headed

# HTML 리포트 보기
npx playwright show-report
```

## 예상 결과

**잘 되는 경우** (30% 정도):
- 5-7개 P0 시나리오 모두 통과
- 바로 Phase 6 (CI 셋업)로

**일부 실패** (60% 정도, 정상):
- selector 변경 또는 추측 잘못된 부분
- 데이터 변경 (시나리오 작성 시점과 다름)
- 타이밍 이슈 (waitFor 부족)

**대량 실패** (10%):
- staging URL 변경
- 인증 변경
- anchor 팀에 확인 필요

## 디버깅 프롬프트

테스트 실패하면:

```
"npx playwright test tests/critical/ --headed 실행했는데 다음 테스트들이 실패했어:

[실패 출력 붙여넣기]

각 실패에 대해:
1. 실제 staging 사이트 들어가서 현재 상태 확인
2. selector 깨진 건지 / 데이터 변경된 건지 / 타이밍 문제인지 진단
3. 수정안 제시
4. 수정 후 다시 실행해서 통과 확인

만약 데이터 변경이라면:
- specs/test-plan.md의 시나리오 expected 업데이트
- specs/data-validation.md 재기록

만약 selector 변경이라면:
- shared/pages/ 의 Page Object 수정
- 변경 사유 주석 추가

만약 타이밍이라면:
- waitFor 추가 또는 timeout 증가
- 단, 무조건 sleep 추가는 X (Anti-pattern)

수정 후 npm run test:critical 다시 실행."
```

## 한 가지 흔한 함정 — Flaky Tests

같은 테스트가 어떨 땐 통과, 어떨 땐 실패:

```
원인:
- 비동기 데이터 로딩 (waitFor 부족)
- 애니메이션 (트랜지션 끝나기 전 클릭)
- 로그인 세션 만료 (storage state 오래됨)
- 같은 데이터 동시 수정 (다른 테스트와 충돌)

해결:
- await expect(locator).toBeVisible({ timeout: 10000 })
- await page.waitForLoadState('networkidle')
- storage state 1주일마다 갱신
- 테스트 간 격리 (각 test에 새 page context)

매일 모니터링에 들어갈 P0는 flaky 0% 목표.
주 1회 P1은 flaky 5% 허용.
```

## 안정화 기준

P0 5회 연속 통과 → 다음 단계

```bash
# 5회 연속 실행 스크립트
for i in {1..5}; do
  echo "Run $i"
  npx playwright test tests/critical/ || echo "FAIL run $i"
done
```

5/5 통과 → Phase 6 진행

## 다음 단계

Phase 6: `phase6-monitoring.md` (매일 모니터링 자동화)
