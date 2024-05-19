import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const hasTable  = await knex.schema.hasTable('invoice')
    if (!hasTable) {
        await knex.schema.createTable('invoice', (table) => {
            table.uuid('id').primary().defaultTo(knex.fn.uuid())
            table.uuid('customer_id').notNullable().references('id').inTable('customer')
            table.float('gst').notNullable()
            table.uuid('shop_id').notNullable().references('id').inTable('shop')
            table.float('total_price_before_tax').notNullable()
            table.float('total_price_after_tax').notNullable()
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
        })
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('invoice')
}

