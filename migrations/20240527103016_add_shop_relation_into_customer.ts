import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable('customer')
    if (hasTable) {
        await knex.schema.alterTable('customer', (table) => {
            table.uuid('shop_id').references('id').inTable('shop').notNullable()
        })
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('customer', (table) => {
        table.dropColumn('shop_id')
    })
}

