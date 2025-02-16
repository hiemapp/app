const BOOT_MODULES = [
    'module-alias', 
    'dayjs',
    'error-handler',
    'shutdown-handler',
    'config',
    'database',
    'taskrunner',
    'controllers',
    'script-libs',
    'webserver',
]

export default async function boot(rootDir: string) {
    
    for(const name of BOOT_MODULES) {
        const module = await import(`./${name}`);
        if(typeof module.boot === 'function') {
            await module.boot(rootDir);
        }
    }
};