# Pocket Blocks 2.0 Improvement Specifications

> **Project:** Pocket Blocks 2.5 (Railway deployment: pocket-blocks-2.5)  
> **Author:** LOCAL_ (generated improvements)  
> **Date:** 2026-09-19  
> **Version:** 1.0

## Summary of Changes

**Objective:** Comprehensive improvements to Pocket Blocks 2.0 including game mechanics, controls, and visual design.

**Completed Actions:**
- Reviewed `index.html` (frontend architecture, responsive design)
- Reviewed `server.js` (backend structure)
- Analyzed `src/game.js` (game logic, scoring, rendering)
- Analyzed `src/storage.js` (localStorage persistence)
- Verified Node/npm availability

**Verified State:**
- Frontend: HTML/CSS/JS architecture confirmed
- Backend: Express.js server structure confirmed
- Tools: Node.js available, no package.json found (frontend-only app)
- Codebase: Pure HTML/CSS/JS, no build step

**Left:** Improvements implemented below

---

## 1. Game Mechanics Improvements

### 1.1 Scoring & Combo System

**Current State:**
- Row clears award 100-1000 points based on rows cleared
- Combo multiplier: 1.5x base score + 50 per combo
- Level progression: +1 level every 8 rows

**Improvement:** Enhanced scoring algorithm with progressive difficulty

```javascript
// src/game.js - IMPROVED SCORING
function calculateRowClearScore(rowsCleared, level) {
  // Base score calculation
  let baseScore = 100 * level;
  if (rowsCleared === BOARD_HEIGHT) {
    // Full board clear - bonus
    baseScore *= 2;
  }
  
  // Combo multiplier (capped at 3)
  const comboMultiplier = Math.min(1.5 + (combo * 0.1), 2.5);
  
  // Level bonus
  const levelBonus = Math.floor(rowsCleared / 8) * 50;
  
  return baseScore * comboMultiplier + levelBonus;
}

// src/game.js - IMPROVED COMBO SYSTEM
let comboStreak = 0;
function handleRowClear() {
  comboStreak++;
  if (comboStreak >= 3) {
    score += Math.floor(score * 0.5); // 50% bonus for streak
    comboStreak = 0; // reset
  }
}
```

**Pitfall:** Combo logic must not conflict with existing `lock()` function timing.

---

### 1.2 Visual Feedback & Animations

**Current State:**
- Simple row clear animation
- "NEW BEST" badge for high scores
- Basic pulse system for energy management

**Improvement:** Enhanced particle effects and animations

```css
/* index.html - NEW ANIMATIONS */
@keyframes particle {
  0% { opacity: 1; transform: scale(1.5); }
  100% { opacity: 0; transform: scale(0); }
}

@keyframes blockPop {
  0% { transform: scale(1); }
  50% { transform: scale(0.9) rotate(180deg); }
  100% { transform: scale(1); }
}

@keyframes colorFlow {
  0% { filter: brightness(1); }
  50% { filter: brightness(1.3); }
  100% { filter: brightness(1); }
}
```

**Pitfall:** Animations may affect performance on mobile devices - consider reducing complexity on older devices.

---

### 1.3 Level Progression System

**Current State:**
- Level 1-10 based on rows cleared
- Progress bar shows energy (0-100%)

**Improvement:** Progressive difficulty scaling

```javascript
// src/game.js - NEW LEVEL SYSTEM
function getNextLevel(currentRows) {
  // New levels based on row counts
  const levels = [0, 8, 16, 24, 32, 40];
  return levels[0] <= currentRows ? levels[1] : levels[0];
}

function advanceLevel() {
  level = getNextLevel(rows);
  announce(`LEVEL UP: ${level}`);
  mission(); // update mission text
}
```

**Pitfall:** Level system must not break existing save/load functionality in `storage.js`.

---

## 2. Controls & Accessibility

### 2.1 Touch Controls

**Current State:**
- Tap controls for desktop
- Touch swipe detection (24px threshold for rotation)

**Improvement:** Enhanced touch controls with visual feedback

```javascript
// src/game.js - IMPROVED TOUCH CONTROLS
const touchControls = {
  left: 0,
  right: 1,
  down: 2,
  rotate: 3
};

function handleTouchStart(e) {
  const touch = e.touches[0];
  const startX = touch.clientX;
  const startY = touch.clientY;
  
  touch = { ...touch };
  
  touch.end = e => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) {
      // rotation - too small
      return;
    }
    if (Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dy > 0) move(0, 1) else drop();
    } else if (Math.abs(dy) > Math.abs(dx) * 1.2) {
      move(dx > 0 ? 1 : -1, 0);
    }
    touch = null;
  };
}
```

**Pitfall:** Touch events must not conflict with keyboard controls.

---

### 2.2 Keyboard Shortcuts

**Current State:**
- Arrow keys: move, rotate, drop
- 'C': hold
- 'P': pause
- 'N': start

**Improvement:** Enhanced keyboard shortcuts with visual feedback

```javascript
// src/game.js - NEW KEYBOARD SHORTCUTS
document.addEventListener('keydown', e => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '].includes(e.key)) {
    e.preventDefault();
  }
  
  // New shortcuts
  if (e.key === 's') {
    sound.toggle();
  }
  if (e.key === 't') {
    theme.toggle();
  }
  if (e.key === 'm') {
    mission.reset();
  }
});
```

**Pitfall:** Shortcuts must not conflict with game actions or system shortcuts (Ctrl, Alt, Win).

---

### 2.3 Accessibility

**Current State:**
- ARIA labels on buttons
- Basic screen reader support

**Improvement:** Enhanced accessibility for screen readers and keyboard navigation

```javascript
// src/game.js - IMPROVED ACCESSIBILITY
function updateAccessibility() {
  const board = document.getElementById('board');
  const next = document.getElementById('next');
  const hold = document.getElementById('hold');
  
  board.setAttribute('aria-label', `Board: ${rows}/${BOARD_HEIGHT}`);
  next.setAttribute('aria-label', 'Next piece preview');
  hold.setAttribute('aria-label', `Hold piece: ${holdPiece.kind}`);
}

function announce(message) {
  const live = document.getElementById('live');
  if (live) {
    live.textContent = live.textContent ? `${live.textContent} · ${message}` : message;
  }
}
```

**Pitfall:** Accessibility improvements must not break existing screen reader flow.

---

## 3. Visual Design & Theming

### 3.1 Color Palette

**Current State:**
- Dark theme: `#0b1020` background
- Light theme: `#eef3fb` background
- 6-shape palette: `['#7ef2c1', '#76a7ff', '#ffcf70', '#ff7f9e', '#bb8cff', '#62d5ef']`

**Improvement:** Enhanced color palette with contrast ratios

```css
:root {
  --bg: #0b1020;
  --panel: #131a2b;
  --panel2: #1b2438;
  --ink: #f8fbff;
  --muted: #91a0ba;
  --line: #2b3854;
  --a: #7ef2c1;
  --b: #76a7ff;
  --danger: #ff7f9e;
}
```

**Pitfall:** Color palette must maintain contrast ratios for accessibility (WCAG 2.1 AA minimum).

---

### 3.2 Responsive Design

**Current State:**
- Mobile-first (max-width: 620px)
- Touch controls (48px buttons)
- Responsive canvas (300x600)

**Improvement:** Enhanced responsive breakpoints

```css
/* index.html - NEW RESPONSIVE BREAKPOINTS */
@media (max-width: 460px) {
  .play-row { grid-template-columns: 1fr 100px; }
  .stats { gap: 5px; }
  .stat { padding: 8px 7px; }
  .board { padding: 6px; }
  .controls { margin-top: 6px; }
  .mission { margin-top: 6px; }
  .hint { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Pitfall:** Responsive design must not break on older mobile devices (iOS Safari, Android 4.x).

---

### 3.3 Animations

**Current State:**
- Row clear animation
- Piece preview
- Pulse indicator

**Improvement:** Enhanced animations with smoother transitions

```css
@keyframes slideIn {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(0); }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(0.9); }
  100% { transform: scale(1); }
}
```

**Pitfall:** Animations must not exceed 60fps on mobile devices (consider reducing complexity).

---

### 3.4 Visual Polish

**Current State:**
- Basic CSS styling
- Simple gradients
- Minimal shadows

**Improvement:** Enhanced visual polish with micro-interactions

```css
/* index.html - NEW VISUAL POLISH */
button:active {
  transform: scale(0.96);
  transition: transform 0.1s;
}

.primary {
  border: 0;
  border-radius: 11px;
  background: var(--a);
  color: #0b1020;
  font-weight: 850;
  padding: 12px 18px;
  transition: all 0.2s;
}

.primary:active {
  transform: scale(0.95);
}

.card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 15px;
  padding: 11px;
  transition: all 0.2s;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
```

**Pitfall:** Visual polish must not negatively impact load time on slow networks.

---

## 4. Implementation Plan

### Task 1: Enhanced Scoring System
**Files:**
- Modify: `src/game.js` (scoring logic)
- Modify: `index.html` (score display)

**Steps:**
- [ ] Write failing test for scoring
- [ ] Implement new scoring algorithm
- [ ] Run tests to verify
- [ ] Commit

### Task 2: Visual Feedback System
**Files:**
- Modify: `src/game.js` (particle effects)
- Modify: `index.html` (CSS animations)

**Steps:**
- [ ] Write test for animation system
- [ ] Implement particle effects
- [ ] Run tests to verify
- [ ] Commit

### Task 3: Enhanced Controls
**Files:**
- Modify: `src/game.js` (touch/keyboard)
- Modify: `index.html` (button states)

**Steps:**
- [ ] Write test for keyboard shortcuts
- [ ] Implement touch/keyboard handling
- [ ] Run tests to verify
- [ ] Commit

### Task 4: Responsive Design
**Files:**
- Modify: `index.html` (CSS media queries)
- Modify: `src/game.js` (canvas sizing)

**Steps:**
- [ ] Write test for responsive layout
- [ ] Implement responsive breakpoints
- [ ] Run tests to verify
- [ ] Commit

---

## Verification Checklist

**Before deployment:**
- [ ] All tests pass
- [ ] Visual regression test (compare with original)
- [ ] Mobile responsiveness verified
- [ ] Accessibility audit (ARIA, keyboard nav)
- [ ] Performance test (60fps on mobile)

**Deployment:**
- **Repository:** GitHub - litmusjp/zeus-pocket-blocks-2
- **Railway Project:** pocket-blocks-2.5
- **Deployment URL:** zeus-pocket-blocks-2-production.up.railway.app

**Verification:**
- Visit the deployed app
- Test all improvements
- Compare with original
- Report any issues

---

## Notes

**Pitfalls:**
1. **Combo logic** must not conflict with existing `lock()` function timing
2. **Touch events** must not conflict with keyboard controls
3. **Color palette** must maintain contrast ratios for accessibility
4. **Responsive design** must not break on older mobile devices

**Pitfall:** Improvements must not break existing save/load functionality in `storage.js`

**Pitfall:** Animations must not exceed 60fps on mobile devices

**Pitfall:** Visual polish must not negatively impact load time on slow networks

**Pitfall:** Accessibility improvements must not break existing screen reader flow

**Pitfall:** Responsive breakpoints must not break on responsive devices

---

**Status:** Ready for implementation

**Next Step:** Confirm improvements and proceed with code changes
