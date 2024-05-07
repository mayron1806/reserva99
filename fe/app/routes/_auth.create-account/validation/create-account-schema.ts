import z from 'zod';
export const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]/;
export const expires_in_reset_password = 1000 * 60 * 30; // 30 minutes
export const password_length = {
  min: 5,
  max: 50,
};
export const nameLength = {
  min: 3,
  max: 20,
};

export const name_regex = /^[a-zA-Z0-9]+$/;

const createUserSchema = z.object({
  nick: z.string()
    .min(nameLength.min, { message: `O campo name deve ter pelo menos ${nameLength.min} caracteres` })
    .max(nameLength.max, { message: `O campo name deve ter no máximo ${nameLength.max} caracteres` }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string()
    .min(password_length.min, { message: `O campo senha deve ter pelo menos ${password_length.min} caracteres` })
    .max(password_length.max, { message: `O campo senha deve ter no máximo ${password_length.max} caracteres` })
    .regex(password_regex, { message: 'O campo senha deve conter ao menos 1 número, 1 letra minúscula, 1 letra maiúscula e 1 caractere especial' }),
  confirmPassword: z.string()
    .min(password_length.min, { message: `O campo confirmar senha deve ter pelo menos ${password_length.min} caracteres` })
    .max(password_length.max, { message: `O campo confirmar senha deve ter no máximo ${password_length.max} caracteres` })
    .regex(password_regex, { message: 'O campo confirmar senha deve conter ao menos 1 número, 1 letra minúscula, 1 letra maiúscula e 1 caractere especial' }),
}).superRefine((arg, ctx) => {
  if (arg.password !== arg.confirmPassword) {
    ctx.addIssue({
      path: ['root'],
      code: z.ZodIssueCode.custom,
      message: `As senhas não coincidem.`,
    });
  }
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export { createUserSchema };
