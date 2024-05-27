import { Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import { CustomerRO } from '../../../models/customer';

import type { BaseError } from '../../../errors';

interface CustomerGetParams {
    id: string
}

const getCustomer = async (req: Request<CustomerGetParams>, res: Response) => {
    const { id: customerId } = req.params;
    const { id: shopId } = req?.context?.shop;

    logger.info(`Get customer for shop ${shopId} started`);
    logger.debug({ customerId, shopId });

    const trx = await CustomerRO.startTransaction();
    logger.info('Transaction started');

    try {
        // fetch customer
        const customer = await CustomerRO.query(trx).findOne({ id: customerId, 'shop_id': shopId });
        logger.info('Customer fetched');
        logger.debug(customer);

        // commit transaction
        await trx.commit();
        logger.info('Transaction committed');

        // send success response
        logger.info('Get product completed');
        res.status(201).json({ customer });
    } catch (error) {
        logger.error('Error get customer');
        logger.error(error);

        await trx.rollback();
        logger.info('Transaction rolled back');

        // send error response
        res.status(400).json({ errors: [error as BaseError] });
    }
}

export default getCustomer;
