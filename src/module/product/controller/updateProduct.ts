import { Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import { ProductRW } from '../../../models/product';
import { ResourcesNotFoundError } from '../../../errors';

import type { BaseError } from '../../../errors';
import { CategoryRW } from '../../../models/category';

interface ProductUpdateRequestBody {
    name: string;
    unitPrice: number;
    sellingPrice: number;
    categoryId: string;
    description: string;
    expireTimeInDays: number;
}

interface ProductUpdateRequestParams {
    id: string;
}

const updateProduct = async (req: Request<ProductUpdateRequestParams, unknown, ProductUpdateRequestBody>, res: Response) => {
    const { name: productName, unitPrice, sellingPrice, categoryId, description, expireTimeInDays } = req.body;
    const { id: productId } = req.params;
    const { id: shopId } = req?.context?.shop;

    logger.info(`Update product for shop ${shopId} started`);
    logger.debug({ productName, unitPrice, sellingPrice, categoryId, description, shopId, expireTimeInDays });

    const trx = await ProductRW.startTransaction();
    logger.info('Transaction started');

    try {

        // check if category exists
        if (categoryId !== undefined) {
            const category = await CategoryRW.query(trx).findById(categoryId);
            if (category === undefined) {
                throw new ResourcesNotFoundError(['category']);
            }
            logger.info('Category exists');
            logger.debug(category);
        }

        // check if product exists
        const product = await ProductRW.query(trx).findById(productId);
        if (product === undefined) {
            throw new ResourcesNotFoundError(['product']);
        }
        logger.info('Product exists');
        logger.debug(product);

        // update product
        const updateProduct = await product.$query(trx).patchAndFetch({ productName, categoryId, unitPrice, sellingPrice, description, expireTimeInDays });
        logger.info('Product created');
        logger.debug(updateProduct);

        // commit transaction
        await trx.commit();
        logger.info('Transaction committed');

        // send success response
        logger.info('Update product completed');
        res.status(201).json({ product });
    } catch (error) {
        logger.error('Error update product');
        logger.error(error);

        await trx.rollback();
        logger.info('Transaction rolled back');

        // send error response
        res.status(400).json({ errors: [error as BaseError] });
    }
}
export default updateProduct;
