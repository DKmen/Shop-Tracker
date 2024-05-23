import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable('product')
    if (!hasTable) {
        await knex.schema.createTable('product', (table) => {
            table.uuid('id').primary().defaultTo(knex.fn.uuid())
            table.string('product_name').notNullable()
            table.integer('unit_price').notNullable()
            table.integer('selling_price').notNullable()
            table.uuid('shop_id').notNullable().references('id').inTable('shop')
            table.uuid('category_id').notNullable().references('id').inTable('category')
            table.float('quantity').nullable().defaultTo(0)
            table.string('description').notNullable()
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
        })
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('product')
}

