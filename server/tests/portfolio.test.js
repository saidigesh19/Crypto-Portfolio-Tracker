import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import portfolioRouter from '../router/portfolioRouter.js';
import Holding from '../model/Holding.js';

const app = express();
app.use(express.json());
app.use('/api/portfolio', portfolioRouter);

let mongoServer;
const userId = 'testuser2';

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 30000);

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
}, 30000);

describe('Portfolio API', () => {

  beforeEach(async () => {
    // Clear collections before each test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }

    // Create a test holding
    await Holding.create({
      userId,
      coinId: 'bitcoin',
      symbol: 'BTC',
      amount: 1,
      buyPrice: 10000
    });
  });

  it('should return portfolio summary for a user', async () => {
    const res = await request(app)
      .get(`/api/portfolio/${userId}`)
      .expect(200);

    expect(res.body).toHaveProperty('totalCost');
    expect(res.body).toHaveProperty('currentValue');
    expect(res.body).toHaveProperty('holdings');
    expect(Array.isArray(res.body.holdings)).toBe(true);
  });

});
