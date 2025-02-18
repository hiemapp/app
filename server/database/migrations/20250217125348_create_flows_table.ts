import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('flows', t => {
        t.increments('id');
        t.string('name');
        t.string('icon');
        t.text('state');
        t.timestamps();
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('flows');
}

