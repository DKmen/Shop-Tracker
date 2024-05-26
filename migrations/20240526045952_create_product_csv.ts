import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable('product_csv')
    if (!hasTable) {
        await knex.schema.createTable('product_csv', table => {
            table.uuid('id').primary().defaultTo(knex.fn.uuid())
            table.string('name').nullable();
            table.string('description').nullable();
            table.uuid('shop_id').notNullable().references('id').inTable('shop');
            table.string('csv_file_path').notNullable();
            table.enum('status', ['processing', 'completed', 'failed']).defaultTo('processing');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('product_csv');
}

