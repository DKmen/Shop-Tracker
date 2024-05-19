export class BaseError extends Error {
  code: string | undefined
  statusCode: number | undefined
  shortname: string | undefined
  description: string | undefined
  fields: string[] | undefined
}

export class MissingParametersError extends BaseError {
  constructor (fields: string[]) {
    super()
    this.code = 'E4011'
    this.statusCode = 400
    this.shortname = 'MissingParameters'
    this.description = 'Required parameters are missing'
    this.fields = fields
  }
}

export class InvalidParametersError extends BaseError {
  constructor (fields: string[]) {
    super()
    this.code = 'E4001'
    this.statusCode = 400
    this.shortname = 'InvalidParameters'
    this.description = 'Parameters values are invalid'
    this.fields = fields
  }
}

export class ConstraintViolationError extends BaseError {
  constructor (fields: string[], description?: string) {
    super()
    this.code = 'E4021'
    this.statusCode = 400
    this.shortname = 'ConstraintViolation'
    this.description = description ?? 'A constraint violation'
    this.fields = fields
  }
}

export class ResourcesNotFoundError extends BaseError {
  constructor (fields: string[]) {
    super()
    this.code = 'E4301'
    this.statusCode = 404
    this.shortname = 'ResourceNotFound'
    this.description = 'Resource doesn\'t exist'
    this.fields = fields
  }
}

export class UnauthorizeError extends BaseError {
  constructor (fields: string[], description?: string) {
    super()
    this.code = 'E4201'
    this.statusCode = 401
    this.shortname = 'UnAuthorized'
    this.description = description ?? 'Authentication required'
    this.fields = fields
  }
}

export class ForbiddenError extends BaseError {
  constructor (fields: string[], description?: string) {
    super()
    this.code = 'E4211'
    this.statusCode = 403
    this.shortname = 'Forbidden'
    this.description = description ?? 'Missing permissions'
    this.fields = fields
  }
}

export class InternalError extends BaseError {
  constructor (fields: string[]) {
    super()
    this.code = 'E5001'
    this.statusCode = 500
    this.shortname = 'Internal'
    this.description = 'A server error occurred'
    this.fields = fields
  }
}

export class UnreachableService extends BaseError {
  constructor (fields: string[]) {
    super()
    this.code = 'E5101'
    this.statusCode = 503
    this.shortname = 'UnreachableService'
    this.description = 'A service is not responding'
    this.fields = fields
  }
}

export class ValidationErrors extends Error {
  errors: BaseError[]

  constructor (errors: BaseError[]) {
    super()
    this.errors = errors
  }
}
