import { Module } from '@nestjs/common';
import { LatexOrdersService } from './latex-orders.service';
import { LatexOrdersController } from './latex-orders.controller';
import { Ltxinfor } from './ltxinfor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Ltxinfor])],
  controllers: [LatexOrdersController],
  providers: [LatexOrdersService],
})
export class LatexOrdersModule {}
