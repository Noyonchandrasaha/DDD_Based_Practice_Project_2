// ============================================================
// FILE: src/modules/user/validator/UpdateUser.validator.ts
// ============================================================

import { z } from 'zod';
import { REGEX_PATTERNS } from '@common/constants/regex.constants';

const UpdateSchema = z.object({
    firstName: z.string().nullable().optional(),
    middleName: z.string().nullable().optional(),
    lastName: z.string().min(1).optional(),
    email: z.email('Invalid email format').optional(),
    phoneNumber: z.string().regex(REGEX_PATTERNS.PHONE, 'Invalid phone number format.').optional(),
    street: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    state: z.string().nullable().optional(),
    postalCode: z.string().nullable().optional(),
    country: z.string().min(1).optional(),
    isActive: z.boolean().optional()
})

export const UpdateUserSchema = UpdateSchema.refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    {message: 'At least one field must be provided to update.'}
);

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;