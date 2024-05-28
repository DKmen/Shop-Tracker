import { Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import { ProductRO } from '../../../models/product';
import { InvalidParametersError } from '../../../errors';

import type { BaseError } from '../../../errors';

interface ProductListRequestQuery {
    offset: string;
    limit: string;
    categoryId?: string;
    status?: string;
}

const listProduct = async (req: Request<unknown, unknown, unknown, ProductListRequestQuery>, res: Response) => {
    const { offset, limit, categoryId } = req.query;
    const { id: shopId } = req?.context?.shop;

    logger.info(`List product for shop ${shopId} started`);

    const trx = await ProductRO.startTransaction();
    logger.info('Transaction started');

    try {
        // check if offset is provided
        if (offset === undefined) {
            throw new InvalidParametersError(['offset']);
        }
        logger.info('Offset provided');
        logger.debug(offset);

        // check if limit is provided
        if (limit === undefined) {
            throw new InvalidParametersError(['limit']);
        }
        logger.info('Limit provided');
        logger.debug(limit);

        // check if categoryId is provided
        const quary = ProductRO.query(trx).where('shop_id', shopId);

        if (categoryId !== undefined) {
            await quary.where('category_id', categoryId);
        }

        const [products, total] = await Promise.all([
            quary.offset(Number(offset)).limit(Number(limit)),
            quary.resultSize()
        ]);
        logger.info('Products fetched');
        logger.debug(products);

        const totalPage = Math.ceil(total / Number(limit));
        const currentPage = Math.ceil(Number(offset) / Number(limit)) + 1;

        // commit transaction
        await trx.commit();
        logger.info('Transaction committed');

        // send success response
        logger.info('List product completed');
        res.status(201).json({ products, totalPage, currentPage });

    } catch (error) {
        logger.error('Error creating product');
        logger.error(error);

        await trx.rollback();
        logger.info('Transaction rolled back');

        // send error response
        res.status(400).json({ errors: [error as BaseError] });
    }
}
export default listProduct;
