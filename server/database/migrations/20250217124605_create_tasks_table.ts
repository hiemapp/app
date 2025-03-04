import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('tasks', t => {
        t.increments('id');
        t.datetime('date', { precision: 3 });
        t.string('interval');
        t.string('keyword');
        t.text('data');
        t.text('meta');
        t.timestamps();
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('tasks');
}

