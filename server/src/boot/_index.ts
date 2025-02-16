const BOOT_MODULES = [
    'module-alias', 
    'dayjs',
    'config',
    'error-handler',
    'shutdown-handler',
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
            await module.boot(rootDir).catch((err: any) => {
                console.error(`Failed to boot module '${name}':`, err);
                process.exit(1);
            })
        }
    }
};