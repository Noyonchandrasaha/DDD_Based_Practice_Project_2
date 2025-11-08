// ============================================================
// FILE: src/modules/user/validator/CreateUser.validator.ts
// ============================================================
import { z } from 'zod';
import { REGEX_PATTERNS } from '../../../common/constants/regex.constants';

export const CreateUserSchema = z.object({
  // ✅ Make firstName optional but not null
  firstName: z.string().trim().min(1, 'First name cannot be empty').optional(),
  
  // ✅ Make middleName optional but not null  
  middleName: z.string().trim().min(1, 'Middle name cannot be empty').optional(),
  
  // ✅ lastName is REQUIRED
  lastName: z.string()
    .trim()
    .min(1, 'Last name is required'),
  
  // ✅ email is REQUIRED
  email: z
    .string()
    .email('Invalid email format'),

  // ✅ phoneNumber is REQUIRED
  phoneNumber: z.string()
    .trim()
    .regex(
      REGEX_PATTERNS.PHONE,
      'Invalid phone number format'
    ),

  // ✅ Address fields REQUIRED
  street: z.string().trim().min(1, 'Street is required'),
  city: z.string().trim().min(1, 'City is required'),
  
  // ✅ Optional address fields
  state: z.string().trim().optional(),
  postalCode: z.string().trim().optional(),
  
  // ✅ Country REQUIRED
  country: z.string().trim().min(1, 'Country is required')
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;