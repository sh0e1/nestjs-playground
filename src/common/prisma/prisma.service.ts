import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit
{
  constructor(private readonly logger: LoggerService) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
    });
  }

  async onModuleInit() {
    const meta = { type: 'database' };

    this.$on('query', (event) => {
      this.logger.debug(event.query, {
        params: event.params,
        duration: `${event.duration} ms`,
        ...meta,
      });
    });

    this.$on('info', (event) => {
      this.logger.log(event.message, meta);
    });

    this.$on('warn', (event) => {
      this.logger.warn(event.message, meta);
    });

    this.$on('error', (event) => {
      this.logger.error(event.message, meta);
    });

    await this.$connect();
  }
}
