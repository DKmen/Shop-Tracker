import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable('expire')
    if (!hasTable) {
        await knex.schema.createTable('expire', (table) => {
            table.uuid('id').primary().defaultTo(knex.fn.uuid())
            table.date('expire_date').notNullable()
            table.uuid('product_id').notNullable().references('id').inTable('product')
            table.uuid('quantity_id').notNullable().references('id').inTable('quantity')
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
        })
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('expire')
}

