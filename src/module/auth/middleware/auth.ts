import { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'

import { getAccessToken } from '../utils';
import { logger } from '../../../utils/logger';
import { ResourcesNotFoundError } from '../../../errors';
import { UserRO } from '../../../models/user';

const { JWT_SECRET } = process.env

if (JWT_SECRET === undefined) {
    throw new Error('JWT_SECRET is not defined')
}

// impliment middleware for authencation
export const auth = async (req: Request, _: Response, next: NextFunction): Promise<void> => {
    // get access token from request headers and remove Bearer from token.
    const accessToken = getAccessToken(req)
    logger.info('Auth middleware request received')
    logger.debug({ accessToken })

    // verify jwt token
    const tokenPayload = jwt.verify(accessToken, JWT_SECRET) as JwtPayload
    logger.info('Token verified successfully')
    logger.debug({ tokenPayload })

    const user = tokenPayload?.['user']
    if (user === undefined) {
        throw new ResourcesNotFoundError(['user'])
    }
    logger.info('User found in token')
    logger.debug({ user })

    //check user is exist or not
    const userExist = await UserRO.query().findOne({ email: user.id });
    if (userExist === undefined) {
        throw new ResourcesNotFoundError(['user'])
    }

    //store user data in request object
    req.context = { user }
    logger.info('User data stored in request object')
    logger.info('Auth middleware request completed')

    next();
}