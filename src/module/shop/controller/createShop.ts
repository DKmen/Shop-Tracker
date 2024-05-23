import { Request, Response } from 'express';
import { logger } from '../../../utils/logger';
import { ShopRW } from '../../../models/shop';
import { BaseError } from '../../../errors';
import { generateToken } from '../../auth/utils/token';
import { createId } from '@paralleldrive/cuid2';

interface ShopCreateRequestBody {
    name: string;
    address: string;
    phone: string;
    email: string;
    description: string;
}

const createShop = async (req: Request<unknown, unknown, ShopCreateRequestBody>, res: Response) => {
    const { name: shopName, address: shopAddress, phone: shopPhone, email: shopEmail, description: shopDescription } = req.body;
    const { id: userId } = req?.context?.user ?? {};

    logger.info('Create Shop Controller is started');
    logger.debug({ shopName, userId, shopAddress, shopPhone, shopEmail, shopDescription });

    const trx = await ShopRW.startTransaction();

    try {
        // create shop
        const shop = await ShopRW.query(trx).insert({ shopName, userId, shopAddress, shopPhone, shopEmail, shopDescription });
        logger.info('Shop created successfully');
        logger.debug({ shop });

        // create access token
        const accessToken = generateToken(createId(), { shop, user: req?.context?.user });
        logger.info('Access token generated successfully');
        logger.debug(accessToken);

        await trx.commit();
        logger.debug('Transaction commited successfully');
        logger.info('Create Shop Controller is completed');

        res.status(201).json({ shop, accessToken });
    } catch (err) {
        logger.error('Error in creating shop');
        logger.error(err);

        await trx.rollback();
        logger.debug('Transaction rollback successfully');

        res.status(500).send([err as BaseError]);
    }

}
export default createShop;