import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: process.env.LOG_LEVEL,
      format: format.combine(
        format.timestamp(),
        format.simple(),
        format.colorize(),
        format.errors({ stack: true }),
      ),
      transports: [new transports.Console()],
    });
  }

  log(message: string, ...meta: any[]): any {
    this.logger.info(message, ...meta);
  }

  error(message: string, ...meta: any[]): any {
    this.logger.error(message, ...meta);
  }

  warn(message: string, ...meta: any[]): any {
    this.logger.warn(message, ...meta);
  }

  debug(message: string, ...meta: any[]): any {
    this.logger.debug(message, ...meta);
  }
}
