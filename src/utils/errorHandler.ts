import type { NextFunction, Request, Response } from 'express'
import { TokenExpiredError } from 'jsonwebtoken'

import { BaseError, InternalError, UnauthorizeError, ValidationErrors } from '../errors.js'
import { logger } from './logger.js'

/**
 * @param {Error} err
 * @param {Express.Response} res
 * @description handles error globally
 */
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  logger.error({ error: err, stack: err.stack })

  if (err instanceof BaseError) {
    res.status(err?.statusCode ?? 500).send(err)
    return
  }

  if (err instanceof ValidationErrors) {
    res.status(err.errors[0]?.statusCode ?? 400).send(err)
    return
  }

  if (err instanceof TokenExpiredError) {
    res.status(403).send(new UnauthorizeError([], 'Token expired'))
    return
  }

  res.status(500).send(new InternalError([]))
}
