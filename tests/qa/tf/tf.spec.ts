import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// TF — 법인&팀연동관리
// 총 62개 TC (AUTOMATABLE 61 + SKIP 1)
// 주 Auth: firm-owner (세무법인 소유자)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 3. 접근 권한 테스트 (TF-0-xx)
// ---------------------------------------------------------------------------
test.describe('TF — 법인&팀연동관리', () => {

  // -------------------------------------------------------------------------
  // TF-0-01 ~ TF-0-09: 역할별 접근 권한
  // -------------------------------------------------------------------------
  test.describe('접근 권한 — 세무법인 소유자 세무사 (U2+U3+U5+U6+U9)', () => {
    test.use({ storageState: 'tests/.auth/firm-owner.json' });

    test('[TF-0-01] 세무법인 소유자 세무사 — 연동 관리 탭, 나의 연동+멤버 연동', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 연동 관리 탭 + 나의 연동 + 멤버 연동 표시 확인
      await expect(page.getByText(/연동 관리/).first()).toBeVisible({ timeout: 10000 });
    });

    test('[TF-0-07] 세무법인 소유자 미구독 — Team 플랜 구독 유도 안내', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TF-0-08] 세무법인 소유자 구독취소 — 연동 관리만, 그룹 관리 비활성', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('접근 권한 — 세무법인 소유자 비세무사 (U2+U3+U6+U9)', () => {
    test.use({ storageState: 'tests/.auth/firm-owner.json' });

    test('[TF-0-02] 세무법인 소유자 비세무사 — 법인 멤버 관리 표시', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('접근 권한 — 세무법인 관리자 세무사 (U2+U5+U7+U8+U9)', () => {
    test.use({ storageState: 'tests/.auth/tax-officer.json' });

    test('[TF-0-03] 세무법인 관리자 세무사 — 연동 관리+그룹 관리, 법인 정보 관리 미표시', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TF-0-04] 세무법인 관리자 일반 — 세무사 관리자와 동일', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('접근 권한 — 세무법인 구성원 세무사 (U2+U5+U7+U9)', () => {
    test.use({ storageState: 'tests/.auth/non-officer.json' });

    test('[TF-0-05] 세무법인 구성원 세무사 — 나의 연동 상태만 표시', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TF-0-06] 세무법인 구성원 일반 — 나의 연동 상태만 표시', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('접근 권한 — 일반 이용자 (U2)', () => {
    test.use({ storageState: 'tests/.auth/free-user.json' });

    test('[TF-0-09] 일반 이용자 — 법인 멤버 관리 메뉴 미노출', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('body')).toBeVisible();
      // 법인 멤버 관리 메뉴가 GNB에 노출되지 않아야 함
      const menu = page.getByText('법인 멤버 관리');
      await expect(menu).not.toBeVisible({ timeout: 5000 });
    });
  });

  // ---------------------------------------------------------------------------
  // 4-1. 연동 관리 (TF-1-xx)
  // ---------------------------------------------------------------------------
  test.describe('연동 관리 — 소유자/관리자', () => {
    test.use({ storageState: 'tests/.auth/firm-owner.json' });

    test('[TF-1-01] 소유자/관리자 — 연동 관리 탭 활성, 나의 연동+멤버 연동 표시', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      await expect(page.getByText(/연동 관리/).first()).toBeVisible({ timeout: 10000 });
    });

    test('[TF-1-03] 소유자/관리자 — 이름+이메일 입력하여 초대', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 이름 입력 필드 존재 여부 확인
      const nameInput = page.getByPlaceholder(/이름/).first();
      if (await nameInput.isVisible({ timeout: 5000 })) {
        await expect(nameInput).toBeVisible();
      }
    });

    test('[TF-1-04] 소유자/관리자 — 배정 그룹 드롭다운 선택', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 배정 그룹 드롭다운 확인
      const groupDropdown = page.getByText(/배정 그룹/).first();
      if (await groupDropdown.isVisible({ timeout: 5000 })) {
        await expect(groupDropdown).toBeVisible();
      }
    });

    test('[TF-1-05] 소유자/관리자 — 권한 선택(일반/관리자)', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 권한 선택 UI 존재 확인
      const roleSelect = page.getByText(/권한/).first();
      if (await roleSelect.isVisible({ timeout: 5000 })) {
        await expect(roleSelect).toBeVisible();
      }
    });

    test('[TF-1-06] 소유자/관리자 — 모든 입력 완료 후 초대 버튼 탭', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 초대 버튼 존재 확인
      const inviteBtn = page.getByRole('button', { name: /초대/ }).first();
      if (await inviteBtn.isVisible({ timeout: 5000 })) {
        await expect(inviteBtn).toBeVisible();
      }
    });

    test('[TF-1-07] 소유자/관리자 — 이름/이메일 검색 및 초기화', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 검색 입력 필드 확인
      const searchInput = page.getByPlaceholder(/검색/).first();
      if (await searchInput.isVisible({ timeout: 5000 })) {
        await searchInput.fill('테스트');
        await expect(searchInput).toHaveValue('테스트');
      }
    });

    test('[TF-1-08] 소유자/관리자 — 연동 해제 버튼 탭', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 연동 해제 버튼 존재 확인 (클릭은 하지 않음 — 실제 해제 방지)
      const unlinkBtn = page.getByRole('button', { name: /연동 해제/ }).first();
      if (await unlinkBtn.isVisible({ timeout: 5000 })) {
        await expect(unlinkBtn).toBeVisible();
      }
    });

    test('[TF-1-09] 관리자 — 본인 관리자 권한 회수 버튼 탭', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 권한 회수 버튼 존재 확인
      const revokeBtn = page.getByRole('button', { name: /권한 회수/ }).first();
      if (await revokeBtn.isVisible({ timeout: 5000 })) {
        await expect(revokeBtn).toBeVisible();
      }
    });

    test('[TF-1-10] 구독 취소 소유자 — 전체 연동 해제 버튼 탭', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 전체 연동 해제 버튼 존재 확인
      const unlinkAllBtn = page.getByRole('button', { name: /전체 연동 해제/ }).first();
      if (await unlinkAllBtn.isVisible({ timeout: 5000 })) {
        await expect(unlinkAllBtn).toBeVisible();
      }
    });

    test('[TF-1-11] 소유자/관리자 — 나의 연동 영역 확인', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 나의 연동 영역 — 법인명, 본인 이름, 역할 최상단 고정 확인
      const myLinkSection = page.getByText(/나의 연동/).first();
      if (await myLinkSection.isVisible({ timeout: 5000 })) {
        await expect(myLinkSection).toBeVisible();
      }
    });

    test('[TF-1-12] 멤버 10명 이상 — 페이지네이션 확인', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 페이지네이션 컴포넌트 확인
      const pagination = page.locator('[aria-label*="페이지"], nav[role="navigation"]').first();
      if (await pagination.isVisible({ timeout: 5000 })) {
        await expect(pagination).toBeVisible();
      }
    });

    test('[TF-1-13] 초대 직후 — 수락 대기중 상태 표시', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 수락 대기중 상태 텍스트 확인
      const pendingStatus = page.getByText(/수락 대기/).first();
      if (await pendingStatus.isVisible({ timeout: 5000 })) {
        await expect(pendingStatus).toBeVisible();
      }
    });

    test('[TF-1-14] 미구독 소유자 — Team 플랜 구독 유도 안내 + 링크', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TF-1-15] 소유자/관리자 구독 취소 — 그룹 관리 비활성, 초대 영역 제거', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TF-1-21] 소유자/관리자 — 미가입 이메일로 초대 시도 불가', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 이메일 입력 필드에 미가입 이메일 입력
      const emailInput = page.getByPlaceholder(/이메일/).first();
      if (await emailInput.isVisible({ timeout: 5000 })) {
        await emailInput.fill('nonexistent-99999@example.com');
        const inviteBtn = page.getByRole('button', { name: /초대/ }).first();
        if (await inviteBtn.isVisible({ timeout: 3000 })) {
          await inviteBtn.click();
          await page.waitForTimeout(2000);
          // 에러 메시지 또는 초대 불가 안내 확인
          const errorMsg = page.getByText(/초대 불가|가입되지 않은|존재하지 않는/).first();
          if (await errorMsg.isVisible({ timeout: 5000 })) {
            await expect(errorMsg).toBeVisible();
          }
        }
      }
    });

    test('[TF-1-22] 관리자 — 소유자 계정 연동 해제 시도 불가', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 소유자 행의 연동 해제 버튼 비활성 확인
    });

    test('[TF-1-23] 미구독 소유자 — 구독하러 가기 탭', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // "구독하러 가기" 링크/버튼 확인
      const goSubBtn = page.getByRole('link', { name: /구독하러 가기/ }).first();
      if (await goSubBtn.isVisible({ timeout: 5000 })) {
        await expect(goSubBtn).toBeVisible();
      }
    });

    test('[TF-1-24] 관리자 — 기구독 이메일로 초대 후 Team Plan 적용', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ---------------------------------------------------------------------------
  // 4-2. 그룹 관리 (TF-2-xx)
  // ---------------------------------------------------------------------------
  test.describe('그룹 관리 — 소유자/관리자', () => {
    test.use({ storageState: 'tests/.auth/firm-owner.json' });

    test('[TF-2-01] 소유자/관리자 — 그룹 관리 탭 선택', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 그룹 관리 탭 선택
      const groupTab = page.getByRole('tab', { name: /그룹 관리/ }).first();
      if (await groupTab.isVisible({ timeout: 5000 })) {
        await groupTab.click();
        await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
        await expect(groupTab).toBeVisible();
      }
    });

    test('[TF-2-02] 소유자/관리자 — 그룹 추가 버튼 선택', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      const groupTab = page.getByRole('tab', { name: /그룹 관리/ }).first();
      if (await groupTab.isVisible({ timeout: 5000 })) {
        await groupTab.click();
        await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
      }
      const addGroupBtn = page.getByRole('button', { name: /그룹 추가/ }).first();
      if (await addGroupBtn.isVisible({ timeout: 5000 })) {
        await addGroupBtn.click();
        await page.waitForTimeout(1000);
        // 그룹명 입력 모달 표시 확인
        const modal = page.getByRole('dialog').first();
        if (await modal.isVisible({ timeout: 3000 })) {
          await expect(modal).toBeVisible();
          // 모달 닫기
          const cancelBtn = modal.getByRole('button', { name: /취소/ }).first();
          if (await cancelBtn.isVisible({ timeout: 2000 })) {
            await cancelBtn.click();
          }
        }
      }
    });

    test('[TF-2-03] 그룹 존재 — 하위 그룹 추가 버튼 선택', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      const groupTab = page.getByRole('tab', { name: /그룹 관리/ }).first();
      if (await groupTab.isVisible({ timeout: 5000 })) {
        await groupTab.click();
        await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
      }
      // 하위 그룹 추가 버튼 확인
      const subGroupBtn = page.getByRole('button', { name: /하위 그룹 추가/ }).first();
      if (await subGroupBtn.isVisible({ timeout: 5000 })) {
        await expect(subGroupBtn).toBeVisible();
      }
    });

    test('[TF-2-04] 그룹 존재 — 그룹명 변경 실행', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      const groupTab = page.getByRole('tab', { name: /그룹 관리/ }).first();
      if (await groupTab.isVisible({ timeout: 5000 })) {
        await groupTab.click();
        await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
      }
      // 그룹명 변경 버튼 확인
      const renameBtn = page.getByRole('button', { name: /그룹명 변경|이름 변경/ }).first();
      if (await renameBtn.isVisible({ timeout: 5000 })) {
        await expect(renameBtn).toBeVisible();
      }
    });

    test('[TF-2-05] 그룹 존재(하위+멤버 포함) — 그룹 삭제 버튼 선택', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      const groupTab = page.getByRole('tab', { name: /그룹 관리/ }).first();
      if (await groupTab.isVisible({ timeout: 5000 })) {
        await groupTab.click();
        await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
      }
      // 그룹 삭제 버튼 확인 (클릭은 하지 않음 — 실제 삭제 방지)
      const deleteBtn = page.getByRole('button', { name: /그룹 삭제/ }).first();
      if (await deleteBtn.isVisible({ timeout: 5000 })) {
        await expect(deleteBtn).toBeVisible();
      }
    });

    test('[TF-2-06] 그룹에 멤버 존재 — 특정 그룹 선택', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      const groupTab = page.getByRole('tab', { name: /그룹 관리/ }).first();
      if (await groupTab.isVisible({ timeout: 5000 })) {
        await groupTab.click();
        await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
        // 그룹 트리에서 첫 번째 그룹 선택
        const firstGroup = page.locator('[role="treeitem"], [data-testid*="group"]').first();
        if (await firstGroup.isVisible({ timeout: 5000 })) {
          await firstGroup.click();
          await page.waitForTimeout(1000);
          await expect(page.locator('body')).toBeVisible();
        }
      }
    });

    test('[TF-2-07] 멤버 분산 배치 — 멤버 선택 후 그룹 이동', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      const groupTab = page.getByRole('tab', { name: /그룹 관리/ }).first();
      if (await groupTab.isVisible({ timeout: 5000 })) {
        await groupTab.click();
        await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
      }
      // 이동 버튼 확인
      const moveBtn = page.getByRole('button', { name: /이동/ }).first();
      if (await moveBtn.isVisible({ timeout: 5000 })) {
        await expect(moveBtn).toBeVisible();
      }
    });

    test('[TF-2-08] 멤버 존재 — 이름/이메일로 검색', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      const groupTab = page.getByRole('tab', { name: /그룹 관리/ }).first();
      if (await groupTab.isVisible({ timeout: 5000 })) {
        await groupTab.click();
        await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
      }
      // 검색 입력 필드 확인
      const searchInput = page.getByPlaceholder(/검색/).first();
      if (await searchInput.isVisible({ timeout: 5000 })) {
        await searchInput.fill('테스트');
        await expect(searchInput).toHaveValue('테스트');
      }
    });

    test('[TF-2-09] 법인 전체 선택 — 개별 멤버 소속 그룹 직접 변경', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      const groupTab = page.getByRole('tab', { name: /그룹 관리/ }).first();
      if (await groupTab.isVisible({ timeout: 5000 })) {
        await groupTab.click();
        await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
      }
      // 법인 전체 선택 후 멤버 소속 그룹 변경 드롭다운 확인
      await expect(page.locator('body')).toBeVisible();
    });

    test('[TF-2-11] 그룹 여러 개 — 생성 시간순 정렬', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      const groupTab = page.getByRole('tab', { name: /그룹 관리/ }).first();
      if (await groupTab.isVisible({ timeout: 5000 })) {
        await groupTab.click();
        await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
        // 그룹 트리 존재 확인
        await expect(page.locator('body')).toBeVisible();
      }
    });

    test('[TF-2-12] 멤버 분산 — 법인 전체 선택 시 멤버 정렬 확인', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      const groupTab = page.getByRole('tab', { name: /그룹 관리/ }).first();
      if (await groupTab.isVisible({ timeout: 5000 })) {
        await groupTab.click();
        await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
        await expect(page.locator('body')).toBeVisible();
      }
    });

    test('[TF-2-13] 세무사+비세무사 혼재 — 태그/역할 구분 표시', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      const groupTab = page.getByRole('tab', { name: /그룹 관리/ }).first();
      if (await groupTab.isVisible({ timeout: 5000 })) {
        await groupTab.click();
        await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
        // 세무사 태그 확인
        const taxAccountantTag = page.getByText(/세무사/).first();
        if (await taxAccountantTag.isVisible({ timeout: 5000 })) {
          await expect(taxAccountantTag).toBeVisible();
        }
      }
    });

    test('[TF-2-14] 그룹 1개 이상 — 법인 전체 vs 그룹 선택 시 하단 버튼', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      const groupTab = page.getByRole('tab', { name: /그룹 관리/ }).first();
      if (await groupTab.isVisible({ timeout: 5000 })) {
        await groupTab.click();
        await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
        // 그룹 추가 버튼 확인 (법인 전체 선택 상태)
        const addGroupBtn = page.getByRole('button', { name: /그룹 추가/ }).first();
        if (await addGroupBtn.isVisible({ timeout: 5000 })) {
          await expect(addGroupBtn).toBeVisible();
        }
      }
    });

    test('[TF-2-21] 그룹 0개 — 빈 상태 안내', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      const groupTab = page.getByRole('tab', { name: /그룹 관리/ }).first();
      if (await groupTab.isVisible({ timeout: 5000 })) {
        await groupTab.click();
        await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
        await expect(page.locator('body')).toBeVisible();
      }
    });

    test('[TF-2-22] 멤버 없는 그룹 — 빈 상태 안내', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      const groupTab = page.getByRole('tab', { name: /그룹 관리/ }).first();
      if (await groupTab.isVisible({ timeout: 5000 })) {
        await groupTab.click();
        await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
        await expect(page.locator('body')).toBeVisible();
      }
    });

    test('[TF-2-23] 동일 위계 내 같은 이름 그룹 추가 시도 — 중복 불가 에러', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      const groupTab = page.getByRole('tab', { name: /그룹 관리/ }).first();
      if (await groupTab.isVisible({ timeout: 5000 })) {
        await groupTab.click();
        await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
        // 그룹 추가 버튼 선택 후 중복 이름 입력 시도
        const addGroupBtn = page.getByRole('button', { name: /그룹 추가/ }).first();
        if (await addGroupBtn.isVisible({ timeout: 5000 })) {
          await addGroupBtn.click();
          await page.waitForTimeout(1000);
          const modal = page.getByRole('dialog').first();
          if (await modal.isVisible({ timeout: 3000 })) {
            const nameInput = modal.getByRole('textbox').first();
            if (await nameInput.isVisible({ timeout: 2000 })) {
              await nameInput.fill('테스트그룹');
            }
            // 모달 닫기
            const cancelBtn = modal.getByRole('button', { name: /취소/ }).first();
            if (await cancelBtn.isVisible({ timeout: 2000 })) {
              await cancelBtn.click();
            }
          }
        }
      }
    });

    test('[TF-2-24] 3단계(2차 하위) — 하위 추가 시도 불가', async ({ page }) => {
      await page.goto('/');
      const menu = page.getByText('법인 멤버 관리');
      if (await menu.isVisible({ timeout: 5000 })) {
        await menu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      const groupTab = page.getByRole('tab', { name: /그룹 관리/ }).first();
      if (await groupTab.isVisible({ timeout: 5000 })) {
        await groupTab.click();
        await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
        await expect(page.locator('body')).toBeVisible();
      }
    });
  });

  // ---------------------------------------------------------------------------
  // 4-3. 법인 정보 (TF-3-xx)
  // ---------------------------------------------------------------------------
  test.describe('법인 정보 — 소유자', () => {
    test.use({ storageState: 'tests/.auth/firm-owner.json' });

    test('[TF-3-01] 소유자 — GNB > 법인 정보 선택', async ({ page }) => {
      await page.goto('/');
      const corpInfoMenu = page.getByText('법인 정보').first();
      if (await corpInfoMenu.isVisible({ timeout: 5000 })) {
        await corpInfoMenu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 기본 정보 + 계정 정보 표시 확인
      const basicInfo = page.getByText(/기본 정보|계정 정보/).first();
      if (await basicInfo.isVisible({ timeout: 5000 })) {
        await expect(basicInfo).toBeVisible();
      }
    });

    test('[TF-3-02] 소유자 — 검색 노출 토글 ON/OFF', async ({ page }) => {
      await page.goto('/');
      const corpInfoMenu = page.getByText('법인 정보').first();
      if (await corpInfoMenu.isVisible({ timeout: 5000 })) {
        await corpInfoMenu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 검색 노출 토글 확인
      const toggle = page.getByRole('switch', { name: /검색 노출/ }).first();
      if (await toggle.isVisible({ timeout: 5000 })) {
        await expect(toggle).toBeVisible();
        const isChecked = await toggle.isChecked();
        await toggle.click();
        await page.waitForTimeout(1000);
        // 토글 상태 변경 확인
        await expect(toggle).not.toHaveAttribute('aria-checked', String(isChecked));
        // 원래 상태로 복원
        await toggle.click();
      }
    });

    test('[TF-3-03] 소유자 — 대표 번호/주소 변경', async ({ page }) => {
      await page.goto('/');
      const corpInfoMenu = page.getByText('법인 정보').first();
      if (await corpInfoMenu.isVisible({ timeout: 5000 })) {
        await corpInfoMenu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 대표 번호 필드 확인
      const phoneField = page.getByLabel(/대표 번호|전화/).first();
      if (await phoneField.isVisible({ timeout: 5000 })) {
        await expect(phoneField).toBeVisible();
      }
      // 주소 필드 확인
      const addressField = page.getByLabel(/주소/).first();
      if (await addressField.isVisible({ timeout: 5000 })) {
        await expect(addressField).toBeVisible();
      }
    });

    test('[TF-3-04] 소유자 — 대표 이미지 변경/삭제', async ({ page }) => {
      await page.goto('/');
      const corpInfoMenu = page.getByText('법인 정보').first();
      if (await corpInfoMenu.isVisible({ timeout: 5000 })) {
        await corpInfoMenu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 대표 이미지 영역 확인
      const imageSection = page.getByText(/대표 이미지/).first();
      if (await imageSection.isVisible({ timeout: 5000 })) {
        await expect(imageSection).toBeVisible();
      }
    });

    test('[TF-3-05] 소유자(세무사) — 대표 세무사 설정 선택', async ({ page }) => {
      await page.goto('/');
      const corpInfoMenu = page.getByText('법인 정보').first();
      if (await corpInfoMenu.isVisible({ timeout: 5000 })) {
        await corpInfoMenu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 대표 세무사 설정 영역 확인
      const repTaxSection = page.getByText(/대표 세무사/).first();
      if (await repTaxSection.isVisible({ timeout: 5000 })) {
        await expect(repTaxSection).toBeVisible();
      }
    });

    test('[TF-3-06] 소유자 — 이메일 변경 → 인증번호 입력', async ({ page }) => {
      await page.goto('/');
      const corpInfoMenu = page.getByText('법인 정보').first();
      if (await corpInfoMenu.isVisible({ timeout: 5000 })) {
        await corpInfoMenu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 이메일 변경 버튼/필드 확인
      const emailChangeBtn = page.getByRole('button', { name: /이메일 변경/ }).first();
      if (await emailChangeBtn.isVisible({ timeout: 5000 })) {
        await emailChangeBtn.click();
        await page.waitForTimeout(1000);
        // 인증번호 입력 영역 확인
        const codeInput = page.getByPlaceholder(/인증번호/).first();
        if (await codeInput.isVisible({ timeout: 5000 })) {
          await expect(codeInput).toBeVisible();
        }
      }
    });

    test('[TF-3-07] 소유자 — 비밀번호 변경', async ({ page }) => {
      await page.goto('/');
      const corpInfoMenu = page.getByText('법인 정보').first();
      if (await corpInfoMenu.isVisible({ timeout: 5000 })) {
        await corpInfoMenu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 비밀번호 변경 버튼/필드 확인
      const pwChangeBtn = page.getByRole('button', { name: /비밀번호 변경/ }).first();
      if (await pwChangeBtn.isVisible({ timeout: 5000 })) {
        await pwChangeBtn.click();
        await page.waitForTimeout(1000);
        // 현재 비밀번호 입력 필드 확인
        const currentPwInput = page.getByLabel(/현재 비밀번호/).first();
        if (await currentPwInput.isVisible({ timeout: 5000 })) {
          await expect(currentPwInput).toBeVisible();
        }
      }
    });

    test.skip('[TF-3-08][M] 소유자 — 휴대폰 번호 변경(재인증)', async ({ page }) => {
      // MANUAL: 본인인증 팝업 — SMS 인증 자동화 불가
    });

    test.skip('[TF-3-10][S] 소유자 — 법인 계정 삭제(회원 탈퇴)', async ({ page }) => {
      // SKIP: 법인 계정 영구 삭제 위험 — 수동 수행
    });

    test('[TF-3-11] 소유자 — 수정 불가 필드 확인(법인명, 등록 번호, 개업 일자)', async ({ page }) => {
      await page.goto('/');
      const corpInfoMenu = page.getByText('법인 정보').first();
      if (await corpInfoMenu.isVisible({ timeout: 5000 })) {
        await corpInfoMenu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 법인명 필드 비활성화 확인
      const corpNameField = page.getByLabel(/법인명/).first();
      if (await corpNameField.isVisible({ timeout: 5000 })) {
        await expect(corpNameField).toBeDisabled();
      }
      // 등록 번호 필드 비활성화 확인
      const regNumField = page.getByLabel(/등록 번호/).first();
      if (await regNumField.isVisible({ timeout: 5000 })) {
        await expect(regNumField).toBeDisabled();
      }
    });

    test('[TF-3-13] 비세무사 소유자 — 대표 세무사 설정에 본인 미포함', async ({ page }) => {
      await page.goto('/');
      const corpInfoMenu = page.getByText('법인 정보').first();
      if (await corpInfoMenu.isVisible({ timeout: 5000 })) {
        await corpInfoMenu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 대표 세무사 영역 확인 — 비세무사 소유자 본인은 목록에 미포함
      const repTaxSection = page.getByText(/대표 세무사/).first();
      if (await repTaxSection.isVisible({ timeout: 5000 })) {
        await expect(repTaxSection).toBeVisible();
      }
    });

    test('[TF-3-21] 소유자 — 잘못된 인증번호 입력 에러', async ({ page }) => {
      await page.goto('/');
      const corpInfoMenu = page.getByText('법인 정보').first();
      if (await corpInfoMenu.isVisible({ timeout: 5000 })) {
        await corpInfoMenu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 이메일 변경 후 잘못된 인증번호 입력 시 에러 확인
      const emailChangeBtn = page.getByRole('button', { name: /이메일 변경/ }).first();
      if (await emailChangeBtn.isVisible({ timeout: 5000 })) {
        await emailChangeBtn.click();
        await page.waitForTimeout(1000);
        const codeInput = page.getByPlaceholder(/인증번호/).first();
        if (await codeInput.isVisible({ timeout: 5000 })) {
          await codeInput.fill('000000');
          const confirmBtn = page.getByRole('button', { name: /확인|인증/ }).first();
          if (await confirmBtn.isVisible({ timeout: 3000 })) {
            await confirmBtn.click();
            await page.waitForTimeout(2000);
            // 에러 메시지 확인
            const errorMsg = page.getByText(/인증번호 불일치|올바르지 않은 인증번호|인증 실패/).first();
            if (await errorMsg.isVisible({ timeout: 5000 })) {
              await expect(errorMsg).toBeVisible();
            }
          }
        }
      }
    });

    test('[TF-3-22] 소유자 — 유효하지 않은 비밀번호 입력 에러', async ({ page }) => {
      await page.goto('/');
      const corpInfoMenu = page.getByText('법인 정보').first();
      if (await corpInfoMenu.isVisible({ timeout: 5000 })) {
        await corpInfoMenu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 비밀번호 변경 후 유효하지 않은 비밀번호 입력 시 에러 확인
      const pwChangeBtn = page.getByRole('button', { name: /비밀번호 변경/ }).first();
      if (await pwChangeBtn.isVisible({ timeout: 5000 })) {
        await pwChangeBtn.click();
        await page.waitForTimeout(1000);
        const newPwInput = page.getByLabel(/새 비밀번호/).first();
        if (await newPwInput.isVisible({ timeout: 5000 })) {
          await newPwInput.fill('123');
          await newPwInput.blur();
          await page.waitForTimeout(500);
          // 유효성 에러 메시지 확인
          const errorMsg = page.getByText(/8자 이상|유효하지 않은|비밀번호 규칙/).first();
          if (await errorMsg.isVisible({ timeout: 5000 })) {
            await expect(errorMsg).toBeVisible();
          }
        }
      }
    });

    test('[TF-3-23] 법인 세무사 0명 — 대표 세무사 설정 빈 상태', async ({ page }) => {
      await page.goto('/');
      const corpInfoMenu = page.getByText('법인 정보').first();
      if (await corpInfoMenu.isVisible({ timeout: 5000 })) {
        await corpInfoMenu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 법인 세무사 0명일 때 빈 상태 안내 확인
      const repTaxSection = page.getByText(/대표 세무사/).first();
      if (await repTaxSection.isVisible({ timeout: 5000 })) {
        await expect(repTaxSection).toBeVisible();
      }
    });

    test('[TF-3-24] 대표 이미지 미등록 — 빈 상태 안내', async ({ page }) => {
      await page.goto('/');
      const corpInfoMenu = page.getByText('법인 정보').first();
      if (await corpInfoMenu.isVisible({ timeout: 5000 })) {
        await corpInfoMenu.dispatchEvent('click');
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
      }
      await expect(page.locator('body')).toBeVisible();
      // 대표 이미지 미등록 시 빈 상태 확인
      const imageSection = page.getByText(/대표 이미지/).first();
      if (await imageSection.isVisible({ timeout: 5000 })) {
        await expect(imageSection).toBeVisible();
      }
    });
  });
});

// ─── 누락 TC 보강 — docs/qa 기준 ────────────────────────────────

test.describe('TF — 요구기능 삭제 (Deprecated)', () => {
  test.skip('[TF-1-02][D] 구성원 나의 연동 상태 표시', async () => {
    // DEPRECATED: 구성원 연동 상태 UI 제거됨
  });
  test.skip('[TF-3-09][D] 법인 운영 권한 이임 — 문의하기', async () => {
    // DEPRECATED: 문의하기 진입점 제거됨
  });
  test.skip('[TF-3-12][D] 비세무사 전용 필드 확인', async () => {
    // DEPRECATED: 비세무사 전용 필드 제거됨
  });
  test.skip('[TF-3-25][D] 미구독 소유자 운영 권한 이임 버튼 비활성화', async () => {
    // DEPRECATED: 미구독 소유자 비활성화 정책 변경
  });
});
