import { HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  private readonly logger = new Logger(JwtMiddleware.name);

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'JWT is missing' });
    }

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7); // Remove "Bearer " prefix
      try {
        const decoded = jwt.verify(token, 'your_jwt_secret_key'); // Replace with your JWT secret key
        req['user'] = decoded; // 將解碼後的使用者資料放入請求中的 user 屬性
      } catch (error) {
        // JWT 驗證失敗，或者過期
        this.logger.error('JWT verification error:', error.message);
      }
    }

    next();
  }
}
