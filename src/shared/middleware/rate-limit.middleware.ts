import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RateLimitMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    // Interceptar la respuesta para verificar si se excedió el límite
    const originalSend = res.send;
    res.send = function (body) {
      if (res.statusCode === 429) {
        this.logger.warn(
          `Rate limit exceeded - IP: ${req.ip}, Path: ${req.path}, Method: ${req.method}, Headers: ${JSON.stringify(req.headers)}`,
        );
      }
      return originalSend.call(this, body);
    };
    next();
  }
} 