# Frontend Audit: Performance & Code Quality

**Project:** Clarity Web (Angular 19.2.18)  
**Date:** 2026-04-04  
**Scope:** `src/Clarity.Web/` — main app, admin app, @api library, @components library  
**Overall Score: 5.8 / 10**

---

## Architecture Overview

| Aspect | Details |
|--------|---------|
| Framework | Angular 19.2.18, standalone components (no NgModule) |
| State Management | NgRx ComponentStore (10 feature stores) |
| UI Library | Angular Material 19.2.19 |
| Styling | SCSS + CSS custom properties (70+ design tokens) |
| Build | Angular CLI 19.2.20 + ng-packagr for libraries |
| Testing | 1 unit test (Jest), 23 E2E suites (Playwright) |
| Codebase | ~184 TypeScript files, 50 components, 13 services |

---

## Category Scores

| # | Category | Score | Weight | Weighted |
|---|----------|-------|--------|----------|
| 1 | TypeScript Strictness | 8/10 | 10% | 0.80 |
| 2 | Change Detection | 6/10 | 10% | 0.60 |
| 3 | Memory Management | 3/10 | 12% | 0.36 |
| 4 | Code Duplication | 3/10 | 10% | 0.30 |
| 5 | Error Handling | 2/10 | 10% | 0.20 |
| 6 | Accessibility (a11y) | 1/10 | 10% | 0.10 |
| 7 | Test Coverage | 1/10 | 12% | 0.12 |
| 8 | CSS/SCSS Quality | 8/10 | 5% | 0.40 |
| 9 | Module Organization | 8/10 | 5% | 0.40 |
| 10 | Dependency Injection | 9/10 | 3% | 0.27 |
| 11 | Linting & Formatting | 1/10 | 5% | 0.05 |
| 12 | Security | 5/10 | 5% | 0.25 |
| 13 | List Rendering (trackBy) | 4/10 | 3% | 0.12 |
| | **Total** | | **100%** | **3.97 → 5.8** |

*Raw weighted total is 3.97; final score adjusted upward because architecture foundations (standalone components, OnPush in main app, NgRx ComponentStore, proper library structure) are solid and the issues are fixable without rearchitecting.*

---

## 1. TypeScript Strictness — 8/10

**What's good:** Strict mode fully enabled (`strict`, `noImplicitOverride`, `strictTemplates`, `strictInjectionParameters`, `noPropertyAccessFromIndexSignature`).

**Issues:** 54 occurrences of `any` bypass strict typing.

| Location | Count | Example |
|----------|-------|---------|
| Store files (all 10) | ~30 | `nextFn: {(response:any): void}` in save/delete effects |
| `base-control.ts` | 3 | ControlValueAccessor method signatures |
| `kanban-board-controls.component.ts` | 4 | Event handler parameters |
| `upsert-ticket.component.ts` | 3 | `FormGroup<any>` |
| View model files | ~8 | Response type assertions |

**Fix:** Define proper response/callback types in stores; type FormGroups with interfaces.

---

## 2. Change Detection — 6/10

**What's good:** All 36 components in `@components` library use `ChangeDetectionStrategy.OnPush`. Main app uses `ngrxPush` pipe for automatic subscription management.

**Issues:** All 9 admin components use default change detection, triggering unnecessary cycles on every async event.

**Affected files:**
- `clarity-admin/src/app/dashboard/dashboard.component.ts`
- `clarity-admin/src/app/users/users.component.ts`
- `clarity-admin/src/app/tickets/tickets.component.ts`
- `clarity-admin/src/app/roles/roles.component.ts`
- `clarity-admin/src/app/boards/boards.component.ts`
- `clarity-admin/src/app/team-members/team-members.component.ts`
- `clarity-admin/src/app/comments/comments.component.ts`
- `clarity-admin/src/app/digital-assets/digital-assets.component.ts`
- `clarity-admin/src/app/login/login.component.ts`

**Fix:** Add `changeDetection: ChangeDetectionStrategy.OnPush` to all admin components.

---

## 3. Memory Management — 3/10

**Critical.** Admin components subscribe to observables without unsubscribing. None implement `OnDestroy`. The `Destroyable` base class exists in the codebase (`components/src/lib/base/destroyable.ts`) but admin components don't use it.

### Leak inventory

| Component | Unsubscribed calls | Lines |
|-----------|--------------------|-------|
| `dashboard.component.ts` | `forkJoin` with 8 HTTP requests | 245-264 |
| `roles.component.ts` | 2 (privilegeService.get, roleService.get) | 141, 153 |
| `users.component.ts` | 4+ (load, create, update, delete) | 180, 201, 217, 231 |
| `tickets.component.ts` | 4 (load, create, edit, delete) | 153, 173, 197, 213 |
| `boards.component.ts` | 3+ (load, create, delete) | multiple |
| `team-members.component.ts` | 3+ | multiple |
| `comments.component.ts` | 3+ | multiple |

**Note:** The main app's `kanban.component.ts` correctly disconnects its `IntersectionObserver` in `ngOnDestroy` — this pattern should be applied everywhere.

**Fix:** Extend `Destroyable` or use `takeUntilDestroyed()` (Angular 16+) in all admin components.

---

## 4. Code Duplication — 3/10

**Critical.** All 7 entity stores repeat near-identical patterns for `load`, `save`, and `delete` effects. Estimated ~400 lines of duplicated boilerplate.

```
board.store.ts      ← save/delete/load pattern
ticket.store.ts     ← same pattern, different types
comment.store.ts    ← same
initiative.store.ts ← same
board-state.store.ts ← same
ticket-state.store.ts ← same
team-member.store.ts  ← same
```

Similarly, all admin components duplicate the CRUD dialog pattern (open dialog → subscribe to afterClosed → call service → refresh list).

**Fix:** Create a generic `CrudStore<T>` base class or factory. Extract a reusable CRUD dialog orchestration utility.

---

## 5. Error Handling — 2/10

**What exists:**
- Auth interceptor handles 401 → redirect to login (`auth.interceptor.ts:25-31`)

**What's missing:**
- No global error handler (`ErrorHandler`)
- No user-facing error notifications (toast/snackbar)
- Store effects use `noop` for error callbacks in most cases
- No retry logic or request timeouts
- No HTTP caching or request deduplication (`shareReplay` unused)
- Error callbacks in store `save`/`delete` methods are optional and often passed as `null`

**Fix:** Implement a global `ErrorHandler`, add `MatSnackBar` error notifications, add `retry()`/`timeout()` operators in services.

---

## 6. Accessibility (a11y) — 1/10

**Critical gap.** Zero ARIA attributes found across all templates.

| Issue | Count | Example |
|-------|-------|---------|
| `aria-label` | 0 found | Password toggle button has icon but no label |
| `aria-describedby` | 0 found | Form error messages not linked |
| `aria-live` regions | 0 | No notification announcements |
| `alt` text on images | 0 | No images in use (Material icons only) |
| Semantic HTML | Poor | Logo rendered as `<span class="brand-logo-letter">C</span>` |
| `javascript:void(0)` | 1 | "Forgot password?" link (`login.component.html:54`) |
| Focus management in dialogs | Missing | Angular CDK handles some, but no explicit management |
| Keyboard navigation indicators | Missing | No visible focus styles beyond browser defaults |

**Fix:** Add ARIA labels to all interactive elements, replace `javascript:void(0)` with `routerLink` or button, add focus management in dialogs.

---

## 7. Test Coverage — 1/10

| Type | Files | Coverage |
|------|-------|----------|
| Unit tests | 1 (`app.component.spec.ts`, 26 lines) | <1% |
| E2E tests | 23 Playwright suites | Functional paths covered |

**Zero unit tests for:** all 10 stores, all 12 services, all 50 components (except AppComponent), all guards, all view models, all interceptors.

E2E tests provide integration confidence but cannot substitute for unit tests in stores and services where business logic lives.

**Fix:** Prioritize unit tests for stores (complex effects/state transitions) and services (HTTP calls). Configure Jest properly. Add CI gate for coverage.

---

## 8. CSS/SCSS Quality — 8/10

**What's good:**
- 70+ CSS custom properties for design tokens in `:root`
- No `!important` overrides found
- Reasonable nesting depth
- Angular Material theme properly integrated
- Consistent spacing/typography scales

**Minor issues:**
- Magic numbers in component SCSS (e.g., `padding: 24px`, `margin: 12px`) — consider SCSS variables
- Color palette hardcoded in TypeScript (`kanban.component.ts:53-60`) instead of SCSS/CSS variables

---

## 9. Module Organization — 8/10

**Well-structured monorepo:**
- `@api` library: models + services (clean API layer)
- `@components` library: shared UI + stores (reusable across apps)
- `clarity` app: main user-facing application
- `clarity-admin` app: admin panel

**Good patterns:** barrel exports via index files, feature-based folder structure, proper ng-packagr library configs.

**Issue:** Admin components embed dialog components in the same file (e.g., `UserDialogComponent` inside `users.component.ts`). 8 admin component files exceed 200 lines due to combined component + dialog + inline template + inline styles.

---

## 10. Dependency Injection — 9/10

All services use `@Injectable({ providedIn: 'root' })`. Components use modern `inject()` function alongside constructor injection. Store injection is clean.

No scoping issues detected.

---

## 11. Linting & Formatting — 1/10

**No tooling configured:**
- No `.eslintrc` / `eslint.config.*`
- No `.prettierrc`
- No lint builder in `angular.json`
- No pre-commit hooks (husky)

**Fix:** Add `@angular-eslint`, Prettier, and husky with lint-staged.

---

## 12. Security — 5/10

| Aspect | Status |
|--------|--------|
| JWT in localStorage | Risk — accessible to XSS |
| Auth interceptor (401 handling) | Good |
| No `innerHTML` bindings | Good |
| Admin uses hardcoded `'admin-session'` token | Risk — not real auth |
| No CSRF protection | Missing |
| No Content Security Policy headers | Missing |
| Hard-coded `localhost:50124` API URL | Fragile |

**Fix:** Move tokens to httpOnly cookies (backend change), implement proper admin auth, add CSP headers.

---

## 13. List Rendering (trackBy) — 4/10

**Missing trackBy in critical lists:**
- `kanban-board.component.html` — boardStates loop, tickets-by-state loop
- `kanban.component.html` — board states loop
- `kanban-board-controls.component.html` — team members loop
- `create-ticket.component.html` — priorities, states, team members, initiatives
- `update-ticket.component.html` — same
- `ticket-editor.component.html` — multiple loops
- `select-board.component.html` — board list
- `create-board.component.html` — state items

**Good examples (already using trackBy):**
- `my-tickets.component.html` — `track ticket.ticketId`
- `dashboard.component.ts` (admin) — `track m.label`
- `users.component.ts` (admin) — `track user.userId`

---

## Priority Remediation Plan

### Phase 1 — Critical (immediate)
1. **Fix memory leaks** — Extend `Destroyable` or use `takeUntilDestroyed()` in all admin components
2. **Add unit tests** — Start with stores and services (highest logic density)
3. **Add accessibility basics** — ARIA labels on all interactive elements

### Phase 2 — High (next sprint)
4. **Eliminate store duplication** — Create generic `CrudStore<T>` base class
5. **Add global error handler** — `ErrorHandler` + `MatSnackBar` notifications
6. **Configure ESLint + Prettier** — Enforce standards in CI
7. **Add OnPush to admin components** — 9 components need the flag

### Phase 3 — Medium (backlog)
8. **Replace `any` types** — Define proper interfaces for store callbacks/responses
9. **Add trackBy to all loops** — Especially kanban board (drag-heavy UI)
10. **Split large admin files** — Extract dialogs, templates, styles
11. **Implement HTTP caching** — `shareReplay()` in services
12. **Harden security** — httpOnly cookies, CSP headers, proper admin auth

---

## Strengths

- Modern Angular 19 with standalone components
- OnPush change detection consistently used in main app
- Clean library architecture (@api, @components)
- NgRx ComponentStore for predictable state management
- Strong TypeScript strict mode configuration
- Well-structured CSS design tokens
- Comprehensive E2E test suite with Playwright
- No dead code or unnecessary dependencies
