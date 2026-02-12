import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import  holdingsRouter  from '../router/holdingsRouter.js';

const app = express();
app.use(express.json());
app.use('/api/holdings', holdingsRouter);

let mongoServer;
let holdingId;

const testHolding = {
  userId: 'testuser',
  coinId: 'bitcoin',
  symbol: 'BTC',
  amount: 1.5,
  buyPrice: 20000
};

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Holdings API', () => {

  it('should create a new holding', async () => {
    const res = await request(app)
      .post('/api/holdings')
      .send(testHolding)
      .expect(201);

    expect(res.body).toHaveProperty('_id');
    expect(res.body.userId).toBe(testHolding.userId);

    holdingId = res.body._id;
  });

  it('should get holdings for a user', async () => {
    const res = await request(app)
      .get(`/api/holdings/${testHolding.userId}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].userId).toBe(testHolding.userId);
  });

  it('should update a holding by id', async () => {
    const res = await request(app)
      .put(`/api/holdings/${holdingId}`)
      .send({ amount: 2 })
      .expect(200);

    expect(res.body.amount).toBe(2);
  });

  it('should delete a holding by id', async () => {
    await request(app)
      .delete(`/api/holdings/${holdingId}`)
      .expect(200);

    const res = await request(app)
      .get(`/api/holdings/${testHolding.userId}`)
      .expect(200);

    expect(res.body.length).toBe(0);
  });

});
