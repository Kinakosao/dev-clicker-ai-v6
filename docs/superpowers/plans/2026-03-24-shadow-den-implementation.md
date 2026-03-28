# Shadow Den (Cyber-Casino) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a cyberpunk "Glitch-Wave" casino called "The Shadow Den" hosted by an AI dealer named Shadow, featuring Bit-Crash and Hex-Slots.

**Architecture:**
- UI integrated as a new tab ("DEN") in the left sidebar.
- Casino logic encapsulated in a new `casino.js` module.
- AI personality for Shadow integrated into `ai.js` using Transformers.js.
- Currency "Unstable Bits" (UB) added to the global game state.

**Tech Stack:** HTML5, CSS3 (Glitch/CRT effects), Vanilla JS (ES6 Modules), Transformers.js.

---

### Task 1: UI Foundation & Glitch-Wave Styles

**Files:**
- Modify: `index.html`
- Modify: `style.css`

- [ ] **Step 1: Add the "DEN" tab button and panel container.**
  - Add `<button class="tab-btn locked" id="tab-den" data-target="panel-den">DEN</button>` to the first `<nav class="tabs">`.
  - Add `<div id="panel-den" class="panel">` inside the first `.panel-container`.
  - Inside `panel-den`, add a placeholder for Shadow and the game areas.

- [ ] **Step 2: Add CSS for the "Glitch-Wave" aesthetic.**
  - Define `@keyframes glitch-anim` and `@keyframes scanline`.
  - Add styles for `.panel-den`, `.shadow-avatar` (pink neon border), and `.ub-counter`.

- [ ] **Step 3: Commit UI changes.**
  ```bash
  git add index.html style.css
  git commit -m "feat(ui): add DEN tab and glitch-wave base styles"
  ```

---

### Task 2: Casino State & UB Currency

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Update the `state` object.**
  - Add `casino: { ub: 0, totalUB: 0 }` to the initial `state`.
  - Update `updateUI()` to display UB if the DEN is unlocked.

- [ ] **Step 2: Implement UB drop logic in `addLines()`.**
  - Add a 1% chance on manual clicks to gain 1 UB.
  - Trigger `FX.spawnText` with "UB!" in pink.

- [ ] **Step 3: Implement the "DEN" unlock check.**
  - In `updateUI()`, check if `state.totalLines >= 1000000`. If so, remove `locked` from `#tab-den`.

- [ ] **Step 4: Commit state changes.**
  ```bash
  git add script.js
  git commit -m "feat(logic): add Unstable Bits currency and DEN unlock logic"
  ```

---

### Task 3: Shadow's AI Personality

**Files:**
- Modify: `ai.js`

- [ ] **Step 1: Add `generateShadowLog` to the `AI` object.**
  - Use a prompt that enforces a "snarky cyberpunk dealer" persona.
  - Contexts: "win", "loss", "crash", "jackpot".

- [ ] **Step 2: Update `AI.init()` to handle Shadow's loading state.**

- [ ] **Step 3: Commit AI changes.**
  ```bash
  git add ai.js
  git commit -m "feat(ai): implement Shadow AI personality and dealer logs"
  ```

---

### Task 4: Bit-Crash Mini-Game

**Files:**
- Create: `casino.js`
- Modify: `index.html`
- Modify: `script.js` (to import casino)

- [ ] **Step 1: Create `casino.js` with the `BitCrash` class.**
  - Logic: `multiplier` starts at 1.0, increases every 100ms.
  - `crashPoint` is pre-determined using a weighted random (favoring low multipliers).

- [ ] **Step 2: Add Bit-Crash UI to `index.html`.**
  - Multiplier display, "BET" input, "CASH OUT" button.

- [ ] **Step 3: Connect UI to `casino.js` logic.**

- [ ] **Step 4: Commit Bit-Crash.**
  ```bash
  git add casino.js index.html script.js
  git commit -m "feat(casino): implement Bit-Crash mini-game"
  ```

---

### Task 5: Hex-Slots Mini-Game

**Files:**
- Modify: `casino.js`
- Modify: `index.html`

- [ ] **Step 1: Add `HexSlots` class to `casino.js`.**
  - Logic: 3 reels, characters 0-F.
  - Payout mapping (2-match, 3-match, F-F-F).

- [ ] **Step 2: Add Hex-Slots UI to `index.html`.**
  - Reel containers, "SPIN" button.

- [ ] **Step 3: Implement "System Overload" bonus.**
  - If F-F-F, set a temporary global multiplier in `state`.

- [ ] **Step 4: Commit Hex-Slots.**
  ```bash
  git add casino.js index.html
  git commit -m "feat(casino): implement Hex-Slots and System Overload bonus"
  ```
