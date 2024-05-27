import { Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import { ProductRW } from '../../../models/product';
import { InvalidParametersError, ResourcesNotFoundError } from '../../../errors';
import { QuantityRW } from '../../../models/quantity';
import { formatToDBTimestamp } from '../../../utils/helpers';

import type { BaseError } from '../../../errors';

interface AddQuantityRequestParams {
    id: string;
}

interface AddQuantityRequestBody {
    quantity: number;
}

const addQuantity = async (req: Request<AddQuantityRequestParams, unknown, AddQuantityRequestBody>, res: Response) => {
    const { id: productId } = req.params;
    const { id: shopId } = req?.context?.shop;
    const { quantity } = req.body;

    logger.info(`Add quantity for shop ${shopId} started`);

    const trx = await ProductRW.startTransaction();
    logger.info('Transaction started');

    try {
        // check if productID is provided
        if (productId === undefined) {
            throw new InvalidParametersError(['productId']);
        }
        logger.info('Product ID provided');
        logger.debug(productId);

        // check if quantity is provided
        if (quantity === undefined) {
            throw new InvalidParametersError(['quantity']);
        }
        logger.info('Quantity provided');
        logger.debug(quantity);

        // check if product exists
        const product = await ProductRW.query(trx).findById(productId).where({ 'shop_id': shopId });
        if (product === undefined) {
            throw new ResourcesNotFoundError(['product']);
        }
        logger.info('Product exists');
        logger.debug(product);

        // update product quantity
        const updateProduct = await product.$query(trx).patchAndFetch({ quantity: product.quantity + quantity });
        logger.info('Product quantity updated');

        // add quantity to quantity table
        const expiringDate = new Date();
        expiringDate.setDate(expiringDate.getDate() + product.expireTimeInDays);
        await QuantityRW.query(trx).insert({ productId: product.id, quantity, expireTime: formatToDBTimestamp(expiringDate) });
        logger.info('Quantity added to quantity table');

        // commit transaction
        await trx.commit();
        logger.info('Transaction committed');

        // send success response
        logger.info('Add Quantity completed');
        res.status(201).json({ product: updateProduct });
    } catch (error) {
        logger.error('Error Add quantity');
        logger.error(error);

        await trx.rollback();
        logger.info('Transaction rolled back');

        // send error response
        res.status(400).json({ errors: [error as BaseError] });
    }
}
export default addQuantity;
