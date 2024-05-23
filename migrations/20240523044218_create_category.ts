import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable('category')
    if (!hasTable) {
        await knex.schema.createTable('category', (table) => {
            table.uuid('id').primary().defaultTo(knex.fn.uuid())
            table.uuid('shop_id').notNullable().references('id').inTable('shop')
            table.string('category_name').notNullable()
            table.string('description').nullable()
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
        })
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('category')
}

