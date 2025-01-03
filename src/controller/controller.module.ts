import { Module } from '@nestjs/common';

import { AccountsModule } from './accounts/accounts.module';
import { HealthzModule } from './healthz/healthz.module';

@Module({
  imports: [AccountsModule, HealthzModule],
})
export class ControllerModule {}
