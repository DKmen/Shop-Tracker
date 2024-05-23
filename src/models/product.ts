import { Model, snakeCaseMappers } from 'objection'
import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'

import { formatToDBTimestamp } from '../utils/helpers.js'
import { writeConfig, readOnlyConfig } from '../../knexfile.js'
import Shop from './shop.js'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class Product extends Model {
    id!: string
    productName!: string
    unitPrice!: number
    sellingPrice!: number
    shopId!: string
    categoryId!: string
    quantity!: number
    description!: string
    expireTimeInDays!: number
    createdAt!: string
    updatedAt!: string

    static override tableName = 'product'
    static override idColumn = ['id']

    static override jsonSchema = {
        type: 'object',
        properties: {
            id: { type: 'string' },
            productName: { type: 'string' },
            unitPrice: { type: 'number' },
            sellingPrice: { type: 'number' },
            shopId: { type: 'string' },
            categoryId: { type: 'string' },
            quantity: { type: 'number' },
            description: { type: 'string' }
        }
    }

    static override relationMappings = {
        shop: {
            relation: Model.HasOneRelation,
            modelClass: Shop,
            join: {
                from: 'product.shop_id',
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

export const ProductRW = Product.bindKnex(knexWrite)
export const ProductRO = Product.bindKnex(knexReadOnly)

export default Product
