import { Module } from '@nestjs/common';
import { AccountModule } from 'src/service/account/account.module';

import { AccountsController } from './accounts.controller';

@Module({
  imports: [AccountModule],
  controllers: [AccountsController],
})
export class AccountsModule {}
