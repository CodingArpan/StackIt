import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Answer content is required'],
        minlength: [10, 'Answer must be at least 10 characters long'],
        maxlength: [10000, 'Answer cannot exceed 10000 characters']
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: [true, 'Question reference is required']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Answer author is required']
    },
    authorUsername: {
        type: String,
        required: [true, 'Author username is required']
    },
    votes: {
        type: Number,
        default: 0
    },
    votedBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        voteType: {
            type: String,
            enum: ['up', 'down']
        }
    }],
    isAccepted: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
answerSchema.index({ question: 1 }); // Question-based queries
answerSchema.index({ author: 1 }); // Author-based queries
answerSchema.index({ createdAt: -1 }); // Recent answers
answerSchema.index({ votes: -1 }); // Popular answers

// Method to increment/decrement votes
answerSchema.methods.vote = function (userId, voteType) {
    // Remove existing vote from this user
    this.votedBy = this.votedBy.filter(vote => !vote.user.equals(userId));

    // Add new vote if voteType is provided
    if (voteType) {
        this.votedBy.push({ user: userId, voteType });
    }

    // Recalculate votes
    this.votes = this.votedBy.reduce((total, vote) => {
        return total + (vote.voteType === 'up' ? 1 : -1);
    }, 0);

    return this.save();
};

// Method to mark as accepted answer
answerSchema.methods.markAsAccepted = async function () {
    const Question = mongoose.model('Question');

    // Unmark all other answers for this question
    await Answer.updateMany(
        { question: this.question, _id: { $ne: this._id } },
        { isAccepted: false }
    );

    // Mark this answer as accepted
    this.isAccepted = true;
    await this.save();

    // Update the question's acceptedAnswer and isResolved status
    await Question.findByIdAndUpdate(this.question, {
        acceptedAnswer: this._id,
        isResolved: true
    });

    return this;
};

const Answer = mongoose.model('Answer', answerSchema);

export default Answer;
