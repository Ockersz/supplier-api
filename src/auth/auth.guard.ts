import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Console } from 'console';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const path = request.path;

    // Decide which token to extract based on route
    const token =
      path === '/auth/refresh'
        ? request.cookies['refresh_token']
        : request.cookies['access_token'];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
      request['token'] = token; // Store the token in the request object
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }
}
