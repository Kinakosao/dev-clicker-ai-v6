# AI Core Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Transformers.js to power a dynamic narrative console, an AI-influenced stock market, and an intelligent mission generator.

**Architecture:** Use a dedicated `ai.js` module to manage model loading, caching, and inference. Transformers.js will run in the browser's main thread (with async calls) or a Web Worker to ensure UI responsiveness.

**Tech Stack:** Transformers.js (v3), JavaScript (ES6+), IndexedDB (for caching).

---

### Task 1: Setup Transformers.js & Base AI Module

**Files:**
- Modify: `index.html` (add CDN script)
- Create: `ai.js` (core AI logic)

- [ ] **Step 1: Add Transformers.js to index.html**
```html
<!-- Add before script.js -->
<script type="module">
  import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers';
  window.transformers = { pipeline, env };
</script>
```

- [ ] **Step 2: Create ai.js with initialization logic**
```javascript
const AI = {
    pipelines: {},
    async init() {
        // Configure env for browser caching
        transformers.env.allowLocalModels = false;
        transformers.env.useBrowserCache = true;
        writeConsole("Initialisation du Noyau IA...");
    },
    async loadModel(task, modelId) {
        if (this.pipelines[task]) return this.pipelines[task];
        this.pipelines[task] = await transformers.pipeline(task, modelId, {
            progress_callback: (info) => {
                if (info.status === 'progress') {
                    writeConsole(`Chargement ${task}: ${info.progress.toFixed(1)}%`);
                }
            }
        });
        return this.pipelines[task];
    }
};
export default AI;
```

- [ ] **Step 3: Commit**
```bash
git add index.html ai.js
git commit -m "feat(ai): setup transformers.js and base AI module"
```

### Task 2: Dynamic Narrative Console

**Files:**
- Modify: `ai.js` (add text generation)
- Modify: `script.js` (trigger AI logs)

- [ ] **Step 1: Add text generation to ai.js**
```javascript
// In AI object
async generateLog(context) {
    const pipe = await this.loadModel('text-generation', 'onnx-community/Llama-3.2-1B-Instruct-q4f16');
    const prompt = `Write a short, funny cyberpunk developer log about: ${context}. Keep it under 15 words.`;
    const output = await pipe(prompt, { max_new_tokens: 20, temperature: 0.7 });
    return output[0].generated_text.replace(prompt, '').trim();
}
```

- [ ] **Step 2: Trigger AI logs in script.js**
```javascript
// In buyUpgrade or similar
const log = await AI.generateLog(`Bought a ${u.name}`);
writeConsole(log, "ai");
```

- [ ] **Step 3: Commit**
```bash
git add ai.js script.js
git commit -m "feat(ai): add dynamic narrative console logs"
```

### Task 3: AI-Influenced Stock Market

**Files:**
- Modify: `ai.js` (add sentiment analysis)
- Modify: `script.js` (update STOCK logic)

- [ ] **Step 1: Add sentiment analysis to ai.js**
```javascript
async analyzeSentiment(text) {
    const pipe = await this.loadModel('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
    const result = await pipe(text);
    return result[0]; // { label: 'POSITIVE', score: 0.99 }
}
```

- [ ] **Step 2: Update stock logic in script.js**
```javascript
// Create news array and periodic trigger
const news = ["Tech giant suffers massive leak", "New AI breakthrough doubles efficiency"];
async function updateAIStock() {
    const headline = news[Math.floor(Math.random() * news.length)];
    const sentiment = await AI.analyzeSentiment(headline);
    const impact = sentiment.label === 'POSITIVE' ? 1.2 : 0.8;
    state.stock.price *= impact;
    writeConsole(`NEWS: ${headline}`, sentiment.label === 'POSITIVE' ? 'success' : 'danger');
}
```

- [ ] **Step 3: Commit**
```bash
git add ai.js script.js
git commit -m "feat(ai): implement AI-influenced stock market"
```
