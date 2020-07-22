import request from 'supertest';
import app from '../src/app';
import mockMeasure from './fixtures/mockMeasure.json';
import mockPatient from './fixtures/mockPatient.json';

// TODO: This is just an example test for demonstration
test('patient and measure upload', async () => {
  const response = await request(app).post('/upload').send({ measure: mockMeasure, patient: mockPatient }).expect(200);

  expect(response.body.measure).toEqual(mockMeasure);
  expect(response.body.patient).toEqual(mockPatient);
});
