import { Model, snakeCaseMappers } from 'objection'
import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'

import { formatToDBTimestamp } from '../utils/helpers.js'
import { writeConfig, readOnlyConfig } from '../../knexfile.js'
import Invoice from './invoice.js'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class Item extends Model {
    id!: string
    invoiceId!: string
    productId!: string
    quantity!: number
    sellingPrice!: number
    totalAmount!: number
    discount!: number
    gst!: number
    totalAmountWithGst!: number
    createdAt!: string
    updatedAt!: string

    static override tableName = 'item'
    static override idColumn = ['id']

    static override jsonSchema = {
        type: 'object',
        properties: {
            id: { type: 'string' },
            invoiceId: { type: 'string' },
            quantity: { type: 'number' },
            sellingPrice: { type: 'number' },
            productId: { type: 'string' }
        }
    }

    static override relationMappings = {
        invoice: {
            relation: Model.HasOneRelation,
            modelClass: Invoice,
            join: {
                from: 'item.invoice_id',
                to: 'invoice.id'
            }
        },
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

export const ItemRW = Item.bindKnex(knexWrite)
export const ItemRO = Item.bindKnex(knexReadOnly)

export default Item
