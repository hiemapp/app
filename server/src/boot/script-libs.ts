import { ScriptLibManager } from 'hiem';

export async function boot() {
    // Load scripting libs
    await ScriptLibManager.load();
}