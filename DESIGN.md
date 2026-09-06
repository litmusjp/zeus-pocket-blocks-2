---
version: alpha
name: Pocket Arcade / Aurora Drift
description: A calm, tactile pocket arcade interface for short mobile falling-shapes runs.
colors:
  ink: "#F5F7FF"
  primary: "#7EF2C1"
  secondary: "#76A7FF"
  tertiary: "#FFCF70"
  danger: "#FF7F9E"
  violet: "#BB8CFF"
  cyan: "#62D5EF"
  lime: "#D2ED77"
  night: "#0B1020"
  panel: "#131A2B"
  panelRaised: "#1B2438"
  line: "#33415D"
  muted: "#AAB6CC"
  focus: "#FFFFFF"
typography:
  display:
    fontFamily: ui-rounded, system-ui, -apple-system, "Segoe UI", sans-serif
    fontSize: 1.25rem
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  heading:
    fontFamily: ui-rounded, system-ui, -apple-system, "Segoe UI", sans-serif
    fontSize: 0.75rem
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.10em"
  body:
    fontFamily: ui-rounded, system-ui, -apple-system, "Segoe UI", sans-serif
    fontSize: 1rem
    fontWeight: 500
    lineHeight: 1.45
  metric:
    fontFamily: ui-rounded, system-ui, -apple-system, "Segoe UI", sans-serif
    fontSize: 1.2rem
    fontWeight: 800
    lineHeight: 1
    fontFeature: tabular-nums
  micro:
    fontFamily: ui-rounded, system-ui, -apple-system, "Segoe UI", sans-serif
    fontSize: 0.625rem
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.12em"
spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
rounded:
  sm: 10px
  md: 14px
  lg: 18px
  pill: 999px
components:
  primary-action:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.night}"
    rounded: "{rounded.md}"
    padding: 14px
    height: 52px
  secondary-action:
    backgroundColor: "{colors.panelRaised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 12px
    height: 48px
  icon-action:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    size: 44px
  metric-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 12px
  mission-card:
    backgroundColor: "{colors.panelRaised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 16px
  status-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.night}"
    rounded: "{rounded.sm}"
  shape-accent:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.night}"
    rounded: "{rounded.sm}"
  shape-accent-cyan:
    backgroundColor: "{colors.cyan}"
    textColor: "{colors.night}"
    rounded: "{rounded.sm}"
  shape-accent-lime:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.night}"
    rounded: "{rounded.sm}"
  surface-border:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.muted}"
    rounded: "{rounded.sm}"
  focus-ring:
    backgroundColor: "{colors.focus}"
    textColor: "{colors.night}"
    rounded: "{rounded.sm}"
  divider:
    backgroundColor: "{colors.line}"
    textColor: "{colors.muted}"
    rounded: "{rounded.sm}"
---

## Overview

**Design mode:** Operate + Experience. The game board is the hero; chrome exists only to support a one-thumb, two-to-eight-minute session. The visual world is **Aurora Drift**: deep blue-black space, soft mint/blue aurora accents, and rounded translucent arcade modules. It is deliberately not a branded block-game look: no familiar branded typography, no copied presentation, and no iconic branded color mapping.

The first impression should feel like opening a tiny premium arcade cabinet in the hand: quiet, legible, immediate. Avoid noisy gradients behind text, decorative clutter, and skeuomorphic buttons.

## Colors

- `night` is the page field and board surround. Use a very subtle radial highlight near the top only; never put a competing glow behind the board.
- `panel` is the default HUD surface; `panelRaised` is reserved for selected controls, mission cards, and overlays.
- `primary` is the single high-emphasis action color: Start, Resume, and the active Pulse state. Pair it with `night` text for contrast.
- Shape colors are the seven accent tokens. Each cell should have a solid readable core plus a 1px top/left highlight; color must never be the only state signal.
- `danger` communicates game-over, invalid action, or destructive reset; do not use it for ordinary emphasis.
- Light theme should invert surfaces to a warm, low-glare mist rather than pure white while preserving semantic accent colors and contrast.

## Typography

Use the system rounded stack for instant startup and native-feeling mobile rendering. Display/title is compact and confident; metrics use tabular numerals so score changes do not cause layout shift. HUD labels are uppercase micro-labels, but instructional copy uses sentence case and at least 14px equivalent.

Hierarchy: game title → score metric → board → mode/mission → controls. Never make labels compete with the board.

## Layout

### Mobile portrait (320–599px)

- Page padding: `12px` horizontal, `12px` top, safe-area inset bottom.
- Header: logo left; sound/theme icon actions right. Keep actions at least `44×44px`.
- Metrics: four equal columns; labels may abbreviate to Score / Best / Rows / Lvl below 360px.
- Main play area: board first, then a compact rail containing Next, Hold, and Pulse. On widths under 390px, Next and Hold become a two-column strip below the board; Pulse becomes a full-width action row.
- Controls: two rows. Primary movement row is `←  ↻  →  Ⅱ`; utility row is `Hold  ·  Drop  ·  ↓`. Every target is at least `52px` tall with `8px` gaps.
- Mission card follows controls and is skimmable in one line, with progress bar beneath.

### Wide phone / landscape (600–899px)

- Constrain app shell to `620px`; do not stretch the board beyond comfortable thumb reach.
- Use a two-column play region: board at `min(66vw, 360px)` and a 116px utility rail.
- Keep controls immediately below the board/rail, not at the far edge of the viewport.

### Desktop (900px+)

- Preserve the phone-like shell, centered only at the page level. Add a small “Keyboard: arrows / Space / C” hint beneath the mission; do not turn it into a dashboard.

Board proportions remain `10:20`; board shell radius `18px`, inner radius `11px`. Use a 1px border and restrained shadow. The ghost piece is 20–28% opacity with an outline; locked cells are opaque. Provide a visible pause veil without hiding the board state.

## Components

### Header

Logo mark: an original four-cell “spark” or orbit glyph inside a mint-to-blue tile, not an arrow or familiar game emblem. Subtitle: `MAKE SPACE FOR A MINUTE`. Sound and theme use icon-only buttons with accessible labels and pressed state.

### Start / game-over overlay

Overlay uses a dark scrim at 78% opacity and a single raised card. Start copy: `A small reset for your brain.` Primary action: `Start a run`. Game over shows score, rows, best-run result, and two actions: `Play again` (primary) and `View runs` (secondary). Do not auto-start or trap focus.

### Metrics

Four compact cards; labels muted, values bright. Best score must visually distinguish a new record with a brief mint ring/“NEW BEST” badge, respecting reduced motion.

### Preview rail

Next and Hold cards use identical framing for scanability. Label top-left, canvas centered, empty Hold state reads `—` rather than showing a disabled-looking control. Pulse card includes a 4px progress track, percentage, and a full-width button. Disabled Pulse is visibly disabled but still legible.

### Mission

Use one rotating mission, never a wall of quests. Example: `Clear 3 rows` with `1 / 3` and a progress track. Completion state changes copy to `Mission complete` and adds a small checkmark; no confetti explosion.

### Controls

Buttons have a tactile pressed state (`translateY(1px)`, darker surface, no scale bounce). Movement controls use symbols plus screen-reader labels. Hold and Drop use text + glyph. Keyboard focus uses a 2px white ring with 2px offset; never remove outlines.

## Interaction and motion

- Start-to-play path: landing → one tap → active board, with no menu required.
- Tap board = rotate only when the gesture displacement is below 24px; swipe threshold `24px`, with horizontal priority only when horizontal displacement exceeds vertical by 8px.
- Haptics: short tick on rotate/lock, stronger pulse on row clear, success pulse on mission completion. Respect the haptics preference and feature-detect support.
- Motion: 120–180ms transitions for controls and overlays. Row clear may flash once; no perpetual animated backgrounds. Under `prefers-reduced-motion`, remove flashes, transforms, and particle effects while preserving state changes.
- Pause must be a true state, with a clear `Resume` action and no elapsed-time jump on return.

## Accessibility and resilient states

- Body and board must prevent scroll/pull-to-refresh during play without breaking page navigation outside the game.
- All icon actions expose `aria-label`, `aria-pressed` where applicable, and a visible focus style.
- Use live region copy for `Row cleared`, `Mission complete`, `Paused`, and `Run complete`; keep it visually hidden but not `display:none`.
- Maintain at least 4.5:1 contrast for normal text and 3:1 for large text/UI boundaries. Shape cells need outline/value differences in addition to hue.
- Respect `prefers-color-scheme` only when theme preference is `system`.
- Storage failure, malformed migration, unsupported haptics/audio, and no-local-best states must silently fall back without blocking play.

## Do's and Don'ts

- **Do** keep the board visually dominant, controls reachable, and the next action obvious.
- **Do** use generous targets, compact copy, and deterministic visual feedback.
- **Do** celebrate skill with restrained “flow” moments: combo badge, pulse charge, mission completion.
- **Don't** add login, analytics, social feeds, ads, or backend-dependent UI.
- **Don't** use tiny desktop-style controls, hover-only affordances, or color as the sole feedback channel.
- **Don't** mimic branded game screens, terminology, fonts, or presentation conventions.

## Handoff acceptance criteria

1. At 320px portrait, the board, controls, and primary action fit without horizontal scrolling.
2. At 390px portrait, Next/Hold/Pulse remain readable without shrinking touch targets.
3. At landscape phone width, board and rail remain balanced and controls stay reachable.
4. Keyboard and screen-reader labels are usable; focus is visible.
5. Dark/light/system themes preserve hierarchy and contrast.
6. Reduced motion disables decorative animation, not functional feedback.
7. Start, pause, restart, mission completion, and new-best states each have a distinct visual treatment.

## CSS foundation

```css
:root {
  --bg: #0b1020; --surface: #131a2b; --surface-raised: #1b2438;
  --ink: #f5f7ff; --muted: #aab6cc; --line: #33415d;
  --accent: #7ef2c1; --accent-2: #76a7ff; --warning: #ffcf70;
  --danger: #ff7f9e; --r-sm: 10px; --r-md: 14px; --r-lg: 18px;
  --space-1: 4px; --space-2: 8px; --space-3: 12px;
  --space-4: 16px; --space-5: 20px; --space-6: 24px;
  --tap: 44px; --control: 52px;
}
@media (prefers-color-scheme: light) {
  :root[data-theme="system"] { --bg:#eef2f7; --surface:#ffffff; --surface-raised:#e4eaf3; --ink:#152039; --muted:#55627a; --line:#c6d0df; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
```
