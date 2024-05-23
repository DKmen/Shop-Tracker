import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable('invoice')
    if (!hasTable) {
        await knex.schema.createTable('invoice', (table) => {
            table.uuid('id').primary().defaultTo(knex.fn.uuid())
            table.uuid('customer_id').notNullable().references('id').inTable('customer')
            table.uuid('shop_id').notNullable().references('id').inTable('shop')
            table.float('total_amount').notNullable()
            table.float('discount').notNullable().defaultTo(0)
            table.float('total_amount_after_discount').notNullable()
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
        })
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('invoice')
}

