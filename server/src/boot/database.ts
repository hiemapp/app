import { logger, Database, Config } from 'hiem';

export async function boot() {
    // Connect to the database
    Database.connect();
}