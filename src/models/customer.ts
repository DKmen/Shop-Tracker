import { Model, snakeCaseMappers } from 'objection'
import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'

import { formatToDBTimestamp } from '../utils/helpers.js'
import { writeConfig, readOnlyConfig } from '../../knexfile.js'
import Shop from './shop.js'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class Customer extends Model {
    id!: string
    customerName!: string
    customerPhone!: string
    customerEmail!: string
    customerAddress!: string
    shopId!: string
    createdAt!: string
    updatedAt!: string

    static override tableName = 'customer'
    static override idColumn = ['id']

    static override jsonSchema = {
        type: 'object',
        properties: {
            id: { type: 'string' },
            customerName: { type: 'string' },
            customerPhone: { type: 'string' },
            customerEmail: { type: 'string' },
            customerAddress: { type: 'string' },
            shopId: { type: 'string' },
        }
    }

    static override relationMappings = {
        shop: {
            relation: Model.BelongsToOneRelation,
            modelClass: Shop,
            join: {
                from: 'customer.shop_id',
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

export const CustomerRW = Customer.bindKnex(knexWrite)
export const CustomerRO = Customer.bindKnex(knexReadOnly)

export default Customer
