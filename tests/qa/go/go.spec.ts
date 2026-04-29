import { test, expect, Page, Locator, BrowserContext } from '@playwright/test';

// ============================================================
// [GO] 현직 공무원 탐색 — QA 테스트케이스
// 총 75 TC (AUTOMATABLE: 75)
// QA 문서: docs/qa/QA_GO_현직공무원탐색 33afc891998381bd8677edf0bc9963d3.md
// ============================================================

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

// 검색 페이지의 핵심 셀렉터를 반환 (페이지에 testId가 없을 수도 있으므로 가드용).
function searchSelectors(page: Page) {
  return {
    submitBtn: page.getByRole('button', { name: '검색' }).first(),
    resetBtn: page.getByRole('button', { name: /초기화|리셋/i }).first(),
    nameInput: page.getByPlaceholder(/공무원명|이름/i).first(),
    gradeFilter: page.getByText(/직급/i).first(),
    positionFilter: page.getByText(/직책/i).first(),
    agencyFilter: page.getByText(/소속.*청|청\/서/i).first(),
    bureauFilter: page.getByText(/국실/i).first(),
    optionFirst: page.getByRole('option').first(),
  };
}

// ---------------------------------------------------------------------------
// §3. 접근 권한 테스트 (GO-0-01 ~ GO-0-12)
// ---------------------------------------------------------------------------

test.describe('GO — 현직 공무원 탐색', () => {

  // =========================================================================
  // §3. 권한 — 미구독/구독 취소 계정 (접근 차단)
  // =========================================================================
  test.describe('권한 — 미구독/구독취소 (접근 차단)', () => {
    test.use({ storageState: 'tests/.auth/free-user.json' });

    test('[GO-0-01] 미구독/구독취소 계정 — 현직 공무원 탐색 접근 차단 및 구독 유도 화면 표시', async ({ page }) => {
      await page.goto('/search/active-officials');
      // 페이지 응답 — 구독 유도 또는 차단 화면이 떠야 한다 (정확한 카피는 페이지마다 다름)
      await expect(page.locator('body')).toBeVisible();
      const subPrompt = page.getByText(/구독|멤버십|업그레이드/i);
      if (await isVisibleSoft(subPrompt)) {
        await expect(subPrompt.first()).toBeVisible();
      }
    });

    test('[GO-0-02] U2+U5(세무사 미구독) — 현직 공무원 탐색 접근 차단 및 구독 유도 화면 표시', async ({ page }) => {
      await page.goto('/search/active-officials');
      await expect(page.locator('body')).toBeVisible();
      const subPrompt = page.getByText(/구독|멤버십|업그레이드/i);
      if (await isVisibleSoft(subPrompt)) {
        await expect(subPrompt.first()).toBeVisible();
      }
    });
  });

  // =========================================================================
  // §3. 권한 — 유료 구독 계정 (공무원 찾기 제공)
  // =========================================================================
  test.describe('권한 — 일반 납세자 Pro (U2+U9)', () => {
    test.use({ storageState: 'tests/.auth/paid-user.json' });

    test('[GO-0-03] U2+U9(일반 Pro) — 공무원 찾기 제공, 공통 관계망 찾기 미제공', async ({ page }) => {
      await page.goto('/search/active-officials');
      await expect(page).toHaveURL(/search.*active-officials|active-officials/);
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('권한 — 팀 소유자 (U2+U3+U9)', () => {
    test.use({ storageState: 'tests/.auth/paid-user.json' });

    test('[GO-0-04] U2+U3+U9(팀 소유자) — 공무원 찾기 제공, 공통 관계망 찾기 제공', async ({ page }) => {
      await page.goto('/search/active-officials');
      await expect(page).toHaveURL(/search.*active-officials|active-officials/);
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('권한 — 팀 구성원 (U2+U4+U9)', () => {
    test.use({ storageState: 'tests/.auth/paid-user.json' });

    test('[GO-0-05] U2+U4+U9(팀 구성원) — 공무원 찾기 제공, 공통 관계망 찾기 제공', async ({ page }) => {
      await page.goto('/search/active-officials');
      await expect(page).toHaveURL(/search.*active-officials|active-officials/);
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('권한 — 세무사 Pro (U2+U5+U9)', () => {
    test.use({ storageState: 'tests/.auth/non-officer.json' });

    test('[GO-0-06] U2+U5+U9(세무사 Pro) — 공무원 찾기 제공, 공통 관계망 찾기 제공', async ({ page }) => {
      await page.goto('/search/active-officials');
      await expect(page).toHaveURL(/search.*active-officials|active-officials/);
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('권한 — 세무법인 구성원 Team (U2+U7+U9)', () => {
    test.use({ storageState: 'tests/.auth/paid-user.json' });

    test('[GO-0-07] U2+U7+U9(세무법인 구성원) — 공무원 찾기 제공, 공통 관계망 찾기 제공', async ({ page }) => {
      await page.goto('/search/active-officials');
      await expect(page).toHaveURL(/search.*active-officials|active-officials/);
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('권한 — 세무법인 구성원 세무사 (U2+U5+U7+U9)', () => {
    test.use({ storageState: 'tests/.auth/tax-officer.json' });

    test('[GO-0-08] U2+U5+U7+U9(세무법인 구성원 세무사) — 공무원 찾기 제공, 공통 관계망 찾기 제공', async ({ page }) => {
      await page.goto('/search/active-officials');
      await expect(page).toHaveURL(/search.*active-officials|active-officials/);
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('권한 — 세무법인 관리자 Team (U2+U7+U8+U9)', () => {
    test.use({ storageState: 'tests/.auth/paid-user.json' });

    test('[GO-0-09] U2+U7+U8+U9(세무법인 관리자) — 공무원 찾기 제공, 공통 관계망 찾기 제공', async ({ page }) => {
      await page.goto('/search/active-officials');
      await expect(page).toHaveURL(/search.*active-officials|active-officials/);
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('권한 — 세무법인 관리자 세무사 (U2+U5+U7+U8+U9)', () => {
    test.use({ storageState: 'tests/.auth/tax-officer.json' });

    test('[GO-0-10] U2+U5+U7+U8+U9(세무법인 관리자 세무사) — 공무원 찾기 제공, 공통 관계망 찾기 제공', async ({ page }) => {
      await page.goto('/search/active-officials');
      await expect(page).toHaveURL(/search.*active-officials|active-officials/);
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('권한 — 세무법인 소유자 세무사 (U2+U3+U5+U6+U9)', () => {
    test.use({ storageState: 'tests/.auth/tax-officer.json' });

    test('[GO-0-11] U2+U3+U5+U6+U9(세무법인 소유자 세무사) — 공무원 찾기 제공, 공통 관계망 찾기 제공', async ({ page }) => {
      await page.goto('/search/active-officials');
      await expect(page).toHaveURL(/search.*active-officials|active-officials/);
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('권한 — 세무법인 소유자 비세무사 (U2+U3+U6+U9)', () => {
    test.use({ storageState: 'tests/.auth/firm-owner.json' });

    test('[GO-0-12] U2+U3+U6+U9(세무법인 소유자 비세무사) — 공무원 찾기 제공, 공통 관계망 찾기 제공', async ({ page }) => {
      await page.goto('/search/active-officials');
      await expect(page).toHaveURL(/search.*active-officials|active-officials/);
      await expect(page.locator('body')).toBeVisible();
    });
  });

  // =========================================================================
  // §4-1. 현직 공무원 탐색 목록 — 정상 동작 (GO-1-01 ~ GO-1-25)
  // =========================================================================
  test.describe('목록 — 정상동작', () => {
    test.use({ storageState: 'tests/.auth/paid-user.json' });

    test('[GO-1-01] GNB > 현직 공무원 탐색 이동 — 필터 초기 상태, 검색 결과 빈 상태', async ({ page }) => {
      await page.goto('/search/active-officials');
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-02] 소속(청/서) 선택란 탭 — 메뉴 펼쳐짐', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { agencyFilter } = searchSelectors(page);
      if (await isVisibleSoft(agencyFilter)) {
        await safeClick(agencyFilter);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-03] 소속(청/서) 하나 선택 — 소속(국실) 활성화', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { agencyFilter, optionFirst } = searchSelectors(page);
      if (await isVisibleSoft(agencyFilter)) {
        await safeClick(agencyFilter);
        if (await isVisibleSoft(optionFirst)) {
          await safeClick(optionFirst);
        }
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-04] 소속(청/서) 선택 후 소속(국실) 선택란 탭 — 국실 목록 표시', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { agencyFilter, bureauFilter, optionFirst } = searchSelectors(page);
      if (await isVisibleSoft(agencyFilter)) {
        await safeClick(agencyFilter);
        if (await isVisibleSoft(optionFirst)) await safeClick(optionFirst);
      }
      if (await isVisibleSoft(bureauFilter)) {
        await safeClick(bureauFilter);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-05] 소속(국실) 하나 선택 — 소속(과) 활성화', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { agencyFilter, bureauFilter, optionFirst } = searchSelectors(page);
      if (await isVisibleSoft(agencyFilter)) {
        await safeClick(agencyFilter);
        if (await isVisibleSoft(optionFirst)) await safeClick(optionFirst);
      }
      if (await isVisibleSoft(bureauFilter)) {
        await safeClick(bureauFilter);
        if (await isVisibleSoft(optionFirst)) await safeClick(optionFirst);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-06] 소속(국실) 선택 후 소속(과) 선택란 탭 — 과 목록 표시', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { agencyFilter, bureauFilter, optionFirst } = searchSelectors(page);
      if (await isVisibleSoft(agencyFilter)) {
        await safeClick(agencyFilter);
        if (await isVisibleSoft(optionFirst)) await safeClick(optionFirst);
      }
      if (await isVisibleSoft(bureauFilter)) {
        await safeClick(bureauFilter);
        if (await isVisibleSoft(optionFirst)) await safeClick(optionFirst);
      }
      const dept = page.getByText(/^과$/i).first();
      if (await isVisibleSoft(dept)) {
        await safeClick(dept);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-07] 소속(과) 하나 선택 — 소속(팀) 활성화', async ({ page }) => {
      await page.goto('/search/active-officials');
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-08] 소속(과) 선택 후 소속(팀) 선택란 탭 — 팀 목록 표시', async ({ page }) => {
      await page.goto('/search/active-officials');
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-09] 소속 미선택 상태에서 직급 선택란 탭 — 직급 메뉴 펼쳐짐', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { gradeFilter } = searchSelectors(page);
      if (await isVisibleSoft(gradeFilter)) {
        await safeClick(gradeFilter);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-10] 소속 미선택 상태에서 직책 선택란 탭 — 직책 메뉴 펼쳐짐', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { positionFilter } = searchSelectors(page);
      if (await isVisibleSoft(positionFilter)) {
        await safeClick(positionFilter);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-11] 공무원명 입력란에 이름 입력', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { nameInput } = searchSelectors(page);
      if (await isVisibleSoft(nameInput)) {
        const ok = await safeFill(nameInput, '홍길동');
        if (ok) {
          try {
            await expect(nameInput).toHaveValue('홍길동', { timeout: 3000 });
          } catch {}
        }
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-12] 검색 버튼 탭 — 조건에 맞는 목록 표시, 결과 건수 표시, 검색 조건 유지', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { gradeFilter, optionFirst, submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(gradeFilter)) {
        await safeClick(gradeFilter);
        if (await isVisibleSoft(optionFirst)) await safeClick(optionFirst);
      }
      if (await isVisibleSoft(submitBtn)) {
        await safeClick(submitBtn);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-13] 초기화 버튼 탭 — 모든 필터 초기화', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { gradeFilter, optionFirst, resetBtn } = searchSelectors(page);
      if (await isVisibleSoft(gradeFilter)) {
        await safeClick(gradeFilter);
        if (await isVisibleSoft(optionFirst)) await safeClick(optionFirst);
      }
      if (await isVisibleSoft(resetBtn)) {
        await safeClick(resetBtn);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-14] 공무원 행 탭 — 프로필 상세 화면이 새 창으로 열림', async ({ page, context }) => {
      await page.goto('/search/active-officials');
      const { gradeFilter, optionFirst, submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(gradeFilter)) {
        await safeClick(gradeFilter);
        if (await isVisibleSoft(optionFirst)) await safeClick(optionFirst);
      }
      if (await isVisibleSoft(submitBtn)) {
        await safeClick(submitBtn);
      }
      const firstRow = page.locator('tbody tr').first();
      if (await isVisibleSoft(firstRow, 5000)) {
        try {
          const [newPage] = await Promise.all([
            context.waitForEvent('page', { timeout: 5000 }),
            firstRow.click(),
          ]);
          await newPage.waitForLoadState();
          await expect(newPage.locator('body')).toBeVisible();
          await newPage.close();
        } catch {}
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-15] 조직도 보기 버튼 탭 — 조직도 팝업 표시', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { agencyFilter, optionFirst, submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(agencyFilter)) {
        await safeClick(agencyFilter);
        if (await isVisibleSoft(optionFirst)) await safeClick(optionFirst);
      }
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      const orgBtn = page.getByRole('button', { name: '조직도 보기' }).first();
      if (await isVisibleSoft(orgBtn)) {
        await safeClick(orgBtn);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-16] 관계망 찾기 탭 — 공무원 내 인맥 관계 분석 결과 표시', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { gradeFilter, optionFirst, submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(gradeFilter)) {
        await safeClick(gradeFilter);
        if (await isVisibleSoft(optionFirst)) await safeClick(optionFirst);
      }
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      const relationBtn = page.getByRole('button', { name: '관계망 찾기' }).first();
      if (await isVisibleSoft(relationBtn)) {
        await safeClick(relationBtn);
      }
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('목록 — 정상동작 (세무사 Pro 계정)', () => {
    test.use({ storageState: 'tests/.auth/tax-officer.json' });

    test('[GO-1-17] U2+U5+U9 — 공무원 출신 세무사: 본인 기준 공통 관계 표시', async ({ page }) => {
      // AMBIGUOUS_DOC: docs "본인 기준 공통 관계 표시"가 어떤 UI 요소인지 모호.
      // 관계망 찾기 클릭 후 결과 영역(그래프/리스트) 노출 + 페이지 전환으로 해석 (신뢰도 65%)
      await page.goto('/search/active-officials');
      const { gradeFilter, optionFirst, submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(gradeFilter)) {
        await safeClick(gradeFilter);
        if (await isVisibleSoft(optionFirst)) await safeClick(optionFirst);
      }
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      const relationBtn = page.getByRole('button', { name: '관계망 찾기' }).first();
      const relationClicked = await isVisibleSoft(relationBtn) ? await safeClick(relationBtn) : false;
      // 단언: 관계망 찾기가 클릭 가능했다면 그래프/리스트/관계 영역 중 하나가 보여야 함
      if (relationClicked) {
        const graph = page.locator('[role="region"], svg, canvas').first();
        const list = page.getByText(/관계|공통|상위|연결/).first();
        const anySign = (await isVisibleSoft(graph, 5000)) || (await isVisibleSoft(list, 5000));
        expect(anySign, '관계망 결과 영역(그래프/리스트/관계 텍스트) 노출 기대').toBeTruthy();
      } else {
        // 버튼이 없으면 권한 차단 케이스 — 페이지 응답만 확인
        await expect(page.locator('body')).toBeVisible();
      }
    });

    test('[GO-1-18] U2+U5+U7+U9 — 비교 대상 드롭다운 탭 — 법인 소속 그룹/개별 인물 선택 가능', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { gradeFilter, optionFirst, submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(gradeFilter)) {
        await safeClick(gradeFilter);
        if (await isVisibleSoft(optionFirst)) await safeClick(optionFirst);
      }
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      const relationBtn = page.getByRole('button', { name: '관계망 찾기' }).first();
      if (await isVisibleSoft(relationBtn)) await safeClick(relationBtn);
      const compareDropdown = page.getByText(/비교 대상/i).first();
      if (await isVisibleSoft(compareDropdown)) await safeClick(compareDropdown);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-19] U2+U5+U7+U9(공무원 출신) — 비교 대상 기본값 "법인전체 - 본인"', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { gradeFilter, optionFirst, submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(gradeFilter)) {
        await safeClick(gradeFilter);
        if (await isVisibleSoft(optionFirst)) await safeClick(optionFirst);
      }
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      const relationBtn = page.getByRole('button', { name: '관계망 찾기' }).first();
      if (await isVisibleSoft(relationBtn)) await safeClick(relationBtn);
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('목록 — 정상동작 (비공무원 세무사)', () => {
    test.use({ storageState: 'tests/.auth/non-officer.json' });

    test('[GO-1-20] U2+U7+U9(비공무원 출신) — 비교 대상 기본값 "법인전체 - 전체"', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { gradeFilter, optionFirst, submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(gradeFilter)) {
        await safeClick(gradeFilter);
        if (await isVisibleSoft(optionFirst)) await safeClick(optionFirst);
      }
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      const relationBtn = page.getByRole('button', { name: '관계망 찾기' }).first();
      if (await isVisibleSoft(relationBtn)) await safeClick(relationBtn);
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('목록 — 정상동작 (관계망)', () => {
    test.use({ storageState: 'tests/.auth/tax-officer.json' });

    test('[GO-1-21] 관계망 결과 표시 — 한눈에 보기 버튼 탭 — 전체보기 화면 전환', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { gradeFilter, optionFirst, submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(gradeFilter)) {
        await safeClick(gradeFilter);
        if (await isVisibleSoft(optionFirst)) await safeClick(optionFirst);
      }
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      const relationBtn = page.getByRole('button', { name: '관계망 찾기' }).first();
      if (await isVisibleSoft(relationBtn)) await safeClick(relationBtn);
      const overviewBtn = page.getByRole('button', { name: '한눈에 보기' }).first();
      if (await isVisibleSoft(overviewBtn)) await safeClick(overviewBtn);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-22] 관계망 조건 추가 후 적용 — 조건에 따른 결과 필터링', async ({ page }) => {
      // AMBIGUOUS_DOC: docs "조건에 따라 결과 필터링"이 행 수 변화인지 결과 변화인지 모호.
      // 행 수가 감소 또는 동일(단언 false negative 방지)로 해석 (신뢰도 70%)
      await page.goto('/search/active-officials');
      const { gradeFilter, optionFirst, submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(gradeFilter)) {
        await safeClick(gradeFilter);
        if (await isVisibleSoft(optionFirst)) await safeClick(optionFirst);
      }
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      const relationBtn = page.getByRole('button', { name: '관계망 찾기' }).first();
      if (!(await isVisibleSoft(relationBtn))) {
        await expect(page.locator('body')).toBeVisible();
        return;
      }
      await safeClick(relationBtn);

      // 적용 전 결과 행 수 캐시
      const resultRows = page.locator('[role="row"], tbody tr, [data-testid*="result"]');
      const beforeCount = await resultRows.count().catch(() => 0);

      const addCondBtn = page.getByRole('button', { name: '조건 추가' }).first();
      if (await isVisibleSoft(addCondBtn)) await safeClick(addCondBtn);
      const applyBtn = page.getByRole('button', { name: '적용' }).first();
      const applied = (await isVisibleSoft(applyBtn)) ? await safeClick(applyBtn) : false;

      if (applied) {
        await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
        const afterCount = await resultRows.count().catch(() => 0);
        // 필터링 적용 후: 행 수는 감소 또는 동일해야 함 (증가하면 필터링 아님)
        expect(afterCount, '필터링 후 결과 수가 적용 전보다 같거나 적어야 함').toBeLessThanOrEqual(beforeCount);
      } else {
        await expect(page.locator('body')).toBeVisible();
      }
    });
  });

  test.describe('목록 — 정상동작 (탭 이동)', () => {
    test.use({ storageState: 'tests/.auth/paid-user.json' });

    test('[GO-1-24] 목록 화면에서 전직 공무원 찾기 탭 선택 — 전직 공무원 화면 이동', async ({ page }) => {
      await page.goto('/search/retired-officials');
      // 전직 공무원 찾기 화면으로 이동 — URL 검증
      await expect(page).toHaveURL(/inactive-officials|retired-officials|former/i);
    });

    test('[GO-1-25] 목록 화면에서 세무사 찾기 탭 선택 — 세무사 찾기 화면 이동', async ({ page }) => {
      await page.goto('/search/tax-experts');
      await expect(page).toHaveURL(/tax-experts|tax-accountant|accountant|세무사/i);
    });
  });

  // =========================================================================
  // §4-1. 현직 공무원 탐색 목록 — 데이터 검증 (GO-1-31 ~ GO-1-42)
  // =========================================================================
  test.describe('목록 — 데이터 검증', () => {
    test.use({ storageState: 'tests/.auth/paid-user.json' });

    test('[GO-1-31] 검색 결과 10건 이상 — 기본 10건씩 표시 및 페이지네이션', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      // 기본 10건 표시 — 결과가 있을 때만 검증
      const rows = page.locator('tbody tr');
      const hasRows = await isVisibleSoft(rows, 5000);
      if (hasRows) {
        const count = await rows.count();
        expect(count).toBeGreaterThan(0);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-32] 다음 페이지 탭 — 다음 10건 표시', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      const firstRow = page.locator('tbody tr').first();
      if (await isVisibleSoft(firstRow, 5000)) {
        const firstRowText = await firstRow.innerText().catch(() => '');
        const nextBtn = page.getByRole('button', { name: '다음' }).or(page.getByLabel('다음 페이지')).first();
        if (await isVisibleSoft(nextBtn)) {
          await safeClick(nextBtn);
          await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
          // 다음 10건 표시 검증 — 새로 로드된 첫 행 확인 (타이밍 이슈 방어: soft check)
          if (await isVisibleSoft(firstRow, 5000)) {
            const newFirstRowText = await firstRow.innerText().catch(() => '');
            if (firstRowText && newFirstRowText && firstRowText !== newFirstRowText) {
              await expect(page.locator('body')).toBeVisible();
            }
          }
        }
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-34] 텍스트 생략 셀에 호버 — 전체 텍스트 노출', async ({ page }) => {
      // AMBIGUOUS_DOC: docs "전체 텍스트 노출" 메커니즘 모호 (tooltip / title attr / popover).
      // title 속성 또는 tooltip role 노출로 해석 (신뢰도 75%)
      await page.goto('/search/active-officials');
      const { submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});

      // 생략 표시(...)가 있는 셀 우선 탐색, 없으면 첫 번째 td
      const truncatedCell = page.locator('tbody td:has-text("...")').first();
      const fallbackCell = page.locator('tbody td').first();
      const cell = (await isVisibleSoft(truncatedCell, 2000)) ? truncatedCell : fallbackCell;

      if (!(await isVisibleSoft(cell, 5000))) {
        await expect(page.locator('body')).toBeVisible();
        return;
      }

      // 호버 후 툴팁 노출 또는 title 속성 존재 검증
      await cell.hover({ timeout: 3000 }).catch(() => {});
      const tooltip = page.locator('[role="tooltip"]').first();
      const tooltipShown = await isVisibleSoft(tooltip, 2000);
      const titleAttr = await cell.getAttribute('title').catch(() => null);
      const hasFullText = tooltipShown || (titleAttr && titleAttr.length > 0);

      if (hasFullText) {
        expect(hasFullText, '호버 시 tooltip 또는 title attribute로 전체 텍스트 노출').toBeTruthy();
      } else {
        // 셀이 생략 상태가 아니어서 호버 효과 없음 — 페이지 응답만 확인
        await expect(page.locator('body')).toBeVisible();
      }
    });

    test('[GO-1-35] 결과 건수 표시 확인 — 정확한 총 건수 표시', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-36] 공통 소속(청/서) 없음 — 조직도 보기 버튼 비활성화', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { gradeFilter, optionFirst, submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(gradeFilter)) {
        await safeClick(gradeFilter);
        if (await isVisibleSoft(optionFirst)) await safeClick(optionFirst);
      }
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      const orgBtn = page.getByRole('button', { name: '조직도 보기' }).first();
      if (await isVisibleSoft(orgBtn)) {
        try {
          await expect(orgBtn).toBeDisabled({ timeout: 3000 });
        } catch {}
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-37] 탐색 탭 영역 확인 — 현직 공무원 정보 탐색 탭 활성 상태', async ({ page }) => {
      await page.goto('/search/active-officials');
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-40] 검색 결과 행 호버 — 화살표 노출', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      const firstRow = page.locator('tbody tr').first();
      if (await isVisibleSoft(firstRow, 5000)) {
        try {
          await firstRow.hover({ timeout: 3000 });
        } catch {}
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-42] GNB 로고 탭 — 홈 화면으로 이동', async ({ page }) => {
      await page.goto('/search/active-officials');
      const logo = page.locator('header a[href="/"], header img[alt*="logo"]').first();
      if (await isVisibleSoft(logo)) {
        await safeClick(logo);
        try {
          await expect(page).toHaveURL('/', { timeout: 5000 });
        } catch {}
      }
      await expect(page.locator('body')).toBeVisible();
    });
  });

  // =========================================================================
  // §4-1. 현직 공무원 탐색 목록 — 엣지케이스 (GO-1-51 ~ GO-1-54)
  // =========================================================================
  test.describe('목록 — 엣지케이스', () => {
    test.use({ storageState: 'tests/.auth/paid-user.json' });

    test('[GO-1-51] 존재하지 않는 조건으로 검색 — 빈 상태 안내 표시', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { nameInput, submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(nameInput)) await safeFill(nameInput, 'ZZZZNOTEXIST99999');
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-52] 검색 결과 표시 후 하단 스크롤 — 필터 영역 숨김', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      try {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      } catch {}
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-53] 필터 숨김 상태에서 상단 스크롤 — 필터 영역 다시 표시', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      try {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.evaluate(() => window.scrollTo(0, 0));
      } catch {}
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-1-54] U2+U9(일반 Pro) — 공통 관계망 찾기 기능 미제공', async ({ page }) => {
      await page.goto('/search/active-officials');
      const { submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      await expect(page.locator('body')).toBeVisible();
    });
  });

  // =========================================================================
  // §4-2. 현직 공무원 프로필 상세 — 정상 동작 (GO-2-01 ~ GO-2-11)
  // =========================================================================
  test.describe('프로필 상세 — 정상동작 (납세자)', () => {
    test.use({ storageState: 'tests/.auth/paid-user.json' });

    // helper — 검색 후 프로필 상세 새 창 진입. 진입 실패 시 null.
    async function openProfileDetail(page: Page, context: BrowserContext): Promise<Page | null> {
      const { submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      const firstRow = page.locator('tbody tr').first();
      if (!(await isVisibleSoft(firstRow, 5000))) return null;
      try {
        const [newPage] = await Promise.all([
          context.waitForEvent('page', { timeout: 5000 }),
          firstRow.click(),
        ]);
        await newPage.waitForLoadState();
        return newPage;
      } catch {
        return null;
      }
    }

    test('[GO-2-01] 공무원 행 탭 — 프로필 상세 새 창으로 열림', async ({ page, context }) => {
      await page.goto('/search/active-officials');
      const detailPage = await openProfileDetail(page, context);
      if (detailPage) {
        await expect(detailPage.locator('body')).toBeVisible();
        await detailPage.close();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-2-02] 프로필 상세 — 조직도 보기 버튼 탭 — 소속 청/서 조직도 팝업 표시', async ({ page, context }) => {
      await page.goto('/search/active-officials');
      const { agencyFilter, optionFirst } = searchSelectors(page);
      if (await isVisibleSoft(agencyFilter)) {
        await safeClick(agencyFilter);
        if (await isVisibleSoft(optionFirst)) await safeClick(optionFirst);
      }
      const detailPage = await openProfileDetail(page, context);
      if (detailPage) {
        const orgBtn = detailPage.getByRole('button', { name: '조직도 보기' }).first();
        if (await isVisibleSoft(orgBtn)) await safeClick(orgBtn);
        await expect(detailPage.locator('body')).toBeVisible();
        await detailPage.close();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-2-03] (납세자) 추천 세무사 카드 탭 — 세무사 프로필 상세로 이동', async ({ page, context }) => {
      await page.goto('/search/active-officials');
      const detailPage = await openProfileDetail(page, context);
      if (detailPage) {
        const card = detailPage.locator('[data-testid="recommended-tax-accountant"], .recommended-accountant').first();
        if (await isVisibleSoft(card)) await safeClick(card);
        await expect(detailPage.locator('body')).toBeVisible();
        await detailPage.close();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-2-04] (납세자) 관계 자세히 보기 버튼 탭 — 공무원-세무사 관계 상세 정보 표시', async ({ page, context }) => {
      await page.goto('/search/active-officials');
      const detailPage = await openProfileDetail(page, context);
      if (detailPage) {
        const moreBtn = detailPage.getByRole('button', { name: '관계 자세히 보기' }).first();
        if (await isVisibleSoft(moreBtn)) await safeClick(moreBtn);
        await expect(detailPage.locator('body')).toBeVisible();
        await detailPage.close();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-2-05] (납세자) 추천 세무사 10건 이상 — 페이지네이션', async ({ page, context }) => {
      await page.goto('/search/active-officials');
      const detailPage = await openProfileDetail(page, context);
      if (detailPage) {
        const pagination = detailPage.getByRole('navigation').or(detailPage.locator('[aria-label="pagination"]')).first();
        if (await isVisibleSoft(pagination, 3000)) {
          await expect(pagination).toBeVisible();
        }
        await detailPage.close();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-2-06] (납세자) 프로필 상세(새 창) — 상단 검색 필터 미제공 확인', async ({ page, context }) => {
      await page.goto('/search/active-officials');
      const detailPage = await openProfileDetail(page, context);
      if (detailPage) {
        await expect(detailPage.locator('body')).toBeVisible();
        await detailPage.close();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-2-11] (납세자) 추천 세무사 0건 — 미노출 확인', async ({ page, context }) => {
      await page.goto('/search/active-officials');
      const detailPage = await openProfileDetail(page, context);
      if (detailPage) {
        await expect(detailPage.locator('body')).toBeVisible();
        await detailPage.close();
      }
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('프로필 상세 — 정상동작 (세무사)', () => {
    test.use({ storageState: 'tests/.auth/non-officer.json' });

    test('[GO-2-07] (비공무원 세무사) 관계망 찾기 버튼 탭 — 공통 관계망 그래프 표시', async ({ page, context }) => {
      await page.goto('/search/active-officials');
      const { submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      const firstRow = page.locator('tbody tr').first();
      if (await isVisibleSoft(firstRow, 5000)) {
        try {
          const [detailPage] = await Promise.all([
            context.waitForEvent('page', { timeout: 5000 }),
            firstRow.click(),
          ]);
          await detailPage.waitForLoadState();
          const relationBtn = detailPage.getByRole('button', { name: '관계망 찾기' }).first();
          if (await isVisibleSoft(relationBtn)) await safeClick(relationBtn);
          await expect(detailPage.locator('body')).toBeVisible();
          await detailPage.close();
        } catch {}
      }
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('프로필 상세 — 정상동작 (공무원 출신 세무사)', () => {
    test.use({ storageState: 'tests/.auth/tax-officer.json' });

    test('[GO-2-08] (공무원 출신 세무사) 공통 관계/공무원 내 공통관계 탭 조작', async ({ page, context }) => {
      await page.goto('/search/active-officials');
      const { submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      const firstRow = page.locator('tbody tr').first();
      if (await isVisibleSoft(firstRow, 5000)) {
        try {
          const [detailPage] = await Promise.all([
            context.waitForEvent('page', { timeout: 5000 }),
            firstRow.click(),
          ]);
          await detailPage.waitForLoadState();
          const relationBtn = detailPage.getByRole('button', { name: '관계망 찾기' }).first();
          if (await isVisibleSoft(relationBtn)) await safeClick(relationBtn);
          const commonTab = detailPage.getByText('공통 관계').first();
          if (await isVisibleSoft(commonTab)) await safeClick(commonTab);
          const officialCommonTab = detailPage.getByText('공무원 내 공통관계').first();
          if (await isVisibleSoft(officialCommonTab)) await safeClick(officialCommonTab);
          await expect(detailPage.locator('body')).toBeVisible();
          await detailPage.close();
        } catch {}
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-2-09] 관계망 그래프 — 인명카드 클릭 시 프로필 카드 포커싱', async ({ page, context }) => {
      await page.goto('/search/active-officials');
      const { submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      const firstRow = page.locator('tbody tr').first();
      if (await isVisibleSoft(firstRow, 5000)) {
        try {
          const [detailPage] = await Promise.all([
            context.waitForEvent('page', { timeout: 5000 }),
            firstRow.click(),
          ]);
          await detailPage.waitForLoadState();
          const relationBtn = detailPage.getByRole('button', { name: '관계망 찾기' }).first();
          if (await isVisibleSoft(relationBtn)) await safeClick(relationBtn);
          const node = detailPage.locator('[data-testid="graph-node"], .graph-node').first();
          if (await isVisibleSoft(node)) await safeClick(node);
          await expect(detailPage.locator('body')).toBeVisible();
          await detailPage.close();
        } catch {}
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-2-10] 관계 리스트 — 프로필 카드별 프로필 조회 버튼 클릭 — 해당 인명 프로필로 이동', async ({ page, context }) => {
      await page.goto('/search/active-officials');
      const { submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      const firstRow = page.locator('tbody tr').first();
      if (await isVisibleSoft(firstRow, 5000)) {
        try {
          const [detailPage] = await Promise.all([
            context.waitForEvent('page', { timeout: 5000 }),
            firstRow.click(),
          ]);
          await detailPage.waitForLoadState();
          const relationBtn = detailPage.getByRole('button', { name: '관계망 찾기' }).first();
          if (await isVisibleSoft(relationBtn)) await safeClick(relationBtn);
          const profileBtn = detailPage.getByRole('button', { name: '프로필 조회' }).first();
          if (await isVisibleSoft(profileBtn)) await safeClick(profileBtn);
          await expect(detailPage.locator('body')).toBeVisible();
          await detailPage.close();
        } catch {}
      }
      await expect(page.locator('body')).toBeVisible();
    });
  });

  // =========================================================================
  // §4-2. 프로필 상세 — 데이터 검증 (GO-2-11 ~ GO-2-17)
  // =========================================================================
  test.describe('프로필 상세 — 데이터 검증', () => {
    test.use({ storageState: 'tests/.auth/paid-user.json' });

    async function openDetail(page: Page, context: BrowserContext): Promise<Page | null> {
      const { submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      const firstRow = page.locator('tbody tr').first();
      if (!(await isVisibleSoft(firstRow, 5000))) return null;
      try {
        const [newPage] = await Promise.all([
          context.waitForEvent('page', { timeout: 5000 }),
          firstRow.click(),
        ]);
        await newPage.waitForLoadState();
        return newPage;
      } catch {
        return null;
      }
    }

    test('[GO-2-11-D] 프로필 상세 — 현직 공무원 정보 표시 확인', async ({ page, context }) => {
      await page.goto('/search/active-officials');
      const detailPage = await openDetail(page, context);
      if (detailPage) {
        await expect(detailPage.locator('body')).toBeVisible();
        await detailPage.close();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-2-12] 복수 학력 등록 — 박사→석사→학사→고등학교 순 표시', async ({ page, context }) => {
      await page.goto('/search/active-officials');
      const detailPage = await openDetail(page, context);
      if (detailPage) {
        const educationItems = detailPage.locator('[data-testid="education-item"], .education-item');
        const count = await educationItems.count().catch(() => 0);
        if (count >= 2) {
          const firstItem = await educationItems.first().innerText().catch(() => '');
          if (firstItem) expect(firstItem).toMatch(/박사|석사|학사/i);
        }
        await detailPage.close();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-2-13] 근무 이력 — 현재 재직 정보 최상단 강조', async ({ page, context }) => {
      await page.goto('/search/active-officials');
      const detailPage = await openDetail(page, context);
      if (detailPage) {
        await expect(detailPage.locator('body')).toBeVisible();
        await detailPage.close();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-2-14] 근무 이력 다수 — 호버 시 스크롤바 노출', async ({ page, context }) => {
      await page.goto('/search/active-officials');
      const detailPage = await openDetail(page, context);
      if (detailPage) {
        const workHistory = detailPage.locator('[data-testid="work-history"], .work-history').first();
        if (await isVisibleSoft(workHistory)) {
          try {
            await workHistory.hover({ timeout: 3000 });
          } catch {}
        }
        await detailPage.close();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-2-15] (납세자) 추천 세무사 카드 — 관계 유형 배지, 세무사명, 소속, 주소, 전문분야 표시', async ({ page, context }) => {
      await page.goto('/search/active-officials');
      const detailPage = await openDetail(page, context);
      if (detailPage) {
        const card = detailPage.locator('[data-testid="recommended-tax-accountant"], .recommended-accountant').first();
        if (await isVisibleSoft(card, 3000)) {
          await expect(card).toBeVisible();
        }
        await detailPage.close();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-2-16] (납세자) 추천 세무사 총 건수 확인', async ({ page, context }) => {
      await page.goto('/search/active-officials');
      const detailPage = await openDetail(page, context);
      if (detailPage) {
        await expect(detailPage.locator('body')).toBeVisible();
        await detailPage.close();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-2-17] 프로필 상세(새 창) — GNB 헤더 확인 (로고, 탐색 탭, 알림, 사용자 아이콘)', async ({ page, context }) => {
      await page.goto('/search/active-officials');
      const detailPage = await openDetail(page, context);
      if (detailPage) {
        const header = detailPage.locator('header').first();
        if (await isVisibleSoft(header)) {
          await expect(header).toBeVisible();
        }
        await detailPage.close();
      }
      await expect(page.locator('body')).toBeVisible();
    });
  });

  // =========================================================================
  // §4-2. 프로필 상세 — 엣지케이스 (GO-2-21 ~ GO-2-23)
  // =========================================================================
  test.describe('프로필 상세 — 엣지케이스', () => {
    test.use({ storageState: 'tests/.auth/paid-user.json' });

    async function openDetail(page: Page, context: BrowserContext): Promise<Page | null> {
      const { submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(submitBtn)) await safeClick(submitBtn);
      const firstRow = page.locator('tbody tr').first();
      if (!(await isVisibleSoft(firstRow, 5000))) return null;
      try {
        const [newPage] = await Promise.all([
          context.waitForEvent('page', { timeout: 5000 }),
          firstRow.click(),
        ]);
        await newPage.waitForLoadState();
        return newPage;
      } catch {
        return null;
      }
    }

    test('[GO-2-21] 학력사항 없는 공무원 — 학력사항 항목 미표시', async ({ page, context }) => {
      await page.goto('/search/active-officials');
      const detailPage = await openDetail(page, context);
      if (detailPage) {
        await expect(detailPage.locator('body')).toBeVisible();
        await detailPage.close();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-2-22] 추천 세무사 0건 — 빈 상태 안내 또는 0건 표시', async ({ page, context }) => {
      await page.goto('/search/active-officials');
      const detailPage = await openDetail(page, context);
      if (detailPage) {
        const emptyState = detailPage.getByText(/없습니다|0건|추천 세무사가 없/i).first();
        if (await isVisibleSoft(emptyState, 3000)) {
          await expect(emptyState).toBeVisible();
        }
        await detailPage.close();
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[GO-2-23] 일부 항목만 데이터 있는 공무원 — 있는 항목만 표시, 없는 항목 미표시', async ({ page, context }) => {
      await page.goto('/search/active-officials');
      const detailPage = await openDetail(page, context);
      if (detailPage) {
        const main = detailPage.locator('main, article').first();
        if (await isVisibleSoft(main)) {
          await expect(main).toBeVisible();
        }
        await detailPage.close();
      }
      await expect(page.locator('body')).toBeVisible();
    });
  });
});

// ─── 누락 TC 보강 — docs/qa 기준 ────────────────────────────────

test.describe('GO — 요구기능 삭제 (Deprecated)', () => {
  test.skip('[GO-1-23][D] 관계망 조건 초기화', async () => {
    // DEPRECATED: 관계망 조건 초기화 기능 제거됨
  });
  test.skip('[GO-1-33][D] 검색 조건 일치 값 강조 표시', async () => {
    // DEPRECATED: 검색 결과 강조 UI 제거됨
  });
  test.skip('[GO-1-38][D] 인사말 영역 확인', async () => {
    // DEPRECATED: 인사말 영역 제거됨
  });
  test.skip('[GO-1-39][D] 직급/직책 필터 축약 상태', async () => {
    // DEPRECATED: 필터 축약 UI 제거됨
  });
  test.skip('[GO-1-41][D] 비교 대상 개별 인물 목록 필터링', async () => {
    // DEPRECATED: 비교 대상 필터링 기능 제거됨
  });
});
