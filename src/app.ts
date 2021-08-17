import bodyParser from 'body-parser';
import express from 'express';
import { logger } from './utils/logger';
import { RequestBody, DataRequirementsBody } from './types/server-types';
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
    /**
     * TODO:
     * Format of RawResults output should maybe be changed in fqm-execution to adapt to new withErrors field.
     * Currently rawResults output is either the rawResults object (on a successful run) or an error message
     * with an explanation for the failure. I think we should instead just throw an error upon failure, not
     * return an error string.
     */
    return res.json({ results: rawResult.results, warnings: rawResult.withErrors });
  } catch (error) {
    logger.log({
      level: 'error',
      message: error.stack
    });
    return res.status(500).send({ name: error.name, message: error.message });
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
    return res.json({ results: measureReportResult.results, warnings: measureReportResult.withErrors });
  } catch (error) {
    logger.log({
      level: 'error',
      message: error.stack
    });
    return res.status(500).send({ name: error.name, message: error.message });
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
    return res.json({ results: careGapResult.results, warnings: careGapResult.withErrors });
  } catch (error) {
    logger.log({
      level: 'error',
      message: error.stack
    });
    return res.status(500).send({ name: error.name, message: error.message });
  }
});

// matches '/Measure/$data-requirements' or encoded '/Measure/%24data-requirements'
app.post(/^\/Measure\/(\$|%24)data-requirements/, async (req, res) => {
  const body = req.body as DataRequirementsBody;

  logger.info(`[${req.ip}] POST /Measure/$data-requirements`);

  const { measure } = body;
  try {
    const dataRequirements = Calculator.calculateDataRequirements(measure);
    return res.json({ results: dataRequirements.results, warnings: dataRequirements.withErrors });
  } catch (error) {
    logger.log({
      level: 'error',
      message: error.stack
    });
    return res.status(500).send({ name: error.name, message: error.message });
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
    return res.json({ results: calculateResult.results, withErrors: calculateResult.withErrors });
  } catch (error) {
    logger.log({
      level: 'error',
      message: error.stack
    });
    return res.status(500).send({ name: error.name, message: error.message });
  }
});

export default app;
