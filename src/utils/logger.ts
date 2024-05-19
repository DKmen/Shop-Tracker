import { pino, type LoggerOptions } from 'pino'

const { LOG_LEVEL = 'info' } = process.env

const opts: LoggerOptions = {
    level: LOG_LEVEL
}

export const logger = pino(opts)