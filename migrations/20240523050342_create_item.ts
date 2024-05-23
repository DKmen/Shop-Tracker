import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable('item')
    if (!hasTable) {
        await knex.schema.createTable('item', (table) => {
            table.uuid('id').primary().defaultTo(knex.fn.uuid())
            table.uuid('invoice_id').notNullable().references('id').inTable('invoice')
            table.uuid('product_id').notNullable().references('id').inTable('product')
            table.float('quantity').notNullable()
            table.float('selling_price').notNullable()
            table.float('total_amount').notNullable()
            table.float('discount').notNullable().defaultTo(0)
            table.float('gst').notNullable().defaultTo(0)
            table.float('total_amount_with_gst').notNullable()
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
        })
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('item')
}

