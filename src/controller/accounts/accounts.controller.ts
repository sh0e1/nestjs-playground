import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('accounts')
@Controller({ path: 'accounts', version: '1' })
export class AccountsController {}
