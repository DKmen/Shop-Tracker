import { Model, snakeCaseMappers } from 'objection'
import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'

import { formatToDBTimestamp } from '../utils/helpers.js'
import { writeConfig, readOnlyConfig } from '../../knexfile.js'
import Product from './product.js'
import Quantity from './quantity.js'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class Expire extends Model {
    id!: string
    productId!: string
    quantityId!: string
    createdAt!: string
    updatedAt!: string

    static override tableName = 'expire'
    static override idColumn = ['id']

    static override jsonSchema = {
        type: 'object',
        properties: {
            id: { type: 'string' },
            productId: { type: 'string' },
            quantityId: { type: 'string' }
        }
    }

    static override relationMappings = {
        product: {
            relation: Model.HasOneRelation,
            modelClass: Product,
            join: {
                from: 'expire.product_id',
                to: 'product.id'
            }
        },
        quantity: {
            relation: Model.HasOneRelation,
            modelClass: Quantity,
            join: {
                from: 'expire.quantity_id',
                to: 'quantity.id'
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

export const ExpireRW = Expire.bindKnex(knexWrite)
export const ExpireRO = Expire.bindKnex(knexReadOnly)

export default Expire
