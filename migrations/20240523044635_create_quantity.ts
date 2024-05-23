import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable('quantity')
    if (!hasTable) {
        await knex.schema.createTable('quantity', (table) => {
            table.uuid('id').primary().defaultTo(knex.fn.uuid())
            table.uuid('product_id').notNullable().references('id').inTable('product')
            table.float('quantity').notNullable()
            table.enum('status', ['active', 'expire']).defaultTo('active');
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
        })
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('quantity')
}

