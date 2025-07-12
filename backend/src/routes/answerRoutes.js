import express from 'express';
import {
    createAnswer,
    getAnswersByQuestion,
    voteAnswer,
    acceptAnswer,
    updateAnswer,
    deleteAnswer
} from '../controllers/answerController.js';
import { validateRequest } from '../middlewares/errorHandler.js';
import { authenticate } from '../middlewares/auth.js';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const createAnswerSchema = z.object({
    content: z.string()
        .min(10, 'Answer must be at least 10 characters long')
        .max(10000, 'Answer cannot exceed 10000 characters'),
    questionId: z.string()
        .min(1, 'Question ID is required')
});

const updateAnswerSchema = z.object({
    content: z.string()
        .min(10, 'Answer must be at least 10 characters long')
        .max(10000, 'Answer cannot exceed 10000 characters')
});

const voteAnswerSchema = z.object({
    voteType: z.enum(['up', 'down']).nullable()
});

// Public routes
router.get('/question/:questionId', getAnswersByQuestion); // GET /api/answers/question/:questionId - Get answers for a question

// Protected routes (require authentication)
router.post('/', authenticate, validateRequest(createAnswerSchema), createAnswer); // POST /api/answers - Create new answer
router.put('/:id', authenticate, validateRequest(updateAnswerSchema), updateAnswer); // PUT /api/answers/:id - Update answer
router.delete('/:id', authenticate, deleteAnswer); // DELETE /api/answers/:id - Delete answer
router.post('/:id/vote', authenticate, validateRequest(voteAnswerSchema), voteAnswer); // POST /api/answers/:id/vote - Vote on answer
router.post('/:id/accept', authenticate, acceptAnswer); // POST /api/answers/:id/accept - Accept answer

export default router;
