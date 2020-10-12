import bodyParser from 'body-parser';
import express from 'express';
import { logger } from './utils/logger';
import { RequestBody } from './types/server-types';
import { Calculator } from 'fqm-execution';

const app = express();

app.use(bodyParser.json());

app.post('/calculateRaw', (req, res) => {
  const body = req.body as RequestBody;

  logger.info(`[${req.ip}] POST /calculate`);

  // TODO: Update return result to be a call to the library
  const { measure, patients, options } = body;
  const rawResult = Calculator.calculateRaw(
    measure,
    patients,
    options || {}
  );
});

export default app;
