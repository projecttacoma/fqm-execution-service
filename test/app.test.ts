import request from 'supertest';
import app from '../src/app';
import mockMeasure from './fixtures/mockMeasure.json';
import mockPatient from './fixtures/mockPatient.json';

// TODO: This is just an example test for demonstration
test('patient and measure calculate', async () => {
  const response = await request(app)
    .post('/calculate')
    .send({ measure: mockMeasure, patient: mockPatient })
    .expect(200);

  expect(response.body.measure).toEqual(mockMeasure);
  expect(response.body.patient).toEqual(mockPatient);
});
