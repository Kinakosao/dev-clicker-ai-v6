const AI = {
    pipelines: {},
    async init() {
        // Configure env for browser caching
        transformers.env.allowLocalModels = false;
        transformers.env.useBrowserCache = true;
        
        const initMsg = "Initialisation du Noyau IA...";
        if (typeof writeConsole === 'function') {
            writeConsole(initMsg);
        } else {
            console.log(initMsg);
        }

        // Shadow Den Loading State
        const denStatus = document.querySelector('#den-game-areas p');
        if (denStatus) {
            denStatus.innerText = "Connexion au Shadow Den établie. En attente de Shadow...";
        }
    },
    async loadModel(task, modelId) {
        if (this.pipelines[task]) return this.pipelines[task];
        this.pipelines[task] = await transformers.pipeline(task, modelId, {
            progress_callback: (info) => {
                if (info.status === 'progress') {
                    const progressMsg = `Chargement ${task}: ${info.progress.toFixed(1)}%`;
                    if (typeof writeConsole === 'function') {
                        writeConsole(progressMsg);
                    }
                    
                    // Shadow Den UI loading feedback
                    const denStatus = document.querySelector('#den-game-areas p');
                    if (denStatus) {
                        denStatus.innerText = `Shadow recalibre le casino: ${info.progress.toFixed(1)}%`;
                    }
                }
            }
        });
        return this.pipelines[task];
    },
    async generateLog(context) {
        try {
            const pipe = await this.loadModel('text-generation', 'onnx-community/Llama-3.2-1B-Instruct-q4f16');
            const prompt = `Write a short, funny cyberpunk developer log about: ${context}. Keep it under 15 words.`;
            const output = await pipe(prompt, { max_new_tokens: 20, temperature: 0.7 });
            return output[0].generated_text.replace(prompt, '').trim();
        } catch (e) {
            console.error("AI Log generation failed", e);
            return `Log: ${context}`;
        }
    },
    async generateShadowLog(context, details) {
        try {
            const pipe = await this.loadModel('text-generation', 'onnx-community/Llama-3.2-1B-Instruct-q4f16');
            const prompt = `You are Shadow, a snarky, cynical cyberpunk dealer in a glitched casino. Generate a short, funny comment (under 15 words) about this event: ${context} (${details}). Be provocative.`;
            const output = await pipe(prompt, { max_new_tokens: 30, temperature: 0.8 });
            return output[0].generated_text.replace(prompt, '').trim();
        } catch (e) {
            console.error("Shadow Log generation failed", e);
            return `Shadow: ${context} - ${details}`;
        }
    },
    async analyzeSentiment(text) {
        try {
            const pipe = await this.loadModel('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
            const result = await pipe(text);
            return result[0]; // { label: 'POSITIVE', score: 0.99 }
        } catch (e) {
            console.error("AI Sentiment analysis failed", e);
            return { label: 'NEUTRAL', score: 0.5 };
        }
    }
};

window.AI = AI;
