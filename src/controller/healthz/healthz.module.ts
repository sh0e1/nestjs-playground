import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from 'src/common/prisma/prisma.module';

import { HealthzController } from './healthz.controller';

@Module({
  imports: [TerminusModule, PrismaModule],
  controllers: [HealthzController],
})
export class HealthzModule {}
