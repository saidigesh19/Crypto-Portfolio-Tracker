import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import authRouter from '../router/auth.js';

const app = express();
app.use(express.json());
app.use('/api', authRouter);

let mongoServer;

// Start in-memory MongoDB
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 30000);

// Cleanup after tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
}, 30000);

describe('Auth API', () => {

  const testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'testpassword'
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/signup')
      .send(testUser)
      .expect(201);

    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('should not register with existing email', async () => {
    await request(app)
      .post('/api/signup')
      .send(testUser)
      .expect(400);
  });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: testUser.email,
        password: testUser.password
      })
      .expect(200);

    expect(res.body).toHaveProperty('token');
  });

  it('should not login with wrong password', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      })
      .expect(400);
  });

});
