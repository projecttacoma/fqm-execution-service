import bodyParser from 'body-parser';
import express from 'express';
import { logger } from './utils/logger';
import { RequestBody } from './types/server-types';

const app = express();

app.use(bodyParser.json());

app.post('/calculate', (req, res) => {
  const body = req.body as RequestBody;

  logger.info(`[${req.ip}] POST /calculate`);

  // TODO: Update return result to be a call to the library
  const { measure, patient } = body;
  return res.json({
    measure,
    patient
  });
});

export default app;
