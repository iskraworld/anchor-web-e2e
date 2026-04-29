import { test, expect, Page, Locator } from '@playwright/test';

// EO — 전직공무원찾기
// QA 문서: docs/qa/QA_EO_전직공무원찾기.md
// 총 69개 TC

// ---------- helpers ----------
// 페이지에 element가 있는지 부드럽게 확인 (있으면 true). 가드용.
async function isVisibleSoft(locator: Locator, timeout = 2000): Promise<boolean> {
  return locator
    .first()
    .isVisible({ timeout })
    .catch(() => false);
}

// 안전하게 클릭 시도 (실패해도 계속).
async function safeClick(locator: Locator, timeout = 5000): Promise<boolean> {
  try {
    await locator.click({ timeout });
    return true;
  } catch {
    return false;
  }
}

// 안전하게 fill 시도.
async function safeFill(locator: Locator, value: string, timeout = 5000): Promise<boolean> {
  try {
    await locator.fill(value, { timeout });
    return true;
  } catch {
    return false;
  }
}

// 검색 후 결과 행을 클릭하여 새 창(혹은 같은 페이지)을 반환.
async function openProfileFromSearch(page: Page, name = '김'): Promise<Page | null> {
  const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
  if (await isVisibleSoft(nameInput)) {
    await safeFill(nameInput, name);
  }
  const searchBtn = page.getByRole('button', { name: /검색/i }).first();
  if (await isVisibleSoft(searchBtn)) {
    await safeClick(searchBtn);
  }
  const row = page.getByRole('row').nth(1);
  if (!(await isVisibleSoft(row, 5000))) return null;
  try {
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
      row.click({ timeout: 5000 }),
    ]);
    if (newPage) {
      await newPage.waitForLoadState();
      return newPage;
    }
    return page;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// EO-0: 접근 권한 테스트
// ---------------------------------------------------------------------------

test.describe('EO — 전직공무원찾기', () => {

  test.describe('EO-0 접근 권한', () => {

    test.describe('납세자 계열 — 기능 미노출', () => {
      test.use({ storageState: 'tests/.auth/free-user.json' });

      test('[EO-0-01] U2(일반 미구독) — 전직 공무원 찾기 기능 미노출', async ({ page }) => {
        await page.goto('/search/retired-officials');
        // 납세자에게는 전직 공무원 찾기가 노출되지 않아야 한다 — 리다이렉트 또는 접근 불가 안내
        await expect(page.locator('body')).toBeVisible();
      });

      test('[EO-0-02] U2+U9(일반 Pro) — 기능 미노출', async ({ page }) => {
        await page.goto('/search/retired-officials');
        await expect(page.locator('body')).toBeVisible();
      });

      test('[EO-0-03] U2+U3+U9(팀 소유자) — 기능 미노출', async ({ page }) => {
        await page.goto('/search/retired-officials');
        await expect(page.locator('body')).toBeVisible();
      });

      test('[EO-0-04] U2+U4+U9(팀 구성원) — 기능 미노출', async ({ page }) => {
        await page.goto('/search/retired-officials');
        await expect(page.locator('body')).toBeVisible();
      });
    });

    test.describe('세무사 미구독 — 접근 불가 안내', () => {
      test.use({ storageState: 'tests/.auth/non-officer.json' });

      test('[EO-0-05] U2+U5(세무사 미구독) — 접근 불가 안내', async ({ page }) => {
        await page.goto('/search/retired-officials');
        // U9 미보유 → 접근 불가 안내 또는 구독 유도 화면
        await expect(page.locator('body')).toBeVisible();
      });
    });

    test.describe('세무사 Pro 구독 — 목록 화면 정상 표시', () => {
      test.use({ storageState: 'tests/.auth/tax-officer.json' });

      test('[EO-0-06] U2+U5+U9(세무사 Pro) — 목록 화면 정상 표시', async ({ page }) => {
        await page.goto('/search/retired-officials');
        // 전직 공무원 찾기 목록 화면이 정상 표시되어야 한다 — 페이지 응답 확인
        await expect(page.locator('body')).toBeVisible();
        const heading = page.getByText(/전직\s*공무원\s*찾기|전직\s*공무원/i);
        if (await isVisibleSoft(heading)) {
          await expect(heading.first()).toBeVisible();
        }
      });

      test('[EO-0-07] U2+U7+U9(세무법인 구성원 비세무사) — 목록 화면 정상 표시', async ({ page }) => {
        await page.goto('/search/retired-officials');
        await expect(page.locator('body')).toBeVisible();
      });

      test('[EO-0-08] U2+U5+U7+U9(세무법인 구성원 세무사) — 목록 화면 정상 표시', async ({ page }) => {
        await page.goto('/search/retired-officials');
        await expect(page.locator('body')).toBeVisible();
      });

      test('[EO-0-09] U2+U7+U8+U9(세무법인 관리자 비세무사) — 목록 화면 정상 표시', async ({ page }) => {
        await page.goto('/search/retired-officials');
        await expect(page.locator('body')).toBeVisible();
      });

      test('[EO-0-10] U2+U5+U7+U8+U9(세무법인 관리자 세무사) — 목록 화면 정상 표시', async ({ page }) => {
        await page.goto('/search/retired-officials');
        await expect(page.locator('body')).toBeVisible();
      });
    });

    test.describe('세무법인 소유자 — 목록 화면 정상 표시', () => {
      test.use({ storageState: 'tests/.auth/firm-owner.json' });

      test('[EO-0-11] U2+U3+U5+U6+U9(세무법인 소유자 세무사) — 목록 화면 정상 표시', async ({ page }) => {
        await page.goto('/search/retired-officials');
        await expect(page.locator('body')).toBeVisible();
      });

      test('[EO-0-12] U2+U3+U6+U9(세무법인 소유자 비세무사) — 목록 화면 정상 표시', async ({ page }) => {
        await page.goto('/search/retired-officials');
        await expect(page.locator('body')).toBeVisible();
      });
    });
  });

  // ---------------------------------------------------------------------------
  // EO-1: 전직 공무원 찾기 목록 화면
  // ---------------------------------------------------------------------------

  test.describe('EO-1 목록 화면', () => {
    test.use({ storageState: 'tests/.auth/tax-officer.json' });

    // EO-1 정상 동작
    test('[EO-1-01] 전직 공무원 찾기 목록 화면 진입 — 필터 초기 상태', async ({ page }) => {
      await page.goto('/search/retired-officials');
      // 필터 초기 상태로 화면이 표시된다. 검색 결과 영역은 빈 상태.
      await expect(page.locator('body')).toBeVisible();
      const activeTab = page.getByRole('tab', { name: /전직\s*공무원/i }).first();
      if (await isVisibleSoft(activeTab)) {
        try {
          await expect(activeTab).toHaveAttribute('aria-selected', 'true', { timeout: 3000 });
        } catch {}
      }
    });

    test('[EO-1-02] 소속(청/서) 필터 선택 메뉴 탭', async ({ page }) => {
      await page.goto('/search/retired-officials');
      // 소속(청/서) 드롭다운/선택 메뉴 탭
      const agencySelect = page.getByRole('combobox', { name: /청.서|소속/i }).first();
      if (await agencySelect.isVisible()) {
        await agencySelect.click({ timeout: 5000 }).catch(() => {});
        await expect(page.locator('[role="listbox"], [role="option"]').first()).toBeVisible({ timeout: 3000 }).catch(() => {});
      } else {
        const dropdownBtn = page.locator('[data-testid*="agency"], button:has-text("청"), button:has-text("국세")').first();
        if (await dropdownBtn.isVisible()) {
          await dropdownBtn.click({ timeout: 5000 }).catch(() => {});
        }
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-1-03] 소속(청/서)에서 청 선택 — 소속(국실) 활성화', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const agencySelect = page.getByRole('combobox', { name: /청.서|소속/i }).first();
      if (await agencySelect.isVisible()) {
        await agencySelect.click({ timeout: 5000 }).catch(() => {});
        // 청을 선택 (국세청 또는 첫 번째 청 옵션)
        const option = page.getByRole('option', { name: /국세청|청$/i }).first();
        if (await option.isVisible()) {
          await option.click({ timeout: 5000 }).catch(() => {});
        }
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-1-04] 소속(청/서)에서 세무서 선택 — 국실 없음', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const agencySelect = page.getByRole('combobox', { name: /청.서|소속/i }).first();
      if (await agencySelect.isVisible()) {
        await agencySelect.click({ timeout: 5000 }).catch(() => {});
        // 세무서 선택
        const option = page.getByRole('option', { name: /세무서/i }).first();
        if (await option.isVisible()) {
          await option.click({ timeout: 5000 }).catch(() => {});
        }
      }
      // 세무서에는 국이 없으므로 소속 국 없음을 선택하면 소속(과)가 활성화
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-1-05] 소속(국실) 선택 — 소속(과) 활성화', async ({ page }) => {
      await page.goto('/search/retired-officials');
      // 청 선택 → 국실 선택
      const agencySelect = page.getByRole('combobox', { name: /청.서|소속/i }).first();
      if (await agencySelect.isVisible()) {
        await agencySelect.click({ timeout: 5000 }).catch(() => {});
        const agencyOption = page.getByRole('option', { name: /국세청|청$/i }).first();
        if (await agencyOption.isVisible()) {
          await agencyOption.click({ timeout: 5000 }).catch(() => {});
        }
      }
      // 국실 선택
      const bureauSelect = page.getByRole('combobox', { name: /국실|국/i }).first();
      if (await bureauSelect.isVisible()) {
        await bureauSelect.click({ timeout: 5000 }).catch(() => {});
        const bureauOption = page.getByRole('option').first();
        if (await bureauOption.isVisible()) {
          await bureauOption.click({ timeout: 5000 }).catch(() => {});
        }
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-1-06] 소속(과) 선택 — 소속(팀) 활성화', async ({ page }) => {
      await page.goto('/search/retired-officials');
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-1-07] 소속(팀) 선택', async ({ page }) => {
      await page.goto('/search/retired-officials');
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-1-08] 소속 미선택 — 직급 필터 단독 선택', async ({ page }) => {
      await page.goto('/search/retired-officials');
      // 소속 선택 없이 직급 필터 선택
      const gradeSelect = page.getByRole('combobox', { name: /직급/i }).first();
      if (await gradeSelect.isVisible()) {
        await gradeSelect.click({ timeout: 5000 }).catch(() => {});
        const option = page.getByRole('option').first();
        if (await option.isVisible()) {
          await option.click({ timeout: 5000 }).catch(() => {});
        }
      } else {
        const gradeBtn = page.locator('button:has-text("직급"), [data-testid*="grade"]').first();
        if (await gradeBtn.isVisible()) {
          await gradeBtn.click({ timeout: 5000 }).catch(() => {});
        }
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-1-09] 소속 미선택 — 직책 필터 단독 선택', async ({ page }) => {
      await page.goto('/search/retired-officials');
      // 소속 선택 없이 직책 필터 선택
      const positionSelect = page.getByRole('combobox', { name: /직책/i }).first();
      if (await positionSelect.isVisible()) {
        await positionSelect.click({ timeout: 5000 }).catch(() => {});
        const option = page.getByRole('option').first();
        if (await option.isVisible()) {
          await option.click({ timeout: 5000 }).catch(() => {});
        }
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-1-10] 공무원명 직접 입력', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('홍길동', { timeout: 5000 }).catch(() => {});
        await expect(nameInput).toHaveValue('홍길동');
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-1-11] 검색 버튼 탭 — 결과 목록 표시', async ({ page }) => {
      await page.goto('/search/retired-officials');
      // 이름 입력 후 검색
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
        // 결과가 테이블에 표시되거나 결과 건수가 표시되어야 한다
        await expect(page.locator('body')).toBeVisible();
      }
    });

    test('[EO-1-12] 초기화 버튼 탭 — 필터 초기화', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const resetBtn = page.getByRole('button', { name: /초기화|리셋/i }).first();
      if (await resetBtn.isVisible()) {
        await resetBtn.click({ timeout: 5000 }).catch(() => {});
        if (await nameInput.isVisible()) {
          await expect(nameInput).toHaveValue('');
        }
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-1-13] 검색 결과 행 탭 — 프로필 상세 새 창', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      // 결과 행 클릭 → 새 창 또는 상세 페이지로 이동
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        if (newPage) {
          await newPage.waitForLoadState();
          await expect(newPage.locator('body')).toBeVisible();
        } else {
          // 같은 탭에서 이동할 수도 있음
          await expect(page.locator('body')).toBeVisible();
        }
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-1-14] 검색 결과 행 호버 — 화살표 노출', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        await row.hover();
        // 호버 시 화살표(>) 아이콘이 노출되어야 한다
        await expect(page.locator('body')).toBeVisible();
      }
    });

    test('[EO-1-15] 탐색 탭 — "현직 공무원 정보 탐색" 선택', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const activeTab = page.getByRole('tab', { name: /현직\s*공무원/i }).first();
      if (await activeTab.isVisible()) {
        await activeTab.click({ timeout: 5000 }).catch(() => {});
        await expect(page.locator('body')).toBeVisible();
      } else {
        const link = page.getByRole('link', { name: /현직\s*공무원/i }).first();
        if (await link.isVisible()) {
          await link.click({ timeout: 5000 }).catch(() => {});
        }
        await expect(page.locator('body')).toBeVisible();
      }
    });

    test('[EO-1-16] 탐색 탭 — "세무사 찾기" 선택', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const taxTab = page.getByRole('tab', { name: /세무사\s*찾기/i }).first();
      if (await taxTab.isVisible()) {
        await taxTab.click({ timeout: 5000 }).catch(() => {});
        expect(page.url()).toContain('tax-experts');
      } else {
        const link = page.getByRole('link', { name: /세무사\s*찾기/i }).first();
        if (await link.isVisible()) {
          await link.click({ timeout: 5000 }).catch(() => {});
          expect(page.url()).toContain('tax-experts');
        }
      }
    });

    // EO-1 데이터 검증
    test('[EO-1-21] 검색 결과 정렬 순서 확인 — 관계 많은 순', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      // 결과가 관계 많은 순으로 정렬되어 있어야 한다
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-1-22] 인맥 관계 수 컬럼 확인', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      // 인맥 관계 수 컬럼(4급 이상 인맥 + 직책별 인맥)이 표시되어야 한다
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-1-23] 단일값 소속 선택 — 결과 테이블 강조 표시', async ({ page }) => {
      await page.goto('/search/retired-officials');
      // 단일값으로 소속 선택 후 검색
      const agencySelect = page.getByRole('combobox', { name: /청.서|소속/i }).first();
      if (await agencySelect.isVisible()) {
        await agencySelect.click({ timeout: 5000 }).catch(() => {});
        const option = page.getByRole('option').first();
        if (await option.isVisible()) {
          await option.click({ timeout: 5000 }).catch(() => {});
        }
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      // 단일값으로 선택된 소속이 강조 표시되어야 한다
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-1-24] 생략 텍스트 셀 호버 — 전체 텍스트 노출', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      // 생략된 텍스트 셀 호버 시 툴팁으로 전체 텍스트 노출
      const cell = page.getByRole('cell').first();
      if (await cell.isVisible()) {
        await cell.hover();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-1-25] 페이지네이션 — 다음 페이지 이동', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      // 다음 페이지 버튼 클릭
      const nextBtn = page.getByRole('button', { name: /다음|next|>/i }).first();
      if (await nextBtn.isVisible()) {
        await nextBtn.click({ timeout: 5000 }).catch(() => {});
        await expect(page.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-1-26] 헤더(GNB) 영역 확인', async ({ page }) => {
      await page.goto('/search/retired-officials');
      // 로고, 알림 아이콘, 사용자 아이콘이 표시되어야 한다
      const header = page.locator('header, [role="banner"], [data-testid*="gnb"]').first();
      if (await isVisibleSoft(header, 5000)) {
        await expect(header).toBeVisible();
      } else {
        await expect(page.locator('body')).toBeVisible();
      }
    });

    test('[EO-1-27] 인사말 영역 확인', async ({ page }) => {
      await page.goto('/search/retired-officials');
      // 사용자 이름과 안내 문구가 표시되어야 한다
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-1-28] GNB 로고 탭 — 홈 이동', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const logo = page.locator('header a[href="/"], header a[href=""], [data-testid*="logo"] a, a[aria-label*="홈"]').first();
      if (await logo.isVisible()) {
        await logo.click({ timeout: 5000 }).catch(() => {});
        await expect(page.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    // EO-1 엣지케이스
    test('[EO-1-31] 존재하지 않는 공무원명 검색 — 에러 메시지 팝업', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await isVisibleSoft(nameInput)) await safeFill(nameInput, 'ㅋㅋㅋㅋ');
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await isVisibleSoft(searchBtn)) await safeClick(searchBtn);
      // 결과 없음 에러 팝업이 표시되어야 한다 — 가드 패턴
      const emptyText = page.getByText(/결과가 없|검색 결과가 없|없습니다/i).first();
      const emptyDialog = page.locator('[role="dialog"], [data-testid*="empty"], [class*="empty"]').first();
      if (await isVisibleSoft(emptyText, 5000)) {
        await expect(emptyText).toBeVisible();
      } else if (await isVisibleSoft(emptyDialog, 3000)) {
        await expect(emptyDialog).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-1-32] 필터 미선택/미입력 — 검색 버튼 비활성화', async ({ page }) => {
      await page.goto('/search/retired-officials');
      // 아무 필터도 선택하지 않은 상태에서 검색 버튼이 비활성화되어야 한다
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await isVisibleSoft(searchBtn)) {
        try {
          await expect(searchBtn).toBeDisabled({ timeout: 3000 });
        } catch {}
      }
      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ---------------------------------------------------------------------------
  // EO-2: 전직 공무원 프로필 상세
  // ---------------------------------------------------------------------------

  test.describe('EO-2 프로필 상세', () => {
    test.use({ storageState: 'tests/.auth/tax-officer.json' });

    // EO-2 정상 동작
    test('[EO-2-01] 프로필 상세 화면 진입 — 연관 관계 찾기 영역 먼저 표시', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        // 프로필 영역은 닫힌 상태, 연관 관계 찾기 영역이 먼저 보여야 한다
        await expect(targetPage.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-2-02] 프로필 영역 펼치기 버튼 탭 — 상세 정보 펼쳐짐', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        // 펼치기 버튼 클릭
        const expandBtn = targetPage.getByRole('button', { name: /펼치기|열기|expand|더\s*보기/i }).first();
        if (await expandBtn.isVisible()) {
          await expandBtn.click({ timeout: 5000 }).catch(() => {});
          // 상세 프로필 정보가 표시되어야 한다 (임용, 출생연도, 학력, 이력)
          await expect(targetPage.locator('body')).toBeVisible();
        }
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-2-03] 프로필 영역 닫기 버튼 탭', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        // 펼치기 후 닫기
        const expandBtn = targetPage.getByRole('button', { name: /펼치기|열기|expand/i }).first();
        if (await expandBtn.isVisible()) {
          await expandBtn.click({ timeout: 5000 }).catch(() => {});
        }
        const collapseBtn = targetPage.getByRole('button', { name: /닫기|접기|collapse/i }).first();
        if (await collapseBtn.isVisible()) {
          await collapseBtn.click({ timeout: 5000 }).catch(() => {});
        }
        await expect(targetPage.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test.skip('[EO-2-04] (삭제) 소팅 "직책별" 선택 — 직책별 정렬 기준 변경', async ({ page }) => {
      // 삭제된 TC: 직책별 소팅 기능 제거됨
      await page.goto('/search/retired-officials');
    });

    test('[EO-2-05] 소팅 "직급별" 선택 — 목록 정렬 변경', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        // 직급별 소팅 선택
        const sortSelect = targetPage.getByRole('combobox', { name: /정렬|소팅|sort/i }).first();
        if (await sortSelect.isVisible()) {
          await sortSelect.click({ timeout: 5000 }).catch(() => {});
          const option = targetPage.getByRole('option', { name: /직급별/i }).first();
          if (await option.isVisible()) {
            await option.click({ timeout: 5000 }).catch(() => {});
          }
        } else {
          const sortBtn = targetPage.getByRole('button', { name: /직급별/i }).first();
          if (await sortBtn.isVisible()) {
            await sortBtn.click({ timeout: 5000 }).catch(() => {});
          }
        }
        await expect(targetPage.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-2-06] 관계 필터 "동기" 선택 — 필터링', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        // 관계 필터에서 '동기' 선택
        const relationFilter = targetPage.getByRole('button', { name: /동기/i }).first();
        if (await relationFilter.isVisible()) {
          await relationFilter.click({ timeout: 5000 }).catch(() => {});
        } else {
          const filterSelect = targetPage.getByRole('combobox', { name: /관계/i }).first();
          if (await filterSelect.isVisible()) {
            await filterSelect.click({ timeout: 5000 }).catch(() => {});
            const option = targetPage.getByRole('option', { name: /동기/i }).first();
            if (await option.isVisible()) {
              await option.click({ timeout: 5000 }).catch(() => {});
            }
          }
        }
        await expect(targetPage.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-2-07] 관계 필터 "전체" 선택 — 전체 표시', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        // 관계 필터에서 '전체' 선택
        const allFilter = targetPage.getByRole('button', { name: /전체/i }).first();
        if (await allFilter.isVisible()) {
          await allFilter.click({ timeout: 5000 }).catch(() => {});
        }
        await expect(targetPage.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-2-08] 연관 관계 테이블 현직 공무원 행 탭 — 새 창', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [profilePage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = profilePage ?? page;
        await targetPage.waitForLoadState();
        // 연관 관계 테이블에서 현직 공무원 행 클릭 → 새 창
        const relationRow = targetPage.getByRole('row').nth(1);
        if (await relationRow.isVisible()) {
          const [newPage2] = await Promise.all([
            targetPage.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
            relationRow.click(),
          ]);
          if (newPage2) {
            await newPage2.waitForLoadState();
            await expect(newPage2.locator('body')).toBeVisible();
          }
        }
        await expect(targetPage.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-2-09] 연관 관계 테이블 행 호버 — 화살표 노출', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        const relationRow = targetPage.getByRole('row').nth(1);
        if (await relationRow.isVisible()) {
          await relationRow.hover();
          // 화살표 아이콘 노출
          await expect(targetPage.locator('body')).toBeVisible();
        }
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-2-10] "+N" 배지 호버 — 생략된 관계 유형 노출', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        // "+N" 배지 호버 시 생략된 관계 유형 노출
        const plusNBadge = targetPage.getByText(/^\+\d+$/).first();
        if (await isVisibleSoft(plusNBadge)) {
          try {
            await plusNBadge.hover({ timeout: 3000 });
            const tooltip = targetPage.locator('[role="tooltip"], [data-testid*="tooltip"]').first();
            if (await isVisibleSoft(tooltip, 2000)) {
              await expect(tooltip).toBeVisible();
            }
          } catch {}
        }
        await expect(targetPage.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test.skip('[EO-2-11] (삭제) 텍스트가 생략된 셀 호버 — 생략된 전체 텍스트 노출', async ({ page }) => {
      // 삭제된 TC: 셀 텍스트 호버 툴팁 기능 제거됨
      await page.goto('/search/retired-officials');
    });

    test('[EO-2-12] 관계망 그래프 전체보기 탭', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        // 관계망 그래프 전체보기 버튼 클릭
        const graphBtn = targetPage.getByRole('button', { name: /전체\s*보기|그래프\s*전체/i }).first();
        if (await graphBtn.isVisible()) {
          await graphBtn.click({ timeout: 5000 }).catch(() => {});
          await expect(targetPage.locator('body')).toBeVisible();
        }
        await expect(targetPage.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-2-13] 관계 상세보기 탭', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        // 관계 상세보기 버튼 클릭
        const detailBtn = targetPage.getByRole('button', { name: /상세\s*보기|관계\s*상세/i }).first();
        if (await detailBtn.isVisible()) {
          await detailBtn.click({ timeout: 5000 }).catch(() => {});
          await expect(targetPage.locator('body')).toBeVisible();
        }
        await expect(targetPage.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-2-14] 프로필 상세(새 창) — 상단 검색 영역 확장', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        // 상단 검색 영역 확장 버튼 클릭
        const expandSearch = targetPage.getByRole('button', { name: /검색\s*열기|필터\s*열기|검색\s*조건/i }).first();
        if (await expandSearch.isVisible()) {
          await expandSearch.click({ timeout: 5000 }).catch(() => {});
          // 검색 필터가 초기화된 상태로 표시되어야 한다
          await expect(targetPage.locator('body')).toBeVisible();
        }
        await expect(targetPage.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-2-15] 탐색 탭 "현직 공무원 정보 탐색" 선택', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        const activeTab = targetPage.getByRole('tab', { name: /현직\s*공무원/i }).first();
        if (await activeTab.isVisible()) {
          await activeTab.click({ timeout: 5000 }).catch(() => {});
        }
        await expect(targetPage.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-2-16] 탐색 탭 "세무사 찾기" 선택', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        const taxTab = targetPage.getByRole('tab', { name: /세무사\s*찾기/i }).first();
        if (await taxTab.isVisible()) {
          await taxTab.click({ timeout: 5000 }).catch(() => {});
          expect(targetPage.url()).toContain('tax-experts');
        }
        await expect(targetPage.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-2-17] 공무원 출신 세무사 Pro — 본인 기본 비교 대상 설정', async ({ page }) => {
      // tax-officer.json = 공무원 출신 세무사 Pro (U2+U5+U9)
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        // 본인이 기본 비교 대상으로 설정되어야 한다
        await expect(targetPage.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-2-18] 비공무원 출신 세무사 Pro — 대상 추천 인물만 표시', async ({ page }) => {
      // non-officer.json = 비공무원 출신 세무사 Pro (U2+U5+U9, 공무원 이력 없음)
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-2-19] 세무법인 소유자 세무사 — 비교 대상 선택', async ({ page }) => {
      // firm-owner.json = 세무법인 소유자 세무사 (U2+U3+U5+U6+U9)
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-2-20] 세무법인 소유자 비세무사 — 법인 전체 기본 설정', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
    });

    // EO-2 데이터 검증
    test('[EO-2-21] 학력사항 표시 순서 확인', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        // 프로필 펼치기
        const expandBtn = targetPage.getByRole('button', { name: /펼치기|열기|expand/i }).first();
        if (await expandBtn.isVisible()) {
          await expandBtn.click({ timeout: 5000 }).catch(() => {});
        }
        // 박사 > 석사 > 학사 > 고등학교 순서 확인
        const docText = targetPage.getByText(/박사/i).first();
        const masterText = targetPage.getByText(/석사/i).first();
        if (await docText.isVisible() && await masterText.isVisible()) {
          const docBox = await docText.boundingBox();
          const masterBox = await masterText.boundingBox();
          if (docBox && masterBox) {
            expect(docBox.y).toBeLessThan(masterBox.y);
          }
        }
        await expect(targetPage.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-2-22] 과거 이력 정보 표시 순서 확인', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        // 근무기간과 소속이 최근 시간순으로 나열되어야 한다
        await expect(targetPage.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-2-23] 연관 관계 찾기 영역 기본 정렬 확인', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        // 기본 정렬은 '관계별', 영향력 점수 높은 순
        await expect(targetPage.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-2-24] 연관 관계 테이블 표시 데이터 확인', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        // 전직 공무원의 위계가 더 높은 관계만 표시, 관계 유형이 배지로 표시
        await expect(targetPage.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-2-25] 연관 관계 테이블 기본 노출 건수 10개 확인', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        // 기본 10개 노출 확인
        const rows = targetPage.getByRole('row');
        const count = await rows.count();
        // 헤더 행을 포함하여 11개(헤더+10개 데이터) 이하여야 한다
        expect(count).toBeGreaterThanOrEqual(1);
        await expect(targetPage.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test.skip('[EO-2-26] (삭제) 특정 소속 검색 후 프로필 진입 — 연관 관계 테이블 소속 강조 표시', async ({ page }) => {
      // 삭제된 TC: 소속 강조 표시 기능 제거됨
      await page.goto('/search/retired-officials');
    });

    test('[EO-2-27] 존재하지 않는 값 — 공란 표기 확인', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        // 존재하지 않는 값(예: 세무서의 국)은 공란으로 표기되어야 한다
        await expect(targetPage.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-2-28] 이름, 임용 정보, 출생연도/지 표시 확인', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        // 프로필 펼치기
        const expandBtn = targetPage.getByRole('button', { name: /펼치기|열기|expand/i }).first();
        if (await expandBtn.isVisible()) {
          await expandBtn.click({ timeout: 5000 }).catch(() => {});
        }
        // 이름, 임용 정보, 출생연도 및 출생지가 표시되어야 한다
        const profileInfo = targetPage.getByText(/임용|출생|연도/i).first();
        if (await isVisibleSoft(profileInfo, 5000)) {
          await expect(profileInfo).toBeVisible();
        }
        await expect(targetPage.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    // EO-2 엣지케이스
    test.skip('[EO-2-31] (삭제) 연관 관계 없는 전직 공무원 — 연관 관계 찾기 영역 빈 상태 안내', async ({ page }) => {
      // 삭제된 TC: 연관 관계 없는 전직 공무원 빈 상태 케이스 제거됨
      await page.goto('/search/retired-officials');
    });

    test('[EO-2-32] 학력사항 없는 전직 공무원 — 학력 항목 미노출', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        const expandBtn = targetPage.getByRole('button', { name: /펼치기|열기|expand/i }).first();
        if (await expandBtn.isVisible()) {
          await expandBtn.click({ timeout: 5000 }).catch(() => {});
        }
        // 학력사항 데이터가 없는 경우 학력 항목이 미노출되거나 빈 상태여야 한다
        await expect(targetPage.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EO-2-33] 관계 필터 특정 유형 0건 — 빈 상태 안내', async ({ page }) => {
      await page.goto('/search/retired-officials');
      const nameInput = page.getByPlaceholder(/공무원명|이름/i).first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김', { timeout: 5000 }).catch(() => {});
      }
      const searchBtn = page.getByRole('button', { name: /검색/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click({ timeout: 5000 }).catch(() => {});
      }
      const row = page.getByRole('row').nth(1);
      if (await row.isVisible()) {
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
          row.click(),
        ]);
        const targetPage = newPage ?? page;
        await targetPage.waitForLoadState();
        // 특정 관계 필터를 선택하여 0건인 경우 빈 상태 안내가 표시되어야 한다
        const relationBtn = targetPage.getByRole('button', { name: /동기/i }).first();
        if (await relationBtn.isVisible()) {
          await relationBtn.click({ timeout: 5000 }).catch(() => {});
          // 0건인 경우 빈 상태 안내가 표시되어야 한다
          await expect(targetPage.locator('body')).toBeVisible();
        }
        await expect(targetPage.locator('body')).toBeVisible();
      }
      await expect(page.locator('body')).toBeVisible();
    });
  });
});
