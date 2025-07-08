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
import { MailService } from 'src/mail/mail.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Custsup)
    private custsupRepository: Repository<Custsup>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  generateSecurePassword(length = 10): string {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!';
    const bytes = crypto.randomBytes(length);
    return Array.from(bytes)
      .map((b) => charset[b % charset.length])
      .join('');
  }

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
    email: string,
  ): Promise<{
    id: number;
    name: string;
    username: string;
    email: string;
    access_token: string;
    refresh_token: string;
  }> {
    const user = await this.custsupRepository.findOne({
      where: { id, username },
      select: ['id', 'username', 'password', 'name', 'email'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Track whether updates are made
    let updated = false;

    if (newPassword) {
      const isOldPasswordValid = bcrypt.compareSync(oldPassword, user.password);
      if (!isOldPasswordValid) {
        throw new ForbiddenException('Invalid old password');
      }

      user.password = newPassword;
      user.firstLogin = 'N';
      updated = true;
    }

    if (email && email !== user.email) {
      user.email = email;
      updated = true;
    }

    if (!updated) {
      throw new BadRequestException(
        'Nothing to update: Provide new password or email.',
      );
    }

    const updatedUser = await this.custsupRepository.save(user);

    const tokenPayload = {
      sub: updatedUser.id,
      username: updatedUser.username,
      name: updatedUser.name,
      email: updatedUser.email,
    };

    const access_token = this.jwtService.sign(tokenPayload);
    const refresh_token = this.jwtService.sign(tokenPayload, {
      expiresIn: '7d',
    });

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      access_token,
      refresh_token,
    };
  }

  async passwordReset(identifier: string): Promise<{ email: string }> {
    const user = await this.custsupRepository.findOne({
      where: [{ email: identifier }, { username: identifier }],
      select: ['email', 'id', 'password', 'username', 'name', 'firstLogin'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const randomPassword = this.generateSecurePassword(6);

    user.password = randomPassword;
    user.firstLogin = 'Y';
    await this.custsupRepository.save(user);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; font-size: 16px; line-height: 1.6;">
        <p>Hi <strong>${user.name}</strong>,</p>

        <p>We've successfully reset the password for your account <strong>${user.username}</strong>.</p>

        <p>
          Please use the following temporary password to log in:
        </p>

        <p style="font-size: 18px; font-weight: bold; color: #2c3e50;">
          ${randomPassword}
        </p>

        <p>
          For your security, we strongly recommend that you change this password immediately after logging in.
        </p>

        <p>If you did not request this password reset, please contact our support team as soon as possible.</p>

        <p>Best regards,</p>
        <p><strong>Earthfoam Support Team</strong></p>
        <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />
        <small style="color: #777;">This is an automated message. Please do not reply directly to this email.</small>
      </div>
    `;

    await this.mailService.sendEmail(
      user.email,
      'Earthfoam Password Reset',
      htmlContent,
    );

    const hiddenEmail = user.email.replace(/(.{2})(.*)(?=@)/, '$1***');

    return { email: hiddenEmail };
  }
}
