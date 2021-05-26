import bodyParser from 'body-parser';
import express from 'express';
import { logger } from './utils/logger';
import { RequestBody } from './types/server-types';
import { Calculator } from 'fqm-execution';

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));

app.post('/calculateRaw', async (req, res) => {
  const body = req.body as RequestBody;

  logger.info(`[${req.ip}] POST /calculateRaw`);

  const { measure, patients, options } = body;
  try {
    const rawResult = await Calculator.calculateRaw(
      measure,
      patients,
      options || {} // options are optional, so this defaults to an empty Object
    );
    return res.json(rawResult.results);
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.post('/calculateMeasureReports', async (req, res) => {
  const body = req.body as RequestBody;

  logger.info(`[${req.ip}] POST /calculateMeasureReports`);

  const { measure, patients, options } = body;
  try {
    const measureReportResult = await Calculator.calculateMeasureReports(
      measure,
      patients,
      options || {} // options are optional, so this defaults to an empty Object
    );
    return res.json(measureReportResult.results);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// matches '/Measure/$care-gaps' or encoded '/Measure/%24care-gaps'
app.post(/^\/Measure\/(\$|%24)care-gaps/, async (req, res) => {
  const body = req.body as RequestBody;

  logger.info(`[${req.ip}] POST /Measure/$care-gaps`);

  const { measure, patients, options } = body;
  try {
    const careGapResult = await Calculator.calculateGapsInCare(
      measure,
      patients,
      options || {} // options are optional, so this defaults to an empty Object
    );
    return res.json(careGapResult.results);
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.post('/calculate', async (req, res) => {
  const body = req.body as RequestBody;

  logger.info(`[${req.ip}] POST /calculate`);

  const { measure, patients, options } = body;
  try {
    const calculateResult = await Calculator.calculate(
      measure,
      patients,
      options || {} // options are optional, so this defaults to an empty Object
    );
    return res.json(calculateResult.results);
  } catch (error) {
    return res.status(500).send(error);
  }
});

export default app;
