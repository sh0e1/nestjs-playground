import { Module } from '@nestjs/common';
import { AccountDomainModule } from 'src/domain/account/account.domain.module';

import { AccountService } from './account.service';

@Module({
  imports: [AccountDomainModule],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountServiceModule {}
