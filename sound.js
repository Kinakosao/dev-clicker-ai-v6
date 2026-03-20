/**
 * Dev Clicker Audio Engine - Procedural Sound Synthesis
 */
const AudioEngine = {
    ctx: null,
    enabled: true,
    humOsc: null,
    humGain: null,

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.setupHum();
        } catch (e) {
            console.error("AudioContext not supported");
        }
    },

    setupHum() {
        if (!this.ctx) return;
        this.humOsc = this.ctx.createOscillator();
        this.humGain = this.ctx.createGain();

        this.humOsc.type = 'sine';
        this.humOsc.frequency.setValueAtTime(40, this.ctx.currentTime); // Low freq hum
        this.humGain.gain.setValueAtTime(0, this.ctx.currentTime); // Start silent

        this.humOsc.connect(this.humGain);
        this.humGain.connect(this.ctx.destination);
        this.humOsc.start();
    },

    updateHum(lps) {
        if (!this.ctx || !this.enabled || !this.humGain) return;
        if (this.ctx.state === 'suspended') return;

        const lpsFactor = Math.max(0, Math.log10(lps + 1));
        const volume = Math.min(0.04, lpsFactor * 0.005);
        const freq = 40 + (lpsFactor * 2);

        this.humGain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.5);
        this.humOsc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.5);
    },

    playClick(lps = 0) {
        if (!this.ctx || !this.enabled) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const lpsFactor = Math.max(0, Math.log10(lps + 1));
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        // Frequency increases slightly with LPS
        const baseFreq = 150 + (lpsFactor * 30);
        osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.1);

        // Gain increases slightly with LPS
        const baseGain = 0.1 + Math.min(0.1, lpsFactor * 0.02);
        gain.gain.setValueAtTime(baseGain, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    },

    playSuccess() {
        if (!this.ctx || !this.enabled) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(now + 0.3);
    },

    playAlert() {
        if (!this.ctx || !this.enabled) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.linearRampToValueAtTime(200, now + 0.5);
        
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(now + 0.5);
    }
};
