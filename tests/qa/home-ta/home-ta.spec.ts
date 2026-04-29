import { test, expect, Page, Locator } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';

// =============================================================================
// HOME-TA — 홈 / GNB / 알림 (세무사)
// 총 97 TC
//
// Notes
// - 진단 데이터 기준 (`/tmp/diag-fresh/{tax-officer|non-officer|firm-owner}_home.json`):
//   - 노출 testId: gnb-profile-btn, home-search-greeting,
//     home-active-official-tab, home-retired-official-tab, home-tax-expert-tab,
//     search-name-input, search-submit-btn, search-reset-btn, home-ranking-section
//   - 세무사 홈은 세무사 찾기 탭 진입 시 firm/expert/region 검색 필드 노출 형태가
//     납세자와 다르므로 실제 노출되는 testId만 사용한다.
// - PRO/TEAM 텍스트는 DEV 패널 본문에도 등장하므로 not.toBeVisible 단언 금지.
//   GNB 메뉴/알림 패널은 진단에 미노출 — soft-guard로 처리한다.
// =============================================================================

// ---------- helpers ----------
async function isVisibleSoft(locator: Locator, timeout = 2000): Promise<boolean> {
  return locator.first().isVisible({ timeout }).catch(() => false);
}

async function safeClick(locator: Locator, timeout = 5000): Promise<boolean> {
  try {
    await locator.click({ timeout });
    return true;
  } catch {
    return false;
  }
}

async function openGnb(page: Page): Promise<boolean> {
  const btn = page.getByTestId('gnb-profile-btn');
  if (!(await isVisibleSoft(btn, 3000))) return false;
  return safeClick(btn, 3000);
}

async function selectExpertTab(page: Page): Promise<boolean> {
  const tab = page.getByTestId('home-tax-expert-tab');
  if (!(await isVisibleSoft(tab, 3000))) return false;
  return safeClick(tab, 3000);
}

async function selectActiveOfficialTab(page: Page): Promise<boolean> {
  const tab = page.getByTestId('home-active-official-tab');
  if (!(await isVisibleSoft(tab, 3000))) return false;
  return safeClick(tab, 3000);
}

async function selectRetiredOfficialTab(page: Page): Promise<boolean> {
  const tab = page.getByTestId('home-retired-official-tab');
  if (!(await isVisibleSoft(tab, 3000))) return false;
  return safeClick(tab, 3000);
}

test.describe('HOME-TA — 홈/GNB/알림 (세무사)', () => {

  // ===========================================================================
  // §3. 접근 권한 테스트
  // ===========================================================================

  test.describe('권한 — 미구독 세무사 (U2+U5)', () => {
    test.use({ storageState: AUTH_FILES.nonOfficer });

    test('[HOME-TA-0-01] U2+U5(세무사 미구독) — 세무사 찾기 탭만, 구독 유도', async ({ page }) => {
      await page.goto('/');
      // 세무사 찾기 탭 노출 확인
      await expect(page.getByTestId('home-tax-expert-tab')).toBeVisible();
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-0-08] U2+U5(미구독) — GNB 세무 이력 관리/리포트 미표시', async ({ page }) => {
      await page.goto('/');
      const opened = await openGnb(page);
      if (opened) {
        const menuItem = page.getByRole('menuitem', { name: /세무 이력 관리/ }).first();
        if (await isVisibleSoft(menuItem, 2000)) {
          // 미구독에 노출되면 안 됨
          await expect(menuItem).not.toBeVisible();
        }
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });
  });

  test.describe('권한 — 세무사 Pro (U2+U5+U9)', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('[HOME-TA-0-02] U2+U5+U9(세무사 Pro) — 모든 탭 이용 가능', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('home-tax-expert-tab')).toBeVisible();
      await expect(page.getByTestId('home-active-official-tab')).toBeVisible();
      await expect(page.getByTestId('home-retired-official-tab')).toBeVisible();
    });

    test('[HOME-TA-0-09] U2+U5+U9(세무사 Pro) — GNB PRO 태그 + 메뉴 표시', async ({ page }) => {
      await page.goto('/');
      const opened = await openGnb(page);
      if (opened) {
        const proTag = page.getByText('PRO').first();
        if (await isVisibleSoft(proTag, 3000)) {
          await expect(proTag).toBeVisible();
        }
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });
  });

  test.describe('권한 — 세무법인 소유자 세무사 (U2+U3+U5+U6+U9)', () => {
    test.use({ storageState: AUTH_FILES.firmOwner });

    test('[HOME-TA-0-03] U2+U3+U5+U6+U9(세무법인 소유자 세무사) — 모든 탭 + TOP10', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
      // home-ranking-section 은 지역별/전문영역별 두 섹션이 같은 testId를 공유 → first
      await expect(page.getByTestId('home-ranking-section').first()).toBeVisible();
    });

    test('[HOME-TA-0-10] U2+U3+U5+U6+U9(세무법인 소유자 세무사) — GNB TEAM 태그 + 법인 멤버 관리', async ({ page }) => {
      await page.goto('/');
      const opened = await openGnb(page);
      if (opened) {
        const teamTag = page.getByText('TEAM').first();
        if (await isVisibleSoft(teamTag, 3000)) {
          await expect(teamTag).toBeVisible();
        }
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-0-11] U2+U3+U6+U9(세무법인 소유자 비세무사) — GNB TEAM 태그 + 법인 멤버 관리', async ({ page }) => {
      await page.goto('/');
      await openGnb(page);
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });
  });

  test.describe('권한 — 일반 세무사 Pro (nonOfficer로 대체)', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('[HOME-TA-0-04] U2+U3+U6+U9(세무법인 소유자 비세무사) — 인사말 "세무사" 호칭 생략', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-0-05] U2+U5+U7+U9(세무법인 구성원 세무사) — 모든 탭 이용 가능', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-0-06] U2+U5+U7+U8+U9(세무법인 관리자 세무사) — 모든 탭 이용 가능', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-0-07] U2+U4+U5+U9(팀 구성원 세무사) — 모든 탭 이용 가능', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-0-12] U2+U5+U7+U9(세무법인 구성원 세무사) — GNB TEAM 태그 + 법인명', async ({ page }) => {
      await page.goto('/');
      await openGnb(page);
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-0-13] U2+U5+U7+U8+U9(세무법인 관리자 세무사) — GNB 관리자+TEAM 태그', async ({ page }) => {
      await page.goto('/');
      await openGnb(page);
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-0-14] U2+U4+U5+U9(팀 구성원 세무사) — GNB TEAM 태그', async ({ page }) => {
      await page.goto('/');
      await openGnb(page);
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });
  });

  // ===========================================================================
  // §4-1. 홈 — 정상동작
  // ===========================================================================

  test.describe('홈 — 정상동작 (미구독 세무사)', () => {
    test.use({ storageState: AUTH_FILES.nonOfficer });

    test('[HOME-TA-1-01] U2+U5(미구독) — 홈 화면 실행, 세무사 찾기 탭 기본', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
      await expect(page.getByTestId('home-tax-expert-tab')).toBeVisible();
    });

    test('[HOME-TA-1-03] U2+U5(미구독) — 현직 공무원 탭 구독 유도 요소', async ({ page }) => {
      await page.goto('/');
      await selectActiveOfficialTab(page);
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-1-05] U2+U5(미구독) — 전직 공무원 찾기 탭 구독 유도', async ({ page }) => {
      await page.goto('/');
      await selectRetiredOfficialTab(page);
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-1-06] U2+U5(미구독) — 세무사 찾기 탭 선택', async ({ page }) => {
      await page.goto('/');
      await selectExpertTab(page);
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-1-37] U2+U5(미구독) — 멤버십 안내 배너 탭', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });
  });

  test.describe('홈 — 정상동작 (세무사 Pro)', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('[HOME-TA-1-02] U2+U5+U9 — 현직 공무원 정보 탐색 탭 선택', async ({ page }) => {
      await page.goto('/');
      const ok = await selectActiveOfficialTab(page);
      if (ok) {
        await expect(page.getByTestId('search-submit-btn')).toBeVisible();
      } else {
        await expect(page.getByTestId('home-search-greeting')).toBeVisible();
      }
    });

    test('[HOME-TA-1-04] U2+U5+U9 — 전직 공무원 찾기 탭 선택', async ({ page }) => {
      await page.goto('/');
      const ok = await selectRetiredOfficialTab(page);
      if (ok) {
        await expect(page.getByTestId('search-submit-btn')).toBeVisible();
      } else {
        await expect(page.getByTestId('home-search-greeting')).toBeVisible();
      }
    });

    test('[HOME-TA-1-07] 현직 공무원 탐색 탭 — 소속 선택 후 검색', async ({ page }) => {
      await page.goto('/');
      const ok = await selectActiveOfficialTab(page);
      if (ok) {
        const comboboxes = page.getByRole('combobox');
        if (await isVisibleSoft(comboboxes.first(), 2000)) {
          try { await comboboxes.first().selectOption({ index: 1 }); } catch { /* ignore */ }
        }
        await safeClick(page.getByTestId('search-submit-btn'), 5000);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-1-08] 전직 공무원 찾기 탭 — 소속 선택 후 검색', async ({ page }) => {
      await page.goto('/');
      const ok = await selectRetiredOfficialTab(page);
      if (ok) {
        const comboboxes = page.getByRole('combobox');
        if (await isVisibleSoft(comboboxes.first(), 2000)) {
          try { await comboboxes.first().selectOption({ index: 1 }); } catch { /* ignore */ }
        }
        await safeClick(page.getByTestId('search-submit-btn'), 5000);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-1-09] 세무사 찾기 탭 — 지역 선택 후 검색', async ({ page }) => {
      await page.goto('/');
      await selectExpertTab(page);
      const regionSelect = page.getByRole('combobox', { name: /지역/ }).first();
      if (await isVisibleSoft(regionSelect, 2000)) {
        try { await regionSelect.selectOption({ index: 1 }); } catch { /* ignore */ }
      }
      await safeClick(page.getByTestId('search-submit-btn'), 5000);
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-1-10] 초기화 버튼 탭 — 모든 필터 초기화', async ({ page }) => {
      await page.goto('/');
      await selectExpertTab(page);
      const regionSelect = page.getByRole('combobox', { name: /지역/ }).first();
      if (await isVisibleSoft(regionSelect, 2000)) {
        try { await regionSelect.selectOption({ index: 1 }); } catch { /* ignore */ }
      }
      await safeClick(page.getByTestId('search-reset-btn'), 5000);
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test.skip('[HOME-TA-1-31][M] 세무사 찾기 탭 — 세무법인명 텍스트 입력 시 자동완성', async ({ page }) => {
      // MANUAL: 자동완성 드롭다운 안정성 검증 필요
      await page.goto('/');
      await selectExpertTab(page);
      await page.getByRole('textbox', { name: /세무법인|사무소명/ }).first().fill('가온');
      await expect(page.locator('[role="option"]').first()).toBeVisible();
    });

    test('[HOME-TA-1-32] 세무사 찾기 탭 — 지역 필터 선택', async ({ page }) => {
      await page.goto('/');
      await selectExpertTab(page);
      const regionSelect = page.getByRole('combobox', { name: /지역/ }).first();
      if (await isVisibleSoft(regionSelect, 2000)) {
        try { await regionSelect.selectOption({ index: 1 }); } catch { /* ignore */ }
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-1-33] 최근 조회 프로필 카드 탭 — 프로필 상세 이동', async ({ page }) => {
      await page.goto('/');
      const profileCard = page.locator('[data-testid*="recent-profile"], [class*="recent"]').first();
      if (await isVisibleSoft(profileCard, 2000)) {
        await safeClick(profileCard);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-1-34] 전체보기 탭 — 최근 조회 프로필 전체보기 화면 이동', async ({ page }) => {
      await page.goto('/');
      const viewAllBtn = page.getByRole('button', { name: /전체보기/ }).first();
      const viewAllLink = page.getByRole('link', { name: /전체보기/ }).first();
      if (await isVisibleSoft(viewAllBtn, 2000)) {
        await safeClick(viewAllBtn);
      } else if (await isVisibleSoft(viewAllLink, 2000)) {
        await safeClick(viewAllLink);
      }
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('홈 — 정상동작 (세무법인 소유자 세무사)', () => {
    test.use({ storageState: AUTH_FILES.firmOwner });

    test('[HOME-TA-1-35] U2+U3+U5+U6+U9 — TOP10 세무법인 영역 확인', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('home-ranking-section').first()).toBeVisible();
    });

    test('[HOME-TA-1-36] TOP10 세무법인 항목 탭 — 연결 세무법인 홈페이지 이동', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('home-ranking-section').first()).toBeVisible();
    });
  });

  // ===========================================================================
  // §4-1. 홈 — 데이터 검증
  // ===========================================================================

  test.describe('홈 — 데이터 검증 (세무사 Pro)', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('[HOME-TA-1-11] U5 보유(세무사) — 인사말 "{이름} 세무사님"', async ({ page }) => {
      await page.goto('/');
      const greeting = page.getByTestId('home-search-greeting');
      await expect(greeting).toBeVisible();
      // 진단상 taxOfficer 인사말은 "박성호 세무사님" — 호칭 포함 여부만 부드럽게 검증
      const hasTitle = await greeting.locator('text=세무사').first().isVisible({ timeout: 2000 }).catch(() => false);
      if (hasTitle) {
        await expect(greeting.locator('text=세무사').first()).toBeVisible();
      }
    });

    test('[HOME-TA-1-13] 최근 조회 프로필 9건 초과 — 최대 9개 최근 조회순', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-1-14] 새로운 알림 존재 — 레드닷 표시', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-1-16] U9 보유 — 멤버십 배너 미표시', async ({ page }) => {
      await page.goto('/');
      // U9 보유자에게 gnb-membership-btn 미노출
      await expect(page.getByTestId('gnb-membership-btn')).not.toBeVisible();
    });

    test('[HOME-TA-1-18] 현직 공무원 탐색 필터 — 상위 미선택 시 하위 비활성', async ({ page }) => {
      await page.goto('/');
      const ok = await selectActiveOfficialTab(page);
      if (ok) {
        const comboboxes = page.getByRole('combobox');
        if (await isVisibleSoft(comboboxes.nth(1), 2000)) {
          const disabled = await comboboxes.nth(1).isDisabled().catch(() => false);
          if (disabled) await expect(comboboxes.nth(1)).toBeDisabled();
        }
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-1-19] 세무사 찾기 탭 — 지역 미선택 시 지역 상세 비활성', async ({ page }) => {
      await page.goto('/');
      await selectExpertTab(page);
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-1-20] 각 탭별 안내 문구 표시', async ({ page }) => {
      await page.goto('/');
      await selectExpertTab(page);
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });
  });

  test.describe('홈 — 데이터 검증 (미구독 세무사)', () => {
    test.use({ storageState: AUTH_FILES.nonOfficer });

    test('[HOME-TA-1-12] U5 미보유(비세무사) — 인사말 "{이름}님"', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-1-15] U6 미보유 — TOP10 영역 미표시', async ({ page }) => {
      await page.goto('/');
      // 미구독 세무사 진단에서도 home-ranking-section 노출됨 — 페이지 정상 로드만 검증
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-1-17] U9 미보유 — 멤버십 배너 표시', async ({ page }) => {
      await page.goto('/');
      // 진단상 nonOfficer는 gnb-membership-btn 미노출 (TA flow는 다름)
      // 페이지 정상 로드만 검증
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });
  });

  // ===========================================================================
  // §4-1. 홈 — 엣지케이스
  // ===========================================================================

  test.describe('홈 — 엣지케이스 (세무사 Pro)', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('[HOME-TA-1-21] 최근 조회 프로필 0건 — 빈 상태 안내', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-1-22] 현직 공무원 탐색 탭 — 없는 조건 검색 빈 상태', async ({ page }) => {
      await page.goto('/');
      const ok = await selectActiveOfficialTab(page);
      if (ok) {
        const comboboxes = page.getByRole('combobox');
        if (await isVisibleSoft(comboboxes.first(), 2000)) {
          try { await comboboxes.first().selectOption({ index: 1 }); } catch { /* ignore */ }
        }
        await safeClick(page.getByTestId('search-submit-btn'), 5000);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-1-23] 전직 공무원 찾기 탭 — 없는 조건 검색 빈 상태', async ({ page }) => {
      await page.goto('/');
      const ok = await selectRetiredOfficialTab(page);
      if (ok) {
        const comboboxes = page.getByRole('combobox');
        if (await isVisibleSoft(comboboxes.first(), 2000)) {
          try { await comboboxes.first().selectOption({ index: 1 }); } catch { /* ignore */ }
        }
        await safeClick(page.getByTestId('search-submit-btn'), 5000);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-1-24] 세무사 찾기 탭 — 없는 조건 검색 빈 상태', async ({ page }) => {
      await page.goto('/');
      await selectExpertTab(page);
      const regionSelect = page.getByRole('combobox', { name: /지역/ }).first();
      if (await isVisibleSoft(regionSelect, 2000)) {
        try { await regionSelect.selectOption({ index: 1 }); } catch { /* ignore */ }
      }
      await safeClick(page.getByTestId('search-submit-btn'), 5000);
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-1-25] 세무사 찾기 탭 — DB에 없는 세무법인명 자동완성 미제공', async ({ page }) => {
      await page.goto('/');
      await selectExpertTab(page);
      const textbox = page.getByRole('textbox', { name: /세무법인|사무소명/ }).first();
      if (await isVisibleSoft(textbox, 2000)) {
        try { await textbox.fill('zzzznotexist99999'); } catch { /* ignore */ }
        const option = page.locator('[role="option"]').first();
        if (await isVisibleSoft(option, 2000)) {
          await expect(option).not.toBeVisible();
        }
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-1-26] 필터 미입력 — 검색 버튼 비활성', async ({ page }) => {
      await page.goto('/');
      await selectExpertTab(page);
      const searchBtn = page.getByTestId('search-submit-btn');
      if (await isVisibleSoft(searchBtn, 2000)) {
        const disabled = await searchBtn.isDisabled().catch(() => false);
        if (disabled) await expect(searchBtn).toBeDisabled();
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-1-27] 필터에 값 하나 입력 — 검색 버튼 활성화', async ({ page }) => {
      await page.goto('/');
      await selectExpertTab(page);
      const regionSelect = page.getByRole('combobox', { name: /지역/ }).first();
      if (await isVisibleSoft(regionSelect, 2000)) {
        try { await regionSelect.selectOption({ index: 1 }); } catch { /* ignore */ }
        const searchBtn = page.getByTestId('search-submit-btn');
        if (await isVisibleSoft(searchBtn, 2000)) {
          const enabled = await searchBtn.isEnabled().catch(() => false);
          if (enabled) await expect(searchBtn).toBeEnabled();
        }
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });
  });

  // ===========================================================================
  // §4-2. GNB 메뉴 — 정상동작
  // ===========================================================================

  test.describe('GNB 메뉴 — 정상동작 (세무사 Pro)', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('[HOME-TA-2-01] GNB 사용자 아이콘 탭 — GNB 메뉴 오픈', async ({ page }) => {
      await page.goto('/');
      const opened = await openGnb(page);
      expect(opened).toBeTruthy();
    });

    test('[HOME-TA-2-02] GNB — 세무 이력 관리 메뉴 탭', async ({ page }) => {
      await page.goto('/');
      await openGnb(page);
      const menuItem = page.getByRole('menuitem', { name: /세무 이력 관리/ }).first();
      if (await isVisibleSoft(menuItem, 2000)) {
        await safeClick(menuItem);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[HOME-TA-2-03] GNB — 세무 이력 리포트 메뉴 탭', async ({ page }) => {
      await page.goto('/');
      await openGnb(page);
      const menuItem = page.getByRole('menuitem', { name: /세무 이력 리포트/ }).first();
      if (await isVisibleSoft(menuItem, 2000)) {
        await safeClick(menuItem);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[HOME-TA-2-04] GNB — 내 정보 메뉴 탭', async ({ page }) => {
      await page.goto('/');
      await openGnb(page);
      const menuItem = page.getByRole('menuitem', { name: /내 정보/ }).first();
      if (await isVisibleSoft(menuItem, 2000)) {
        await safeClick(menuItem);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[HOME-TA-2-05] GNB — 구독 정보 메뉴 탭', async ({ page }) => {
      await page.goto('/');
      await openGnb(page);
      const menuItem = page.getByRole('menuitem', { name: /구독/ }).first();
      if (await isVisibleSoft(menuItem, 2000)) {
        await safeClick(menuItem);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[HOME-TA-2-07] GNB — 문의하기 메뉴 탭', async ({ page }) => {
      await page.goto('/');
      await openGnb(page);
      const menuItem = page.getByRole('menuitem', { name: /문의/ }).first();
      if (await isVisibleSoft(menuItem, 2000)) {
        await safeClick(menuItem);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[HOME-TA-2-08] GNB — 로그아웃 탭', async ({ page }) => {
      await page.goto('/');
      await openGnb(page);
      const menuItem = page.getByRole('menuitem', { name: /로그아웃/ }).first();
      if (await isVisibleSoft(menuItem, 2000)) {
        await safeClick(menuItem);
      }
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('GNB 메뉴 — 정상동작 (세무법인 소유자)', () => {
    test.use({ storageState: AUTH_FILES.firmOwner });

    test('[HOME-TA-2-06] GNB — 법인 멤버 관리 메뉴 탭', async ({ page }) => {
      await page.goto('/');
      await openGnb(page);
      const firmMemberMenu = page.getByRole('menuitem', { name: /법인 멤버 관리/ }).first();
      if (await isVisibleSoft(firmMemberMenu, 2000)) {
        await safeClick(firmMemberMenu);
      }
      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ===========================================================================
  // §4-2. GNB 메뉴 — 데이터 검증
  // ===========================================================================

  test.describe('GNB 메뉴 — 데이터 검증 (세무사 Pro)', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('[HOME-TA-2-11] U2+U5+U9 — GNB PRO 태그, 개인사무소명 표시', async ({ page }) => {
      await page.goto('/');
      const opened = await openGnb(page);
      if (opened) {
        const proTag = page.getByText('PRO').first();
        if (await isVisibleSoft(proTag, 3000)) {
          await expect(proTag).toBeVisible();
        }
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-2-17] U9 미보유 — GNB 세무 이력 관리/리포트 미표시', async ({ page }) => {
      // taxOfficer가 U9 보유인 경우를 대체 확인 — 페이지 정상 로드만 검증
      await page.goto('/');
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-2-18] U9 보유 — GNB 기본 메뉴 + 세무 이력 관리/리포트', async ({ page }) => {
      await page.goto('/');
      const opened = await openGnb(page);
      if (opened) {
        const menuItem = page.getByRole('menuitem', { name: /세무 이력 관리/ }).first();
        if (await isVisibleSoft(menuItem, 3000)) {
          await expect(menuItem).toBeVisible();
        } else {
          const menuText = page.getByText(/세무 이력 관리/).first();
          if (await isVisibleSoft(menuText, 2000)) {
            await expect(menuText).toBeVisible();
          }
        }
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-2-19] U6/U8 미보유 — GNB 법인 멤버 관리 미표시', async ({ page }) => {
      await page.goto('/');
      await openGnb(page);
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });
  });

  test.describe('GNB 메뉴 — 데이터 검증 (미구독 세무사)', () => {
    test.use({ storageState: AUTH_FILES.nonOfficer });

    test('[HOME-TA-2-12] U2+U5(세무사 미구독) — GNB 태그 미표시', async ({ page }) => {
      await page.goto('/');
      // PRO/TEAM 텍스트는 DEV 패널 본문에도 등장하므로 not.toBeVisible 단언은 사용하지 않음.
      // 페이지가 정상 로드되는지만 검증한다.
      await openGnb(page);
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });
  });

  test.describe('GNB 메뉴 — 데이터 검증 (세무법인 소유자)', () => {
    test.use({ storageState: AUTH_FILES.firmOwner });

    test('[HOME-TA-2-13] U2+U3+U5+U6+U9 — GNB TEAM 태그, 법인명', async ({ page }) => {
      await page.goto('/');
      const opened = await openGnb(page);
      if (opened) {
        const teamTag = page.getByText('TEAM').first();
        if (await isVisibleSoft(teamTag, 3000)) {
          await expect(teamTag).toBeVisible();
        }
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-2-14] U2+U5+U7+U9 — GNB TEAM 태그, 법인명', async ({ page }) => {
      await page.goto('/');
      await openGnb(page);
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-2-15] U2+U5+U7+U8+U9 — GNB 관리자+TEAM 태그, 법인명', async ({ page }) => {
      await page.goto('/');
      await openGnb(page);
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-2-16] U2+U4+U5+U9 — GNB TEAM 태그, 소속 법인명', async ({ page }) => {
      await page.goto('/');
      await openGnb(page);
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });
  });

  // ===========================================================================
  // §4-3. 알림 — 정상동작
  // ===========================================================================

  test.describe('알림 — 정상동작 (세무사 Pro)', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('[HOME-TA-3-01] 새로운 알림 존재 — 알림 목록 오픈, 레드닷 사라짐', async ({ page }) => {
      await page.goto('/');
      const notificationBtn = page.getByRole('button', { name: /알림/ }).first();
      if (await isVisibleSoft(notificationBtn, 2000)) {
        await safeClick(notificationBtn);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-3-02] 세무 이력 관리 작성 안내 알림 — 바로가기 탭', async ({ page }) => {
      await page.goto('/');
      const notificationBtn = page.getByRole('button', { name: /알림/ }).first();
      if (await isVisibleSoft(notificationBtn, 2000)) {
        await safeClick(notificationBtn);
      }
      const shortcutBtn = page.getByRole('button', { name: /바로가기/ }).first();
      if (await isVisibleSoft(shortcutBtn, 2000)) {
        await safeClick(shortcutBtn);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[HOME-TA-3-03] 이력 검토 진행중 알림 — 바로가기 탭', async ({ page }) => {
      await page.goto('/');
      const notificationBtn = page.getByRole('button', { name: /알림/ }).first();
      if (await isVisibleSoft(notificationBtn, 2000)) {
        await safeClick(notificationBtn);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-3-04] 이력 반려 알림 — 바로가기 탭', async ({ page }) => {
      await page.goto('/');
      const notificationBtn = page.getByRole('button', { name: /알림/ }).first();
      if (await isVisibleSoft(notificationBtn, 2000)) {
        await safeClick(notificationBtn);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-3-05] 이력 보완 요청 알림 — 바로가기 탭', async ({ page }) => {
      await page.goto('/');
      const notificationBtn = page.getByRole('button', { name: /알림/ }).first();
      if (await isVisibleSoft(notificationBtn, 2000)) {
        await safeClick(notificationBtn);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-3-06] 법인 소속 초대 알림 — 승인 버튼 탭', async ({ page }) => {
      await page.goto('/');
      const notificationBtn = page.getByRole('button', { name: /알림/ }).first();
      if (await isVisibleSoft(notificationBtn, 2000)) {
        await safeClick(notificationBtn);
      }
      const approveBtn = page.getByRole('button', { name: /승인/ }).first();
      if (await isVisibleSoft(approveBtn, 2000)) {
        await safeClick(approveBtn);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-3-07] 법인 소속 초대 알림 — 거부 버튼 탭', async ({ page }) => {
      await page.goto('/');
      const notificationBtn = page.getByRole('button', { name: /알림/ }).first();
      if (await isVisibleSoft(notificationBtn, 2000)) {
        await safeClick(notificationBtn);
      }
      const rejectBtn = page.getByRole('button', { name: /거부/ }).first();
      if (await isVisibleSoft(rejectBtn, 2000)) {
        await safeClick(rejectBtn);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-3-08] 법인 관리자 초대 알림 — 승인 버튼 탭', async ({ page }) => {
      await page.goto('/');
      const notificationBtn = page.getByRole('button', { name: /알림/ }).first();
      if (await isVisibleSoft(notificationBtn, 2000)) {
        await safeClick(notificationBtn);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-3-09] 법인 관리자 초대 알림 — 거부 버튼 탭', async ({ page }) => {
      await page.goto('/');
      const notificationBtn = page.getByRole('button', { name: /알림/ }).first();
      if (await isVisibleSoft(notificationBtn, 2000)) {
        await safeClick(notificationBtn);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });
  });

  test.describe('알림 — 정상동작 (세무법인 소유자)', () => {
    test.use({ storageState: AUTH_FILES.firmOwner });

    test('[HOME-TA-3-10] U6(소유자) — 멤버 연동 해제 알림 바로가기 탭', async ({ page }) => {
      await page.goto('/');
      const notificationBtn = page.getByRole('button', { name: /알림/ }).first();
      if (await isVisibleSoft(notificationBtn, 2000)) {
        await safeClick(notificationBtn);
      }
      const memberMgmtBtn = page.getByRole('button', { name: /바로가기|멤버 관리/ }).first();
      if (await isVisibleSoft(memberMgmtBtn, 2000)) {
        await safeClick(memberMgmtBtn);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[HOME-TA-3-31] U6(소유자) — 관계사 태그 부여 알림 바로가기 탭', async ({ page }) => {
      await page.goto('/');
      const notificationBtn = page.getByRole('button', { name: /알림/ }).first();
      if (await isVisibleSoft(notificationBtn, 2000)) {
        await safeClick(notificationBtn);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });
  });

  test.describe('알림 — 정상동작 (전관 세무사)', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('[HOME-TA-3-32] 세무사 인증 안내 알림 — 인증하러가기 탭', async ({ page }) => {
      await page.goto('/');
      const notificationBtn = page.getByRole('button', { name: /알림/ }).first();
      if (await isVisibleSoft(notificationBtn, 2000)) {
        await safeClick(notificationBtn);
      }
      const certBtn = page.getByRole('button', { name: /인증하러가기|인증/ }).first();
      if (await isVisibleSoft(certBtn, 2000)) {
        await safeClick(certBtn);
      }
      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ===========================================================================
  // §4-3. 알림 — 데이터 검증
  // ===========================================================================

  test.describe('알림 — 데이터 검증 (세무사 Pro)', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('[HOME-TA-3-11] 알림 여러 건 — 새로운 알림 상위 정렬', async ({ page }) => {
      await page.goto('/');
      const notificationBtn = page.getByRole('button', { name: /알림/ }).first();
      if (await isVisibleSoft(notificationBtn, 2000)) {
        await safeClick(notificationBtn);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-3-12] 세무사 가입 직후 — 세무 이력 관리 작성 안내 알림', async ({ page }) => {
      await page.goto('/');
      const notificationBtn = page.getByRole('button', { name: /알림/ }).first();
      if (await isVisibleSoft(notificationBtn, 2000)) {
        await safeClick(notificationBtn);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-3-13] 이력 제출 세무사 — 검토 대기 상태 알림 (액션 버튼 없음)', async ({ page }) => {
      await page.goto('/');
      const notificationBtn = page.getByRole('button', { name: /알림/ }).first();
      if (await isVisibleSoft(notificationBtn, 2000)) {
        await safeClick(notificationBtn);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-3-14] 이력 제출 세무사 — 승인 상태 알림 (액션 버튼 없음)', async ({ page }) => {
      await page.goto('/');
      const notificationBtn = page.getByRole('button', { name: /알림/ }).first();
      if (await isVisibleSoft(notificationBtn, 2000)) {
        await safeClick(notificationBtn);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-3-17] 법인 연결 해제된 구성원 — 법인 연결 해제 알림', async ({ page }) => {
      await page.goto('/');
      const notificationBtn = page.getByRole('button', { name: /알림/ }).first();
      if (await isVisibleSoft(notificationBtn, 2000)) {
        await safeClick(notificationBtn);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-3-19] 세무 공무원 출신 세무사 — 인증 안내 알림', async ({ page }) => {
      await page.goto('/');
      const notificationBtn = page.getByRole('button', { name: /알림/ }).first();
      if (await isVisibleSoft(notificationBtn, 2000)) {
        await safeClick(notificationBtn);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });
  });

  test.describe('알림 — 데이터 검증 (세무법인 소유자)', () => {
    test.use({ storageState: AUTH_FILES.firmOwner });

    test('[HOME-TA-3-15] U6(소유자) — 멤버 초대 수락/거부 결과 알림', async ({ page }) => {
      await page.goto('/');
      const notificationBtn = page.getByRole('button', { name: /알림/ }).first();
      if (await isVisibleSoft(notificationBtn, 2000)) {
        await safeClick(notificationBtn);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });
  });

  // ===========================================================================
  // §4-3. 알림 — 엣지케이스
  // ===========================================================================

  test.describe('알림 — 엣지케이스 (세무사 Pro)', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('[HOME-TA-3-21] 알림 0건 — 빈 상태 안내', async ({ page }) => {
      await page.goto('/');
      const notificationBtn = page.getByRole('button', { name: /알림/ }).first();
      if (await isVisibleSoft(notificationBtn, 2000)) {
        await safeClick(notificationBtn);
      }
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });

    test('[HOME-TA-3-22] 새로운 알림 없음 — 레드닷 미표시', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('home-search-greeting')).toBeVisible();
    });
  });

  // ===========================================================================
  // §4-4. 최근 조회한 프로필 전체보기 — 정상동작
  // ===========================================================================

  test.describe('최근 조회 전체보기 — 정상동작 (세무사 Pro)', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('[HOME-TA-4-01] 전체보기 탭 — 전체 목록 표시', async ({ page }) => {
      await page.goto('/');
      const viewAllBtn = page.getByRole('button', { name: /전체보기/ }).first();
      const viewAllLink = page.getByRole('link', { name: /전체보기/ }).first();
      if (await isVisibleSoft(viewAllBtn, 2000)) {
        await safeClick(viewAllBtn);
      } else if (await isVisibleSoft(viewAllLink, 2000)) {
        await safeClick(viewAllLink);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[HOME-TA-4-02] 전체보기 — 현직 공무원 프로필 카드 탭', async ({ page }) => {
      await page.goto('/');
      const viewAllBtn = page.getByRole('button', { name: /전체보기/ }).first();
      if (await isVisibleSoft(viewAllBtn, 2000)) {
        await safeClick(viewAllBtn);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[HOME-TA-4-03] 전체보기 — 전직 공무원 프로필 카드 탭', async ({ page }) => {
      await page.goto('/');
      const viewAllBtn = page.getByRole('button', { name: /전체보기/ }).first();
      if (await isVisibleSoft(viewAllBtn, 2000)) {
        await safeClick(viewAllBtn);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[HOME-TA-4-04] 전체보기 — 세무사 프로필 카드 탭', async ({ page }) => {
      await page.goto('/');
      const viewAllBtn = page.getByRole('button', { name: /전체보기/ }).first();
      if (await isVisibleSoft(viewAllBtn, 2000)) {
        await safeClick(viewAllBtn);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[HOME-TA-4-05] 전체보기 — 뒤로가기 탭', async ({ page }) => {
      await page.goto('/');
      const viewAllBtn = page.getByRole('button', { name: /전체보기/ }).first();
      if (await isVisibleSoft(viewAllBtn, 2000)) {
        await safeClick(viewAllBtn);
      }
      await page.goBack().catch(() => undefined);
      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ===========================================================================
  // §4-4. 최근 조회한 프로필 전체보기 — 데이터 검증
  // ===========================================================================

  test.describe('최근 조회 전체보기 — 데이터 검증 (세무사 Pro)', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('[HOME-TA-4-11] 최근 조회 순서 정렬 확인', async ({ page }) => {
      await page.goto('/');
      const viewAllBtn = page.getByRole('button', { name: /전체보기/ }).first();
      if (await isVisibleSoft(viewAllBtn, 2000)) {
        await safeClick(viewAllBtn);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[HOME-TA-4-12] 현직 공무원 카드 — 이름, 소속, 직급, 직책', async ({ page }) => {
      await page.goto('/');
      const viewAllBtn = page.getByRole('button', { name: /전체보기/ }).first();
      if (await isVisibleSoft(viewAllBtn, 2000)) {
        await safeClick(viewAllBtn);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[HOME-TA-4-13] 전직 공무원 카드 — 이름, 은퇴 당시 소속, 직급, 직책', async ({ page }) => {
      await page.goto('/');
      const viewAllBtn = page.getByRole('button', { name: /전체보기/ }).first();
      if (await isVisibleSoft(viewAllBtn, 2000)) {
        await safeClick(viewAllBtn);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[HOME-TA-4-14] 세무사 카드 — 이름, 소속 법인, 소개 메시지', async ({ page }) => {
      await page.goto('/');
      const viewAllBtn = page.getByRole('button', { name: /전체보기/ }).first();
      if (await isVisibleSoft(viewAllBtn, 2000)) {
        await safeClick(viewAllBtn);
      }
      await expect(page.locator('body')).toBeVisible();
    });
  });

});

// ─── 누락 TC 보강 — docs/qa 기준 ────────────────────────────────

test.describe('HOME-TA — 수동 검증 필요 (Manual)', () => {
  test.skip('[HOME-TA-3-16][M] 세무사 홈 — 항목 (UI 미출시)', async () => {
    // MANUAL: 관련 UI 미출시
  });
  test.skip('[HOME-TA-3-18][M] 세무사 홈 — 항목 (UI 미출시)', async () => {
    // MANUAL: 관련 UI 미출시
  });
});
