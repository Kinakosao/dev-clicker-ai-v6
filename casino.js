/**
 * Bit-Crash Mini-game for Shadow Den
 */

export class BitCrash {
    constructor(state, updateUI, writeConsole) {
        this.state = state;
        this.updateUI = updateUI;
        this.writeConsole = writeConsole;
        
        this.multiplier = 1.0;
        this.betAmount = 0;
        this.crashPoint = 1.0;
        this.status = 'idle'; // idle, running, crashed, cashed_out
        this.timer = null;
        
        this.ui = {
            multiplier: document.getElementById('crash-multiplier'),
            betInput: document.getElementById('crash-bet'),
            btn: document.getElementById('crash-btn')
        };
    }

    generateCrashPoint() {
        // Weighted random favoring low multipliers
        const r = Math.random();
        if (r < 0.05) return 1.0; // 5% instant crash at 1.0
        if (r < 0.4) return 1 + Math.random() * 0.5; // 35% between 1.0 and 1.5
        if (r < 0.7) return 1.5 + Math.random() * 1.5; // 30% between 1.5 and 3.0
        if (r < 0.9) return 3.0 + Math.random() * 7.0; // 20% between 3.0 and 10.0
        return 10.0 + Math.random() * 40.0; // 10% between 10.0 and 50.0
    }

    start() {
        const amount = parseInt(this.ui.betInput.value);
        if (isNaN(amount) || amount <= 0) {
            this.writeConsole("Mise invalide.", "danger");
            return;
        }
        if (this.state.casino.ub < amount) {
            this.writeConsole("UB insuffisants.", "danger");
            return;
        }

        this.state.casino.ub -= amount;
        this.betAmount = amount;
        this.multiplier = 1.0;
        this.crashPoint = this.generateCrashPoint();
        this.status = 'running';
        
        this.updateUI();
        this.updateCrashUI();
        
        this.writeConsole(`Bit-Crash : Mise de ${amount} UB acceptée.`, "warn");

        this.timer = setInterval(() => this.tick(), 100);
    }

    tick() {
        if (this.status !== 'running') return;

        // Increase multiplier: faster as it gets higher
        const increment = 0.01 * Math.pow(this.multiplier, 0.5);
        this.multiplier += increment;

        if (this.multiplier >= this.crashPoint) {
            this.onCrash();
        } else {
            this.updateCrashUI();
        }
    }

    cashOut() {
        if (this.status !== 'running') return;

        this.status = 'cashed_out';
        clearInterval(this.timer);
        
        const winnings = Math.floor(this.betAmount * this.multiplier);
        this.state.casino.ub += winnings;
        this.state.casino.totalUB += (winnings - this.betAmount);
        
        this.writeConsole(`ENCAISSÉ : +${winnings} UB (x${this.multiplier.toFixed(2)})`, "success");
        
        this.updateUI();
        this.updateCrashUI();
    }

    onCrash() {
        this.status = 'crashed';
        clearInterval(this.timer);
        
        this.writeConsole(`CRASH à x${this.multiplier.toFixed(2)} ! Mise perdue.`, "danger");
        
        this.updateUI();
        this.updateCrashUI();
    }

    updateCrashUI() {
        if (!this.ui.multiplier) return;

        this.ui.multiplier.textContent = `x${this.multiplier.toFixed(2)}`;
        
        if (this.status === 'running') {
            this.ui.btn.textContent = "CASH OUT";
            this.ui.btn.className = "action-btn cashout";
            this.ui.multiplier.style.color = "var(--text-main)";
        } else if (this.status === 'crashed') {
            this.ui.btn.textContent = "PERDU";
            this.ui.btn.className = "action-btn crashed";
            this.ui.multiplier.style.color = "var(--danger)";
            setTimeout(() => this.reset(), 2000);
        } else if (this.status === 'cashed_out') {
            this.ui.btn.textContent = "RÉUSSI";
            this.ui.btn.className = "action-btn success";
            this.ui.multiplier.style.color = "var(--success)";
            setTimeout(() => this.reset(), 2000);
        } else {
            this.ui.btn.textContent = "BET";
            this.ui.btn.className = "action-btn";
            this.ui.multiplier.style.color = "var(--text-muted)";
        }
    }

    reset() {
        this.status = 'idle';
        this.multiplier = 1.0;
        this.updateCrashUI();
    }
}

/**
 * Hex-Slots Mini-game for Shadow Den
 */
export class HexSlots {
    constructor(state, updateUI, writeConsole) {
        this.state = state;
        this.updateUI = updateUI;
        this.writeConsole = writeConsole;

        this.characters = '0123456789ABCDEF'.split('');
        this.isSpinning = false;
        
        this.ui = {
            reels: [
                document.getElementById('slot-reel-1'),
                document.getElementById('slot-reel-2'),
                document.getElementById('slot-reel-3')
            ],
            betInput: document.getElementById('slot-bet'),
            btn: document.getElementById('slot-btn')
        };
    }

    async spin() {
        if (this.isSpinning) return;

        const bet = parseInt(this.ui.betInput.value);
        if (isNaN(bet) || bet <= 0) {
            this.writeConsole("Mise invalide.", "danger");
            return;
        }
        if (this.state.casino.ub < bet) {
            this.writeConsole("UB insuffisants.", "danger");
            return;
        }

        this.state.casino.ub -= bet;
        this.isSpinning = true;
        this.updateUI();
        this.updateSlotUI();

        this.writeConsole(`Hex-Slots : Mise de ${bet} UB. Tirage en cours...`, "warn");

        const spinDuration = 1500;
        const startTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;

            if (elapsed < spinDuration) {
                this.ui.reels.forEach(reel => {
                    if (reel) reel.textContent = this.characters[Math.floor(Math.random() * 16)];
                });
                requestAnimationFrame(animate);
            } else {
                this.stopSpin(bet);
            }
        };

        animate();
    }

    stopSpin(bet) {
        const results = [
            this.characters[Math.floor(Math.random() * 16)],
            this.characters[Math.floor(Math.random() * 16)],
            this.characters[Math.floor(Math.random() * 16)]
        ];

        this.ui.reels.forEach((reel, i) => {
            if (reel) reel.textContent = results[i];
        });

        this.isSpinning = false;
        this.calculatePayout(results, bet);
        this.updateSlotUI();
        this.updateUI();
    }

    calculatePayout(results, bet) {
        const [r1, r2, r3] = results;
        let multiplier = 0;

        if (r1 === r2 && r2 === r3) {
            if (r1 === 'F') {
                multiplier = 100;
                this.writeConsole("!!! JACKPOT F-F-F : SYSTEM OVERLOAD !!!", "success");
                this.triggerSystemOverload();
            } else {
                multiplier = 10;
                this.writeConsole(`TRIPLE MATCH (${r1}) : x10 !`, "success");
            }
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
            multiplier = 2;
            this.writeConsole("DOUBLE MATCH : x2", "success");
        } else {
            this.writeConsole("Pas de match. Tentative échouée.", "danger");
        }

        if (multiplier > 0) {
            const winnings = bet * multiplier;
            this.state.casino.ub += winnings;
            this.state.casino.totalUB += (winnings - bet);
        }
    }

    triggerSystemOverload() {
        if (window.triggerOverload) {
            window.triggerOverload();
        }
    }

    updateSlotUI() {
        if (!this.ui.btn) return;
        this.ui.btn.disabled = this.isSpinning;
        this.ui.btn.textContent = this.isSpinning ? "???" : "SPIN";
    }
}
