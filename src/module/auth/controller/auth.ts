import type { Request, Response } from 'express';
import { createId } from '@paralleldrive/cuid2'
import { BaseError, ResourcesNotFoundError } from '../../../errors';

import { logger } from '../../../utils/logger';
import { decode, generateToken } from '../utils/token';
import { JwtPayload } from 'jsonwebtoken';
import { UserRO } from '../../../models/user';
import { ShopRO } from '../../../models/shop';

export interface GenerateMegicLinkRequest extends JwtPayload {
    email: string;
}

export interface VerifyMegicLinkRequest {
    access_token: string;
}

export interface GenerateAccessTokenRequest {
    access_token: string;
    shop_id: string;
}

/**
 * Generate magic link
 * @param req - Request object
 * @param res - Response object
 * @returns void
 * @throws ResourcesNotFoundError
 * @throws BaseError
*/
// generate auth token and send to user email for verification purpose implement function in auth controller
export const generateMegicLink = async (req: Request<any, GenerateMegicLinkRequest>, res: Response): Promise<void> => {
    try {
        // get email from request body
        const { email } = req.body;
        logger.info('GenerateMegicLink request received');
        logger.debug(req.body);

        // check if email is provided or not
        if (email === undefined) {
            throw new ResourcesNotFoundError(['email']);
        }

        // generate token
        const megicToken = generateToken('megic', req.body);
        logger.info('Megic token generated successfully');
        logger.debug(megicToken)

        // send success response
        res.status(200).json({ item: 'Link send successfully' });
        logger.info('GenerateMegicLink request completed');

    } catch (error) {
        logger.error(error);
        logger.info('Error in generateMegicLink');
        // send error response
        res.status(400).json({ errors: [error as BaseError] });
    }
}

/**
 * Verify magic link
 * @param req - Request object
 * @param res - Response object
 * @returns void
 * @throws ResourcesNotFoundError
 * @throws BaseError
*/
// verify token and reture jwt token for user authentication implement function in auth controller
export const verifyMegicLink = async (req: Request<any, VerifyMegicLinkRequest>, res: Response): Promise<void> => {
    // get token from request body
    const { access_token:accessToken } = req.body;
    logger.info('VerifyMegicLink request received');
    logger.debug(req.body);

    // start transaction
    const trx = await UserRO.startTransaction();
    logger.debug('Transaction started successfully');

    try {
        // check if token is provided or not
        if (accessToken === undefined) {
            throw new ResourcesNotFoundError(['accessToken']);
        }

        // verify token
        const { email } = decode(accessToken) as GenerateMegicLinkRequest;
        logger.info('Megic token verified successfully');
        logger.debug(email)

        // check if user exists or not
        const user = await UserRO.query(trx).findOne({ email });
        if (user === undefined) {
            throw new ResourcesNotFoundError(['user']);
        }
        logger.info('User found successfully');
        logger.debug(user);

        // generate jwt token
        const token = generateToken(createId(), { user });
        logger.info('JWT token generated successfully');
        logger.debug(token);

        // fetch shops which belongs to user
        const shops = await ShopRO.query(trx).where('user_id', user.id);

        // commit transaction
        await trx.commit();
        logger.debug('Transaction commited successfully');

        // send success response
        logger.info('VerifyMegicLink request completed');
        res.status(200).json({ shops, accessToken: token });

    } catch (error) {
        logger.error(error);
        logger.info('Error in verifyMegicLink');

        // rollback transaction
        await trx.rollback();
        logger.debug('Transaction rollback successfully');

        // send error response
        res.status(400).json({ errors: [error as BaseError] });
    }
}

/**
 * Generate access token
 * @param req - Request object
 * @param res - Response object
 * @returns void
 * @throws ResourcesNotFoundError
 * @throws BaseError
*/
// generate access token for accessing shop authentication implement function in auth controller
export const generateAccessToken = async (req: Request<unknown, unknown, GenerateAccessTokenRequest>, res: Response): Promise<void> => {
    const { access_token:accessToken, shop_id:shopId } = req.body;
    logger.info('GenerateAccessToken request received');
    logger.debug({ shopId, accessToken });

    const trx = await ShopRO.startTransaction();
    logger.debug('Transaction started successfully');

    try {
        // check if token is provided or not    
        if (accessToken === undefined) {
            throw new ResourcesNotFoundError(['accessToken']);
        }

        // check if shopId is provided or not
        if (shopId === undefined) {
            throw new ResourcesNotFoundError(['shopId']);
        }

        // verify token
        const { user } = decode(accessToken) as GenerateMegicLinkRequest;
        logger.info('JWT token verified successfully');
        logger.debug(user);

        // check if user exists or not
        const currentUser = await UserRO.query(trx).findOne({ email: user.email });
        if (currentUser === undefined) {
            throw new ResourcesNotFoundError(['user']);
        }
        logger.info('User found successfully');
        logger.debug(currentUser);

        // check if shop exists or not
        const shop = await ShopRO.query(trx).findOne({ id: shopId, user_id: currentUser.id });
        if (shop === undefined) {
            throw new ResourcesNotFoundError(['shop']);
        }
        logger.info('Shop found successfully');
        logger.debug(shop);

        // generate jwt token
        const token = generateToken(createId(), { user, shop });
        logger.info('JWT token generated successfully');
        logger.debug(token);

        await trx.commit();
        logger.debug('Transaction commited successfully');

        // send success response
        logger.info('GenerateAccessToken request completed');
        res.status(200).json({ accessToken: token });
    } catch (error) {
        logger.error(error);
        logger.info('Error in generateAccessToken');

        await trx.rollback();
        logger.debug('Transaction rollback successfully');

        // send error response
        res.status(400).json({ errors: [error as BaseError] });
    }
}