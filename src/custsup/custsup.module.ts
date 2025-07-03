import { Module } from '@nestjs/common';
import { CustsupService } from './custsup.service';
import { CustsupController } from './custsup.controller';
import { Custsup } from './entities/custsup.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Custsup])],
  controllers: [CustsupController],
  providers: [CustsupService],
  exports: [TypeOrmModule],
})
export class CustsupModule {}
