# VERIFY 샘플링 — 위험 우선순위

생성: 2026-05-05T08:34:44.061Z
모듈: (전체)
샘플: 12 (Tier 1 위험) + 3 (Tier 3 랜덤) = 15건
전체 VERIFY 항목 수: 63

---

## [샘플 1/15] MY-1-21 (위험 점수 12 — Tier 1)

📄 **docs 기대**: 즉시 법인 기능의 모든 정보와 권한이 정지된다

🚩 **위험 신호**: AMBIGUOUS_DOC, 광범위 셀렉터 (.first()), fallback 비율 높음

🔍 **코드**:
```typescript
          return;
        }
        await confirm.first().click({ timeout: 5000 });
        // VERIFY hidden: 해제 클릭 후 확인 팝업 닫힘 (1단계)
        await expect(confirm.first()).not.toBeVisible({ timeout: 5000 });

        // 법인 연동 정보가 사라졌는지 검증 (2단계 = docs 기대 결과)
```

💭 **AI VERIFY**: `hidden` — 해제 클릭 후 확인 팝업 닫힘 (1단계)

❓ **판단**: Y / N / 부분

---

## [샘플 2/15] MY-1-21 (위험 점수 12 — Tier 1)

📄 **docs 기대**: 즉시 법인 기능의 모든 정보와 권한이 정지된다

🚩 **위험 신호**: AMBIGUOUS_DOC, 광범위 셀렉터 (.first()), fallback 비율 높음

🔍 **코드**:
```typescript

        // 법인 연동 정보가 사라졌는지 검증 (2단계 = docs 기대 결과)
        await page.waitForTimeout(1000);
        // VERIFY hidden: 해제 후 "연동 해제" 버튼 자체도 사라짐 (법인 연동 상태 종료)
        await expect(page.getByText('연동 해제', { exact: true }).first()).not.toBeVisible({ timeout: 5000 });
      } catch {
        await expect(page.locator('body')).toBeVisible();
```

💭 **AI VERIFY**: `hidden` — 해제 후 "연동 해제" 버튼 자체도 사라짐 (법인 연동 상태 종료)

❓ **판단**: Y / N / 부분

---

## [샘플 3/15] EO-1-11 (위험 점수 9 — Tier 1)

📄 **docs 기대**: 필터 조건에 맞는 전직 공무원 목록이 테이블에 표시된다. 결과 건수가 테이블 상단에 함께 표시된다. 사용자가 입력한 검색 조건 값이 화면에 유지된다.

🚩 **위험 신호**: 광범위 셀렉터 (.first()), 정규식 hasText, 도메인 복잡

🔍 **코드**:
```typescript
        const totalVisible = await isVisibleSoft(totalText, 5000);

        if (rowCount > 0) {
          // VERIFY text: 결과 행이 검색 조건(김)과 일치 — 첫 행에 검색어 포함
          await expect(dataRows.first()).toContainText(new RegExp(searchTerm));
        }
        if (totalVisible && rowCount > 0) {
```

💭 **AI VERIFY**: `text` — 결과 행이 검색 조건(김)과 일치 — 첫 행에 검색어 포함

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

## [샘플 6/15] MY-1-12 (위험 점수 7 — Tier 1)

📄 **docs 기대**: 주소가 저장되고 모달이 닫힌다

🚩 **위험 신호**: 광범위 셀렉터 (.first()), fallback 비율 높음

🔍 **코드**:
```typescript
          return;
        }
        await searchInput.first().fill(searchTerm, { timeout: 5000 });
        // VERIFY value: 검색어 입력값 반영 (1단계)
        await expect(searchInput.first()).toHaveValue(new RegExp(searchTerm));

        // 2단계: 돋보기/검색 트리거 — 입력만으론 자동 검색 안 되는 경우 명시적 트리거
```

💭 **AI VERIFY**: `value` — 검색어 입력값 반영 (1단계)

❓ **판단**: Y / N / 부분

---

## [샘플 7/15] MY-1-12 (위험 점수 7 — Tier 1)

📄 **docs 기대**: 주소가 저장되고 모달이 닫힌다

🚩 **위험 신호**: 광범위 셀렉터 (.first()), fallback 비율 높음

🔍 **코드**:
```typescript
          const reflectedInput = page.locator('input').filter({ hasText: '' }).first();
          // 선택한 주소의 일부 텍스트가 모달 내 어디든 노출되는지
          const selectedKeyword = (resultText.match(/[가-힣]{2,}/) ?? [searchTerm])[0];
          // VERIFY text: 리스트 선택 후 모달에 선택 주소가 반영됨 (3단계)
          await expect(page.locator('[role="dialog"], [class*="modal"]').first()).toContainText(selectedKeyword, { timeout: 3000 });
        }

```

💭 **AI VERIFY**: `text` — 리스트 선택 후 모달에 선택 주소가 반영됨 (3단계)

❓ **판단**: Y / N / 부분

---

## [샘플 8/15] MY-1-12 (위험 점수 7 — Tier 1)

📄 **docs 기대**: 주소가 저장되고 모달이 닫힌다

🚩 **위험 신호**: 광범위 셀렉터 (.first()), fallback 비율 높음

🔍 **코드**:
```typescript
        const applyBtn = page.getByRole('button', { name: /^변경$|^적용$|^확인$/ }).first();
        if (!(await isVisibleSoft(applyBtn, 3000))) return;
        await applyBtn.click({ timeout: 3000 }).catch(() => {});
        // VERIFY hidden: 변경 클릭 후 검색 input이 사라짐 (모달 닫힘 — 4단계)
        await expect(searchInput.first()).not.toBeVisible({ timeout: 5000 });

        // 5단계: 원래 화면(주소 영역)에 변경된 주소 반영
```

💭 **AI VERIFY**: `hidden` — 변경 클릭 후 검색 input이 사라짐 (모달 닫힘 — 4단계)

❓ **판단**: Y / N / 부분

---

## [샘플 9/15] MY-1-13 (위험 점수 7 — Tier 1)

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

## [샘플 10/15] EO-1-11 (위험 점수 5 — Tier 1)

📄 **docs 기대**: 필터 조건에 맞는 전직 공무원 목록이 테이블에 표시된다. 결과 건수가 테이블 상단에 함께 표시된다. 사용자가 입력한 검색 조건 값이 화면에 유지된다.

🚩 **위험 신호**: 정규식 hasText, 도메인 복잡

🔍 **코드**:
```typescript
      const searchTerm = '김';
      if (await isVisibleSoft(nameInput, 5000)) {
        await safeFill(nameInput, searchTerm);
        // VERIFY value: 검색 조건 입력값 반영
        await expect(nameInput).toHaveValue(searchTerm);
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
```

💭 **AI VERIFY**: `value` — 검색 조건 입력값 반영

❓ **판단**: Y / N / 부분

---

## [샘플 11/15] EO-1-11 (위험 점수 5 — Tier 1)

📄 **docs 기대**: 필터 조건에 맞는 전직 공무원 목록이 테이블에 표시된다. 결과 건수가 테이블 상단에 함께 표시된다. 사용자가 입력한 검색 조건 값이 화면에 유지된다.

🚩 **위험 신호**: 정규식 hasText, 도메인 복잡

🔍 **코드**:
```typescript
          // 표시 건수와 실제 행 수 매칭 검증 (페이지 1 한정, 최대 10건)
          const totalContent = (await totalText.textContent().catch(() => '')) ?? '';
          const totalNum = parseInt((totalContent.match(/\d+/) ?? ['0'])[0], 10);
          // VERIFY count-change: 표시 건수 ≥ 실제 행 수 (페이지네이션 시 행 수가 더 적을 수 있음)
          expect(totalNum).toBeGreaterThanOrEqual(rowCount);
        }
      }
```

💭 **AI VERIFY**: `count-change` — 표시 건수 ≥ 실제 행 수 (페이지네이션 시 행 수가 더 적을 수 있음)

❓ **판단**: Y / N / 부분

---

## [샘플 12/15] MY-1-34 (위험 점수 5 — Tier 1)

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

## [샘플 13/15] EI-0-01 (위험 점수 0 — Tier 3)

📄 **docs 기대**: 화면 표시. 기본 정보 탭 활성

🚩 **위험 신호**: 없음

🔍 **코드**:
```typescript
 page }) => {
        await page.goto('/tax-history-management/basic-info');
        // VERIFY url: 세무사 Pro가 세무 이력 관리 페이지 진입 가능
        await expect(page).toHaveURL(/\/tax-history-management/);
        // VERIFY visible: 진입 후 기본 정보 탭 노출
        await expect(page.getByTestId('tax-history-basic-tab')).toBeVisible();
```

💭 **AI VERIFY**: `url` — 세무사 Pro가 세무 이력 관리 페이지 진입 가능

❓ **판단**: Y / N / 부분

---

## [샘플 14/15] HOME-TP-0-01 (위험 점수 0 — Tier 3)

📄 **docs 기대**: 세무사 찾기 탭 기본 선택. 현직 공무원 탐색 탭 구독 유도. ~~TOP10 영역 미표시.~~ TOP10 영역 표시. 구독 배너 표시

🚩 **위험 신호**: 없음

🔍 **코드**:
```typescript
 page }) => {
      await page.goto('/');
      // VERIFY visible: 미구독 납세자 홈 진입 시 그리팅 노출
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
      // VERIFY visible: 미구독에게도 세무사 찾기 탭 노출
      await expect(page.getByTestId('home-tax-expert-tab')).toBeVisible();
```

💭 **AI VERIFY**: `visible` — 미구독 납세자 홈 진입 시 그리팅 노출

❓ **판단**: Y / N / 부분

---

## [샘플 15/15] HOME-TA-0-08 (위험 점수 0 — Tier 3)

📄 **docs 기대**: 세무 이력 관리/리포트 메뉴 미표시. 구독 유도 안내

🚩 **위험 신호**: 없음

🔍 **코드**:
```typescript
      if (opened) {
        // VERIFY count: GNB에 "세무 이력 관리" 메뉴 0개 (미구독에 미노출)
        await expect(page.getByRole('menuitem', { name: /세무 이력 관리/ })).toHaveCount(0);
        // VERIFY count: GNB에 "세무 이력 리포트" 메뉴 0개 (미구독에 미노출)
        await expect(page.getByRole('menuitem', { name: /세무 이력 리포트/ })).toHaveCount(0);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
```

💭 **AI VERIFY**: `count` — GNB에 "세무 이력 리포트" 메뉴 0개 (미구독에 미노출)

❓ **판단**: Y / N / 부분

---

## 검토 안내

각 항목의 VERIFY description이 docs 기대 + 코드 의도와 일치하는지:
- **Y**: description 정확
- **N**: description 부정확 또는 코드 검증 부족
- **부분**: 방향은 맞지만 좁다/넓다
