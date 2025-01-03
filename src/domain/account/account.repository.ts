import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResultAsync } from 'neverthrow';
import { PrismaService } from 'src/common/prisma/prisma.service';

import {
  AccountCreateProps,
  AccountWithoutPassword,
  accountWithoutPasswordArgs,
} from './account.type';

@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUnique(
    where: Prisma.AccountWhereUniqueInput,
  ): ResultAsync<AccountWithoutPassword, Error> {
    return ResultAsync.fromPromise(
      this.prisma.account.findUnique({
        ...accountWithoutPasswordArgs,
        where,
      }),
      (e) => {
        throw e;
      },
    );
  }

  create(data: AccountCreateProps): ResultAsync<AccountWithoutPassword, Error> {
    const accountCreateInput = (props: AccountCreateProps) => {
      return Prisma.validator<Prisma.AccountCreateInput>()({
        name: props.name,
        email: props.email,
        password: props.password,
      });
    };

    return ResultAsync.fromPromise(
      this.prisma.account.create({
        ...accountWithoutPasswordArgs,
        data: accountCreateInput(data),
      }),
      (e) => {
        throw e;
      },
    );
  }
}
