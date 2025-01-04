import { Module } from '@nestjs/common';
import { AccountServiceModule } from 'src/service/account/account.service.module';

import { AccountsController } from './accounts.controller';

@Module({
  imports: [AccountServiceModule],
  controllers: [AccountsController],
})
export class AccountsModule {}
