import 'dotenv/config';

import { logger } from './src/utils/logger.js';
import app from './app.js';

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
});

