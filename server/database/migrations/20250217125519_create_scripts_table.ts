import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('scripts', t => {
        t.increments('id');
        t.string('name');
        t.string('icon');
        t.text('code');
        t.timestamps();
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('scripts');
}

