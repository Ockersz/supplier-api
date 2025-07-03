import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Custsup } from 'src/custsup/entities/custsup.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Custsup)
    private custsupRepository: Repository<Custsup>,
    private jwtService: JwtService,
  ) {}

  async createUser(
    id: number,
    username: string,
    password: string,
  ): Promise<Partial<Custsup>> {
    try {
      const updateUser = await this.custsupRepository.findOne({
        where: { id },
        select: ['id', 'username', 'password', 'name', 'email'],
      });

      if (!updateUser) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      const usernameExists = await this.custsupRepository.findOne({
        where: { username },
        select: ['id'],
      });

      if (usernameExists && usernameExists.id !== id) {
        throw new BadRequestException(`Username ${username} already exists`);
      }

      updateUser.username = username;
      updateUser.password = password;
      const adjustedCustomer = await this.custsupRepository.save(updateUser);
      return {
        id: adjustedCustomer.id,
        name: adjustedCustomer.name,
        username: adjustedCustomer.username,
        email: adjustedCustomer.email,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async loginUser(
    username: string,
    password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
      id: number;
      name: string;
      username: string;
      email: string;
    };
  }> {
    try {
      const user = await this.custsupRepository.findOne({
        where: { username },
        select: ['id', 'name', 'username', 'email', 'password'],
      });

      if (!user || !user.username || !user.password) {
        throw new ForbiddenException('Invalid Credentials');
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        throw new ForbiddenException('Invalid Credentials');
      }

      const payload = {
        sub: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
      };

      const accessToken = this.jwtService.sign(payload);

      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

      user.refreshToken = refreshToken;
      await this.custsupRepository.update(user.id, {
        refreshToken: user.refreshToken,
      });

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
        },
      };
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  }

  async refreshTokens(
    id: number,
    username: string,
    inRefreshToken: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
      id: number;
      name: string;
      username: string;
      email: string;
    };
  }> {
    try {
      const user = await this.custsupRepository.findOne({
        where: { id, username },
        select: ['id', 'name', 'username', 'email', 'refreshToken'],
      });

      if (!user || !user.refreshToken) {
        throw new ForbiddenException('Invalid Credentials');
      }

      if (user.refreshToken !== inRefreshToken) {
        throw new ForbiddenException('Invalid Refresh Token');
      }

      const payload = {
        sub: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
      };

      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

      user.refreshToken = refreshToken;
      await this.custsupRepository.update(user.id, {
        refreshToken: user.refreshToken,
      });

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
        },
      };
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      throw error;
    }
  }
}
