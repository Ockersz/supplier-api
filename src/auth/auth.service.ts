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
      firstLogin: string;
    };
  }> {
    try {
      const user = await this.custsupRepository.findOne({
        where: { username },
        select: ['id', 'name', 'username', 'email', 'password', 'firstLogin'],
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
          firstLogin: user.firstLogin,
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

  async logoutUser(
    id: number,
    username: string,
    inRefreshToken: string,
  ): Promise<void> {
    try {
      const user = await this.custsupRepository.findOne({
        where: { id, username },
        select: ['id', 'refreshToken'],
      });

      if (!user || !user.refreshToken) {
        throw new ForbiddenException('Invalid Credentials');
      }

      if (user.refreshToken !== inRefreshToken) {
        throw new ForbiddenException('Invalid Refresh Token');
      }

      user.refreshToken = '';
      await this.custsupRepository.update(user.id, {
        refreshToken: user.refreshToken,
      });
    } catch (error) {
      console.error('Error logging out user:', error);
      throw error;
    }
  }

  async changePassword(
    id: number,
    username: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<{
    id: number;
    name: string;
    username: string;
    email: string;
    access_token: string;
    refresh_token: string;
  }> {
    try {
      const user = await this.custsupRepository.findOne({
        where: { id, username },
        select: ['id', 'username', 'password', 'name', 'email'],
      });

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      const isOldPasswordValid = bcrypt.compareSync(oldPassword, user.password);

      if (!isOldPasswordValid) {
        throw new ForbiddenException('Invalid old password');
      }

      user.password = newPassword;
      user.firstLogin = 'N';

      const updatedUser = await this.custsupRepository.save(user);

      const access_token = this.jwtService.sign({
        sub: updatedUser.id,
        username: updatedUser.username,
        name: updatedUser.name,
        email: updatedUser.email,
      });

      const refresh_token = this.jwtService.sign(
        {
          sub: updatedUser.id,
          username: updatedUser.username,
          name: updatedUser.name,
          email: updatedUser.email,
        },
        { expiresIn: '7d' },
      );

      return {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        access_token,
        refresh_token,
      };
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
}
