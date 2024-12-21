import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, headers } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    // Log incoming req
    this.logger.log(
      `Incoming ${method} ${originalUrl} - User Agent: ${userAgent}`,
    );

    // Track res
    const oldSend = res.send;
    res.send = function (data) {
      res.send = oldSend;
      res.locals.body = data;
      return res.send(data);
    };

    // Log outgoing res
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const logLevel = statusCode >= 400 ? 'error' : 'log';

      this.logger[logLevel]({
        requestDetails: {
          method,
          originalUrl,
          headers,
          body,
        },
        responseDetails: {
          statusCode,
          contentLength,
          responseTimeMs: responseTime,
          body: res.locals.body,
        },
      });
    });

    // Handle errors
    res.on('error', (error) => {
      this.logger.error({
        message: 'Response error',
        error: error.message,
        stack: error.stack,
        requestDetails: {
          method,
          originalUrl,
          headers,
          body,
        },
      });
    });

    next();
  }
}
