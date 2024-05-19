import { Model, snakeCaseMappers } from 'objection'
import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'

import { formatToDBTimestamp } from '../utils/helpers.js'
import { writeConfig, readOnlyConfig } from '../../knexfile.js'
import Product from './product.js'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class Quantity extends Model {
    id!: string
    productId!: string
    quantity!: number
    createdAt!: string
    updatedAt!: string

    static override tableName = 'quantity'
    static override idColumn = ['id']

    static override jsonSchema = {
        type: 'object',
        properties: {
            id: { type: 'string' },
            productId: { type: 'string' },
            quantity: { type: 'number' }
        }
    }

    static override relationMappings = {
        product: {
            relation: Model.HasOneRelation,
            modelClass: Product,
            join: {
                from: 'quantity.product_id',
                to: 'product.id'
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

export const QuantityRW = Quantity.bindKnex(knexWrite)
export const QuantityRO = Quantity.bindKnex(knexReadOnly)

export default Quantity
