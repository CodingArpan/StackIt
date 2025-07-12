import Question from '../models/Question.js';
import User from '../models/User.js';

// Create a new question
export const createQuestion = async (req, res) => {
    try {
        const { title, description, tags = [] } = req.body;
        const userId = req.userId;

        // Get the user information to store author name
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Create new question
        const newQuestion = new Question({
            title,
            description,
            tags: tags.filter(tag => tag.trim().length > 0), // Remove empty tags
            author: userId,
            authorUsername: user.username
        });

        // Save question to database
        await newQuestion.save();

        // Populate author information for response
        await newQuestion.populate('author', 'fullName username profilePicture joinedDate');

        // Return success response
        res.status(201).json({
            success: true,
            message: 'Question created successfully',
            data: {
                question: {
                    id: newQuestion._id,
                    title: newQuestion.title,
                }
            }
        });

    } catch (error) {
        console.error('Create question error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while creating question'
        });
    }
};

// Get all questions with filtering and pagination
export const getQuestions = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sort = 'recent', // recent, popular, views, votes
            tags,
            search,
            author
        } = req.query;

        // Build query object
        const query = { isActive: true };

        // Add filters
        if (tags) {
            const tagArray = Array.isArray(tags) ? tags : tags.split(',');
            query.tags = { $in: tagArray.map(tag => tag.trim().toLowerCase()) };
        }

        if (author) {
            query.author = author;
        }

        if (search) {
            query.$text = { $search: search };
        }

        // Build sort object
        let sortObj = {};
        switch (sort) {
            case 'popular':
                sortObj = { votes: -1, views: -1 };
                break;
            case 'views':
                sortObj = { views: -1 };
                break;
            case 'votes':
                sortObj = { votes: -1 };
                break;
            case 'recent':
            default:
                sortObj = { createdAt: -1 };
                break;
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const questions = await Question.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('author', 'fullName username profilePicture joinedDate')
            .select('-votedBy');

        // Get total count for pagination
        const totalQuestions = await Question.countDocuments(query);
        const totalPages = Math.ceil(totalQuestions / parseInt(limit));

        res.status(200).json({
            success: true,
            data: {
                questions,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalQuestions,
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1
                }
            }
        });

    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching questions'
        });
    }
};

// Get a single question by ID
export const getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await Question.findById(id)
            .populate('author', 'fullName username profilePicture joinedDate reputation')
            .populate({
                path: 'answers',
                populate: {
                    path: 'author',
                    select: 'fullName username profilePicture joinedDate reputation'
                }
            });

        if (!question || !question.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Increment view count
        await question.incrementViews();

        res.status(200).json({
            success: true,
            data: {
                question
            }
        });

    } catch (error) {
        console.error('Get question by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching question'
        });
    }
};

// Update a question (only by author)
export const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const updates = req.body;

        // Find the question
        const question = await Question.findById(id);

        if (!question || !question.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Check if user is the author
        if (question.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You can only edit your own questions'
            });
        }

        // Update the question
        const updatedQuestion = await Question.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).populate('author', 'fullName username profilePicture joinedDate');

        res.status(200).json({
            success: true,
            message: 'Question updated successfully',
            data: {
                question: updatedQuestion
            }
        });

    } catch (error) {
        console.error('Update question error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while updating question'
        });
    }
};

// Delete a question (only by author)
export const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // Find the question
        const question = await Question.findById(id);

        if (!question || !question.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Check if user is the author
        if (question.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own questions'
            });
        }

        // Soft delete by setting isActive to false
        question.isActive = false;
        await question.save();

        res.status(200).json({
            success: true,
            message: 'Question deleted successfully'
        });

    } catch (error) {
        console.error('Delete question error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while deleting question'
        });
    }
};

// Vote on a question
export const voteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { voteType } = req.body; // 'up' or 'down'
        const userId = req.userId;

        // Find the question
        const question = await Question.findById(id);

        if (!question || !question.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Check if user already voted
        const existingVoteIndex = question.votedBy.findIndex(
            vote => vote.user.toString() === userId
        );

        if (existingVoteIndex !== -1) {
            const existingVote = question.votedBy[existingVoteIndex];

            // If same vote type, remove the vote
            if (existingVote.voteType === voteType) {
                question.votedBy.splice(existingVoteIndex, 1);
                question.votes += existingVote.voteType === 'up' ? -1 : 1;
            } else {
                // Change vote type
                question.votedBy[existingVoteIndex].voteType = voteType;
                question.votes += voteType === 'up' ? 2 : -2; // Change from opposite vote
            }
        } else {
            // Add new vote
            question.votedBy.push({
                user: userId,
                voteType
            });
            question.votes += voteType === 'up' ? 1 : -1;
        }

        await question.save();

        res.status(200).json({
            success: true,
            message: 'Vote recorded successfully',
            data: {
                votes: question.votes,
                userVote: voteType
            }
        });

    } catch (error) {
        console.error('Vote question error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while voting'
        });
    }
};

// Get questions by user (author)
export const getUserQuestions = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const questions = await Question.find({
            author: userId,
            isActive: true
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('author', 'fullName username profilePicture joinedDate')
            .select('-votedBy');

        const totalQuestions = await Question.countDocuments({
            author: userId,
            isActive: true
        });
        const totalPages = Math.ceil(totalQuestions / parseInt(limit));

        res.status(200).json({
            success: true,
            data: {
                questions,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalQuestions,
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1
                }
            }
        });

    } catch (error) {
        console.error('Get user questions error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching user questions'
        });
    }
};
