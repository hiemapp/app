import moduleAlias from 'module-alias';

export async function boot(rootDir: string) {
    if(process.env.NODE_ENV === 'development') {
        moduleAlias.addAlias('hiem', '../../core/src');
    }
}