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
    }
};
export default AI;
