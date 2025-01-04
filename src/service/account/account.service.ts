import { Injectable } from '@nestjs/common';
import { err, errAsync, ok, okAsync, ResultAsync } from 'neverthrow';
import { AccountRepository } from 'src/domain/account/account.repository';
import {
  AccountCreateProps,
  accountCreatePropsSchema,
  AccountWithoutPassword,
} from 'src/domain/account/account.type';
import { ZodError } from 'zod';

import { ServiceError } from '../service.error';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  create(params: {
    name: string;
    email: string;
    password: string;
  }): ResultAsync<AccountWithoutPassword, ServiceError> {
    const validate = (
      props: AccountCreateProps,
    ): ResultAsync<AccountCreateProps, ZodError> => {
      const result = accountCreatePropsSchema.safeParse(props);
      return result.success ? okAsync(result.data) : errAsync(result.error);
    };

    const checkIfEmailExists = (email: string): ResultAsync<null, Error> => {
      return this.accountRepository
        .findUnique({ email })
        .andThen((account: AccountWithoutPassword) =>
          account
            ? err(ServiceError.AlreadyExists('email already exists'))
            : ok(null),
        );
    };

    return ResultAsync.combine([
      validate(params),
      checkIfEmailExists(params.email),
    ])
      .andThen(([props, _]: [AccountCreateProps, null]) =>
        this.accountRepository.create(props),
      )
      .mapErr(
        (e: Error): ServiceError =>
          new ServiceError('failed to create account', { cause: e }),
      );
  }
}
