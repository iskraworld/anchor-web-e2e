# VERIFY 샘플링 — 위험 우선순위

생성: 2026-04-30T10:46:51.523Z
모듈: (전체)
샘플: 12 (Tier 1 위험) + 3 (Tier 3 랜덤) = 15건
전체 VERIFY 항목 수: 53

---

## [샘플 1/15] MY-1-12 (위험 점수 12 — Tier 1)

📄 **docs 기대**: 주소가 저장되고 모달이 닫힌다

🚩 **위험 신호**: AMBIGUOUS_DOC, 광범위 셀렉터 (.first()), fallback 비율 높음

🔍 **코드**:
```typescript
          return;
        }
        await searchInput.first().fill('서울 강남', { timeout: 5000 });
        // VERIFY value: 주소 검색 입력값 반영 (docs "도로명주소 선택 후 변경 완료" 1차 단계)
        await expect(searchInput.first()).toHaveValue(/서울 강남/);
      } catch {
        await expect(page.locator('body')).toBeVisible();
```

💭 **AI VERIFY**: `value` — 주소 검색 입력값 반영 (docs "도로명주소 선택 후 변경 완료" 1차 단계)

❓ **판단**: Y / N / 부분

---

## [샘플 2/15] MY-1-21 (위험 점수 12 — Tier 1)

📄 **docs 기대**: 즉시 법인 기능의 모든 정보와 권한이 정지된다

🚩 **위험 신호**: AMBIGUOUS_DOC, 광범위 셀렉터 (.first()), fallback 비율 높음

🔍 **코드**:
```typescript
          return;
        }
        await confirm.first().click({ timeout: 5000 });
        // VERIFY hidden: 해제 클릭 후 확인 팝업 닫힘
        await expect(confirm.first()).not.toBeVisible({ timeout: 5000 });
      } catch {
        await expect(page.locator('body')).toBeVisible();
```

💭 **AI VERIFY**: `hidden` — 해제 클릭 후 확인 팝업 닫힘

❓ **판단**: Y / N / 부분

---

## [샘플 3/15] TA-1-24 (위험 점수 10 — Tier 1)

📄 **docs 기대**: 관계사 배지가 표시된다

🚩 **위험 신호**: AMBIGUOUS_DOC, 정규식 hasText, 도메인 복잡

🔍 **코드**:
```typescript
      const card = page.locator('[data-testid*="firm-card"], [data-testid*="card"], article').first();
      const badge = page.getByText(/관계사/).first();
      if (await isVisibleSoft(badge, 5000)) {
        // VERIFY visible: 세무법인 검색 결과에 관계사 배지 노출
        await expect(badge).toBeVisible();
      } else if (await isVisibleSoft(card, 3000)) {
        // 결과 카드는 있지만 관계사 배지 미노출 (해당 데이터 없음)
```

💭 **AI VERIFY**: `visible` — 세무법인 검색 결과에 관계사 배지 노출

❓ **판단**: Y / N / 부분

---

## [샘플 4/15] TA-2-19 (위험 점수 9 — Tier 1)

📄 **docs 기대**: 박사, 석사, 학사 순서로 표시

🚩 **위험 신호**: AMBIGUOUS_DOC, 정규식 hasText, 좌표 계산

🔍 **코드**:
```typescript
          // reading-order 계산: y * 10000 + x (같은 행이면 왼쪽이 먼저)
          const phdOrder = phdBox.y * 10000 + phdBox.x;
          const bachelorOrder = bachelorBox.y * 10000 + bachelorBox.x;
          // VERIFY count-change: 박사 reading-order ≤ 학사 reading-order (위/같은 행이면 왼쪽)
          expect(phdOrder).toBeLessThanOrEqual(bachelorOrder);
          return;
        }
```

💭 **AI VERIFY**: `count-change` — 박사 reading-order ≤ 학사 reading-order (위/같은 행이면 왼쪽)

❓ **판단**: Y / N / 부분

---

## [샘플 5/15] TA-1-18 (위험 점수 8 — Tier 1)

📄 **docs 기대**: 10건씩 표시

🚩 **위험 신호**: AMBIGUOUS_DOC

🔍 **코드**:
```typescript
      const cards = page.locator('[data-testid*="firm-card"], [data-testid*="card"], article');
      const count = await cards.count().catch(() => 0);
      if (count > 0) {
        // VERIFY count-change: 페이지당 결과 카드 10개 이하 (페이지네이션 검증)
        expect(count).toBeLessThanOrEqual(10);
        await expect(cards.first()).toBeVisible();
      } else {
```

💭 **AI VERIFY**: `count-change` — 페이지당 결과 카드 10개 이하 (페이지네이션 검증)

❓ **판단**: Y / N / 부분

---

## [샘플 6/15] TA-1-23 (위험 점수 8 — Tier 1)

📄 **docs 기대**: TOP10 배지가 표시된다

🚩 **위험 신호**: AMBIGUOUS_DOC, 도메인 복잡

🔍 **코드**:
```typescript
      const cardsWithTop10 = cards.filter({ hasText: /TOP\s*10/i });
      const top10Count = await cardsWithTop10.count().catch(() => 0);
      if (top10Count > 0) {
        // VERIFY count-change: TOP10 배지를 가진 카드 1개 이상 (배지가 회사 카드의 자식임을 검증)
        expect(top10Count).toBeGreaterThan(0);
      } else {
        // staging 데이터에 TOP10 회사가 없는 케이스 — 첫 카드 노출 가드
```

💭 **AI VERIFY**: `count-change` — TOP10 배지를 가진 카드 1개 이상 (배지가 회사 카드의 자식임을 검증)

❓ **판단**: Y / N / 부분

---

## [샘플 7/15] MY-1-13 (위험 점수 7 — Tier 1)

📄 **docs 기대**: 모달이 닫히고 내 정보 화면으로 복귀한다

🚩 **위험 신호**: 광범위 셀렉터 (.first()), fallback 비율 높음

🔍 **코드**:
```typescript
        // 모달이 열려 있어야 함 (취소 버튼이 보이므로)
        const modalSearch = page.getByPlaceholder(/주소 검색/);
        await cancelBtn.first().click({ timeout: 5000 });
        // VERIFY hidden: 취소 클릭 후 주소 검색 input 사라짐 (모달 닫힘)
        await expect(modalSearch.first()).not.toBeVisible({ timeout: 5000 });
      } catch {
        await expect(page.locator('body')).toBeVisible();
```

💭 **AI VERIFY**: `hidden` — 취소 클릭 후 주소 검색 input 사라짐 (모달 닫힘)

❓ **판단**: Y / N / 부분

---

## [샘플 8/15] EO-1-11 (위험 점수 5 — Tier 1)

📄 **docs 기대**: 필터 조건에 맞는 전직 공무원 목록이 테이블에 표시된다. 결과 건수가 테이블 상단에 함께 표시된다. 사용자가 입력한 검색 조건 값이 화면에 유지된다.

🚩 **위험 신호**: 정규식 hasText, 도메인 복잡

🔍 **코드**:
```typescript
        const rowCount = await page.getByRole('row').count();
        const totalText = page.getByText(/\d+\s*(건|명|개)/i).first();
        const hasTotal = await isVisibleSoft(totalText, 5000);
        // VERIFY count-change: 검색 후 헤더 외 데이터 행 ≥1 또는 결과 건수 텍스트 노출
        expect(rowCount > 1 || hasTotal).toBe(true);
      }
```

💭 **AI VERIFY**: `count-change` — 검색 후 헤더 외 데이터 행 ≥1 또는 결과 건수 텍스트 노출

❓ **판단**: Y / N / 부분

---

## [샘플 9/15] MY-1-34 (위험 점수 5 — Tier 1)

📄 **docs 기대**: 인라인 에러가 표시된다

🚩 **위험 신호**: 정규식 hasText, fallback 비율 높음

🔍 **코드**:
```typescript
        await inputs.nth(0).fill('CurrentPw123!', { timeout: 5000 });
        await inputs.nth(1).fill('abc', { timeout: 5000 });
        await inputs.nth(2).fill('abc', { timeout: 5000 });
        // VERIFY visible: 유효성 미충족 시 인라인 에러 메시지 노출
        const errorMsg = page.locator('[role="alert"], [class*="error"], [class*="invalid"]').first()
          .or(page.getByText(/규칙|유효|영문|숫자|특수문자|글자/i).first());
        await expect(errorMsg).toBeVisible({ timeout: 5000 });
```

💭 **AI VERIFY**: `visible` — 유효성 미충족 시 인라인 에러 메시지 노출

❓ **판단**: Y / N / 부분

---

## [샘플 10/15] AUTH-1-05 (위험 점수 3 — Tier 1)

📄 **docs 기대**: 비로그인 세무사 검색 화면(3-3)으로 이동

🚩 **위험 신호**: 도메인 복잡

🔍 **코드**:
```typescript
 page }) => {
    // GNB 클릭 → URL 이동이 불안정하므로 직접 goto로 검증
    await page.goto('/search/tax-experts');
    // VERIFY url: 비로그인 세무사 검색 페이지로 이동
    await expect(page).toHaveURL(/\/search\/tax-experts/);
    // 세무사 검색 화면 핵심 요소 — 검색 입력 또는 비로그인 GNB(로그인/회원가입) 노출
    const searchInput = page.getByPlaceholder(/검색|세무사/).or(page.locator('input[type="search"]')).first();
```

💭 **AI VERIFY**: `url` — 비로그인 세무사 검색 페이지로 이동

❓ **판단**: Y / N / 부분

---

## [샘플 11/15] EO-1-12 (위험 점수 3 — Tier 1)

📄 **docs 기대**: 모든 필터 입력값이 초기 상태로 되돌아간다.

🚩 **위험 신호**: 도메인 복잡

🔍 **코드**:
```typescript
      if (await resetBtn.isVisible()) {
        await resetBtn.click({ timeout: 5000 }).catch(() => {});
        if (await nameInput.isVisible()) {
          // VERIFY value: 초기화 클릭 후 공무원명 입력란이 빈 값
          await expect(nameInput).toHaveValue('');
        }
      }
```

💭 **AI VERIFY**: `value` — 초기화 클릭 후 공무원명 입력란이 빈 값

❓ **판단**: Y / N / 부분

---

## [샘플 12/15] GO-1-01 (위험 점수 3 — Tier 1)

📄 **docs 기대**: 필터 초기 상태. 검색 결과 빈 상태

🚩 **위험 신호**: 도메인 복잡

🔍 **코드**:
```typescript
        await expect(submitBtn).toBeVisible();
        const resultRows = page.locator('tbody tr');
        const rowCount = await resultRows.count().catch(() => 0);
        // VERIFY count: 초기 진입 시 결과 행 0건 (필터 미입력 빈 상태)
        expect(rowCount, '초기 진입 시 결과 행 0건 기대').toBe(0);
      } else {
        await expect(page.locator('body')).toBeVisible();
```

💭 **AI VERIFY**: `count` — 초기 진입 시 결과 행 0건 (필터 미입력 빈 상태)

❓ **판단**: Y / N / 부분

---

## [샘플 13/15] EI-1-01 (위험 점수 0 — Tier 3)

📄 **docs 기대**: 기본 정보 탭 기본 활성. 기존 데이터 표시

🚩 **위험 신호**: 없음

🔍 **코드**:
```typescript
      await page.goto('/tax-history-management/basic-info');
      // VERIFY url: 기본 정보 탭으로 직접 진입
      await expect(page).toHaveURL(/\/tax-history-management\/basic-info/);
      // VERIFY visible: 기본 정보 탭 활성 노출
      await expect(page.getByTestId('tax-history-basic-tab')).toBeVisible();
```

💭 **AI VERIFY**: `visible` — 기본 정보 탭 활성 노출

❓ **판단**: Y / N / 부분

---

## [샘플 14/15] SP-1-13 (위험 점수 0 — Tier 3)

📄 **docs 기대**: 다이얼로그가 닫힌다

🚩 **위험 신호**: 없음

🔍 **코드**:
```typescript
          if (await dismissBtn.isVisible({ timeout: 3000 })) {
            await dismissBtn.click();
            await page.waitForTimeout(500);
            // VERIFY hidden: 취소 클릭 후 해지 철회 다이얼로그 닫힘
            await expect(dialog).not.toBeVisible({ timeout: 5000 });
          }
        }
```

💭 **AI VERIFY**: `hidden` — 취소 클릭 후 해지 철회 다이얼로그 닫힘

❓ **판단**: Y / N / 부분

---

## [샘플 15/15] HOME-TA-0-08 (위험 점수 0 — Tier 3)

📄 **docs 기대**: 세무 이력 관리/리포트 메뉴 미표시. 구독 유도 안내

🚩 **위험 신호**: 없음

🔍 **코드**:
```typescript
      if (opened) {
        const menuItem = page.getByRole('menuitem', { name: /세무 이력 관리/ }).first();
        if (await isVisibleSoft(menuItem, 2000)) {
          // VERIFY hidden: 미구독 세무사에게 "세무 이력 관리" 메뉴 미노출
          await expect(menuItem).not.toBeVisible();
        }
      }
```

💭 **AI VERIFY**: `hidden` — 미구독 세무사에게 "세무 이력 관리" 메뉴 미노출

❓ **판단**: Y / N / 부분

---

## 검토 안내

각 항목의 VERIFY description이 docs 기대 + 코드 의도와 일치하는지:
- **Y**: description 정확
- **N**: description 부정확 또는 코드 검증 부족
- **부분**: 방향은 맞지만 좁다/넓다
