import { z } from 'zod';

// User signup validation schema
export const signupSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Full name must be at least 2 characters long')
        .max(50, 'Full name cannot exceed 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces')
        .trim(),

    username: z
        .string()
        .min(3, 'Username must be at least 3 characters long')
        .max(20, 'Username cannot exceed 20 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
        .toLowerCase()
        .trim(),

    email: z
        .string()
        .email('Please enter a valid email address')
        .toLowerCase()
        .trim(),

    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .max(100, 'Password cannot exceed 100 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),

    confirmPassword: z
        .string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// User login validation schema
export const loginSchema = z.object({
    email: z
        .string()
        .email('Please enter a valid email address')
        .toLowerCase()
        .trim(),

    password: z
        .string()
        .min(1, 'Password is required')
});

// Password reset request schema
export const passwordResetRequestSchema = z.object({
    email: z
        .string()
        .email('Please enter a valid email address')
        .toLowerCase()
        .trim()
});

// Password reset schema
export const passwordResetSchema = z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .max(100, 'Password cannot exceed 100 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),

    confirmPassword: z
        .string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Profile update schema
export const profileUpdateSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Full name must be at least 2 characters long')
        .max(50, 'Full name cannot exceed 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces')
        .trim()
        .optional(),

    username: z
        .string()
        .min(3, 'Username must be at least 3 characters long')
        .max(20, 'Username cannot exceed 20 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
        .toLowerCase()
        .trim()
        .optional(),

    bio: z
        .string()
        .max(500, 'Bio cannot exceed 500 characters')
        .optional(),

    profilePicture: z
        .string()
        .url('Profile picture must be a valid URL')
        .optional()
});

// Question creation validation schema
export const createQuestionSchema = z.object({
    title: z
        .string()
        .min(5, 'Title must be at least 5 characters long')
        .max(200, 'Title cannot exceed 200 characters')
        .trim(),

    description: z
        .string()
        .min(10, 'Description must be at least 10 characters long')
        .max(10000, 'Description cannot exceed 10000 characters')
        .trim(),

    tags: z
        .array(z.string().trim().toLowerCase().max(30, 'Tag cannot exceed 30 characters'))
        .max(5, 'Maximum 5 tags allowed')
        .optional()
        .default([])
});

// Question update validation schema
export const updateQuestionSchema = z.object({
    title: z
        .string()
        .min(5, 'Title must be at least 5 characters long')
        .max(200, 'Title cannot exceed 200 characters')
        .trim()
        .optional(),

    description: z
        .string()
        .min(10, 'Description must be at least 10 characters long')
        .max(10000, 'Description cannot exceed 10000 characters')
        .trim()
        .optional(),

    tags: z
        .array(z.string().trim().toLowerCase().max(30, 'Tag cannot exceed 30 characters'))
        .max(5, 'Maximum 5 tags allowed')
        .optional()
});

// Question vote validation schema
export const voteQuestionSchema = z.object({
    voteType: z
        .enum(['up', 'down'], {
            errorMap: () => ({ message: 'Vote type must be either "up" or "down"' })
        })
});

// Username availability check schema
export const checkUsernameSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters long')
        .max(20, 'Username cannot exceed 20 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
        .toLowerCase()
        .trim()
});
