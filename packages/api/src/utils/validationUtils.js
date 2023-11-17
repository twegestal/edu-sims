import { ZodError } from "zod";

export const handleZodErrors = (error) => {
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
    console.error(error);
    throw error;
  }
}

export const errorsToString = (errors) => {
  return errors.map(error => error.message).join('.\n');
}