import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable('shop')
    if (!hasTable) {
        await knex.schema.createTable('shop', (table) => {
            table.uuid('id').primary().defaultTo(knex.fn.uuid())
            table.string('shop_name').notNullable()
            table.uuid('user_id').notNullable().references('id').inTable('user')
            table.string('shop_address').notNullable()
            table.string('shop_phone').notNullable()
            table.string('shop_email').nullable()
            table.string('shop_description').nullable()
            table.enum('shop_status', ['active', 'close']).defaultTo('active')
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
        })
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('shop')
}

