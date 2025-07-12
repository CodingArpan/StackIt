import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/db/connection.js';
import routes from './src/routes/index.js';
import { errorHandler } from './src/middlewares/errorHandler.js';

// Load environment variables
dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const logger = (req, res, next) => {
    console.log(`Logged -- ${req.url} -- ${req.method} -- ${new Date()}`);
    next();
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(logger);

// API Routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to StackIt Backend API!',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            signup: 'POST /api/auth/signup',
            login: 'POST /api/auth/login',
            profile: 'GET /api/auth/me',
            updateProfile: 'PUT /api/auth/profile'
        }
    });
});

// Error handling middleware (should be last)
app.use(errorHandler);

app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`📚 API Documentation available at http://localhost:${port}`);
});