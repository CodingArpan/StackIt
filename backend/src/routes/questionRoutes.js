import express from 'express';
import {
    createQuestion,
    getQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    voteQuestion,
    getUserQuestions
} from '../controllers/questionController.js';
import { validateRequest } from '../middlewares/errorHandler.js';
import { authenticate } from '../middlewares/auth.js';
import {
    createQuestionSchema,
    updateQuestionSchema,
    voteQuestionSchema
} from '../middlewares/validation.js';

const router = express.Router();

// Public routes
router.get('/', getQuestions); // GET /api/questions - Get all questions with filtering
router.get('/:id', getQuestionById); // GET /api/questions/:id - Get single question
router.get('/user/:userId', getUserQuestions); // GET /api/questions/user/:userId - Get questions by user

// Protected routes (require authentication)
router.post('/', authenticate, validateRequest(createQuestionSchema), createQuestion); // POST /api/questions - Create new question
router.put('/:id', authenticate, validateRequest(updateQuestionSchema), updateQuestion); // PUT /api/questions/:id - Update question
router.delete('/:id', authenticate, deleteQuestion); // DELETE /api/questions/:id - Delete question
router.post('/:id/vote', authenticate, validateRequest(voteQuestionSchema), voteQuestion); // POST /api/questions/:id/vote - Vote on question


export default router;
