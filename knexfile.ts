import 'dotenv/config'

const { DB_NAME = '', DB_HOST = '', DB_HOST_RO = '', DB_PORT = '5432', DB_USER = '', DB_PASS = '', DB_POOL_MIN = '1', DB_POOL_MAX = '10', DB_POOL_MIN_RO = '1', DB_POOL_MAX_RO = '10', DB_TYPE = 'pg' } = process.env

export const readOnlyConfig = {
  client: DB_TYPE,
  connection: () => ({
    database: DB_NAME,
    host: DB_HOST_RO !== '' ? DB_HOST_RO : DB_HOST,
    password: DB_PASS,
    port: +DB_PORT,
    user: DB_USER
  }),
  pool: {
    min: +DB_POOL_MIN_RO,
    max: +DB_POOL_MAX_RO
  }
}

export const writeConfig = {
  client: DB_TYPE,
  connection: () => ({
    database: DB_NAME,
    host: DB_HOST,
    password: DB_PASS,
    port: +DB_PORT,
    user: DB_USER
  }),
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: './seeds'
  },
  pool: {
    min: +DB_POOL_MIN,
    max: +DB_POOL_MAX
  }
}

export default writeConfig
