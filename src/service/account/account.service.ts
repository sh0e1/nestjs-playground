import { Injectable } from '@nestjs/common';
import { err, ok, ResultAsync } from 'neverthrow';
import { Account, AccountCreateProps } from 'src/domain/account/account.domain';
import { AccountRepository } from 'src/domain/account/account.repository';
import { AccountWithoutPassword } from 'src/domain/account/account.type';

import { ServiceError } from '../service.error';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  create(params: {
    name: string;
    email: string;
    password: string;
  }): ResultAsync<AccountWithoutPassword, ServiceError> {
    const checkIfEmailExists = (
      props: AccountCreateProps,
    ): ResultAsync<AccountCreateProps, Error> => {
      return this.accountRepository
        .findUnique({ email: props.email })
        .andThen((other: AccountWithoutPassword) =>
          other
            ? err(ServiceError.AlreadyExists('email already exists'))
            : ok(props),
        );
    };

    return Account.validate(params)
      .asyncAndThen(checkIfEmailExists)
      .andThen((props) => this.accountRepository.create(props))
      .mapErr(
        (e: Error): ServiceError =>
          new ServiceError('failed to create account', { cause: e }),
      );
  }
}
