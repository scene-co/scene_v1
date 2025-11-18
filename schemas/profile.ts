import { z } from 'zod';
import { INDIAN_STATES, GENDER_OPTIONS } from '../constants/indianStates';

export const profileSetupSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    ),
  age: z
    .number({ invalid_type_error: 'Age must be a number' })
    .min(13, 'You must be at least 13 years old')
    .max(100, 'Please enter a valid age'),
  gender: z.enum(GENDER_OPTIONS, {
    errorMap: () => ({ message: 'Please select a gender' }),
  }),
  college_name: z.string().optional(),
  state: z.enum(INDIAN_STATES, {
    errorMap: () => ({ message: 'Please select a state' }),
  }),
  city: z
    .string()
    .min(1, 'City is required')
    .min(2, 'City name must be at least 2 characters'),
});

export type ProfileSetupFormData = z.infer<typeof profileSetupSchema>;
