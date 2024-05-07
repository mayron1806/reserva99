import z from 'zod';
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export { forgotPasswordSchema };
