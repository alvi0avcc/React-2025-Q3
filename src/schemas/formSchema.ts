import { z } from 'zod';

export const formSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .regex(/^[A-Z]/, 'Name must start with capital letter'),
    age: z
      .number()
      .min(0, 'Age cannot be negative')
      .int('Age must be a whole number'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    gender: z.enum(['male', 'female', 'other']),
    acceptTerms: z.boolean().refine(val => val === true, {
      message: 'You must accept terms and conditions',
    }),
    country: z.string().min(1, 'Country is required'),
    picture: z
      .instanceof(File)
      .refine(
        file => ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type),
        'Only PNG and JPEG files are allowed'
      )
      .refine(
        file => file.size <= 5 * 1024 * 1024,
        'File size must be less than 5MB'
      )
      .optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const fileSchema = z
  .instanceof(File)
  .refine(
    file => ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type),
    'Only PNG and JPEG files are allowed'
  )
  .refine(
    file => file.size <= 5 * 1024 * 1024,
    'File size must be less than 5MB'
  );

export type FormSchemaType = z.infer<typeof formSchema>;

export const validateFormData = (data: unknown) => {
  return formSchema.safeParse(data);
};

export const validateFile = (file: File) => {
  return fileSchema.safeParse(file);
};
