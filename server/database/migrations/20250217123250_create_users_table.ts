import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', t => {
        t.increments('id');
        t.string('username');
        t.string('first_name');
        t.string('last_name');
        t.text('permissions');
        t.text('settings');
        t.string('password');
        t.timestamps();
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users');
}

