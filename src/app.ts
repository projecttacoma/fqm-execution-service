import express from 'express';
import { logger } from './utils/logger';

const app = express();

// TODO: This is just an example request for demonstration
app.get('/', (req, res) => {
  logger.info(`${req.ip} GET /`);
  return res.json({
    example: true
  });
});

export default app;
