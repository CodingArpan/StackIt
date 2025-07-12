import express from 'express';
import authRoutes from './authRoutes.js';
import questionRoutes from './questionRoutes.js';

const router = express.Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/questions', questionRoutes);

// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'StackIt API is running successfully!',
        timestamp: new Date().toISOString()
    });
});

export default router;
