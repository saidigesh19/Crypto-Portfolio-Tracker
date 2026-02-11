import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose'; 
import authRouter from '../router/auth.js';

// Create an Express app instance for testing
const app = express();
app.use(express.json()); // Parse JSON request bodies
app.use('/api', authRouter); // Mount the auth router

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

// Group related tests for the Auth API
describe('Auth API', () => {
  // Test user data for registration and login
  const testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'testpassword'
  };

  // Test: Register a new user
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/signup')
      .send(testUser)
      .expect(201); // Expect HTTP 201 Created
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe(testUser.email);
  });

  // Test: Should not register with an existing email
  it('should not register with existing email', async () => {
    await request(app)
      .post('/api/signup')
      .send(testUser)
      .expect(400); // Expect HTTP 400 Bad Request
  });

  // Test: Login with correct credentials
  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200); // Expect HTTP 200 OK
    expect(res.body).toHaveProperty('token');
  });

  // Test: Should not login with wrong password
  it('should not login with wrong password', async () => {
    await request(app)
      .post('/api/login')
      .send({ email: testUser.email, password: 'wrongpassword' })
      .expect(400); // Expect HTTP 400 Bad Request
  });
});