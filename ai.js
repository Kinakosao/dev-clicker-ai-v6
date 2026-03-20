const AI = {
    pipelines: {},
    async init() {
        // Configure env for browser caching
        transformers.env.allowLocalModels = false;
        transformers.env.useBrowserCache = true;
        if (typeof writeConsole === 'function') {
            writeConsole("Initialisation du Noyau IA...");
        } else {
            console.log("Initialisation du Noyau IA...");
        }
    },
    async loadModel(task, modelId) {
        if (this.pipelines[task]) return this.pipelines[task];
        this.pipelines[task] = await transformers.pipeline(task, modelId, {
            progress_callback: (info) => {
                if (info.status === 'progress' && typeof writeConsole === 'function') {
                    writeConsole(`Chargement ${task}: ${info.progress.toFixed(1)}%`);
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
    }
};

window.AI = AI;
