import { Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import { ProductRW } from '../../../models/product';
import { ResourcesNotFoundError } from '../../../errors';
import { QuantityRW } from '../../../models/quantity';
import { formatToDBTimestamp } from '../../../utils/helpers';

import type { BaseError } from '../../../errors';

interface ProductCreateRequestBody {
    name: string;
    unitPrice: number;
    sellingPrice: number;
    categoryId: string;
    quantity: number;
    description: string;
    expireTimeInDays: number;
}

const createProduct = async (req: Request<unknown, unknown, ProductCreateRequestBody>, res: Response) => {
    const { name: productName, unitPrice, sellingPrice, categoryId, quantity, description, expireTimeInDays } = req.body;
    const { id: shopId } = req?.context?.shop;

    logger.info(`Creating product for shop ${shopId} started`);
    logger.debug({ productName, unitPrice, sellingPrice, categoryId, quantity, description, shopId, expireTimeInDays });

    const trx = await ProductRW.startTransaction();
    logger.info('Transaction started');

    try {
        // check if name is provided or not
        if (productName === undefined) {
            throw new ResourcesNotFoundError(['productName']);
        }
        logger.info('Product name provided');

        // check if unitPrice is provided or not
        if (unitPrice === undefined) {
            throw new ResourcesNotFoundError(['unitPrice']);
        }
        logger.info('Unit price provided');

        // check if sellingPrice is provided or not
        if (sellingPrice === undefined) {
            throw new ResourcesNotFoundError(['sellingPrice']);
        }
        logger.info('Selling price provided');

        // check if categoryId is provided
        if (categoryId === undefined) {
            throw new ResourcesNotFoundError(['categoryId']);
        }
        logger.info('Category id provided');

        // check if quantity is provided
        if (quantity === undefined) {
            throw new ResourcesNotFoundError(['quantity']);
        }
        logger.info('Quantity provided');

        // check if description is provided
        if (description === undefined) {
            throw new ResourcesNotFoundError(['description']);
        }
        logger.info('Description provided');

        // check if expireTimeInDays is provided
        if (expireTimeInDays === undefined) {
            throw new ResourcesNotFoundError(['expireTimeInDays']);
        }
        logger.info('Expire time in days provided');

        // create product
        const product = await ProductRW.query(trx).insert({
            productName,
            categoryId,
            unitPrice,
            sellingPrice,
            quantity,
            description,
            expireTimeInDays,
            shopId
        });
        logger.info('Product created');
        logger.debug(product);

        // calculate expire time
        const expireTime = new Date();
        expireTime.setDate(expireTime.getDate() + expireTimeInDays);
        logger.info('Expire time calculated');
        logger.debug({ currentTime: new Date(), expireTime });

        // add quantity for product
        const quantityAddedProduct = await QuantityRW.query(trx).insert({
            productId: product.id,
            quantity,
            expireTime: formatToDBTimestamp(expireTime)
        })
        logger.info('Quantity added for product');
        logger.debug(quantityAddedProduct);

        // commit transaction
        await trx.commit();
        logger.info('Transaction committed');

        // send success response
        logger.info('Creating product completed');
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
export default createProduct;