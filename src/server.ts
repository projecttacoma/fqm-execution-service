import app from './app';
import { logger } from './utils/logger';

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  logger.info(`Service running at http://localhost:${port}`);
});
