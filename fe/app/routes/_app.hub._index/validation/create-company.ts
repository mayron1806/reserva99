import { z } from "zod";
import { refineTime, timeSchema } from "~/validation/time";

export const createCompanySchema = z.object({
  name: z.string()
    .min(3, 'O campo nome deve ter entre 3 e 40 caracteres')
    .max(40, 'O campo nome deve ter entre 3 e 40 caracteres'),
  identifier: z.string()
    .min(1, 'O campo nome deve ter entre 1 e 30 caracteres')
    .max(30, 'O campo nome deve ter entre 1 e 30 caracteres')
    .regex(/^[a-z\d](?:[a-z\d\-]{0,28}[a-z\d])?$/i, 'O campo nome deve ser um subdomínio válido'),
  description: z.string()
    .max(255, 'A descrição deve ter no maximo 255 caracteres')
    .optional(),
  hideAddress: z.boolean(),
  address: z.object({
    country: z.string()
      .min(1, 'O país é obrigatório'),
    state: z.string()
      .min(1, 'O estado é obrigatório'),
    city: z.string()
      .min(1, 'A cidade é obrigatória'),
    district: z.string()
      .min(1, 'A rua é obrigatória'),
    street: z.string()
      .min(1, 'A rua é obrigatória'),
    number: z.string()
      .min(1, 'O número é obrigatório'),
    complement: z.string()
      .optional(),
    zipCode: z.string()
      .min(1, 'O CEP é obrigatório')
      .regex(/^\d{5}-\d{3}$/, 'Formato de CEP inválido. Use o formato 12345-678')
  }).nullish().optional(),
  workTime: z.object({
    monday: z.array(timeSchema).refine(refineTime, { message: 'Os horários não podem se sobrepor.' }).optional(),
    tuesday: z.array(timeSchema).refine(refineTime, { message: 'Os horários não podem se sobrepor.' }).optional(),
    wednesday: z.array(timeSchema).refine(refineTime, { message: 'Os horários não podem se sobrepor.' }).optional(),
    thursday: z.array(timeSchema).refine(refineTime, { message: 'Os horários não podem se sobrepor.' }).optional(),
    friday: z.array(timeSchema).refine(refineTime, { message: 'Os horários não podem se sobrepor.' }).optional(),
    saturday: z.array(timeSchema).refine(refineTime, { message: 'Os horários não podem se sobrepor.' }).optional(),
    sunday: z.array(timeSchema).refine(refineTime, { message: 'Os horários não podem se sobrepor.' }).optional(),
  })
}).superRefine((args, ctx) => {
  if(
    (!args.workTime.monday || args.workTime.monday[0].start === '' || args.workTime.monday[0].end === '') &&
    (!args.workTime.tuesday || args.workTime.tuesday[0].start === '' || args.workTime.tuesday[0].end === '') &&
    (!args.workTime.wednesday || args.workTime.wednesday[0].start === '' || args.workTime.wednesday[0].end === '') &&
    (!args.workTime.thursday || args.workTime.thursday[0].start === '' || args.workTime.thursday[0].end === '') &&
    (!args.workTime.friday || args.workTime.friday[0].start === '' || args.workTime.friday[0].end === '') &&
    (!args.workTime.saturday || args.workTime.saturday[0].start === '' || args.workTime.saturday[0].end === '') &&
    (!args.workTime.sunday || args.workTime.sunday[0].start === '' || args.workTime.sunday[0].end === '')
  ) {
    ctx.addIssue({
      path: ['workTime'],
      code: z.ZodIssueCode.custom,
      message: `Informe seu horário de funcionamento.`,
    })
  }
})
export type CreateCompanySchema = z.infer<typeof createCompanySchema>;