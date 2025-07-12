import { z } from 'zod';

// User signup validation schema
export const signupSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Full name must be at least 2 characters long')
        .max(50, 'Full name cannot exceed 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces')
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

    bio: z
        .string()
        .max(500, 'Bio cannot exceed 500 characters')
        .optional(),

    profilePicture: z
        .string()
        .url('Profile picture must be a valid URL')
        .optional()
});
