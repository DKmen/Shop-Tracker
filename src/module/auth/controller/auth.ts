import type { Request, Response } from 'express';
import { createId } from '@paralleldrive/cuid2'
import { BaseError, ResourcesNotFoundError } from '../../../errors';

import { logger } from '../../../utils/logger';
import { decode, generateToken } from '../utils/token';
import { JwtPayload } from 'jsonwebtoken';
import { UserRO } from '../../../models/user';

export interface GenerateMegicLinkRequest extends JwtPayload {
    email: string;
}

export interface VerifyMegicLinkRequest {
    accessToken: string;
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
    try {
        // get token from request body
        const { accessToken } = req.body;
        logger.info('VerifyMegicLink request received');
        logger.debug(req.body);

        // check if token is provided or not
        if (accessToken === undefined) {
            throw new ResourcesNotFoundError(['accessToken']);
        }

        // verify token
        const { email } = decode(accessToken) as GenerateMegicLinkRequest;
        logger.info('Megic token verified successfully');
        logger.debug(email)

        // check if user exists or not
        const user = await UserRO.query().findOne({ email });
        if (user === undefined) {
            throw new ResourcesNotFoundError(['user']);
        }
        logger.info('User found successfully');
        logger.debug(user);

        // generate jwt token
        const token = generateToken(createId(), { user });
        logger.info('JWT token generated successfully');
        logger.debug(token);

        // send success response
        res.status(200).json({ accessToken: token });
        logger.info('VerifyMegicLink request completed');

    } catch (error) {
        logger.error(error);
        logger.info('Error in verifyMegicLink');
        // send error response
        res.status(400).json({ errors: [error as BaseError] });
    }
}