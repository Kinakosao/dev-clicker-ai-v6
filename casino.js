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
