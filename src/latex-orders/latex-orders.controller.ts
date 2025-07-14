import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LatexOrdersService } from './latex-orders.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { Ltxinfor } from './ltxinfor.entity';

@Controller('latex-orders')
export class LatexOrdersController {
  constructor(private readonly latexOrdersService: LatexOrdersService) {}

  @UseGuards(AuthGuard)
  @Get()
  getLatexOrders(@Req() req: Request): Promise<
    Array<{
      custsupId: number;
      num: string;
      podate: Date;
      itemmasterId: number;
      itmdesc: string;
      qty: number;
      received_qty: number;
      diff: number;
    }>
  > {
    return this.latexOrdersService.getLatexOrders(req?.user['sub'] || 0);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('/save-sub-row')
  async saveSubRow(
    @Req() req: Request,
    @Body() body: Ltxinfor,
  ): Promise<{ message: string; ltxinfor: Ltxinfor }> {
    const ltxinforObj = await this.latexOrdersService.saveSubRow(
      req?.user['sub'] || 0,
      body,
    );
    return { message: 'Sub row saved successfully', ltxinfor: ltxinforObj };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('/save-batch-sub-rows')
  async saveBatchSubRow(
    @Req() req: Request,
    @Body() body: Ltxinfor[],
  ): Promise<{ message: string; ltxinfor: Ltxinfor[] }> {
    const ltxinforObjs = await Promise.all(
      body.map((item) =>
        this.latexOrdersService.saveSubRow(req?.user['sub'] || 0, item),
      ),
    );
    return {
      message: 'Batch sub rows saved successfully',
      ltxinfor: ltxinforObjs,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('/delete-sub-row')
  async deleteSubRow(
    @Req() req: Request,
    @Body() body: Ltxinfor,
  ): Promise<{ message: string }> {
    await this.latexOrdersService.deleteSubRow(req?.user['sub'] || 0, body);
    return { message: 'Sub row deleted successfully' };
  }
}
