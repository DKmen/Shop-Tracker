import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable('customer')
    if (!hasTable) {
        await knex.schema.createTable('customer', (table) => {
            table.uuid('id').primary().defaultTo(knex.fn.uuid())
            table.string('name').notNullable()
            table.string('email').notNullable().unique()
            table.string('phone').notNullable().unique()
            table.string('address').notNullable()
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
        })
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('customer')
}

