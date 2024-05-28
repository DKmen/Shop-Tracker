import { Request, Response } from 'express';

import ReportType from '../../../types/reportType';
import { logger } from '../../../utils/logger';
import { ReportRW } from '../../../models/report';
import { pushSQSMessage } from '../../../service/aws-service';
import { InvalidParametersError, type BaseError } from '../../../errors';

interface ReportCreateRequestBody {
    reportType: ReportType;
    startDate: string;
    endDate: string;
}

const createReport = async (req: Request<unknown, unknown, ReportCreateRequestBody>, res: Response) => {
    const { reportType, startDate, endDate } = req.body;
    const { id: shopId } = req?.context?.shop;

    logger.info(`Creating report for shop ${shopId} started`);
    logger.debug({ reportType, startDate, endDate });

    const trx = await ReportRW.startTransaction();
    logger.info('Transaction started');

    try {
        if (reportType === undefined) {
            throw new InvalidParametersError(['reportType']);
        }
        logger.info('Report type provided');

        if (startDate === undefined) {
            throw new InvalidParametersError(['startDate']);
        }
        logger.info('Start date provided');

        if (endDate === undefined) {
            throw new InvalidParametersError(['endDate']);
        }
        logger.info('End date provided')

        // Create a new report
        const report = await ReportRW.query(trx).insert({
            shopId,
            reportType,
            startDate,
            endDate,
        });
        logger.info('Report created');
        logger.debug(report);

        // publish a message to the queue
        const message = await pushSQSMessage({ shopId, reportType, startDate, endDate });
        logger.info('Message pushed to SQS queue');
        logger.debug(message);

        await trx.commit();
        logger.info('Transaction committed');

        // send success response
        res.status(201).json(report);
    } catch (error) {
        // log error
        logger.error('Error creating report');
        logger.error(error);

        // rollback transaction
        await trx.rollback();
        logger.info('Transaction rolled back');

        // send error response
        res.status(400).json({ errors: [error as BaseError] });
    }
}

export default createReport;