import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CustsupModule } from 'src/custsup/custsup.module';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    CustsupModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'defaultSecretKey',
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
