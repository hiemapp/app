import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('connectors', t => {
        t.increments('id');
        t.json('protocol');
        t.timestamps();
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('connectors');
}

