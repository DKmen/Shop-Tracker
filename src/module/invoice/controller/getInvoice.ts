import { Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import { InvoiceRO } from '../../../models/invoice';

import type { BaseError } from '../../../errors';

interface InvoiceGetParams {
    id: string
}

const getInvoice = async (req: Request<InvoiceGetParams>, res: Response) => {
    const { id: InvoiceId } = req.params;
    const { id: shopId } = req?.context?.shop;

    logger.info(`Get Invoice for shop ${shopId} started`);
    logger.debug({ InvoiceId, shopId });

    const trx = await InvoiceRO.startTransaction();
    logger.info('Transaction started');

    try {
        // fetch Invoice
        const Invoice = await InvoiceRO.query(trx).findOne({ 'invoice.id': InvoiceId, 'shop_id': shopId }).withGraphJoined('items').withGraphFetched('customer').withGraphFetched('shop');
        logger.info('Invoice fetched');
        logger.debug(Invoice);

        // commit transaction
        await trx.commit();
        logger.info('Transaction committed');

        // send success response
        logger.info('Get invoice completed');
        res.status(201).json({ Invoice });
    } catch (error) {
        logger.error('Error get Invoice');
        logger.error(error);

        await trx.rollback();
        logger.info('Transaction rolled back');

        // send error response
        res.status(400).json({ errors: [error as BaseError] });
    }
}

export default getInvoice;
