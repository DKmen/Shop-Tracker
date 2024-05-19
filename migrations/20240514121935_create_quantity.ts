import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable('quantity')
    if (!hasTable) {
        await knex.schema.createTable('quantity', (table) => {
            table.uuid('id').primary().defaultTo(knex.fn.uuid())
            table.integer('quantity').notNullable()
            table.uuid('product_id').notNullable().references('id').inTable('product')
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
        })
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('quantity')
}

