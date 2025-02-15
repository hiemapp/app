import { logger, Config } from 'hiem';

export async function boot(rootDir: string) {
    logger.debug('Loading configuration...');
    await Config.load(rootDir);
}