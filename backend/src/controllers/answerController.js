import Answer from '../models/Answer.js';
import Question from '../models/Question.js';
import User from '../models/User.js';

// Create a new answer
export const createAnswer = async (req, res) => {
    try {
        const { content, questionId } = req.body;
        const userId = req.userId;

        // Check if question exists and is active
        const question = await Question.findById(questionId);
        if (!question || !question.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Get the user information to store author name
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Create new answer
        const newAnswer = new Answer({
            content,
            question: questionId,
            author: userId,
            authorUsername: user.username
        });

        // Save answer to database
        await newAnswer.save();

        // Add answer to question's answers array
        question.answers.push(newAnswer._id);
        await question.updateAnswersCount();

        // Populate author information for response
        await newAnswer.populate('author', 'fullName username profilePicture joinedDate');

        // Return success response
        res.status(201).json({
            success: true,
            message: 'Answer created successfully',
            data: {
                answer: newAnswer
            }
        });

    } catch (error) {
        console.error('Create answer error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while creating answer'
        });
    }
};

// Get answers for a specific question
export const getAnswersByQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const {
            page = 1,
            limit = 10,
            sort = 'votes' // votes, recent, accepted
        } = req.query;

        // Build sort object
        let sortObj = {};
        switch (sort) {
            case 'recent':
                sortObj = { createdAt: -1 };
                break;
            case 'accepted':
                sortObj = { isAccepted: -1, votes: -1 };
                break;
            case 'votes':
            default:
                sortObj = { votes: -1, createdAt: -1 };
                break;
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const answers = await Answer.find({
            question: questionId,
            isActive: true
        })
            .sort(sortObj)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('author', 'fullName username profilePicture joinedDate')
            .select('-votedBy');

        // Get total count for pagination
        const totalAnswers = await Answer.countDocuments({
            question: questionId,
            isActive: true
        });
        const totalPages = Math.ceil(totalAnswers / parseInt(limit));

        res.status(200).json({
            success: true,
            data: {
                answers,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalAnswers,
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1
                }
            }
        });

    } catch (error) {
        console.error('Get answers error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching answers'
        });
    }
};

// Vote on an answer
export const voteAnswer = async (req, res) => {
    try {
        const { id } = req.params;
        const { voteType } = req.body; // 'up', 'down', or null to remove vote
        const userId = req.userId;

        // Find the answer
        const answer = await Answer.findById(id);
        if (!answer || !answer.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Answer not found'
            });
        }

        // Check if user is trying to vote on their own answer
        if (answer.author.toString() === userId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot vote on your own answer'
            });
        }

        // Apply vote
        await answer.vote(userId, voteType);

        res.status(200).json({
            success: true,
            message: 'Vote applied successfully',
            data: {
                votes: answer.votes,
                userVote: voteType
            }
        });

    } catch (error) {
        console.error('Vote answer error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while voting on answer'
        });
    }
};

// Mark answer as accepted (only question author can do this)
export const acceptAnswer = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // Find the answer and populate question
        const answer = await Answer.findById(id).populate('question');
        if (!answer || !answer.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Answer not found'
            });
        }

        // Check if user is the question author
        if (answer.question.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Only the question author can accept answers'
            });
        }

        // Mark as accepted
        await answer.markAsAccepted();

        res.status(200).json({
            success: true,
            message: 'Answer marked as accepted',
            data: {
                answer
            }
        });

    } catch (error) {
        console.error('Accept answer error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while accepting answer'
        });
    }
};

// Update an answer (only by author)
export const updateAnswer = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const { content } = req.body;

        // Find the answer
        const answer = await Answer.findById(id);
        if (!answer || !answer.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Answer not found'
            });
        }

        // Check if user is the author
        if (answer.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You can only edit your own answers'
            });
        }

        // Update answer
        answer.content = content;
        await answer.save();

        // Populate author information for response
        await answer.populate('author', 'fullName username profilePicture joinedDate');

        res.status(200).json({
            success: true,
            message: 'Answer updated successfully',
            data: {
                answer
            }
        });

    } catch (error) {
        console.error('Update answer error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while updating answer'
        });
    }
};

// Delete an answer (only by author)
export const deleteAnswer = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // Find the answer
        const answer = await Answer.findById(id);
        if (!answer || !answer.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Answer not found'
            });
        }

        // Check if user is the author
        if (answer.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own answers'
            });
        }

        // Soft delete (mark as inactive)
        answer.isActive = false;
        await answer.save();

        // Remove from question's answers array and update count
        const question = await Question.findById(answer.question);
        if (question) {
            question.answers = question.answers.filter(
                answerId => !answerId.equals(answer._id)
            );
            await question.updateAnswersCount();
        }

        res.status(200).json({
            success: true,
            message: 'Answer deleted successfully'
        });

    } catch (error) {
        console.error('Delete answer error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while deleting answer'
        });
    }
};
