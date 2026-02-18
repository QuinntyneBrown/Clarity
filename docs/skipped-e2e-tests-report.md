# Skipped E2E Playwright Tests Report

> Generated: 2026-02-18

## 1. Conditional Skips via `test.skip()` — Desktop/Mobile Toggle

These tests use `test.skip(testInfo.project.name === '...', reason)` to run only on the appropriate viewport:

| File | Test Suite | Skipped When | Reason |
|------|-----------|-------------|--------|
| `e2e/tests/responsive-layout.spec.ts:7` | Responsive Layout - Desktop | Mobile project | `'Desktop only'` |
| `e2e/tests/responsive-layout.spec.ts:70` | Responsive Layout - Mobile | Desktop project | `'Mobile only'` |
| `e2e/tests/settings.spec.ts:6` | Settings Page - Desktop | Mobile project | `'Desktop only'` |
| `e2e/tests/settings.spec.ts:200` | Settings Page - Mobile | Desktop project | `'Mobile only'` |
| `e2e/tests/profile.spec.ts:7` | Profile Page - Desktop | Mobile project | `'Desktop only'` |
| `e2e/tests/profile.spec.ts:156` | Profile Page - Mobile | Desktop project | `'Mobile only'` |
| `e2e/tests/login.spec.ts:145` | Login - Desktop Layout | Mobile project | `'Desktop only'` |
| `e2e/tests/login.spec.ts:165` | Login - Mobile Layout | Desktop project | `'Mobile only'` |

**Why:** These suites contain viewport-specific assertions (e.g., sidebar visibility, hamburger menu). Running them on the wrong viewport would produce false failures, so each suite skips itself on the non-matching project.

## 2. Conditional Skip via Environment Variable

| File | Test Suite | Skipped When | Reason |
|------|-----------|-------------|--------|
| `e2e/tests/smoke-azure.spec.ts:7` | Azure Smoke Test (entire suite) | `AZURE_API_URL` or `AZURE_APP_URL` not set | `'Set AZURE_API_URL and AZURE_APP_URL env vars to run'` |

**Why:** Azure smoke tests target a deployed Azure environment. They are skipped in local/CI runs where the Azure URLs are not configured, preventing failures against a non-existent deployment.

## 3. Implicit Skips via Playwright Config `testMatch` Restrictions

`playwright.config.ts` — The `mobile` project restricts `testMatch` to only 4 files:
- `login.spec.ts`
- `responsive-layout.spec.ts`
- `profile.spec.ts`
- `settings.spec.ts`

The following test files are **never run on mobile**:

| File | Why Excluded from Mobile |
|------|------------------------|
| `e2e/tests/create-ticket.spec.ts` | Not in mobile `testMatch` — desktop-centric workflow |
| `e2e/tests/ticket-creation.spec.ts` | Not in mobile `testMatch` — desktop workflow |
| `e2e/tests/ticket-drag-drop.spec.ts` | Not in mobile `testMatch` — drag-and-drop not supported on mobile |
| `e2e/tests/kanban-board.spec.ts` | Not in mobile `testMatch` — board interactions are desktop-focused |
| `e2e/tests/update-ticket.spec.ts` | Not in mobile `testMatch` — desktop workflow |
| `e2e/tests/smoke-local.spec.ts` | Not in mobile `testMatch` — smoke test only needs one viewport |
| `e2e/tests/smoke-azure.spec.ts` | Not in mobile `testMatch` — smoke test only needs one viewport |

## 4. Implicit Skip — All Admin Tests on Mobile

`playwright-admin.config.ts` only defines a `desktop` project (no mobile project exists). All 10 admin test files are skipped on mobile:

| File | Why Skipped on Mobile |
|------|----------------------|
| `e2e-admin/tests/admin-login.spec.ts` | No mobile project in admin config |
| `e2e-admin/tests/boards.spec.ts` | No mobile project in admin config |
| `e2e-admin/tests/comments.spec.ts` | No mobile project in admin config |
| `e2e-admin/tests/dashboard.spec.ts` | No mobile project in admin config |
| `e2e-admin/tests/digital-assets.spec.ts` | No mobile project in admin config |
| `e2e-admin/tests/navigation.spec.ts` | No mobile project in admin config |
| `e2e-admin/tests/roles.spec.ts` | No mobile project in admin config |
| `e2e-admin/tests/team-members.spec.ts` | No mobile project in admin config |
| `e2e-admin/tests/tickets.spec.ts` | No mobile project in admin config |
| `e2e-admin/tests/users.spec.ts` | No mobile project in admin config |

**Why:** The admin panel is a desktop-only experience — no mobile-responsive admin layout exists, so there is no mobile project to test against.

## Summary

| Skip Category | Count | Mechanism |
|--------------|-------|-----------|
| Desktop/Mobile viewport toggle | 8 test suites | `test.skip()` with `testInfo.project.name` |
| Missing environment variables | 1 test suite | `test.skip()` with env var check |
| Config `testMatch` restriction (mobile) | 7 test files | `playwright.config.ts` mobile project filter |
| No mobile project in admin config | 10 test files | `playwright-admin.config.ts` desktop-only |

No commented-out tests, `test.fixme()`, or `TODO`/`FIXME` skip annotations were found.
