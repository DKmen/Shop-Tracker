import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable('report');
    if (!hasTable) {
        await knex.schema.createTable('report', (table) => {
            table.uuid('id').primary().defaultTo(knex.fn.uuid())
            table.uuid('shop_id').notNullable().references('id').inTable('shop')
            table.enum('report_type', ['SALES_REPORT', 'INVANTORY_REPORT', 'CUSTOMER_REPORT']).notNullable()
            table.date('start_date').notNullable()
            table.date('end_date').notNullable()
            table.enum('status', ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']).defaultTo('PENDING')
            table.timestamp('updated_at').defaultTo(knex.fn.now())
            table.timestamp('created_at').defaultTo(knex.fn.now())
        })
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('report')
}

