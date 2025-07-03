import { Controller, Get, Param } from '@nestjs/common';
import { CustsupService } from './custsup.service';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('custsup')
export class CustsupController {
  constructor(private readonly custsupService: CustsupService) {}

  @SkipThrottle()
  @Get()
  findAll() {
    return this.custsupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.custsupService.findOne(+id);
  }
}
