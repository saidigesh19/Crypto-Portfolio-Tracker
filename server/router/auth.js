
import express from 'express';
import { signup, login } from '../Controller/authController.js';


const router = express.Router();

// POST /api/signup - Register a new user
router.post('/signup', signup);
// POST /api/login - Login an existing user
router.post('/login', login);

export default router;
