import * as bcrypt from 'bcryptjs';
import { err, ok, Result } from 'neverthrow';
import { z, ZodError } from 'zod';

const validate = (input: AccountInput): Result<Account, ZodError> => {
  const result = accountSchema.safeParse(input);
  return result.success ? ok(result.data) : err(result.error);
};

export const Account = {
  validate,
};

export const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$/;
const SALT_ROUNDS = 10;

const accountSchema = z
  .object({
    name: z.string().min(5).max(191),
    email: z.string().email().max(191),
    password: z
      .string()
      .regex(passwordRegex)
      .transform((v) => bcrypt.hashSync(v, SALT_ROUNDS)),
  })
  .strict();

export type Account = z.infer<typeof accountSchema>;
export type AccountInput = z.input<typeof accountSchema>;
