import { Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import { ProductRO } from '../../../models/product';
import { InvalidParametersError, ResourcesNotFoundError } from '../../../errors';

import type { BaseError } from '../../../errors';

interface ProductGetRequestParams {
    id: string;
}

const getProduct = async (req: Request<ProductGetRequestParams>, res: Response) => {
    const { id: productId } = req.params;
    const { id: shopId } = req?.context?.shop;

    logger.info(`Get product for shop ${shopId} started`);

    const trx = await ProductRO.startTransaction();
    logger.info('Transaction started');

    try {
        // check if productID is provided
        if (productId === undefined) {
            throw new InvalidParametersError(['productId']);
        }
        logger.info('Product ID provided');
        logger.debug(productId);

        // check if shopId is provided
        if (shopId === undefined) {
            throw new InvalidParametersError(['shopId']);
        }
        logger.info('Shop ID provided');
        logger.debug(shopId);

        // check if product exists
        const product = await ProductRO.query(trx).findById(productId);
        if (product === undefined) {
            throw new ResourcesNotFoundError(['product']);
        }
        logger.info('Product exists');
        logger.debug(product);

        // commit transaction
        await trx.commit();
        logger.info('Transaction committed');

        // send success response
        logger.info('Get product completed');
        res.status(201).json({ product });
    } catch (error) {
        logger.error('Error creating product');
        logger.error(error);

        await trx.rollback();
        logger.info('Transaction rolled back');

        // send error response
        res.status(400).json({ errors: [error as BaseError] });
    }
}
export default getProduct;
