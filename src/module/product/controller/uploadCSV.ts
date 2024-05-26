import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { logger } from '../../../utils/logger';
import { ProductCSVRW } from '../../../models/productCSV';

import type { BaseError } from '../../../errors';
import { preSignUrl } from '../../../service/aws-service';
import CSVStatus from '../../../types/csvStatus';

interface ProductGetRequestParams {
    id: string;
}

const uploadCSVProduct = async (req: Request<ProductGetRequestParams>, res: Response) => {
    const { id: shopId } = req?.context?.shop;

    logger.info(`Upload CSV product for shop ${shopId} started`);

    const trx = await ProductCSVRW.startTransaction();
    logger.info('Transaction started');

    try {
        // generate id
        const id = uuidv4();
        logger.info(`Generated id: ${id}`);

        // create product CSV key
        const key = `product/${shopId}/${id}.csv`;
        logger.info(`Generated key: ${key}`);

        // pre-sign URL
        const url = await preSignUrl(key);
        logger.info('Pre-signed URL generated successfully');
        logger.debug(url);

        // save product
        await ProductCSVRW.query(trx).insert({
            name:id,
            shopId,
            csvFilePath: key,
            status: CSVStatus.PROCESSING
        })

        // commit transaction
        await trx.commit();
        logger.info('Transaction committed');

        // send success response
        logger.info('Upload CSV product completed');
        res.status(201).json({ url });
    } catch (error) {
        logger.error('Error Upload CSV product');
        logger.error(error);

        await trx.rollback();
        logger.info('Transaction rolled back');

        // send error response
        res.status(400).json({ errors: [error as BaseError] });
    }
}
export default uploadCSVProduct;
