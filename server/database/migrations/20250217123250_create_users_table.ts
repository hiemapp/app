import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', t => {
        t.increments('id');
        t.string('name');
        t.string('username');
        t.json('permissions');
        t.json('settings');
        t.string('password');
        t.timestamps();
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users');
}

