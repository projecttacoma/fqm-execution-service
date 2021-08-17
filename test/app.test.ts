import { Calculator, CalculatorTypes, CQLTypes } from 'fqm-execution';
import { when } from 'jest-when';
import request from 'supertest';
import app from '../src/app';
import fs from 'fs';

const mockMeasureBundle = <fhir4.Bundle>{};
const mockPatientBundles = <fhir4.Bundle[]>[];
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

  expect(response.body.results).toEqual(mockRawResult.results);
});

const mockCareGapsResult: { results: fhir4.Bundle; debugOutput?: CalculatorTypes.DebugOutput } = {
  results: {
    resourceType: 'Bundle',
    type: 'transaction'
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
  console.log(response.body);
  expect(response.body.results).toEqual(mockCareGapsResult.results);
});

const mockDataRequirementsResult: { results: fhir4.Library; debugOutput?: CalculatorTypes.DebugOutput } = {
  results: {
    resourceType: 'Library',
    type: {
      coding: [{ code: 'module-definition', system: 'http://terminology.hl7.org/CodeSystem/library-type' }]
    },
    status: 'draft'
  }
};

const DataRequirementsSpy = jest.spyOn(Calculator, 'calculateDataRequirements');
when(DataRequirementsSpy).calledWith(mockMeasureBundle).mockReturnValue(mockDataRequirementsResult);

test('data requirements calculate', async () => {
  const response = await request(app)
    .post('/Measure/$data-requirements')
    .send({ measure: mockMeasureBundle })
    .expect(200);

  expect(response.body.results).toEqual(mockDataRequirementsResult.results);
});

const mockMeasureReportResult: { results: fhir4.MeasureReport[]; debugOutput?: CalculatorTypes.DebugOutput } = {
  results: [
    {
      resourceType: 'MeasureReport',
      period: {},
      measure: '',
      status: 'complete',
      type: 'individual'
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

  expect(response.body.results).toEqual(mockMeasureReportResult.results);
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

  expect(response.body.results).toEqual(mockResult.results);
});
function parseBundle(filePath: string): R4.IBundle {
  const contents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(contents) as R4.IBundle;
}
