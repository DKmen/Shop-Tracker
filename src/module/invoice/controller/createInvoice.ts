import { Request, Response } from 'express';

import { logger } from '../../../utils/logger';

import { InvalidParametersError, ResourcesNotFoundError, type BaseError } from '../../../errors';
import { CustomerRO } from '../../../models/customer';
import { InvoiceRW } from '../../../models/invoice';
import { ItemRW } from '../../../models/item';
import { ProductRW } from '../../../models/product';

interface InvoiceItem {
    productId: string,
    quantity: number,
    sellingPrice: number,
    discount: number,
    gst: number
}

interface InvoiceCreateRequestBody {
    customerId: string,
    discount: number,
    items: InvoiceItem[]
}

const createInvoice = async (req: Request<unknown, unknown, InvoiceCreateRequestBody>, res: Response) => {
    const { id: shopId } = req?.context?.shop;
    const { customerId, discount, items } = req.body;

    logger.info(`Creating invoice for shop ${shopId} started`);
    logger.debug({ customerId, discount, items });

    const trx = await InvoiceRW.startTransaction();

    try {
        // chech if customerId is provided
        if (customerId === undefined) {
            throw new InvalidParametersError(['customerId']);
        }
        logger.info('Customer id provided');
        logger.debug(customerId);

        // check if items is provided
        if (items === undefined || Array.isArray(items) === false || items.length === 0) {
            throw new InvalidParametersError(['items']);
        }

        // check customer exists
        const customer = await CustomerRO.query(trx).findOne({ id: customerId, 'shop_id': shopId });
        if (customer === undefined) {
            throw new ResourcesNotFoundError(['customer']);
        }
        logger.info('Customer exists');
        logger.debug(customer);

        // create invoice
        const invoice = await InvoiceRW.query(trx).insert({
            customerId,
            discount,
            shopId,
            totalAmount: 0,
            totalAmountAfterDiscount: 0
        });
        logger.info('Invoice created');
        logger.debug(invoice);

        let allAmount = 0;
        // create invoice items
        for await (const item of items) {
            // check product exists
            const product = await ProductRW.query(trx).findOne({ id: item.productId, 'shop_id': shopId });
            if (product === undefined) {
                throw new ResourcesNotFoundError(['product']);
            }
            logger.info('Product exists');
            logger.debug(product);

            // check enough stock available
            if (product.quantity < item.quantity) {
                throw new InvalidParametersError(['quantity']);
            }
            logger.info('Enough stock available');
            logger.debug(product);

            // add item to invoice
            const totalAmount = item.quantity * item.sellingPrice * (1 - (item.discount ?? 0) / 100);
            const invoiceItem = await ItemRW.query(trx).insert({
                invoiceId: invoice.id,
                productId: item.productId,
                quantity: item.quantity,
                sellingPrice: item.sellingPrice,
                discount: item.discount,
                gst: item.gst,
                totalAmount,
                totalAmountWithGst: totalAmount * (1 + (item.gst ?? 0) / 100)
            });
            logger.info('Item created');
            logger.debug(invoiceItem);

            allAmount += invoiceItem.totalAmountWithGst;

            // update product stock
            const updatedProduct = await ProductRW.query(trx).update({ quantity: product.quantity - item.quantity }).where({ id: item.productId });
            logger.info('Product stock updated');
            logger.debug(updatedProduct);
        }

        // update invoice total amount
        const updatedInvoice = await invoice.$query(trx).patchAndFetch({ totalAmount: allAmount, totalAmountAfterDiscount: allAmount * (1 - (discount ?? 0) / 100) });

        // commit transaction
        await trx.commit();
        logger.info('Transaction commited');

        // send email to customer
        logger.info('Email sent to customer');

        // send success response
        res.status(201).json({ invoice: updatedInvoice });

    } catch (error) {
        logger.error('Error creating invoice');
        logger.error(error);
        // send error response
        res.status(400).json({ errors: [error as BaseError] });
    }
}

export default createInvoice;
