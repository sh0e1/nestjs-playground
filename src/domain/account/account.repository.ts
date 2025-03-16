import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResultAsync } from 'neverthrow';
import { PrismaService } from 'src/common/prisma/prisma.service';

import { RepositoryError } from '../repository.error';
import { AccountCreateProps } from './account.domain';
import {
  AccountWithoutPassword,
  accountWithoutPasswordArgs,
} from './account.type';

@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUnique(
    where: Prisma.AccountWhereUniqueInput,
  ): ResultAsync<AccountWithoutPassword | null, RepositoryError> {
    return ResultAsync.fromPromise(
      this.prisma.account.findUnique({
        ...accountWithoutPasswordArgs,
        where,
      }),
      (e: unknown) => {
        return new RepositoryError('failed to find unique for account', {
          cause: e,
        });
      },
    );
  }

  create(
    props: AccountCreateProps,
  ): ResultAsync<AccountWithoutPassword, RepositoryError> {
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
        data: accountCreateInput(props),
      }),
      (e: unknown) => {
        return new RepositoryError('failed to create account', {
          cause: e,
        });
      },
    );
  }
}
