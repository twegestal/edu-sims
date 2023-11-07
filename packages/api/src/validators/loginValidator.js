import { z, ZodError } from 'zod';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const validateLogin = (data) => {
  try {
    loginSchema.parse(data);
    return {
      success: true,
      errors: null,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.errors.map((e) => ({
        path: e.path[0],
        message: e.message,
      }));
      return {
        success: false,
        errors: errors,
      };
    } else {
      console.log(error);
      throw error;
    }
  }
};
