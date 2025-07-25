import User from '../models/User.js';
import { generateTokens } from '../middlewares/auth.js';
import bcrypt from 'bcryptjs';

// User signup controller
export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;

        // Check if user already exists with email
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Check if username already exists
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({
                success: false,
                message: 'Username is already taken'
            });
        }

        // Hash the password before storing
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user with hashed password
        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword
        });

        // Save user to database
        await newUser.save();

        // Generate tokens
        const { accessToken } = generateTokens(newUser._id);

        // Return success response
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: newUser._id,
                    fullName: newUser.fullName,
                    username: newUser.username,
                    email: newUser.email,
                    joinedDate: newUser.joinedDate
                },
                accessToken
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during registration'
        });
    }
};

// User login controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user and include password for comparison
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Compare the provided password with the hashed password in database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login date
        user.lastLoginDate = new Date();
        await user.save();

        // Generate tokens
        const { accessToken } = generateTokens(user._id);

        // Return success response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email,
                    lastLoginDate: user.lastLoginDate
                },
                accessToken
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login'
        });
    }
};

// Get current user profile
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email,
                    isEmailVerified: user.isEmailVerified,
                    profilePicture: user.profilePicture,
                    bio: user.bio,
                    reputation: user.reputation,
                    joinedDate: user.joinedDate,
                    lastLoginDate: user.lastLoginDate
                }
            }
        });

    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const updates = req.body;

        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email,
                    isEmailVerified: user.isEmailVerified,
                    profilePicture: user.profilePicture,
                    bio: user.bio,
                    reputation: user.reputation,
                    joinedDate: user.joinedDate,
                    lastLoginDate: user.lastLoginDate
                }
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Check username availability
export const checkUsernameAvailability = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        // Validate username format
        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({
                success: false,
                message: 'Username must be between 3 and 20 characters'
            });
        }

        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            return res.status(400).json({
                success: false,
                message: 'Username can only contain letters, numbers, and underscores'
            });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username: username.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username is already taken'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Username is available'
        });

    } catch (error) {
        console.error('Check username availability error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
