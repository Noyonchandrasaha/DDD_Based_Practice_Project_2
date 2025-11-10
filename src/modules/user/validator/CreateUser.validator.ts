// ============================================================
// FILE: src/modules/user/validator/CreateUser.validator.ts
// ============================================================

import { z } from 'zod';
import { REGEX_PATTERNS } from '@common/constants/regex.constants';

export const CreateUserSchema = z.object({
    firstName: z.string().trim().min(1, 'First name cannot be empty').optional(),
    middleName: z.string().trim().min(1,"Middle name cannot be empty.").optional(),
    lastName: z.string().trim().min(1, 'Last name is required.'),
    email: z.email('Invalid email format'),
    phoneNumber: z.string().regex(REGEX_PATTERNS.PHONE, 'Invalid phone number format.'),
    street: z.string().trim().min(1, 'Street is required.'),
    city: z.string().trim().min(1, 'City is required.'),
    state: z.string().trim().optional(),
    postalCode: z.string().trim().optional(),
    country: z.string().trim().min(1, 'Country is required.')
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;