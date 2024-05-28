import { Model, snakeCaseMappers } from 'objection'
import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'

import { formatToDBTimestamp } from '../utils/helpers.js'
import { writeConfig, readOnlyConfig } from '../../knexfile.js'
import ReportType from '../types/reportType.js'
import ReportStatus from '../types/reportStatus.js'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class Report extends Model {
    id!: string
    shopId!: string
    reportType!: ReportType
    startDate!: string
    endDate!: string
    status!: ReportStatus
    updatedAt!: string
    createdAt!: string

    static override tableName = 'report'
    static override idColumn = ['id']

    static override jsonSchema = {
        type: 'object',
        properties: {
            id: { type: 'string' },
            shopId: { type: 'string' },
            reportType: { type: 'string' },
            startDate: { type: 'string' },
            endDate: { type: 'string' },
            status: { type: 'string' },
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

export const ReportRW = Report.bindKnex(knexWrite)
export const ReportRO = Report.bindKnex(knexReadOnly)

export default Report
