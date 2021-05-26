import { R4 } from '@ahryman40k/ts-fhir-types';
import { Calculator, CalculatorTypes, CQLTypes } from 'fqm-execution';
import { when } from 'jest-when';
import request from 'supertest';
import app from '../src/app';

const mockMeasureBundle = <R4.IBundle>{};
const mockPatientBundles = <R4.IBundle[]>[];
const mockRawResult: { results: CQLTypes.Results | string; debugOutput?: CalculatorTypes.DebugOutput } = {
  results: {
    patientResults: {},
    unfilteredResults: {},
    localIdPatientResultsMap: {},
    patientEvaluatedRecords: {}
  },
  debugOutput: {}
};

const calculateRawSpy = jest.spyOn(Calculator, 'calculateRaw');
when(calculateRawSpy)
  .calledWith(mockMeasureBundle, mockPatientBundles, {})
  .mockReturnValue(Promise.resolve(mockRawResult));

test('patient and measure calculate', async () => {
  const response = await request(app)
    .post('/calculateRaw')
    .send({ measure: mockMeasureBundle, patients: mockPatientBundles })
    .expect(200);

  expect(response.body).toEqual(mockRawResult.results);
});

const mockCareGapsResult: { results: R4.IBundle; debugOutput?: CalculatorTypes.DebugOutput } = {
  results: {
    resourceType: 'Bundle'
  },
  debugOutput: {}
};

const careGapsSpy = jest.spyOn(Calculator, 'calculateGapsInCare');
when(careGapsSpy)
  .calledWith(mockMeasureBundle, mockPatientBundles, {})
  .mockReturnValue(Promise.resolve(mockCareGapsResult));

test('gaps in care calculate', async () => {
  const response = await request(app)
    .post('/Measure/$care-gaps')
    .send({ measure: mockMeasureBundle, patients: mockPatientBundles })
    .expect(200);

  expect(response.body).toEqual(mockCareGapsResult.results);
});

const mockMeasureReportResult: { results: R4.IMeasureReport[]; debugOutput?: CalculatorTypes.DebugOutput } = {
  results: [
    {
      resourceType: 'MeasureReport',
      period: {},
      measure: ''
    }
  ],
  debugOutput: {}
};

const measureReportSpy = jest.spyOn(Calculator, 'calculateMeasureReports');
when(measureReportSpy)
  .calledWith(mockMeasureBundle, mockPatientBundles, {})
  .mockReturnValue(Promise.resolve(mockMeasureReportResult));

test('measure reports calculate', async () => {
  const response = await request(app)
    .post('/calculateMeasureReports')
    .send({ measure: mockMeasureBundle, patients: mockPatientBundles })
    .expect(200);

  expect(response.body).toEqual(mockMeasureReportResult.results);
});

const mockResult: { results: CalculatorTypes.ExecutionResult[]; debugOutput?: CalculatorTypes.DebugOutput } = {
  results: [
    {
      patientId: ''
    }
  ],
  debugOutput: {}
};

const calculateSpy = jest.spyOn(Calculator, 'calculate');
when(calculateSpy).calledWith(mockMeasureBundle, mockPatientBundles, {}).mockReturnValue(Promise.resolve(mockResult));

test('simple calculate', async () => {
  const response = await request(app)
    .post('/calculate')
    .send({ measure: mockMeasureBundle, patients: mockPatientBundles })
    .expect(200);

  expect(response.body).toEqual(mockResult.results);
});
