import express from 'express';
import authRoutes from './authRoutes.js';

const router = express.Router();

// API Routes
router.use('/auth', authRoutes);

// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'StackIt API is running successfully!',
        timestamp: new Date().toISOString()
    });
});

// 404 handler for undefined routes
router.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

export default router;
