import { logger, Database, Config } from 'hiem';

export async function boot() {
    // Connect to the database
    const dbConf = Config.get('secret.database');
    logger.debug(`Connecting to database '${dbConf.database}' as user '${dbConf.user}'...`);
    Database.connect(dbConf);
}