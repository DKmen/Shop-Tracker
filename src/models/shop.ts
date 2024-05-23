import { Model, snakeCaseMappers } from 'objection'
import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'

import { formatToDBTimestamp } from '../utils/helpers.js'
import { writeConfig, readOnlyConfig } from '../../knexfile.js'
import User from './user.js'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class Shop extends Model {
    id!: string
    shopName!: string
    userId!: string
    shopAddress!: string
    shopPhone!: string
    shopEmail!: string
    shopDescription!: string
    createdAt!: string
    updatedAt!: string

    static override tableName = 'shop'
    static override idColumn = ['id']

    static override jsonSchema = {
        type: 'object',
        properties: {
            id: { type: 'string' },
            shopName: { type: 'string' },
            userId: { type: 'string' },
            shopAddress: { type: 'string' },
            shopPhone: { type: 'string' },
            shopEmail: { type: 'string' },
            shopDescription: { type: 'string' }
        }
    }

    static override relationMappings = {
        user: {
            relation: Model.HasOneRelation,
            modelClass: User,
            join: {
                from: 'shop.user_id',
                to: 'user.id'
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

export const ShopRW = Shop.bindKnex(knexWrite)
export const ShopRO = Shop.bindKnex(knexReadOnly)

export default Shop
