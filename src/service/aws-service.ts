import AWS from 'aws-sdk';
import { lookup } from 'mime-types';
import { logger } from '../utils/logger';

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME } = process.env;

AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION
});

const s3 = new AWS.S3();

export const preSignUrl = async (key: string) => {
    logger.info(`Pre-signing URL for key: ${key}`);

    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: key,
        Expires: 60 * 60 * 60,
        ContentType: lookup(key) || 'application/octet-stream'
    };
    logger.info('Initiating pre-signing of URL...')
    logger.debug(params)

    const url = await s3.getSignedUrlPromise('putObject', params);
    logger.info('Pre-signed URL generated successfully')
    logger.debug(url)

    return url;
}
