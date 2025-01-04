import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { z } from 'zod';

export const accountWithoutPasswordArgs =
  Prisma.validator<Prisma.AccountDefaultArgs>()({
    select: { id: true, name: true, email: true },
  });

export type AccountWithoutPassword = Prisma.AccountGetPayload<
  typeof accountWithoutPasswordArgs
>;

export const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$/;
const SALT_ROUNDS = 10;

export const accountCreatePropsSchema = z
  .object({
    name: z.string().min(5).max(191),
    email: z.string().email().max(191),
    password: z
      .string()
      .regex(passwordRegex)
      .transform((v) => bcrypt.hashSync(v, SALT_ROUNDS)),
  })
  .strict();

export type AccountCreateProps = z.infer<typeof accountCreatePropsSchema>;
