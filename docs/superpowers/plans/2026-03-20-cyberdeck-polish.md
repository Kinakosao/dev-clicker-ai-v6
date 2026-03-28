# Cyberdeck Polish (UI/UX & Sound) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance visual and auditory feedback with animated SVG elements, procedural sound synthesis, and advanced particle effects.

**Architecture:** Add animation triggers to the existing SVG keyboard. Extend `sound.js` with dynamic parameter modulation. Improve `FX.spawn` in `script.js` for better visual feedback.

**Tech Stack:** Vanilla JS, SVG, Web Audio API, CSS Transitions.

---

### Task 1: Interactive SVG Keyboard

**Files:**
- Modify: `script.js` (add SVG interaction)
- Modify: `style.css` (add SVG animations)

- [ ] **Step 1: Add animation logic to script.js**
```javascript
function animateKey() {
    const keys = document.querySelectorAll('#keyboard-svg path');
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    randomKey.classList.add('key-pressed');
    setTimeout(() => randomKey.classList.remove('key-pressed'), 100);
}

// Link to click and keydown events
document.addEventListener('keydown', () => {
    animateKey();
    addLines(getClickPower(), true);
});
```

- [ ] **Step 2: Add SVG styles in style.css**
```css
#keyboard-svg path {
    transition: transform 0.1s, fill 0.1s;
    transform-origin: center;
}
.key-pressed {
    transform: scale(0.9) translateY(2px);
    fill: var(--accent-primary);
    filter: drop-shadow(0 0 5px var(--accent-primary));
}
```

- [ ] **Step 3: Commit**
```bash
git add script.js style.css
git commit -m "feat(ui): add interactive SVG keyboard animations"
```

### Task 2: Advanced Procedural Audio

**Files:**
- Modify: `sound.js` (dynamic audio modulation)

- [ ] **Step 1: Update playClick in sound.js to use LPS**
```javascript
playClick() {
    if (!this.ctx || !this.enabled) return;
    const lpsFactor = Math.min(2, 1 + (getLPS() / 1000));
    
    const osc = this.ctx.createOscillator();
    osc.frequency.setValueAtTime(150 * lpsFactor, this.ctx.currentTime);
    // ... rest of logic
}
```

- [ ] **Step 2: Add procedural "background hum" proportional to LPS**
```javascript
updateHum() {
    // Implement a low frequency oscillator (LFO) that gains volume/pitch with LPS
}
```

- [ ] **Step 3: Commit**
```bash
git add sound.js
git commit -m "feat(audio): implement dynamic procedural sound variations"
```

### Task 3: Neon Particle Feedback

**Files:**
- Modify: `script.js` (FX engine enhancement)

- [ ] **Step 1: Enhance FX.spawn with floating text**
```javascript
spawnText(x, y, text, type="normal") {
    const el = document.createElement('div');
    el.className = `floating-text ${type}`;
    el.textContent = text;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}
```

- [ ] **Step 2: Add floating text styles in style.css**
```css
.floating-text {
    position: fixed;
    pointer-events: none;
    font-family: 'Fira Code', monospace;
    font-weight: bold;
    animation: floatUp 1s ease-out forwards;
    z-index: 1000;
}
@keyframes floatUp {
    to { transform: translateY(-50px); opacity: 0; }
}
```

- [ ] **Step 3: Commit**
```bash
git add script.js style.css
git commit -m "feat(ui): add neon particle and floating text feedback"
```
