# VERIFY 샘플링 — 위험 우선순위

생성: 2026-05-05T09:19:56.229Z
모듈: (전체)
샘플: 12 (Tier 1 위험) + 3 (Tier 3 랜덤) = 15건
전체 VERIFY 항목 수: 37

---

## [샘플 1/15] AUTH-1-05 (위험 점수 3 — Tier 1)

📄 **docs 기대**: 비로그인 세무사 검색 화면(3-3)으로 이동

🚩 **위험 신호**: 도메인 복잡

🔍 **코드**:
```typescript
      return;
    }

    // VERIFY url: 세무사 찾기 클릭 후 검색 페이지로 이동
    await expect(page).toHaveURL(/\/search\/tax-experts/);
    const searchInput = page.getByPlaceholder(/검색|세무사/).or(page.locator('input[type="search"]')).first();
    const loginCta = page.getByText('로그인').first();
```

💭 **AI VERIFY**: `url` — 세무사 찾기 클릭 후 검색 페이지로 이동

❓ **판단**: Y / N / 부분

---

## [샘플 2/15] EO-1-12 (위험 점수 3 — Tier 1)

📄 **docs 기대**: 모든 필터 입력값이 초기 상태로 되돌아간다.

🚩 **위험 신호**: 도메인 복잡

🔍 **코드**:
```typescript
      }
      // 1단계: 조건 입력 + 입력값 반영 검증 (사전 조건 명시)
      await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      // VERIFY value: 초기화 전 입력값이 "김"으로 반영됨 (초기화의 의미를 위한 사전 상태)
      await expect(nameInput).toHaveValue('김');

      // 2단계: 초기화 버튼 탭
```

💭 **AI VERIFY**: `value` — 초기화 전 입력값이 "김"으로 반영됨 (초기화의 의미를 위한 사전 상태)

❓ **판단**: Y / N / 부분

---

## [샘플 3/15] EO-1-12 (위험 점수 3 — Tier 1)

📄 **docs 기대**: 모든 필터 입력값이 초기 상태로 되돌아간다.

🚩 **위험 신호**: 도메인 복잡

🔍 **코드**:
```typescript
      await resetBtn.click({ timeout: 5000 }).catch(() => {});

      // 3단계: 빈 값 검증 (docs 기대 결과)
      // VERIFY value: 초기화 클릭 후 공무원명 입력란이 빈 값으로 회복
      await expect(nameInput).toHaveValue('');
```

💭 **AI VERIFY**: `value` — 초기화 클릭 후 공무원명 입력란이 빈 값으로 회복

❓ **판단**: Y / N / 부분

---

## [샘플 4/15] GO-1-01 (위험 점수 3 — Tier 1)

📄 **docs 기대**: 필터 초기 상태. 검색 결과 빈 상태

🚩 **위험 신호**: 도메인 복잡

🔍 **코드**:
```typescript
 page }) => {
      // 첫 랜딩 화면 = 검색 화면으로 전환 + 검색 조건 미입력 + 결과 0건 검증
      await page.goto('/search/active-officials');
      // VERIFY url: 현직 공무원 탐색 페이지로 진입
      await expect(page).toHaveURL(/\/search\/active-officials/);

      const { submitBtn, nameInput } = searchSelectors(page);
```

💭 **AI VERIFY**: `url` — 현직 공무원 탐색 페이지로 진입

❓ **판단**: Y / N / 부분

---

## [샘플 5/15] GO-1-01 (위험 점수 3 — Tier 1)

📄 **docs 기대**: 필터 초기 상태. 검색 결과 빈 상태

🚩 **위험 신호**: 도메인 복잡

🔍 **코드**:
```typescript
        await expect(page.locator('body')).toBeVisible();
        return;
      }
      // VERIFY visible: 검색 화면 진입 — 검색 버튼 노출
      await expect(submitBtn).toBeVisible();
      // VERIFY value: 검색 조건 미입력 — 공무원명 입력란 빈 값
      if (await isVisibleSoft(nameInput, 3000)) {
```

💭 **AI VERIFY**: `visible` — 검색 화면 진입 — 검색 버튼 노출

❓ **판단**: Y / N / 부분

---

## [샘플 6/15] GO-1-01 (위험 점수 3 — Tier 1)

📄 **docs 기대**: 필터 초기 상태. 검색 결과 빈 상태

🚩 **위험 신호**: 도메인 복잡

🔍 **코드**:
```typescript
      }
      // VERIFY visible: 검색 화면 진입 — 검색 버튼 노출
      await expect(submitBtn).toBeVisible();
      // VERIFY value: 검색 조건 미입력 — 공무원명 입력란 빈 값
      if (await isVisibleSoft(nameInput, 3000)) {
        await expect(nameInput).toHaveValue('');
      }
```

💭 **AI VERIFY**: `value` — 검색 조건 미입력 — 공무원명 입력란 빈 값

❓ **판단**: Y / N / 부분

---

## [샘플 7/15] GO-1-01 (위험 점수 3 — Tier 1)

📄 **docs 기대**: 필터 초기 상태. 검색 결과 빈 상태

🚩 **위험 신호**: 도메인 복잡

🔍 **코드**:
```typescript
      if (await isVisibleSoft(nameInput, 3000)) {
        await expect(nameInput).toHaveValue('');
      }
      // VERIFY count: 초기 진입 시 결과 행 0건 (검색 결과 미실행 상태)
      const resultRows = page.locator('tbody tr');
      const rowCount = await resultRows.count().catch(() => 0);
      expect(rowCount, '초기 진입 시 결과 행 0건 기대').toBe(0);
```

💭 **AI VERIFY**: `count` — 초기 진입 시 결과 행 0건 (검색 결과 미실행 상태)

❓ **판단**: Y / N / 부분

---

## [샘플 8/15] SP-2-06 (위험 점수 3 — Tier 1)

📄 **docs 기대**: 다이얼로그가 닫힌다

🚩 **위험 신호**: fallback 비율 높음

🔍 **코드**:
```typescript
            if (await isVisibleSoft(cancelBtn)) {
              await cancelBtn.click({ timeout: 3000 });
              await page.waitForTimeout(500);
              // VERIFY hidden: 취소 클릭 후 구독 확인 다이얼로그 닫힘
              await expect(dialog).not.toBeVisible({ timeout: 5000 });
            } else {
              await expect(page.locator('body')).toBeVisible();
```

💭 **AI VERIFY**: `hidden` — 취소 클릭 후 구독 확인 다이얼로그 닫힘

❓ **판단**: Y / N / 부분

---

## [샘플 9/15] TA-1-01 (위험 점수 3 — Tier 1)

📄 **docs 기대**: 세무사 탭이 기본 활성. 필터 초기 상태

🚩 **위험 신호**: 도메인 복잡

🔍 **코드**:
```typescript
      const { firmInput, expertNameInput } = searchSelectors(page);
      // 페이지 진입 가드
      await expect(page.getByTestId('search-compact-firm-btn')).toBeVisible();
      // VERIFY value: 세무법인명 입력란 빈 값 (필터 초기 상태)
      if (await isVisibleSoft(firmInput)) {
        await expect(firmInput).toHaveValue('');
      }
```

💭 **AI VERIFY**: `value` — 세무법인명 입력란 빈 값 (필터 초기 상태)

❓ **판단**: Y / N / 부분

---

## [샘플 10/15] TA-1-01 (위험 점수 3 — Tier 1)

📄 **docs 기대**: 세무사 탭이 기본 활성. 필터 초기 상태

🚩 **위험 신호**: 도메인 복잡

🔍 **코드**:
```typescript
      if (await isVisibleSoft(firmInput)) {
        await expect(firmInput).toHaveValue('');
      }
      // VERIFY value: 세무사명 입력란 빈 값 (필터 초기 상태)
      if (await isVisibleSoft(expertNameInput)) {
        await expect(expertNameInput).toHaveValue('');
      }
```

💭 **AI VERIFY**: `value` — 세무사명 입력란 빈 값 (필터 초기 상태)

❓ **판단**: Y / N / 부분

---

## [샘플 11/15] TF-1-07 (위험 점수 3 — Tier 1)

📄 **docs 기대**: 검색 결과 표시. 초기화 시 전체 목록 복귀

🚩 **위험 신호**: 도메인 복잡

🔍 **코드**:
```typescript
      const searchInput = page.getByPlaceholder(/검색/).first();
      if (await searchInput.isVisible({ timeout: 5000 })) {
        await searchInput.fill('테스트');
        // VERIFY value: 멤버 검색 입력란에 "테스트" 텍스트 반영
        await expect(searchInput).toHaveValue('테스트');
      }
```

💭 **AI VERIFY**: `value` — 멤버 검색 입력란에 "테스트" 텍스트 반영

❓ **판단**: Y / N / 부분

---

## [샘플 12/15] AUTH-1-06 (위험 점수 2 — Tier 1)

📄 **docs 기대**: 멤버십 안내 화면(3-2)으로 이동

🚩 **위험 신호**: 정규식 hasText

🔍 **코드**:
```typescript
 page }) => {
    // GNB 클릭 → URL 이동이 불안정하므로 직접 goto로 검증
    await page.goto('/membership');
    // VERIFY url: 멤버십 안내 페이지로 이동
    await expect(page).toHaveURL(/\/membership/);
    if (await is404(page)) return;
    // 멤버십 안내 화면 핵심: 일반 납세자 / Basic / Pro / Team 등 플랜 텍스트 노출
```

💭 **AI VERIFY**: `url` — 멤버십 안내 페이지로 이동

❓ **판단**: Y / N / 부분

---

## [샘플 13/15] EI-1-01 (위험 점수 0 — Tier 3)

📄 **docs 기대**: 기본 정보 탭 기본 활성. 기존 데이터 표시

🚩 **위험 신호**: 없음

🔍 **코드**:
```typescript
        await expect(page.locator('body')).toBeVisible();
        return;
      }
      // VERIFY url: GNB 클릭 후 세무 이력 관리 페이지로 이동
      await expect(page).toHaveURL(/\/tax-history-management/);
      // VERIFY visible: 이동 후 기본 정보 탭 활성 노출
      await expect(page.getByTestId('tax-history-basic-tab')).toBeVisible();
```

💭 **AI VERIFY**: `url` — GNB 클릭 후 세무 이력 관리 페이지로 이동

❓ **판단**: Y / N / 부분

---

## [샘플 14/15] MY-0-01 (위험 점수 0 — Tier 3)

📄 **docs 기대**: (docs 기대 결과 매핑 없음)

🚩 **위험 신호**: 없음

🔍 **코드**:
```typescript
 page }) => {
      await page.goto('/my-info');
      await expect(page.locator('body')).toBeVisible();
      // VERIFY visible: 내 정보 화면 진입 후 핵심 항목(이메일/비밀번호/이름/전화번호/탈퇴) 노출
      await expect(page.getByTestId('myinfo-email-label')).toBeVisible();
      await expect(page.getByTestId('myinfo-password-label')).toBeVisible();
      await expect(page.getByTestId('myinfo-name-label')).toBeVisible();
```

💭 **AI VERIFY**: `visible` — 내 정보 화면 진입 후 핵심 항목(이메일/비밀번호/이름/전화번호/탈퇴) 노출

❓ **판단**: Y / N / 부분

---

## [샘플 15/15] MY-1-04 (위험 점수 0 — Tier 3)

📄 **docs 기대**: 모달이 닫히고 내 정보 화면으로 복귀한다. 이메일은 변경되지 않는다

🚩 **위험 신호**: 없음

🔍 **코드**:
```typescript
          await cancelBtn.first().click({ timeout: 5000 });
        }
      } catch {}
      // VERIFY visible: 취소 후 페이지 복귀 — 이메일 라벨 유지
      await expect(page.getByTestId('myinfo-email-label')).toBeVisible();
```

💭 **AI VERIFY**: `visible` — 취소 후 페이지 복귀 — 이메일 라벨 유지

❓ **판단**: Y / N / 부분

---

## 검토 안내

각 항목의 VERIFY description이 docs 기대 + 코드 의도와 일치하는지:
- **Y**: description 정확
- **N**: description 부정확 또는 코드 검증 부족
- **부분**: 방향은 맞지만 좁다/넓다
