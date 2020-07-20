import request from 'supertest';
import app from '../src/app';

// TODO: This is just an example test for demonstration
test('example GET test', async () => {
  const response = await request(app).get('/').expect(200);
  expect(response.body.example).toBe(true);
});
