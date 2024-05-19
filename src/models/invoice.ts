import { Model, snakeCaseMappers } from 'objection'
import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'

import { formatToDBTimestamp } from '../utils/helpers.js'
import { writeConfig, readOnlyConfig } from '../../knexfile.js'
import Customer from './customer.js'
import Shop from './shop.js'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class Invoice extends Model {
    id!: string
    customerId!: string
    gst!: number
    shopId!: string
    totalPriceBeforeTax!: number
    totalPriceAfterTax!: number
    createdAt!: string
    updatedAt!: string

    static override tableName = 'invoice'
    static override idColumn = ['id']

    static override jsonSchema = {
        type: 'object',
        properties: {
            id: { type: 'string' },
            customerId: { type: 'string' },
            gst: { type: 'number' },
            shopId: { type: 'string' },
            totalPriceBeforeTax: { type: 'number' },
            totalPriceAfterTax: { type: 'number' }
        }
    }

    static override relationMappings = {
        customer: {
            relation: Model.HasOneRelation,
            modelClass: Customer,
            join: {
                from: 'invoice.customer_id',
                to: 'customer.id'
            }
        },
        shop: {
            relation: Model.HasOneRelation,
            modelClass: Shop,
            join: {
                from: 'invoice.shop_id',
                to: 'shop.id'
            }
        }
    }

    override $beforeInsert(): void {
        this.createdAt = formatToDBTimestamp(new Date())
        this.updatedAt = formatToDBTimestamp(new Date())
    }

    override $beforeUpdate(): void {
        this.updatedAt = formatToDBTimestamp(new Date())
    }

    static override get columnNameMappers(): ColumnNameMappers {
        return snakeCaseMappers()
    }
}

export const InvoiceRW = Invoice.bindKnex(knexWrite)
export const InvoiceRO = Invoice.bindKnex(knexReadOnly)

export default Invoice
