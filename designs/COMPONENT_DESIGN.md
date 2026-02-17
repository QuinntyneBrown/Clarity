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

## 1. Design Tokens & Theme

The design uses a consistent token system that differs from the current Angular Material violet theme.

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

**Dependencies:** ReactiveFormsModule, CommonModule

**Responsive Behavior:**
- Mobile (<768px): Single column, centered, padding 48px/32px, gap 32px between logo area and form
- Desktop (>=768px): Two equal panels side-by-side, left panel purple with branding

**Notes:**
- The design uses Lucide icons (`mail`, `lock`, `eye-off`, `arrow-right`). Decide whether to use Lucide icon font or Angular Material icons mapped to equivalent glyphs.
- Password field has a visibility toggle (eye-off icon).
- Email input shows placeholder text, not a real value.

---

### 2.2 AppHeaderComponent

**Purpose:** Top header bar for mobile kanban view. Shows logo, app name, and user avatar.

**Selector:** `app-header`

**Location:** `projects/components/src/lib/components/app-header/`

**Template Structure:**
```
Header (56px tall, primary bg, horizontal layout)
  Left: Logo (32x32, rounded, semi-transparent bg, "C") + "Clarity" text
  Right: User avatar (32x32 circle, semi-transparent bg, initials)
```

**Inputs:**
- `@Input() userName: string` (for generating initials)

**Outputs:**
- `@Output() avatarClick: EventEmitter<void>` (triggers user menu dropdown)

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
Sidebar (260px wide, full height, white bg, right border)
  Top section:
    Logo (36x36 icon + "Clarity" text)
    Navigation items:
      - Boards (layout-grid icon) [active state: purple bg, purple text]
      - My Tickets (ticket icon)
      - Team (users icon)
      - Settings (settings icon)
  Bottom section (top border):
    User avatar (36x36 circle, primary bg, initials)
    User info:
      - Name: "Quinntyne Brown" (13px, 600)
      - Email: "quinntynebrown@gmail.com" (11px, 400)
```

**Inputs:**
- `@Input() activeRoute: string` (determines which nav item is highlighted)
- `@Input() user: { name: string; email: string }` (user profile data)

**Outputs:**
- `@Output() navigate: EventEmitter<string>` (emits route name: 'boards', 'tickets', 'team', 'settings')
- `@Output() userClick: EventEmitter<void>` (triggers user menu)

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
Bar (44px tall, #F8F5FF bg, horizontal, space-between)
  Board name (15px, 600 weight)
  Ellipsis icon (20x20, #6B7280)
```

**Inputs:**
- `@Input() boardName: string`

**Outputs:**
- `@Output() menuClick: EventEmitter<void>`

---

### 2.5 ColumnTabsComponent

**Purpose:** Horizontal tab bar for switching between kanban columns on mobile. Each column is a tab with a color-coded bottom border.

**Selector:** `app-column-tabs`

**Location:** `projects/components/src/lib/components/column-tabs/`

**Template Structure:**
```
Tab bar (44px tall, white bg, bottom border #E5E7EB)
  Tab per board state:
    - "Backlog" (bottom border #6B7280, text #6B7280, 500 weight)
    - "In Progress" (bottom border #7D00FA, text #7D00FA, 600 weight) [active]
    - "Done" (bottom border #22C55E, text #22C55E, 500 weight)
```

**Inputs:**
- `@Input() boardStates: BoardState[]`
- `@Input() activeState: BoardState`

**Outputs:**
- `@Output() stateChange: EventEmitter<BoardState>`

**Notes:**
- Tabs fill the container equally (`width: fill_container` on each tab).
- Active tab uses fontWeight 600; inactive use 500.
- Column colors: Backlog=#6B7280, In Progress=#7D00FA, Done=#22C55E. These should map from the board state's color property if available, or use defaults.

---

### 2.6 FABComponent

**Purpose:** Floating action button for creating new tickets on mobile.

**Selector:** `app-fab`

**Location:** `projects/components/src/lib/components/fab/`

**Template Structure:**
```
Button (56x56, circular, primary bg, shadow)
  Plus icon (24x24, white)
```

**Inputs:** None

**Outputs:**
- `@Output() fabClick: EventEmitter<void>`

**Styling:**
- Position: Fixed, bottom-right of the viewport
- Shadow: `0 4px 12px #7D00FA55`
- Corner radius: 28px (fully circular)

---

### 2.7 UserDropdownComponent

**Purpose:** User profile dropdown menu shown when clicking the avatar. Contains profile info, navigation items, and sign-out action.

**Selector:** `app-user-dropdown`

**Location:** `projects/components/src/lib/components/user-dropdown/`

**Template Structure:**
```
Scrim overlay (#00000033, full-screen, click to dismiss)
Dropdown card (260px wide, white, 12px radius, shadow)
  Profile section (bottom border):
    Avatar (40x40 circle, primary bg, initials)
    Name + Email
  Menu items (8px vertical padding):
    My Profile (user icon, 18x18)
    Settings (settings icon, 18x18)
    Divider (1px #E5E7EB)
    Sign Out (log-out icon, red text #DC2626)
```

**Inputs:**
- `@Input() user: { name: string; email: string }`

**Outputs:**
- `@Output() menuAction: EventEmitter<'profile' | 'settings' | 'signout'>`
- `@Output() close: EventEmitter<void>`

**Positioning:**
- Mobile: Anchored below the header avatar, right-aligned
- Desktop: Anchored above the sidebar user section, or near avatar
- Shadow: `0 8px 24px #0000001A`

---

### 2.8 PriorityBadgeComponent

**Purpose:** Small inline badge showing ticket priority level with color-coded background/text.

**Selector:** `app-priority-badge`

**Location:** `projects/components/src/lib/components/priority-badge/`

**Template Structure:**
```
Badge (inline, 4px radius, padding 2px/8px)
  Text (10-11px, 500 weight)
```

**Inputs:**
- `@Input() priority: 'urgent' | 'high' | 'medium' | 'low' | 'complete'`

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
Button/Input (white bg, 8px radius, 1px #E5E7EB border, padding 8px/14px)
  Search icon (16x16, #6B7280)
  Placeholder text: "Search tickets..." (#9CA3AF, 13px)
```

**Inputs:**
- `@Input() placeholder: string` (default: "Search tickets...")

**Outputs:**
- `@Output() search: EventEmitter<string>`

---

### 2.11 ColumnHeaderComponent

**Purpose:** Header row for each kanban column on the desktop layout. Shows a colored dot, column name, and ticket count badge.

**Selector:** `app-column-header`

**Location:** `projects/components/src/lib/components/column-header/`

**Template Structure:**
```
Header row (full width, space-between)
  Left group (8px gap):
    Color dot (10x10 circle, column color)
    Column name (14px, 600 weight, #1A1A2E)
    Count badge (22x22 circle, tinted bg, colored text)
```

**Inputs:**
- `@Input() name: string`
- `@Input() count: number`
- `@Input() color: string` (hex color for dot and count badge)

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

The ticket card needs a full redesign:

```
Card (full width, white bg, 8px radius, 1px #E5E7EB border, vertical layout, 12px gap, 16px padding)
  Header row (space-between):
    Title (14px, 600, #1A1A2E)
    PriorityBadge (component)
  Description (13px, 400, #6B7280, full width)
  Footer row (space-between):
    Assignee group (6px gap):
      UserAvatar (size sm)
      Name text (12px, 400, #6B7280)
```

**Updated Inputs:**
- `@Input() ticket: Ticket` (existing)

**Dependencies to add:** PriorityBadgeComponent, UserAvatarComponent

**Notes:**
- Desktop variant uses a slightly different card style: `#FAFAFA` inner bg, 14px padding, 10px gap, 13px title, 12px description
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
Top Bar (full width, space-between)
  Left:
    Board name (24px, 700, #1A1A2E)
    Subtitle: "Manage and track your team's tasks" (14px, 400, #6B7280)
  Right:
    SearchBarComponent
    "New Ticket" button (primary bg, 8px radius, plus icon + text)
```

**Changes:**
- Replace the bare `<mat-icon>add</mat-icon>` with a styled "New Ticket" button
- Add board subtitle/description text
- Integrate SearchBarComponent
- Remove board name click handler (board selection moves to sidebar)

---

### 3.3 KanbanBoardComponent (Update)

**Current state:** Renders columns with `*ngFor` over boardStates, each as a `cdkDropList`. Shows board state name as a `<span>` and renders ticket components.

**Required changes to match design:**

**Desktop layout:**
```
Columns container (horizontal, fill, 20px gap)
  Per column:
    Column wrapper (fill width, fill height, white bg, 12px radius, 1px border, 16px padding, 12px gap)
      ColumnHeaderComponent (name, count, color)
      Ticket cards (scrollable, vertical stack, 12px gap)
```

**Mobile layout:**
- Show only the active column's tickets (driven by ColumnTabsComponent selection)
- Cards render in a vertical scrollable list with 12px gap

**Changes:**
- Wrap each column in a styled container (white bg, rounded corners, border)
- Replace the plain `<span>{{ boardState.name }}</span>` with `ColumnHeaderComponent`
- Add responsive layout: multi-column on desktop, single-column-with-tabs on mobile
- Keep the existing CDK drag-drop functionality

---

### 3.4 KanbanComponent (Update)

**Current state:** Renders `<app-kanban-board-controls>` and `<app-kanban-board>`.

**Required changes to match design:**

This component becomes the main layout orchestrator with responsive behavior:

**Mobile layout:**
```
AppHeaderComponent
BoardBarComponent
ColumnTabsComponent
Card area (scrollable, #F9FAFB bg, 16px padding)
  KanbanBoardComponent (single column mode)
FABComponent
UserDropdownComponent (conditional, overlay)
```

**Desktop layout:**
```
Horizontal layout (full viewport):
  SidebarComponent (260px fixed)
  Main content (#F9FAFB bg, 24px/32px padding):
    KanbanBoardControlsComponent (top bar)
    KanbanBoardComponent (multi-column mode)
  UserDropdownComponent (conditional, overlay)
```

**Changes:**
- Add responsive layout logic (CSS media queries or BreakpointObserver)
- Integrate new sub-components (header, sidebar, tabs, FAB)
- Add state for user dropdown visibility
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

**Current state:** Material form fields with basic layout in a dialog.

**Required changes:**
- Update dialog styling to match the design's card/panel aesthetic
- Use Inter font styling consistent with the design tokens
- Consider adding priority field to the ticket form (since the design shows priority badges on cards)
- Ensure the state dropdown maps to the board states shown in the design (Backlog, In Progress, Done)

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

## 5. Global Style Updates

### 5.1 Font Family

The design uses **Inter** throughout. The current app uses **Roboto** via Angular Material. Either:
- Switch the global font to Inter (update `styles.scss` and Material typography config)
- Or keep Roboto and accept the visual difference

Recommendation: Switch to Inter to match the design. Add to `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 5.2 CSS Custom Properties

Add a root-level custom properties block in `styles.scss` using the design tokens from Section 1.

### 5.3 Material Theme Override

Update the Material theme to use `#7D00FA` as the primary color instead of the current violet palette, and override default Material component styles (form fields, buttons, cards) to align with the design's border-radius, spacing, and typography.

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
