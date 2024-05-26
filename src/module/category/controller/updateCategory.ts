import { Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import { InvalidParametersError, ResourcesNotFoundError } from '../../../errors';
import { CategoryRW } from '../../../models/category';

import type { BaseError } from '../../../errors';

interface CategoryUpdateRequestBody {
    name: string;
    description: string;
}

type CategoryUpdateRequestParams = {
    id: string;
}

const updateCategory = async (req: Request<CategoryUpdateRequestParams, unknown, CategoryUpdateRequestBody>, res: Response) => {
    const { name: categoryName, description } = req.body;
    const { id: categoryId } = req.params;
    const { id: shopId } = req?.context?.shop ?? {};

    logger.info('Update Category Controller is started');
    logger.debug({ categoryName, description, shopId, categoryId });

    const trx = await CategoryRW.startTransaction();
    logger.info('Transaction started successfully');

    try {

        // check category id is defined
        if (categoryId === undefined) {
            throw new InvalidParametersError(['category']);
        }

        // check if category exists
        const category = await CategoryRW.query(trx).findById(categoryId)
        if (category === undefined) {
            throw new ResourcesNotFoundError(['category'])
        }
        logger.info('category find successfully');
        logger.debug({ category });

        // update category
        const updatedCategory = await category.$query(trx).patchAndFetch({ categoryName, description });
        logger.info('category updated successfully');
        logger.debug({ updatedCategory });

        await trx.commit();
        logger.debug('Transaction commited successfully');
        logger.info('Create Category Controller is completed');

        res.status(201).json({ category: updatedCategory });
    } catch (err) {
        logger.error('Error in creating shop');
        logger.error(err);

        await trx.rollback();
        logger.debug('Transaction rollback successfully');

        res.status(500).send([err as BaseError]);
    }
}

export default updateCategory;