import { Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import { InvoiceRO } from '../../../models/invoice';

import type { BaseError } from '../../../errors';

interface InvoiceListRequestQuery {
    offset: string;
    limit: string;
    customerId?: string;
}

const listInvoice = async (req: Request<unknown, unknown, unknown, InvoiceListRequestQuery>, res: Response) => {
    const { offset = 0, limit = 50, customerId } = req.query;
    const { id: shopId } = req?.context?.shop;

    logger.info(`List Invoice for shop ${shopId} started`);
    logger.debug({ shopId });

    const trx = await InvoiceRO.startTransaction();
    logger.info('Transaction started');

    try {
        // fetch Invoice
        const query = InvoiceRO.query(trx).where({ 'shop_id': shopId }).withGraphJoined('items').withGraphJoined('items').withGraphFetched('shop').withGraphFetched('customer');

        if (customerId !== undefined) {
            await query.where({ 'customer_id': customerId });
        }

        const [Invoices, total] = await Promise.all([
            query.offset(Number(offset)).limit(Number(limit)),
            query.resultSize()
        ]);
        logger.info('Invoices fetched');
        logger.debug(Invoices);

        const totalPage = Math.ceil(total / Number(limit));
        const currentPage = Math.ceil(Number(offset) / Number(limit)) + 1;
        logger.debug({ totalPage, currentPage });

        // commit transaction
        await trx.commit();
        logger.info('Transaction committed');

        // send success response
        logger.info('List invoice completed');
        res.status(201).json({ Invoices, totalPage, currentPage });
    } catch (error) {
        logger.error('Error list Invoice');
        logger.error(error);

        await trx.rollback();
        logger.info('Transaction rolled back');

        // send error response
        res.status(400).json({ errors: [error as BaseError] });
    }
}

export default listInvoice;
