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

app.post('/calculateMeasureReports', (req, res) => {
  const body = req.body as RequestBody;

  logger.info(`[${req.ip}] POST /calculateMeasureReports`);

  const { measure, patients, options } = body;
  try {
    // default calculations to true
    let opt = options ?? {};
    opt.calculateHTML = options?.calculateHTML ?? true;
    opt.calculateSDEs = options?.calculateSDEs ?? true;

    const result = Calculator.calculateMeasureReports(measure, patients, opt);
    return res.json(result);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// matches '/Measure/$care-gaps' or encoded '/Measure/%24care-gaps'
app.post(/^\/Measure\/(\$|%24)care-gaps/, (req, res) => {
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
