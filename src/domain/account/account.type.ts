import { Prisma } from '@prisma/client';

export const accountWithoutPasswordArgs =
  Prisma.validator<Prisma.AccountDefaultArgs>()({
    select: { id: true, name: true, email: true },
  });

export type AccountWithoutPassword = Prisma.AccountGetPayload<
  typeof accountWithoutPasswordArgs
>;
