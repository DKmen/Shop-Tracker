import { Request, Response } from 'express';
import { logger } from '../../../utils/logger';
import { ShopRO } from '../../../models/shop';
import { ResourcesNotFoundError, type BaseError } from '../../../errors';

const listShop = async (req: Request<unknown, unknown, unknown, Record<string, string>>, res: Response) => {
    const { LIST_LIMIT = 50 } = process.env
    const { id: userId } = req?.context?.user ?? {};
    const { offset = 0, limit = LIST_LIMIT } = req.query

    logger.info('list Shop Controller is started');
    logger.debug({ userId });

    const trx = await ShopRO.startTransaction();

    try {
        if (userId === undefined) {
            throw new ResourcesNotFoundError(['user']);
        }

        const query = ShopRO.query(trx).where({ user_id: userId });

        // create shop
        const [shops, total] = await Promise.all([
            query.offset(Number(offset)).limit(Number(limit)),
            query.resultSize()
        ]);
        logger.info('Shop find successfully');
        logger.debug({ shops, total });

        const totalPages = Math.ceil(total / Number(limit))
        const currentPage = Math.floor(Number(offset) / Number(limit)) + 1
        logger.debug({ totalPages, currentPage })

        logger.info('Shops find successfully');
        logger.debug({ shops, totalPages, currentPage });

        await trx.commit();
        logger.debug('Transaction commited successfully');
        logger.info('Find Shop Controller is completed');

        res.status(201).json({ shops, totalPages, currentPage });
    } catch (err) {
        logger.error('Error in creating shop');
        logger.error(err);

        await trx.rollback();
        logger.debug('Transaction rollback successfully');

        res.status(500).send([err as BaseError]);
    }

}
export default listShop;