import { ExpressRequest } from '@/types/expressRequest.interface';
import { UserToken } from '@/user/types/userToken.type';
import { UserService } from '@/user/user.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequest, _res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      return next();
    }

    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = verify(token, process.env.JWT_SECRET) as UserToken;
      const user = await this.userService.findById(decoded.id);
      req.user = user;
      return next();
    } catch (error) {
      req.user = null;
      return next();
    }
  }
}
