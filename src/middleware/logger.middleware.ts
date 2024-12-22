import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { stringify } from 'qs';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private loggerService: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = process.hrtime();

    res.on('finish', () => {
      const endTime = process.hrtime(startTime);
      const timeMs = endTime[0] * 1e3 + endTime[1] * 1e-6;

      this.loggerService.log(
        `"${req.method} ${req.originalUrl}" finished with code ${res.statusCode}`,
        {
          type: 'access',
          'http.protocol': `${req.protocol}/${req.httpVersion}`,
          'http.method': req.method,
          'http.path': req.baseUrl + req.path,
          'http.query': stringify(req.query),
          'access.client_ip': req.ips[0] || req.ip,
          'access.user_agent': req.get('user-agent'),
          'http.code': res.statusCode,
          'http.size': res.get('content-length'),
          'http.time_ms': timeMs.toFixed(3),
        },
      );
    });

    next();
  }
}
