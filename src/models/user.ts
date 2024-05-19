import { Model, snakeCaseMappers } from 'objection'
import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'

import { formatToDBTimestamp } from '../utils/helpers.js'
import { writeConfig, readOnlyConfig } from '../../knexfile.js'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class User extends Model {
    id!: string
    name!: string
    email!: string
    createdAt!: string
    updatedAt!: string

    static override tableName = 'user'
    static override idColumn = ['id']

    static override jsonSchema = {
        type: 'object',
        properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' }
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

export const UserRW = User.bindKnex(knexWrite)
export const UserRO = User.bindKnex(knexReadOnly)

export default User
