import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Question title is required'],
        trim: true,
        minlength: [5, 'Title must be at least 5 characters long'],
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Question description is required'],
        minlength: [10, 'Description must be at least 10 characters long'],
        maxlength: [10000, 'Description cannot exceed 10000 characters']
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true,
        maxlength: [30, 'Tag cannot exceed 30 characters']
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Question author is required']
    },
    authorUsername: {
        type: String,
        required: [true, 'Author username is required']
    },
    votes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer'
    }],
    answersCount: {
        type: Number,
        default: 0
    },
    isResolved: {
        type: Boolean,
        default: false
    },
    acceptedAnswer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer',
        default: null
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
questionSchema.index({ title: 'text', description: 'text' }); // Text search
questionSchema.index({ tags: 1 }); // Tag-based queries
questionSchema.index({ author: 1 }); // Author-based queries
questionSchema.index({ createdAt: -1 }); // Recent questions
questionSchema.index({ votes: -1 }); // Popular questions
questionSchema.index({ views: -1 }); // Most viewed questions

// Virtual for URL-friendly slug
questionSchema.virtual('slug').get(function () {
    return this.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .trim();
});

// Method to increment view count
questionSchema.methods.incrementViews = function () {
    this.views += 1;
    return this.save();
};

// Method to update answers count
questionSchema.methods.updateAnswersCount = async function () {
    this.answersCount = this.answers.length;
    return this.save();
};

// Static method to get popular questions
questionSchema.statics.getPopular = function (limit = 10) {
    return this.find({ isActive: true })
        .sort({ votes: -1, views: -1 })
        .limit(limit)
        .populate('author', 'fullName profilePicture')
        .select('-votedBy');
};

// Static method to get recent questions
questionSchema.statics.getRecent = function (limit = 10) {
    return this.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('author', 'fullName profilePicture')
        .select('-votedBy');
};

const Question = mongoose.model('Question', questionSchema);

export default Question;
