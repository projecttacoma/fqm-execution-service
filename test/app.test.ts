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
    evaluatedRecords: []
  },
  debugOutput: {}
};

const calculateRawSpy = jest.spyOn(Calculator, 'calculateRaw');
when(calculateRawSpy).calledWith(mockMeasureBundle, mockPatientBundles, {}).mockReturnValue(mockRawResult);

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
when(careGapsSpy).calledWith(mockMeasureBundle, mockPatientBundles, {}).mockReturnValue(mockCareGapsResult);

test('gaps in care calculate', async () => {
  const response = await request(app)
    .post('/Measure/$care-gaps')
    .send({ measure: mockMeasureBundle, patients: mockPatientBundles })
    .expect(200);

  expect(response.body).toEqual(mockCareGapsResult.results);
});
