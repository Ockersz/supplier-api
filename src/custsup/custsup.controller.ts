import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { CustsupService } from './custsup.service';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@UseGuards(AuthGuard)
@SkipThrottle()
@Controller('custsup')
export class CustsupController {
  constructor(private readonly custsupService: CustsupService) {}

  @Get()
  findAll() {
    return this.custsupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.custsupService.findOne(+id, req?.user['sub'] || 0);
  }
}
