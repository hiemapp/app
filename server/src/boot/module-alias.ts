import path from 'path';
import moduleAlias from 'module-alias';
import fs from 'fs';

export async function boot(rootDir: string) {
    if(process.env.NODE_ENV === 'development') {
        // Alias 'hiem' to the core source dir, if found
        const CORE_SRC_DIR = path.resolve(rootDir, '../../core/src');
        if(fs.existsSync(CORE_SRC_DIR)) {
            moduleAlias.addAlias('hiem', CORE_SRC_DIR);
        }
    }
}