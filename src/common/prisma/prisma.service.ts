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
    const params = { type: 'database' };

    this.$on('query', (event) => {
      this.logger.debug(event.query, {
        params: event.params,
        duration: `${event.duration} ms`,
        ...params,
      });
    });

    this.$on('info', (event) => {
      this.logger.log(event.message, params);
    });

    this.$on('warn', (event) => {
      this.logger.warn(event.message, params);
    });

    this.$on('error', (event) => {
      const e = new Error(event.message);
      this.logger.error(e.message, e.stack, params);
    });

    await this.$connect();
  }

  // See https://www.prisma.io/docs/orm/reference/error-reference#error-codes
  static readonly PRISMA_ERROR_CODES = {
    NOT_FOUND: 'P2025',
  };

  static isNotFoundError(e: unknown): boolean {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return e.code === PrismaService.PRISMA_ERROR_CODES.NOT_FOUND;
    }
    return false;
  }
}
