import { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'

import { getAccessToken } from '../utils';
import { logger } from '../../../utils/logger';
import { ResourcesNotFoundError } from '../../../errors';
import { UserRO } from '../../../models/user';
import { ShopRO } from '../../../models/shop';

const { JWT_SECRET } = process.env

if (JWT_SECRET === undefined) {
    throw new Error('JWT_SECRET is not defined')
}

// impliment middleware for authencation
export const authAccessToken = async (req: Request, _: Response, next: NextFunction): Promise<void> => {
    // get access token from request headers and remove Bearer from token.
    const accessToken = getAccessToken(req)
    logger.info('auth access token middleware request received')
    logger.debug({ accessToken })

    // start transaction
    const trx = await UserRO.startTransaction()
    logger.debug('Transaction started successfully')

    try {
        // verify jwt token
        const tokenPayload = jwt.verify(accessToken, JWT_SECRET) as JwtPayload
        logger.info('Token verified successfully')
        logger.debug({ tokenPayload })

        const user = tokenPayload?.['user']
        const shop = tokenPayload?.['shop']
        if (user === undefined) {
            throw new ResourcesNotFoundError(['user'])
        }
        logger.info('User found in token')
        logger.debug({ user })

        if (shop === undefined) {
            throw new ResourcesNotFoundError(['shop'])
        }
        logger.info('Shop found in token')
        logger.debug({ shop })

        //check user is exist or not
        const userExist = await UserRO.query(trx).findOne({ id: user.id });
        if (userExist === undefined) {
            throw new ResourcesNotFoundError(['user'])
        }
        logger.info('User found successfully')

        //check shop is exist or not
        const shopExist = await ShopRO.query(trx).findOne({ id: shop.id });
        if (shopExist === undefined) {
            throw new ResourcesNotFoundError(['shop'])
        }
        logger.info('Shop found successfully')

        //store user data in request object
        req.context = { user, shop }
        logger.info('User and Shop data stored in request object')
        logger.info('Auth middleware request completed')

        //commit transaction
        await trx.commit()
        logger.debug('Transaction commited successfully')

        next();
    } catch (error) {
        //log error
        logger.error(error)

        //rollback transaction
        await trx.rollback()
        logger.debug('Transaction rollback successfully')

        next(error)
    }
}