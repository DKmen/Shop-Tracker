import { Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import { CustomerRW } from '../../../models/customer';
import { InvalidParametersError } from '../../../errors';

import type { BaseError } from '../../../errors';

interface CustomerCreateRequestBody {
    name: string;
    customerPhone: string;
    customerEmail: string;
    customerAddress: string;
}

const createCustomer = async (req: Request<unknown, unknown, CustomerCreateRequestBody>, res: Response) => {
    const { name: customerName, customerPhone, customerEmail, customerAddress } = req.body;
    const { id: shopId } = req?.context?.shop;

    logger.info(`Creating customer for shop ${shopId} started`);
    logger.debug({ customerName, customerPhone, customerEmail, customerAddress });

    const trx = await CustomerRW.startTransaction();
    logger.info('Transaction started');

    try {
        // check if customerName is provided
        if (customerName === undefined) {
            throw new InvalidParametersError(['customerName']);
        }
        logger.info('Customer name provided');
        logger.debug(customerName);

        // create customer
        const customer = await CustomerRW.query(trx).insert({
            customerName,
            customerEmail,
            customerPhone,
            customerAddress,
            shopId
        });
        logger.info('Customer created');
        logger.debug(customer);

        // commit transaction
        await trx.commit();
        logger.info('Transaction committed');

        // send success response
        logger.info('Creating product completed');
        res.status(201).json({ customer });
    } catch (error) {
        logger.error('Error creating customer');
        logger.error(error);

        await trx.rollback();
        logger.info('Transaction rolled back');

        // send error response
        res.status(400).json({ errors: [error as BaseError] });
    }
}
export default createCustomer;