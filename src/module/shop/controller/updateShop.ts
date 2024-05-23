import { Request, Response } from 'express';
import { logger } from '../../../utils/logger';
import { ShopRO, ShopRW } from '../../../models/shop';
import { BaseError, ResourcesNotFoundError } from '../../../errors';

interface ShopUpdateRequestBody {
    name: string;
    address: string;
    phone: string;
    email: string;
    description: string;
}

const updateShop = async (req: Request<unknown, unknown, ShopUpdateRequestBody>, res: Response) => {
    const { name: shopName, address: shopAddress, phone: shopPhone, email: shopEmail, description: shopDescription } = req.body;
    const { id: userId } = req?.context?.user ?? {};
    const { id: shopId } = req?.context?.shop ?? {};

    logger.info('Update Shop Controller is started');
    logger.debug({ shopName, userId, shopAddress, shopPhone, shopEmail, shopDescription, shopId });

    const trx = await ShopRW.startTransaction();
    logger.info('Transaction started successfully');

    try {
        // check shopId and userId is defined
        if(shopId === undefined){
            throw new ResourcesNotFoundError(['shopId']);
        }
        logger.info('ShopId is defined');

        if(userId === undefined){
            throw new ResourcesNotFoundError(['userId']);
        }
        logger.info('UserId is defined');

        // find shop
        const shop = await ShopRO.query(trx).findOne({ id: shopId, user_id: userId });
        logger.debug({ shop });

        if (!shop) {
            throw new ResourcesNotFoundError(['shop']);
        }
        logger.info('Shop found successfully');
        logger.debug({ shop });

        // update shop
        const updatedShop = await shop.$query(trx).updateAndFetch({ shopName , shopAddress, shopPhone, shopEmail, shopDescription});
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