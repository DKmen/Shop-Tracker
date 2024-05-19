import type { Request } from 'express'
import { UnauthorizeError } from '../../../errors'

/**
 * @param {Express.Request} req
 * @returns {string} access token
 * @description fetches access token from request object
 */
export const getAccessToken = (req: Request): string => {
    const accessToken = req.headers.authorization
  
    if (accessToken === undefined || accessToken === '') {
      throw new UnauthorizeError(
        ['access_token'],
        'invalid authorization header.'
      )
    }
  
    return accessToken.split(' ')[1] ?? ''
  }