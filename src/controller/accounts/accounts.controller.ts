import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AccountWithoutPassword } from 'src/domain/account/account.type';
import { AccountService } from 'src/service/account/account.service';

import { CreateAccountRequest, CreateAccountResponse } from './accounts.dto';

@ApiTags('accounts')
@Controller({ path: 'accounts', version: '1' })
export class AccountsController {
  constructor(private readonly account: AccountService) {}

  @Post()
  @ApiCreatedResponse({ type: CreateAccountResponse })
  async create(
    @Body() req: CreateAccountRequest,
  ): Promise<CreateAccountResponse> {
    return this.account.create(req).match(
      (account: AccountWithoutPassword) => ({
        id: account.id,
        name: account.name,
        email: account.email,
      }),
      (e) => {
        throw e;
      },
    );
  }
}
