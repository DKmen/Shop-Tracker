import { Request, Response } from 'express';

import ReportType from '../../../types/reportType';
import { logger } from '../../../utils/logger';
import { ReportRO } from '../../../models/report';

import { InvalidParametersError } from '../../../errors';
import ReportStatus from '../../../types/reportStatus';

import type { BaseError } from '../../../errors';

interface ReportListRequestQuery {
    offset: number;
    limit: number;
    reportType?: ReportType;
    status?: ReportStatus;
    startDate?: string;
    endDate?: string;
}

const listReport = async (req: Request<unknown, unknown, unknown, ReportListRequestQuery>, res: Response) => {
    const { offset, limit = 50, reportType, status, startDate, endDate } = req.query;
    const { id: shopId } = req?.context?.shop;

    logger.info(`List report for shop ${shopId} started`);
    logger.debug({ offset, limit });

    const trx = await ReportRO.startTransaction();
    logger.info('Transaction started');

    try {
        if (offset === undefined) {
            throw new InvalidParametersError(['offset']);
        }

        const quary = ReportRO.query(trx).where('shop_id', shopId);

        if (reportType !== undefined) {
            await quary.where('report_type', reportType);
        }

        if (status !== undefined) {
            await quary.where('status', status);
        }

        if (startDate !== undefined) {
            await quary.where('start_date', '>=', startDate);
        }

        if (endDate !== undefined) {
            await quary.where('end_date', '<=', endDate);
        }

        const [reports, total] = await Promise.all([
            quary.offset(Number(offset)).limit(Number(limit)),
            quary.resultSize()
        ]);
        logger.info('Reports fetched');
        logger.debug(reports);

        const totalPage = Math.ceil(total / limit);
        const currentPage = Math.ceil(offset / limit) + 1;
        logger.debug({ totalPage, currentPage });

        await trx.commit();
        logger.info('Transaction committed');

        // send success response
        res.status(201).json({ reports, totalPage, currentPage });
    } catch (error) {
        // log error
        logger.error('Error fetching report');
        logger.error(error);

        // rollback transaction
        await trx.rollback();
        logger.info('Transaction rolled back');

        // send error response
        res.status(400).json({ errors: [error as BaseError] });
    }
}

export default listReport;