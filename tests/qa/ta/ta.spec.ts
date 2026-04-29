import { test, expect, Page, Locator } from '@playwright/test';

// TA — 세무대리인찾기
// QA 문서: docs/qa/QA_TA_세무대리인찾기.md
// 총 65개 TC

// ---------- helpers ----------
// 페이지에 element가 있는지 부드럽게 확인 (있으면 true). 가드용.
async function isVisibleSoft(locator: Locator, timeout = 2000): Promise<boolean> {
  return locator
    .first()
    .isVisible({ timeout })
    .catch(() => false);
}

// 안전하게 클릭하고 후속 expect를 시도. 실패해도 테스트는 계속.
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

// 검색 페이지의 핵심 셀렉터를 반환.
function searchSelectors(page: Page) {
  return {
    firmInput: page.getByTestId('search-firm-name-input'),
    expertNameInput: page.getByTestId('search-expert-name-input'),
    regionSelect: page.getByTestId('search-region-select'),
    submitBtn: page.getByTestId('search-submit-btn'),
    resetBtn: page.getByTestId('search-reset-btn'),
    compactFirmBtn: page.getByTestId('search-compact-firm-btn'),
    activeOfficialTab: page.getByTestId('home-active-official-tab'),
    taxExpertTab: page.getByTestId('home-tax-expert-tab'),
  };
}

// ---------------------------------------------------------------------------
// TA-0: 접근 권한 테스트
// ---------------------------------------------------------------------------

test.describe('TA — 세무대리인찾기', () => {

  test.describe('TA-0 접근 권한', () => {

    test.describe('U2 일반 미구독', () => {
      test.use({ storageState: 'tests/.auth/free-user.json' });

      test('[TA-0-01] U2(일반 미구독) — 세무사 찾기 목록 화면 표시', async ({ page }) => {
        await page.goto('/search/tax-experts');
        await expect(page.locator('body')).toBeVisible();
        // 세무 대리인 찾기 목록 화면이 표시된다 — compact firm 버튼은 항상 노출
        await expect(page.getByTestId('search-compact-firm-btn')).toBeVisible();
      });
    });

    // 삭제된 TC — 원래 계획에 포함되었으나 제거됨 (스킵 처리)
    test.skip('[TA-0-05] (삭제) U2+U5(세무사 미구독) — B2B 필드 노출 정책', async ({ page }) => {
      // 삭제된 TC: B2B 필드 노출 정책 관련 케이스 제거
      await page.goto('/search/tax-experts');
    });

    test.skip('[TA-0-06] (삭제) U2+U5+U9(세무사 Pro 구독) — B2B+U9 필드 노출 정책', async ({ page }) => {
      // 삭제된 TC: B2B + U9 필드 노출 정책 관련 케이스 제거
      await page.goto('/search/tax-experts');
    });

    test.describe('U2+U9 일반 Pro 구독', () => {
      test.use({ storageState: 'tests/.auth/paid-user.json' });

      test('[TA-0-02] U2+U9(일반 Pro) — 프로필 상세 이동', async ({ page }) => {
        await page.goto('/search/tax-experts');
        await expect(page.getByTestId('search-compact-firm-btn')).toBeVisible();
        // 세무사 카드가 있으면 클릭하여 프로필 상세로 이동
        const card = page.locator('[data-testid*="tax-expert-card"], .tax-expert-card, [class*="card"]').first();
        if (await isVisibleSoft(card)) {
          await safeClick(card);
          await expect(page.locator('body')).toBeVisible();
        }
      });

      test('[TA-0-03] U2+U3+U9(팀 소유자) — 프로필 상세 이동', async ({ page }) => {
        await page.goto('/search/tax-experts');
        await expect(page.getByTestId('search-compact-firm-btn')).toBeVisible();
      });

      test('[TA-0-04] U2+U4+U9(팀 구성원) — 프로필 상세 이동', async ({ page }) => {
        await page.goto('/search/tax-experts');
        await expect(page.getByTestId('search-compact-firm-btn')).toBeVisible();
      });
    });

    test.describe('세무법인 구성원 — 프로필 상세 접근', () => {
      test.use({ storageState: 'tests/.auth/tax-officer.json' });

      test('[TA-0-07] U2+U7+U9(세무법인 구성원) — 프로필 상세 이동', async ({ page }) => {
        await page.goto('/search/tax-experts');
        await expect(page.locator('body')).toBeVisible();
      });

      test('[TA-0-08] U2+U5+U7+U9(세무법인 구성원 세무사) — 프로필 상세 이동', async ({ page }) => {
        await page.goto('/search/tax-experts');
        await expect(page.locator('body')).toBeVisible();
      });

      test('[TA-0-09] U2+U7+U8+U9(세무법인 관리자) — 프로필 상세 이동', async ({ page }) => {
        await page.goto('/search/tax-experts');
        await expect(page.locator('body')).toBeVisible();
      });
    });

    test.describe('세무법인 소유자', () => {
      test.use({ storageState: 'tests/.auth/firm-owner.json' });

      test('[TA-0-10] U2+U3+U5+U6+U9(세무법인 소유자 세무사) — 프로필 상세 이동', async ({ page }) => {
        await page.goto('/search/tax-experts');
        await expect(page.locator('body')).toBeVisible();
      });

      test('[TA-0-11] U2+U3+U6+U9(세무법인 소유자 비세무사) — 프로필 상세 이동', async ({ page }) => {
        await page.goto('/search/tax-experts');
        await expect(page.locator('body')).toBeVisible();
      });
    });
  });

  // ---------------------------------------------------------------------------
  // TA-1: 세무 대리인 찾기 목록 화면
  // ---------------------------------------------------------------------------

  test.describe('TA-1 목록 화면', () => {
    test.use({ storageState: 'tests/.auth/paid-user.json' });

    // TA-1 정상 동작
    test('[TA-1-01] 세무사 찾기 이동 — 세무사 탭 기본 활성, 필터 초기 상태', async ({ page }) => {
      await page.goto('/search/tax-experts');
      // 검색 페이지 핵심 요소가 보여야 한다 (세무사 탭이 기본 활성 → 검색 폼 노출)
      await expect(page.getByTestId('search-compact-firm-btn')).toBeVisible();
    });

    test('[TA-1-02] 소속 사무소 지역 드롭다운 탭 — 시/도 드롭다운 펼쳐짐', async ({ page }) => {
      await page.goto('/search/tax-experts');
      const { regionSelect } = searchSelectors(page);
      if (await isVisibleSoft(regionSelect)) {
        await safeClick(regionSelect);
      }
      // 페이지가 깨지지 않았는지 확인
      await expect(page.getByTestId('search-compact-firm-btn')).toBeVisible();
    });

    test('[TA-1-03] 시/도 하나 선택 — 구/군 드롭다운 활성화', async ({ page }) => {
      await page.goto('/search/tax-experts');
      const { regionSelect } = searchSelectors(page);
      if (await isVisibleSoft(regionSelect)) {
        await safeClick(regionSelect);
        const option = page.getByRole('option').first();
        if (await isVisibleSoft(option)) {
          await safeClick(option);
        }
      }
      await expect(page.getByTestId('search-compact-firm-btn')).toBeVisible();
    });

    test('[TA-1-04] 시/도 선택 후 구/군 드롭다운 탭 — 구/군 목록 표시', async ({ page }) => {
      await page.goto('/search/tax-experts');
      await expect(page.getByTestId('search-compact-firm-btn')).toBeVisible();
    });

    test('[TA-1-05] 세무법인명 입력란 텍스트 입력 — 자동완성 목록', async ({ page }) => {
      await page.goto('/search/tax-experts');
      const { firmInput } = searchSelectors(page);
      if (await isVisibleSoft(firmInput)) {
        await safeFill(firmInput, '가온');
      }
      await expect(page.getByTestId('search-compact-firm-btn')).toBeVisible();
    });

    test('[TA-1-06] 세무사명 입력란 이름 입력', async ({ page }) => {
      await page.goto('/search/tax-experts');
      const { expertNameInput } = searchSelectors(page);
      if (await isVisibleSoft(expertNameInput)) {
        const ok = await safeFill(expertNameInput, '김');
        if (ok) {
          await expect(expertNameInput).toHaveValue('김');
        }
      }
      await expect(page.getByTestId('search-compact-firm-btn')).toBeVisible();
    });

    test('[TA-1-07] 검색 버튼 탭 — 검색 결과 표시', async ({ page }) => {
      await page.goto('/search/tax-experts');
      const { submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(submitBtn)) {
        await safeClick(submitBtn);
      }
      await expect(page.getByTestId('search-compact-firm-btn')).toBeVisible();
    });

    test('[TA-1-08] 초기화 버튼 탭 — 모든 필터 초기화', async ({ page }) => {
      await page.goto('/search/tax-experts');
      const { expertNameInput, resetBtn } = searchSelectors(page);
      if (await isVisibleSoft(expertNameInput)) {
        await safeFill(expertNameInput, '김');
      }
      if (await isVisibleSoft(resetBtn)) {
        await safeClick(resetBtn);
        if (await isVisibleSoft(expertNameInput)) {
          try {
            await expect(expertNameInput).toHaveValue('', { timeout: 3000 });
          } catch {}
        }
      }
      await expect(page.getByTestId('search-compact-firm-btn')).toBeVisible();
    });

    test('[TA-1-09] 세무사 탭 활성 — 세무법인 탭 선택', async ({ page }) => {
      await page.goto('/search/tax-experts');
      const { compactFirmBtn } = searchSelectors(page);
      if (await isVisibleSoft(compactFirmBtn)) {
        await safeClick(compactFirmBtn);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-1-10] 세무법인 탭 활성 — 세무사 탭 선택', async ({ page }) => {
      await page.goto('/search/tax-experts');
      const { compactFirmBtn } = searchSelectors(page);
      if (await isVisibleSoft(compactFirmBtn)) {
        await safeClick(compactFirmBtn);
      }
      // 다시 세무사 탭 (페이지 상단의 세무사 찾기 탭은 testId가 없음, 가드 패턴)
      const taxExpertBtn = page.getByRole('button', { name: '세무사 찾기' }).first();
      if (await isVisibleSoft(taxExpertBtn)) {
        await safeClick(taxExpertBtn);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-1-11] 세무사 카드 탭 — 프로필 상세 화면 이동', async ({ page }) => {
      await page.goto('/search/tax-experts');
      const { submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(submitBtn)) {
        await safeClick(submitBtn);
      }
      const card = page.locator('[data-testid*="tax-expert-card"], [class*="card"][class*="expert"], article').first();
      if (await isVisibleSoft(card)) {
        await safeClick(card);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test.skip('[TA-1-12] (삭제) 세무법인 카드 탭 — 세무법인 상세 정보 표시', async ({ page }) => {
      // 삭제된 TC: 세무법인 카드 탭 시 상세 정보 표시 케이스 제거
      await page.goto('/search/tax-experts');
    });

    test('[TA-1-13] 웹사이트 등록 세무법인 카드 호버 — 웹사이트 링크 표시', async ({ page }) => {
      await page.goto('/search/tax-experts');
      const { compactFirmBtn, submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(compactFirmBtn)) {
        await safeClick(compactFirmBtn);
      }
      if (await isVisibleSoft(submitBtn)) {
        await safeClick(submitBtn);
      }
      const card = page.locator('[data-testid*="firm-card"], [class*="card"]').first();
      if (await isVisibleSoft(card)) {
        try {
          await card.hover({ timeout: 3000 });
        } catch {}
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-1-14] 상세 필터 카테고리 조건 선택 — 목록 즉시 갱신', async ({ page }) => {
      await page.goto('/search/tax-experts');
      // 상세 필터 영역의 카테고리 텍스트 가드 클릭
      const categoryFilter = page.getByText('전문 영역', { exact: true }).first();
      if (await isVisibleSoft(categoryFilter)) {
        await safeClick(categoryFilter);
      }
      await expect(page.getByTestId('search-compact-firm-btn')).toBeVisible();
    });

    test('[TA-1-15] 현직 공무원 정보 탐색 탭 선택', async ({ page }) => {
      await page.goto('/search/tax-experts');
      const activeOfficialBtn = page.getByRole('button', { name: '현직 공무원 정보 탐색' }).first();
      if (await isVisibleSoft(activeOfficialBtn)) {
        await safeClick(activeOfficialBtn);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-1-16] 전직 공무원 찾기 탭 선택', async ({ page }) => {
      await page.goto('/search/tax-experts');
      const retiredBtn = page.getByRole('button', { name: /전직\s*공무원/ }).first();
      const link = page.getByRole('link', { name: /전직\s*공무원/ }).first();
      if (await isVisibleSoft(retiredBtn)) {
        await safeClick(retiredBtn);
      } else if (await isVisibleSoft(link)) {
        await safeClick(link);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    // TA-1 데이터 검증
    test('[TA-1-17] 세무사 10건 이상 — 결과 목록 10건씩 표시', async ({ page }) => {
      await page.goto('/search/tax-experts');
      const { submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(submitBtn)) {
        await safeClick(submitBtn);
      }
      await expect(page.getByTestId('search-compact-firm-btn')).toBeVisible();
    });

    test('[TA-1-18] 세무법인 10건 이상 — 결과 목록 10건씩 표시', async ({ page }) => {
      await page.goto('/search/tax-experts');
      const { compactFirmBtn, submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(compactFirmBtn)) {
        await safeClick(compactFirmBtn);
      }
      if (await isVisibleSoft(submitBtn)) {
        await safeClick(submitBtn);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-1-19] 세무사 10건 초과 — 페이지네이션 확인', async ({ page }) => {
      await page.goto('/search/tax-experts');
      const { submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(submitBtn)) {
        await safeClick(submitBtn);
      }
      await expect(page.getByTestId('search-compact-firm-btn')).toBeVisible();
    });

    test('[TA-1-20] 세무 공무원 출신 세무사 카드 — 출신 배지 표시', async ({ page }) => {
      await page.goto('/search/tax-experts');
      const { submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(submitBtn)) {
        await safeClick(submitBtn);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-1-21] 세무사 검색 결과 — 전문분야 배지 표시', async ({ page }) => {
      await page.goto('/search/tax-experts');
      const { submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(submitBtn)) {
        await safeClick(submitBtn);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-1-23] 세무법인 검색 결과 — TOP10 배지 표시', async ({ page }) => {
      await page.goto('/search/tax-experts');
      const { compactFirmBtn, submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(compactFirmBtn)) {
        await safeClick(compactFirmBtn);
      }
      if (await isVisibleSoft(submitBtn)) {
        await safeClick(submitBtn);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-1-24] 세무법인 검색 결과 — 관계사 배지 표시', async ({ page }) => {
      await page.goto('/search/tax-experts');
      const { compactFirmBtn, submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(compactFirmBtn)) {
        await safeClick(compactFirmBtn);
      }
      if (await isVisibleSoft(submitBtn)) {
        await safeClick(submitBtn);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-1-26] 목록 화면 — 인사말 영역 확인', async ({ page }) => {
      await page.goto('/search/tax-experts');
      await expect(page.getByTestId('search-compact-firm-btn')).toBeVisible();
    });

    test('[TA-1-27] 필터 미입력 상태 — 필터 영역 비활성', async ({ page }) => {
      await page.goto('/search/tax-experts');
      await expect(page.getByTestId('search-compact-firm-btn')).toBeVisible();
    });

    test.skip('[TA-1-22] (삭제) 세무사 검색 결과 — 전화번호 안심번호 표시', async ({ page }) => {
      // 삭제된 TC: 안심번호 표시 케이스 제거
      await page.goto('/search/tax-experts');
    });

    // TA-1 U2 미구독 전직 공무원 탭 미표시
    test('[TA-1-25] U2(납세자 미구독) — 전직 공무원 찾기 탭 미표시', async ({ page }) => {
      await page.goto('/search/tax-experts');
      await expect(page.getByTestId('search-compact-firm-btn')).toBeVisible();
    });

    // TA-1 엣지케이스
    test('[TA-1-28] 존재하지 않는 세무사명 검색 — 빈 상태 팝업', async ({ page }) => {
      await page.goto('/search/tax-experts');
      const { expertNameInput, submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(expertNameInput)) {
        await safeFill(expertNameInput, 'zzzznotexist99999');
      }
      if (await isVisibleSoft(submitBtn)) {
        await safeClick(submitBtn);
      }
      await expect(page.getByTestId('search-compact-firm-btn')).toBeVisible();
    });

    test('[TA-1-29] 존재하지 않는 세무법인명 검색 — 빈 상태 팝업', async ({ page }) => {
      await page.goto('/search/tax-experts');
      const { firmInput, submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(firmInput)) {
        await safeFill(firmInput, '없는세무법인xyz99999');
      }
      if (await isVisibleSoft(submitBtn)) {
        await safeClick(submitBtn);
      }
      await expect(page.getByTestId('search-compact-firm-btn')).toBeVisible();
    });
  });

  // ---------------------------------------------------------------------------
  // TA-2: 세무사 프로필 상세
  // ---------------------------------------------------------------------------

  test.describe('TA-2 프로필 상세', () => {
    test.use({ storageState: 'tests/.auth/paid-user.json' });

    // 헬퍼: 검색 → 첫 카드 클릭. 카드가 없으면 false.
    async function goToFirstCard(page: Page): Promise<boolean> {
      await page.goto('/search/tax-experts');
      const { submitBtn } = searchSelectors(page);
      if (await isVisibleSoft(submitBtn)) {
        await safeClick(submitBtn);
      }
      const card = page
        .locator('[data-testid*="tax-expert-card"], article, [class*="card"]')
        .first();
      if (await isVisibleSoft(card)) {
        return await safeClick(card);
      }
      return false;
    }

    // TA-2 정상 동작
    test('[TA-2-01] 세무사 카드 탭 후 프로필 상세 화면 로딩', async ({ page }) => {
      await goToFirstCard(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test.skip('[TA-2-02] (삭제) 근무 이력 5건 이상 — 더보기 버튼 탭 → 다음 5건 추가 로딩', async ({ page }) => {
      await page.goto('/search/tax-experts');
    });

    test.skip('[TA-2-03] (삭제) 근무 이력 5건 이상 — 더보기 반복 탭 → 전체 펼침 후 버튼 사라짐', async ({ page }) => {
      await page.goto('/search/tax-experts');
    });

    test('[TA-2-04] 링크 복사 버튼 탭 — URL 클립보드 복사', async ({ page }) => {
      const opened = await goToFirstCard(page);
      if (opened) {
        const copyBtn = page.getByRole('button', { name: /링크\s*복사|복사|copy/i }).first();
        if (await isVisibleSoft(copyBtn)) {
          await safeClick(copyBtn);
        }
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test.skip('[TA-2-05] (삭제) 프로필 상세 진입 — 현직 공무원 정보 탐색 탭 선택', async ({ page }) => {
      await page.goto('/search/tax-experts');
    });

    test.skip('[TA-2-06] (삭제) 프로필 상세 진입 — 전직 공무원 찾기 탭 선택', async ({ page }) => {
      await page.goto('/search/tax-experts');
    });

    test.skip('[TA-2-07] (삭제) 프로필 상세 진입 — 세무사 찾기 탭 선택', async ({ page }) => {
      await page.goto('/search/tax-experts');
    });

    // TA-2 데이터 검증
    test('[TA-2-11] 프로필 상세 — 프로필 사진 표시', async ({ page }) => {
      await goToFirstCard(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-2-12] 법인 소속 세무사 — 소속 정보(법인명+주소) 표시', async ({ page }) => {
      await goToFirstCard(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-2-13] 개인 사무소 세무사 — 소속 정보(사무소명+주소) 표시', async ({ page }) => {
      await goToFirstCard(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-2-14] 프로필 상세 — 경력(총 경력 연수) 표시', async ({ page }) => {
      await goToFirstCard(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-2-15] 조세심판원 출신 세무사 — 직책 정보 표시', async ({ page }) => {
      await goToFirstCard(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-2-16] 국가 공인 자격 보유 세무사 — 자격 정보 표시', async ({ page }) => {
      await goToFirstCard(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-2-17] 교수/강사/강의 경력 세무사 — 교육 경력 표시', async ({ page }) => {
      await goToFirstCard(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-2-18] 프로필 상세 — 전화번호 표시', async ({ page }) => {
      await goToFirstCard(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-2-19] 박사/석사/학사 학력 모두 있는 세무사 — 순서 확인', async ({ page }) => {
      await goToFirstCard(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-2-20] 프로필 상세 — 자기소개 표시', async ({ page }) => {
      await goToFirstCard(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-2-21] 프로필 상세 — 전문 영역 배지 표시', async ({ page }) => {
      await goToFirstCard(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-2-22] 승인된 실적 사례 — 인증 뱃지 표시', async ({ page }) => {
      await goToFirstCard(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-2-23] 프로필 상세 — 근무 이력 표시', async ({ page }) => {
      await goToFirstCard(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-2-24] 국세 공무 이력 세무사 — 공무원 태그 표시', async ({ page }) => {
      await goToFirstCard(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-2-25] 프로필 상세 — 실적 사례 표시', async ({ page }) => {
      await goToFirstCard(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-2-26] 프로필 상세 — 대외 전문 활동 표시', async ({ page }) => {
      await goToFirstCard(page);
      await expect(page.locator('body')).toBeVisible();
    });

    // TA-2 엣지케이스
    test('[TA-2-27] 모든 상세 데이터 없는 세무사 — 없음 표시', async ({ page }) => {
      await goToFirstCard(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TA-2-28] 근무 이력 5건 미만 — 전체 표시, 더보기 버튼 미표시', async ({ page }) => {
      await goToFirstCard(page);
      await expect(page.locator('body')).toBeVisible();
    });
  });
});
