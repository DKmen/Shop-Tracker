import { Model, snakeCaseMappers } from 'objection'
import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'

import { formatToDBTimestamp } from '../utils/helpers.js'
import { writeConfig, readOnlyConfig } from '../../knexfile.js'
import Shop from './shop.js'
import CSVStatus from '../types/csvStatus.js'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class ProductCSV extends Model {
    id!: string
    name!: string
    description!: string
    shopId!: string
    csvFilePath!: string
    status!: CSVStatus
    createdAt!: string
    updatedAt!: string

    static override tableName = 'product_csv'
    static override idColumn = ['id']

    static override jsonSchema = {
        type: 'object',
        properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            shopId: { type: 'string' },
            csvFilePath: { type: 'string' },
            status: { type: 'string', enum: ['processing', 'completed', 'failed'] }
        }
    }

    static override relationMappings = {
        shop: {
            relation: Model.HasOneRelation,
            modelClass: Shop,
            join: {
                from: 'product_csv.shop_id',
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

export const ProductCSVRW = ProductCSV.bindKnex(knexWrite)
export const ProductCSVRO = ProductCSV.bindKnex(knexReadOnly)

export default ProductCSV
