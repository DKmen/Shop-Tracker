import { Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import { CustomerRO } from '../../../models/customer';

import type { BaseError } from '../../../errors';

interface CustomerListRequestQuery {
    offset: string;
    limit: string;
}

const listCustomer = async (req: Request<unknown, unknown, unknown, CustomerListRequestQuery>, res: Response) => {
    const { offset=0, limit=50 } = req.query;
    const { id: shopId } = req?.context?.shop;

    logger.info(`List customer for shop ${shopId} started`);
    logger.debug({ shopId });

    const trx = await CustomerRO.startTransaction();
    logger.info('Transaction started');

    try {
        // fetch customer
        const query = CustomerRO.query(trx).where({ 'shop_id': shopId });

        const [customers, total] = await Promise.all([
            query.offset(Number(offset)).limit(Number(limit)),
            query.resultSize()
        ]);
        logger.info('Customers fetched');
        logger.debug(customers);

        const totalPage = Math.ceil(total / Number(limit));
        const currentPage = Math.ceil(Number(offset) / Number(limit)) + 1;
        logger.debug({ totalPage, currentPage });

        // commit transaction
        await trx.commit();
        logger.info('Transaction committed');

        // send success response
        logger.info('List product completed');
        res.status(201).json({ customers, totalPage, currentPage });
    } catch (error) {
        logger.error('Error get customer');
        logger.error(error);

        await trx.rollback();
        logger.info('Transaction rolled back');

        // send error response
        res.status(400).json({ errors: [error as BaseError] });
    }
}

export default listCustomer;
