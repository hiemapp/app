import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('tasks', t => {
        t.increments('id');
        t.string('uuid').index();
        t.string('interval');
        t.string('keyword');
        t.json('data');
        t.json('meta');
        t.timestamps();
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('tasks');
}

