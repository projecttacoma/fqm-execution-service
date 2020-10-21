import bodyParser from 'body-parser';
import express from 'express';
import { logger } from './utils/logger';
import { RequestBody } from './types/server-types';
import { Calculator } from 'fqm-execution';

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));

app.post('/calculateRaw', (req, res) => {
  const body = req.body as RequestBody;

  logger.info(`[${req.ip}] POST /calculateRaw`);

  // TODO: Update return result to be a call to the library
  const { measure, patients, options } = body;
  try {
    const rawResult = Calculator.calculateRaw(
      measure,
      patients,
      options || {} // options are optional, so this defaults to an empty Object
    );
    return res.json(rawResult);
  } catch (error) {
    return res.status(500).send(error);
  }
});

export default app;
