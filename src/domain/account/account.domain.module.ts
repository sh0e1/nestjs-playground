import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';

import { AccountRepository } from './account.repository';

@Module({
  imports: [PrismaModule],
  providers: [AccountRepository],
  exports: [AccountRepository],
})
export class AccountDomainModule {}
