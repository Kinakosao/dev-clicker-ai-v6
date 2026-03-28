# Singularity & Gameplay Mechanics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Prestige (Singularity) system, interactive Hacker Attacks, and a dynamic Mission/Contract system.

**Architecture:** Extend `script.js` with dedicated controllers for Prestige and Hacker events. Use CSS animations in `style.css` for the "Singularity Glitch" and "Hacker Alert" effects.

**Tech Stack:** Vanilla JS, CSS3 Animations.

---

### Task 1: The Singularity (Prestige System)

**Files:**
- Modify: `script.js` (add prestige logic)
- Modify: `style.css` (add glitch animation)

- [ ] **Step 1: Implement Prestige logic in script.js**
```javascript
function triggerSingularity() {
    const gain = Math.floor(Math.sqrt(state.totalLines / 1e12));
    if (gain < 1) return;

    state.prestige += gain;
    state.lines = 0;
    UPGRADES.forEach(u => state.upgrades[u.id] = 0);
    state.synergies = [];
    
    document.body.classList.add('singularity-glitch');
    setTimeout(() => {
        document.body.classList.remove('singularity-glitch');
        initUI();
        updateUI();
        writeConsole(`SINGULARITÉ ATTEINTE : +${gain} niveaux.`, "success");
    }, 2000);
}
```

- [ ] **Step 2: Add Glitch CSS in style.css**
```css
@keyframes glitch {
    0% { transform: translate(0) }
    20% { transform: translate(-5px, 5px) }
    40% { transform: translate(-5px, -5px) }
    60% { transform: translate(5px, 5px) }
    80% { transform: translate(5px, -5px) }
    100% { transform: translate(0) }
}
.singularity-glitch {
    animation: glitch 0.2s infinite;
    filter: hue-rotate(90deg) invert(1);
    background: white;
}
```

- [ ] **Step 3: Commit**
```bash
git add script.js style.css
git commit -m "feat(gameplay): implement Singularity prestige system"
```

### Task 2: Hacker Attack Mini-game

**Files:**
- Modify: `index.html` (ensure overlay is ready)
- Modify: `script.js` (add attack logic)
- Modify: `style.css` (alert styles)

- [ ] **Step 1: Implement startHackerAttack() in script.js**
```javascript
function startHackerAttack() {
    if (isFirewall || isHacker) return;
    isHacker = true;
    hackerHealth = 100;
    document.getElementById('hacker-overlay').style.display = 'flex';
    AudioEngine.playAlert();
    
    const interval = setInterval(() => {
        if (!isHacker) { clearInterval(interval); return; }
        hackerHealth -= 2; // Decay
        if (hackerHealth <= 0) failHacker();
        updateHackerUI();
    }, 1000);
}

function winHacker() {
    isHacker = false;
    document.getElementById('hacker-overlay').style.display = 'none';
    const reward = getLPS() * 300;
    addLines(reward);
    writeConsole("ATTAQUE REPOUSSÉE : Bonus de données !", "success");
}
```

- [ ] **Step 2: Add failing/updating UI for hacker**
```javascript
function failHacker() {
    isHacker = false;
    document.getElementById('hacker-overlay').style.display = 'none';
    state.lines = Math.floor(state.lines * 0.8);
    writeConsole("SYSTÈME COMPROMIS : 20% des données perdues.", "danger");
}
```

- [ ] **Step 3: Commit**
```bash
git add script.js
git commit -m "feat(gameplay): add interactive hacker attack mini-game"
```

### Task 3: Missions & Contracts System

**Files:**
- Modify: `script.js` (contract generation)
- Modify: `index.html` (tab container)

- [ ] **Step 1: Implement generateContract()**
```javascript
function generateContract() {
    const target = state.totalLines * 1.5 + 1000;
    const reward = target * 0.2;
    const contract = {
        id: Date.now(),
        desc: `Compiler ${format(target)} lignes`,
        target,
        reward,
        active: true
    };
    contracts.push(contract);
    renderContracts();
}
```

- [ ] **Step 2: Add contract checking logic**
```javascript
function checkContracts() {
    contracts.forEach(c => {
        if (c.active && state.totalLines >= c.target) {
            c.active = false;
            addLines(c.reward);
            writeConsole(`CONTRAT REMPLI : +${format(c.reward)} LDC`, "success");
        }
    });
}
```

- [ ] **Step 3: Commit**
```bash
git add script.js
git commit -m "feat(gameplay): implement dynamic mission and contract system"
```
