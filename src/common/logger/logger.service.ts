import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Environment,
  isEnvDevelopment,
  isEnvTest,
} from 'src/config/configuration';
import * as winston from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor(
    private readonly configService: ConfigService<{ env: Environment }, true>,
  ) {
    let level = 'info';
    let format = winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
    );

    const env = this.configService.get('env', { infer: true });
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
      silent: isEnvTest(env),
    });
  }

  log(message: string, optionalParams?: object): void {
    this.logger.info(message, optionalParams);
  }

  error(message: string, stack?: string, optionalParams?: object): void {
    const params = stack ? { stack, ...optionalParams } : optionalParams;
    this.logger.error(message, params);
  }

  warn(message: string, optionalParams?: object): void {
    this.logger.warn(message, optionalParams);
  }

  debug(message: string, optionalParams?: object): void {
    this.logger.debug(message, optionalParams);
  }
}
