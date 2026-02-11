import request from 'supertest'; 
import express from 'express';
import mongoose from 'mongoose';
import { holdingsRouter } from '../router/holdingsRouter.js';
import Holding from '../model/Holding.js';

const app = express();
app.use(express.json());
app.use('/api/holdings', holdingsRouter);

// MongoDB connection string for a test database (do not use production DB)
const MONGO_URL = 'mongodb://localhost:27017/crypto_portfolio_test';

// Connect to the test database before running any tests
beforeAll(async () => {
  await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Clean up: Drop the test database and disconnect after all tests
afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

// Group related tests for the Holdings API
describe('Holdings API', () => {
  let holdingId; // Will store the ID of the created holding
  // Test holding data
  const testHolding = {
    userId: 'testuser',
    coinId: 'bitcoin',
    symbol: 'BTC',
    amount: 1.5,
    buyPrice: 20000
  };

  // Test: Create a new holding
  it('should create a new holding', async () => {
    const res = await request(app)
      .post('/api/holdings')
      .send(testHolding)
      .expect(201); 
    expect(res.body).toHaveProperty('_id');
    expect(res.body.userId).toBe(testHolding.userId);
    holdingId = res.body._id;
  });

  // Test: Get holdings for a user
  it('should get holdings for a user', async () => {
    const res = await request(app)
      .get(`/api/holdings/${testHolding.userId}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].userId).toBe(testHolding.userId);
  });

  // Test: Update a holding by id
  it('should update a holding by id', async () => {
    const res = await request(app)
      .put(`/api/holdings/${holdingId}`)
      .send({ amount: 2 })
      .expect(200);
    expect(res.body.amount).toBe(2);
  });

  // Test: Delete a holding by id
  it('should delete a holding by id', async () => {
    await request(app)
      .delete(`/api/holdings/${holdingId}`)
      .expect(200);
    // After deletion, the user's holdings should be empty
    const res = await request(app)
      .get(`/api/holdings/${testHolding.userId}`)
      .expect(200);
    expect(res.body.length).toBe(0);
  });
});
