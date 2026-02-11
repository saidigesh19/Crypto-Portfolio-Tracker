import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose'; 
import portfolioRouter from '../router/portfolioRouter.js';
import Holding from '../model/Holding.js';

const app = express();
app.use(express.json());
app.use('/api/portfolio', portfolioRouter);

// MongoDB connection string for a test database (do not use production DB)
const MONGO_URL = 'mongodb://localhost:27017/crypto_portfolio_test';

// Connect to the test database before running any tests
beforeAll(async () => {
  await mongoose.connect(MONGO_URL);
}, 30000);

// Clean up: Drop the test database and disconnect after all tests
afterAll(async () => {
  if (mongoose.connection && mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.disconnect();
}, 30000);


describe('Portfolio API', () => {
  // Use a unique userId for this test suite
  const userId = 'testuser2';

  // Before running the tests, create a holding for the test user
  beforeAll(async () => {
    await Holding.create({
      userId,
      coinId: 'bitcoin',
      symbol: 'BTC',
      amount: 1, 
      buyPrice: 10000 
    });
  });

  // Test: GET /api/portfolio/:userId should return a portfolio summary
  it('should return portfolio summary for a user', async () => {
    // Make a GET request to the portfolio endpoint
    const res = await request(app)
      .get(`/api/portfolio/${userId}`)
      .expect(200);
    // The response should have portfolio summary fields
    expect(res.body).toHaveProperty('totalCost');
    expect(res.body).toHaveProperty('currentValue');
    expect(res.body).toHaveProperty('holdings');
    // Holdings should be an array
    expect(Array.isArray(res.body.holdings)).toBe(true);
  });
});
