# Nova: The Evolving AI Co-Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Nova, a reactive AI Co-Pilot that evolves based on player behavior and provides tactical stock tips, automation, and narrative missions.

**Architecture:**
- **UI:** A dedicated HUD element in the right sidebar.
- **Logic:** Evolution system tracking trades, buildings, and clicks in `script.js`.
- **AI:** Mission generation via Transformers.js in `ai.js`.
- **State:** Persistent evolution progress in `localStorage`.

**Tech Stack:** HTML/CSS, Vanilla JS, Transformers.js.

---

### Task 1: UI Foundation & HUD Styling

**Files:**
- Modify: `index.html`
- Modify: `style.css`

- [ ] **Step 1: Add Nova HUD to `index.html`.**
  - Place `<div id="nova-hud">` above the "Intel" tab.
  - Include three `<div class="nova-progress">` bars for Tactical, Automation, and Narrative.
  - Add an `<div id="nova-message">` area for proactive tips.

- [ ] **Step 2: Define Nova's Cyan Theme in `style.css`.**
  - Colors: Primary `#38bdf8`, Glow `0 0 10px rgba(56, 189, 248, 0.5)`.
  - Animation: `@keyframes nova-pulse` for the HUD border.

- [ ] **Step 3: Commit UI changes.**
  ```bash
  git add index.html style.css
  git commit -m "feat(ui): add Nova HUD and cyan theme styles"
  ```

---

### Task 4: Tactical Module (Stock Prediction)

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Hook into the Stock Market.**
  - Update `STOCK.update()` to calculate the next price *before* updating the state.
  - If Tactical module is unlocked, Nova displays "PREDICTION: BULLISH" or "PREDICTION: BEARISH" 10 seconds ahead.

- [ ] **Step 2: Implement the Profit Bonus.**
  - Update `sellStock()` logic to add a 5% bonus if the Tactical module is active.

- [ ] **Step 3: Commit Tactical module.**
  ```bash
  git add script.js
  git commit -m "feat(nova): implement Tactical module with stock prediction"
  ```

---

### Task 5: Automation Module (Auto-Buyer)

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Implement the Auto-Buyer loop.**
  - Create a function that checks for the cheapest available building every 2 seconds.
  - Buy only if `state.lines >= cost * 2` (safety buffer).

- [ ] **Step 2: Add UI toggle.**
  - Add a "AUTO-BUY" checkbox/toggle in the Nova HUD.

- [ ] **Step 3: Implement Click Bonus.**
  - Update `addLines()` to track 100-click cycles and apply a +10% LPS bonus.

- [ ] **Step 4: Commit Automation module.**
  ```bash
  git add script.js
  git commit -m "feat(nova): implement Automation module and auto-buyer"
  ```

---

### Task 6: Narrative Module (AI Missions)

**Files:**
- Modify: `ai.js`
- Modify: `script.js`

- [ ] **Step 1: Add Mission Generation to `ai.js`.**
  - Implement `AI.generateNovaMission()` using the `text-generation` pipeline.
  - Prompt: "Generate a cyberpunk mission objective for a dev: ${goal} lines in ${time} min."

- [ ] **Step 2: Add AI Synergies Tab.**
  - Unlock the "Synergy" tab and add 3-5 new AI-specific synergistic upgrades.

- [ ] **Step 3: Commit Narrative module.**
  ```bash
  git add ai.js script.js
  git commit -m "feat(nova): implement Narrative module and dynamic AI missions"
  ```
