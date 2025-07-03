import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    if (!body.id || !body.username || !body.password) {
      throw new BadRequestException(
        'Missing required fields: id, username, or password',
      );
    }
    return this.authService.createUser(body.id, body.username, body.password);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!body.username || !body.password) {
      throw new BadRequestException(
        'Missing required fields: username or password',
      );
    }
    const authData = await this.authService.loginUser(
      body.username,
      body.password,
    );

    // Set cookies
    res.cookie('access_token', authData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + 60 * 60 * 1000),
    });

    res.cookie('refresh_token', authData.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.status(HttpStatus.OK);
    return {
      user: {
        id: authData.user.id,
        name: authData.user.name,
        username: authData.user.username,
        email: authData.user.email,
      },
      message: 'Login successful',
    };
  }

  @UseGuards(AuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    if (!req?.user) {
      throw new BadRequestException('No user found in request');
    }

    const { id, username } = req.user;

    const authData = await this.authService.refreshTokens(
      id,
      username,
      req?.cookies['refresh_token'],
    );

    res.cookie('access_token', authData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    res.cookie('refresh_token', authData.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    res.status(HttpStatus.OK);

    return {
      user: {
        id: authData.user.id,
        name: authData.user.name,
        username: authData.user.username,
        email: authData.user.email,
      },
      message: 'Token refreshed successfully',
    };
  }
}
