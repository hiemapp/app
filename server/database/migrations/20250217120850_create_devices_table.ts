import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('devices', t => {
        t.increments('id');
        t.string('name');
        t.string('icon');
        t.string('color');
        t.json('driver');
        t.integer('connector_id');
        t.json('options');
        t.json('metadata');
        t.timestamps();
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('devices');
}

