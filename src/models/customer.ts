import { Model, snakeCaseMappers } from 'objection'
import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'

import { formatToDBTimestamp } from '../utils/helpers.js'
import { writeConfig, readOnlyConfig } from '../../knexfile.js'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class Customer extends Model {
    id!: string
    name!: string
    email!: string
    address!: string
    createdAt!: string
    updatedAt!: string

    static override tableName = 'customer'
    static override idColumn = ['id']

    static override jsonSchema = {
        type: 'object',
        properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            address: { type: 'string' }
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
