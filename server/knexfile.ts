import type { Knex } from "knex";
import 'dotenv/config';

const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'mysql2',
        connection: {
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DATABASE,
            port: typeof process.env.DATABASE_PORT === 'number' ? parseInt(process.env.DATABASE_PORT) : undefined,
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: `${__dirname}/database/migrations`
        }
    }
};

module.exports = config;
