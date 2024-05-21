import { Request, Response } from 'express';
import { logger } from '../../../utils/logger';
import { ShopRW } from '../../../models/shop';
import { BaseError } from '../../../errors';

interface ShopCreateRequestBody {
    name: string;
}

const createShop = async (req: Request<ShopCreateRequestBody>, res: Response) => {
    const { name: shopName } = req.body;
    const { id: userId } = req?.context?.user ?? {};

    logger.info('Create Shop Controller is started');
    logger.debug({ shopName, userId });

    const trx = await ShopRW.startTransaction();

    try {
        // create shop
        const shop = await ShopRW.query(trx).insert({ shopName, userId });
        logger.info('Shop created successfully');
        logger.debug({ shop });

        await trx.commit();
        logger.debug('Transaction commited successfully');
        logger.info('Create Shop Controller is completed');

        res.status(201).json({ shop });
    } catch (err) {
        logger.error('Error in creating shop');
        logger.error(err);

        await trx.rollback();
        logger.debug('Transaction rollback successfully');

        res.status(500).send([err as BaseError]);
    }

}
export default createShop;