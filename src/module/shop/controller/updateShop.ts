import { Request, Response } from 'express';
import { logger } from '../../../utils/logger';
import { ShopRO, ShopRW } from '../../../models/shop';
import { BaseError, ResourcesNotFoundError } from '../../../errors';

interface ShopUpdateRequestBody {
    name: string;
}

interface ShopUpdateRequestParams {
    id: string;
}

const updateShop = async (req: Request<ShopUpdateRequestParams, ShopUpdateRequestBody>, res: Response) => {
    const { name: shopName } = req.body;
    const { id: shopId } = req.params;
    const { id: userId } = req?.context?.user ?? {};

    logger.info('Update Shop Controller is started');
    logger.debug({ shopName, userId, shopId });

    const trx = await ShopRW.startTransaction();

    try {
        // find shop
        const shop = await ShopRO.query(trx).findOne({ id: shopId, user_id: userId });
        logger.debug({ shop });

        if (!shop) {
            throw new ResourcesNotFoundError(['shop']);
        }
        logger.info('Shop found successfully');
        logger.debug({ shop });

        // update shop
        const updatedShop = await shop.$query(trx).updateAndFetch({ shopName });
        await trx.commit();

        logger.debug('Transaction commited successfully');
        logger.info('Update Shop Controller is completed');

        res.status(201).json({ shop: updatedShop });
    } catch (err) {
        logger.error('Error in creating shop');
        logger.error(err);

        await trx.rollback();
        logger.debug('Transaction rollback successfully');

        res.status(500).send([err as BaseError]);
    }

}
export default updateShop;