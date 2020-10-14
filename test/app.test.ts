import { R4 } from '@ahryman40k/ts-fhir-types';
import { Calculator, CQLTypes } from 'fqm-execution';
import { when } from 'jest-when';
import request from 'supertest';
import app from '../src/app';

const mockMeasureBundle = <R4.IBundle>{};
const mockPatientBundles = <R4.IBundle[]>[];
const mockRawResult: CQLTypes.Results = {
  patientResults: {},
  unfilteredResults: {},
  localIdPatientResultsMap: {}
};

const calculateRawSpy = jest.spyOn(Calculator, 'calculateRaw');
when(calculateRawSpy).calledWith(mockMeasureBundle, mockPatientBundles, {}).mockReturnValue(mockRawResult);

// TODO: This is just an example test for demonstration
test('patient and measure calculate', async () => {
  const response = await request(app)
    .post('/calculateRaw')
    .send({ measure: mockMeasureBundle, patients: mockPatientBundles })
    .expect(200);

  expect(response.body).toEqual(mockRawResult);
});
