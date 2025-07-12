import express from 'express';
import { signup, login, getCurrentUser, updateProfile, checkUsernameAvailability } from '../controllers/authController.js';
import { validateRequest } from '../middlewares/errorHandler.js';
import { authenticate } from '../middlewares/auth.js';
import {
    signupSchema,
    loginSchema,
    profileUpdateSchema,
    checkUsernameSchema
} from '../middlewares/validation.js';

const router = express.Router();

// Public routes
router.post('/signup', validateRequest(signupSchema), signup);
router.post('/login', validateRequest(loginSchema), login);
router.post('/check-username', validateRequest(checkUsernameSchema), checkUsernameAvailability);

// Protected routes (require authentication)
router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, validateRequest(profileUpdateSchema), updateProfile);

export default router;
