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

  const { measure, patients, options } = body;
  try {
    const rawResult = Calculator.calculateRaw(
      measure,
      patients,
      options || {} // options are optional, so this defaults to an empty Object
    );
    return res.json(rawResult.results);
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.post('/Measure/([$])care-gaps', (req, res) => {
  const body = req.body as RequestBody;

  logger.info(`[${req.ip}] POST /Measure/$care-gaps`);

  const { measure, patients, options } = body;
  try {
    const careGapResult = Calculator.calculateGapsInCare(
      measure,
      patients,
      options || {} // options are optional, so this defaults to an empty Object
    );
    return res.json(careGapResult.results);
  } catch (error) {
    return res.status(500).send(error);
  }
});

export default app;
