import { z } from "zod"

export const signupInput = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string().min(8),
    city: z.string(),
    bio: z.string()
})

export const signinInput = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

export const updateUserInput = z.object({
    name: z.string().optional(),
    city: z.string().optional(),
    bio: z.string().optional(),
    currentPassword: z.string().min(8).optional(),
    newPassword: z.string().min(8).optional(),
    confirmPassword: z.string().min(8).optional()
})

export const createblogInput = z.object({
    title: z.string(),
    content: z.string()
})

export const updateblogInput = z.object({
    title: z.string().optional(),
    content: z.string().optional()
})

export type SignupInput = z.infer<typeof signupInput>
export type SigninInput = z.infer<typeof signinInput>
export type UpdateUserInput = z.infer<typeof updateUserInput>
export type CreateblogInput = z.infer<typeof createblogInput>
export type UpdateblogInput = z.infer<typeof updateblogInput>
