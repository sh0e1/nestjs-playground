import { Injectable } from '@nestjs/common';
import { err, errAsync, ok, okAsync, ResultAsync } from 'neverthrow';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  accountCreateInput,
  AccountCreateProps,
  accountCreatePropsSchema,
  AccountWithoutPassword,
  accountWithoutPasswordArgs,
} from 'src/domain/account/account.type';
import { ZodError } from 'zod';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  create(params: {
    name: string;
    email: string;
    password: string;
  }): ResultAsync<AccountWithoutPassword, Error> {
    const validate = (
      props: AccountCreateProps,
    ): ResultAsync<AccountCreateProps, ZodError> => {
      const result = accountCreatePropsSchema.safeParse(props);
      return result.success ? okAsync(result.data) : errAsync(result.error);
    };

    const checkIfEmailExists = (
      email: string,
    ): ResultAsync<AccountWithoutPassword, Error> => {
      return ResultAsync.fromPromise(
        this.prisma.account.findUnique({
          ...accountWithoutPasswordArgs,
          where: { email },
        }),
        (e) => {
          throw e;
        },
      ).andThen((account) => {
        return account ? err(new Error('email already exists')) : ok(account);
      });
    };

    return ResultAsync.combine([
      validate(params),
      checkIfEmailExists(params.email),
    ]).andThen(([props, _]: [AccountCreateProps, AccountWithoutPassword]) => {
      return ResultAsync.fromPromise(
        this.prisma.account.create({
          ...accountWithoutPasswordArgs,
          data: accountCreateInput(props),
        }),
        (e) => {
          throw e;
        },
      );
    });
  }
}
