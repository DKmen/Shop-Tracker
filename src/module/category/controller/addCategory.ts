import { Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import { BaseError } from '../../../errors';
import { CategoryRW } from '../../../models/category';

interface CategoryCreateRequestBody {
    name: string;
    description: string;
}

const createCategory = async (req: Request<unknown, unknown, CategoryCreateRequestBody>, res: Response) => {
    const { name: categoryName, description } = req.body;
    const { id: shopId } = req?.context?.shop ?? {};

    logger.info('Create Category Controller is started');
    logger.debug({ categoryName, description, shopId });

    const trx = await CategoryRW.startTransaction();
    logger.info('Transaction started successfully');

    try {
        // create category
        const category = await CategoryRW.query(trx).insert({ categoryName, description, shopId });
        logger.info('category created successfully');
        logger.debug({ category });

        await trx.commit();
        logger.debug('Transaction commited successfully');
        logger.info('Create Category Controller is completed');

        res.status(201).json({ category });
    } catch (err) {
        logger.error('Error in creating shop');
        logger.error(err);

        await trx.rollback();
        logger.debug('Transaction rollback successfully');

        res.status(500).send([err as BaseError]);
    }

}

export default createCategory;