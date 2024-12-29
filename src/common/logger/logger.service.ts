import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment, isEnvDevelopment } from 'src/config/configuration';
import * as winston from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor(private readonly configService: ConfigService) {
    let level = 'info';
    let format = winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
    );

    const env = this.configService.get<Environment>('env');
    if (isEnvDevelopment(env)) {
      level = 'debug';
      format = winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.simple(),
      );
    }

    this.logger = winston.createLogger({
      level,
      format,
      transports: [new winston.transports.Console()],
    });
  }

  log(message: string, ...optionalParams: any[]): void {
    this.logger.info(message, ...optionalParams);
  }

  error(message: string, stack: string, ...optionalParams: any[]): void {
    this.logger.error(message, { stack_trace: stack, ...optionalParams });
  }

  warn(message: string, ...optionalParams: any[]): void {
    this.logger.warn(message, ...optionalParams);
  }

  debug(message: string, ...optionalParams: any[]): void {
    this.logger.debug(message, ...optionalParams);
  }
}
