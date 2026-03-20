/**
 * Dev Clicker v6.0 - The Singularity Core
 */

// --- Data ---
const UPGRADES = [
    { id: 'script', name: 'Bash Script', cost: 15, lps: 1, desc: 'Automatisation basique.' },
    { id: 'freelance', name: 'Freelance', cost: 100, lps: 5, desc: 'Codeur externe.' },
    { id: 'server', name: 'Serveur Dédié', cost: 1100, lps: 22, desc: 'Hébergement haute performance.' },
    { id: 'ai', name: 'IA Génératrice', cost: 12000, lps: 95, desc: 'L\'IA qui code pour vous.' },
    { id: 'datacenter', name: 'Data Center', cost: 130000, lps: 480, desc: 'Infrastructure massive.' },
    { id: 'neural', name: 'Lien Neural', cost: 1400000, lps: 2800, desc: 'Interface cerveau-machine.' }
];

const SYNERGIES = [
    { id: 'syn_1', name: 'Optimisation IA', req: { ai: 10, freelance: 50 }, mult: 2, target: 'freelance', desc: 'Les IA guident les freelances : Freelances x2.' },
    { id: 'syn_2', name: 'Cloud Computing', req: { server: 50, datacenter: 5 }, mult: 1.5, target: 'global', desc: 'Architecture optimisée : Global x1.5.' },
    { id: 'syn_3', name: 'Singularité', req: { neural: 20 }, mult: 2, target: 'global', desc: 'Éveil technologique : Global x2.' }
];

const TECH_NEWS = [
    "Une faille majeure découverte dans le protocole de chiffrement quantique.",
    "L'adoption massive des interfaces neurales stimule la croissance technologique.",
    "La pénurie mondiale de semi-conducteurs s'aggrave, affectant la production d'IA.",
    "Une percée dans le stockage d'énergie promet des data centers plus efficaces.",
    "Le gouvernement annonce de nouvelles régulations sur le métavers dystopique.",
    "Une IA génératrice d'un nouveau genre crée son propre langage de programmation.",
    "Le déploiement du réseau 7G suscite des inquiétudes pour la santé publique.",
    "Les méga-corporations fusionnent pour former une entité hégémonique mondiale.",
    "Un groupe de hackers célèbre revendique la cyber-attaque contre la Banque Centrale.",
    "La demande pour les processeurs de lien neural atteint un sommet historique."
];

// --- State ---
let state = {
    lines: 0,
    totalLines: 0,
    clicks: 0,
    prestige: 0,
    upgrades: {},
    synergies: [],
    unlocked: [],
    stock: { price: 100, history: [], owned: 0, spent: 0 },
    lastSave: Date.now(),
    skills: {
        overclock: { lastUsed: 0, cd: 60000, duration: 30000 },
        inject: { lastUsed: 0, cd: 300000, req: 1000000 },
        firewall: { lastUsed: 0, cd: 600000, req: 10000000 }
    }
};

let isOverclock = false;
let isFirewall = false;
let isHacker = false;
let hackerHealth = 100;
let contracts = [];

// Init Maps
UPGRADES.forEach(u => state.upgrades[u.id] = 0);

// --- Core Math ---

function getLPS() {
    let base = UPGRADES.reduce((sum, u) => {
        let bLPS = u.lps * state.upgrades[u.id];
        // Apply Synergy
        SYNERGIES.forEach(s => {
            if(state.synergies.includes(s.id) && s.target === u.id) bLPS *= s.mult;
        });
        return sum + bLPS;
    }, 0);

    let mult = 1 + (state.prestige * 0.1);
    // Global Synergies
    SYNERGIES.forEach(s => {
        if(state.synergies.includes(s.id) && s.target === 'global') mult *= s.mult;
    });
    if(isOverclock) mult *= 2;
    return base * mult;
}

function getClickPower() {
    return 1 + (getLPS() * 0.08); // 8% of LPS
}

function addLines(n, manual = false) {
    if(isHacker && manual) {
        hackerHealth -= 5;
        updateHackerUI();
        if(hackerHealth <= 0) winHacker();
        return;
    }

    state.lines += n;
    if(n > 0) state.totalLines += n;
    
    if(manual) {
        state.clicks++;
        AudioEngine.playClick();
        FX.spawn(window.event?.clientX, window.event?.clientY);
    }

    updateUI();
    checkSynergies();
}

// --- Cyberdeck (Skills) ---

function useSkill(id) {
    const s = state.skills[id];
    const now = Date.now();
    if(now - s.lastUsed < s.cd) return;

    s.lastUsed = now;
    if(id === 'overclock') {
        isOverclock = true;
        writeConsole("OVERCLOCKING DÉMARRÉ (x2 LPS)", "warn");
        setTimeout(() => { isOverclock = false; writeConsole("Overclocking terminé."); }, s.duration);
    } else if(id === 'inject') {
        const bonus = getLPS() * 600; // 10 min
        addLines(bonus);
        writeConsole(`INJECTION RÉUSSIE : +${format(bonus)} LDC`, "success");
    } else if(id === 'firewall') {
        isFirewall = true;
        writeConsole("PARE-FEU TOTAL ACTIVÉ", "success");
        setTimeout(() => isFirewall = false, 300000);
    }
    AudioEngine.playSuccess();
    updateUI();
}

// --- Offline Progress ---

function handleOffline() {
    const now = Date.now();
    const diff = (now - state.lastSave) / 1000; // in seconds
    if(diff > 60) {
        const earned = getLPS() * diff * 0.5; // 50% reward for offline
        if(earned > 10) {
            document.getElementById('offline-modal').style.display = 'flex';
            document.getElementById('offline-amount').textContent = format(earned);
            document.getElementById('btn-collect-offline').onclick = () => {
                addLines(earned);
                document.getElementById('offline-modal').style.display = 'none';
                writeConsole(`Récupération : ${format(earned)} LDC accumulées.`);
            };
        }
    }
}

// --- UI Rendering ---

function format(n) {
    if(n >= 1e12) return (n/1e12).toFixed(2) + 'T';
    if(n >= 1e9) return (n/1e9).toFixed(2) + 'B';
    if(n >= 1e6) return (n/1e6).toFixed(2) + 'M';
    if(n >= 1e3) return (n/1e3).toFixed(1) + 'k';
    return Math.floor(n);
}

function updateUI() {
    document.getElementById('score').textContent = format(state.lines);
    document.getElementById('lps').textContent = format(getLPS());
    document.getElementById('stat-total-lines').textContent = format(state.totalLines);
    document.getElementById('stat-manual-clicks').textContent = state.clicks;
    document.getElementById('stat-multiplier').textContent = (getLPS() / UPGRADES.reduce((s,u)=>s+(u.lps*state.upgrades[u.id]),1)).toFixed(1);

    // Skills
    updateSkillUI('skill-overclock', state.skills.overclock);
    updateSkillUI('skill-inject', state.skills.inject);
    updateSkillUI('skill-firewall', state.skills.firewall);

    // Prestige
    const gain = Math.floor(Math.sqrt(state.totalLines / 1e12));
    document.getElementById('prestige-gain').textContent = gain;
    document.getElementById('prestige-btn').classList.toggle('disabled', gain < 1);
    document.getElementById('prestige-btn').onclick = () => triggerSingularity();

    updateCards();
}

function updateSkillUI(elId, skill) {
    const btn = document.getElementById(elId);
    if(skill.req && state.totalLines < skill.req) {
        btn.classList.add('locked');
        return;
    }
    btn.classList.remove('locked');
    const now = Date.now();
    const elapsed = now - skill.lastUsed;
    const p = Math.max(0, 1 - (elapsed / skill.cd));
    btn.style.setProperty('--cd-height', (p * 100) + '%');
    btn.classList.toggle('cooldown', p > 0);
    btn.onclick = () => useSkill(elId.split('-')[1]);
}

function initUI() {
    const list = document.getElementById('upgrade-list');
    list.innerHTML = '';
    UPGRADES.forEach(u => {
        const card = document.createElement('div');
        card.className = 'upgrade-card';
        card.id = `up-${u.id}`;
        card.innerHTML = `
            <div class="card-info">
                <h3>${u.name}</h3>
                <div class="card-cost" id="cost-${u.id}">0</div>
            </div>
            <div class="card-count" id="count-${u.id}">0</div>
        `;
        card.onclick = () => buyUpgrade(u.id);
        list.appendChild(card);
    });

    const synList = document.getElementById('synergy-list');
    synList.innerHTML = '';
    SYNERGIES.forEach(s => {
        const card = document.createElement('div');
        card.className = 'upgrade-card disabled';
        card.id = `syn-${s.id}`;
        card.innerHTML = `<div class="card-info"><h3>${s.name}</h3><p>${s.desc}</p></div>`;
        synList.appendChild(card);
    });
}

function updateCards() {
    UPGRADES.forEach(u => {
        const count = state.upgrades[u.id];
        const cost = Math.floor(u.cost * Math.pow(1.15, count));
        const card = document.getElementById(`up-${u.id}`);
        card.classList.toggle('disabled', state.lines < cost);
        document.getElementById(`cost-${u.id}`).textContent = format(cost);
        document.getElementById(`count-${u.id}`).textContent = count;
    });

    SYNERGIES.forEach(s => {
        const card = document.getElementById(`syn-${s.id}`);
        const active = state.synergies.includes(s.id);
        card.classList.toggle('disabled', !active);
        card.classList.toggle('synergy', active);
    });
}

function checkSynergies() {
    SYNERGIES.forEach(s => {
        if(state.synergies.includes(s.id)) return;
        let ok = true;
        for(let key in s.req) {
            if(state.upgrades[key] < s.req[key]) ok = false;
        }
        if(ok) {
            state.synergies.push(s.id);
            writeConsole(`SYNERGIE DÉBLOQUÉE : ${s.name}`, "success");
            AudioEngine.playSuccess();
        }
    });
}

// --- Logic Helpers ---

function buyUpgrade(id) {
    const u = UPGRADES.find(u => u.id === id);
    const cost = Math.floor(u.cost * Math.pow(1.15, state.upgrades[id]));
    if(state.lines >= cost) {
        state.lines -= cost;
        state.upgrades[id]++;
        AudioEngine.playSuccess();
        updateUI();

        // AI narrative log
        if (window.AI) {
            AI.generateLog(`Purchased ${u.name} (level ${state.upgrades[id]})`).then(log => {
                writeConsole(log, "ai");
            });
        }
    }
}

// --- Hacker Attack ---

function startHackerAttack() {
    if(isFirewall || isHacker) return;
    
    isHacker = true;
    hackerHealth = 100;
    updateHackerUI();
    document.getElementById('hacker-overlay').style.display = 'flex';
    AudioEngine.playAlert();
    writeConsole("⚠️ ALERTE DE SÉCURITÉ : INTRUSION DÉTECTÉE !", "danger");

    const attackTimer = setInterval(() => {
        if(!isHacker) {
            clearInterval(attackTimer);
            return;
        }
        hackerHealth -= 2;
        updateHackerUI();
        if(hackerHealth <= 0) {
            failHacker();
            clearInterval(attackTimer);
        }
    }, 1000);
}

function updateHackerUI() {
    document.getElementById('hacker-health').textContent = Math.max(0, hackerHealth);
    document.getElementById('hacker-progress-bar').style.width = Math.max(0, hackerHealth) + '%';
}

function winHacker() {
    isHacker = false;
    document.getElementById('hacker-overlay').style.display = 'none';
    const reward = Math.floor(getLPS() * 300);
    addLines(reward);
    writeConsole(`SYSTÈME SÉCURISÉ : +${format(reward)} LDC récompense !`, "success");
    AudioEngine.playSuccess();
}

function failHacker() {
    isHacker = false;
    document.getElementById('hacker-overlay').style.display = 'none';
    const penalty = Math.floor(state.lines * 0.2);
    state.lines -= penalty;
    writeConsole(`FAILLE CRITIQUE : ${format(penalty)} LDC perdues.`, "danger");
    updateUI();
}

function triggerSingularity() {
    const gain = Math.floor(Math.sqrt(state.totalLines / 1e12));
    if (gain < 1) return;

    state.prestige += gain;
    state.lines = 0;
    state.totalLines = 0;
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

function writeConsole(txt, type="") {
    const el = document.getElementById('code-console');
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.textContent = `> [${new Date().toLocaleTimeString()}] ${txt}`;
    el.appendChild(line);
    if(el.children.length > 5) el.removeChild(el.firstChild);
}
window.writeConsole = writeConsole;

// --- FX Particle Engine ---

const FX = {
    canvas: document.getElementById('canvas-fx'),
    ctx: document.getElementById('canvas-fx').getContext('2d'),
    particles: [],
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    spawn(x, y) {
        if(!x) return;
        for(let i=0; i<8; i++) {
            this.particles.push({
                x, y, 
                vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10,
                life: 1, color: isOverclock ? '#fbbf24' : '#38bdf8'
            });
        }
    },

    update() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.particles = this.particles.filter(p => {
            p.x += p.vx; p.y += p.vy; p.life -= 0.02;
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life;
            this.ctx.fillRect(p.x, p.y, 4, 4);
            return p.life > 0;
        });
        requestAnimationFrame(() => this.update());
    }
};

// --- Stock & Background ---

async function updateAIStock() {
    if (!window.AI) return;
    const news = TECH_NEWS[Math.floor(Math.random() * TECH_NEWS.length)];
    const sentiment = await AI.analyzeSentiment(news);
    
    const isPositive = sentiment.label === 'POSITIVE';
    state.stock.price *= isPositive ? 1.2 : 0.8;
    
    writeConsole(`NEWS: ${news}`, isPositive ? "success" : "danger");
    
    // UI Update
    const priceEl = document.getElementById('stock-price');
    if (priceEl) {
        priceEl.textContent = `$${state.stock.price.toFixed(2)}`;
        priceEl.style.color = isPositive ? 'var(--success)' : 'var(--danger)';
    }
    STOCK.draw();
}

const STOCK = {
    update() {
        const trend = (Math.random() - 0.5) * 12;
        state.stock.price = Math.max(10, state.stock.price + trend);
        state.stock.history.push(state.stock.price);
        if(state.stock.history.length > 40) state.stock.history.shift();
        
        const priceEl = document.getElementById('stock-price');
        priceEl.textContent = `$${state.stock.price.toFixed(2)}`;
        priceEl.style.color = trend > 0 ? 'var(--success)' : 'var(--danger)';
        
        this.draw();
    },
    draw() {
        const c = document.getElementById('stock-chart');
        const ctx = c.getContext('2d');
        const w = c.width = c.offsetWidth;
        const h = c.height = c.offsetHeight;
        ctx.clearRect(0,0,w,h);
        ctx.strokeStyle = 'var(--accent-primary)';
        ctx.beginPath();
        const max = Math.max(...state.stock.history);
        const min = Math.min(...state.stock.history);
        state.stock.history.forEach((p, i) => {
            const x = (i/40)*w;
            const y = h - ((p-min)/(max-min || 1))*h;
            if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        });
        ctx.stroke();
    }
};

// --- Boot ---

const saved = localStorage.getItem('devClicker_v6');
if(saved) state = {...state, ...JSON.parse(saved)};

AudioEngine.init(); FX.init(); FX.update();
if (window.AI) AI.init();
initUI(); updateUI();
handleOffline();
writeConsole("THE SINGULARITY v6.0 : CHARGEMENT DU NOYAU");

setInterval(() => addLines(getLPS() / 10), 100);
setInterval(() => STOCK.update(), 2000);
setInterval(() => { state.lastSave = Date.now(); localStorage.setItem('devClicker_v6', JSON.stringify(state)); }, 30000);

// Hacker Random Event (2% chance every minute)
setInterval(() => {
    if(Math.random() < 0.02) startHackerAttack();
}, 60000);

const triggerAIStock = () => {
    setTimeout(async () => {
        await updateAIStock();
        triggerAIStock();
    }, Math.random() * 15000 + 15000);
};
triggerAIStock();

window.onresize = () => { FX.init(); STOCK.draw(); };
