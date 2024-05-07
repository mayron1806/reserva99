import { z } from 'zod';

const variantSchema = z.object({
  name: z.string().max(50, { message: 'O nome deve ter no máximo 50 caracteres' }),
  description: z.string().max(2000, { message: 'A descrição deve ter no máximo 2000 caracteres' }).optional(),
  price: z.string(),
  duration: z.string(),
});

const createServiceSchema = z.object({
  identifier: z.string().max(50, { message: 'O identificador deve ter no máximo 50 caracteres' })
    .regex(/^[a-zA-Z0-9-]*$/, { message: 'O identificador deve conter apenas letras, números e "-" '}).optional(),
  name: z.string().min(1, 'O campo nome é obrigatorio').max(50, { message: 'O nome deve ter no máximo 50 caracteres' }),
  description: z.string().max(2000, { message: 'A descrição deve ter no máximo 2000 caracteres' }).optional(),
  price: z.string().optional(),
  duration: z.string().optional(),
  containVariants: z.boolean().optional(),
  allowClientAnonymousReserve: z.boolean().optional(),
  allowClientReserve: z.boolean().optional(),
  variants: z.array(variantSchema).optional(),
}).superRefine((args, ctx) => {
  if (!args.containVariants && !args.price) {
    ctx.addIssue({
      path: ['price'],
      code: z.ZodIssueCode.custom,
      message: `O campo preço é obrigatório.`,
    });
  }
  if (!args.containVariants && !args.duration) {
    ctx.addIssue({
      path: ['duration'],
      code: z.ZodIssueCode.custom,
      message: `O campo duração é obrigatório.`,
    });
  }
});

export type CreateServiceSchema = z.infer<typeof createServiceSchema>;

export { createServiceSchema };
