# Clarity Component Design Document

Based on the designs in `designs/clarity.pen`, this document describes the new Angular components to build and the updates required to existing components to implement the full design.

The design file contains **6 screens** across mobile (390x844) and desktop (1440x900) breakpoints:

| Screen | Breakpoint | Description |
|--------|-----------|-------------|
| Mobile - Login | 390x844 | Centered login form with logo |
| Mobile - Kanban Board | 390x844 | Header + tabs + card list + FAB |
| Mobile - Kanban Logout | 390x844 | Board with user dropdown overlay |
| Desktop - Login | 1440x900 | Split-panel login (brand left, form right) |
| Desktop - Kanban Board | 1440x900 | Sidebar + multi-column kanban board |
| Desktop - Kanban Logout | 1440x900 | Board with user dropdown overlay |

---

## 0. UI Framework Mandate: Angular Material

All components **must** be built using **Angular Material** (currently v19 in the project). This is a hard requirement that applies across every component, both new and updated.

### General Rules

- **Buttons:** Use `<button mat-raised-button>`, `<button mat-flat-button>`, `<button mat-icon-button>`, or `<button mat-fab>` / `<button mat-mini-fab>` as appropriate. Never use plain `<button>` elements.
- **Cards:** Use `<mat-card>`, `<mat-card-header>`, `<mat-card-content>`, and `<mat-card-actions>` for all card-like surfaces (ticket cards, column wrappers, dropdown panels).
- **Form Fields:** Use `<mat-form-field>` with `<input matInput>`, `<mat-select>`, and `<textarea matInput>` for all form inputs. Use `appearance="outline"` to match the design's bordered input style.
- **Icons:** Use `<mat-icon>` for all icons. Map the Lucide icon names from the design to their Material Icons equivalents (e.g., Lucide `mail` -> Material `email`, Lucide `lock` -> Material `lock`, Lucide `eye-off` -> Material `visibility_off`, Lucide `arrow-right` -> Material `arrow_forward`, Lucide `plus` -> Material `add`, Lucide `search` -> Material `search`, Lucide `layout-grid` -> Material `grid_view`, Lucide `ticket` -> Material `confirmation_number`, Lucide `users` -> Material `group`, Lucide `settings` -> Material `settings`, Lucide `user` -> Material `person`, Lucide `log-out` -> Material `logout`, Lucide `ellipsis` -> Material `more_horiz`).
- **Tabs:** Use `<mat-tab-group>` and `<mat-tab>` for the mobile column tab switcher.
- **Menus:** Use `<mat-menu>` and `matMenuTriggerFor` for the user dropdown menu rather than building a custom overlay from scratch.
- **Dialogs:** Continue using `MatDialog` (or CDK Dialog) for create/update ticket modals.
- **Toolbars:** Use `<mat-toolbar>` for the mobile header and desktop top bar.
- **Sidenav:** Use `<mat-sidenav-container>`, `<mat-sidenav>`, and `<mat-sidenav-content>` for the responsive sidebar/content layout.
- **Lists:** Use `<mat-nav-list>` and `<mat-list-item>` for sidebar navigation items.
- **Dividers:** Use `<mat-divider>` for separator lines in menus and sidebars.
- **Badges:** Use `<mat-chip>` (from `MatChipsModule`) for priority badges, styled with custom colors.
- **FAB:** Use `<button mat-fab>` for the floating action button.
- **Tooltips / Ripples:** Apply `matTooltip` and `matRipple` where interactive elements benefit from them.

### Material Theme Customization

All design token colors, radii, and typography will be applied through Angular Material's theming system (`@angular/material` Sass APIs) and CSS custom properties. Components should rely on Material theme tokens rather than hard-coding colors wherever possible, so that theme changes propagate globally.

### Why Angular Material

- The project already depends on `@angular/material@19` and `@angular/cdk@19`
- Existing components (CreateTicket, UpsertTicket) already use `mat-form-field`, `mat-card`, `mat-button`, and `MatDialog`
- Using Material throughout ensures consistent interaction patterns (ripples, focus states, a11y), keyboard navigation, and ARIA attributes out of the box
- CDK drag-drop for kanban columns is already integrated and will continue to be used

---

## 1. Design Tokens & Theme

The design uses a consistent token system. These values will be mapped into the Angular Material custom theme so that Material components pick them up automatically.

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--clr-primary` | `#7D00FA` | Primary brand, buttons, active nav, avatars |
| `--clr-primary-light` | `#F3F0FF` | Desktop login bg, active nav bg |
| `--clr-primary-subtle` | `#F8F5FF` | Board bar bg (mobile) |
| `--clr-primary-overlay` | `#FFFFFF22` | Logo bg on primary surfaces |
| `--clr-text-primary` | `#1A1A2E` | Headings, card titles, labels |
| `--clr-text-secondary` | `#6B7280` | Descriptions, subtitles, inactive nav |
| `--clr-text-placeholder` | `#9CA3AF` | Input placeholders, icons in inputs |
| `--clr-bg-page` | `#F9FAFB` | Page background, card area |
| `--clr-bg-card` | `#FFFFFF` | Card backgrounds, panels |
| `--clr-bg-card-inner` | `#FAFAFA` | Card inner bg (desktop ticket cards) |
| `--clr-border` | `#E5E7EB` | Borders, dividers, input strokes |
| `--clr-badge-bg` | `#F3F4F6` | Neutral count badge bg |
| `--clr-danger` | `#DC2626` | Sign out, urgent badge text |
| `--clr-success` | `#22C55E` | Done column, complete badge |
| `--clr-scrim` | `#00000033` | Overlay scrim behind dropdowns |

### Priority Badge Colors

| Priority | Background | Text |
|----------|-----------|------|
| Urgent | `#FEE2E2` | `#DC2626` |
| High | `#FEF3C7` | `#D97706` |
| Medium | `#DBEAFE` | `#2563EB` |
| Complete | `#DCFCE7` | `#22C55E` |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Logo name (desktop brand) | Inter | 36px | 700 |
| Page title | Inter | 24-28px | 700 |
| Section heading | Inter | 18-22px | 600 |
| Board name (mobile) | Inter | 15px | 600 |
| Card title | Inter | 13-14px | 600 |
| Card description | Inter | 12-13px | 400 |
| Nav item | Inter | 14px | 400/600 |
| Badge text | Inter | 10-11px | 500 |
| Form label | Inter | 13-14px | 500 |
| Button text | Inter | 15px | 600 |
| Avatar initials | Inter | 8-14px | 600 |

### Spacing & Radii

| Element | Radius |
|---------|--------|
| Logo icon | 16px (mobile), 20px (desktop brand), 10px (sidebar) |
| Input fields | 8px |
| Buttons | 8px |
| Ticket cards (mobile) | 8px |
| Kanban columns (desktop) | 12px |
| Avatar (small) | 50% (circular) |
| FAB | 28px (circular) |
| Dropdown | 12px |
| Nav items | 8px |

---

## 2. New Components

### 2.1 LoginComponent

**Purpose:** Full-screen login page with responsive layout (mobile: centered form; desktop: split-panel with brand on left, form on right).

**Selector:** `app-login`

**Location:** `projects/components/src/lib/components/login/`

**Template Structure:**
```
Mobile layout:
  Logo Area (icon + "Clarity" + "Kanban Board")
  Form Area
    "Welcome back" heading
    "Sign in to your account" subtitle
    Email field (label + icon input)
    Password field (label + icon input with eye toggle)
    Sign In button (primary, full width, with arrow-right icon)
    "Forgot password?" link

Desktop layout:
  Left Panel (primary bg)
    Logo icon (80x80, semi-transparent bg)
    "Clarity" brand name
    "Organize. Prioritize. Deliver." tagline
    Description paragraph
  Right Panel (white bg)
    Login Form (400px wide, centered)
      Same form fields as mobile
```

**Inputs/Outputs:**
- `@Output() login: EventEmitter<{ email: string; password: string }>`
- `@Output() forgotPassword: EventEmitter<void>`

**Dependencies:** ReactiveFormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule

**Angular Material Usage:**
- Email field: `<mat-form-field appearance="outline">` with `<mat-icon matPrefix>email</mat-icon>` and `<input matInput>`
- Password field: `<mat-form-field appearance="outline">` with `<mat-icon matPrefix>lock</mat-icon>`, `<input matInput type="password">`, and `<button mat-icon-button matSuffix>` with `<mat-icon>visibility_off</mat-icon>` for the toggle
- Sign In button: `<button mat-flat-button color="primary">` with `<mat-icon>arrow_forward</mat-icon>`
- "Forgot password?" link: `<button mat-button color="primary">`

**Responsive Behavior:**
- Mobile (<768px): Single column, centered, padding 48px/32px, gap 32px between logo area and form
- Desktop (>=768px): Two equal panels side-by-side, left panel purple with branding

**Notes:**
- All icons use `<mat-icon>` with Material Icons font (mapped from Lucide names in the design).
- Password field has a visibility toggle (`visibility` / `visibility_off` icons).
- Email input shows placeholder text, not a real value.

---

### 2.2 AppHeaderComponent

**Purpose:** Top header bar for mobile kanban view. Shows logo, app name, and user avatar.

**Selector:** `app-header`

**Location:** `projects/components/src/lib/components/app-header/`

**Template Structure:**
```
<mat-toolbar color="primary">
  Left: Logo (32x32, rounded, semi-transparent bg, "C") + "Clarity" text
  Right: <button mat-icon-button> with UserAvatarComponent (32x32 circle, initials)
</mat-toolbar>
```

**Inputs:**
- `@Input() userName: string` (for generating initials)

**Outputs:**
- `@Output() avatarClick: EventEmitter<void>` (triggers user menu dropdown)

**Angular Material Usage:**
- Use `<mat-toolbar color="primary">` for the 56px header bar
- Avatar trigger uses `<button mat-icon-button>` for accessible click target

**Notes:**
- Only visible on mobile. Desktop uses the sidebar instead.
- Avatar shows user initials (e.g., "QB" for Quinntyne Brown).

---

### 2.3 SidebarComponent

**Purpose:** Left sidebar navigation for the desktop layout. Contains logo, nav items, and user profile at bottom.

**Selector:** `app-sidebar`

**Location:** `projects/components/src/lib/components/sidebar/`

**Template Structure:**
```
<mat-sidenav> (260px wide, full height, mode="side", opened)
  Top section:
    Logo (36x36 icon + "Clarity" text)
    <mat-nav-list>
      <mat-list-item> Boards (<mat-icon>grid_view</mat-icon>) [active state]
      <mat-list-item> My Tickets (<mat-icon>confirmation_number</mat-icon>)
      <mat-list-item> Team (<mat-icon>group</mat-icon>)
      <mat-list-item> Settings (<mat-icon>settings</mat-icon>)
    </mat-nav-list>
  Bottom section:
    <mat-divider>
    <button mat-button> with UserAvatarComponent + user info
```

**Inputs:**
- `@Input() activeRoute: string` (determines which nav item is highlighted)
- `@Input() user: { name: string; email: string }` (user profile data)

**Outputs:**
- `@Output() navigate: EventEmitter<string>` (emits route name: 'boards', 'tickets', 'team', 'settings')
- `@Output() userClick: EventEmitter<void>` (triggers user menu)

**Angular Material Usage:**
- Use `<mat-sidenav>` within a `<mat-sidenav-container>` for the sidebar shell (container lives in KanbanComponent)
- Use `<mat-nav-list>` with `<mat-list-item>` for navigation items. Apply `activated` class on the active item.
- Use `<mat-icon>` for all nav icons
- Use `<mat-divider>` between nav section and user profile section
- User profile click target uses `<button mat-button>` for accessibility

**Nav Item Styling:**
- Default: no background, `#6B7280` text and icon color
- Active: `#F3F0FF` background, `#7D00FA` text and icon, fontWeight 600
- Each nav item: 40px height, 8px radius, 12px horizontal padding, 10px gap

---

### 2.4 BoardBarComponent

**Purpose:** Sub-header showing the current board name and an options menu. Used on mobile below the main header.

**Selector:** `app-board-bar`

**Location:** `projects/components/src/lib/components/board-bar/`

**Template Structure:**
```
<mat-toolbar> (44px tall, #F8F5FF bg)
  Board name (15px, 600 weight)
  <button mat-icon-button><mat-icon>more_horiz</mat-icon></button>
```

**Inputs:**
- `@Input() boardName: string`

**Outputs:**
- `@Output() menuClick: EventEmitter<void>`

**Angular Material Usage:**
- Use `<mat-toolbar>` for the bar container
- Use `<button mat-icon-button>` with `<mat-icon>more_horiz</mat-icon>` for the options menu trigger

---

### 2.5 ColumnTabsComponent

**Purpose:** Horizontal tab bar for switching between kanban columns on mobile. Each column is a tab with a color-coded bottom border.

**Selector:** `app-column-tabs`

**Location:** `projects/components/src/lib/components/column-tabs/`

**Template Structure:**
```
<mat-tab-group (selectedTabChange)="onTabChange($event)">
  <mat-tab *ngFor="let state of boardStates" [label]="state.name">
    <!-- tab content rendered by parent via activeState binding -->
  </mat-tab>
</mat-tab-group>
```

**Inputs:**
- `@Input() boardStates: BoardState[]`
- `@Input() activeState: BoardState`

**Outputs:**
- `@Output() stateChange: EventEmitter<BoardState>`

**Angular Material Usage:**
- Use `<mat-tab-group>` and `<mat-tab>` from `MatTabsModule`
- Apply custom theme overrides for tab ink-bar colors per column (Backlog=#6B7280, In Progress=#7D00FA, Done=#22C55E) using `::ng-deep` or component-level theme mixins
- The `stretchTabs` option should be enabled so tabs fill the container equally

**Notes:**
- Active tab uses fontWeight 600; inactive use 500.
- Column colors should map from the board state's color property if available, or use defaults.

---

### 2.6 FABComponent

**Purpose:** Floating action button for creating new tickets on mobile.

**Selector:** `app-fab`

**Location:** `projects/components/src/lib/components/fab/`

**Template Structure:**
```
<button mat-fab color="primary" (click)="fabClick.emit()">
  <mat-icon>add</mat-icon>
</button>
```

**Inputs:** None

**Outputs:**
- `@Output() fabClick: EventEmitter<void>`

**Angular Material Usage:**
- Use `<button mat-fab color="primary">` from `MatButtonModule` — this provides the circular FAB shape, ripple, and elevation out of the box
- Use `<mat-icon>add</mat-icon>` for the plus icon

**Styling:**
- Position: Fixed, bottom-right of the viewport
- Custom shadow override: `0 4px 12px #7D00FA55` (override Material's default elevation)
- Material FAB is already circular (56x56 default size matches the design)

---

### 2.7 UserDropdownComponent

**Purpose:** User profile dropdown menu shown when clicking the avatar. Contains profile info, navigation items, and sign-out action.

**Selector:** `app-user-dropdown`

**Location:** `projects/components/src/lib/components/user-dropdown/`

**Template Structure:**
```
<mat-menu #userMenu="matMenu">
  Profile section (custom header via mat-menu item with disabled ripple):
    UserAvatarComponent (size lg) + Name + Email
  <mat-divider>
  <button mat-menu-item><mat-icon>person</mat-icon> My Profile</button>
  <button mat-menu-item><mat-icon>settings</mat-icon> Settings</button>
  <mat-divider>
  <button mat-menu-item class="danger"><mat-icon>logout</mat-icon> Sign Out</button>
</mat-menu>
```

The trigger element (avatar button in header or sidebar) uses `[matMenuTriggerFor]="userMenu"`.

**Inputs:**
- `@Input() user: { name: string; email: string }`

**Outputs:**
- `@Output() menuAction: EventEmitter<'profile' | 'settings' | 'signout'>`

**Angular Material Usage:**
- Use `<mat-menu>` from `MatMenuModule` — provides built-in overlay, scrim/backdrop, positioning, keyboard navigation, and dismiss-on-click behavior
- Use `<button mat-menu-item>` for each action item
- Use `<mat-icon>` inside each menu item
- Use `<mat-divider>` for separators
- The profile header section can be a non-interactive `<div>` inside the menu with custom styling
- Material menu handles positioning automatically (anchored to trigger element) — no manual scrim or positioning needed

**Positioning:**
- Mobile: Anchored below the header avatar via `[matMenuTriggerFor]`
- Desktop: Anchored to sidebar user section via `[matMenuTriggerFor]`
- Material menu provides its own elevation shadow

---

### 2.8 PriorityBadgeComponent

**Purpose:** Small inline badge showing ticket priority level with color-coded background/text.

**Selector:** `app-priority-badge`

**Location:** `projects/components/src/lib/components/priority-badge/`

**Template Structure:**
```
<mat-chip [class]="'priority-' + priority" [disableRipple]="true" [selectable]="false">
  {{ label }}
</mat-chip>
```

**Inputs:**
- `@Input() priority: 'urgent' | 'high' | 'medium' | 'low' | 'complete'`

**Angular Material Usage:**
- Use `<mat-chip>` from `MatChipsModule` as the badge element — provides consistent pill shape, sizing, and theming hooks
- Disable ripple and selection since these are display-only labels
- Apply priority-specific CSS classes to override background and text color

**Color Mapping:**
| Priority | Background | Text Color |
|----------|-----------|------------|
| urgent | `#FEE2E2` | `#DC2626` |
| high | `#FEF3C7` | `#D97706` |
| medium | `#DBEAFE` | `#2563EB` |
| low | `#F3F4F6` | `#6B7280` |
| complete | `#DCFCE7` | `#22C55E` |

---

### 2.9 UserAvatarComponent

**Purpose:** Reusable avatar circle showing user initials. Used in ticket cards, header, sidebar, and dropdown.

**Selector:** `app-user-avatar`

**Location:** `projects/components/src/lib/components/user-avatar/`

**Template Structure:**
```
Circle (configurable size, primary bg, centered text)
  Initials text (computed from user name)
```

**Inputs:**
- `@Input() name: string` (full name, initials computed)
- `@Input() size: 'xs' | 'sm' | 'md' | 'lg'`

**Size Variants:**
| Size | Diameter | Font Size | Used In |
|------|----------|-----------|---------|
| xs | 22px | 8px | Desktop ticket cards |
| sm | 24px | 10px | Mobile ticket cards |
| md | 32px | 12px | Header avatar |
| lg | 40px | 14px | Dropdown profile |

---

### 2.10 SearchBarComponent

**Purpose:** Search input for filtering tickets on the desktop kanban board top bar.

**Selector:** `app-search-bar`

**Location:** `projects/components/src/lib/components/search-bar/`

**Template Structure:**
```
<mat-form-field appearance="outline" class="search-field">
  <mat-icon matPrefix>search</mat-icon>
  <input matInput [placeholder]="placeholder" (input)="onSearch($event)">
</mat-form-field>
```

**Inputs:**
- `@Input() placeholder: string` (default: "Search tickets...")

**Outputs:**
- `@Output() search: EventEmitter<string>`

**Angular Material Usage:**
- Use `<mat-form-field appearance="outline">` with `<input matInput>` for the search input
- Use `<mat-icon matPrefix>search</mat-icon>` for the search icon
- Style overrides: reduce the form field density to match the compact design (8px/14px padding), remove the subscript hint area

---

### 2.11 ColumnHeaderComponent

**Purpose:** Header row for each kanban column on the desktop layout. Shows a colored dot, column name, and ticket count badge.

**Selector:** `app-column-header`

**Location:** `projects/components/src/lib/components/column-header/`

**Template Structure:**
```
<mat-card-header class="column-header">
  Left group (8px gap):
    Color dot (10x10 circle, column color)
    Column name (14px, 600 weight, #1A1A2E)
    <mat-chip class="count-badge" [disableRipple]="true">{{ count }}</mat-chip>
</mat-card-header>
```

**Inputs:**
- `@Input() name: string`
- `@Input() count: number`
- `@Input() color: string` (hex color for dot and count badge)

**Angular Material Usage:**
- Use `<mat-card-header>` to sit inside the parent column's `<mat-card>`
- Use `<mat-chip>` for the count badge (styled as a small circle with tinted background)

**Color Mapping for Count Badge Background:**
| Column | Dot/Text Color | Badge BG |
|--------|---------------|----------|
| Backlog | `#6B7280` | `#F3F4F6` |
| In Progress | `#7D00FA` | `#F3F0FF` |
| Done | `#22C55E` | `#DCFCE7` |

---

## 3. Updates to Existing Components

### 3.1 TicketComponent (Update)

**Current state:** Renders `<h2>{{ ticket.name }}</h2>` and `<span>Age: {{ ticket.age }}</span>`. Minimal styling.

**Required changes to match design:**

The ticket card needs a full redesign using `<mat-card>`:

```
<mat-card (click)="handleEditClick()" class="ticket-card">
  <mat-card-header>
    <mat-card-title>{{ ticket.name }}</mat-card-title>
    <app-priority-badge [priority]="ticket.priority" />
  </mat-card-header>
  <mat-card-content>
    <p>{{ ticket.description }}</p>
  </mat-card-content>
  <mat-card-footer>
    <app-user-avatar [name]="ticket.assigneeName" size="sm" />
    <span>{{ ticket.assigneeName }}</span>
  </mat-card-footer>
</mat-card>
```

**Updated Inputs:**
- `@Input() ticket: Ticket` (existing)

**Dependencies to add:** MatCardModule, PriorityBadgeComponent, UserAvatarComponent

**Angular Material Usage:**
- Use `<mat-card>` as the card container with custom styling to match design (8px radius, 1px border, 16px padding, 12px gap)
- Use `<mat-card-header>`, `<mat-card-content>`, `<mat-card-footer>` for semantic structure
- Apply `matRipple` for click feedback on the card

**Notes:**
- Desktop variant uses a slightly different card style: `#FAFAFA` inner bg, 14px padding, 10px gap, 13px title, 12px description — applied via a CSS class or host binding
- The click-to-edit behavior should be preserved.
- The `Age` field display should be replaced by description and assignee.
- Priority should be derived from the ticket data model. If `Ticket` model lacks a priority field, one must be added.

---

### 3.2 KanbanBoardControlsComponent (Update)

**Current state:** Shows a Material add icon and the board name as clickable text.

**Required changes to match design:**

This component's responsibilities should be split between new components depending on breakpoint:

**Mobile:**
- The header functionality moves to `AppHeaderComponent` + `BoardBarComponent` + `ColumnTabsComponent`
- Add ticket action moves to `FABComponent`
- This component may become desktop-only as the "Top Bar"

**Desktop (Top Bar):**
```
<mat-toolbar class="board-toolbar">
  Left:
    Board name (24px, 700, #1A1A2E)
    Subtitle: "Manage and track your team's tasks" (14px, 400, #6B7280)
  Right:
    <app-search-bar />
    <button mat-flat-button color="primary">
      <mat-icon>add</mat-icon> New Ticket
    </button>
</mat-toolbar>
```

**Changes:**
- Replace the bare `<mat-icon>add</mat-icon>` with `<button mat-flat-button color="primary">` containing icon + "New Ticket" text
- Use `<mat-toolbar>` as the container for consistent Material elevation and alignment
- Add board subtitle/description text
- Integrate SearchBarComponent (which uses `<mat-form-field>` internally)
- Remove board name click handler (board selection moves to sidebar)

---

### 3.3 KanbanBoardComponent (Update)

**Current state:** Renders columns with `*ngFor` over boardStates, each as a `cdkDropList`. Shows board state name as a `<span>` and renders ticket components.

**Required changes to match design:**

**Desktop layout:**
```
Columns container (horizontal, fill, 20px gap)
  Per column:
    <mat-card class="kanban-column" cdkDropList>
      <app-column-header [name]="..." [count]="..." [color]="..." />
      <mat-card-content>
        Ticket cards (scrollable, vertical stack, 12px gap, each with cdkDrag)
      </mat-card-content>
    </mat-card>
```

**Mobile layout:**
- Show only the active column's tickets (driven by `<mat-tab-group>` in ColumnTabsComponent)
- Cards render in a vertical scrollable list with 12px gap

**Changes:**
- Wrap each column in a `<mat-card>` styled as the column container (white bg, 12px radius, 1px border, 16px padding, 12px gap)
- Replace the plain `<span>{{ boardState.name }}</span>` with `ColumnHeaderComponent`
- Add responsive layout: multi-column on desktop, single-column-with-tabs on mobile
- Keep the existing CDK drag-drop functionality (`cdkDropList`, `cdkDrag`, `CdkDropListGroup`)

---

### 3.4 KanbanComponent (Update)

**Current state:** Renders `<app-kanban-board-controls>` and `<app-kanban-board>`.

**Required changes to match design:**

This component becomes the main layout orchestrator with responsive behavior:

**Mobile layout:**
```
<app-header [userName]="..." (avatarClick)="openUserMenu()" [matMenuTriggerFor]="userMenu" />
<app-board-bar [boardName]="..." />
<app-column-tabs [boardStates]="..." (stateChange)="..." />   <!-- uses mat-tab-group -->
Card area (scrollable, #F9FAFB bg, 16px padding)
  <app-kanban-board> (single column mode)
<app-fab (fabClick)="openCreateTicket()" />                    <!-- uses mat-fab -->
<app-user-dropdown [user]="..." />                             <!-- uses mat-menu -->
```

**Desktop layout:**
```
<mat-sidenav-container>
  <mat-sidenav mode="side" opened>
    <app-sidebar [activeRoute]="..." [user]="..." />           <!-- uses mat-nav-list -->
  </mat-sidenav>
  <mat-sidenav-content>
    <app-kanban-board-controls [board]="..." />                 <!-- uses mat-toolbar, mat-flat-button -->
    <app-kanban-board [tickets]="..." [boardStates]="..." />    <!-- columns use mat-card -->
  </mat-sidenav-content>
</mat-sidenav-container>
<app-user-dropdown [user]="..." />                              <!-- uses mat-menu -->
```

**Angular Material Usage:**
- Use `<mat-sidenav-container>`, `<mat-sidenav>`, and `<mat-sidenav-content>` for the responsive desktop sidebar layout
- Use Angular CDK `BreakpointObserver` to toggle between mobile and desktop layouts, and to set `<mat-sidenav>` mode (`side` on desktop, `over` on mobile if needed)

**Changes:**
- Add responsive layout logic using `BreakpointObserver` from `@angular/cdk/layout`
- Integrate new sub-components (header, sidebar, tabs, FAB) — all built with Material components
- Add state for user dropdown visibility (managed via `matMenuTriggerFor`)
- Route-based or state-based view switching between login and kanban

---

### 3.5 AppComponent (Update)

**Current state:** Renders `<app-kanban />` directly.

**Required changes:**

- Add routing to switch between login and kanban views
- Or conditionally render `LoginComponent` vs `KanbanComponent` based on auth state
- Minimal change: just add the Angular Router and route configuration

---

### 3.6 CreateTicketComponent / UpsertTicketComponent (Update)

**Current state:** Already uses Material form fields (`mat-form-field`, `mat-card`, `mat-button`) in a CDK dialog. This is the closest to the target of any existing component.

**Required changes:**
- Continue using `MatDialog` for the dialog container with custom panel class for design-aligned styling
- Continue using `<mat-form-field appearance="outline">` for all inputs — update border radius and density to match design tokens
- Add a priority field using `<mat-select>` with priority options (Urgent, High, Medium, Low)
- Replace plain `<button mat-button>` actions with `<button mat-flat-button color="primary">` for Save and `<button mat-stroked-button>` for Cancel/Delete
- Ensure `<mat-card>` wrapper matches the design's card aesthetic (use theme overrides for radii and padding)
- Use Inter font styling consistent with the design tokens

---

### 3.7 CurrentTeamMemberComponent (Update)

**Current state:** Placeholder `<h1>{{ vm.message }}</h1>`

**Required changes:**
- Implement actual user display using `UserAvatarComponent`
- Show user name and email
- This functionality is now also served by the sidebar bottom section and header avatar, so this component may be deprecated in favor of those.

---

## 4. Data Model Changes

### 4.1 Ticket Model

The design shows priority badges (Urgent, High, Medium) on ticket cards. The current `Ticket` model needs:

```typescript
// Add to existing Ticket interface in @api library
priority?: 'urgent' | 'high' | 'medium' | 'low';
```

If priority is not a separate field but derived from `TicketType`, map the existing type values to the priority badge colors.

### 4.2 User/TeamMember Model

The design shows user initials, full name, and email in multiple places. Ensure the `User` or `TeamMember` model has:

```typescript
interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  // computed: initials, fullName
}
```

---

## 5. Global Style Updates (Angular Material Theme)

### 5.1 Font Family

The design uses **Inter** throughout. The current app uses **Roboto** via Angular Material. Switch to Inter and configure Material's typography system accordingly.

Add to `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Update `styles.scss` to configure Material typography with Inter:
```scss
@use '@angular/material' as mat;

$clarity-typography: mat.m3-define-typography(
  plain-family: 'Inter',
  brand-family: 'Inter',
);
```

### 5.2 Angular Material Custom Theme

Define the full Material theme in `styles.scss` using the design's color palette:

```scss
$clarity-theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$violet-palette,    // closest to #7D00FA
  ),
  typography: (
    plain-family: 'Inter',
    brand-family: 'Inter',
  ),
  density: (
    scale: 0,
  ),
));

html {
  @include mat.all-component-themes($clarity-theme);
}
```

Override the primary color swatch to exactly match `#7D00FA` if the built-in violet palette doesn't align. Use CSS custom properties as a bridge:

```scss
:root {
  --clr-primary: #7D00FA;
  --clr-primary-light: #F3F0FF;
  /* ... all tokens from Section 1 ... */
}
```

### 5.3 Material Component Style Overrides

Apply global overrides to align Material component defaults with the design:

```scss
// Cards: reduce default elevation, set border radius
.mat-mdc-card {
  --mdc-elevated-card-container-shape: 8px;
  --mdc-elevated-card-container-elevation: none;
  border: 1px solid var(--clr-border);
}

// Buttons: 8px radius
.mat-mdc-button, .mat-mdc-raised-button, .mat-mdc-flat-button {
  --mdc-filled-button-container-shape: 8px;
  --mdc-text-button-container-shape: 8px;
}

// Form fields: 8px radius, outline appearance
.mat-mdc-form-field {
  --mdc-outlined-text-field-container-shape: 8px;
}

// FAB: custom shadow
.mat-mdc-fab.mat-primary {
  --mdc-fab-container-elevation: 0 4px 12px #7D00FA55;
}

// Toolbar: custom height for mobile header
.mat-toolbar.app-header {
  height: 56px;
}

// Chips: small sizing for priority badges
.mat-mdc-chip.priority-badge {
  --mdc-chip-container-height: auto;
  min-height: unset;
  padding: 2px 8px;
  font-size: 11px;
}

// Sidenav: 260px width
.mat-sidenav {
  width: 260px;
}

// Tab group: stretch tabs
.mat-mdc-tab-group.column-tabs {
  .mat-mdc-tab {
    flex: 1;
  }
}
```

### 5.4 CSS Custom Properties

In addition to the Material theme, expose the full design token set as CSS custom properties in `styles.scss` (see Section 1 for the complete list). Components should reference these properties for any styling not covered by Material theme tokens.

---

## 6. Routing Structure

The design implies the following routes:

| Route | Component | Guard |
|-------|-----------|-------|
| `/login` | LoginComponent | Guest guard (redirect if authenticated) |
| `/boards` | KanbanComponent | Auth guard |
| `/boards/:id` | KanbanComponent | Auth guard |

---

## 7. Component Hierarchy

```
AppComponent
├── LoginComponent (route: /login)
│
└── KanbanComponent (route: /boards)
    │
    ├── [Mobile]
    │   ├── AppHeaderComponent
    │   │   └── UserAvatarComponent
    │   ├── BoardBarComponent
    │   ├── ColumnTabsComponent
    │   ├── KanbanBoardComponent (single column)
    │   │   └── TicketComponent (updated)
    │   │       ├── PriorityBadgeComponent
    │   │       └── UserAvatarComponent
    │   ├── FABComponent
    │   └── UserDropdownComponent (overlay)
    │
    └── [Desktop]
        ├── SidebarComponent
        │   └── UserAvatarComponent
        ├── KanbanBoardControlsComponent (updated)
        │   └── SearchBarComponent
        ├── KanbanBoardComponent (multi-column)
        │   ├── ColumnHeaderComponent
        │   └── TicketComponent (updated)
        │       ├── PriorityBadgeComponent
        │       └── UserAvatarComponent
        └── UserDropdownComponent (overlay)
```

---

## 8. Implementation Order

The recommended order for implementing these components minimizes blocking dependencies:

1. **Design tokens & global styles** - Foundation for all components
2. **UserAvatarComponent** - Reused everywhere, no dependencies
3. **PriorityBadgeComponent** - Reused in tickets, no dependencies
4. **TicketComponent update** - Core card redesign using avatar + badge
5. **ColumnHeaderComponent** - Needed by desktop board
6. **KanbanBoardComponent update** - Desktop column layout
7. **SearchBarComponent** - Needed by controls
8. **KanbanBoardControlsComponent update** - Desktop top bar
9. **SidebarComponent** - Desktop navigation
10. **LoginComponent** - Standalone, can be built in parallel
11. **AppHeaderComponent** - Mobile header
12. **BoardBarComponent** - Mobile board sub-header
13. **ColumnTabsComponent** - Mobile column switching
14. **FABComponent** - Mobile add button
15. **UserDropdownComponent** - Overlay menu
16. **KanbanComponent update** - Final orchestration with responsive layout
17. **AppComponent update** - Routing integration
18. **Data model updates** - Priority field, user fields

---

## 9. Summary of New vs Updated

### New Components (11)

| Component | Purpose |
|-----------|---------|
| LoginComponent | Authentication screen |
| AppHeaderComponent | Mobile top bar |
| SidebarComponent | Desktop left navigation |
| BoardBarComponent | Mobile board name bar |
| ColumnTabsComponent | Mobile column tab switcher |
| FABComponent | Mobile floating add button |
| UserDropdownComponent | User menu overlay |
| PriorityBadgeComponent | Ticket priority label |
| UserAvatarComponent | User initials circle |
| SearchBarComponent | Ticket search input |
| ColumnHeaderComponent | Desktop column title with count |

### Updated Components (6)

| Component | Change Summary |
|-----------|---------------|
| TicketComponent | Full card redesign with priority badge, description, assignee |
| KanbanBoardControlsComponent | Styled top bar with search and "New Ticket" button |
| KanbanBoardComponent | Styled columns with headers, responsive layout |
| KanbanComponent | Layout orchestration, responsive mobile/desktop |
| AppComponent | Add routing for login vs kanban |
| CreateTicket/UpsertTicket | Priority field, updated dialog styling |
