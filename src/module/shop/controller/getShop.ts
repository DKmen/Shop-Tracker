import { Request, Response } from 'express';
import { logger } from '../../../utils/logger';
import { ShopRO } from '../../../models/shop';
import type { BaseError } from '../../../errors';
import { ResourcesNotFoundError } from '../../../errors';

interface ShopGetRequestParams {
    id: string;
}
const getShop = async (req: Request<ShopGetRequestParams>, res: Response) => {
    const { id: userId } = req?.context?.user ?? {};
    const { id: shopId } = req.params;

    logger.info('Get Shop Controller is started');
    logger.debug({ shopId, userId });

    const trx = await ShopRO.startTransaction();

    try {
        // create shop
        const shop = await ShopRO.query(trx).findOne({ id: shopId, user_id: userId });
        if (!shop) {
            throw new ResourcesNotFoundError(['shop']);
        }
        logger.info('Shop find successfully');
        logger.debug({ shop });

        await trx.commit();
        logger.debug('Transaction commited successfully');
        logger.info('Find Shop Controller is completed');

        res.status(201).json({ shop });
    } catch (err) {
        logger.error('Error in creating shop');
        logger.error(err);

        await trx.rollback();
        logger.debug('Transaction rollback successfully');

        res.status(500).send([err as BaseError]);
    }

}
export default getShop;